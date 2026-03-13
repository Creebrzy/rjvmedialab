import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { status } = await req.json();
    const sql = getDb();
    const [booking] = await sql`
      UPDATE bookings SET status = ${status}, updated_at = NOW()
      WHERE id = ${params.id} AND customer_id = ${userId}
      RETURNING *
    `;
    return NextResponse.json(booking);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
