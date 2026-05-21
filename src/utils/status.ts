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

export const getOperativeStatusData = (): OperativeStatusData => {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  const saved = localStorage.getItem("mmbarber_operative_status");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const setOperativeStatusData = (data: OperativeStatusData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("mmbarber_operative_status", JSON.stringify(data));
    window.dispatchEvent(new Event("storage")); // trigger cross-tab update
    window.dispatchEvent(new Event("mmbarber_status_update")); // local update
  }
};

export interface EvaluatedStatus {
  state: OperativeState;
  text: string;
}

export const evaluateStatus = (config: OperativeStatusConfig): EvaluatedStatus => {
  if (config.mode === 'manual') {
    return {
      state: config.manualState,
      text: config.manualState === 'custom' ? config.manualCustomText : ''
    };
  }

  // Calendar mode
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const activeEntry = config.calendar.find(c => 
    c.dayOfWeek === day && timeStr >= c.start && timeStr <= c.end
  );

  if (activeEntry) {
    if (activeEntry.breakStart && activeEntry.breakEnd) {
      if (timeStr >= activeEntry.breakStart && timeStr <= activeEntry.breakEnd) {
        return { state: 'offline', text: '' };
      }
    }
    return { state: 'online', text: '' };
  } else {
    return { state: 'offline', text: '' };
  }
};

export const subscribeToStatusUpdates = (callback: (data: OperativeStatusData) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handleUpdate = () => {
    callback(getOperativeStatusData());
  };
  
  window.addEventListener("storage", handleUpdate);
  window.addEventListener("mmbarber_status_update", handleUpdate);
  
  // Return unsubsribe function
  return () => {
    window.removeEventListener("storage", handleUpdate);
    window.removeEventListener("mmbarber_status_update", handleUpdate);
  };
};

export const formatSchedule = (config: OperativeStatusConfig, lang: string = 'cs'): string => {
  if (config.isIndividualSchedule) {
    return lang === 'cs' ? 'Individuální režim' : 'Individual Schedule';
  }

  if (!config.calendar || config.calendar.length === 0) {
    return lang === 'cs' ? 'Není stanoven' : 'Not specified';
  }

  const daysCs = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = lang === 'cs' ? daysCs : daysEn;

  // Sort calendar by dayOfWeek (Monday = 1 first, Sunday = 0 last)
  const sorted = [...config.calendar].sort((a, b) => {
    const d1 = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const d2 = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return d1 - d2;
  });

  // Group by identical hours
  const groups: { startDay: number, endDay: number, timeStr: string }[] = [];
  
  for (const entry of sorted) {
    const timeStr = `${entry.start} - ${entry.end}`;
    const d = entry.dayOfWeek === 0 ? 7 : entry.dayOfWeek;

    if (groups.length === 0) {
      groups.push({ startDay: d, endDay: d, timeStr });
    } else {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup.timeStr === timeStr && d === lastGroup.endDay + 1) {
        lastGroup.endDay = d;
      } else {
        groups.push({ startDay: d, endDay: d, timeStr });
      }
    }
  }

  // Format the groups
  const parts = groups.map(g => {
    const startName = days[g.startDay === 7 ? 0 : g.startDay];
    const endName = days[g.endDay === 7 ? 0 : g.endDay];
    if (g.startDay === g.endDay) {
      return `${startName} ${g.timeStr}`;
    } else {
      return `${startName}-${endName} ${g.timeStr}`;
    }
  });

  return parts.join(', ');
};
