"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { barbers } from "@/data/barbers";
import { playSound } from "@/utils/audio";
import { MilitaryInsignia } from "@/components/Profiles";
import { 
  Navigation2, X, Compass, MapPin, Users, Target, Shield, Sparkles, 
  ChevronRight, RefreshCw, Volume2, VolumeX, ArrowLeft, Trophy, Edit3, Check, DollarSign
} from "lucide-react";
import Link from "next/link";
import { 
  subscribeToGlobalXpStats, 
  calculateLevelFromXp, 
  getCzechRankFromLevel, 
  GlobalBarberStats 
} from "@/utils/barberXp";

const TARGET_LAT = 49.0592272;
const TARGET_LON = 17.4835088;
const SEARCH_QUERY = "MMBARBER Mařatice";

// Route Waypoints for the GTA V radar map simulation
const ROUTE_WAYPOINTS = [
  { x: 30, y: 80, label: "Start: UH Centrum", tokenCollected: false, id: 0 },
  { x: 45, y: 65, label: "Křižovatka Mařatice", tokenCollected: false, id: 1 },
  { x: 60, y: 50, label: "Třída 1. Máje", tokenCollected: false, id: 2 },
  { x: 75, y: 40, label: "Východní Svah", tokenCollected: false, id: 3 },
  { x: 88, y: 25, label: "MMBARBER HQ", tokenCollected: false, id: 4 }
];

