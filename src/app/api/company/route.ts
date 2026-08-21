import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!companyProfile) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
    }

    return NextResponse.json(companyProfile)
  } catch (error) {
    console.error("Company GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch company profile" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { name, ico, description, logoUrl, website, address, industry } = data

    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    let isVerified = false;
    let status = "PENDING";

    // Automatic ARES verification
    if (ico) {
      try {
        const aresRes = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`)
        if (aresRes.ok) {
           const aresData = await aresRes.json();
           if (aresData.obchodniJmeno) {
             const aresName = aresData.obchodniJmeno.toLowerCase();
             const inputName = name.toLowerCase();
             
             // Simple fuzzy match: if they share at least the first word or input is a substring
             const aresFirstWord = aresName.split(' ')[0];
             if (inputName.includes(aresFirstWord) || aresName.includes(inputName.split(' ')[0])) {
                isVerified = true;
                status = "APPROVED";
             }
           }
        }
      } catch (e) {
        console.error("ARES verification failed", e);
      }
    }

    const profile = await prisma.companyProfile.upsert({
      where: { userId: session.user.id },
      update: {
        name,
        ico,
        description,
        logoUrl,
        website,
        address,
        industry,
        isVerified,
        status
      },
      create: {
        userId: session.user.id,
        name,
        ico,
        description,
        logoUrl,
        website,
        address,
        industry,
        isVerified,
        status
      }
    })

    // Optionally update user role to COMPANY if not already
    if (session.user.role !== "COMPANY") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "COMPANY" }
      })
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error("Company POST Error:", error)
    return NextResponse.json({ error: "Failed to update company profile" }, { status: 500 })
  }
}
