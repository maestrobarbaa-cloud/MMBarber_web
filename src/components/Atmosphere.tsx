"use client";

import { useEffect, useState } from "react";

export function Atmosphere() {
  const [isLowTier, setIsLowTier] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsLowTier(document.documentElement.getAttribute('data-graphics-tier') === 'low' || window.innerWidth < 1024);
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden atmosphere-container">
      {/* Vignette effect - Providing global noir feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.85)_100%)] z-30 pointer-events-none"></div>
    </div>
  );
}
