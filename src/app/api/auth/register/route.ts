import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Zkontrolujeme, jestli uživatel neexistuje
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Tento e-mail už se v Síti nachází.' }, { status: 400 })
    }

    // Anti-farming check
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    const accountsOnIp = await prisma.user.count({
      where: { ipAddress }
    })

    const isFarming = accountsOnIp >= 2
    const mmcoins = isFarming ? 0 : 5
    const freeBoosts = isFarming ? 0 : 5
    const isShadowBanned = isFarming

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'USER',
        ipAddress,
        mmcoins,
        freeBoosts,
        isShadowBanned
      }
    })

    return NextResponse.json(
      { message: 'Registrace proběhla úspěšně', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json({ error: 'Došlo k chybě při registraci' }, { status: 500 })
  }
}
