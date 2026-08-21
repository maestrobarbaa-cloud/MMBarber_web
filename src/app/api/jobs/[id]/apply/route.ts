import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { coverLetter, resumeUrl } = await req.json()
    const { id: jobId } = await params

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobOfferId: {
          userId: session.user.id,
          jobOfferId: jobId
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json({ error: "Již jste na tuto nabídku odpověděli." }, { status: 400 })
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        jobOfferId: jobId,
        coverLetter,
        resumeUrl
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Job Application Error:", error)
    return NextResponse.json({ error: "Nepodařilo se odeslat odpověď." }, { status: 500 })
  }
}
