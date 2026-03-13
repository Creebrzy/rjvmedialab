export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const type = searchParams.get('type');
    const sql = neon(process.env.DATABASE_URL!);
    let media;
    if (section && type) {
      media = await sql`SELECT * FROM media WHERE is_active = true AND section = ${section} AND media_type = ${type} ORDER BY sort_order, created_at DESC`;
    } else if (section) {
      media = await sql`SELECT * FROM media WHERE is_active = true AND section = ${section} ORDER BY sort_order, created_at DESC`;
    } else if (type) {
      media = await sql`SELECT * FROM media WHERE is_active = true AND media_type = ${type} ORDER BY sort_order, created_at DESC`;
    } else {
      media = await sql`SELECT * FROM media WHERE is_active = true ORDER BY section, sort_order, created_at DESC`;
    }
    return NextResponse.json(media);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
