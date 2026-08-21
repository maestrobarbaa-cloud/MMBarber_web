import { getStatusAction, setStatusAction } from "@/app/actions/status";
import { 
  OperativeState, 
  CalendarEntry, 
  OperativeStatusConfig, 
  OperativeStatusData 
} from "./statusTypes";

export type { OperativeState, CalendarEntry, OperativeStatusConfig, OperativeStatusData };

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

let cachedData: OperativeStatusData | null = null;

export const getOperativeStatusData = (): OperativeStatusData => {
  return cachedData || DEFAULT_DATA;
};

export const fetchOperativeStatusData = async (): Promise<OperativeStatusData> => {
  try {
    const data = await getStatusAction();
    cachedData = data;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event("mmbarber_status_update"));
    }
    return data;
  } catch (err) {
    return cachedData || DEFAULT_DATA;
  }
};

export const setOperativeStatusData = async (data: OperativeStatusData) => {
  cachedData = data;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("mmbarber_status_update")); // local optimistic update
  }
  await setStatusAction(data);
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
  
  let active = true;

  const handleUpdate = () => {
    if (active) callback(getOperativeStatusData());
  };
  
  window.addEventListener("mmbarber_status_update", handleUpdate);
  
  // Initial fetch and polling every 5 seconds for real-time sync across clients
  fetchOperativeStatusData().then(data => {
    if (active) callback(data);
  });
  
  const interval = setInterval(() => {
    if (active) fetchOperativeStatusData();
  }, 5000);
  
  return () => {
    active = false;
    window.removeEventListener("mmbarber_status_update", handleUpdate);
    clearInterval(interval);
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
