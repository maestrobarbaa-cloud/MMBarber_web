'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { UIProvider } from '@/contexts/UIContext';
import { FragmentsProvider } from '@/contexts/FragmentsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UIProvider>
        <FragmentsProvider>
          {children}
        </FragmentsProvider>
      </UIProvider>
    </SessionProvider>
  );
}
