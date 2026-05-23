export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const rows = [...db.barber_novinky].sort((a, b) => b.createdAt - a.createdAt);
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

    const db = getDb();
    db.barber_novinky.push({
      id,
      status: body.status || 'new',
      createdAt: now,
      nickname: body.nickname,
      category: body.category,
      message: body.message
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
    const { id, status } = body;

    const db = getDb();
    const index = db.barber_novinky.findIndex(n => n.id === id);
    if (index !== -1) {
      db.barber_novinky[index].status = status;
      saveDb();
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
    const all = searchParams.get('all');

    const db = getDb();

    if (all === 'true') {
      db.barber_novinky = [];
      saveDb();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.barber_novinky = db.barber_novinky.filter(n => n.id !== id);
    saveDb();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
