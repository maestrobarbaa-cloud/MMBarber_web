"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

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
  // Extended fields from DB
  parentId?: string;
  customChatText?: string;
  orderIndex?: number;
}

interface BarberContextType {
  barbers: BarberProfile[];
  loading: boolean;
  refreshBarbers: () => Promise<void>;
}

const BarberContext = createContext<BarberContextType>({
  barbers: [],
  loading: true,
  refreshBarbers: async () => {},
});

export const useBarbers = () => useContext(BarberContext);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [barbers, setBarbers] = useState<BarberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBarbers = async () => {
    try {
      const res = await fetch('/api/barbers');
      if (res.ok) {
        const data = await res.json();
        setBarbers(data.barbers || []);
      }
    } catch (e) {
      console.error('Failed to fetch barbers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBarbers();
  }, []);

  return (
    <BarberContext.Provider value={{ barbers, loading, refreshBarbers }}>
      {children}
    </BarberContext.Provider>
  );
};
