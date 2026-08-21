import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const setting = await prisma.systemSettings.findUnique({
      where: { key: 'LOCKDOWN_MODE' }
    })
    return NextResponse.json({ lockdown: setting?.value === 'true' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name || session.user.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { enable } = await request.json()

    await prisma.systemSettings.upsert({
      where: { key: 'LOCKDOWN_MODE' },
      update: { value: enable ? 'true' : 'false' },
      create: { key: 'LOCKDOWN_MODE', value: enable ? 'true' : 'false' }
    })

    return NextResponse.json({ success: true, lockdown: enable })
  } catch (error) {
    console.error("Lockdown Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
