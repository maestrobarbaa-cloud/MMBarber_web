import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const stmt = db.prepare('SELECT collected_ids FROM user_fragments WHERE id = ?');
    const row = stmt.get(id) as { collected_ids: string } | undefined;

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
