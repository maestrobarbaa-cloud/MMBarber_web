import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user || !user.profile) {
      return NextResponse.json(null, { status: 404 })
    }

    const p = user.profile
    const formattedProfile = {
      ...p,
      photos: JSON.parse(p.photos),
      seeking: JSON.parse(p.seeking),
      extendedData: p.extendedData ? JSON.parse(p.extendedData) : {},
      physicallyVerifiedAt: p.physicallyVerifiedAt ? JSON.parse(p.physicallyVerifiedAt) : null,
      dateCheckins: p.dateCheckins ? JSON.parse(p.dateCheckins) : null
    }

    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
