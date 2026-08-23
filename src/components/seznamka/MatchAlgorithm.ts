import { ProfileData, CharacterTraits } from "./ProfileTypes";

export interface MatchScores {
  overall: number;
  character: number;
  lifestyle: number;
  future: number;
  practical: number;
  communication: number;
  intimacy: number;
  intellect: number;
}

// Astrological compatibility table (simplified)
// Values: 1 (perfect), 0.7 (good), 0.3 (neutral), 0 (bad)
const zodiacCompatibility: Record<string, Record<string, number>> = {
  aries: { aries: 0.7, taurus: 0.3, gemini: 0.7, cancer: 0, leo: 1.0, virgo: 0.3, libra: 0.7, scorpio: 0, sagittarius: 1.0, capricorn: 0, aquarius: 0.7, pisces: 0.3 },
  taurus: { aries: 0.3, taurus: 0.7, gemini: 0.3, cancer: 1.0, leo: 0, virgo: 1.0, libra: 0.7, scorpio: 1.0, sagittarius: 0, capricorn: 1.0, aquarius: 0, pisces: 0.7 },
  gemini: { aries: 0.7, taurus: 0.3, gemini: 0.7, cancer: 0.3, leo: 0.7, virgo: 0.3, libra: 1.0, scorpio: 0, sagittarius: 0.7, capricorn: 0.3, aquarius: 1.0, pisces: 0 },
  cancer: { aries: 0, taurus: 1.0, gemini: 0.3, cancer: 0.7, leo: 0.3, virgo: 0.7, libra: 0, scorpio: 1.0, sagittarius: 0, capricorn: 0.7, aquarius: 0, pisces: 1.0 },
  leo: { aries: 1.0, taurus: 0, gemini: 0.7, cancer: 0.3, leo: 0.7, virgo: 0.3, libra: 0.7, scorpio: 0.3, sagittarius: 1.0, capricorn: 0, aquarius: 0.7, pisces: 0.3 },
  virgo: { aries: 0.3, taurus: 1.0, gemini: 0.3, cancer: 0.7, leo: 0.3, virgo: 0.7, libra: 0.3, scorpio: 0.7, sagittarius: 0, capricorn: 1.0, aquarius: 0.3, pisces: 0.7 },
  libra: { aries: 0.7, taurus: 0.7, gemini: 1.0, cancer: 0, leo: 0.7, virgo: 0.3, libra: 0.7, scorpio: 0.3, sagittarius: 0.7, capricorn: 0, aquarius: 1.0, pisces: 0.3 },
  scorpio: { aries: 0, taurus: 1.0, gemini: 0, cancer: 1.0, leo: 0.3, virgo: 0.7, libra: 0.3, scorpio: 0.7, sagittarius: 0.3, capricorn: 0.7, aquarius: 0, pisces: 1.0 },
  sagittarius: { aries: 1.0, taurus: 0, gemini: 0.7, cancer: 0, leo: 1.0, virgo: 0, libra: 0.7, scorpio: 0.3, sagittarius: 0.7, capricorn: 0.3, aquarius: 0.7, pisces: 0.3 },
  capricorn: { aries: 0, taurus: 1.0, gemini: 0.3, cancer: 0.7, leo: 0, virgo: 1.0, libra: 0, scorpio: 0.7, sagittarius: 0.3, capricorn: 0.7, aquarius: 0.3, pisces: 0.7 },
  aquarius: { aries: 0.7, taurus: 0, gemini: 1.0, cancer: 0, leo: 0.7, virgo: 0.3, libra: 1.0, scorpio: 0, sagittarius: 0.7, capricorn: 0.3, aquarius: 0.7, pisces: 0.3 },
  pisces: { aries: 0.3, taurus: 0.7, gemini: 0, cancer: 1.0, leo: 0.3, virgo: 0.7, libra: 0.3, scorpio: 1.0, sagittarius: 0.3, capricorn: 0.7, aquarius: 0.3, pisces: 0.7 }
};

