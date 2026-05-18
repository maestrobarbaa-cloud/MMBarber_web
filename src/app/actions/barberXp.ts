"use server";

import fs from "fs";
import path from "path";
import os from "os";
import { headers } from "next/headers";

// Safe database persistence inside the OS home directory of your server
// This guarantees that data is NEVER wiped when you deploy new versions of the website code!
const DB_FILE_PATH = path.join(os.homedir(), ".mmbarber-ratings-data.json");
const IP_LOG_FILE_PATH = path.join(os.homedir(), ".mmbarber-ratings-ip-log.json");

export interface BarberStats {
  xp: number;
  likes: number;
  stat1: number;
  stat2: number;
  stat3: number;
  stat4: number;
  stat5: number;
  stat6: number;
}

export interface DBStructure {
  tomas: BarberStats;
  nella: BarberStats;
  [barberId: string]: BarberStats;
}

const DEFAULT_DB: DBStructure = {
  tomas: { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 },
  nella: { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 },
  "roman-jakubcak": { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 }
};

// Safe helper to read ratings database
export async function getGlobalStatsAction(): Promise<DBStructure> {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading self-hosted ratings DB file:", error);
    return DEFAULT_DB;
  }
}

// Safe helper to write ratings database
async function writeDb(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing self-hosted ratings DB file:", error);
  }
}

// Safe helper to read IP log
async function readIpLog(): Promise<Record<string, string[]>> {
  try {
    if (!fs.existsSync(IP_LOG_FILE_PATH)) {
      return {};
    }
    const raw = fs.readFileSync(IP_LOG_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

// Safe helper to write IP log
async function writeIpLog(log: Record<string, string[]>) {
  try {
    fs.writeFileSync(IP_LOG_FILE_PATH, JSON.stringify(log, null, 2), "utf-8");
  } catch (error) {}
}

// Clean IP log records from prior days
function cleanIpLogsForToday(log: Record<string, string[]>): Record<string, string[]> {
  const today = new Date().toDateString();
  const cleaned: Record<string, string[]> = {};
  if (log[today]) {
    cleaned[today] = log[today];
  }
  return cleaned;
}

/**
 * Server Action: Registers a secure vote for a specific attribute of a barber on your server
 */
export async function addVoteToBarberStatAction(
  barberId: string, 
  statIndex: number
): Promise<{ success: boolean; error?: string; stats?: DBStructure }> {
  try {
    if (!barberId || typeof statIndex !== "number" || statIndex < 0 || statIndex > 5) {
      return { success: false, error: "Neplatné parametry" };
    }

    const allowedIds = ["tomas", "nella", "roman-jakubcak"];
    if (!allowedIds.includes(barberId)) {
      return { success: false, error: "Neznámý partner/barber" };
    }

    // Resolve client IP securely on the server to prevent spoofing
    const headerList = await headers();
    const clientIp = headerList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    const today = new Date().toDateString();
    let ipLog = await readIpLog();
    ipLog = cleanIpLogsForToday(ipLog);

    const todayVotes = ipLog[today] || [];
    const voteKey = `${clientIp}_${barberId}_${statIndex}`;

    // Strictly enforce daily limit on server side
    if (todayVotes.includes(voteKey)) {
      return { success: false, error: "Z této IP adresy již dnes pro tuto vlastnost bylo hlasováno." };
    }

    // Process vote securely
    const dbData = await getGlobalStatsAction();
    if (!dbData[barberId]) {
      dbData[barberId] = { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 };
    }
    const barber = dbData[barberId];

    if (statIndex === 0) barber.stat1 = (barber.stat1 ?? 0) + 1;
    else if (statIndex === 1) barber.stat2 = (barber.stat2 ?? 0) + 1;
    else if (statIndex === 2) barber.stat3 = (barber.stat3 ?? 0) + 1;
    else if (statIndex === 3) barber.stat4 = (barber.stat4 ?? 0) + 1;
    else if (statIndex === 4) barber.stat5 = (barber.stat5 ?? 0) + 1;
    else if (statIndex === 5) barber.stat6 = (barber.stat6 ?? 0) + 1;

    // Award +1 XP and +1 overall vote count
    barber.likes = (barber.likes ?? 0) + 1;
    barber.xp = (barber.xp ?? 0) + 1;

    // Save DB
    await writeDb(dbData);

    // Save IP log block
    todayVotes.push(voteKey);
    ipLog[today] = todayVotes;
    await writeIpLog(ipLog);

    return { success: true, stats: dbData };
  } catch (error) {
    console.error("Secure vote Server Action error:", error);
    return { success: false, error: "Vnitřní chyba serveru" };
  }
}
