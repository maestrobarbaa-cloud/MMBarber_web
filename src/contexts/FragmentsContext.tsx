'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFragments } from '@/hooks/useFragments';
import { FragmentRewardModal } from '@/components/seznamka/FragmentRewardModal';
import { HiddenFragment } from '@/components/seznamka/HiddenFragment';

type FragmentsContextType = {
  fragments: number;
  coins: number;
  fragmentsPerCoin: number;
  claimProfileReward: () => Promise<void>;
  hasClaimedProfile: boolean;
};

const FragmentsContext = createContext<FragmentsContextType | null>(null);

export function FragmentsProvider({ children }: { children: React.ReactNode }) {
  const { state, isLoading, fetchState, claimAction } = useFragments();
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'DAILY' | 'PROFILE' | 'HIDDEN' | null;
    fragmentsAdded: number;
    currentFragments: number;
    fragmentsPerCoin: number;
    coinsAdded: number;
  }>({
    isOpen: false,
    type: null,
    fragmentsAdded: 0,
    currentFragments: 0,
    fragmentsPerCoin: 10,
    coinsAdded: 0
  });

  useEffect(() => {
    if (!isLoading && state?.canClaimDaily) {
      // Auto claim daily
      claimAction('DAILY_LOGIN').then((res) => {
        if (res && res.success) {
          setModalState({
            isOpen: true,
            type: 'DAILY',
            fragmentsAdded: 1,
            currentFragments: res.fragments,
            fragmentsPerCoin: state.fragmentsPerCoin,
            coinsAdded: res.coinsAdded
          });
          fetchState();
        }
      });
    }
  }, [isLoading, state?.canClaimDaily]);

  const handleCollectHidden = async () => {
    if (!state?.activeSpawn) return;
    const res = await claimAction('COLLECT_HIDDEN', state.activeSpawn.id);
    if (res && res.success) {
      setModalState({
        isOpen: true,
        type: 'HIDDEN',
        fragmentsAdded: 1,
        currentFragments: res.fragments,
        fragmentsPerCoin: state.fragmentsPerCoin,
        coinsAdded: res.coinsAdded
      });
      fetchState();
    }
  };

  const claimProfileReward = async () => {
    if (state?.hasClaimedProfile) return;
    const res = await claimAction('PROFILE_COMPLETION');
    if (res && res.success) {
      setModalState({
        isOpen: true,
        type: 'PROFILE',
        fragmentsAdded: 3,
        currentFragments: res.fragments,
        fragmentsPerCoin: state.fragmentsPerCoin,
        coinsAdded: res.coinsAdded
      });
      fetchState();
    }
  };

  return (
    <FragmentsContext.Provider value={{
      fragments: state?.fragments || 0,
      coins: state?.coins || 0,
      fragmentsPerCoin: state?.fragmentsPerCoin || 10,
      claimProfileReward,
      hasClaimedProfile: state?.hasClaimedProfile || false
    }}>
      {children}
      
      {state?.activeSpawn && !state.canClaimDaily && (
        <HiddenFragment onCollect={handleCollectHidden} />
      )}

      <FragmentRewardModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        fragmentsAdded={modalState.fragmentsAdded}
        currentFragments={modalState.currentFragments}
        fragmentsPerCoin={modalState.fragmentsPerCoin}
        coinsAdded={modalState.coinsAdded}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </FragmentsContext.Provider>
  );
}

export function useFragmentsContext() {
  const context = useContext(FragmentsContext);
  if (!context) throw new Error('useFragmentsContext must be used within FragmentsProvider');
  return context;
}
