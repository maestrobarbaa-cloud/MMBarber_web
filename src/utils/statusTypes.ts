export type OperativeState = 'online' | 'offline' | 'transparent' | 'custom';

export interface CalendarEntry {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start: string; // "09:00"
  end: string;   // "18:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface OperativeStatusConfig {
  mode: 'manual' | 'calendar';
  manualState: OperativeState;
  manualCustomText: string;
  isIndividualSchedule?: boolean;
  calendar: CalendarEntry[];
}

export interface OperativeStatusData {
  tomas: OperativeStatusConfig;
  nella: OperativeStatusConfig;
}
