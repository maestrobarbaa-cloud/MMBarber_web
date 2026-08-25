import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const allowPrivate = searchParams.get('allowPrivate') === 'true'
    const session = await getServerSession()
    // V budoucnu můžeme omezit profily jen pro přihlášené uživatele:
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let excludedIds: string[] = []
    let fetchLimit = 50

    if (session?.user?.email) {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      if (currentUser) {
        const linkedAccounts = await prisma.linkedAccount.findMany({
          where: {
            OR: [
              { userId1: currentUser.id },
              { userId2: currentUser.id }
            ]
          }
        })
        excludedIds = linkedAccounts.map(link => 
          link.userId1 === currentUser.id ? link.userId2 : link.userId1
        )
        // Also exclude the current user themselves
        excludedIds.push(currentUser.id)
        
        const myProfile = await prisma.profile.findUnique({ where: { userId: currentUser.id } })
        if (myProfile?.isZenMode) {
          fetchLimit = 3
        }
      }
    }

    const profiles = await prisma.profile.findMany({
      where: {
        isPrivate: allowPrivate ? undefined : false,
        isNinjaMode: false,
        user: {
          isShadowBanned: false,
          id: {
            notIn: excludedIds.length > 0 ? excludedIds : undefined
          }
        }
      },
      orderBy: { lastOnline: 'desc' },
      take: fetchLimit
    })

    // Zpětný překlad JSON dat z databáze na objekty pro frontend
    const formattedProfiles = profiles.map(p => ({
      ...p,
      photos: JSON.parse(p.photos),
      seeking: JSON.parse(p.seeking),
      extendedData: p.extendedData ? JSON.parse(p.extendedData) : {},
      physicallyVerifiedAt: p.physicallyVerifiedAt ? JSON.parse(p.physicallyVerifiedAt) : null,
      dateCheckins: p.dateCheckins ? JSON.parse(p.dateCheckins) : null
    }))

    return NextResponse.json(formattedProfiles)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // LOCKDOWN KONTROLA
    const lockdown = await prisma.systemSettings.findUnique({ where: { key: 'LOCKDOWN_MODE' } })
    if (lockdown?.value === 'true') {
      return NextResponse.json({ error: 'System is under emergency lockdown maintenance. Please try again later.' }, { status: 503 })
    }

    const data = await request.json()

    // Získání IP adresy z hlaviček požadavku (např. z x-forwarded-for za reverzním proxy/aaPanelem)
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Zkontrolujeme, jestli IP není zabanovaná
    const isBannedIp = await prisma.bannedIp.findUnique({ where: { ip: ipAddress } })
    
    // 1. Získáme uživatele z DB
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Aktualizujeme uživateli IP adresu a pokud je jeho IP v BannedIp, automaticky dostane shadowban
    user = await prisma.user.update({
      where: { id: user.id },
      data: { 
        ipAddress,
        isShadowBanned: isBannedIp ? true : undefined
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Očištění základních dat
    let { 
      name, age, gender, seeking, city, height, smoking, drinking, interests, bio, photos,
      salonVerified, physicallyVerifiedAt, originSalonId, isPrivate, isNinjaMode, isBlurredMode, isZenMode,
      ...extendedData 
    } = data

    // SANITIZATION A KONTROLA DÉLKY (Ochrana databáze)
    if (name && name.length > 50) name = name.substring(0, 50);
    if (bio && bio.length > 5000) bio = bio.substring(0, 5000);
    if (city && city.length > 100) city = city.substring(0, 100);

    // 2. Vytvoření nebo aktualizace profilu (Upsert)
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        name,
        age,
        gender,
        seeking: JSON.stringify(seeking),
        city,
        height,
        smoking,
        drinking,
        interests,
        bio,
        photos: JSON.stringify(photos),
        salonVerified: salonVerified ?? false,
        physicallyVerifiedAt: physicallyVerifiedAt ? JSON.stringify(physicallyVerifiedAt) : null,
        originSalonId,
        isPrivate: isPrivate ?? false,
        isNinjaMode: isNinjaMode ?? false,
        isBlurredMode: isBlurredMode ?? false,
        isZenMode: isZenMode ?? false,
        extendedData: JSON.stringify(extendedData),
        lastOnline: new Date()
      },
      create: {
        userId: user.id,
        name,
        age,
        gender,
        seeking: JSON.stringify(seeking),
        city,
        height,
        smoking,
        drinking,
        interests,
        bio,
        photos: JSON.stringify(photos),
        salonVerified: salonVerified ?? false,
        physicallyVerifiedAt: physicallyVerifiedAt ? JSON.stringify(physicallyVerifiedAt) : null,
        originSalonId,
        isPrivate: isPrivate ?? false,
        isNinjaMode: isNinjaMode ?? false,
        isBlurredMode: isBlurredMode ?? false,
        isZenMode: isZenMode ?? false,
        extendedData: JSON.stringify(extendedData)
      }
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
