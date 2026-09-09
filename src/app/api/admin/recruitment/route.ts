import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single application
      const application = await prisma.recruitmentApplication.findUnique({
        where: { id }
      });
      if (!application) {
        return NextResponse.json({ error: 'Nenalezeno' }, { status: 404 });
      }
      return NextResponse.json(application);
    }

    // List all
    const applications = await prisma.recruitmentApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(applications);

  } catch (error) {
    console.error("Admin Recruitment GET error:", error);
    return NextResponse.json({ error: 'Interní chyba' }, { status: 500 });
  }
}
