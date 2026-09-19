import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.communityProject.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching community projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newProject = await prisma.communityProject.create({
      data: {
        title: data.title,
        status: data.status || "PREPARING",
        tag: data.tag || "GENERAL",
        desc: data.desc,
        descEn: data.descEn,
        dateLabel: data.dateLabel,
        icon: data.icon || "Folder",
        link: data.link,
        details: data.details, // Expecting stringified JSON or null
        isApproved: true, // Created by admin
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Error creating community project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
