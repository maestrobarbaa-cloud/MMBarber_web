import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id, fragmentId } = await req.json();

    if (!id || !fragmentId) {
      return NextResponse.json({ error: 'Missing id or fragmentId parameter' }, { status: 400 });
    }

    const selectStmt = db.prepare('SELECT collected_ids FROM user_fragments WHERE id = ?');
    const row = selectStmt.get(id) as { collected_ids: string } | undefined;

    let collectedIds: string[] = [];

    if (row) {
      collectedIds = JSON.parse(row.collected_ids);
      if (!collectedIds.includes(fragmentId)) {
        collectedIds.push(fragmentId);
        
        const updateStmt = db.prepare('UPDATE user_fragments SET collected_ids = ?, updatedAt = ? WHERE id = ?');
        updateStmt.run(JSON.stringify(collectedIds), Date.now(), id);
      }
    } else {
      collectedIds = [fragmentId];
      const insertStmt = db.prepare('INSERT INTO user_fragments (id, collected_ids, updatedAt) VALUES (?, ?, ?)');
      insertStmt.run(id, JSON.stringify(collectedIds), Date.now());
    }

    return NextResponse.json({ collectedIds });
  } catch (error) {
    console.error('Error saving fragment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
