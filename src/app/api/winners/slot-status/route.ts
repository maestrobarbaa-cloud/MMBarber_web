export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const now = new Date();
    
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11
    
    // Period 1: Jan 1 - Jun 30 (Months 0-5)
    // Period 2: Jul 1 - Dec 31 (Months 6-11)
    
    let periodStart: Date;
    let periodEnd: Date;
    let nextPeriodStart: Date;
    
    if (month < 6) {
      periodStart = new Date(year, 0, 1);
      periodEnd = new Date(year, 5, 30, 23, 59, 59, 999);
      nextPeriodStart = new Date(year, 6, 1);
    } else {
      periodStart = new Date(year, 6, 1);
      periodEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      nextPeriodStart = new Date(year + 1, 0, 1);
    }
    
    const startTs = periodStart.getTime();
    const endTs = periodEnd.getTime();
    
    const slotWinnersThisPeriod = db.game_winners.filter((w: any) => 
      w.game === 'slot_machine' && w.createdAt >= startTs && w.createdAt <= endTs
    );
    
    const isAvailable = slotWinnersThisPeriod.length === 0;
    
    return NextResponse.json({ 
      available: isAvailable, 
      nextSeasonDate: nextPeriodStart.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
