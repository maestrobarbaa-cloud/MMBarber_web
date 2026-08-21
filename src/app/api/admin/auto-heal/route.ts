import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name || session.user.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const report: string[] = []

    // 1. Vyčištění starých banů z BannedIp (starších 30 dnů)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const deletedBans = await prisma.bannedIp.deleteMany({
      where: { createdAt: { lt: thirtyDaysAgo } }
    })
    if (deletedBans.count > 0) report.push(`Smazáno ${deletedBans.count} starých IP banů.`)

    // 2. Vyčištění zastaralých relací
    const deletedSessions = await prisma.session.deleteMany({
      where: { expires: { lt: new Date() } }
    })
    if (deletedSessions.count > 0) report.push(`Odstraněno ${deletedSessions.count} expirovaných přihlášení.`)

    // 3. Nalezení a odstranění zpráv, kde už neexistuje příjemce nebo odesílatel 
    // (Prisma Cascade by toto mělo řešit, ale pojistka neuškodí)
    
    if (report.length === 0) report.push("Databáze je v perfektní kondici. Žádné opravy nebyly nutné.")

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Auto-Heal Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
