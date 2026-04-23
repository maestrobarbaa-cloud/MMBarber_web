"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

/**
 * A wrapper around next/image that automatically adjusts quality 
 * based on the global graphics tier.
 */
export default function OptimizedImage(props: ImageProps) {
  const [quality, setQuality] = useState(props.quality || 75);

  useEffect(() => {
    const checkTier = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      
      // Determine quality based on tier
      // High/Ultra: 100%
      // Medium: 85%
      // Low: 60%
      let targetQuality = 75;
      if (tier === 'ultra' || tier === 'high') {
        targetQuality = 100;
      } else if (tier === 'medium') {
        targetQuality = 85;
      } else {
        targetQuality = 60;
      }
      
      setQuality(targetQuality);
    };

    checkTier();
    window.addEventListener('mmbarber-graphics-update', checkTier);
    return () => window.removeEventListener('mmbarber-graphics-update', checkTier);
  }, []);

  return <Image {...props} quality={quality} />;
}
