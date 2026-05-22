import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const deleteStmt = db.prepare('DELETE FROM user_fragments WHERE id = ?');
    deleteStmt.run(id);

    return NextResponse.json({ success: true, collectedIds: [] });
  } catch (error) {
    console.error('Error resetting fragments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
