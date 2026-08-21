import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId, reaction } = await request.json()

    if (!messageId) {
      return NextResponse.json({ error: 'Missing messageId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (!message || (message.senderId !== user.id && message.receiverId !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { reaction: reaction || null } 
    })

    return NextResponse.json({ message: updatedMessage }, { status: 200 })
  } catch (error) {
    console.error('Messages Reaction API Error:', error)
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}
