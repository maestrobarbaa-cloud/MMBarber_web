"use server";

import fs from "fs";
import path from "path";
import { OperativeStatusData } from "@/utils/statusTypes"; // We will create this

const DATA_DIR = path.join(process.cwd(), "data");
const STATUS_FILE_PATH = path.join(DATA_DIR, "mmbarber-status.json");

const DEFAULT_DATA: OperativeStatusData = {
  tomas: {
    mode: 'calendar',
    manualState: 'online',
    manualCustomText: '',
    isIndividualSchedule: false,
    calendar: [
      { dayOfWeek: 1, start: "09:00", end: "18:00" },
      { dayOfWeek: 2, start: "09:00", end: "18:00" },
      { dayOfWeek: 3, start: "09:00", end: "18:00" },
      { dayOfWeek: 4, start: "09:00", end: "18:00" },
      { dayOfWeek: 5, start: "09:00", end: "18:00" }
    ]
  },
  nella: {
    mode: 'calendar',
    manualState: 'online',
    manualCustomText: '',
    isIndividualSchedule: true,
    calendar: [
      { dayOfWeek: 1, start: "09:00", end: "18:00" },
      { dayOfWeek: 2, start: "09:00", end: "18:00" },
      { dayOfWeek: 3, start: "09:00", end: "18:00" },
      { dayOfWeek: 4, start: "09:00", end: "18:00" },
      { dayOfWeek: 5, start: "09:00", end: "18:00" }
    ]
  }
};

export async function getStatusAction(): Promise<OperativeStatusData> {
  try {
    if (!fs.existsSync(STATUS_FILE_PATH)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o777 });
      }
      fs.writeFileSync(STATUS_FILE_PATH, JSON.stringify(DEFAULT_DATA, null, 2), { encoding: "utf-8", mode: 0o666 });
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(STATUS_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading status DB file:", error);
    return DEFAULT_DATA;
  }
}

export async function setStatusAction(data: OperativeStatusData): Promise<{ success: boolean }> {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o777 });
    fs.writeFileSync(STATUS_FILE_PATH, JSON.stringify(data, null, 2), { encoding: "utf-8", mode: 0o666 });
    return { success: true };
  } catch (error) {
    console.error("Error writing status DB file:", error);
    return { success: false };
  }
}
