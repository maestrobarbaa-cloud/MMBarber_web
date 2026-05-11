/**
 * LOCAL PERSISTENCE VOTING SYSTEM
 * This version uses LocalStorage instead of Firebase to keep data local to the machine.
 */

export interface LevelVote {
  userId: string;
  ratings: Record<string, number>; // barberId -> level (0-9)
  date: string;
}

const STORAGE_KEY = 'mmbarber_local_votes';
const IDENTITY_KEY = 'mmbarber_user_id';

const getTodayKey = () => new Date().toISOString().split('T')[0];

/**
 * Gets or creates a unique local identity
 */
const getLocalIdentity = (): string => {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(IDENTITY_KEY);
  if (!id) {
    id = 'local_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem(IDENTITY_KEY, id);
  }
  return id;
};

/**
 * MOCK COMMUNITY DATA
 * Since we are local-only, we provide some base "pre-voted" stats 
 * to make the system feel populated.
 */
// Community stats will be built purely from user votes.
const MOCK_COMMUNITY_STATS: Record<string, Record<number, number>> = {};

/**
 * Casts multi-barber level votes for a user.
 */
export const castMultiVote = async (userId: string, ratings: Record<string, number>) => {
  const today = getTodayKey();
  const allVotes = getRawVotes();
  
  // Store only today's vote for this user
  allVotes[userId] = {
    userId,
    ratings,
    date: today
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allVotes));
  // Trigger a custom event for real-time updates within the same tab/window
  window.dispatchEvent(new CustomEvent('mmbarber_votes_updated'));
};

const getRawVotes = (): Record<string, LevelVote> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Gets the current user's votes for today.
 */
export const getTodayMultiVote = async (userId: string): Promise<Record<string, number> | null> => {
  const allVotes = getRawVotes();
  const userVote = allVotes[userId];
  const today = getTodayKey();
  
  if (userVote && userVote.date === today) {
    return userVote.ratings;
  }
  return null;
};

/**
 * Aggregates all local votes + mock community stats.
 */
export const getGlobalLevelStats = async () => {
  const allVotes = getRawVotes();
  const stats: Record<string, Record<number, number>> = JSON.parse(JSON.stringify(MOCK_COMMUNITY_STATS));
  
  Object.values(allVotes).forEach((vote) => {
    Object.entries(vote.ratings).forEach(([barberId, level]) => {
      if (!stats[barberId]) stats[barberId] = {};
      stats[barberId][level] = (stats[barberId][level] || 0) + 1;
    });
  });
  
  return stats;
};

/**
 * Subscribes to level vote updates using DOM events.
 */
export const subscribeToLevelVotes = (callback: (stats: Record<string, Record<number, number>>) => void) => {
  const update = async () => {
    const stats = await getGlobalLevelStats();
    callback(stats);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mmbarber_votes_updated', update);
    window.addEventListener('storage', update); // Support multi-tab updates
  }
  
  update(); // Initial call

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mmbarber_votes_updated', update);
      window.removeEventListener('storage', update);
    }
  };
};

/**
 * Calculates the dominant level for a barber based on community votes.
 */
export const getDominantLevel = (barberStats: Record<number, number> | undefined): number => {
  if (!barberStats) return 0;
  
  let totalVotes = 0;
  let weightedSum = 0;
  
  // Calculate weighted average
  Object.entries(barberStats).forEach(([level, count]) => {
    const l = parseInt(level);
    weightedSum += l * count;
    totalVotes += count;
  });
  
  if (totalVotes === 0) return 0;
  return Math.round(weightedSum / totalVotes);
};
