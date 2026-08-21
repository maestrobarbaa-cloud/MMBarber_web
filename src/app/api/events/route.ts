import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Ochranná funkce (použijeme jednoduchou kontrolu session)
async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    let userCity = '';
    
    // Zkusíme najít město přihlášeného uživatele z jeho profilu
    if (session?.user?.email) {
      const userWithProfile = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profile: true }
      });
      if (userWithProfile?.profile?.city) {
        userCity = userWithProfile.profile.city;
      }
    }

    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'ALL';
    const category = searchParams.get('category') || 'ALL';
    // Pokud nenapsal město do hledání, použijeme jeho profilové město (Smart Default)
    const cityParam = searchParams.get('city');
    const city = (cityParam !== null && cityParam.trim() !== '') ? cityParam : userCity;

    // Sestavíme dotaz
    const whereClause: any = {
      eventDate: {
        gte: new Date() // Ukazujeme jen aktuální a budoucí akce
      },
      // Zjednodušená logika pro soukromé akce: Ukážeme zatím jen veřejné (případně ty, co vytvořil on sám)
      // V plné verzi by se sem přidal složitý dotaz na "Matches", prozatím ukazujeme public.
      isPrivate: false
    };

    if (region !== 'ALL') {
      whereClause.region = region;
    }
    if (category !== 'ALL') {
      whereClause.category = category;
    }

    // Načteme události
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        creator: {
          select: { name: true, image: true, email: true }
        },
        attendees: {
          include: {
            user: { select: { name: true, image: true, email: true } }
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: [
        { eventDate: 'asc' }
      ],
      take: 100
    });

    // Chytré řazení v paměti:
    if (city && city.trim() !== '') {
      const searchCity = city.toLowerCase().trim();
      events.sort((a, b) => {
        const aCityMatch = a.city?.toLowerCase().includes(searchCity) ? 1 : 0;
        const bCityMatch = b.city?.toLowerCase().includes(searchCity) ? 1 : 0;
        
        if (aCityMatch !== bCityMatch) {
          return bCityMatch - aCityMatch;
        }
        return 0; 
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Chyba při načítání událostí:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
       return NextResponse.json({ error: 'Nejste přihlášeni' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Uživatel nenalezen' }, { status: 404 });
    }

    const { title, description, category, region, city, date, maxCapacity, isPrivate } = await request.json();

    if (!title || !category || !region || !date) {
      return NextResponse.json({ error: 'Vyplňte povinná pole' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        category,
        region,
        city: city || '',
        eventDate: new Date(date),
        creatorId: user.id,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
        isPrivate: isPrivate === true
      }
    });

    // Tvůrce akce rovnou označíme jako účastníka
    await prisma.eventAttendee.create({
      data: {
        eventId: event.id,
        userId: user.id,
        status: "GOING"
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Chyba při vytváření události:", error);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}
