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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : new Date(0)
    lastActive.setHours(0, 0, 0, 0)

    let dailyMinutes = user.dailyMinutesSpent
    let streakDays = user.activityStreakDays
    
    // Reset minutes if it's a new day
    if (lastActive.getTime() < today.getTime()) {
      dailyMinutes = 0
      
      // Reset streak if they missed a day (yesterday)
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastActive.getTime() < yesterday.getTime()) {
        streakDays = 0
      }
    }

    // Increment minutes
    dailyMinutes += 1

    let rewardGiven = null
    let earnedCoins = 0

    // Check if they reached the required minutes for the first time today
    if (dailyMinutes === REWARDS_CONFIG.ACTIVITY_REQUIRED_MINUTES) {
      streakDays += 1
      
      if (streakDays >= REWARDS_CONFIG.ACTIVITY_REQUIRED_DAYS) {
        earnedCoins = Math.floor(REWARDS_CONFIG.ACTIVITY_REWARD_COINS * getSeasonalMultiplier())
        rewardGiven = `Získali jste +${earnedCoins} MMCOINů za vaši týdenní aktivitu!`
        streakDays = 0 // Reset after granting reward
      } else {
        rewardGiven = `Denní aktivita splněna! (Den ${streakDays}/${REWARDS_CONFIG.ACTIVITY_REQUIRED_DAYS})`
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyMinutesSpent: dailyMinutes,
        lastActiveDate: new Date(),
        activityStreakDays: streakDays,
        ...(earnedCoins > 0 && { mmcoins: { increment: earnedCoins } })
      }
    })

    return NextResponse.json({ 
      success: true, 
      rewardGiven,
      dailyMinutesSpent: updatedUser.dailyMinutesSpent
    })
  } catch (error) {
    console.error('Error recording activity:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
