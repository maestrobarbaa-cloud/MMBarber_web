export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM seznamka_requests ORDER BY createdAt DESC';
    let params: any[] = [];

    if (status) {
      query = 'SELECT * FROM seznamka_requests WHERE status = ? ORDER BY createdAt DESC';
      params.push(status);
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const data = rows.map((r: any) => ({
      ...r,
      characters: r.characters ? JSON.parse(r.characters) : [],
      ageRange: [r.ageMin, r.ageMax],
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
    const now = Date.now();

    const stmt = db.prepare(`
      INSERT INTO seznamka_requests 
      (id, status, createdAt, name, age, email, phone, idealMan, characters, ageMin, ageMax, dealbreaker) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.status || 'new',
      now,
      body.name,
      body.age,
      body.email,
      body.phone || '',
      body.idealMan,
      JSON.stringify(body.characters || []),
      body.ageRange?.[0] || 18,
      body.ageRange?.[1] || 99,
      body.dealbreaker || ''
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

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const stmt = db.prepare(`UPDATE seznamka_requests SET status = ? WHERE id = ?`);
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
      db.prepare(`DELETE FROM seznamka_requests`).run();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.prepare(`DELETE FROM seznamka_requests WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
