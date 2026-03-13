import { NextResponse } from 'next/server';
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
    const customers = await sql`
      SELECT p.*,
        COALESCE(
          json_agg(
            json_build_object('id', b.id, 'date', b.date, 'status', b.status, 'total_price', b.total_price,
              'service', json_build_object('name', s.name))
          ) FILTER (WHERE b.id IS NOT NULL), '[]'
        ) as bookings
      FROM profiles p
      LEFT JOIN bookings b ON p.id = b.customer_id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE p.role = 'customer'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json(customers);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
