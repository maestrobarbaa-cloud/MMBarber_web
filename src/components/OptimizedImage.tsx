"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

/**
 * A wrapper around next/image that automatically adjusts quality 
 * based on the global graphics tier.
 */
export default function OptimizedImage(props: ImageProps) {
  const [quality, setQuality] = useState<number>(() => {
    // Initial stable quality detection
    if (typeof document === 'undefined') return Number(props.quality) || 75;
    
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    const isMobile = window.innerWidth < 1280;
    
    if (tier === 'ultra' || tier === 'high') {
      return isMobile ? 85 : 95;
    } else if (tier === 'medium') {
      return 80;
    } else if (tier === 'low') {
      return 65;
    }
    return Number(props.quality) || 75;
  });

  useEffect(() => {
    const checkTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      const isMobile = window.innerWidth < 1280;
      let targetQuality = 75;
      
      if (tier === 'ultra' || tier === 'high') {
        targetQuality = isMobile ? 85 : 95;
      } else if (tier === 'medium') {
        targetQuality = 80;
      } else {
        targetQuality = 65;
      }
      
      // Only update if it's actually different to prevent unnecessary re-fetches
      setQuality(prev => prev !== targetQuality ? targetQuality : prev);
    };

    // No need to run checkTier immediately as we did it in useState
    window.addEventListener('mmbarber-graphics-update', checkTier);
    return () => window.removeEventListener('mmbarber-graphics-update', checkTier);
  }, []);

  return <Image {...props} quality={quality} />;
}
