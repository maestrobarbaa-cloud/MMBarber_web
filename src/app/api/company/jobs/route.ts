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

    // Fetch all jobs belonging to this company, regardless of status
    const jobs = await prisma.jobOffer.findMany({
      where: { companyId: companyProfile.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Company Jobs GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch company jobs" }, { status: 500 })
  }
}
