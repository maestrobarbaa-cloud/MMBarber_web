import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const job = await prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: true
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Job GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}
