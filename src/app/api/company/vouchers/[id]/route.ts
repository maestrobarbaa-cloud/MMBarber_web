import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: voucherId } = await params;
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

    const existingVoucher = await prisma.matchVoucher.findUnique({
      where: { id: voucherId }
    })

    if (!existingVoucher || existingVoucher.companyId !== companyProfile.id) {
      return NextResponse.json({ error: "Voucher not found or access denied" }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, discount, code, totalAvailable, isActive } = body

    const updatedVoucher = await prisma.matchVoucher.update({
      where: { id: voucherId },
      data: {
        title: title !== undefined ? title : existingVoucher.title,
        description: description !== undefined ? description : existingVoucher.description,
        discount: discount !== undefined ? discount : existingVoucher.discount,
        code: code !== undefined ? code : existingVoucher.code,
        totalAvailable: totalAvailable !== undefined ? parseInt(totalAvailable) : existingVoucher.totalAvailable,
        isActive: isActive !== undefined ? isActive : existingVoucher.isActive,
      }
    })

    return NextResponse.json(updatedVoucher)
  } catch (error) {
    console.error("Company Voucher PUT Error:", error)
    return NextResponse.json({ error: "Failed to update voucher" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: voucherId } = await params;
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

    const existingVoucher = await prisma.matchVoucher.findUnique({
      where: { id: voucherId }
    })

    if (!existingVoucher || existingVoucher.companyId !== companyProfile.id) {
      return NextResponse.json({ error: "Voucher not found or access denied" }, { status: 404 })
    }

    await prisma.matchVoucher.delete({
      where: { id: voucherId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Company Voucher DELETE Error:", error)
    return NextResponse.json({ error: "Failed to delete voucher" }, { status: 500 })
  }
}
