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

    const allVouchers = await prisma.matchVoucher.findMany({
      where: { 
        isActive: true
      },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const vouchers = allVouchers.filter(v => v.totalAvailable === 0 || v.totalAvailable > v.usedCount)

    return NextResponse.json(vouchers)
  } catch (error) {
    console.error("Match Vouchers GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch match vouchers" }, { status: 500 })
  }
}
