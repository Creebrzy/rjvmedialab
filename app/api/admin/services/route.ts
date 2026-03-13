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
    const services = await sql`SELECT * FROM services ORDER BY category, name`;
    return NextResponse.json(services);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const sql = getDb();
    const [service] = await sql`
      INSERT INTO services (name, description, category, price_type, price, duration_hours, is_active)
      VALUES (${body.name}, ${body.description}, ${body.category}, ${body.price_type}, ${body.price}, ${body.duration_hours || null}, ${body.is_active ?? true})
      RETURNING *
    `;
    return NextResponse.json(service);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const sql = getDb();
    const [service] = await sql`
      UPDATE services SET
        name = ${body.name},
        description = ${body.description},
        category = ${body.category},
        price_type = ${body.price_type},
        price = ${body.price},
        duration_hours = ${body.duration_hours || null},
        is_active = ${body.is_active}
      WHERE id = ${body.id} RETURNING *
    `;
    return NextResponse.json(service);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
