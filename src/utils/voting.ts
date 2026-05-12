import { useState, useEffect } from "react";

export interface BarberRating {
  level: number;
  title: number;
  nickname?: string;
  customTitle?: string;
  prefix?: string;
  suffix?: string;
}

export interface UserRatings {
  ratings: Record<string, BarberRating>; // barberId -> { level, title }
  updatedAt: string;
}

const STORAGE_KEY = 'mmbarber_user_settings_v1';

/**
 * Saves user ratings to local storage.
 */
export const castMultiVote = async (userId: string, ratings: Record<string, BarberRating>) => {
  const data: UserRatings = {
    ratings,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('mmbarber_ratings_updated'));
};

/**
 * Gets the current user's ratings.
 */
export const getUserRatings = (): Record<string, BarberRating> | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as UserRatings;
    return parsed.ratings;
  } catch (e) {
    console.error("Failed to parse user ratings", e);
    return null;
  }
};

/**
 * Subscribes to user rating updates.
 */
export const subscribeToUserRatings = (callback: (ratings: Record<string, BarberRating> | null) => void) => {
  const update = () => {
    const ratings = getUserRatings();
    callback(ratings);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mmbarber_ratings_updated', update);
    window.addEventListener('storage', update);
  }
  
  update();

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mmbarber_ratings_updated', update);
      window.removeEventListener('storage', update);
    }
  };
};

/**
 * Hook to use local barber settings
 */
export const useBarberLocalSettings = (barberId: string, defaultName: string, defaultLevel: number) => {
  const [settings, setSettings] = useState<BarberRating & { name: string }>({
    level: defaultLevel,
    title: defaultLevel,
    name: defaultName
  });

  useEffect(() => {
    const unsubscribe = subscribeToUserRatings(ratings => {
      if (ratings && ratings[barberId]) {
        const r = ratings[barberId];
        setSettings({
          level: r.level,
          title: r.title,
          customTitle: r.customTitle,
          nickname: r.nickname,
          name: r.nickname || defaultName
        });
      } else {
        setSettings({
          level: defaultLevel,
          title: defaultLevel,
          name: defaultName
        });
      }
    });
    return unsubscribe;
  }, [barberId, defaultName, defaultLevel]);

  return settings;
};

/**
 * Dummy function for backward compatibility or migration if needed
 */
export const getTodayMultiVote = async (userId: string): Promise<Record<string, BarberRating> | null> => {
  return getUserRatings();
};
