import { NextResponse } from 'next/server';
import { getDb } from '@/lib/jsonDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const dateStr = searchParams.get('date');

    if (!barberId) {
      return NextResponse.json({ error: 'Missing barberId' }, { status: 400 });
    }

    const db = getDb();
    
    // Helper function to get slots for a specific date
    const getSlotsForDate = (dateToGenerate: string) => {
      const existingAppointments = (db.appointments || []).filter(
        (a: any) => a.barberId === barberId && a.date === dateToGenerate && a.status !== 'cancelled'
      );

      const slots = [];
      const startHour = 9;
      const endHour = 18;

      for (let h = startHour; h < endHour; h++) {
        for (let m of [0, 30]) {
          const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          
          const isBooked = existingAppointments.some((app: any) => {
            return app.time === timeString;
          });

          if (!isBooked) {
            slots.push(timeString);
          }
        }
      }
      return slots;
    };

    if (startDateStr && endDateStr) {
      // Range mode
      const result: Record<string, string[]> = {};
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      
      let current = new Date(start);
      while (current <= end) {
        const dStr = current.toISOString().split('T')[0];
        result[dStr] = getSlotsForDate(dStr);
        current.setDate(current.getDate() + 1);
      }
      return NextResponse.json({ range: result });
      
    } else if (dateStr) {
      // Single date mode
      return NextResponse.json({ slots: getSlotsForDate(dateStr) });
    } else {
      return NextResponse.json({ error: 'Missing date or date range' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
