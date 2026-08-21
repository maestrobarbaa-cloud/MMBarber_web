"use server";

import fs from "fs";
import path from "path";
import { headers } from "next/headers";

const DATA_DIR = path.join(process.cwd(), "data");
const NICKNAMES_FILE_PATH = path.join(DATA_DIR, "mmbarber-nicknames.json");

export interface NicknameData {
  suggestions: { [nickname: string]: number };
  topNickname: string;
}

export interface NicknamesDB {
  tomas: NicknameData;
  nella: NicknameData;
}

const DEFAULT_NICKNAMES: NicknamesDB = {
  tomas: {
    suggestions: { "Tomáš": 1 },
    topNickname: "Tomáš"
  },
  nella: {
    suggestions: { "Nella": 1 },
    topNickname: "Nella"
  }
};

export async function getNicknamesAction(): Promise<NicknamesDB> {
  try {
    if (!fs.existsSync(NICKNAMES_FILE_PATH)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o777 });
      }
      fs.writeFileSync(NICKNAMES_FILE_PATH, JSON.stringify(DEFAULT_NICKNAMES, null, 2), { encoding: "utf-8", mode: 0o666 });
      return DEFAULT_NICKNAMES;
    }
    const raw = fs.readFileSync(NICKNAMES_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading nicknames DB file:", error);
    return DEFAULT_NICKNAMES;
  }
}

export async function addNicknameVoteAction(barberId: 'tomas' | 'nella', nickname: string): Promise<{ success: boolean; topNickname?: string; error?: string }> {
  try {
    if (!nickname || nickname.trim().length < 2 || nickname.trim().length > 20) {
      return { success: false, error: "Přezdívka musí mít 2 až 20 znaků." };
    }
    
    // Very simple IP rate limiting to prevent spamming votes
    // We could use the IP log from barberXp, but keeping it simple for now.
    
    const db = await getNicknamesAction();
    const cleanNickname = nickname.trim().replace(/<[^>]*>?/gm, ''); // simple sanitize
    
    if (!db[barberId]) {
      db[barberId] = { suggestions: {}, topNickname: "" };
    }
    
    if (!db[barberId].suggestions[cleanNickname]) {
      db[barberId].suggestions[cleanNickname] = 0;
    }
    db[barberId].suggestions[cleanNickname] += 1;
    
    // Determine new top nickname
    let maxVotes = -1;
    let topName = db[barberId].topNickname;
    for (const [name, votes] of Object.entries(db[barberId].suggestions)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        topName = name;
      }
    }
    
    db[barberId].topNickname = topName;
    
    fs.writeFileSync(NICKNAMES_FILE_PATH, JSON.stringify(db, null, 2), { encoding: "utf-8", mode: 0o666 });
    
    return { success: true, topNickname: topName };
  } catch (error) {
    console.error("Error adding nickname vote:", error);
    return { success: false, error: "Vnitřní chyba serveru" };
  }
}
