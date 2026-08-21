"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

/**
 * A wrapper around next/image that automatically adjusts quality 
 * based on the global graphics tier.
 */
export default function OptimizedImage(props: ImageProps) {
  // Initialize to a stable value to prevent hydration mismatch
  const [quality, setQuality] = useState<number>(Number(props.quality) || 75);

  useEffect(() => {
    const checkTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      let baseQuality = Number(props.quality) || 85;
      
      // Dynamic auto-detection of device capabilities
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-expect-error - experimental API
      const ram = navigator.deviceMemory || 4;
      // @ts-expect-error - experimental API
      const connection = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      let penalty = 0;
      
      // CPU Cores Penalty
      if (cores <= 2) penalty += 20; // Weak CPU
      else if (cores <= 4) penalty += 10;
      
      // RAM Memory Penalty
      if (ram <= 2) penalty += 20; // Low memory
      else if (ram <= 4) penalty += 10;

      // Network Speed & Data Saver Penalty
      if (connection) {
        if (connection.saveData === true) {
          penalty += 30; // Data saver active
        } else if (connection.effectiveType === '2g') {
          penalty += 35;
        } else if (connection.effectiveType === '3g') {
          penalty += 15;
        }
      }

      let targetQuality = Math.max(45, baseQuality - penalty);

      // Force 100% quality on Ultra tier as requested by user
      if (tier === 'ultra') {
        targetQuality = 100;
      } else if (tier === 'lite') {
        // Force lower bound for lite mode
        targetQuality = Math.min(50, targetQuality);
      }

      setQuality(Math.round(targetQuality));
    };

    // Run immediately on mount (client-side only) to set the correct quality
    checkTier();

    window.addEventListener('mmbarber-graphics-update', checkTier);
    return () => window.removeEventListener('mmbarber-graphics-update', checkTier);
  }, [props.quality]);

  return <Image {...props} quality={quality} />;
}
