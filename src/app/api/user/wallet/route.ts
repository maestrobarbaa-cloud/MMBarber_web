import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { mmcoins: true, freeBoosts: true, referralCode: true, id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      const uniqueCode = 'REF' + user.id.substring(0, 6).toUpperCase()
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: uniqueCode },
        select: { mmcoins: true, freeBoosts: true, referralCode: true, id: true }
      })
    }

    return NextResponse.json({ 
      mmcoins: user.mmcoins,
      freeBoosts: user.freeBoosts,
      referralCode: user.referralCode
    })
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
