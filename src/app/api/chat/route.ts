export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const rows = [...db.chat_messages].sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
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

    const db = getDb();
    db.chat_messages.push({
      id,
      text: body.text,
      user: body.user,
      userId: body.userId,
      timestamp: now,
      likes: JSON.stringify([]),
      verifiedUser: body.verifiedUser ? 1 : 0
    });
    saveDb();

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

    const db = getDb();
    const index = db.chat_messages.findIndex(m => m.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const row = db.chat_messages[index];
    const likes = row.likes ? JSON.parse(row.likes) : [];
    const hasLiked = likes.includes(userId);

    const newLikes = hasLiked 
      ? likes.filter((uid: string) => uid !== userId)
      : [...likes, userId];

    db.chat_messages[index].likes = JSON.stringify(newLikes);
    saveDb();

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

    const db = getDb();

    if (all === 'true') {
      db.chat_messages = [];
      saveDb();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.chat_messages = db.chat_messages.filter(m => m.id !== id);
    saveDb();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
