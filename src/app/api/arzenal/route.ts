import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const initialTools = [
  {
    name: "Magic Clip Cordless",
    brand: "Wahl",
    category: "Clipper",
    shortDescription: "Legendární strojek s 'Crunch' technologií.",
    description: "Bezkonkurenční na fade a plynulé přechody. Naprostý základ každého správného Capa. Skvělý na každodenní zátěž a vytváří perfektní texturu díky speciální hlavici.",
    imagePlaceholder: "WAHL",
    stats: [
      { label: "Hlavice a nože", value: 95, icon: "Scissors" },
      { label: "Motor", value: 85, icon: "Zap" },
      { label: "Zpracování", value: 80, icon: "Shield" },
      { label: "Design", value: 90, icon: "Sparkles" },
      { label: "Praktičnost", value: 95, icon: "Activity" },
      { label: "Váha", value: 85, icon: "Weight" },
      { label: "Vnitřní konstrukce", value: 80, icon: "Cog" },
    ]
  },
  {
    name: "Skeleton FX",
    brand: "Babyliss Pro",
    category: "Trimmer",
    shortDescription: "Nejlepší konturka s 360° obnaženou čepelí.",
    description: "Řeže čistě jako katana, ideální na detailní práci a ostré linie. Kostra z pevného kovu zaručuje, že stroj něco vydrží, ale je třeba se starat o nože, které se rády tupí bez oleje.",
    imagePlaceholder: "BBLYSS",
    stats: [
      { label: "Hlavice a nože", value: 100, icon: "Scissors" },
      { label: "Motor", value: 90, icon: "Zap" },
      { label: "Zpracování", value: 95, icon: "Shield" },
      { label: "Design", value: 95, icon: "Sparkles" },
      { label: "Praktičnost", value: 85, icon: "Activity" },
      { label: "Váha", value: 75, icon: "Weight" },
      { label: "Vnitřní konstrukce", value: 80, icon: "Cog" },
    ]
  }
];

export async function GET() {
  try {
    let tools = await prisma.barberTool.findMany({
      include: {
        stats: true
      }
    });

    // Auto-seed
    if (tools.length === 0) {
      for (const t of initialTools) {
        await prisma.barberTool.create({
          data: {
            name: t.name,
            brand: t.brand,
            category: t.category,
            shortDescription: t.shortDescription,
            description: t.description,
            imagePlaceholder: t.imagePlaceholder,
            stats: {
              create: t.stats.map(s => ({
                label: s.label,
                value: s.value,
                icon: s.icon
              }))
            }
          }
        });
      }
      tools = await prisma.barberTool.findMany({ include: { stats: true } });
    }

    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, brand, category, shortDescription, description, imagePlaceholder, imageUrl, stats } = data;

    const newTool = await prisma.barberTool.create({
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

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
  }
}