function calculateTraitScore(userPref: string | undefined, partnerVal: string | undefined, strategy: string): number {
  if (!userPref || !partnerVal) return 0.5;
  if (userPref === partnerVal) return strategy === 'magnet' ? 0.3 : 1.0;
  
  const weights = { 'vubec': 0, 'trochu': 1, 'hodne': 2, 'zasadni': 3 };
  const uW = weights[userPref as keyof typeof weights] ?? 1;
  const pW = weights[partnerVal as keyof typeof weights] ?? 1;
  
  const diff = Math.abs(uW - pW);
  
  if (strategy === 'magnet') {
    if (diff === 3) return 1.0;
    if (diff === 2) return 0.8;
    if (diff === 1) return 0.5;
    return 0.3;
  }
  
  if (strategy === 'mirror' || strategy === 'closest') {
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.5;
    return 0.0;
  }
  
  // default
  if (diff === 0) return 1.0;
  if (diff === 1) return 0.7;
  if (diff === 2) return 0.3;
  return 0.0;
}

// Compare arrays for intersection
function compareArrays(arr1: string[] | undefined, arr2: string[] | undefined, strategy: string): number {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 0.5;
  const overlap = arr1.filter(item => arr2.includes(item)).length;
  const pct = overlap / Math.max(arr1.length, arr2.length);
  
  if (strategy === 'magnet') {
    return pct === 0 ? 1.0 : (pct < 0.5 ? 0.8 : 0.3);
  }
  return pct; // mirror / closest / default
}

