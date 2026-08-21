import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { encryptMessage, decryptMessage } from '@/lib/encryption'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')

    if (!matchId) {
      return NextResponse.json({ error: 'Missing matchId' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Zkontrolujeme, zda tento match vůbec patří uživateli
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    })

    if (!match || (match.user1Id !== user.id && match.user2Id !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Ghost Mode (Mizející zprávy): Smažeme zprávy starší než messageRetentionDays (pokud není null)
    if (match.messageRetentionDays !== null) {
      const cutoffDate = new Date(Date.now() - match.messageRetentionDays * 24 * 60 * 60 * 1000)
      await prisma.message.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          OR: [
            { senderId: match.user1Id, receiverId: match.user2Id },
            { senderId: match.user2Id, receiverId: match.user1Id }
          ]
        }
      })
    }

    // Označíme přijaté zprávy jako přečtené
    await prisma.message.updateMany({
      where: {
        receiverId: user.id,
        senderId: match.user1Id === user.id ? match.user2Id : match.user1Id,
        isRead: false
      },
      data: { isRead: true }
    })

    // Najdeme historii zpráv
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: match.user1Id, receiverId: match.user2Id },
          { senderId: match.user2Id, receiverId: match.user1Id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    })

    // Dešifrujeme zprávy před odesláním uživateli
    const decryptedMessages = messages.map(msg => ({
      ...msg,
      text: decryptMessage(msg.text)
    }))
    
    // Zjistíme, jestli druhý uživatel píše
    const isOtherUserTyping = user.id === match.user1Id 
      ? (match.user2Typing && new Date(Date.now() - 5000) < match.user2Typing)
      : (match.user1Typing && new Date(Date.now() - 5000) < match.user1Typing);

    return NextResponse.json({ 
      messages: decryptedMessages, 
      currentUserId: user.id,
      messageRetentionDays: match.messageRetentionDays,
      isTyping: isOtherUserTyping
    })
  } catch (error) {
    console.error('Messages API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // LOCKDOWN KONTROLA
    const lockdown = await prisma.systemSettings.findUnique({ where: { key: 'LOCKDOWN_MODE' } })
    if (lockdown?.value === 'true') {
      return NextResponse.json({ error: 'System is under emergency lockdown maintenance. Please try again later.' }, { status: 503 })
    }

    const { targetUserId, text, imageUrl, audioUrl } = await request.json()

    if (!targetUserId || (!text && !imageUrl && !audioUrl)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // TOXIC & SCAM ŠTÍT
    if (text) {
      const toxicWords = ['kurv', 'zmrd', 'zkurv', 'píča', 'kokot', 'debil', 'hovn', 'prdel'];
      const scamRegex = /(bit\.ly|crypto|investice|whatsapp|telegram)/i;
      
      const isToxic = toxicWords.some(word => text.toLowerCase().includes(word));
      const isScam = scamRegex.test(text);

      if (isToxic || isScam) {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        
        // Zapsat do ThreatLogu
        await prisma.threatLog.create({
          data: {
            ip,
            path: '/api/messages (Chat Shield)',
            method: 'POST',
            payload: isToxic ? 'Toxic language' : 'Scam link detected',
            threatLevel: isScam ? 80 : 50
          }
        });

        if (isScam) {
          // Zablokovat scam
          return NextResponse.json({ error: 'Zpráva porušuje pravidla komunity (Detekován spam).' }, { status: 403 });
        } else {
          // U sprostých slov nesnižujeme rovnou celý účet, ale připíšeme postih
          await prisma.profile.update({
            where: { userId: user.id },
            data: {
              reportsCount: { increment: 1 },
              trustScore: { decrement: 5 }
            }
          }).catch(e => console.error("Chyba pri aktualizaci profilu po detekci sprosteho slova", e));
          
          // Zprávu propustíme (Frontend si ji vycenzuruje, pokud má zapnutý filtr)
        }
      }
    }

    // ŠIFROVÁNÍ ZPRÁVY
    const finalMessageText = text ? encryptMessage(text) : '';

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId: targetUserId,
        text: finalMessageText,
        url: imageUrl || null,
        audioUrl: audioUrl || null
      }
    })

    // Na klientovi ji chceme hned vidět dešifrovanou
    const responseMessage = { ...message, text: text || '' };

    // AI MOCK GURU RESPONDER
    // Pokud posíláme zprávu "AI GURU" (ověříme podle role v budoucnu nebo hardcoded id)
    // Tady simulujeme automatickou odpověď, protože to je ve tvém plánu!
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (targetUser?.role === 'AI_AGENT') {
      setTimeout(async () => {
        await prisma.message.create({
          data: {
            senderId: targetUserId,
            receiverId: user.id,
            text: "Jsem tvůj AI Wingman! (Zatím jen testovací zpráva, než mě napojíš na AI Model). Mám zanalyzovat tvůj profil?",
          }
        })
      }, 2000)
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Messages API Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { matchId, messageRetentionDays } = await request.json()

    if (!matchId || messageRetentionDays === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId }
    })

    if (!match || (match.user1Id !== user.id && match.user2Id !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { messageRetentionDays: messageRetentionDays === null ? null : Number(messageRetentionDays) }
    })

    // Smažeme rovnou staré zprávy, pokud je nový limit nastaven
    if (updatedMatch.messageRetentionDays !== null) {
      const cutoffDate = new Date(Date.now() - updatedMatch.messageRetentionDays * 24 * 60 * 60 * 1000)
      await prisma.message.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          OR: [
            { senderId: match.user1Id, receiverId: match.user2Id },
            { senderId: match.user2Id, receiverId: match.user1Id }
          ]
        }
      })
    }

    return NextResponse.json({ match: updatedMatch }, { status: 200 })
  } catch (error) {
    console.error('Messages API PATCH Error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
