import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Get profiles with reports > 0 or trustScore < 100
    const reportedProfiles = await prisma.profile.findMany({
      where: {
        OR: [
          { reportsCount: { gt: 0 } },
          { trustScore: { lt: 100 } }
        ]
      },
      include: {
        user: {
          select: { email: true, isShadowBanned: true }
        }
      },
      orderBy: [
        { reportsCount: 'desc' },
        { trustScore: 'asc' }
      ]
    });
    return NextResponse.json(reportedProfiles);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { action, profileId, userId } = data; // action: 'reset' | 'ban'

    if (action === 'reset') {
      await prisma.profile.update({
        where: { id: profileId },
        data: { reportsCount: 0, trustScore: 100 }
      });
      return NextResponse.json({ success: true, message: 'Reports reset' });
    } 
    
    if (action === 'ban') {
      await prisma.user.update({
        where: { id: userId },
        data: { isShadowBanned: true }
      });
      return NextResponse.json({ success: true, message: 'User banned' });
    }

    if (action === 'unban') {
        await prisma.user.update({
          where: { id: userId },
          data: { isShadowBanned: false }
        });
        return NextResponse.json({ success: true, message: 'User unbanned' });
      }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to process report action:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
