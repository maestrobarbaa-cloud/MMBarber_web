import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, context } = body;
    
    // Get IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || '127.0.0.1');

    await prisma.threatLog.create({
      data: {
        ip: ip,
        path: '/hodnoceni',
        method: 'PROFANITY',
        payload: JSON.stringify({ attemptedWord: word, context: context }),
        threatLevel: 2 // Level 2 pro nevhodné chování
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging profanity:", error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
