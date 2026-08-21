import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Zablokování (smazání shody, smazání zpráv a přidání reportu)
    
    // 1. Smazání shody
    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: user.id, user2Id: targetUserId },
          { user1Id: targetUserId, user2Id: user.id }
        ]
      }
    });

    // 2. Smazání historie chatu (aby agresor ztratil přístup k mým zprávám)
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: user.id }
        ]
      }
    });

    // 3. Report pro administrátora (Zápis do Profilu uživatele)
    const targetProfile = await prisma.profile.findUnique({ where: { userId: targetUserId }});
    if (targetProfile) {
      await prisma.profile.update({
        where: { userId: targetUserId },
        data: {
          reportsCount: { increment: 1 },
          trustScore: { decrement: 20 }
        }
      });
    }

    // 4. Logování incidentu pro obránce
    await prisma.threatLog.create({
      data: {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        path: '/api/messages/panic',
        method: 'POST',
        payload: `Uživatel ${user.id} spustil Panic Button na ${targetUserId}`,
        threatLevel: 90
      }
    });

    return NextResponse.json({ success: true, message: 'Agresor byl nahlášen a konverzace smazána.' })

  } catch (error) {
    console.error('Panic Button API Error:', error)
    return NextResponse.json({ error: 'Failed to execute panic action' }, { status: 500 })
  }
}
