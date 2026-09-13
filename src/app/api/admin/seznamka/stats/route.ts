import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const totalProfiles = await prisma.profile.count();
    const totalMatches = await prisma.match.count();
    const totalSwipes = await prisma.swipe.count();
    
    // Male vs Female (approx by gender string)
    const maleCount = await prisma.profile.count({ where: { gender: { in: ['Muž', 'muž', 'Male', 'male'] } } });
    const femaleCount = await prisma.profile.count({ where: { gender: { in: ['Žena', 'žena', 'Female', 'female'] } } });

    // Settings
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: { startsWith: 'seznamka_' }
      }
    });

    const settingsMap = settings.reduce((acc: any, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});

    return NextResponse.json({
      stats: {
        totalProfiles,
        totalMatches,
        totalSwipes,
        maleCount,
        femaleCount
      },
      settings: settingsMap
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Data format { [key]: value }
        const promises = Object.entries(data).map(([key, value]) => {
            return prisma.systemSettings.upsert({
                where: { key },
                update: { value: value as string },
                create: { key, value: value as string }
            });
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true, message: 'Settings saved' });
    } catch (error) {
        console.error('Failed to save settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
