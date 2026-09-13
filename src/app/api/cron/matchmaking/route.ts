import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint is meant to be called by a cron job service (e.g., Vercel Cron, GitHub Actions)
export async function GET(request: Request) {
  try {
    // 1. Ochrana endpointu pomoci secret klice
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('secret');
    
    // V realnem provozu by mel byt tajny klic ulozen v .env jako CRON_SECRET
    // Zde jako ukazka jednoduche ochrany
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized cron access' }, { status: 401 });
    }

    // 2. Nacteni vsech uzivatelu, kteri jsou v poradniku (ceka se na shodu)
    const waitingUsers = await prisma.matchmakingQueue.findMany({
        where: { status: 'WAITING' },
        include: { user: { include: { profile: true } } }
    });

    if (waitingUsers.length === 0) {
        return NextResponse.json({ message: 'No users in waitlist' }, { status: 200 });
    }

    let processedCount = 0;
    let foundMatchesCount = 0;

    // 3. Projdeme kazdeho cekajiciho uzivatele a zkusime mu najit novou shodu
    for (const queueItem of waitingUsers) {
        if (!queueItem.user?.profile) continue;
        
        const myProfile = queueItem.user.profile;
        const myGender = myProfile.gender || 'male';
        
        let seekingParsed = [];
        try {
            seekingParsed = JSON.parse(myProfile.seeking);
        } catch (e) {
            seekingParsed = myGender === 'male' ? ['female'] : ['male'];
        }
        const mySeeking = seekingParsed && seekingParsed.length > 0 ? seekingParsed : (myGender === 'male' ? ['female'] : ['male']);

        // Hledame nekoho, kdo odpovida nasim volnejsim parametrum 
        // a kdo neni nas vlastni profil
        const potentialMatches = await prisma.profile.findMany({
            where: {
                userId: { not: queueItem.userId },
                isPrivate: false,
                isNinjaMode: false
            },
            take: 20,
            orderBy: { lastOnline: 'desc' }
        });

        const counterpartProfiles = potentialMatches.filter(p => {
            const theirGender = p.gender || 'female';
            let theirSeekingParsed = [];
            try {
                theirSeekingParsed = JSON.parse(p.seeking);
            } catch(e) {
                theirSeekingParsed = theirGender === 'male' ? ['female'] : ['male'];
            }
            const theirSeeking = theirSeekingParsed && theirSeekingParsed.length > 0 ? theirSeekingParsed : (theirGender === 'male' ? ['female'] : ['male']);

            const iAmSeekingThem = mySeeking.includes(theirGender) || mySeeking.includes('all');
            const theyAreSeekingMe = theirSeeking.includes(myGender) || theirSeeking.includes('all');
            
            // Pro relaxovane hledani pozadujeme aspon opacne pohlavi
            return (iAmSeekingThem && theyAreSeekingMe) || (myGender !== theirGender);
        });

        // Pokud jsme nasli dostatek lidi, muzeme uzivatele z fronty presunout
        if (counterpartProfiles.length >= 2) {
            await prisma.matchmakingQueue.update({
                where: { id: queueItem.id },
                data: { 
                    status: 'FOUND_MATCHES',
                    lastChecked: new Date()
                }
            });

            // Volitelne: Odeslat notifikaci nebo email uzivateli (napr. pres Resend/Nodemailer)
            // sendEmailNotification(queueItem.user.email, "Nasli jsme ti shody!")

            foundMatchesCount++;
        } else {
             await prisma.matchmakingQueue.update({
                where: { id: queueItem.id },
                data: { lastChecked: new Date() }
            });
        }

        processedCount++;
    }

    return NextResponse.json({ 
        success: true, 
        message: 'Cron job executed',
        processed: processedCount,
        foundMatchesFor: foundMatchesCount
    }, { status: 200 });

  } catch (error) {
    console.error('Cron API Error:', error);
    return NextResponse.json({ error: 'Failed to execute cron job' }, { status: 500 });
  }
}
