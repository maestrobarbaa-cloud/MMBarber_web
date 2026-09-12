
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const db = getDb();
    
    return NextResponse.json({
      divisions: db.rodina_divisions || [],
      members: db.rodina_members || []
    });
  } catch (error) {
    console.error('Error fetching rodina data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { divisions, members } = body;

    const db = getDb();
    
    if (divisions) {
      db.rodina_divisions = divisions;
    }
    
    if (members) {
      db.rodina_members = members;
    }

    saveDb();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving rodina data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

