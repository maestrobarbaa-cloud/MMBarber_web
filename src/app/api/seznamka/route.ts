export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = getDb();
    let rows = [...db.seznamka_requests];
    
    if (status) {
      rows = rows.filter(r => r.status === status);
    }
    rows.sort((a, b) => b.createdAt - a.createdAt);

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

    const db = getDb();
    db.seznamka_requests.push({
      id,
      status: body.status || 'new',
      createdAt: now,
      name: body.name,
      age: body.age,
      email: body.email,
      phone: body.phone || '',
      idealMan: body.idealMan,
      characters: JSON.stringify(body.characters || []),
      ageMin: body.ageRange?.[0] || 18,
      ageMax: body.ageRange?.[1] || 99,
      dealbreaker: body.dealbreaker || ''
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

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const db = getDb();
    const index = db.seznamka_requests.findIndex(r => r.id === id);
    if (index !== -1) {
      db.seznamka_requests[index].status = status;
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
      db.seznamka_requests = [];
      saveDb();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.seznamka_requests = db.seznamka_requests.filter(r => r.id !== id);
    saveDb();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
