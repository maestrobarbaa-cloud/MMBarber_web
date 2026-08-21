import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    // In production, ensure session.user.role === 'ADMIN'
    
    const companies = await prisma.companyProfile.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 })
  }
}
