import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const current = await prisma.systemSettings.findUnique({ where: { key: 'GLOBAL_VIEWS' } });
    
    // Nastavíme počáteční hodnotu na např. 25420, pokud ještě neexistuje,
    // aby to vypadalo, že už to běží dlouho. Tuto hodnotu lze v DB kdykoliv změnit.
    const currentViews = current ? parseInt(current.value) || 25420 : 25420;
    const newViews = currentViews + 1;
    
    await prisma.systemSettings.upsert({
      where: { key: 'GLOBAL_VIEWS' },
      update: { value: String(newViews) },
      create: { key: 'GLOBAL_VIEWS', value: String(newViews) }
    });
    
    return NextResponse.json({ views: newViews });
  } catch (error) {
    console.error('Error updating global views:', error);
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
  }
}