export function calculateCompatibility(user: ProfileData, partner: ProfileData, forcedStrategy?: string): MatchScores {
  const strategy = forcedStrategy || user.matchStrategy || 'closest';

  // --- 1. RANDOM STRATEGY ---
  if (strategy === 'random') {
    const hash = (user.name + partner.name + Date.now()).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      overall: (hash % 60) + 30, // 30-89
      character: ((hash * 2) % 60) + 30,
      lifestyle: ((hash * 3) % 60) + 30,
      future: ((hash * 4) % 60) + 30,
      practical: ((hash * 5) % 60) + 30,
      communication: ((hash * 6) % 60) + 30,
      intimacy: ((hash * 7) % 60) + 30,
      intellect: ((hash * 8) % 60) + 30
    };
  }

  // --- 2. ZODIAC STRATEGY ---
  if (strategy === 'zodiac') {
    let zScore = 50; // default
    if (user.zodiac && partner.zodiac) {
      zScore = (zodiacCompatibility[user.zodiac]?.[partner.zodiac] ?? 0.5) * 100;
    } else {
      // Fallback pseudo-astrology if missing
      const hash = (user.name + partner.name).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      zScore = (hash % 60) + 40;
    }
    return {
      overall: Math.round(zScore),
      character: Math.round(zScore),
      lifestyle: Math.round(zScore),
      future: Math.round(zScore),
      practical: Math.round(zScore),
      communication: Math.round(zScore),
      intimacy: Math.round(zScore),
      intellect: Math.round(zScore)
    };
  }

  let penalty = 0;

  // --- DEALBREAKERS (Apply to all normal strategies) ---
  if (user.prefAgeMin || user.prefAgeMax) {
     const partnerAge = parseInt(partner.age);
     if (!isNaN(partnerAge)) {
       const min = user.prefAgeMin ? parseInt(user.prefAgeMin) : 18;
       const max = user.prefAgeMax ? parseInt(user.prefAgeMax) : 99;
       if (partnerAge < min || partnerAge > max) penalty += 100;
     }
  }
  
  // --- CHARACTER & PSYCHOLOGY ---
  let charScore = 0; let charCount = 0;
  const charTraitsList = ['honesty', 'loyalty', 'humor', 'reliability', 'empathy', 'ambition', 'calmness', 'sociability', 'romance', 'independence', 'tolerance', 'communication', 'jealousy', 'familyOriented'];
  
  for (const t of charTraitsList) {
    if (user.characterTraits?.[t as keyof CharacterTraits] && partner.characterTraits?.[t as keyof CharacterTraits]) {
      charScore += calculateTraitScore(
        user.characterTraits[t as keyof CharacterTraits] as string, 
        partner.characterTraits[t as keyof CharacterTraits] as string, 
        strategy
      );
      charCount++;
    }
  }

  // Psychology matching (MBTI, Enneagram, Love Languages, etc.)
  const psychFields = ['mbti', 'temperament', 'socialBattery', 'enneagram', 'chronotype', 'jungArchetype', 'darkTriad'];
  for (const field of psychFields) {
    const uVal = (user as any)[field];
    const pVal = (partner as any)[field];
    if (uVal && pVal) {
      if (uVal === pVal) {
        charScore += strategy === 'magnet' ? 0.2 : 1.0;
      } else {
        charScore += strategy === 'magnet' ? 1.0 : 0.2; // Opposites attract in psychology for magnet
      }
      charCount++;
    }
  }

  // Arrays (loveLanguages, dealbreakers)
  if (user.loveLanguages && partner.loveLanguages) {
    charScore += compareArrays(user.loveLanguages, partner.loveLanguages, strategy);
    charCount++;
  }

  let finalCharPct = charCount > 0 ? (charScore / charCount) * 100 : 70;

  // --- LIFESTYLE & HABITS ---
  let lifeScore = 0; let lifeCount = 0;
  
  if (user.energy && partner.energy) {
    lifeScore += (user.energy === partner.energy ? (strategy === 'magnet' ? 0.3 : 1.0) : (strategy === 'magnet' ? 1.0 : 0.3));
    lifeCount++;
  }
  if (user.drinking && partner.drinking) {
    lifeScore += (user.drinking === partner.drinking ? 1.0 : 0.0); // Never magnet drinking habits entirely
    lifeCount++;
  }
  if (user.smoking && partner.smoking) {
    lifeScore += (user.smoking === partner.smoking ? 1.0 : 0.0);
    lifeCount++;
  }

  // lifestylePrefs
  if (user.lifestylePrefs && partner.lifestylePrefs) {
    const lp = ['pace', 'meetingFrequency'];
    for (const p of lp) {
      if ((user.lifestylePrefs as any)[p] && (partner.lifestylePrefs as any)[p]) {
        lifeScore += ((user.lifestylePrefs as any)[p] === (partner.lifestylePrefs as any)[p] ? (strategy === 'magnet' ? 0.3 : 1.0) : (strategy === 'magnet' ? 1.0 : 0.3));
        lifeCount++;
      }
    }
  }
  
  let finalLifePct = lifeCount > 0 ? (lifeScore / lifeCount) * 100 : 70;

  // --- FUTURE & VALUES (Core values should ideally match even in Magnet) ---
  let futScore = 0; let futCount = 0;
  
  if (user.kids && partner.kids) {
    futScore += (user.kids === partner.kids ? 1.0 : 0.0);
    futCount++;
  }
  if (user.values?.religion && partner.values?.religion) {
    futScore += (user.values.religion === partner.values.religion ? 1.0 : 0.0);
    futCount++;
  }
  if (user.futurePrefs?.lookingFor && partner.futurePrefs?.lookingFor) {
    futScore += (user.futurePrefs.lookingFor === partner.futurePrefs.lookingFor ? 1.0 : 0.0);
    futCount++;
  }
  
  let finalFutPct = futCount > 0 ? (futScore / futCount) * 100 : 80;

  // --- PRACTICAL & HOUSING & FINANCE ---
  let pracScore = 0; let pracCount = 0;

  if (user.financePrefs?.financesSetup && partner.financePrefs?.financesSetup) {
    pracScore += (user.financePrefs.financesSetup === partner.financePrefs.financesSetup ? 1.0 : 0.5);
    pracCount++;
  }
  
  if (user.housing?.locationPref && partner.housing?.locationPref) {
    pracScore += (user.housing.locationPref === partner.housing.locationPref ? 1.0 : 0.5);
    pracCount++;
  }

  if (user.animals?.havePets && partner.animals?.petsAtHomeBother === 'yes') {
    penalty += 50; // Practical issue
  }

  let finalPracPct = pracCount > 0 ? (pracScore / pracCount) * 100 : 70;

  
  // --- COMMUNICATION ---
  let commScore = 0; let commCount = 0;
  const commFields = ['conflictStyle', 'apologyLanguage'];
  for (const field of commFields) {
    const uVal = (user as any)[field];
    const pVal = (partner as any)[field];
    if (uVal && pVal) {
      if (uVal === pVal) {
        commScore += strategy === 'magnet' ? 0.5 : 1.0;
      } else {
        commScore += strategy === 'magnet' ? 1.0 : 0.5;
      }
      commCount++;
    }
  }
  let finalCommPct = commCount > 0 ? (commScore / commCount) * 100 : 75;

  // --- INTIMACY & EMOTION ---
  let intScore = 0; let intCount = 0;
  const intFields = ['attachmentStyle', 'loveStyle', 'intimacyDynamic'];
  for (const field of intFields) {
    const uVal = (user as any)[field];
    const pVal = (partner as any)[field];
    if (uVal && pVal) {
      if (uVal === pVal) {
        intScore += strategy === 'magnet' ? 0.3 : 1.0;
      } else {
        intScore += strategy === 'magnet' ? 1.0 : 0.4;
      }
      intCount++;
    }
  }
  let finalIntPct = intCount > 0 ? (intScore / intCount) * 100 : 70;

  // --- INTELLECT & VISION ---
  let intelScore = 0; let intelCount = 0;
  const intelFields = ['brainHemisphere', 'intelligence', 'mindset'];
  for (const field of intelFields) {
    const uVal = (user as any)[field];
    const pVal = (partner as any)[field];
    if (uVal && pVal) {
      if (uVal === pVal) {
        intelScore += strategy === 'magnet' ? 0.2 : 1.0;
      } else {
        intelScore += strategy === 'magnet' ? 1.0 : 0.5;
      }
      intelCount++;
    }
  }
  let finalIntelPct = intelCount > 0 ? (intelScore / intelCount) * 100 : 80;

  // Calculate Overall
  let finalPct = Math.round(Math.max(0, Math.min(100, (finalCharPct + finalLifePct + finalFutPct + finalPracPct + finalCommPct + finalIntPct + finalIntelPct) / 7 - penalty)));

  return {
    overall: finalPct,
    character: Math.round(Math.max(0, Math.min(100, finalCharPct))),
    lifestyle: Math.round(Math.max(0, Math.min(100, finalLifePct))),
    future: Math.round(Math.max(0, Math.min(100, finalFutPct))),
    practical: Math.round(Math.max(0, Math.min(100, finalPracPct))),
    communication: Math.round(Math.max(0, Math.min(100, finalCommPct))),
    intimacy: Math.round(Math.max(0, Math.min(100, finalIntPct))),
    intellect: Math.round(Math.max(0, Math.min(100, finalIntelPct)))
  };

}

