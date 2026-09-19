import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  try {
    const db = getDb();
    
    if (sessionId) {
      // User or Admin fetching specific call state for a session
      const call = db.support_calls?.find(c => c.sessionId === sessionId);
      return NextResponse.json({ call: call || null });
    }

    // Admin fetching all active ringing calls
    const ringingCalls = db.support_calls?.filter(c => c.status === 'RINGING' || c.status === 'ACCEPTED') || [];
    return NextResponse.json({ calls: ringingCalls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionId, offer, answer, candidate } = body;
    const db = getDb();
    
    if (!db.support_calls) db.support_calls = [];

    let call = db.support_calls.find(c => c.sessionId === sessionId);

    if (action === 'CALL') {
      // Start a new call
      if (call) {
        // override if old
        call.status = 'RINGING';
        call.offer = offer;
        call.answer = undefined;
        call.candidates = [];
        call.timestamp = Date.now();
      } else {
        db.support_calls.push({
          id: crypto.randomUUID(),
          sessionId,
          status: 'RINGING',
          offer,
          candidates: [],
          timestamp: Date.now()
        });
      }
    } else if (action === 'ACCEPT') {
      if (call) {
        call.status = 'ACCEPTED';
        call.answer = answer;
      }
    } else if (action === 'REJECT' || action === 'END') {
      if (call) {
        call.status = action === 'REJECT' ? 'REJECTED' : 'ENDED';
      }
    } else if (action === 'CANDIDATE') {
      if (call) {
        call.candidates.push(candidate);
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    saveDb();
    return NextResponse.json({ success: true, call: db.support_calls.find(c => c.sessionId === sessionId) });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
