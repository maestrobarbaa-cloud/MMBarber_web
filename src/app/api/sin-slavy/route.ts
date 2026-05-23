export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');

    let query = 'SELECT * FROM hall_of_fame ORDER BY dateJoined DESC';
    if (activeOnly === 'true') {
      query = 'SELECT * FROM hall_of_fame WHERE active = 1 ORDER BY dateJoined DESC';
    }

    const rows = db.prepare(query).all();
    
    const data = rows.map((r: any) => ({
      ...r,
      active: Boolean(r.active),
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();

    const stmt = db.prepare(`
      INSERT INTO hall_of_fame 
      (id, name, tier, message, dateJoined, avatarId, active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.name,
      body.tier,
      body.message || '',
      body.dateJoined?.seconds ? body.dateJoined.seconds * 1000 : Date.now(),
      body.avatarId || 1,
      body.active !== undefined ? (body.active ? 1 : 0) : 1
    );

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id || active === undefined) {
      return NextResponse.json({ error: 'Missing id or active state' }, { status: 400 });
    }

    db.prepare(`UPDATE hall_of_fame SET active = ? WHERE id = ?`).run(active ? 1 : 0, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.prepare(`DELETE FROM hall_of_fame WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
