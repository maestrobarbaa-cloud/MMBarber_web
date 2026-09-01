'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function HeatmapTracker() {
  const pathname = usePathname();
  const batchRef = useRef<any[]>([]);
  const MAX_BATCH_SIZE = 5;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Získat ID nejbližšího interaktivního elementu
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [id]') as HTMLElement;
      
      const payload = {
        path: pathname || '/',
        elementId: clickable ? clickable.id || clickable.tagName : target.tagName,
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        screenW: window.innerWidth,
        screenH: window.innerHeight,
      };

      batchRef.current.push(payload);

      // Odeslat dávku, pokud je plná
      if (batchRef.current.length >= MAX_BATCH_SIZE) {
        sendBatch(batchRef.current);
        batchRef.current = [];
      }
    };

    window.addEventListener('click', handleClick);

    // Odeslat zbytek při odchodu ze stránky
    const handleBeforeUnload = () => {
      if (batchRef.current.length > 0) {
        sendBatch(batchRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  const sendBatch = async (batch: any[]) => {
    try {
      // Posíláme po jednom nebo lze upravit backend na hromadný insert.
      // Pro teď jen projedeme pole a pošleme, aby nedošlo ke ztrátě přes batch limit 1 na API route.
      // V produkci by API mělo brát pole. Upravíme to na for loop.
      for (const item of batch) {
        // Používáme sendBeacon pokud prohlížeč podporuje (dobré pro beforeunload), jinak fetch
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/telemetry', JSON.stringify(item));
        } else {
          await fetch('/api/telemetry', {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (e) {
      // Fail silently pro telemetrii
    }
  };

  return null;
}
