import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LevelVote {
  userId: string;
  ratings: Record<string, number>; // barberId -> level (0-7)
  date: string;
  timestamp: Timestamp;
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

/**
 * Casts multi-barber level votes for a user.
 * Overwrites any previous votes from the same user for today.
 */
export const castMultiVote = async (userId: string, ratings: Record<string, number>) => {
  try {
    const today = getTodayKey();
    const voteId = `${userId}_${today}`;
    const voteRef = doc(db, "level_votes", voteId);

    // Basic validation before sending
    const validRatings: Record<string, number> = {};
    Object.entries(ratings).forEach(([id, lv]) => {
      validRatings[id] = Math.max(0, Math.min(7, lv));
    });

    await setDoc(voteRef, {
      userId,
      ratings: validRatings,
      date: today,
      timestamp: serverTimestamp() // Matches request.time in security rules
    });
  } catch (error) {
    console.error("Firebase castMultiVote error:", error);
    throw error;
  }
};

/**
 * Gets the current user's votes for today.
 */
export const getTodayMultiVote = async (userId: string): Promise<Record<string, number> | null> => {
  try {
    const today = getTodayKey();
    const voteId = `${userId}_${today}`;
    const voteRef = doc(db, "level_votes", voteId);
    const snap = await getDoc(voteRef);
    
    if (snap.exists()) {
      return snap.data().ratings;
    }
  } catch (error) {
    console.warn("Firebase getTodayMultiVote failed (likely offline):", error);
  }
  return null;
};

/**
 * Aggregates all votes to determine the "community rank" for each barber.
 * Returns a record where each barber has a distribution of levels.
 */
export const getGlobalLevelStats = async () => {
  const q = collection(db, "level_votes");
  const querySnapshot = await getDocs(q);
  
  // Structure: barberId -> { level_0: count, level_1: count, ... }
  const stats: Record<string, Record<number, number>> = {};
  
  querySnapshot.forEach((doc) => {
    const ratings = doc.data().ratings as Record<string, number>;
    Object.entries(ratings).forEach(([barberId, level]) => {
      if (!stats[barberId]) stats[barberId] = {};
      stats[barberId][level] = (stats[barberId][level] || 0) + 1;
    });
  });
  
  return stats;
};

/**
 * Subscribes to real-time level vote updates.
 */
export const subscribeToLevelVotes = (callback: (stats: Record<string, Record<number, number>>) => void) => {
  const q = collection(db, "level_votes");
  
  return onSnapshot(q, (snapshot) => {
    const stats: Record<string, Record<number, number>> = {};
    snapshot.forEach((doc) => {
      const ratings = doc.data().ratings as Record<string, number>;
      Object.entries(ratings).forEach(([barberId, level]) => {
        if (!stats[barberId]) stats[barberId] = {};
        stats[barberId][level] = (stats[barberId][level] || 0) + 1;
      });
    });
    callback(stats);
  }, (error) => {
    console.warn("Firebase subscription error (likely offline):", error);
  });
};

/**
 * Calculates the dominant level for a barber based on community votes.
 */
export const getDominantLevel = (barberStats: Record<number, number> | undefined): number => {
  if (!barberStats) return 0;
  
  let maxVotes = -1;
  let dominantLevel = 0;
  
  // Find level with most votes
  Object.entries(barberStats).forEach(([level, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      dominantLevel = parseInt(level);
    }
  });
  
  return dominantLevel;
};
