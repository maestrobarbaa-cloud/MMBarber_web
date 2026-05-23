import type DatabaseType from 'better-sqlite3';
import path from 'path';
import { barbers } from '../data/barbers';

declare global {
  var _sqliteDb: DatabaseType.Database | undefined;
}

let _dbInstance: DatabaseType.Database | null = null;

function initDB(db: DatabaseType.Database) {
  // Seznamka Requests
  db.exec(`
    CREATE TABLE IF NOT EXISTS seznamka_requests (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      idealMan TEXT NOT NULL,
      characters TEXT,
      ageMin INTEGER NOT NULL,
      ageMax INTEGER NOT NULL,
      dealbreaker TEXT
    )
  `);

  // Barber Novinky
  db.exec(`
    CREATE TABLE IF NOT EXISTS barber_novinky (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      nickname TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);

  // Chat Messages
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      user TEXT NOT NULL,
      userId TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      likes TEXT,
      verifiedUser BOOLEAN DEFAULT 0
    )
  `);

  // Suggestions (Zlepseni)
  db.exec(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      user TEXT NOT NULL,
      userId TEXT NOT NULL,
      content TEXT NOT NULL,
      points TEXT,
      userPriority INTEGER NOT NULL,
      adminPriority INTEGER,
      status TEXT NOT NULL,
      likes TEXT,
      adminResponse TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER
    )
  `);

  // Hall of Fame
  db.exec(`
    CREATE TABLE IF NOT EXISTS hall_of_fame (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier TEXT NOT NULL,
      message TEXT,
      dateJoined INTEGER NOT NULL,
      avatarId INTEGER,
      active BOOLEAN DEFAULT 1
    )
  `);

  // Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Barbers
  db.exec(`
    CREATE TABLE IF NOT EXISTS barbers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image TEXT NOT NULL,
      desc TEXT NOT NULL,
      schedule TEXT NOT NULL,
      bookingLink TEXT NOT NULL,
      specializations TEXT,
      symbol TEXT NOT NULL,
      rankLevel INTEGER,
      rankTitle TEXT,
      rankStatus TEXT,
      rankNextIn TEXT,
      parentId TEXT,
      customChatText TEXT,
      orderIndex INTEGER,
      requiresUnlock BOOLEAN DEFAULT 0,
      unlockThreshold INTEGER DEFAULT 5,
      missionFailed BOOLEAN DEFAULT 0
    )
  `);

  // Gamification
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_fragments (
      id TEXT PRIMARY KEY,
      collected_ids TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  try { db.exec('ALTER TABLE barbers ADD COLUMN requiresUnlock BOOLEAN DEFAULT 0'); } catch (e) {}
  try { db.exec('ALTER TABLE barbers ADD COLUMN unlockThreshold INTEGER DEFAULT 5'); } catch (e) {}
  try { db.exec('ALTER TABLE barbers ADD COLUMN missionFailed BOOLEAN DEFAULT 0'); } catch (e) {}

  const countObj = db.prepare('SELECT COUNT(*) as count FROM barbers').get() as { count: number };
  if (countObj.count === 0) {
    const insert = db.prepare(`
      INSERT INTO barbers (id, name, role, image, desc, schedule, bookingLink, specializations, symbol, rankLevel, rankTitle, rankStatus, rankNextIn, parentId, orderIndex)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    barbers.forEach((b, index) => {
      insert.run(
        b.id, b.name, b.role, b.image, b.desc, b.schedule, b.bookingLink,
        JSON.stringify(b.specializations || []),
        b.symbol, b.rank?.level ?? null, b.rank?.title ?? null,
        b.rank?.status ?? null, b.rank?.nextRankIn ?? null, null, index + 1
      );
    });
  }
}

function getDb(): DatabaseType.Database {
  if (global._sqliteDb) return global._sqliteDb;
  if (_dbInstance) return _dbInstance;

  // LAZY LOAD: Prevents Next.js build evaluation crash!
  const Database = require('better-sqlite3');
  const dbPath = path.join(process.cwd(), 'mmbarber.db');
  const instance = new Database(dbPath, { verbose: console.log });
  instance.pragma('journal_mode = WAL');
  initDB(instance);

  _dbInstance = instance;
  if (process.env.NODE_ENV !== 'production') {
    global._sqliteDb = instance;
  }
  return instance;
}

// Create a proxy so the database is only instantiated when it's actually used
export const db = new Proxy({} as DatabaseType.Database, {
  get(target, prop: keyof DatabaseType.Database) {
    const instance = getDb();
    const value = instance[prop];
    if (typeof value === 'function') {
      return (value as Function).bind(instance);
    }
    return value;
  }
});
