"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { barbers as staticBarbers } from '@/data/barbers';

export interface BarberRank {
  level: number;
  title: string;
  status?: 'promoted' | 'demoted' | 'stable' | 'demotedDesertion';
  nextRankIn?: string;
}

export interface BarberProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  desc: string;
  schedule: string;
  bookingLink?: string;
  specializations: string[];
  symbol: string;
  rank?: BarberRank;
  parentId?: string;
  customChatText?: string;
  orderIndex?: number;
  requiresUnlock?: boolean;
  unlockThreshold?: number;
  missionFailed?: boolean;
  bookingSystemType?: 'external' | 'internal';
  structuredSchedule?: Record<string, { work: boolean, start: string, end: string }>;
}

interface BarberContextType {
  barbers: BarberProfile[];
  loading: boolean;
  refreshBarbers: () => Promise<void>;
}

const BarberContext = createContext<BarberContextType>({
  barbers: staticBarbers as BarberProfile[],
  loading: false,
  refreshBarbers: async () => {},
});

export const useBarbers = () => useContext(BarberContext);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [barbers, setBarbers] = useState<BarberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBarbers = async () => {
    try {
      const res = await fetch('/api/barbers');
      if (res.ok) {
        const data = await res.json();
        setBarbers(data.barbers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return (
    <BarberContext.Provider value={{ barbers, loading, refreshBarbers: fetchBarbers }}>
      {children}
    </BarberContext.Provider>
  );
};
