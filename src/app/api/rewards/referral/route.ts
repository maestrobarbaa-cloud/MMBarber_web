import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { REWARDS_CONFIG, getSeasonalMultiplier } from '@/lib/rewardsConfig'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Kód chybí' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.referredById) {
      return NextResponse.json({ error: 'Už jste zadali kód doporučitele.' }, { status: 400 })
    }

    if (user.referralCode === code) {
      return NextResponse.json({ error: 'Nemůžete zadat svůj vlastní kód.' }, { status: 400 })
    }

    const referrer = await prisma.user.findUnique({
      where: { referralCode: code }
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Tento doporučovací kód neexistuje.' }, { status: 404 })
    }

    // Calculate rewards with seasonal multiplier
    const multiplier = getSeasonalMultiplier();
    const inviterCoins = Math.floor(REWARDS_CONFIG.REFERRAL_INVITER_COINS * multiplier);
    const inviteeCoins = Math.floor(REWARDS_CONFIG.REFERRAL_INVITEE_COINS * multiplier);
    const inviteeBoosts = REWARDS_CONFIG.REFERRAL_INVITEE_BOOSTS; // Boosts are usually not multiplied

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          referredById: referrer.id,
          mmcoins: { increment: inviteeCoins },
          freeBoosts: { increment: inviteeBoosts }
        }
      }),
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          mmcoins: { increment: inviterCoins }
        }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      message: `Kód úspěšně uplatněn! Získali jste ${inviteeCoins} MMCOINů a ${inviteeBoosts} Boostů.`,
      rewardedCoins: inviteeCoins,
      rewardedBoosts: inviteeBoosts
    })
  } catch (error) {
    console.error('Error claiming referral:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
