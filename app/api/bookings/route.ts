export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const sql = getDb();
    const bookings = await sql`
      SELECT b.*, 
        json_build_object('id', s.id, 'name', s.name, 'category', s.category) as service
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.customer_id = ${userId}
      ORDER BY b.date DESC
    `;
    return NextResponse.json(bookings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { service_id, date, start_time, end_time, total_price, notes } = body;
    const sql = getDb();

    // Ensure profile exists
    await sql`
      INSERT INTO profiles (id, email, full_name)
      VALUES (${userId}, ${body.email || ''}, ${body.full_name || ''})
      ON CONFLICT (id) DO NOTHING
    `;

    const [booking] = await sql`
      INSERT INTO bookings (customer_id, service_id, date, start_time, end_time, total_price, notes)
      VALUES (${userId}, ${service_id}, ${date}, ${start_time}, ${end_time}, ${total_price}, ${notes || null})
      RETURNING *
    `;
    return NextResponse.json(booking);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
