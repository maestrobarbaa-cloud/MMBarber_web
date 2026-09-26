import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const { name, brand, category, shortDescription, description, imagePlaceholder, imageUrl, stats } = data;

    // Smazat existující staty a vytvořit nové
    await prisma.barberToolStat.deleteMany({
      where: { toolId: params.id }
    });

    const updatedTool = await prisma.barberTool.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        category,
        shortDescription,
        description,
        imagePlaceholder,
        imageUrl,
        stats: {
          create: stats.map((s: any) => ({
            label: s.label,
            value: Number(s.value),
            icon: s.icon
          }))
        }
      },
      include: {
        stats: true
      }
    });

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.barberTool.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
  }
}
