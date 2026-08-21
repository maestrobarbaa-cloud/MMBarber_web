import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    // In production, ensure session.user.role === 'ADMIN'

    const { id } = await params
    const { isVerifiedApplicant, applicantTrustScore } = await req.json()

    const user = await prisma.user.update({
      where: { id },
      data: { 
        ...(isVerifiedApplicant !== undefined && { isVerifiedApplicant }),
        ...(applicantTrustScore !== undefined && { applicantTrustScore })
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
