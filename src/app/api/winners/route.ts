export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const db = getDb();
    // Sort winners from newest to oldest
    const rows = [...db.game_winners].sort((a, b) => b.createdAt - a.createdAt);
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
    db.game_winners.push({
      id,
      createdAt: now,
      game: body.game, // "elita" nebo "slot_machine"
      nickname: body.nickname,
      prizeOrScore: body.prizeOrScore // Např. "52000" nebo "Voucher 30 min"
    });
    saveDb();

    return NextResponse.json({ id, success: true });
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
      db.game_winners = [];
      saveDb();
      return NextResponse.json({ success: true });
    }

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    db.game_winners = db.game_winners.filter((w: any) => w.id !== id);
    saveDb();
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
