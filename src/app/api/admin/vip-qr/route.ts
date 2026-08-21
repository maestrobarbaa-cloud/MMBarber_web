import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.name || session.user.name !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Pro jednoduchost generujeme statický, nebo denně se měnící klíč
    // V reálu by se to dalo rotovat, zde použijeme "VIP_BARBER_GOLD" + dnešní datum
    const today = new Date().toISOString().split('T')[0]
    const secretKey = `MM_VIP_${today}`
    
    // Vygenerujeme URL, kterou si dá Admin do QR kódu na pult
    const url = new URL(request.url)
    const verifyLink = `${url.origin}/seznamka/verify?token=${secretKey}`

    return NextResponse.json({ link: verifyLink, key: secretKey })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate VIP link' }, { status: 500 })
  }
}
