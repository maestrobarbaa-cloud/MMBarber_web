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

    // Seeking Categories
    const seekingGroup = await prisma.profile.groupBy({
      by: ['seeking'],
      _count: {
        seeking: true,
      },
    });
    const categories = seekingGroup.map(g => ({
      name: g.seeking || 'Nezadáno',
      value: g._count.seeking
    }));

    // Action Breakdown (Like vs Pass)
    const likesCount = await prisma.swipe.count({ where: { action: 'like' } });
    const passesCount = await prisma.swipe.count({ where: { action: 'pass' } });

    // Reports and Messages
    const totalReports = await prisma.profile.aggregate({ _sum: { reportsCount: true } });
    const totalMessages = await prisma.message.count();

    // Top Cities
    const cityGroup = await prisma.profile.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 5
    });
    const topCities = cityGroup.map(g => ({
      name: g.city || 'Nezadáno',
      value: g._count.city
    }));

    // Age Groups (simple map)
    const allAges = await prisma.profile.findMany({ select: { age: true } });
    let age1824 = 0;
    let age2534 = 0;
    let age35plus = 0;
    allAges.forEach(p => {
        const a = parseInt(p.age);
        if (!isNaN(a)) {
            if (a < 25) age1824++;
            else if (a < 35) age2534++;
            else age35plus++;
        }
    });
    const ageGroups = [
        { name: '18-24', value: age1824 },
        { name: '25-34', value: age2534 },
        { name: '35+', value: age35plus },
    ];

    // Active Fragment Spawn
    const activeSpawn = await prisma.fragmentSpawn.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' },
      select: { locationId: true, expiresAt: true }
    });

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
        femaleCount,
        categories,
        likesCount,
        passesCount,
        totalReports: totalReports._sum.reportsCount || 0,
        totalMessages,
        topCities,
        ageGroups,
        activeSpawn
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
