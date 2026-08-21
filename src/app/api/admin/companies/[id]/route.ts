import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    // In production, ensure session.user.role === 'ADMIN'

    const { id } = await params
    const { status, tier } = await req.json()

    const company = await prisma.companyProfile.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(tier && { tier })
      }
    })

    // If company is APPROVED, we might want to automatically approve their pending jobs
    if (status === "APPROVED") {
      await prisma.jobOffer.updateMany({
        where: { companyId: id, status: "PENDING" },
        data: { status: "APPROVED" }
      })
    }

    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
  }
}
