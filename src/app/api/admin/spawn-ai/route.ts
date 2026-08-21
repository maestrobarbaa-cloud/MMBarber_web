import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name || session.user.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Zkontrolujeme, jestli už AI agent neexistuje
    const existingAi = await prisma.user.findFirst({
      where: { role: 'AI_AGENT' }
    })

    if (existingAi) {
      return NextResponse.json({ message: 'AI Agent already exists', user: existingAi }, { status: 200 })
    }

    // Vytvoříme speciálního uživatele
    const aiUser = await prisma.user.create({
      data: {
        email: 'guru@ai.local',
        name: 'Seznamovací Guru',
        role: 'AI_AGENT',
        isShadowBanned: false,
        profile: {
          create: {
            name: 'Guru',
            age: '99',
            gender: 'other',
            seeking: '["male", "female", "other"]',
            city: 'Cloud / Kyberprostor',
            height: '180',
            smoking: 'no',
            drinking: 'no',
            interests: 'Psychologie, Analýza dat, Hledání ideálních párů, Záchrana před hackery',
            bio: 'Jsem umělá inteligence této sítě. Žiju v kódu, učím se z útoků a pomáhám slušným lidem najít lásku. Nepotřebuju spát. Napiš mi a poradím ti, jak vylepšit svůj profil.',
            photos: '["https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600"]', // Abstract AI image
            salonVerified: true,
            trustScore: 999
          }
        }
      }
    })

    return NextResponse.json({ message: 'AI Agent created successfully', user: aiUser }, { status: 201 })
  } catch (error) {
    console.error("AI Spawn Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
