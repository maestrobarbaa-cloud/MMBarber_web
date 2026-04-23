"use client";

import { useEffect, useState, useCallback } from "react";
import { Compass, Navigation2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const TARGET_LAT = 49.0592272;
const TARGET_LON = 17.4835088;
const SEARCH_QUERY = "MMBARBER Mařatice";

export function MobileCompass() {
  const { t, lang } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0); 
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState<number>(0);
  const [distanceRaw, setDistanceRaw] = useState<string>("");
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);
  const [locationTimeout, setLocationTimeout] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEnabled && !distanceRaw) {
      timer = setTimeout(() => {
        setLocationTimeout(true);
      }, 8000); // 8 seconds timeout
    } else if (distanceRaw) {
      setLocationTimeout(false);
    }
    return () => clearTimeout(timer);
  }, [isEnabled, distanceRaw]);

  const handleToggle = useCallback(() => {
    const next = !isEnabled;
    setIsEnabled(next);
    localStorage.setItem("mmbarber_compass_enabled", next.toString());
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: next }));
    }, 0);
  }, [isEnabled]);

  useEffect(() => {
    // Initial sync
    const stored = localStorage.getItem("mmbarber_compass_enabled") === "true";
    setIsEnabled(stored);
    
    window.addEventListener('mmbarber-toggle-compass', handleToggle);

    const checkMobile = () => setIsVisible(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if ("geolocation" in navigator && isEnabled && isVisible) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat1 = pos.coords.latitude;
          const lon1 = pos.coords.longitude;
          
          const lat1Rad = lat1 * Math.PI / 180;
          const lat2Rad = TARGET_LAT * Math.PI / 180;
          const dLonRad = (TARGET_LON - lon1) * Math.PI / 180;

          const y = Math.sin(dLonRad) * Math.cos(lat2Rad);
          const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad);
          
          const brng = Math.atan2(y, x) * 180 / Math.PI;
          setTargetBearing((brng + 360) % 360);

          const R = 6371e3; // metres
          const φ1 = lat1 * Math.PI / 180;
          const φ2 = TARGET_LAT * Math.PI / 180;
          const Δφ = (TARGET_LAT - lat1) * Math.PI / 180;
          const Δλ = (TARGET_LON - lon1) * Math.PI / 180;

          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          
          let dDisplay = "";
          if (d < 15) {
            dDisplay = lang === 'cs' ? 'V CÍLI' : 'ARRIVED';
          } else {
            dDisplay = d > 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`;
          }
          setDistanceRaw(dDisplay);
        },
        null,
        { enableHighAccuracy: true }
      );
    }

    return () => {
      window.removeEventListener('mmbarber-toggle-compass', handleToggle);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isEnabled, isVisible, handleToggle]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      // iOS
      if (e.webkitCompassHeading !== undefined) {
        setUserHeading(e.webkitCompassHeading);
      } 
      // Android / Others
      else if (e.alpha !== null) {
        // Alpha is 0-360, but absolute property tells us if it's relative to Earth
        // Most modern Android browsers support absolute
        const heading = e.absolute ? e.alpha : (360 - e.alpha);
        setUserHeading(heading);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && isEnabled && isVisible) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isEnabled, isVisible]);

  useEffect(() => {
    if (userHeading !== null) {
      setRotation(targetBearing - userHeading);
    } else {
      setRotation(targetBearing);
    }
  }, [userHeading, targetBearing]);

  const requestPermission = () => {
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            setIsPermissionRequested(true);
          }
        })
        .catch(console.error);
    } else {
        setIsPermissionRequested(true);
    }
  };

  const isArrived = distanceRaw === 'V CÍLI' || distanceRaw === 'ARRIVED';
  const distanceText = isArrived 
    ? (lang === 'cs' ? 'JSTE V CÍLI' : 'YOU HAVE ARRIVED')
    : (t.cityGuide?.compass?.distance?.replace("{{distance}}", distanceRaw) || `${distanceRaw} away`);

  return (
    <>
      <AnimatePresence>
        {isVisible && isEnabled && (
        <motion.div
           initial={{ y: 150, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 150, opacity: 0 }}
           className="fixed bottom-0 inset-x-0 z-[2000] p-4 xl:hidden"
        >
          <div 
             className="w-full bg-mafia-black/95 backdrop-blur-3xl border-2 border-mafia-gold p-2 md:p-3 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.9)] relative group overflow-hidden"
          >
             {/* Close Button */}
             <button 
               onClick={() => {
                 setIsEnabled(false);
                 localStorage.setItem("mmbarber_compass_enabled", "false");
                 setTimeout(() => {
                   window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: false }));
                 }, 0);
               }}
               className="absolute -top-2 -right-2 text-mafia-gold/60 hover:text-mafia-gold z-30 p-4"
             >
               <X size={32} className="compass-x bg-mafia-black/80 rounded-full border border-mafia-gold/20" />
             </button>

             {/* HUD Scanning Line */}
             <motion.div 
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-mafia-gold/5 to-transparent skew-x-[-20deg]"
             />

             {/* Left: Compass Icon */}
             <div className="relative z-10 w-16 flex items-center justify-start" onClick={() => {
                if (!isPermissionRequested) requestPermission();
             }}>
                <div className="relative w-16 h-16 flex items-center justify-center scale-90 origin-left">
                    {/* Outer Rings */}
                    <div className="compass-ring absolute inset-0 border-2 border-mafia-gold/20 rounded-full shadow-[0_0_15px_rgba(197,160,89,0.1)]"></div>
                    <div className="compass-ring absolute inset-1 border border-mafia-gold/10 rounded-full"></div>
                    
                    {/* Compass Marks */}
                    {[0, 90, 180, 270].map(deg => (
                        <div key={deg} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${deg}deg)` }}>
                            {deg === 0 ? (
                              <span className="text-[10px] font-black text-mafia-gold -translate-y-1">N</span>
                            ) : (
                              <div className="compass-mark w-0.5 h-1.5 bg-mafia-gold/40"></div>
                            )}
                        </div>
                    ))}

                    {/* Rotating Pointer */}
                    <motion.div 
                        animate={isArrived ? { 
                          rotate: [rotation, rotation + 360, rotation + 1080, rotation + 2160],
                          scale: [1, 1.1, 0.9, 1.1, 1]
                        } : { rotate: rotation }}
                        transition={isArrived ? { 
                          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        } : { type: "spring", stiffness: 40, damping: 15 }}
                        className="relative z-20"
                    >
                        <svg width="40" height="40" viewBox="0 0 100 100">
                           {!isPermissionRequested && !isArrived && (
                              <motion.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="var(--color-mafia-gold)" strokeWidth="2" strokeDasharray="10 10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              />
                           )}
                           {isArrived && (
                              <motion.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="var(--color-mafia-red)" strokeWidth="1" strokeDasharray="5 5"
                                animate={{ rotate: -360, opacity: [0.2, 0.8, 0.2] }}
                                transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" }, opacity: { duration: 2, repeat: Infinity } }}
                              />
                           )}
                           <defs>
                             <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
                               <stop offset="0%" stopColor="#ff0000" />
                               <stop offset="100%" stopColor="#cc0000" />
                             </linearGradient>
                             <linearGradient id="needleGold" x1="0%" y1="0%" x2="0%" y2="100%">
                               <stop offset="0%" stopColor="var(--color-mafia-gold)" />
                               <stop offset="100%" stopColor="var(--color-mafia-sepia)" />
                             </linearGradient>
                           </defs>
                           {/* Red Pointer Half */}
                           <path d="M50 10 L65 50 L35 50 Z" fill="url(#needleRed)" className="drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                           {/* Gold Trailing Half */}
                           <path d="M50 90 L65 50 L35 50 Z" fill="url(#needleGold)" className="opacity-90" />
                           <circle cx="50" cy="50" r="5" fill="white" className="drop-shadow-[0_0_3px_rgba(255,255,255,1)]" />
                        </svg>
                        {!isPermissionRequested && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[7px] font-black text-mafia-gold animate-pulse text-center leading-tight">SYNC</span>
                           </div>
                        )}
                    </motion.div>
                </div>
             </div>

             {/* Middle: Distance and Label */}
             <div className="flex-1 flex flex-col items-center justify-center text-center px-2 relative z-10" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`, '_blank')}>
                <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1 h-1 rounded-full bg-mafia-red animate-pulse"></div>
                    <span className="text-mafia-gold font-heading font-black text-[9px] uppercase tracking-[0.2em]">{t.cityGuide?.compass?.label || 'NAVIGACE'}</span>
                </div>
                 <span className="text-white font-mono text-base uppercase tracking-widest font-black [text-shadow:0_0_10px_rgba(255,255,255,0.3)] truncate w-full">
                    {distanceRaw ? distanceText : (locationTimeout ? (lang === 'cs' ? 'UHERSKÉ HRADIŠTĚ' : 'UHERSKE HRADISTE') : (t.cityGuide?.compass?.locating || 'VYHLEDÁVÁNÍ...'))}
                </span>
             </div>

             {/* Right: Map Button */}
             <div className="w-12 flex flex-col items-center justify-center gap-0.5 relative z-10" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`, '_blank')}>
                <div className="text-mafia-gold group-hover:scale-110 transition-transform">
                    <Navigation2 size={20} fill="currentColor" />
                </div>
                <span className="text-[7px] font-black text-mafia-gold/60 uppercase tracking-widest">MAPY</span>
             </div>
           </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
