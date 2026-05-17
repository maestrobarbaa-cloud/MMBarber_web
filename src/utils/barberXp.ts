import { getGlobalStatsAction, addVoteToBarberStatAction } from "@/app/actions/barberXp";

export interface BarberXp {
  xp: number;
  likes: number;
  stat1: number; // Razor precision
  stat2: number; // Fade geometry
  stat3: number; // Tactics / speed
  stat4: number; // Charisma & human approach
  stat5: number; // Humor & sense of fun
  stat6: number; // Vibe & brotherly vibe
}

export interface GlobalBarberStats {
  [barberId: string]: BarberXp;
}

// Initial starting stats fallbacks
export const INITIAL_STATS: GlobalBarberStats = {
  tomas: { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 },
  nella: { xp: 0, likes: 0, stat1: 0, stat2: 0, stat3: 0, stat4: 0, stat5: 0, stat6: 0 }
};

/**
 * Calculates custom syndicate level from XP (100 XP = 1 Rank Level)
 */
export const calculateLevelFromXp = (xp: number): number => {
  return Math.max(0, Math.floor(xp / 100));
};

/**
 * Returns Czech syndicate rank title based on level
 */
export const getCzechRankFromLevel = (level: number, isFemale: boolean = false): string => {
  const ranks = [
    "Stážista tichého střihačského syndikátu",
    "Junior CEO aspirant (zatím jen drží zrcátko)",
    "Strategický nákupčí falešného sebevědomí",
    "Konzigliér oddělení „jen trochu to zkrať“",
    "Ředitel podezřele ostrých přechodů",
    "Viceprezident rodinné barber omerty",
    "Chief Executive Fade Dealer",
    "Don estetické transformace klientů",
    "Kmotr decentralizované elegance a břitvy",
    "Legenda, o které se šeptá v zrcadlech",
    "Auditovaný boss bez stresu",
    "Oficiálně neoficiální král fadeu",
    "Živoucí legenda barber podsvětí",
    "CEO reality, kde všichni vypadají líp než včera"
  ];
  return ranks[Math.max(0, Math.min(ranks.length - 1, level))];
};

/**
 * Returns English syndicate rank title based on level
 */
export const getEnglishRankFromLevel = (level: number): string => {
  const ranks = [
    "Intern of the Silent Haircut Syndicate",
    "Junior CEO Aspirant (just holding the mirror)",
    "Strategic Buyer of Fake Self-Confidence",
    "Consigliere of the 'Just a Little Off the Top' Department",
    "Director of Suspiciously Sharp Fades",
    "Vice President of Family Barber Omertà",
    "Chief Executive Fade Dealer",
    "Don of Aesthetic Client Transformations",
    "Godfather of Decentralized Elegance and Razor",
    "Legend Whispered in the Mirrors",
    "Audited Stress-Free Boss",
    "Officially Unofficial King of Fade",
    "Living Legend of the Barber Underworld",
    "CEO of a Reality Where Everyone Looks Better Than Yesterday"
  ];
  return ranks[Math.max(0, Math.min(ranks.length - 1, level))];
};

/**
 * Safely subscribe to global stats in real-time using polling of the Server Action
 */
export const subscribeToGlobalXpStats = (callback: (stats: GlobalBarberStats) => void): (() => void) => {
  let active = true;

  const fetchStats = async () => {
    try {
      const data = await getGlobalStatsAction();
      if (active) {
        callback(data);
      }
    } catch (err) {
      console.warn("[Barber XP] Server Action fetch failed:", err);
    }
  };

  fetchStats();
  
  // Real-time synchronization polling every 4 seconds from your server database
  const interval = setInterval(fetchStats, 4000);

  return () => {
    active = false;
    clearInterval(interval);
  };
};

/**
 * Registers a support vote (kept for full backward compatibility)
 */
export const addLikeToBarber = async (barberId: string): Promise<boolean> => {
  try {
    const storageKey = `mmbarber_liked_${barberId}_${new Date().toDateString()}`;
    if (localStorage.getItem(storageKey)) {
      return false; 
    }
    localStorage.setItem(storageKey, "true");
    window.dispatchEvent(new CustomEvent('mmbarber_xp_updated'));
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Registers a vote for a specific attribute of a barber using secure Server Action
 */
export const addVoteToBarberStat = async (barberId: string, statIndex: number): Promise<boolean> => {
  try {
    const todayStr = new Date().toDateString();
    const storageKey = `mmbarber_stat_liked_${barberId}_${statIndex}_${todayStr}`;
    
    // Client-side quick double click protection
    if (localStorage.getItem(storageKey)) {
      return false;
    }

    // Call our secure Server Action running directly on your VPS server
    const result = await addVoteToBarberStatAction(barberId, statIndex);

    if (!result.success) {
      throw new Error(result.error || "Hlasování selhalo.");
    }

    // Set lock in local storage to prevent visual spam
    localStorage.setItem(storageKey, "true");
    
    // Broadcast change to local UI instantly
    window.dispatchEvent(new CustomEvent('mmbarber_xp_updated'));
    return true;
  } catch (error) {
    console.error("[Barber XP] Secure vote submission failed:", error);
    throw error;
  }
};

/**
 * Checks if a barber has been liked by the user today.
 */
export const hasLikedToday = (barberId: string): boolean => {
  const storageKey = `mmbarber_liked_${barberId}_${new Date().toDateString()}`;
  return !!localStorage.getItem(storageKey);
};

/**
 * Checks if a specific attribute has been liked by the user today.
 */
export const hasStatLikedToday = (barberId: string, statIndex: number): boolean => {
  const storageKey = `mmbarber_stat_liked_${barberId}_${statIndex}_${new Date().toDateString()}`;
  return !!localStorage.getItem(storageKey);
};
