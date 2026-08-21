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

    const vouchers = await prisma.matchVoucher.findMany({
      where: { companyId: companyProfile.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(vouchers)
  } catch (error) {
    console.error("Company Vouchers GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch company vouchers" }, { status: 500 })
  }
}

export async function POST(req: Request) {
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

    const body = await req.json()
    const { title, description, discount, code, totalAvailable, isActive } = body

    if (!title || !description || !discount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const voucher = await prisma.matchVoucher.create({
      data: {
        companyId: companyProfile.id,
        title,
        description,
        discount,
        code: code || null,
        totalAvailable: parseInt(totalAvailable) || 0,
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json(voucher, { status: 201 })
  } catch (error) {
    console.error("Company Vouchers POST Error:", error)
    return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 })
  }
}
