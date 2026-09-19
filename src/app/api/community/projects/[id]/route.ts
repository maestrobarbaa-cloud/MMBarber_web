import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const updatedProject = await prisma.communityProject.update({
      where: { id: params.id },
      data: {
        title: data.title,
        status: data.status,
        tag: data.tag,
        desc: data.desc,
        descEn: data.descEn,
        dateLabel: data.dateLabel,
        icon: data.icon,
        link: data.link,
        details: data.details,
        isApproved: data.isApproved,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating community project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.communityProject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting community project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
