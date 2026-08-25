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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const now = new Date()
    const lastReward = user.lastMonthlyReward

    // Check if 30 days have passed since the last reward
    if (lastReward) {
      const daysSinceLastReward = (now.getTime() - lastReward.getTime()) / (1000 * 3600 * 24)
      if (daysSinceLastReward < 30) {
        return NextResponse.json({ 
          success: false, 
          message: 'Na další odměnu ještě nemáte nárok.',
          daysRemaining: Math.ceil(30 - daysSinceLastReward)
        })
      }
    }

    // Calculate reward with seasonal multiplier
    const rewardAmount = Math.floor(REWARDS_CONFIG.MONTHLY_COIN * getSeasonalMultiplier());

    // Grant MMCOINs
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        mmcoins: { increment: rewardAmount },
        lastMonthlyReward: now
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Měsíční odměna (+${rewardAmount} MMCOIN) byla úspěšně připsána!`,
      mmcoins: updatedUser.mmcoins
    })
  } catch (error) {
    console.error('Error claiming monthly reward:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
