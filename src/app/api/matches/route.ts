import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Najít všechny matche, kde je aktuální uživatel user1 nebo user2
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ]
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Zformátovat do pole profilů, abychom vrátili jen data toho "druhého" uživatele
    const matchedProfiles = matches.map(match => {
      const otherUser = match.user1Id === user.id ? match.user2 : match.user1
      if (!otherUser || !otherUser.profile) return null

      const p = otherUser.profile
      return {
        ...p,
        photos: JSON.parse(p.photos),
        seeking: JSON.parse(p.seeking),
        extendedData: p.extendedData ? JSON.parse(p.extendedData) : {},
        matchId: match.id // Přibalíme matchId pro snadnější query zpráv
      }
    }).filter(Boolean)

    return NextResponse.json(matchedProfiles)
  } catch (error) {
    console.error('Matches API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
