export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = getDb();
    let rows = [...db.suggestions];
    
    if (status) {
      rows = rows.filter(r => r.status === status);
    }
    rows.sort((a, b) => b.createdAt - a.createdAt);

    const data = rows.map((r: any) => ({
      ...r,
      points: r.points ? JSON.parse(r.points) : [],
      likes: r.likes ? JSON.parse(r.likes) : [],
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
    db.suggestions.push({
      id,
      user: body.user,
      userId: body.userId,
      content: body.content,
      points: JSON.stringify(body.points || []),
      userPriority: body.userPriority,
      status: body.status || 'PENDING',
      likes: JSON.stringify([]),
      createdAt: now
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
    const { id, status, adminResponse, adminPriority, userId, action } = body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    const index = db.suggestions.findIndex(s => s.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (action === 'toggleLike' && userId) {
      const row = db.suggestions[index];
      const likes = row.likes ? JSON.parse(row.likes) : [];
      const hasLiked = likes.includes(userId);

      const newLikes = hasLiked 
        ? likes.filter((uid: string) => uid !== userId)
        : [...likes, userId];

      db.suggestions[index].likes = JSON.stringify(newLikes);
      saveDb();
      return NextResponse.json({ success: true, likes: newLikes });
    }

    if (status !== undefined) db.suggestions[index].status = status;
    if (adminResponse !== undefined) db.suggestions[index].adminResponse = adminResponse;
    if (adminPriority !== undefined) db.suggestions[index].adminPriority = adminPriority;
    
    db.suggestions[index].updatedAt = Date.now();
    saveDb();

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

    const db = getDb();
    db.suggestions = db.suggestions.filter(s => s.id !== id);
    saveDb();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
