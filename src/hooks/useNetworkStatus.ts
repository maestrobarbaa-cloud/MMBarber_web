"use client";

import { useState, useEffect } from 'react';

export interface NetworkStatus {
  online: boolean;
  saveData: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | string;
  isLowBandwidth: boolean;
}

// Typování pro experimentální API navigator.connection
declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
      saveData: boolean;
      addEventListener: (type: string, listener: EventListener) => void;
      removeEventListener: (type: string, listener: EventListener) => void;
    };
  }
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: true,
    saveData: false,
    effectiveType: '4g',
    isLowBandwidth: false
  });

  useEffect(() => {
    // Podpora pro SSR
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const connection = navigator.connection;
      
      const saveData = connection?.saveData ?? false;
      const effectiveType = connection?.effectiveType ?? '4g';
      
      // Jsme v "Low Bandwidth" režimu, pokud je zapnuté šetření dat,
      // nebo pokud je detekováno 2G, 3G či slow-2G připojení.
      // Dále pokud je uživatel offline.
      const isLowBandwidth = !isOnline || saveData || effectiveType === '2g' || effectiveType === '3g' || effectiveType === 'slow-2g';

      setStatus({
        online: isOnline,
        saveData,
        effectiveType,
        isLowBandwidth
      });
    };

    // Počáteční načtení
    updateStatus();

    // Event listenery pro změny online/offline
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Event listener pro změnu sítě
    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}
