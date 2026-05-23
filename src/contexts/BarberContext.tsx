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
  bookingLink: string;
  specializations: string[];
  symbol: string;
  rank?: BarberRank;
  parentId?: string;
  customChatText?: string;
  orderIndex?: number;
  requiresUnlock?: boolean;
  unlockThreshold?: number;
  missionFailed?: boolean;
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
  const [barbers] = useState<BarberProfile[]>(staticBarbers as BarberProfile[]);

  return (
    <BarberContext.Provider value={{ barbers, loading: false, refreshBarbers: async () => {} }}>
      {children}
    </BarberContext.Provider>
  );
};
