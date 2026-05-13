"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const generateStars = (n: number, max: number) => {
  let value = `${Math.floor(Math.random() * max)}px ${Math.floor(Math.random() * max)}px #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * max)}px ${Math.floor(Math.random() * max)}px #FFF`;
  }
  return value;
};

export function Atmosphere() {
  const [isLowTier, setIsLowTier] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState({ s1: "", s2: "", s3: "" });

  useEffect(() => {
    setIsMounted(true);
    // Generate static stars once on mount to avoid hydration mismatch and performance issues
    setStars({
      s1: generateStars(700, 2000),
      s2: generateStars(200, 2000),
      s3: generateStars(100, 2000)
    });

    const checkMobile = () => {
      const tier = document.documentElement.getAttribute('data-graphics-tier');
      setIsLowTier(tier === 'low' || window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mmbarber-graphics-update', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-graphics-update', checkMobile);
    };
  }, []);

  if (isLowTier || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black atmosphere-container">
      {/* Dynamic Star Layers generated via CSS for maximum browser compatibility (Firefox fix) */}
      <div className="absolute inset-0 z-0">
        <div className="stars-layer-1" />
        <div className="stars-layer-2" />
        <div className="stars-layer-3" />
      </div>
      
      {/* Cinematic Galaxy Glows - Enhanced for depth */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-mafia-gold/5 blur-[150px] rounded-full animate-pulse-slow opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-mafia-blood/5 blur-[120px] rounded-full animate-pulse-slow-reverse opacity-40"></div>
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-blue-900/5 blur-[100px] rounded-full animate-pulse-slow opacity-30"></div>
      </div>

      {/* Layer 3: Vignette & Focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,0.8)_100%)] z-20 pointer-events-none"></div>

      <style jsx global>{`
        .stars-layer-1 {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${stars.s1};
          animation: animStar 150s linear infinite;
        }
        
        .stars-layer-2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${stars.s2};
          animation: animStar 100s linear infinite;
        }
        
        .stars-layer-3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: ${stars.s3};
          animation: animStar 50s linear infinite;
        }

        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }

        .animate-pulse-slow {
          animation: pulse-atmosphere 15s ease-in-out infinite;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-atmosphere-rev 20s ease-in-out infinite;
        }
        @keyframes pulse-atmosphere {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes pulse-atmosphere-rev {
          0%, 100% { opacity: 0.6; transform: scale(1.1); }
          50% { opacity: 0.3; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
