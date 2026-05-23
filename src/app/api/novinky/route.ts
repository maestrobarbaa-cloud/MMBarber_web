export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const stmt = db.prepare('SELECT * FROM barber_novinky ORDER BY createdAt DESC');
    const rows = stmt.all();
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = Date.now();

    const stmt = db.prepare(`
      INSERT INTO barber_novinky 
      (id, status, createdAt, nickname, category, message) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.status || 'new',
      now,
      body.nickname,
      body.category,
      body.message
    );

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const stmt = db.prepare(`UPDATE barber_novinky SET status = ? WHERE id = ?`);
    stmt.run(status, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true') {
      db.prepare(`DELETE FROM barber_novinky`).run();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.prepare(`DELETE FROM barber_novinky WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
