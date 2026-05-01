"use client";

import { useEffect, useState, useCallback } from "react";
import { Navigation2, X, MapPin } from "lucide-react";
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
  const [calibrationOffset, setCalibrationOffset] = useState(0);
  const [distanceValue, setDistanceValue] = useState<number>(9999);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEnabled && distanceValue === 9999) {
      timer = setTimeout(() => {
        setLocationTimeout(true);
      }, 8000);
    } else if (distanceValue !== 9999) {
      setLocationTimeout(false);
    }
    return () => clearTimeout(timer);
  }, [isEnabled, distanceValue]);

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

  const handleToggle = useCallback(() => {
    const next = !isEnabled;
    setIsEnabled(next);
    if (next) requestPermission();
    localStorage.setItem("mmbarber_compass_enabled", next.toString());
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: next }));
    }, 0);
  }, [isEnabled, requestPermission]);

  useEffect(() => {
    const stored = localStorage.getItem("mmbarber_compass_enabled") === "true";
    setIsEnabled(stored);
    
    window.addEventListener('mmbarber-toggle-compass', handleToggle);

    const checkMobile = () => setIsVisible(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if ("geolocation" in navigator && isEnabled && isVisible) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat1 = pos.coords.latitude;
          const lon1 = pos.coords.longitude;
          
          // Basic validation to avoid 0,0 or invalid jumps
          if (!lat1 || !lon1 || (lat1 === 0 && lon1 === 0)) return;

          const lat1Rad = lat1 * Math.PI / 180;
          const lat2Rad = TARGET_LAT * Math.PI / 180;
          const dLonRad = (TARGET_LON - lon1) * Math.PI / 180;

          // Bearing calculation
          const y = Math.sin(dLonRad) * Math.cos(lat2Rad);
          const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad);
          
          const brng = Math.atan2(y, x) * 180 / Math.PI;
          setTargetBearing((brng + 360) % 360);

          // Distance calculation (Haversine)
          const R = 6371e3; // Earth radius in meters
          const φ1 = lat1Rad;
          const φ2 = lat2Rad;
          const Δφ = (TARGET_LAT - lat1) * Math.PI / 180;
          const Δλ = dLonRad;

          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          
          setDistanceValue(d);

          let dDisplay = "";
          // Reverted to 60m as requested/previously working
          if (d < 60) {
            dDisplay = lang === 'cs' ? 'V CÍLI' : 'ARRIVED';
          } else {
            dDisplay = d > 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`;
          }
          setDistanceRaw(dDisplay);
          setLocationTimeout(false);
        },
        (err) => {
          console.error("Geo error:", err);
          if (err.code === 1) setDistanceRaw(lang === 'cs' ? 'POVOLTE GPS' : 'ALLOW GPS');
          else setDistanceRaw("GPS ERROR");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }

    return () => {
      window.removeEventListener('mmbarber-toggle-compass', handleToggle);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isEnabled, isVisible, handleToggle, lang]);

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
      win.removeEventListener("deviceorientationabsolute", handleOrientation);
      win.removeEventListener("deviceorientation", handleOrientation);
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

  const isArrived = distanceValue < 60;

  return (
    <>
      <AnimatePresence>
        {isVisible && isEnabled && (
        <motion.div
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col xl:hidden overflow-y-auto touch-pan-y"
        >
          <div className="relative z-10 min-h-full flex flex-col items-center p-6 pt-20 pb-10">
            <button 
              onClick={() => {
                setIsEnabled(false);
                localStorage.setItem("mmbarber_compass_enabled", "false");
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: false }));
                }, 0);
              }}
              className="fixed top-6 right-6 flex items-center gap-2 text-mafia-gold z-50 p-2 pl-4 bg-mafia-black/80 rounded-full border border-mafia-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.1)] active:scale-95 transition-all"
            >
              <span className="text-[10px] font-heading font-black tracking-[0.2em] uppercase">{lang === 'cs' ? 'ZAVŘÍT' : 'CLOSE'}</span>
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-2 mb-12">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-mafia-red animate-pulse"></div>
                  <h2 className="text-mafia-gold font-heading font-black text-sm uppercase tracking-[0.4em] text-center">
                     {t.cityGuide?.compass?.label || 'NAVIGACE DO BARBERSHOPU'}
                  </h2>
               </div>
               <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent"></div>
            </div>

            <div className="relative w-[80vw] h-[80vw] max-w-[320px] max-h-[320px] flex items-center justify-center mb-12" onClick={() => {
               if (!isPermissionRequested) requestPermission();
            }}>
               <div className="absolute inset-[-20px] border border-mafia-gold/10 rounded-full shadow-[0_0_50px_rgba(197,160,89,0.1)]"></div>
               
               <motion.div 
                 animate={{ rotate: userHeading !== null ? -(userHeading - calibrationOffset) : 0 }}
                 transition={{ type: "spring", stiffness: 40, damping: 15 }}
                 className="absolute inset-0 border-2 border-mafia-gold/20 rounded-full bg-black/40 backdrop-blur-sm overflow-hidden"
               >
                  {/* Compass Marks (No letters) */}
                  {[...Array(36)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`absolute inset-0 flex items-start justify-center`}
                      style={{ transform: `rotate(${i * 10}deg)` }}
                    >
                      <div className={`w-[2px] ${i % 9 === 0 ? 'h-6 bg-mafia-gold' : 'h-3 bg-mafia-gold/30'} mt-1`} />
                    </div>
                  ))}

                  {!isArrived && (
                    <div 
                      className="absolute inset-[-30px] pointer-events-none"
                      style={{ transform: `rotate(${targetBearing}deg)` }}
                    >
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-1 h-12 bg-gradient-to-t from-mafia-red to-transparent mb-1" />
                          <div className="w-6 h-6 bg-mafia-red rounded-full shadow-[0_0_30px_rgba(255,0,0,1)] animate-pulse" />
                       </div>
                    </div>
                  )}
               </motion.div>

               {userHeading === null && !isArrived && (
                 <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 text-[8px] font-mono text-mafia-gold animate-pulse whitespace-nowrap">
                   {lang === 'cs' ? '[ POUŽIJTE MOBIL PRO KOMPAS ]' : '[ USE MOBILE FOR COMPASS ]'}
                 </div>
               )}

               {!isArrived ? (
                 <motion.div 
                     animate={{ rotate: rotation }}
                     transition={{ type: "spring", stiffness: 35, damping: 18 }}
                     className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
                 >
                     <svg width="280" height="280" viewBox="0 0 100 100" className="drop-shadow-[0_0_30px_rgba(255,0,0,0.6)]">
                        <defs>
                          <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ff0000" />
                            <stop offset="100%" stopColor="#880000" />
                          </linearGradient>
                          <linearGradient id="needleGold" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#C5A059" />
                            <stop offset="100%" stopColor="#443311" />
                          </linearGradient>
                        </defs>
                        <path d="M50 90 L68 50 L32 50 Z" fill="url(#needleRed)" />
                        <path d="M50 10 L68 50 L32 50 Z" fill="url(#needleGold)" className="opacity-70" />
                        <circle cx="50" cy="50" r="5" fill="white" className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
                     </svg>
                 </motion.div>
               ) : (
                 <motion.div 
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="relative z-30 flex flex-col items-center gap-4"
                 >
                   <div className="w-24 h-24 rounded-full border-4 border-mafia-gold flex items-center justify-center bg-mafia-gold/20 shadow-[0_0_50px_rgba(197,160,89,0.6)] animate-bounce">
                     <MapPin size={48} className="text-mafia-gold" />
                   </div>
                   <div className="text-center">
                     <span className="text-mafia-gold font-heading font-black text-2xl tracking-[0.3em] block uppercase">{lang === 'cs' ? 'DORAZILI JSTE' : 'YOU ARRIVED'}</span>
                     <span className="text-white/60 text-xs font-mono tracking-widest mt-1 block uppercase">MMBARBER HQ</span>
                   </div>
                 </motion.div>
               )}

               {!isArrived && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 border border-mafia-gold/5 rounded-full animate-ping-slow" />
                 </div>
               )}
            </div>

            <div className="w-full max-w-sm flex flex-col gap-4">
               <div className="bg-mafia-black/90 border-2 border-mafia-gold/20 p-8 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="flex flex-col gap-1 border-l-2 border-mafia-red pl-4">
                        <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest">Status</span>
                        <span className="text-2xl font-black text-white tracking-widest uppercase whitespace-nowrap">
                          {distanceRaw || (locationTimeout ? '---' : 'SCANNING...')}
                        </span>
                     </div>
                     <div className="flex flex-col gap-1 border-l-2 border-mafia-gold/40 pl-4">
                        <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest">Azimut</span>
                        <span className="text-2xl font-black text-white tracking-widest uppercase">
                          {Math.round(targetBearing)}°
                        </span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-mafia-gold/10 space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-mafia-gold/30 uppercase tracking-widest">Lokalita</span>
                        <span className="text-white/80 tracking-widest">UHERSKÉ HRADIŠTĚ</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-mafia-gold/30 uppercase tracking-widest">HQ Koordináty</span>
                        <span className="text-white/80 tracking-widest">49.0592 N, 17.4835 E</span>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`, '_blank')}
                  className="w-full py-6 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.4em] uppercase text-lg border-2 border-mafia-gold active:scale-95 transition-all shadow-[0_20px_60px_rgba(197,160,89,0.4)] mb-4"
               >
                  {lang === 'cs' ? 'SPUSTIT MAPU' : 'OPEN MAP'}
               </button>

               {userHeading !== null && (
                 <button
                   onClick={() => setCalibrationOffset(userHeading)}
                   className="w-full py-2 text-mafia-gold/40 text-[9px] font-mono tracking-[0.3em] uppercase hover:text-mafia-gold transition-all"
                 >
                   [ {lang === 'cs' ? 'KALIBROVAT SEVER' : 'CALIBRATE NORTH'} ]
                 </button>
               )}
            </div>
          </div>

          <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:100%_4px] animate-scanline"></div>
        </motion.div>
      )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 15s linear infinite;
        }
        .animate-ping-slow {
          animation: ping 6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}
