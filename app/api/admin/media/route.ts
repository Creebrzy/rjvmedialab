import { getDb } from '@/lib/db';
export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';


function getDb() { return getDb(); }

function processUrl(url: string): { direct_url: string; thumbnail_url: string | null; media_type: string } {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      media_type: 'video',
      direct_url: `https://www.youtube.com/embed/${id}`,
      thumbnail_url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }
  // Google Drive video
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const id = driveMatch[1];
    // Check if it's a video by extension hint or treat as image by default
    const isVideo = url.includes('video') || url.includes('.mp4') || url.includes('.mov');
    return {
      media_type: isVideo ? 'video' : 'image',
      direct_url: isVideo
        ? `https://drive.google.com/file/d/${id}/preview`
        : `https://drive.google.com/uc?export=view&id=${id}`,
      thumbnail_url: isVideo ? `https://drive.google.com/thumbnail?id=${id}` : null,
    };
  }
  // Google Drive open link
  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    const id = driveOpenMatch[1];
    return { media_type: 'image', direct_url: `https://drive.google.com/uc?export=view&id=${id}`, thumbnail_url: null };
  }
  // Direct video file
  if (url.match(/\.(mp4|webm|mov|avi)(\?|$)/i)) {
    return { media_type: 'video', direct_url: url, thumbnail_url: null };
  }
  // Default: image
  return { media_type: 'image', direct_url: url, thumbnail_url: null };
}

async function isAdmin(userId: string) {
  const sql = getDb();
  const rows = await sql`SELECT role FROM profiles WHERE id = ${userId}`;
  return rows[0]?.role === 'admin';
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const sql = getDb();
    const media = await sql`SELECT * FROM media ORDER BY section, sort_order, created_at DESC`;
    return NextResponse.json(media);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const { title, section, source_url, alt_text, sort_order, force_type } = body;
    const processed = processUrl(source_url);
    const media_type = force_type || processed.media_type;
    const sql = getDb();
    const rows = await sql`
      INSERT INTO media (title, section, media_type, source_url, direct_url, thumbnail_url, alt_text, sort_order)
      VALUES (${title}, ${section}, ${media_type}, ${source_url}, ${processed.direct_url}, ${processed.thumbnail_url}, ${alt_text || ''}, ${sort_order || 0})
      RETURNING *`;
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const { id, is_active, sort_order, title, alt_text, source_url, force_type } = body;
    const sql = getDb();
    if (source_url) {
      const processed = processUrl(source_url);
      const media_type = force_type || processed.media_type;
      await sql`UPDATE media SET source_url=${source_url}, direct_url=${processed.direct_url}, thumbnail_url=${processed.thumbnail_url}, media_type=${media_type}, title=${title}, alt_text=${alt_text}, sort_order=${sort_order || 0}, is_active=${is_active} WHERE id=${id}`;
    } else {
      await sql`UPDATE media SET is_active=${is_active}, sort_order=${sort_order ?? 0} WHERE id=${id}`;
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await req.json();
    const sql = getDb();
    await sql`DELETE FROM media WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
