import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
  // Ochrana endpointu pomocí secret klíče, pokud je cron spouštěn externě
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== 'cr0n_s3cr3t_m1ck4') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const now = new Date();
    
    let processed = 0;

    for (const reminder of db.reminders || []) {
      if (reminder.sent) continue;

      const appointment = db.appointments.find((a: any) => a.id === reminder.appointmentId);
      if (!appointment) continue; // Rezervace byla smazána

      const aptDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const hoursDiff = (aptDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Pokud čas do rezervace je menší nebo roven požadovanému času předem, pošleme upozornění
      if (hoursDiff > 0 && hoursDiff <= reminder.hoursBefore) {
        
        if (reminder.type === 'EMAIL') {
          // TODO: Zde by proběhlo reálné odeslání přes Nodemailer
          console.log(`Odesílám EMAIL klientovi ${appointment.customerEmail} pro rezervaci ${appointment.id}`);
          // const transporter = nodemailer.createTransport({ ... });
          // await transporter.sendMail({ ... });
        } else if (reminder.type === 'SMS') {
          // TODO: Zde by proběhlo volání na SMS bránu (Twilio / GoSMS)
          console.log(`Odesílám SMS na číslo ${appointment.customerPhone} pro rezervaci ${appointment.id}`);
        }

        reminder.sent = true;
        processed++;
      }
    }

    if (processed > 0) {
      saveDb();
    }

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    console.error('Cron reminder error:', error);
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}
