export interface BarberRating {
  level: number;
  title: number;
}

export interface LevelVote {
  userId: string;
  ratings: Record<string, BarberRating>; // barberId -> { level, title }
  date: string;
}

const STORAGE_KEY = 'mmbarber_local_votes_v2';
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
 * Aggregated stats for levels and titles
 */
export interface AggregatedStats {
  levels: Record<string, Record<number, number>>; // barberId -> level -> count
  titles: Record<string, Record<number, number>>; // barberId -> titleIndex -> count
}

/**
 * Casts multi-barber level & title votes for a user.
 */
export const castMultiVote = async (userId: string, ratings: Record<string, BarberRating>) => {
  const today = getTodayKey();
  const allVotes = getRawVotes();
  
  allVotes[userId] = {
    userId,
    ratings,
    date: today
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allVotes));
  window.dispatchEvent(new CustomEvent('mmbarber_votes_updated'));
};

const getRawVotes = (): Record<string, LevelVote> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Try migration from v1 if exists
    const oldData = localStorage.getItem('mmbarber_local_votes');
    if (oldData) {
      const parsed = JSON.parse(oldData);
      const migrated: Record<string, LevelVote> = {};
      Object.entries(parsed).forEach(([uid, vote]: [string, any]) => {
        const newRatings: Record<string, BarberRating> = {};
        Object.entries(vote.ratings).forEach(([bid, lvl]) => {
          newRatings[bid] = { level: lvl as number, title: lvl as number };
        });
        migrated[uid] = { userId: uid, ratings: newRatings, date: vote.date };
      });
      return migrated;
    }
    return {};
  }
  return JSON.parse(data);
};

/**
 * Gets the current user's votes for today.
 */
export const getTodayMultiVote = async (userId: string): Promise<Record<string, BarberRating> | null> => {
  const allVotes = getRawVotes();
  const userVote = allVotes[userId];
  const today = getTodayKey();
  
  if (userVote && userVote.date === today) {
    return userVote.ratings;
  }
  return null;
};

/**
 * Aggregates all local votes.
 */
export const getGlobalLevelStats = async (): Promise<AggregatedStats> => {
  const allVotes = getRawVotes();
  const stats: AggregatedStats = {
    levels: {},
    titles: {}
  };
  
  Object.values(allVotes).forEach((vote) => {
    Object.entries(vote.ratings).forEach(([barberId, rating]) => {
      // Levels
      if (!stats.levels[barberId]) stats.levels[barberId] = {};
      stats.levels[barberId][rating.level] = (stats.levels[barberId][rating.level] || 0) + 1;
      
      // Titles
      if (!stats.titles[barberId]) stats.titles[barberId] = {};
      stats.titles[barberId][rating.title] = (stats.titles[barberId][rating.title] || 0) + 1;
    });
  });
  
  return stats;
};

/**
 * Subscribes to level vote updates using DOM events.
 */
export const subscribeToLevelVotes = (callback: (stats: AggregatedStats) => void) => {
  const update = async () => {
    const stats = await getGlobalLevelStats();
    callback(stats);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mmbarber_votes_updated', update);
    window.addEventListener('storage', update);
  }
  
  update();

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mmbarber_votes_updated', update);
      window.removeEventListener('storage', update);
    }
  };
};

/**
 * Calculates the dominant value (average rounded) for a barber based on community votes.
 */
export const getDominantLevel = (barberStats: Record<number, number> | undefined): number => {
  if (!barberStats) return 0;
  
  let totalVotes = 0;
  let weightedSum = 0;
  
  Object.entries(barberStats).forEach(([val, count]) => {
    const v = parseInt(val);
    weightedSum += v * count;
    totalVotes += count;
  });
  
  if (totalVotes === 0) return 0;
  return Math.round(weightedSum / totalVotes);
};
