"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation2, X, MapPin, Target, Radio, User, ChevronRight, FileText, Calendar, Shield, Award, CheckCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";
import { barbers } from "@/data/barbers";

const TARGET_LAT = 49.0592272;
const TARGET_LON = 17.4835088;
const SEARCH_QUERY = "MMBARBER Mařatice";

export function MobileCompass() {
  const { t, lang } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [isPermissionRequested, setIsPermissionRequested] = useState(false);

  // HUD Navigation States
  const [hudMode, setHudMode] = useState<'radar' | 'barbers'>('radar');
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsVisible(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleToggle = () => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      localStorage.setItem("mmbarber_compass_enabled", String(newState));
      window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: newState }));
      
      if (newState) {
        playSound("/sounds/scanner-on.mp3", 0.4);
        if (!isPermissionRequested) requestPermission();
      } else {
        playSound("/sounds/scanner-off.mp3", 0.3);
      }
    };

    window.addEventListener('mmbarber-toggle-compass', handleToggle);

    // Initial load from storage
    const stored = localStorage.getItem("mmbarber_compass_enabled") === "true";
    if (stored) setIsEnabled(true);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener('mmbarber-toggle-compass', handleToggle);
    };
  }, [isEnabled]);

  const requestPermission = async () => {
    setIsPermissionRequested(true);
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          startTracking();
        }
      } catch (e) {
        console.error("Permission denied", e);
      }
    } else {
      startTracking();
    }
  };

  useEffect(() => {
    if (!isEnabled || !isPermissionRequested) return;

    const handleOrientation = (e: any) => {
      let heading = null;
      if (e.webkitCompassHeading !== undefined) {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = e.absolute ? (360 - e.alpha) : (360 - e.alpha);
      }
      
      if (heading !== null) {
        setUserHeading(heading % 360);
      }
    };

    if (typeof window !== 'undefined') {
      if ('ondeviceorientationabsolute' in window) {
        (window as any).addEventListener("deviceorientationabsolute", handleOrientation, true);
      } else {
        (window as any).addEventListener("deviceorientation", handleOrientation, true);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        (window as any).removeEventListener("deviceorientationabsolute", handleOrientation);
        (window as any).removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [isEnabled, isPermissionRequested]);

  const startTracking = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateDistance(latitude, longitude, TARGET_LAT, TARGET_LON);
        const bearing = calculateBearing(latitude, longitude, TARGET_LAT, TARGET_LON);
        setDistance(dist);
        setTargetBearing(bearing);
      }, (err) => console.error(err), { enableHighAccuracy: true });
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const λ1 = lon1 * Math.PI / 180;
    const λ2 = lon2 * Math.PI / 180;
    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
  };

  const rotation = userHeading !== null ? (targetBearing - userHeading) : 0;
  const distanceValue = distance !== null ? Math.round(distance) : null;
  const isArrived = distanceValue !== null && distanceValue < 30;

  if (!isVisible || !isEnabled) return null;

  const currentBarber = barbers.find(b => b.id === selectedBarberId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col xl:hidden overflow-y-auto"
      >
        {/* TOP HUD BAR */}
        <div className="p-6 border-b border-mafia-gold/20 bg-mafia-gold/[0.02] flex items-center justify-between">
           <div className="flex flex-col">
              <div className="flex items-center gap-2">
                 <Radio size={14} className="text-mafia-red animate-pulse" />
                 <span className="text-mafia-gold font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                   {lang === 'cs' ? 'ŽIVÉ SLEDOVÁNÍ' : 'LIVE TRACKING'}
                 </span>
              </div>
              <h2 className="text-white font-heading font-black text-xl uppercase tracking-widest mt-1">
                {lang === 'cs' ? 'CENTRÁLA MAŘATICE' : 'MAŘATICE HQ'}
              </h2>
           </div>
           <button 
             onClick={() => {
               setIsEnabled(false);
               localStorage.setItem("mmbarber_compass_enabled", "false");
               window.dispatchEvent(new CustomEvent('mmbarber-compass-state', { detail: false }));
               playSound("/sounds/ui-back.mp3", 0.3);
             }}
             className="w-12 h-12 rounded-full border border-mafia-red/40 flex items-center justify-center text-mafia-red bg-mafia-red/5 active:scale-90 transition-transform"
           >
             <X size={28} />
           </button>
        </div>

        {/* HUD NAVIGATION TABS */}
        <div className="flex border-b border-mafia-gold/10 bg-mafia-black/40">
          <button 
            onClick={() => {
              setHudMode('radar');
              playSound("/sounds/ui-click.mp3", 0.4);
            }}
            className={`flex-1 py-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] border-r border-mafia-gold/10 transition-colors ${hudMode === 'radar' ? 'text-mafia-gold bg-mafia-gold/5 border-b-2 border-b-mafia-gold' : 'text-mafia-gold/40 hover:text-mafia-gold/80'}`}
          >
            {lang === 'cs' ? 'RADAR / TRASA' : 'RADAR / GPS'}
          </button>
          <button 
            onClick={() => {
              setHudMode('barbers');
              playSound("/sounds/ui-click.mp3", 0.4);
            }}
            className={`flex-1 py-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${hudMode === 'barbers' ? 'text-mafia-gold bg-mafia-gold/5 border-b-2 border-b-mafia-gold' : 'text-mafia-gold/40 hover:text-mafia-gold/80'}`}
          >
            {lang === 'cs' ? 'ŽIVOTOPISY' : 'DOSSIERS'}
          </button>
        </div>

        {hudMode === 'radar' ? (
          <>
            {/* HUD STATS - Focused on Distance */}
            <div className="flex-none border-b border-mafia-gold/10">
               <div className="p-8 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.5em] mb-3">
                    {lang === 'cs' ? 'VZDÁLENOST K CÍLI' : 'DISTANCE TO MISSION'}
                  </span>
                  <div className="flex items-baseline gap-3">
                     <span className="text-mafia-gold font-heading font-black text-7xl drop-shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]">
                       {distanceValue !== null ? distanceValue : '---'}
                     </span>
                     <span className="text-mafia-gold/60 font-mono text-2xl uppercase font-black">m</span>
                  </div>
                  <div className="w-48 h-1 bg-mafia-gold/10 mt-6 relative overflow-hidden">
                     <motion.div 
                       animate={{ x: ['-100%', '100%'] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 bg-mafia-gold"
                     />
                  </div>
               </div>
            </div>

            {/* MAIN COMPASS AREA (FULL SCREEN) */}
            <div className="flex-grow min-h-[350px] relative flex items-center justify-center">
               {/* Radar Background Grids */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="w-[120vw] h-[120vw] border border-mafia-gold/5 rounded-full absolute"></div>
                  <div className="w-[100vw] h-[100vw] border border-mafia-gold/10 rounded-full absolute"></div>
                  <div className="w-[80vw] h-[80vw] border border-mafia-gold/20 rounded-full absolute"></div>
                  
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[150vw] h-[150vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(var(--color-mafia-gold-rgb),0.05)_90deg,transparent_100deg)] rounded-full"
                  />
                  
                  {/* Scanline HUD Overlay */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] opacity-50"></div>
               </div>

              {/* HUGE COMPASS DISK */}
              <div 
                className="relative w-[85vw] h-[85vw] max-w-[450px] max-h-[450px] cursor-pointer"
                onClick={() => !isPermissionRequested && requestPermission()}
              >
                 {/* Outer Scale */}
                 <motion.div 
                   animate={{ rotate: userHeading !== null ? -userHeading : 0 }}
                   className="absolute inset-0 transition-transform duration-500"
                 >
                    <div className="absolute inset-0 border-4 border-mafia-gold/20 rounded-full shadow-[0_0_50px_rgba(var(--color-mafia-gold-rgb),0.1)]"></div>
                    
                    {/* Degrees and Markers */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                       <div key={deg} className="absolute inset-0 flex flex-col items-center justify-start p-2" style={{ transform: `rotate(${deg}deg)` }}>
                          <div className={`w-0.5 h-4 bg-mafia-gold ${deg % 90 === 0 ? 'opacity-100' : 'opacity-40'}`}></div>
                          {deg === 0 && <span className="text-mafia-gold font-black text-xl mt-2">N</span>}
                          {deg === 90 && <span className="text-mafia-gold/40 font-black text-xs mt-2">{lang === 'cs' ? 'V' : 'E'}</span>}
                          {deg === 180 && <span className="text-mafia-gold/40 font-black text-xs mt-2">{lang === 'cs' ? 'J' : 'S'}</span>}
                          {deg === 270 && <span className="text-mafia-gold/40 font-black text-xs mt-2">{lang === 'cs' ? 'Z' : 'W'}</span>}
                       </div>
                    ))}
                 </motion.div>

                 {/* HUGE NEEDLE */}
                 <motion.div 
                   animate={{ rotate: rotation }}
                   transition={{ type: "spring", stiffness: 40, damping: 15 }}
                   className="absolute inset-0 flex items-center justify-center"
                 >
                    <div className="relative w-full h-full flex items-center justify-center">
                       <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.6)]">
                          <defs>
                             <linearGradient id="hugeNeedleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--color-mafia-gold)" />
                                <stop offset="50%" stopColor="#443311" />
                                <stop offset="100%" stopColor="#ff0000" />
                             </linearGradient>
                          </defs>
                          <path d="M50 8 L58 50 L50 92 L42 50 Z" fill="url(#hugeNeedleGrad)" />
                          <circle cx="50" cy="50" r="5" fill="white" className="animate-pulse" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-mafia-gold)" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-30" />
                       </svg>
                       
                       <motion.div 
                         animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="absolute top-0 w-8 h-8 bg-mafia-gold rounded-full blur-[10px]"
                       />
                    </div>
                 </motion.div>

                 {/* SYNC PROMPT */}
                 {userHeading === null && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-mafia-black/80 border border-mafia-gold/40 px-6 py-3 backdrop-blur-md">
                         <span className="text-mafia-gold font-mono text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                            {lang === 'cs' ? 'KLEPNĚTE PRO SYNCHRONIZACI' : 'TAP TO SYNC SENSORS'}
                         </span>
                      </div>
                   </div>
                 )}
              </div>
            </div>

            {/* BOTTOM HUD CONTROLS */}
            <div className="p-8 bg-mafia-gold/[0.05] border-t border-mafia-gold/20 flex flex-col items-center gap-6">
               <div className="flex flex-col items-center text-center">
                  <h3 className="text-white font-heading font-black text-xl uppercase tracking-[0.2em] mb-1">
                     {isArrived 
                       ? (lang === 'cs' ? 'CÍL DOSAŽEN' : 'DESTINATION REACHED') 
                       : (lang === 'cs' ? 'TAKTICKÝ PŘÍSTUP' : 'TACTICAL APPROACH')}
                  </h3>
                  <p className="text-mafia-gold/50 font-mono text-[9px] uppercase tracking-[0.5em]">
                     SADOVÁ 1383, UH MAŘATICE
                  </p>
               </div>

               <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`, '_blank');
                      playSound("/sounds/bullet-hit.mp3", 0.6);
                    }}
                    className="flex-1 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                  >
                     <MapPin size={18} /> {lang === 'cs' ? 'OTEVŘÍT MAPY' : 'OPEN MAPS'}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (!isPermissionRequested) requestPermission();
                      playSound("/sounds/ui-click.mp3", 0.4);
                    }}
                    className="px-6 py-5 border border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold/10 transition-colors flex items-center justify-center"
                  >
                     <Target size={20} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          /* DOSSIERS / BIOGRAPHIES VIEW */
          <div className="flex-grow p-6 flex flex-col bg-mafia-dark/30">
            <AnimatePresence mode="wait">
              {selectedBarberId === null ? (
                /* BARBER SELECTION LIST */
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-6"
                >
                  <div className="text-center my-4">
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.4em]">
                      {lang === 'cs' ? 'AKTIVNÍ OPERATIVCI V KŘESLE' : 'ACTIVE CHAIR AGENTS'}
                    </span>
                    <h3 className="text-white font-heading font-black text-2xl uppercase tracking-widest mt-1">
                      {lang === 'cs' ? 'NÁŠ TÝM' : 'THE TEAM'}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {barbers.map((barber) => {
                      const isTomas = barber.id === 'tomas';
                      const bKey = isTomas ? 'tomas' : 'nella';
                      const trans = t.operatives?.barbers?.[bKey];
                      return (
                        <div
                          key={barber.id}
                          onClick={() => {
                            setSelectedBarberId(barber.id);
                            playSound("/sounds/card.mp3", 0.8);
                          }}
                          className="group border border-mafia-gold/20 bg-mafia-black/85 p-5 flex items-center justify-between active:border-mafia-gold/80 transition-all rounded-sm relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-mafia-gold/[0.02] to-transparent pointer-events-none"></div>
                          
                          <div className="flex items-center gap-5 relative z-10">
                            {/* Avatar with CRT scanline and active indicator */}
                            <div className="relative w-16 h-16 rounded-full border border-mafia-gold/40 overflow-hidden bg-black flex-shrink-0">
                              <img 
                                src={barber.image} 
                                alt={barber.name} 
                                className="w-full h-full object-cover filter grayscale group-active:grayscale-0 transition-all"
                              />
                              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] pointer-events-none"></div>
                            </div>
                            
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <h4 className="text-white font-heading font-black text-lg uppercase tracking-wider">
                                  {trans?.name || barber.name}
                                </h4>
                              </div>
                              <span className="text-mafia-gold font-mono text-[9px] uppercase tracking-widest mt-1">
                                {trans?.role || barber.role}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="text-mafia-gold opacity-40 group-active:opacity-100 transition-opacity" size={24} />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                /* SELECTED BARBER DOSSIER / BIOGRAPHY DETAIL */
                <motion.div
                  key="dossier"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-6"
                >
                  {/* Back button to list */}
                  <button 
                    onClick={() => {
                      setSelectedBarberId(null);
                      playSound("/sounds/ui-back.mp3", 0.4);
                    }}
                    className="self-start flex items-center gap-2 text-mafia-gold/60 active:text-mafia-gold font-mono text-[9px] uppercase tracking-widest border border-mafia-gold/20 px-4 py-2 bg-mafia-black/40"
                  >
                    <ArrowLeft size={12} /> {lang === 'cs' ? 'ZPĚT NA SEZNAM' : 'BACK TO LIST'}
                  </button>

                  {currentBarber && (() => {
                    const isTomas = currentBarber.id === 'tomas';
                    const bKey = isTomas ? 'tomas' : 'nella';
                    const trans = t.operatives?.barbers?.[bKey];
                    const stories = trans?.story || currentBarber.desc;
                    const special = trans?.specializations || currentBarber.specializations || [];

                    return (
                      <div className="border border-mafia-gold/20 bg-mafia-black/90 p-6 flex flex-col gap-6 relative overflow-hidden rounded-sm">
                        {/* CRT glitches HUD overlays */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[9px] text-mafia-gold/40">
                          <FileText size={10} />
                          <span>DOSSIER // CODE_{currentBarber.symbol || 'X'}</span>
                        </div>

                        {/* Top Profile Header */}
                        <div className="flex gap-5 items-center pb-5 border-b border-mafia-gold/10">
                          <div className="relative w-24 h-24 rounded-sm border-2 border-mafia-gold/30 overflow-hidden bg-black/60 flex-shrink-0">
                            <img 
                              src={currentBarber.image} 
                              alt={currentBarber.name} 
                              className="w-full h-full object-cover filter grayscale contrast-110"
                            />
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)] pointer-events-none"></div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <h3 className="text-white font-heading font-black text-2xl uppercase tracking-wider">
                                {trans?.name || currentBarber.name}
                              </h3>
                            </div>
                            <span className="text-mafia-gold font-mono text-[10px] uppercase tracking-widest mt-1">
                              {trans?.role || currentBarber.role}
                            </span>
                            {currentBarber.rank && (
                              <div className="flex items-center gap-2 mt-2 bg-mafia-gold/10 border border-mafia-gold/20 px-2.5 py-1 self-start">
                                <Award size={10} className="text-mafia-gold" />
                                <span className="text-mafia-gold font-mono text-[8px] uppercase tracking-widest font-black">
                                  LEVEL {currentBarber.rank.level} : {currentBarber.rank.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio / Story Section */}
                        <div className="flex flex-col gap-2">
                          <span className="text-mafia-gold/40 font-mono text-[9px] uppercase tracking-[0.2em] font-black">
                            {lang === 'cs' ? 'NARRATIVE / ŽIVOTOPIS' : 'NARRATIVE / DOSSIER'}
                          </span>
                          <p className="text-white/80 font-heading text-sm leading-relaxed text-justify bg-white/[0.01] p-4 border border-white/5 font-medium rounded-sm">
                            {stories}
                          </p>
                        </div>

                        {/* Motto if available */}
                        {trans?.motto && (
                          <div className="border-l-2 border-mafia-gold/60 pl-4 py-1 italic text-mafia-gold/90 font-heading text-sm">
                            “{trans.motto}”
                          </div>
                        )}

                        {/* Specializations / Skills */}
                        <div className="flex flex-col gap-3">
                          <span className="text-mafia-gold/40 font-mono text-[9px] uppercase tracking-[0.2em] font-black">
                            {lang === 'cs' ? 'SPECIALIZACE & SCHOPNOSTI' : 'SPECIALIZATIONS & SKILLS'}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {special.map((spec: string, i: number) => (
                              <span 
                                key={i} 
                                className="px-3 py-1.5 border border-mafia-gold/30 bg-mafia-gold/[0.03] text-mafia-gold font-mono text-[9px] uppercase tracking-wider rounded-sm flex items-center gap-1.5"
                              >
                                <CheckCircle size={10} className="text-mafia-gold/60" />
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                          <div className="flex items-center gap-2 text-mafia-gold/50 font-mono text-[9px] uppercase tracking-[0.2em] font-black">
                            <Calendar size={12} />
                            <span>{lang === 'cs' ? 'DOSTUPNOST / SMĚNY' : 'AVAILABILITY / HOURS'}</span>
                          </div>
                          <span className="text-white/90 font-heading text-sm font-semibold mt-1">
                            {trans?.schedule || currentBarber.schedule}
                          </span>
                        </div>

                        {/* Booking Link Action */}
                        <button 
                          onClick={() => {
                            window.open(currentBarber.bookingLink, "_blank");
                            playSound("/sounds/ui-click.mp3", 0.6);
                          }}
                          className="w-full mt-4 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.3)]"
                        >
                          <Target size={16} />
                          {lang === 'cs' ? 'REZERVACE STŘIHU' : 'BOOK SESSION'}
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
