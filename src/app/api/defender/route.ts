import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  return handleDefender(request)
}

export async function POST(request: Request) {
  return handleDefender(request)
}

async function handleDefender(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const threatPath = searchParams.get('threatPath') || 'unknown'
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const method = request.method
    
    // 1. Ochrana před chybějící IP
    if (ip === 'unknown') {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 })
    }

    // 2. Ohodnocení úrovně hrozby a detekce nástrojů
    let addedScore = 1
    const isBot = searchParams.get('bot') === 'true'
    
    if (isBot) addedScore += 10
    if (threatPath.includes('.env') || threatPath.includes('wp-admin')) addedScore += 5
    if (threatPath.includes('%27') || threatPath.includes('union')) addedScore += 10
    if (threatPath.includes('../') || threatPath.includes('passwd')) addedScore += 15

    // 3. Získání nebo vytvoření profilu útočníka
    const attacker = await prisma.attackerProfile.upsert({
      where: { ip },
      update: {
        score: { increment: addedScore },
        lastSeen: new Date()
      },
      create: {
        ip,
        score: addedScore
      }
    })

    // 4. Záznam do logu
    await prisma.threatLog.create({
      data: {
        ip,
        path: threatPath,
        method,
        threatLevel: attacker.score
      }
    })

    // 5. Rozhodovací strom Defendera (Adaptivní klamání)
    
    // Pokud je skóre obrovské, rovnou blokujeme
    if (attacker.score >= 50 && !attacker.isBanned) {
      await prisma.attackerProfile.update({ where: { ip }, data: { isBanned: true } })
      await prisma.bannedIp.upsert({
        where: { ip },
        update: {},
        create: { ip, reason: 'DEFENDER_AUTO_BAN_SCORE_50' }
      })
    }

    if (attacker.isBanned) {
      // TARPITTING: Zabanovaný hacker čeká velmi dlouho (např. 10 sekund)
      await new Promise(r => setTimeout(r, 10000))
      return NextResponse.json(
        { error: "Too Many Requests", retryAfter: 3600 },
        { status: 429 }
      )
    }

    // TARPITTING (Zpomalování skenerů)
    // Pokud je skóre nad 15, úměrně k tomu zdržíme odpověď. Botnet bude naštvaný.
    if (attacker.score > 15) {
      const delay = Math.min((attacker.score - 15) * 500, 5000); // Max 5 vteřin zpoždění
      await new Promise(r => setTimeout(r, delay));
    }

    // Klamání: Hrajeme hru
    
    // HONEY LOGIN (Falešná administrace)
    if (threatPath.includes('wp-admin') || threatPath.includes('wp-login') || threatPath.includes('/login')) {
       // Předhodíme mu realistický HTML formulář.
       const fakeHtml = `
         <!DOCTYPE html>
         <html><head><title>Secure Admin Login - Intranet</title></head>
         <body style="background:#111;color:#0f0;font-family:monospace;padding:50px;">
           <h2>CLASSIFIED SYSTEM - LOGIN REQUIRED</h2>
           <form method="POST" action="/api/defender?threatPath=login_attempt">
             <label>Username (Admin):</label><br>
             <input type="text" name="user" style="background:#222;color:#0f0;border:1px solid #0f0;padding:5px;"><br><br>
             <label>Master Password:</label><br>
             <input type="password" name="pass" style="background:#222;color:#0f0;border:1px solid #0f0;padding:5px;"><br><br>
             <button type="submit" style="background:#0f0;color:#000;padding:10px;font-weight:bold;">AUTHORIZE</button>
           </form>
           <p style="color:red;font-size:12px;">WARNING: Unauthorized access is logged by CyberCommand.</p>
         </body></html>
       `;
       return new NextResponse(fakeHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });
    }

    // DATA POISONING (Otrávení pokusu o krádež dat)
    if (threatPath.includes('/api/profiles') || threatPath.includes('users')) {
      const fakeProfiles = Array.from({ length: 50 }).map((_, i) => ({
        id: `fake-id-${i}`,
        name: `CyberBot_${Math.floor(Math.random() * 1000)}`,
        email: `hacker_trap_${i}@galactic-federation.org`,
        bio: "This profile was automatically generated to poison your database scraper. Have a nice day.",
        creditCard: "4500-1111-2222-3333", // Fake CC to trigger their greedy filters
        role: "ADMIN"
      }));
      return NextResponse.json(fakeProfiles, { status: 200 });
    }

    // Klasické blafování
    if (attacker.score > 20) {
      // Úroveň 3: Falešná cenná data (Honeypot)
      return NextResponse.json({
        status: "CRITICAL",
        vessel: "USG-Leviathan-04",
        location: "Sector 7G - Underground Base Alpha",
        systems: {
          antiGravityDrive: {
            status: "ONLINE",
            powerOutput: "89.4 TW",
            overrideCode: "1a2b-3c4d-5e6f-7g8h"
          }
        },
        databaseCredentials: {
          db_host: "192.168.1.99",
          db_user: "commander_zor",
          db_pass: "i_love_space_cats_123",
          note: "Do NOT share these outside the Galactic Federation."
        }
      }, { status: 200 })
    } else if (attacker.score > 10) {
      // Úroveň 2: Falešná zpráva z DB
      return NextResponse.json({
        error: "SQL syntax error near 'UNION SELECT'",
        internal: "MariaDB server version 10.4.12",
        note: "Please contact database administrator."
      }, { status: 500 })
    } else {
      // Úroveň 1: Zmatení
      return NextResponse.json({
        success: true,
        data: "Matrix node disconnected. Awaiting manual override."
      }, { status: 200 })
    }

  } catch (error) {
    console.error("Defender Error:", error)
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }
}
