import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { path, elementId, x, y, screenW, screenH } = data;

    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const log = await prisma.telemetryLog.create({
      data: {
        path,
        elementId: elementId || null,
        x: x || null,
        y: y || null,
        screenW: screenW || null,
        screenH: screenH || null,
      },
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error) {
    console.error('Telemetry Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
