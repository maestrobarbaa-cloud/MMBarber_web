"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Compass, Navigation2, X, Radar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const TARGET_LAT = 49.0592283;
const TARGET_LON = 17.4835047;
const SEARCH_QUERY = "Sadová 1383, 686 05 Uherské Hradiště";
const AUTO_SHOW_RADIUS_METERS = 5000; // 5 km
const ANTI_ANNOYANCE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface HUDState {
  opens: number;
  lastClosedAt: number;
  arrivedTotal: number;
}

export function MobileCompass() {
  const { t, lang } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0); 
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState<number>(0);
  const [distanceRaw, setDistanceRaw] = useState<string>("");
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);
  const [locationTimeout, setLocationTimeout] = useState(false);
  const [bootStage, setBootStage] = useState<0 | 1 | 2>(0); // 0: Off, 1: Booting, 2: Ready
  const [hudStats, setHudStats] = useState<HUDState>({ opens: 0, lastClosedAt: 0, arrivedTotal: 0 });

  const isArrived = distanceMeters !== null && distanceMeters < 50; // Arrived if < 50m

  // Load HUD Stats from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mmbarber_hud_state");
      if (stored) {
        setHudStats(JSON.parse(stored));
      }
    } catch(e) {}
  }, []);

  const saveHudStats = (newStats: Partial<HUDState>) => {
    const updated = { ...hudStats, ...newStats };
    setHudStats(updated);
    localStorage.setItem("mmbarber_hud_state", JSON.stringify(updated));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEnabled && !distanceRaw) {
      timer = setTimeout(() => {
        setLocationTimeout(true);
      }, 8000);
    } else if (distanceRaw) {
      setLocationTimeout(false);
    }
    return () => clearTimeout(timer);
  }, [isEnabled, distanceRaw]);

  const requestPermission = useCallback(() => {
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
  }, []);

  const startBootSequence = () => {
    setBootStage(1);
    setTimeout(() => {
      setBootStage(2);
    }, 2000); // 2 second boot sequence
  };

  const handleToggle = useCallback(() => {
    const next = !isEnabled;
    setIsEnabled(next);
    
    if (next) {
      requestPermission();
      startBootSequence();
      saveHudStats({ opens: hudStats.opens + 1 });
    } else {
      setBootStage(0);
      saveHudStats({ lastClosedAt: Date.now() });
    }
    
    localStorage.setItem("mmbarber_compass_enabled", next.toString());
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: next }));
    }, 0);
  }, [isEnabled, requestPermission, hudStats]);

  useEffect(() => {
    const stored = localStorage.getItem("mmbarber_compass_enabled") === "true";
    
    // Auto-Show logic checking
    const now = Date.now();
    const isCooldownActive = now - hudStats.lastClosedAt < ANTI_ANNOYANCE_COOLDOWN_MS;
    
    if (stored && !isCooldownActive) {
       setIsEnabled(true);
       startBootSequence();
    }
    
    window.addEventListener('mmbarber-toggle-compass', handleToggle);

    const checkMobile = () => setIsVisible(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    let watchId: number;
    if ("geolocation" in navigator && isEnabled && isVisible) {
      watchId = navigator.geolocation.watchPosition(
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
          
          setDistanceMeters(d);
          let dDisplay = "";
          dDisplay = d > 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`;
          setDistanceRaw(dDisplay);

          // If arrived, track it (once per session ideally)
          if (d < 50 && !isArrived) {
              saveHudStats({ arrivedTotal: hudStats.arrivedTotal + 1 });
          }

        },
        null,
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }

    return () => {
      window.removeEventListener('mmbarber-toggle-compass', handleToggle);
      window.removeEventListener("resize", checkMobile);
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isEnabled, isVisible, handleToggle, lang, hudStats]);

  const [calibrationOffset, setCalibrationOffset] = useState(0);

  const handleCalibrate = () => {
    if (userHeading !== null) {
      setCalibrationOffset(userHeading);
    }
  };

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      if (e.webkitCompassHeading !== undefined) {
        setUserHeading(e.webkitCompassHeading);
      } 
      else if (e.alpha !== null) {
        const heading = e.absolute ? (360 - e.alpha) : (360 - e.alpha);
        setUserHeading(heading % 360);
      }
    };

    if (typeof window !== 'undefined') {
      const win = window as any;
      if ('ondeviceorientationabsolute' in win) {
        win.addEventListener("deviceorientationabsolute", handleOrientation, true);
      } else if ('DeviceOrientationEvent' in win) {
        win.addEventListener("deviceorientation", handleOrientation, true);
      }
    }
    return () => {
      const win = window as any;
      if (typeof win !== 'undefined') {
        win.removeEventListener("deviceorientationabsolute", handleOrientation);
        win.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [isEnabled, isVisible]);

  useEffect(() => {
    if (userHeading !== null) {
      const calibratedHeading = (userHeading - calibrationOffset + 360) % 360;
      setRotation(targetBearing - calibratedHeading);
    } else {
      setRotation(targetBearing);
    }
  }, [userHeading, targetBearing, calibrationOffset]);


  const closeHUD = () => {
    setIsEnabled(false);
    setBootStage(0);
    saveHudStats({ lastClosedAt: Date.now() });
    localStorage.setItem("mmbarber_compass_enabled", "false");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: false }));
    }, 0);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && isEnabled && (
        <motion.div
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col xl:hidden overflow-y-auto touch-pan-y animate-crt-flicker"
        >
          {/* Background Elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mafia-gold/10 via-transparent to-transparent opacity-40"></div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
             <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>
          </div>

          <div className="relative z-10 min-h-full flex flex-col items-center p-6 pt-20 pb-10">
            {/* Close Button */}
            <button 
              onClick={closeHUD}
              className="fixed top-6 right-6 flex items-center gap-2 text-mafia-gold z-50 p-2 pl-4 bg-mafia-black/80 rounded-full border border-mafia-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.3)] active:scale-95 transition-all hover:bg-mafia-gold/10"
            >
              <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase">{lang === 'cs' ? 'ZAVŘÍT' : 'CLOSE'}</span>
              <X size={20} />
            </button>

            {/* Boot Sequence Overlay */}
            <AnimatePresence>
               {bootStage === 1 && (
                  <motion.div 
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
                  >
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="h-1 bg-mafia-gold mb-4"
                     />
                     <p className="text-mafia-gold font-mono text-xs tracking-[0.5em] animate-pulse">
                        INITIALIZING SYSTEM...
                     </p>
                     <div className="mt-8 text-[8px] font-mono text-mafia-gold/50 text-left w-48 space-y-1">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>&gt; LOCATING SATELLITES...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>&gt; ESTABLISHING LINK...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>&gt; ACQUIRING TARGET...</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>&gt; HUD READY.</motion.p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: bootStage === 2 ? 1 : 0, y: bootStage === 2 ? 0 : 20 }}
               transition={{ duration: 0.5 }}
               className="flex flex-col items-center w-full"
            >
                {/* HUD Header */}
                <div className="flex flex-col items-center gap-2 mb-8">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-mafia-red animate-pulse drop-shadow-[0_0_5px_rgba(255,0,0,1)]"></div>
                      <h2 className="text-mafia-gold font-heading font-black text-sm uppercase tracking-[0.4em] text-center drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">
                         {t.cityGuide?.compass?.label || 'TACTICAL NAVIGATION'}
                      </h2>
                   </div>
                   <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent"></div>
                </div>

                {/* Main Compass Area */}
                <div className="relative w-[70vw] h-[70vw] max-w-[280px] max-h-[280px] flex items-center justify-center mb-10" onClick={() => {
                   if (!isPermissionRequested) requestPermission();
                }}>
                   <div className="absolute inset-[-15px] border-2 border-mafia-gold/20 rounded-full shadow-[0_0_50px_rgba(197,160,89,0.1)]"></div>
                   
                   {/* Radar Sweep Effect */}
                   <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                      <div className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(197,160,89,0.2)_90deg,transparent_90deg)] animate-radar-sweep origin-center" />
                      <div className="absolute inset-0 border border-mafia-gold/10 rounded-full"></div>
                      <div className="absolute inset-8 border border-mafia-gold/5 rounded-full"></div>
                      <div className="absolute inset-16 border border-mafia-gold/5 rounded-full"></div>
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-mafia-gold/5"></div>
                      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-mafia-gold/5"></div>
                   </div>

                   {/* Rotating Dial (Letters and Target Dot follow Earth) */}
                   <motion.div 
                     animate={{ rotate: userHeading !== null ? -(userHeading - calibrationOffset) : 0 }}
                     transition={{ type: "spring", stiffness: 40, damping: 15 }}
                     className="absolute inset-0 border-2 border-mafia-gold/30 rounded-full bg-black/50 backdrop-blur-md"
                   >
                      {[...Array(72)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`absolute inset-0 flex items-start justify-center`}
                          style={{ transform: `rotate(${i * 5}deg)` }}
                        >
                          <div className={`w-[2px] ${i % 18 === 0 ? 'h-4 bg-mafia-gold drop-shadow-[0_0_5px_rgba(197,160,89,1)]' : i % 9 === 0 ? 'h-3 bg-mafia-gold/60' : 'h-1.5 bg-mafia-gold/30'} mt-1`} />
                        </div>
                      ))}

                      <div className="absolute inset-0 flex items-start justify-center">
                        <span className="text-2xl font-black text-mafia-gold -translate-y-8 drop-shadow-[0_0_10px_rgba(197,160,89,1)]">N</span>
                      </div>
                      <div className="absolute inset-0 flex items-end justify-center">
                        <span className="text-xl font-black text-mafia-gold/60 translate-y-8">S</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-end">
                        <span className="text-xl font-black text-mafia-gold/60 translate-x-8">E</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-start">
                        <span className="text-xl font-black text-mafia-gold/60 -translate-x-8">W</span>
                      </div>

                      {/* Target Dot - Fixed on the Dial at the Target Bearing */}
                      <div 
                        className="absolute inset-[-30px] pointer-events-none"
                        style={{ transform: `rotate(${targetBearing}deg)` }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <div className="w-5 h-5 bg-mafia-red rounded-full shadow-[0_0_30px_rgba(255,0,0,1)] animate-pulse flex items-center justify-center">
                               <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="w-[2px] h-12 bg-gradient-to-b from-mafia-red to-transparent mt-1" />
                         </div>
                      </div>
                   </motion.div>

                   {/* Center Reticle */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-2 h-2 bg-mafia-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,1)] z-30"></div>
                       <div className="w-12 h-12 border border-mafia-gold/40 rounded-full absolute"></div>
                   </div>

                   {/* Rotating Needle */}
                   <motion.div 
                       animate={isArrived ? { 
                         rotate: [rotation, rotation + 360, rotation + 1080, rotation + 2160],
                         scale: [1, 1.1, 0.9, 1.1, 1]
                       } : { rotate: rotation }}
                       transition={isArrived ? { 
                         rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                         scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                       } : { type: "spring", stiffness: 35, damping: 18 }}
                       className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
                   >
                       <svg width="240" height="240" viewBox="0 0 100 100" className="drop-shadow-[0_0_25px_rgba(255,0,0,0.6)]">
                          <defs>
                            <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#ff0000" />
                              <stop offset="100%" stopColor="#880000" />
                            </linearGradient>
                          </defs>
                          {/* Top Needle */}
                          <path d="M50 15 L58 50 L42 50 Z" fill="url(#needleRed)" className="drop-shadow-[0_0_15px_rgba(255,0,0,1)] opacity-90" />
                       </svg>
                   </motion.div>
                </div>

                {/* Tactical Data Panel */}
                <div className="w-full max-w-sm flex flex-col gap-4">
                   {/* Calibration Tooltip */}
                   {userHeading !== null && (
                     <motion.button
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       onClick={handleCalibrate}
                       className="w-full py-2 bg-mafia-black/40 text-mafia-gold/60 border border-mafia-gold/30 text-[9px] font-mono tracking-widest uppercase hover:bg-mafia-gold hover:text-black transition-all"
                     >
                       [ KLIKNI ZDE PRO KALIBRACI SEVERU ]
                     </motion.button>
                   )}

                   <div className="bg-mafia-black/80 border border-mafia-gold/30 p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(197,160,89,0.1)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/50 to-transparent"></div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-6 relative z-10">
                         <div className="flex flex-col gap-1 border-l-2 border-mafia-red pl-4 bg-gradient-to-r from-mafia-red/10 to-transparent py-1">
                            <span className="text-[10px] font-mono text-mafia-red uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">Vzdálenost</span>
                            <span className="text-3xl font-black text-white tracking-widest uppercase whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              {distanceRaw || (locationTimeout ? '---' : 'SCAN...')}
                            </span>
                         </div>
                         <div className="flex flex-col gap-1 border-l-2 border-mafia-gold pl-4 bg-gradient-to-r from-mafia-gold/10 to-transparent py-1">
                            <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(197,160,89,0.8)]">Kurz</span>
                            <span className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              {Math.round(targetBearing)}°
                            </span>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-mafia-gold/20 space-y-3 relative z-10">
                         <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-mafia-gold/50 uppercase tracking-widest flex items-center gap-2">
                               <Radar size={12} className="text-mafia-gold" /> Geografický Cíl
                            </span>
                            <span className="text-mafia-gold tracking-widest">49.0592 N, 17.4835 E</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-mafia-gold/50 uppercase tracking-widest flex items-center gap-2">
                               <Navigation2 size={12} className="text-mafia-gold" /> HQ Lokalita
                            </span>
                            <span className="text-mafia-gold tracking-widest">UHERSKÉ HRADIŠTĚ</span>
                         </div>
                      </div>
                   </div>

                   {isArrived && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-mafia-red/20 border border-mafia-red text-mafia-red p-4 text-center text-xs font-black tracking-widest animate-pulse"
                      >
                         CÍL DOSAŽEN. VÍTEJTE V MM BARBER.
                      </motion.div>
                   )}

                   <button 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`, '_blank')}
                      className="w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.4em] uppercase text-base active:scale-95 transition-all shadow-[0_0_40px_rgba(197,160,89,0.5)] hover:shadow-[0_0_60px_rgba(197,160,89,0.8)] hover:bg-white mb-2"
                   >
                      {lang === 'cs' ? 'SPUSTIT MAPY' : 'OPEN MAPS'}
                   </button>

                   <button 
                      onClick={closeHUD}
                      className="w-full py-3 bg-transparent text-mafia-red/60 font-heading font-black tracking-[0.2em] uppercase text-[10px] border border-mafia-red/20 hover:text-mafia-red hover:border-mafia-red hover:bg-mafia-red/10 transition-all shadow-[0_0_10px_rgba(255,0,0,0.1)]"
                   >
                      {lang === 'cs' ? 'ZAVŘÍT SYSTÉM' : 'CLOSE SYSTEM'}
                   </button>
                </div>
            </motion.div>
          </div>

          <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:100%_4px] animate-scanline"></div>
        </motion.div>
      )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes radar-sweep {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes crt-flicker {
          0% { opacity: 0.95; }
          5% { opacity: 0.85; }
          10% { opacity: 0.95; }
          15% { opacity: 1; }
          50% { opacity: 0.98; }
          55% { opacity: 0.9; }
          60% { opacity: 1; }
          100% { opacity: 0.95; }
        }
        .animate-scanline {
          animation: scanline 10s linear infinite;
        }
        .animate-radar-sweep {
          animation: radar-sweep 4s linear infinite;
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
      `}</style>
    </>
  );
}
