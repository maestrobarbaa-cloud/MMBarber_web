export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const db = getDb();
    
    return NextResponse.json({
      people: db.zajimavosti_people || []
    });
  } catch (error) {
    console.error('Error fetching zajimavosti data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { people } = body;

    const db = getDb();
    
    if (people) {
      db.zajimavosti_people = people;
    }

    saveDb();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving zajimavosti data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
