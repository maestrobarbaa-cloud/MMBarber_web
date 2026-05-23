export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/jsonDb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const db = getDb();
    const row = db.user_fragments.find(f => f.id === id);

    if (row) {
      return NextResponse.json({ collectedIds: JSON.parse(row.collected_ids) });
    } else {
      return NextResponse.json({ collectedIds: [] });
    }
  } catch (error) {
    console.error('Error fetching fragment progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
