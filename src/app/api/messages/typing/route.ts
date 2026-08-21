import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { matchId } = await request.json()

    if (!matchId) {
      return NextResponse.json({ error: 'Missing matchId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId }
    })

    if (!match || (match.user1Id !== user.id && match.user2Id !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const isUser1 = match.user1Id === user.id;

    await prisma.match.update({
      where: { id: matchId },
      data: isUser1 ? { user1Typing: new Date() } : { user2Typing: new Date() }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Messages Typing API Error:', error)
    return NextResponse.json({ error: 'Failed to update typing status' }, { status: 500 })
  }
}
