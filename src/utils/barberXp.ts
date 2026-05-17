import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc, getDoc, increment } from "firebase/firestore";

export interface BarberXp {
  xp: number;    // 0 to 100
  likes: number; // Number of likes
}

export interface GlobalBarberStats {
  [barberId: string]: BarberXp;
}

const STATS_DOC_PATH = "barbers/global_xp_stats";

// Initial starting stats as requested by the user (Reset to zero)
export const INITIAL_STATS: GlobalBarberStats = {
  tomas: { xp: 0, likes: 0 },
  nella: { xp: 0, likes: 0 }
};

/**
 * Calculates custom syndicat level from XP (0 to 13)
 * Maximum XP is 100. Smooth progression split into 14 ranks.
 */
export const calculateLevelFromXp = (xp: number): number => {
  const cappedXp = Math.max(0, Math.min(100, xp));
  return Math.min(13, Math.floor(cappedXp / 7.5));
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
  return ranks[Math.max(0, Math.min(13, level))];
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
  return ranks[Math.max(0, Math.min(13, level))];
};

/**
 * Initializes stats document in Firestore if it doesn't exist.
 * Note: Resets are disabled to ensure ratings are permanently stored on the server
 * and never cleared during site updates.
 */
export const initializeStatsIfEmpty = async () => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    console.log("[Barber XP] Client is offline. Skipping Firestore initialization check.");
    return;
  }
  try {
    const docRef = doc(db, STATS_DOC_PATH);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, INITIAL_STATS);
      console.log("[Barber XP] Initialized Firestore stats to zero successfully.");
    }
  } catch (error: any) {
    if (error?.code === "unavailable" || error?.message?.includes("offline")) {
      console.warn("[Barber XP] Firestore unavailable (client is offline). Using initial stats fallback.");
    } else {
      console.error("[Barber XP] Error initializing stats:", error);
    }
  }
};

export const subscribeToGlobalXpStats = (callback: (stats: GlobalBarberStats) => void) => {
  const docRef = doc(db, STATS_DOC_PATH);
  
  // Initialize in parallel if online
  initializeStatsIfEmpty();

  const handleCallback = (data: GlobalBarberStats) => {
    const merged = { ...data };
    
    // Tomas
    const tomasLiked = hasLikedToday("tomas");
    const tomasStats = merged.tomas || { xp: 0, likes: 0 };
    merged.tomas = {
      xp: tomasLiked ? Math.max(tomasStats.xp, 1) : tomasStats.xp,
      likes: tomasLiked ? Math.max(tomasStats.likes, 1) : tomasStats.likes
    };

    // Nella
    const nellaLiked = hasLikedToday("nella");
    const nellaStats = merged.nella || { xp: 0, likes: 0 };
    merged.nella = {
      xp: nellaLiked ? Math.max(nellaStats.xp, 1) : nellaStats.xp,
      likes: nellaLiked ? Math.max(nellaStats.likes, 1) : nellaStats.likes
    };

    callback(merged);
  };

  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      handleCallback(snapshot.data() as GlobalBarberStats);
    } else {
      handleCallback(INITIAL_STATS);
    }
  }, (error: any) => {
    console.warn("[Barber XP] onSnapshot failed. Using initial stats and merging today's likes locally.");
    handleCallback(INITIAL_STATS); // Fallback to initial stats on error
  });
};

/**
 * Registers a like for a barber.
 * Each like increments XP by 1 (up to 100) and increases likes counter.
 */
export const addLikeToBarber = async (barberId: string): Promise<boolean> => {
  try {
    // 1. Prevent duplicate liking in the same session/day to encourage fair play
    const storageKey = `mmbarber_liked_${barberId}_${new Date().toDateString()}`;
    if (localStorage.getItem(storageKey)) {
      return false; // Already liked today
    }

    // 2. Premium offline UX: if network is down, record the token locally so they are marked as having voted
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      localStorage.setItem(storageKey, "true");
      window.dispatchEvent(new CustomEvent('mmbarber_xp_updated'));
      return true;
    }

    const docRef = doc(db, STATS_DOC_PATH);
    const snap = await getDoc(docRef);
    
    let currentXp = INITIAL_STATS[barberId]?.xp ?? 0;
    let currentLikes = INITIAL_STATS[barberId]?.likes ?? 0;

    if (snap.exists()) {
      const data = snap.data();
      if (data[barberId]) {
        currentXp = data[barberId].xp;
        currentLikes = data[barberId].likes;
      }
    }

    // Cap XP at 100
    const newXp = Math.min(100, currentXp + 1);
    const newLikes = currentLikes + 1;

    await setDoc(docRef, {
      [barberId]: {
        xp: newXp,
        likes: newLikes
      }
    }, { merge: true });

    // Mark as liked in local storage
    localStorage.setItem(storageKey, "true");
    
    // Dispatch local event for instant UI update
    window.dispatchEvent(new CustomEvent('mmbarber_xp_updated'));
    return true;
  } catch (error: any) {
    if (error?.code === "unavailable" || error?.message?.includes("offline")) {
      console.warn("[Barber XP] Liking failed due to offline state. Storing support state locally.");
      // Fallback local support
      const storageKey = `mmbarber_liked_${barberId}_${new Date().toDateString()}`;
      localStorage.setItem(storageKey, "true");
      window.dispatchEvent(new CustomEvent('mmbarber_xp_updated'));
      return true;
    }
    console.error("[Barber XP] Failed to add like:", error);
    return false;
  }
};

/**
 * Checks if a barber has been liked by the user today.
 */
export const hasLikedToday = (barberId: string): boolean => {
  if (typeof window === "undefined") return false;
  const storageKey = `mmbarber_liked_${barberId}_${new Date().toDateString()}`;
  return localStorage.getItem(storageKey) !== null;
};
