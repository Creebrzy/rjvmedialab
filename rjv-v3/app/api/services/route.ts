export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const services = await sql`SELECT * FROM services WHERE is_active = true ORDER BY category, name`;
    return NextResponse.json(services);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
