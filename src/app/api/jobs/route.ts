import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get("location")
    const type = searchParams.get("type")

    const where: any = { 
      isActive: true,
      status: "APPROVED" 
    }
    
    if (location) {
      where.location = { contains: location } // Case insensitive in modern Prisma or handle accordingly
    }
    if (type) {
      where.type = type
    }

    const jobs = await prisma.jobOffer.findMany({
      where,
      include: {
        company: {
          select: { name: true, logoUrl: true, industry: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Jobs GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has a company profile
    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!companyProfile) {
      return NextResponse.json({ error: "Company profile required" }, { status: 403 })
    }

    const data = await req.json()
    const { title, type, description, requirements, salaryRange, location } = data

    if (!title || !type || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const jobOffer = await prisma.jobOffer.create({
      data: {
        companyId: companyProfile.id,
        title,
        type,
        description,
        requirements,
        salaryRange,
        location,
        status: companyProfile.status === "APPROVED" ? "APPROVED" : "PENDING"
      }
    })

    return NextResponse.json(jobOffer, { status: 201 })
  } catch (error) {
    console.error("Jobs POST Error:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
