import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure this path matches your auth options
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('idCard') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Pro účely GDPR a soukromí obrázek NIKDY neukládáme na disk ani do DB.
    // Převod na base64 pro odeslání do AI (pokud budeme volat AI)
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // ----------------------------------------------------------------------
    // INTEGRACE AI (OpenAI Vision / Google Gemini)
    // Zde je ukázka, jak by se volalo OpenAI. 
    // Pro otestování bez klíče nasimulujeme zpoždění a úspěch.
    // ----------------------------------------------------------------------
    
    let isVerifiedByAi = false;
    
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  { 
                    type: "text", 
                    text: "Analyzuj tento obrázek. Je na něm jasně rozpoznatelný platný doklad totožnosti (občanský průkaz, pas nebo řidičský průkaz)? Odpověz pouze 'ANO' nebo 'NE'." 
                  },
                  { 
                    type: "image_url", 
                    image_url: { url: `data:${file.type};base64,${base64Image}` } 
                  }
                ]
              }
            ],
            max_tokens: 10
          })
        });

        const aiData = await aiResponse.json();
        const aiText = aiData.choices?.[0]?.message?.content?.trim().toUpperCase() || '';
        
        isVerifiedByAi = aiText.includes('ANO');
      } catch (aiError) {
        console.error("Chyba při komunikaci s AI:", aiError);
        return NextResponse.json({ error: 'AI verification failed' }, { status: 500 });
      }
    } else {
      // SIMULACE pro testovací účely (pokud není zadán API klíč)
      console.log("OPENAI_API_KEY nenalezen. Simuluji ověření (AI mock).");
      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulace zpoždění sítě/AI
      isVerifiedByAi = true; // Vždy potvrdí pro účely testování UI
    }

    if (!isVerifiedByAi) {
      return NextResponse.json({ error: 'Doklad nebyl umělou inteligencí rozpoznán nebo je neplatný.' }, { status: 400 });
    }

    // Aktualizace uživatele v databázi
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { idVerified: true }
    });

    return NextResponse.json({ success: true, verified: updatedUser.idVerified });

  } catch (error) {
    console.error('ID Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
