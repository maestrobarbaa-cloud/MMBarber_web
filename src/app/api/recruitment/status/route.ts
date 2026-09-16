import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get('applicantId');

    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }

    const application = await prisma.recruitmentApplication.findUnique({
      where: { applicantId }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: application.status,
      name: application.name
    });
  } catch (error) {
    console.error("Recruitment Status Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
