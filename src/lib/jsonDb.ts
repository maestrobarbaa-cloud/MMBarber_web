import fs from 'fs';
import path from 'path';

// Zaručíme, že se DB uloží do adresáře, který vždy existuje.
const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'mmbarber_db.json');

export interface DbSchema {
  barbers: any[];
  chat_messages: any[];
  seznamka_requests: any[];
  barber_novinky: any[];
  suggestions: any[];
  hall_of_fame: any[];
  settings: Record<string, string>;
  user_fragments: any[];
  game_winners: any[];
  cv_passwords: any[];
  secret_articles: any[];
  services: any[];
  appointments: any[];
  reminders: any[];
  dating_users: any[];
  dating_profiles: any[];
  dating_matches: any[];
  dating_friend_requests: any[];
  dating_friendships: any[];
  electrician_prices: Record<string, number>;
}

const defaultDb: DbSchema = {
  barbers: [],
  chat_messages: [],
  seznamka_requests: [],
  barber_novinky: [],
  suggestions: [],
  hall_of_fame: [],
  settings: {},
  user_fragments: [],
  game_winners: [],
  cv_passwords: [],
  secret_articles: [],
  services: [],
  appointments: [],
  reminders: [],
  dating_users: [],
  dating_profiles: [],
  dating_matches: [],
  dating_friend_requests: [],
  dating_friendships: [],
  electrician_prices: {
    byt: 2000, dum: 5000, dum_mult: 1.1, komerce: 12000, komerce_mult: 1.3, hala: 25000, hala_mult: 1.5,
    remodel: 4000, service: 1000,
    subpanel: 8500, panel100A: 25000, panel200A: 38000, panel400A: 65000,
    smartPanel: 55000, dataRack: 18000, solarPrep: 12500, bessPrep: 9500,
    milling: 180, wirePulling: 65, ledStrips: 650,
    sockets: 450, smartSockets: 850, dataSockets: 600, lights: 450, recessed: 600, outdoorLight: 1200,
    cctv: 2500, security: 1100, detectors: 800,
    hvac: 4500, ev: 8500, induction: 3500,
    surgeProtection: 6500, thermo: 3500, projectDocs: 15000,
    plasteringBase: 100, plasteringMilling: 60, cleanup: 2500, revision: 3500, hours: 550, expressMult: 1.3
  }
};

let memDb: DbSchema | null = null;

function loadDbSync(): DbSchema {
  if (memDb) return memDb;
  
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true, mode: 0o777 });
    } catch (e: any) {
      console.error(`[DB ERROR] Nelze vytvořit složku ${dbDir}. Nastavte práva (777) pro root projektu v aaPanelu!`, e?.message);
    }
  }

  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      memDb = JSON.parse(data);
      // Fallback fallback initialization of empty arrays
      for (const key of Object.keys(defaultDb)) {
        if (!memDb![key as keyof DbSchema]) {
          (memDb as any)[key] = (defaultDb as any)[key];
        }
      }
    } else {
      memDb = JSON.parse(JSON.stringify(defaultDb)); // deep copy
    }
  } catch (e) {
    console.error("Failed to load local DB", e);
    memDb = JSON.parse(JSON.stringify(defaultDb));
  }
  
  // Seed barbers if empty
  if (memDb!.barbers.length === 0) {
    try {
      const { barbers: initialBarbers } = require('../data/barbers');
      memDb!.barbers = initialBarbers.map((b: any, index: number) => ({
        id: b.id,
        name: b.name,
        role: b.role,
        image: b.image,
        desc: b.desc,
        schedule: b.schedule,
        bookingLink: b.bookingLink,
        specializations: JSON.stringify(b.specializations || []),
        symbol: b.symbol,
        rankLevel: b.rank?.level ?? null,
        rankTitle: b.rank?.title ?? null,
        rankStatus: b.rank?.status ?? null,
        rankNextIn: b.rank?.nextRankIn ?? null,
        parentId: null,
        customChatText: null,
        orderIndex: index + 1,
        requiresUnlock: 0,
        unlockThreshold: 5,
        missionFailed: 0
      }));
      fs.writeFileSync(dbPath, JSON.stringify(memDb, null, 2), { encoding: 'utf8', mode: 0o666 });
    } catch (err: any) {
      console.error("[DB ERROR] Failed to seed barbers. Zkontrolujte práva pro zápis v aaPanelu:", err?.message);
      console.error("Failed to seed barbers", err);
    }
  }

  return memDb!;
}

export function getDb(): DbSchema {
  return loadDbSync();
}

export function saveDb() {
  if (memDb) {
    try {
      if (!fs.existsSync(dbDir)) {
        try {
          fs.mkdirSync(dbDir, { recursive: true, mode: 0o777 });
        } catch (dirErr: any) {
          console.error(`[DB ERROR] Nelze vytvořit složku ${dbDir}. Nastavte práva (777) pro složku projektu v aaPanelu!`, dirErr?.message);
        }
      }
      fs.writeFileSync(dbPath, JSON.stringify(memDb, null, 2), { encoding: 'utf8', mode: 0o666 });
    } catch (e: any) {
      console.error(`\n[DB CRITICAL ERROR] Nelze ulozit databazi do: ${dbPath}`);
      console.error(`[DB TIP pro aaPanel] Přejděte do aaPanel -> Files -> najděte složku projektu a v ní složku 'data'.`);
      console.error(`[DB TIP pro aaPanel] Klikněte na složku 'data' -> Permission -> nastavte na 777 (včetně podsložek), nebo změňte vlastníka (Owner) na 'www'.`);
      console.error(`[Detail chyby]:`, e?.message, `\n`);
    }
  }
}
