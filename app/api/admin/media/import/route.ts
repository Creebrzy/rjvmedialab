import { getDb } from '@/lib/db';
export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';


function getDb() { return getDb(); }

async function isAdmin(userId: string) {
  const sql = getDb();
  const rows = await sql`SELECT role FROM profiles WHERE id = ${userId}`;
  return rows[0]?.role === 'admin';
}

function extractFolderId(url: string): string | null {
  const patterns = [
    /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/drive\/u\/\d+\/folders\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function processFile(file: any): { direct_url: string; thumbnail_url: string | null; media_type: string } {
  const isVideo = file.mimeType?.startsWith('video/');
  const id = file.id;
  if (isVideo) {
    return {
      media_type: 'video',
      direct_url: `https://drive.google.com/file/d/${id}/preview`,
      thumbnail_url: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${id}&sz=w640`,
    };
  }
  return {
    media_type: 'image',
    direct_url: `https://drive.google.com/uc?export=view&id=${id}`,
    thumbnail_url: file.thumbnailLink || null,
  };
}

// GET — preview folder contents before importing
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const folderUrl = searchParams.get('folder');
    if (!folderUrl) return NextResponse.json({ error: 'No folder URL provided' }, { status: 400 });

    const folderId = extractFolderId(folderUrl);
    if (!folderId) return NextResponse.json({ error: 'Could not extract folder ID from URL' }, { status: 400 });

    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'GOOGLE_DRIVE_API_KEY not configured' }, { status: 500 });

    const fields = 'files(id,name,mimeType,thumbnailLink,size,createdTime)';
    const query = `'${folderId}' in parents and trashed=false`;
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&key=${apiKey}&pageSize=100`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.message || 'Google Drive API error' }, { status: res.status });
    }

    const data = await res.json();
    const files = (data.files || [])
      .filter((f: any) => f.mimeType?.startsWith('image/') || f.mimeType?.startsWith('video/'))
      .map((f: any) => ({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        media_type: f.mimeType?.startsWith('video/') ? 'video' : 'image',
        thumbnail_url: f.thumbnailLink || null,
        direct_url: f.mimeType?.startsWith('video/')
          ? `https://drive.google.com/file/d/${f.id}/preview`
          : `https://drive.google.com/uc?export=view&id=${f.id}`,
      }));

    return NextResponse.json({ files, total: files.length, folderId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

// POST — import selected files into media table
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { files, section, prefix_title } = body;

    if (!files?.length) return NextResponse.json({ error: 'No files provided' }, { status: 400 });

    const sql = getDb();
    let imported = 0;
    let skipped = 0;

    for (const file of files) {
      try {
        const source_url = `https://drive.google.com/file/d/${file.id}/view`;
        const title = prefix_title
          ? `${prefix_title} — ${file.name.replace(/\.[^/.]+$/, '')}`
          : file.name.replace(/\.[^/.]+$/, '');

        await sql`
          INSERT INTO media (title, section, media_type, source_url, direct_url, thumbnail_url, alt_text, sort_order)
          VALUES (${title}, ${section}, ${file.media_type}, ${source_url}, ${file.direct_url}, ${file.thumbnail_url || null}, ${title}, 0)
        `;
        imported++;
      } catch {
        skipped++;
      }
    }

    return NextResponse.json({ imported, skipped, total: files.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
