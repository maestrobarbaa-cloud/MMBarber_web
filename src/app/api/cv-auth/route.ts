export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/jsonDb';
import crypto from 'crypto';

const SECRET_TEXT = {
  cs: `Čím víc to sleduju, tím víc si všímám, že všechno nějak souvisí. Ekonomika, historie, společnost, vztahy, trhy… všechno se chová v cyklech. Jednou je klid, pak tlak, pak zlom a zase nový začátek.

Často mám pocit, že v určitých fázích se mění úplně všechno najednou – firmy jedou víc na čísla než na kvalitu, lidi jsou víc pod tlakem, zkušení odcházejí a zároveň se mění i způsob, jak spolu lidé mluví a jak přemýšlí.

Do toho dneska na sociálních sítích vzniká spousta „pseudo odborníků“, hlavně na vztahy a psychologii, kde se z každé věci stává názor, analýza nebo byznys. A mám pocit, že to někdy spíš přidává chaos než klid.

Možná je to jen další fáze cyklu, kdy je všechno přehřáté informacemi, emocemi a tlakem na výkon. A pak se to zase nějak přerovná.

Zajímám se o ekonomiku, historii, dějepis a akciový trh – a čím víc to sleduju, tím víc mi přijde, že se vzorce opakují. A možná proto si některých věcí všímám víc, než dřív.

Jako malý jsem běhal s klackem a „vedl kluky“ venku, aniž bych to nějak řešil. A dneska mě to celé nějak přirozeně táhne k tomu víc chápat lidi, systém a to, jak věci fungují.

Začal jsem se víc zajímat i o genetiku a heraldiku – o původ, kořeny a to, co člověka formuje z dlouhodobého pohledu.

Neříkám, že vím, jak to přesně je. Jen si všímám, že všechno se nějak propojuje a zatím tomu nasvědčuje víc věcí, než se na první pohled zdá.`,
  en: `The more I watch it, the more I notice that everything is connected. Economics, history, society, relationships, markets... everything moves in cycles. First there's calm, then pressure, then a break, and a new beginning.

I often feel that in certain phases, everything changes at once – companies focus more on numbers than quality, people are under more pressure, experienced individuals leave, and at the same time, the way people talk and think changes.

On top of that, social media is full of "pseudo-experts" today, especially in relationships and psychology, where everything turns into an opinion, analysis, or business. And I feel it sometimes adds more chaos than calm.

Maybe it's just another phase of the cycle where everything is overheated with information, emotions, and pressure to perform. And then it will all realign somehow.

I'm interested in economics, history, and the stock market – and the more I watch it, the more I feel that patterns repeat. And maybe that's why I notice things more than I used to.

As a kid, I ran around with a stick "leading the boys" outside without overthinking it. And today, I'm naturally drawn to understanding people, systems, and how things work better.

I've also started getting more into genetics and heraldry – origins, roots, and what shapes a person from a long-term perspective.

I'm not saying I know exactly how it is. I just notice that everything is somehow connected, and so far, more things point to it than it seems at first glance.`
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const db = getDb();

  if (action === 'list') {
    return NextResponse.json({
        passwords: db.cv_passwords || [],
        articles: db.secret_articles || []
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    if (!db.cv_passwords) db.cv_passwords = [];
    if (!db.secret_articles) db.secret_articles = [];
    
    // Admin: Generate new password
    if (body.action === 'generate') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let newPass = '';
      for (let i = 0; i < 4; i++) newPass += chars.charAt(Math.floor(Math.random() * chars.length));
      newPass += '-';
      for (let i = 0; i < 4; i++) newPass += chars.charAt(Math.floor(Math.random() * chars.length));
      
      const entry = {
        id: crypto.randomUUID(),
        password: `KRYPTON-${newPass}`,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      
      db.cv_passwords.push(entry);
      saveDb();
      return NextResponse.json(entry);
    }
    
    // Admin: Delete password
    if (body.action === 'delete') {
      db.cv_passwords = db.cv_passwords.filter((p: any) => p.id !== body.id);
      saveDb();
      return NextResponse.json({ success: true });
    }

    // Admin: Add article
    if (body.action === 'add_article') {
      const entry = {
        id: crypto.randomUUID(),
        title: body.title,
        content: body.content,
        createdAt: Date.now(),
        barberId: body.barberId || 'tomas'
      };
      db.secret_articles.push(entry);
      saveDb();
      return NextResponse.json(entry);
    }

    // Admin: Delete article
    if (body.action === 'delete_article') {
      db.secret_articles = db.secret_articles.filter((a: any) => a.id !== body.id);
      saveDb();
      return NextResponse.json({ success: true });
    }

    // Client: Unlock CV
    if (body.action === 'unlock') {
      const { password, lang = 'cs' } = body;
      
      const passEntry = db.cv_passwords.find((p: any) => p.password === password);
      
      if (!passEntry) {
        return NextResponse.json({ success: false, error: 'invalid_password' }, { status: 401 });
      }
      
      if (Date.now() > passEntry.expiresAt) {
        return NextResponse.json({ success: false, error: 'expired_password' }, { status: 401 });
      }
      
      const content = lang === 'cs' ? SECRET_TEXT.cs : SECRET_TEXT.en;
      
      // We also send the dynamic articles for Tomas
      const articles = db.secret_articles
        .filter((a: any) => a.barberId === 'tomas')
        .sort((a: any, b: any) => b.createdAt - a.createdAt);

      return NextResponse.json({ success: true, text: content, articles });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
