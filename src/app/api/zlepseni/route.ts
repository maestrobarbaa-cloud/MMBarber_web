export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM suggestions ORDER BY createdAt DESC';
    let params: any[] = [];

    if (status) {
      query = 'SELECT * FROM suggestions WHERE status = ? ORDER BY createdAt DESC';
      params.push(status);
    }

    const rows = db.prepare(query).all(...params);
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

    const stmt = db.prepare(`
      INSERT INTO suggestions 
      (id, user, userId, content, points, userPriority, status, likes, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.user,
      body.userId,
      body.content,
      JSON.stringify(body.points || []),
      body.userPriority,
      body.status || 'PENDING',
      JSON.stringify([]),
      now
    );

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

    if (action === 'toggleLike' && userId) {
      const row = db.prepare(`SELECT likes FROM suggestions WHERE id = ?`).get(id) as any;
      if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const likes = row.likes ? JSON.parse(row.likes) : [];
      const hasLiked = likes.includes(userId);

      const newLikes = hasLiked 
        ? likes.filter((uid: string) => uid !== userId)
        : [...likes, userId];

      db.prepare(`UPDATE suggestions SET likes = ? WHERE id = ?`).run(JSON.stringify(newLikes), id);
      return NextResponse.json({ success: true, likes: newLikes });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (adminResponse !== undefined) { updates.push('adminResponse = ?'); params.push(adminResponse); }
    if (adminPriority !== undefined) { updates.push('adminPriority = ?'); params.push(adminPriority); }
    
    updates.push('updatedAt = ?');
    params.push(Date.now());
    
    params.push(id);

    if (updates.length > 0) {
      db.prepare(`UPDATE suggestions SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

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

    db.prepare(`DELETE FROM suggestions WHERE id = ?`).run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
