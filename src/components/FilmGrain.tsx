"use client";

import React, { useEffect, useState } from "react";

export function FilmGrain() {
  const [isLowTier, setIsLowTier] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      setIsLowTier(tier === 'low' || tier === 'medium' || window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mmbarber-graphics-update', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-graphics-update', checkMobile);
    };
  }, []);

  if (isLowTier) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.03] film-grain-container">
      <svg className="w-full h-full">
        <filter id="grainy">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainy)" />
      </svg>
      <style jsx>{`
        div {
          animation: grain 8s steps(10) infinite;
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-2%, 2%); }
          40% { transform: translate(2%, -1%); }
          50% { transform: translate(-1%, 2%); }
          60% { transform: translate(1%, -2%); }
          70% { transform: translate(-2%, -2%); }
          80% { transform: translate(2%, 1%); }
          90% { transform: translate(-1%, 1%); }
        }
      `}</style>
    </div>
  );
}
