import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

async function isAdmin(userId: string) {
  const sql = getDb();
  const [p] = await sql`SELECT role FROM profiles WHERE id = ${userId}`;
  return p?.role === 'admin';
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const sql = getDb();
    const bookings = await sql`
      SELECT b.*,
        json_build_object('id', s.id, 'name', s.name, 'category', s.category) as service,
        json_build_object('id', p.id, 'full_name', p.full_name, 'email', p.email) as customer
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN profiles p ON b.customer_id = p.id
      ORDER BY b.date DESC
    `;
    return NextResponse.json(bookings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id, status } = await req.json();
    const sql = getDb();
    const [booking] = await sql`
      UPDATE bookings SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `;
    return NextResponse.json(booking);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
