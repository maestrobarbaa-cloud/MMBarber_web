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
}

const defaultDb: DbSchema = {
  barbers: [],
  chat_messages: [],
  seznamka_requests: [],
  barber_novinky: [],
  suggestions: [],
  hall_of_fame: [],
  settings: {},
  user_fragments: []
};

let memDb: DbSchema | null = null;

function loadDbSync(): DbSchema {
  if (memDb) return memDb;
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
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
      fs.writeFileSync(dbPath, JSON.stringify(memDb, null, 2), 'utf8');
    } catch (err) {
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
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(memDb, null, 2), 'utf8');
  }
}
