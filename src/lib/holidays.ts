/**
 * Calculates Easter Sunday for a given year using the Computus algorithm.
 */
function getEaster(year: number): Date {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

/**
 * Normalizes a date to midnight for comparison.
 */
function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export type ThemeType = 'default' | 'matrix' | 'valentine' | 'st-patricks' | 'halloween' | 'christmas' | 'newyear' | 'czech' | 'legacy' | 'easter' | 'friday13' | 'witches' | 'victory' | 'childrens-day';

/**
 * Returns the currently active theme based on the provided date (or today).
 * Rules: 3 days before the event, until 1 day after the event.
 */
export function getActiveTheme(currentDate: Date = new Date()): ThemeType {
  const dayOfWeek = currentDate.getDay(); // 0-6 (0=Sunday, 6=Saturday)
  const isSaturday = dayOfWeek === 6;

  // No special themes/games on Saturdays
  if (isSaturday) {
    return 'default';
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const day = currentDate.getDate();
  const hour = currentDate.getHours();

  // Friday the 13th Check (Luck/Misfortune)
  if (day === 13 && currentDate.getDay() === 5) {
    return 'friday13';
  }

  // Easter Check (Vejce)
  const easter = getEaster(year);
  const todayNormalized = normalizeDate(currentDate);
  const easterNormalized = normalizeDate(easter);
  const diffDays = (todayNormalized.getTime() - easterNormalized.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diffDays >= -3 && diffDays <= 1) {
    return 'easter';
  }

  // Victory Day (May 8) - Liberation Day
  if (month === 5 && (day >= 7 && day <= 9)) {
    return 'victory';
  }

  // St. Patrick's Day (March 17)
  if (month === 3 && (day >= 16 && day <= 18)) {
    return 'st-patricks';
  }

  // Witches' Night / Pálení čarodějnic (April 30th to May 1st noon)
  if ((month === 4 && day === 30) || (month === 5 && day === 1 && hour < 12)) {
    return 'witches';
  }

  // Legacy / Founder Birthday (Dec 8)
  if (month === 12 && day === 8) {
    return 'legacy';
  }

  // Matrix (April 1st)
  if (month === 4 && day === 1) {
    return 'matrix';
  }

  // Valentine's (Love) (Feb 14)
  if (month === 2 && (day >= 13 && day <= 15)) {
    return 'valentine';
  }

  // Halloween / Dušičky (Chaos) (Oct 31 to Nov 2)
  if ((month === 10 && day === 31) || (month === 11 && (day === 1 || day === 2))) {
    return 'halloween';
  }

  // Christmas (Xmas) (Dec 24)
  if (month === 12 && day === 24) {
    return 'christmas';
  }

  // New Year's (NYE) (Dec 31st 12:00 to Jan 1st 12:00)
  if ((month === 12 && day === 31 && hour >= 12) || (month === 1 && day === 1 && hour < 12)) {
    return 'newyear';
  }

  // Czech National Holidays
  const isCzechHoliday = 
    (month === 1 && day === 1 && hour >= 12) || // Rest of Jan 1st
    (month === 5 && day === 1) || // May 1
    (month === 7 && (day === 5 || day === 6)) || // July 5 and July 6
    (month === 9 && day === 28) || // Sept 28
    (month === 10 && day === 28) || // Oct 28
    (month === 11 && day === 17);  // Nov 17

  if (isCzechHoliday) {
    return 'czech';
  }

  // Children's Day / Modern Future Theme (June 1)
  if (month === 6 && day === 1) {
    return 'childrens-day';
  }

  return 'default';
}
