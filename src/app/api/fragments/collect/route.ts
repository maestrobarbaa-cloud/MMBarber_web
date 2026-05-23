export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function POST(req: Request) {
  try {
    const { id, fragmentId } = await req.json();

    if (!id || !fragmentId) {
      return NextResponse.json({ error: 'Missing id or fragmentId parameter' }, { status: 400 });
    }

    const db = getDb();
    const index = db.user_fragments.findIndex(f => f.id === id);

    let collectedIds: string[] = [];

    if (index !== -1) {
      const row = db.user_fragments[index];
      collectedIds = JSON.parse(row.collected_ids);
      if (!collectedIds.includes(fragmentId)) {
        collectedIds.push(fragmentId);
        db.user_fragments[index].collected_ids = JSON.stringify(collectedIds);
        db.user_fragments[index].updatedAt = Date.now();
        saveDb();
      }
    } else {
      collectedIds = [fragmentId];
      db.user_fragments.push({
        id,
        collected_ids: JSON.stringify(collectedIds),
        updatedAt: Date.now()
      });
      saveDb();
    }

    return NextResponse.json({ collectedIds });
  } catch (error) {
    console.error('Error saving fragment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
