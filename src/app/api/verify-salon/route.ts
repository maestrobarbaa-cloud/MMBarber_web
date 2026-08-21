import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { token } = await request.json()

    // Validace tokenu
    const today = new Date().toISOString().split('T')[0]
    const validKey = `MM_VIP_${today}`
    
    // Pro ukázku dovolíme i univerzální bypass klíč
    if (token !== validKey && token !== 'TEST_VIP_KEY') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    await prisma.profile.update({
      where: { userId: user.id },
      data: { salonVerified: true, physicallyVerifiedAt: new Date().toISOString() }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
