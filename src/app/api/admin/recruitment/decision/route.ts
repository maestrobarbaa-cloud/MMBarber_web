import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, decision, adminNote } = await req.json();

    if (!id || !["ACCEPTED", "REJECTED"].includes(decision)) {
      return NextResponse.json({ error: "Neplatny request" }, { status: 400 });
    }

    const updated = await prisma.recruitmentApplication.update({
      where: { id },
      data: {
        status: decision,
        ...(adminNote !== undefined && {
          aiPersonalityReport: adminNote
        })
      }
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Decision API error:", error);
    return NextResponse.json({ error: "Interni chyba" }, { status: 500 });
  }
}
