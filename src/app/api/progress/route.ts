import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const getIP = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '127.0.0.1';
};

export async function GET(request: Request) {
  const ip = getIP(request);
  
  try {
    let visitor = await prisma.visitorProgress.findUnique({
      where: { ipAddress: ip }
    });

    if (!visitor) {
      visitor = await prisma.visitorProgress.create({
        data: { ipAddress: ip }
      });
    }

    return NextResponse.json({ success: true, data: visitor });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = getIP(request);
  
  try {
    const body = await request.json();
    const action = body.action;
    
    let visitor = await prisma.visitorProgress.findUnique({
      where: { ipAddress: ip }
    });

    if (!visitor) {
      visitor = await prisma.visitorProgress.create({
        data: { ipAddress: ip }
      });
    }

    const now = new Date();
    
    if (action === 'ping') {
      const msSinceLastVisit = now.getTime() - visitor.lastVisitDate.getTime();
      const COOLDOWN = 5 * 60 * 1000; // 5 minut ochrana proti F5
      
      if (msSinceLastVisit >= COOLDOWN || visitor.totalVisits === 0) {
        const updateData: any = {
          totalVisits: visitor.totalVisits + 1,
          lastVisitDate: now
        };
        
        if (visitor.activeChapter === 'products') updateData.productsVisits = visitor.productsVisits + 1;
        else if (visitor.activeChapter === 'community') updateData.communityVisits = visitor.communityVisits + 1;
        else if (visitor.activeChapter === 'secret') updateData.secretVisits = visitor.secretVisits + 1;
        
        visitor = await prisma.visitorProgress.update({
          where: { ipAddress: ip },
          data: updateData
        });
        
        return NextResponse.json({ success: true, data: visitor, rewarded: true });
      } else {
        return NextResponse.json({ success: true, data: visitor, rewarded: false });
      }
    }

    if (action === 'change_chapter') {
      visitor = await prisma.visitorProgress.update({
        where: { ipAddress: ip },
        data: { activeChapter: body.chapterId }
      });
    } else if (action === 'fragment') {
      const fragments = JSON.parse(visitor.collectedFragments);
      if (!fragments.includes(body.fragmentId)) {
        fragments.push(body.fragmentId);
        
        const updateData: any = {
          collectedFragments: JSON.stringify(fragments),
          totalVisits: visitor.totalVisits + 1
        };
        
        if (visitor.activeChapter === 'products') updateData.productsVisits = visitor.productsVisits + 1;
        else if (visitor.activeChapter === 'community') updateData.communityVisits = visitor.communityVisits + 1;
        else if (visitor.activeChapter === 'secret') updateData.secretVisits = visitor.secretVisits + 1;
        
        visitor = await prisma.visitorProgress.update({
          where: { ipAddress: ip },
          data: updateData
        });
      }
    } else if (action === 'achievement') {
      const achievements = JSON.parse(visitor.unlockedAchievements);
      if (!achievements.includes(body.achievementId)) {
        achievements.push(body.achievementId);
        
        visitor = await prisma.visitorProgress.update({
          where: { ipAddress: ip },
          data: {
            unlockedAchievements: JSON.stringify(achievements)
          }
        });
      }
    }

    return NextResponse.json({ success: true, data: visitor });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
