import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const stmt = db.prepare('SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 100');
    const rows = stmt.all();
    const data = rows.map((r: any) => ({
      ...r,
      likes: r.likes ? JSON.parse(r.likes) : [],
      verifiedUser: Boolean(r.verifiedUser),
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
      INSERT INTO chat_messages 
      (id, text, user, userId, timestamp, likes, verifiedUser) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.text,
      body.user,
      body.userId,
      now,
      JSON.stringify([]),
      body.verifiedUser ? 1 : 0
    );

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, action } = body;

    if (!id || !userId || action !== 'toggleLike') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const row = db.prepare(`SELECT likes FROM chat_messages WHERE id = ?`).get(id) as any;
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const likes = row.likes ? JSON.parse(row.likes) : [];
    const hasLiked = likes.includes(userId);

    const newLikes = hasLiked 
      ? likes.filter((uid: string) => uid !== userId)
      : [...likes, userId];

    db.prepare(`UPDATE chat_messages SET likes = ? WHERE id = ?`).run(JSON.stringify(newLikes), id);

    return NextResponse.json({ success: true, likes: newLikes });
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
      db.prepare(`DELETE FROM chat_messages`).run();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.prepare(`DELETE FROM chat_messages WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
