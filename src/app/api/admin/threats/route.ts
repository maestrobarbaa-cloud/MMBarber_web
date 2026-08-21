import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    
    // Rychlá kontrola - pouze admini
    // (Zatím kontrolujeme nickname/email, v produkci podle role "ADMIN")
    if (!session?.user?.name || (session.user.name !== 'Admin' && !session.user.name.startsWith('Partner_'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const logs = await prisma.threatLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const attackers = await prisma.attackerProfile.findMany({
      orderBy: { score: 'desc' },
      take: 20
    })

    return NextResponse.json({ logs, attackers })
  } catch (error) {
    console.error("Admin Threats Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
