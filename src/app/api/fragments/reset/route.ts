export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const db = getDb();
    db.user_fragments = db.user_fragments.filter(f => f.id !== id);
    saveDb();

    return NextResponse.json({ success: true, collectedIds: [] });
  } catch (error) {
    console.error('Error resetting fragments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