export function generateMatchReport(user: ProfileData, partner: ProfileData, lang: 'cs' | 'en' = 'cs', forcedStrategy?: string): string[] {
  const report: string[] = [];
  const strategy = forcedStrategy || user.matchStrategy || 'closest';

  if (strategy === 'zodiac') {
    if (user.zodiac && partner.zodiac) {
       report.push(lang === 'cs' ? `✨ Astrologická kompatibilita pro ${user.zodiac} a ${partner.zodiac}` : `✨ Astrological compatibility for ${user.zodiac} and ${partner.zodiac}`);
    } else {
       report.push(lang === 'cs' ? '✨ Astrologický algoritmus (Chybí data o znamení)' : '✨ Astrological algorithm (Missing zodiac data)');
    }
  }

  if (strategy === 'random') {
    report.push(lang === 'cs' ? '🎲 Kostky byly vrženy. Logika stranou.' : '🎲 The dice are cast. Logic aside.');
  }

  if (strategy === 'magnet') {
    report.push(lang === 'cs' ? '🧲 Rozdíly vás k sobě táhnou. Tento algoritmus odměňuje odlišnosti.' : '🧲 Opposites attract. This algorithm rewards differences.');
  }

  if (user.kids === partner.kids && user.kids) {
    report.push(lang === 'cs' ? '✅ Oba máte stejný pohled na děti.' : '✅ You both have the same view on kids.');
  }
  
  if (user.values?.religion && partner.values?.religion && user.values.religion === partner.values.religion) {
    report.push(lang === 'cs' ? '✅ Shodujete se v náboženském vyznání.' : '✅ You share the same religious views.');
  }

  const commonCategories = (user.categories || []).filter(c => (partner.categories || []).includes(c));
  if (commonCategories.length > 0) {
    report.push(lang === 'cs' ? `✅ Máte společné zájmy: ${commonCategories.slice(0, 3).join(', ')}` : `✅ You share interests: ${commonCategories.slice(0, 3).join(', ')}`);
  }

  if (report.length === 0) {
    report.push(lang === 'cs' ? 'Doporučeno algoritmem pro základní shodu profilů.' : 'Recommended by algorithm based on basic profile match.');
  }

  return report;
}
