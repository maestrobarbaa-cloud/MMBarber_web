import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { GoogleGenAI } from '@google/genai'

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

    const { targetUserId, action } = await request.json()
    // action: 'like' | 'pass'

    if (!targetUserId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'like') {
      // 1. Zjistíme, jestli nás už tento uživatel lajknul
      const reciprocalLike = await prisma.like.findUnique({
        where: {
          fromId_toId: {
            fromId: targetUserId,
            toId: user.id
          }
        }
      })

        if (reciprocalLike) {
          // JE TO MATCH!
          const match = await prisma.match.create({
            data: {
              user1Id: user.id,
              user2Id: targetUserId
            }
          })
          
          // Můžeme smazat ten původní lajk, už je z toho Match
          await prisma.like.delete({
            where: { id: reciprocalLike.id }
          })
          
          // -- AI PROAKTIVNÍ DOHAZOVAČ (Guru) --
          try {
            // Find both user profiles
            const targetUser = await prisma.user.findUnique({ where: { id: targetUserId }, include: { profile: true } });
            const sourceUser = await prisma.user.findUnique({ where: { id: user.id }, include: { profile: true } });
            
            // Check if Guru exists
            const guru = await prisma.user.findUnique({ where: { email: 'guru@mmbarber.cz' } });
            
            if (guru && sourceUser?.profile && targetUser?.profile) {
              const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
              const prompt = `Jsi Seznamovací Guru. Tvoji dva klienti se právě propojili (Match). 
Uživatel 1: Jméno: ${sourceUser.name}, Zájmy: ${sourceUser.profile.interests}, Bio: ${sourceUser.profile.bio}
Uživatel 2: Jméno: ${targetUser.name}, Zájmy: ${targetUser.profile.interests}, Bio: ${targetUser.profile.bio}
Napiš vtipnou a přátelskou zprávu (max 2 věty), která prolomí ledy a zmíní nějaké jejich případné společné zájmy nebo udělá narážku na to, o čem by si měli začít psát. Zpráva je adresována oběma. Začni například "Gratuluji k Matchi! Všiml jsem si, že..."`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
              });
              
              const icebreaker = response.text || "Gratuluji k Matchi! Ledy jsou prolomeny, nestyďte se napsat první zprávu.";
              
              // Pošleme zprávu od Gurua pro Uživatele 1 i Uživatele 2
              await prisma.message.create({ data: { senderId: guru.id, receiverId: sourceUser.id, text: icebreaker } });
              await prisma.message.create({ data: { senderId: guru.id, receiverId: targetUser.id, text: icebreaker } });
            }
          } catch (aiError) {
            console.error('Failed to generate AI Icebreaker:', aiError);
          }
  
          return NextResponse.json({ isMatch: true, match })
        } else {
        // Není to match, jen uložíme náš like
        await prisma.like.upsert({
          where: {
            fromId_toId: {
              fromId: user.id,
              toId: targetUserId
            }
          },
          update: {},
          create: {
            fromId: user.id,
            toId: targetUserId
          }
        })

        return NextResponse.json({ isMatch: false })
      }
    } else {
      // Action === 'pass'
      // Tady můžeme implementovat tabulku "Dislikes" nebo "Passes" pokud bychom
      // chtěli zamezit zobrazení profilu v budoucnu.
      return NextResponse.json({ isMatch: false })
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to process swipe' }, { status: 500 })
  }
}
