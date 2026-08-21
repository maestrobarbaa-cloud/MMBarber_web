import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // HONEYPOT: Tento endpoint vypadá jako zranitelný konfigurační soubor.
  // Jakmile na něj bot/hacker vstoupí, pošleme mu naprosto zmatená "vesmírná" data.

  // 1. Zkusíme uživatele rovnou zabanovat na IP
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (ipAddress && ipAddress !== 'unknown') {
      // Zapíšeme ho na banlist
      await prisma.bannedIp.upsert({
        where: { ip: ipAddress },
        update: {},
        create: {
          ip: ipAddress,
          reason: 'HONEYPOT_TRIPPED_SPACESHIP'
        }
      })
    }
  } catch (error) {
    console.error("Honeypot DB error", error)
  }

  // 2. Vrátíme mu naprostý nesmysl a ať se snaží to "hacknout" dál
  const fakeSpaceshipData = {
    status: "CRITICAL",
    vessel: "USG-Leviathan-04",
    location: "Sector 7G - Underground Base Alpha",
    systems: {
      antiGravityDrive: {
        status: "ONLINE",
        powerOutput: "89.4 TW",
        coreTemperature: "4500K",
        overrideCode: "1a2b-3c4d-5e6f-7g8h"
      },
      shieldGenerators: {
        status: "COMPROMISED",
        integrity: "34%",
        lastAttackDetected: "2084-12-14T04:22:11Z",
        attackerOrigin: "Sirius B"
      },
      lifeSupport: {
        status: "STABLE",
        oxygenLevel: "98%",
        artificialGravity: "9.81 m/s2"
      }
    },
    databaseCredentials: {
      db_host: "192.168.1.99",
      db_user: "commander_zor",
      db_pass: "i_love_space_cats_123",
      note: "Do NOT share these outside the Galactic Federation."
    },
    classifiedPayload: [
      "Alien artifacts from Kepler-186f",
      "Cryogenic pods: 42 active",
      "Time displacement module (damaged)"
    ]
  }

  // Vracíme s 200 OK, aby si útočník myslel, že vyhrál jackpot.
  return NextResponse.json(fakeSpaceshipData, { status: 200 })
}