export default function BarberGtaHudPage() {
  const [activeTab, setActiveTab] = useState<"radar" | "operativci">("operativci");
  const [selectedBarberId, setSelectedBarberId] = useState<string>("tomas");
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Real-time server stats state
  const [globalStats, setGlobalStats] = useState<GlobalBarberStats>({});
  
  // Custom Names State (synchronized with localStorage)
  const [customTomasName, setCustomTomasName] = useState("Tomáš");
  const [customNellaName, setCustomNellaName] = useState("Nella");
  const [isEditingTomasName, setIsEditingTomasName] = useState(false);
  const [isEditingNellaName, setIsEditingNellaName] = useState(false);
  const [tomasInputName, setTomasInputName] = useState("");
  const [nellaInputName, setNellaInputName] = useState("");

  // GTA V Satellite Zoom Sequence State
  const [zoomStage, setZoomStage] = useState<1 | 2 | 3>(1);
  const [zoomStageAltitude, setZoomStageAltitude] = useState(15000);
  const [isZooming, setIsZooming] = useState(true);

  // Radar Game Loop State
  const [playerPos, setPlayerPos] = useState({ x: 30, y: 80 });
  const [respectScore, setRespectScore] = useState(0);
  const [collectedTokens, setCollectedTokens] = useState<number[]>([]);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  
  // Real Compass States (dynamic sensory navigation)
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [calibrationOffset, setCalibrationOffset] = useState(0);
  const [targetBearing, setTargetBearing] = useState<number>(38);
  const [distanceRaw, setDistanceRaw] = useState<string>("520 m");
  const [gpsSupported, setGpsSupported] = useState(false);

  // Sync custom names from local storage
  const syncCustomNames = useCallback(() => {
    const savedTomas = localStorage.getItem("mmbarber_custom_name_tomas");
    const savedNella = localStorage.getItem("mmbarber_custom_name_nella");
    if (savedTomas) setCustomTomasName(savedTomas);
    if (savedNella) setCustomNellaName(savedNella);
  }, []);

  useEffect(() => {
    syncCustomNames();
    window.addEventListener("storage", syncCustomNames);
    window.addEventListener("mmbarber_names_updated", syncCustomNames);

    // Check GPS support
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      setGpsSupported(true);
    }

    // Subscribe to global ratings in real-time
    const unsubscribeXp = subscribeToGlobalXpStats((stats) => {
      setGlobalStats(stats);
    });

    // Start GTA V satellite zoom sequence on mount
    triggerSatelliteZoomSequence();

    return () => {
      window.removeEventListener("storage", syncCustomNames);
      window.removeEventListener("mmbarber_names_updated", syncCustomNames);
      unsubscribeXp();
    };
  }, [syncCustomNames]);

  // GTA V cinematic satellite camera zoom sequence
  const triggerSatelliteZoomSequence = () => {
    setIsZooming(true);
    setZoomStage(1);
    setZoomStageAltitude(15000);
    
    if (soundEnabled) {
      playSound("/sounds/reload.mp3", 0.6);
    }

    // Segment 1 -> Segment 2 (after 1s)
    setTimeout(() => {
      setZoomStage(2);
      setZoomStageAltitude(2800);
      if (soundEnabled) {
        playSound("/sounds/reload.mp3", 0.8);
      }
      
      // Segment 2 -> Segment 3 (after another 1s)
      setTimeout(() => {
        setZoomStage(3);
        setZoomStageAltitude(150);
        if (soundEnabled) {
          playSound("/sounds/success.mp3", 0.7);
        }
        setIsZooming(false);
      }, 1000);
    }, 1000);
  };

  // Real device orientation compass feed
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      if (e.webkitCompassHeading !== undefined) {
        setUserHeading(e.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setUserHeading((360 - e.alpha) % 360);
      }
    };

    if (typeof window !== "undefined") {
      const win = window as any;
      if ("ondeviceorientationabsolute" in win) {
        win.addEventListener("deviceorientationabsolute", handleOrientation, true);
      } else if ("DeviceOrientationEvent" in win) {
        win.addEventListener("deviceorientation", handleOrientation, true);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        const win = window as any;
        win.removeEventListener("deviceorientationabsolute", handleOrientation);
        win.removeEventListener("DeviceOrientationEvent", handleOrientation);
      }
    };
  }, []);

  // Sync actual GPS position if permission granted & available
  useEffect(() => {
    if (!gpsSupported || isZooming) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        if (!lat || !lon) return;

        // Dynamic distance calculation
        const R = 6371e3; // Earth radius in meters
        const lat1Rad = lat * Math.PI / 180;
        const lat2Rad = TARGET_LAT * Math.PI / 180;
        const lon1Rad = lon * Math.PI / 180;
        const lon2Rad = TARGET_LON * Math.PI / 180;

        const dLat = lat2Rad - lat1Rad;
        const dLon = lon2Rad - lon1Rad;

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;

        // Dynamic bearing
        const y = Math.sin(dLon) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                  Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
        const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

        setTargetBearing(brng);
        setDistanceRaw(d < 60 ? "V CÍLI" : d > 1000 ? `${(d / 1000).toFixed(2)} km` : `${Math.round(d)} m`);
      },
      (err) => console.log("GPS feed inactive: using simulator"),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [gpsSupported, isZooming]);

  // Handle Token Collection
  const collectToken = (tokenId: number, x: number, y: number, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (collectedTokens.includes(tokenId)) return;

    setCollectedTokens(prev => [...prev, tokenId]);
    setRespectScore(prev => prev + 250);

    if (soundEnabled) {
      playSound("/sounds/naboje.mp3", 0.6);
    }

    // Trigger Floating Text
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, text: "+250 RESPECT", x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  // Simulate Drive along Route
  const startDriveSimulation = () => {
    if (isSimulatingDrive) return;
    setIsSimulatingDrive(true);
    setPlayerPos({ x: ROUTE_WAYPOINTS[0].x, y: ROUTE_WAYPOINTS[0].y });
    
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < ROUTE_WAYPOINTS.length) {
        const wp = ROUTE_WAYPOINTS[index];
        setPlayerPos({ x: wp.x, y: wp.y });
        
        // Auto collect token if at waypoint
        collectToken(wp.id, wp.x, wp.y);

        if (soundEnabled) {
          playSound("/sounds/card.mp3", 0.4);
        }
      } else {
        clearInterval(interval);
        setIsSimulatingDrive(false);
        if (soundEnabled) {
          playSound("/sounds/success.mp3", 0.8);
        }
        
        // Floating victory banner
        const id = Date.now();
        setFloatingTexts(prev => [...prev, { id, text: "MMBARBER HQ REACHED!", x: 50, y: 30 }]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.id !== id));
        }, 2000);
      }
    }, 1500);
  };

  // Barber Renaming Confirmations
  const handleSaveTomasName = () => {
    const finalName = tomasInputName.trim().toUpperCase();
    if (finalName) {
      setCustomTomasName(finalName);
      localStorage.setItem("mmbarber_custom_name_tomas", finalName);
      window.dispatchEvent(new Event("mmbarber_names_updated"));
      
      if (soundEnabled) {
        playSound("/sounds/success.mp3", 0.5);
      }
    }
    setIsEditingTomasName(false);
  };

  const handleSaveNellaName = () => {
    const finalName = nellaInputName.trim().toUpperCase();
    if (finalName) {
      setCustomNellaName(finalName);
      localStorage.setItem("mmbarber_custom_name_nella", finalName);
      window.dispatchEvent(new Event("mmbarber_names_updated"));

      if (soundEnabled) {
        playSound("/sounds/success.mp3", 0.5);
      }
    }
    setIsEditingNellaName(false);
  };

  // Get active selected barber
  const activeBarber = barbers.find(b => b.id === selectedBarberId) || barbers[0];
  const barberXp = globalStats[activeBarber.id]?.xp ?? 0;
  const barberLevel = calculateLevelFromXp(barberXp);
  const barberRank = getCzechRankFromLevel(barberLevel, activeBarber.id === "nella");

  // Calibrate vector needle rotation
  const getNeedleRotation = () => {
    if (userHeading !== null) {
      return (targetBearing - (userHeading - calibrationOffset) + 360) % 360;
    }
    return targetBearing;
  };

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Immersive CRT Carbon Fiber Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none z-0" />
      
      {/* Tactical scanline grid animations */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(197,160,89,0.015)_1px,transparent_1px)] bg-[size:100%_4px] animate-[pulse_3s_ease-in-out_infinite]" />

      {/* Premium GTA HUD Top Nav Header */}
      <header className="w-full py-4 px-6 border-b border-white/5 flex justify-between items-center z-50 backdrop-blur-md bg-mafia-black/85 sticky top-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="text-white/40 hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2 text-[10px] font-mono tracking-widest"
          >
            <ArrowLeft size={14} />
            <span>ZPĚT NA ZÁKLADNU</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="font-heading font-black text-lg tracking-[0.25em] text-mafia-gold logo-neon">MMBARBER</span>
          <span className="text-[8px] font-mono border border-mafia-gold/20 px-2 py-0.5 rounded text-mafia-gold bg-mafia-gold/5 uppercase tracking-[0.15em] hidden sm:inline">
            GTA V HUD TERMINÁL
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* RESPECT / TOKENS SCORE DISPLAY */}
          <div className="flex items-center gap-2 px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/30 rounded shadow-[0_0_10px_rgba(197,160,89,0.1)]">
            <DollarSign size={14} className="text-mafia-gold" />
            <span className="text-xs font-mono font-black text-mafia-gold tracking-widest uppercase">
              RESPECT: {respectScore}
            </span>
          </div>

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white/40 hover:text-mafia-gold p-2 transition-colors duration-300"
            title={soundEnabled ? "Vypnout zvuky" : "Zapnout zvuky"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: RADAR COMPASS & MAP (GTA 5 GPS RADAR) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* TACTICAL TAB SELECTOR */}
          <div className="grid grid-cols-2 gap-2 bg-black/60 p-1 border border-white/5 rounded">
            <button
              onClick={() => {
                setActiveTab("operativci");
                playSound("/sounds/card.mp3", 0.4);
              }}
              className={`py-3 text-[10px] font-heading font-black tracking-[0.25em] uppercase transition-all duration-300 rounded ${
                activeTab === "operativci" 
                  ? "bg-mafia-gold text-mafia-black shadow-[0_0_15px_rgba(197,160,89,0.25)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              ŽIVOTOPISY BARBERŮ
            </button>
            <button
              onClick={() => {
                setActiveTab("radar");
                playSound("/sounds/card.mp3", 0.4);
              }}
              className={`py-3 text-[10px] font-heading font-black tracking-[0.25em] uppercase transition-all duration-300 rounded ${
                activeTab === "radar" 
                  ? "bg-mafia-gold text-mafia-black shadow-[0_0_15px_rgba(197,160,89,0.25)]" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              TAKTIK GPS RADAR
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "radar" ? (
              <motion.div
                key="radar-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col justify-between bg-[#070707] border-2 border-mafia-gold/20 p-4 sm:p-6 rounded-sm relative overflow-hidden"
              >
                {/* HUD Matrix Overlay */}
                <div className="absolute top-2 left-4 text-[7px] font-mono text-white/20 tracking-[0.2em]">
                  SYS_RADAR_SECURE_LINK_v2.0
                </div>
                <div className="absolute top-2 right-4 text-[7px] font-mono text-mafia-gold/50 tracking-[0.15em] flex items-center gap-1.5 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-mafia-gold" />
                  GPS ACTIVE: UH_MARATICE
                </div>

                {/* SATELLITE ZOOM OVERLAY DISPLAY */}
                <AnimatePresence>
                  {isZooming && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center p-6 border border-mafia-gold/20"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />
                      <div className="space-y-4 text-center max-w-sm relative z-10">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-16 h-16 border-2 border-mafia-gold rounded-full flex items-center justify-center mx-auto"
                        >
                          <Trophy size={32} className="text-mafia-gold" />
                        </motion.div>
                        <h3 className="text-mafia-gold font-heading font-black text-lg tracking-[0.2em] uppercase italic">
                          PŘIBLIŽOVÁNÍ DRUŽICE
                        </h3>
                        <div className="font-mono text-[10px] space-y-1.5 text-white/50 uppercase tracking-widest">
                          <div>SATELLITE ORBIT STATUS: SEGMENT_{zoomStage}</div>
                          <div className="text-white font-bold animate-pulse">
                            ALTITUDE: {zoomStageAltitude}m
                          </div>
                          <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden mt-2 border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: zoomStage === 1 ? "30%" : zoomStage === 2 ? "70%" : "100%" }}
                              className="h-full bg-mafia-gold"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* VISUAL GAME BOARD: MAP CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-grow py-4">
                  
                  {/* LEFT: SIMULATOR RADAR MAP VIEW (GTA Style Mini-map Grid) */}
                  <div className="md:col-span-7 flex flex-col items-center">
                    <div 
                      className="relative w-[75vw] h-[75vw] max-w-[280px] max-h-[280px] sm:w-[320px] sm:h-[320px] bg-black border-2 border-mafia-gold/30 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.9)]"
                    >
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      
                      {/* Interactive Route Path drawing */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        {/* Connecting Route Line */}
                        <polyline
                          points={ROUTE_WAYPOINTS.map(w => `${(w.x * 2.8) + 20},${(w.y * 2.8) + 20}`).join(" ")}
                          fill="none"
                          stroke="rgba(197, 160, 89, 0.4)"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                        />
                        {/* Active driving progression overlay line */}
                        <polyline
                          points={ROUTE_WAYPOINTS.filter(w => collectedTokens.includes(w.id) || w.id === 0).map(w => `${(w.x * 2.8) + 20},${(w.y * 2.8) + 20}`).join(" ")}
                          fill="none"
                          stroke="var(--color-mafia-gold, #c5a059)"
                          strokeWidth="4"
                          className="shadow-[0_0_10px_var(--color-mafia-gold-glow)]"
                        />
                      </svg>

                      {/* Floating Gold Tokens along path */}
                      {ROUTE_WAYPOINTS.map((wp) => {
                        const isCollected = collectedTokens.includes(wp.id);
                        return (
                          <div
                            key={wp.id}
                            style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                            onClick={(e) => collectToken(wp.id, wp.x, wp.y, e)}
                          >
                            <AnimatePresence>
                              {!isCollected && (
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                                  exit={{ scale: 2, opacity: 0 }}
                                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                  className="w-5 h-5 bg-gradient-to-tr from-mafia-gold to-white border border-black rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                                >
                                  <DollarSign size={10} className="text-black font-black" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}

                      {/* Simulated Player arrow marker */}
                      <motion.div
                        animate={{ x: `${playerPos.x}%`, y: `${playerPos.y}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 12 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                      >
                        <div className="relative">
                          <Navigation2 
                            size={20} 
                            className="text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)] transform rotate-45"
                          />
                          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md -z-10 w-8 h-8 -left-1.5 -top-1.5 animate-ping" />
                        </div>
                      </motion.div>

                      {/* MM BARBER HQ End point marker */}
                      <div 
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                        style={{ left: "88%", top: "25%" }}
                      >
                        <div className="relative flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-mafia-red/20 border border-mafia-red flex items-center justify-center animate-pulse">
                            <MapPin size={16} className="text-mafia-red fill-mafia-red drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
                          </div>
                          <span className="text-[7px] font-mono bg-black/90 border border-mafia-gold/25 px-1 rounded text-mafia-gold whitespace-nowrap mt-1">
                            MMBARBER
                          </span>
                        </div>
                      </div>

                      {/* Dynamic floating feedback combat texts */}
                      <AnimatePresence>
                        {floatingTexts.map((ft) => (
                          <motion.div
                            key={ft.id}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: -40, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
                            className="absolute z-50 text-[10px] font-heading font-black text-mafia-gold uppercase tracking-wider whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,1)] pointer-events-none"
                          >
                            {ft.text}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                    </div>
                  </div>

                  {/* RIGHT: VECTOR HUD COMPASS DIAL (Request #8 & #10) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
                    
                    <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-6">
                      <div className="absolute inset-[-10px] border border-mafia-gold/10 rounded-full shadow-[0_0_30px_rgba(197,160,89,0.05)]" />
                      
                      {/* Dynamic Rotating Dial */}
                      <motion.div
                        animate={{ rotate: userHeading !== null ? -(userHeading - calibrationOffset) : 0 }}
                        transition={{ type: "spring", stiffness: 45, damping: 16 }}
                        className="absolute inset-0 border border-mafia-gold/30 rounded-full bg-black/60"
                      >
                        {/* Degrees marks */}
                        {[...Array(24)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute inset-0 flex items-start justify-center"
                            style={{ transform: `rotate(${i * 15}deg)` }}
                          >
                            <div className={`w-[1px] ${i % 6 === 0 ? 'h-3.5 bg-mafia-gold' : 'h-1.5 bg-mafia-gold/30'} mt-1`} />
                          </div>
                        ))}

                        {/* Cardinal Labels */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-mafia-gold">N</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-mafia-gold/50">S</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-mafia-gold/50">E</div>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-mafia-gold/50">W</div>
                      </motion.div>

                      {/* Vector Needle pointing at bearing target */}
                      <motion.div
                        animate={{ rotate: getNeedleRotation() }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
                      >
                        <svg width="150" height="150" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                          <polygon points="50 85 L60 50 L40 50 Z" fill="#333333" />
                          <polygon points="50 15 L60 50 L40 50 Z" fill="#dc2626" />
                          <circle cx="50" cy="50" r="3" fill="white" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* HUD Status Text Display */}
                    <div className="w-full bg-black/60 border border-white/5 p-4 rounded space-y-3 font-mono text-[9px] uppercase tracking-wider text-left">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col border-l border-mafia-red pl-2">
                          <span className="text-white/30 text-[7px]">GPS Vzdálenost</span>
                          <span className="text-white font-bold text-sm mt-0.5">{distanceRaw}</span>
                        </div>
                        <div className="flex flex-col border-l border-mafia-gold pl-2">
                          <span className="text-white/30 text-[7px]">Kompas Azimut</span>
                          <span className="text-white font-bold text-sm mt-0.5">{Math.round(targetBearing)}°</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 space-y-1 text-white/50">
                        <div className="flex justify-between">
                          <span>Družice Cíl:</span>
                          <span className="text-white">UHERSKÉ HRADIŠTĚ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Služebna:</span>
                          <span className="text-white">MAŘATICE HQ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Koordináty:</span>
                          <span className="text-white">49.0592 N, 17.4835 E</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* BOTTOM RADAR CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={startDriveSimulation}
                    disabled={isSimulatingDrive || isZooming}
                    className={`flex-1 py-4 font-heading font-black tracking-[0.2em] uppercase text-xs border rounded transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSimulatingDrive 
                        ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                        : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    }`}
                  >
                    <Target size={14} className={isSimulatingDrive ? "animate-spin" : ""} />
                    <span>SIMULOVAT GPS JÍZDU</span>
                  </button>

                  <button
                    onClick={() => {
                      setCollectedTokens([]);
                      setRespectScore(0);
                      triggerSatelliteZoomSequence();
                    }}
                    disabled={isZooming}
                    className="px-6 py-4 bg-transparent border border-white/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-heading font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-2 rounded"
                  >
                    <RefreshCw size={12} className={isZooming ? "animate-spin" : ""} />
                    <span>RESTARTOVAT RADAR</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              // OPERATIVES/DOSSIERS TAB
              <motion.div
                key="operativci-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col justify-between bg-[#070707] border-2 border-mafia-gold/20 p-6 rounded-sm relative overflow-hidden"
              >
                {/* Dossier Header */}
                <div className="absolute top-2 left-4 text-[7px] font-mono text-white/20 tracking-[0.2em]">
                  CONFIDENTIAL_OPERATIVE_FILES_MM_SECURE
                </div>
                <div className="absolute top-2 right-4 text-[7px] font-mono text-red-500 tracking-[0.15em] flex items-center gap-1.5 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                  RESTRICTED ACCESS
                </div>

                {/* Grid layout for files */}
                <div className="space-y-6 flex-grow py-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-xs font-heading font-black text-white tracking-[0.2em] uppercase italic">
                      VÝBĚR OPERATIVCE
                    </span>
                    <span className="text-[9px] font-mono text-mafia-gold/60 tracking-widest">
                      SEČTENO EXP: {globalStats.tomas?.xp ?? 0 + (globalStats.nella?.xp ?? 0)} XP
                    </span>
                  </div>

                  {/* Operatives circle selection icons */}
                  <div className="flex gap-4">
                    {barbers.map((barber) => {
                      const isTomas = barber.id === "tomas";
                      const customName = isTomas ? customTomasName : customNellaName;
                      const isSelected = selectedBarberId === barber.id;
                      
                      return (
                        <button
                          key={barber.id}
                          onClick={() => {
                            setSelectedBarberId(barber.id);
                            playSound("/sounds/card.mp3", 0.4);
                          }}
                          className={`flex items-center gap-3 p-3 border transition-all duration-300 rounded ${
                            isSelected 
                              ? "bg-mafia-gold/10 border-mafia-gold text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                              : "bg-black/60 border-white/10 text-white/50 hover:border-white/30"
                          }`}
                        >
                          <div className="relative w-10 h-10 rounded overflow-hidden border border-white/20 shrink-0">
                            <Image 
                              src={barber.image} 
                              alt={barber.name} 
                              width={40} 
                              height={40} 
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] font-heading font-black tracking-wider uppercase">
                              {customName}
                            </span>
                            <span className="text-[7px] font-mono text-white/30 uppercase mt-1">
                              CODE: {barber.symbol}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Dossier details */}
                  <div className="bg-black/50 border border-white/5 p-4 rounded space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="relative w-32 h-32 border-2 border-mafia-gold/30 rounded overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        <Image 
                          src={activeBarber.image} 
                          alt={activeBarber.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>

                      {/* Barber Identity & Renaming (Request #3) */}
                      <div className="flex-grow space-y-4 w-full text-center sm:text-left">
                        <div>
                          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
                            {activeBarber.id === "tomas" ? (
                              isEditingTomasName ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    value={tomasInputName}
                                    onChange={(e) => setTomasInputName(e.target.value)}
                                    placeholder="ZADEJTE JMÉNO..."
                                    className="bg-black border-2 border-mafia-gold text-white px-3 py-1 rounded text-xl font-heading focus:outline-none uppercase text-center sm:text-left w-52"
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTomasName(); }}
                                    onBlur={handleSaveTomasName}
                                  />
                                  <button 
                                    onClick={handleSaveTomasName}
                                    className="px-3 py-1 bg-mafia-gold text-black rounded font-mono text-xs font-black uppercase hover:bg-white transition"
                                  >
                                    OK
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 group">
                                  <h3 className="text-white font-heading font-black text-2xl tracking-wider uppercase italic leading-none">
                                    {customTomasName}
                                  </h3>
                                  <button 
                                    onClick={() => {
                                      setTomasInputName(customTomasName);
                                      setIsEditingTomasName(true);
                                    }}
                                    className="text-[8px] font-mono text-mafia-gold hover:text-white flex items-center gap-1 transition opacity-0 group-hover:opacity-100 cursor-pointer bg-transparent border-none"
                                  >
                                    <Edit3 size={10} />
                                    <span>[ PŘEPSAT JMÉNO ]</span>
                                  </button>
                                </div>
                              )
                            ) : (
                              isEditingNellaName ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    value={nellaInputName}
                                    onChange={(e) => setNellaInputName(e.target.value)}
                                    placeholder="ZADEJTE JMÉNO..."
                                    className="bg-black border-2 border-mafia-gold text-white px-3 py-1 rounded text-xl font-heading focus:outline-none uppercase text-center sm:text-left w-52"
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNellaName(); }}
                                    onBlur={handleSaveNellaName}
                                  />
                                  <button 
                                    onClick={handleSaveNellaName}
                                    className="px-3 py-1 bg-mafia-gold text-black rounded font-mono text-xs font-black uppercase hover:bg-white transition"
                                  >
                                    OK
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 group">
                                  <h3 className="text-white font-heading font-black text-2xl tracking-wider uppercase italic leading-none">
                                    {customNellaName}
                                  </h3>
                                  <button 
                                    onClick={() => {
                                      setNellaInputName(customNellaName);
                                      setIsEditingNellaName(true);
                                    }}
                                    className="text-[8px] font-mono text-mafia-gold hover:text-white flex items-center gap-1 transition opacity-0 group-hover:opacity-100 cursor-pointer bg-transparent border-none"
                                  >
                                    <Edit3 size={10} />
                                    <span>[ PŘEPSAT JMÉNO ]</span>
                                  </button>
                                </div>
                              )
                            )}
                          </div>

                          <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mt-1.5 block">
                            HODNOST: {barberRank}
                          </div>
                          <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5 block tracking-widest">
                            {activeBarber.role}
                          </span>
                        </div>

                        <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-wider max-w-lg">
                          {activeBarber.desc}
                        </p>
                      </div>
                    </div>

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div className="space-y-1 text-left font-mono text-[9px] uppercase tracking-wider text-white/40">
                        <span className="text-[7px] text-mafia-gold">SPECIALIZACE</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {activeBarber.specializations?.map((spec, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-white">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 text-left font-mono text-[9px] uppercase tracking-wider text-white/40 flex flex-col justify-between">
                        <div>
                          <span className="text-[7px] text-mafia-gold">OPERAČNÍ REŽIM</span>
                          <p className="text-white mt-1 font-bold">{activeBarber.schedule}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <Shield size={12} className="text-mafia-gold shrink-0" />
                          <span className="text-[7px] text-white/30 uppercase">
                            CODE ID: {activeBarber.symbol}-{activeBarber.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dossier Booking Mission Footer */}
                <div className="pt-4 border-t border-white/5 mt-4">
                  <a
                    href={activeBarber.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-mafia-gold text-mafia-black font-heading font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 rounded shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:bg-white hover:border-white transition-all cursor-pointer"
                  >
                    <Trophy size={14} />
                    <span>ZAHÁJIT MISI S BARBEREM (REZERVACE)</span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* RIGHT COLUMN: STATS PANELS, INSIGNIA PROGRESS & LEVEL UP */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* OPERATIVE DETAIL CARD SUMMARY */}
          <div className="bg-[#070707] border-2 border-mafia-gold/20 p-6 rounded-sm relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Users size={120} className="text-mafia-gold" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs font-heading font-black text-white tracking-[0.2em] uppercase italic">
                  PROFIL AKTIVNÍHO BOJOVNÍKA
                </span>
                <span className="text-[8px] font-mono text-emerald-400 tracking-wider">
                  STAT_ONLINE
                </span>
              </div>

              {/* Insignia & Level Ring representation */}
              <div className="flex items-center gap-6 bg-black/40 border border-white/5 p-4 rounded-xl">
                <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                  <div className="absolute inset-0 rounded-full bg-mafia-gold/5 animate-ping opacity-30" />
                  <MilitaryInsignia level={barberLevel} color="var(--color-mafia-gold, #c5a059)" size={42} />
                </div>
                <div className="space-y-1">
                  <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block">
                    ŠARŽE OPERATIVCE
                  </span>
                  <h4 className="text-white font-heading font-black text-lg tracking-wider uppercase italic leading-none">
                    LEVEL {barberLevel}
                  </h4>
                  <span className="text-[8px] font-mono text-mafia-gold uppercase tracking-[0.1em] block">
                    {barberRank}
                  </span>
                </div>
              </div>

              {/* Level progress bar info */}
              <div className="space-y-2 bg-black/40 border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-wider text-white/50">
                  <span>EXP ZKUŠENOSTI</span>
                  <span className="text-mafia-gold font-bold">{barberXp} XP</span>
                </div>
                
                <div className="relative w-full h-3 bg-black/80 border border-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barberXp % 100}%` }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    className="h-full rounded-full bg-gradient-to-r from-mafia-gold/60 to-mafia-gold shadow-[0_0_12px_rgba(197,160,89,0.6)]"
                  />
                </div>
                
                <div className="flex justify-between items-center text-[7px] font-mono uppercase text-white/20 tracking-widest pt-1">
                  <span>AKTUÁLNÍ STUPEŇ: {barberLevel}</span>
                  <span>DALŠÍ HODNOST: {100 - (barberXp % 100)} XP</span>
                </div>
              </div>

              {/* BARBER RADAR STATS BARS */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[8px] font-mono text-glow text-mafia-gold uppercase tracking-wider">
                    SPECIFICKÁ ANALÝZA SCHOPNOSTÍ
                  </span>
                  <span className="text-[7px] font-mono text-white/20">CONFIDENTIAL</span>
                </div>

                <div className="space-y-3.5">
                  {(activeBarber.id === "tomas" ? [
                    { label: "PŘESNOST BŘITVY", value: 95 },
                    { label: "GEOMETRIE FADU", value: 98 },
                    { label: "TAKTIKA A KOMUNIKACE", value: 90 },
                    { label: "CHARISMA A VIBE", value: 92 }
                  ] : [
                    { label: "KREATIVNÍ TEXTURA", value: 92 },
                    { label: "TRADIČNÍ STYLING", value: 88 },
                    { label: "TAKTIKA A RYCHLOST", value: 94 },
                    { label: "EMPATIE A PŘÁTELSTVÍ", value: 96 }
                  ]).map((stat, sIdx) => {
                    const dynamicOffset = (globalStats[activeBarber.id] as any)?.[`stat${sIdx + 1}`] ?? 0;
                    const finalVal = Math.min(100, stat.value + dynamicOffset);

                    return (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-white/60">
                          <span>{stat.label}</span>
                          <span className="text-mafia-gold font-bold">
                            {finalVal}% {dynamicOffset > 0 && `(+${dynamicOffset})`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${finalVal}%` }}
                            transition={{ delay: 0.1 * sIdx, type: "spring", stiffness: 60, damping: 10 }}
                            className="h-full rounded-full bg-mafia-gold shadow-[0_0_8px_rgba(197,160,89,0.3)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-6 border-t border-white/5 mt-6 grid grid-cols-2 gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SEARCH_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-transparent border border-white/20 text-white font-heading font-black tracking-widest uppercase text-[10px] flex items-center justify-center gap-1.5 rounded hover:bg-white hover:text-black hover:border-white transition-all text-center"
              >
                <Compass size={12} className="animate-spin-slow" />
                <span>GOOGLE MAPA</span>
              </a>

              <Link
                href="/hodnoceni"
                className="py-3 bg-black/60 border border-mafia-gold/30 text-mafia-gold font-heading font-black tracking-widest uppercase text-[10px] flex items-center justify-center gap-1.5 rounded hover:bg-mafia-gold hover:text-black transition-all text-center"
              >
                <Sparkles size={12} className="animate-pulse" />
                <span>ZPĚT NA REPUTACE</span>
              </Link>
            </div>

          </div>

        </section>

      </main>

      {/* GTA 5 HUD bottom status ribbon */}
      <footer className="w-full py-4 text-center border-t border-white/5 z-10 bg-mafia-black/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 font-mono text-[8px] text-white/20 uppercase tracking-[0.25em]">
          <span>© {new Date().getFullYear()} MMBARBER. VŠECHNA PRÁVA VYHRAZENA.</span>
          <span className="flex items-center gap-1.5 text-mafia-gold/40">
            <Shield size={10} className="text-mafia-gold/40" />
            MM_TACTICAL_COMPASS_REVISION_2026
          </span>
        </div>
      </footer>
    </div>
  );
}
