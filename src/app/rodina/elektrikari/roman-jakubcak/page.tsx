"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Zap,
  Images, 
  Phone, 
  ShieldCheck, 
  Home, 
  Building2, 
  School, 
  Factory,
  HardHat,
  Construction,
  Activity,
  Settings,
  PlugZap,
  Wrench,
  X,
  User,
  Calculator,
  Grid,
  ChevronLeft,
  Power,
  AlertTriangle,
  Lock
} from "lucide-react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

type AppName = 'profile' | 'calc' | 'contact' | 'modules' | 'gallery' | 'tools' | null;

export default function RomanJakubcakPage() {
  const { lang, switchLanguage } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [activeApp, setActiveApp] = useState<AppName>(null);
  const [time, setTime] = useState<string>("00:00");

  // --- 3D TILT EFFECT LOGIC ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smooth springs for tilt
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse position [0, 1] to rotation angles [-15deg, 15deg]
  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);
  const bgRotateX = useTransform(smoothY, [0, 1], [2, -2]);
  const bgRotateY = useTransform(smoothX, [0, 1], [-2, 2]);
  const barY = useTransform(smoothY, [0, 1], [-5, 5]);
  const barX = useTransform(smoothX, [0, 1], [-5, 5]);

  // Handle global mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to 0 - 1
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  // ---------------------------

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculator State - EXPANDED 2026 EDITION
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  
  // Tab 1: Infrastructure & Panels
  const [calcPropertyType, setCalcPropertyType] = useState<"byt" | "dum" | "komerce" | "hala">("byt");
  const [calcProjectType, setCalcProjectType] = useState<"new" | "remodel" | "service">("new");
  const [calcSwitchboard, setCalcSwitchboard] = useState<"none" | "subpanel" | "100A" | "200A" | "400A">("none");
  const [calcSmartPanel, setCalcSmartPanel] = useState<boolean>(false);
  const [calcDataRack, setCalcDataRack] = useState<boolean>(false);
  const [calcSolarPrep, setCalcSolarPrep] = useState<boolean>(false);
  const [calcBessPrep, setCalcBessPrep] = useState<boolean>(false);
  const [calcMilling, setCalcMilling] = useState<number>(0);
  const [calcWirePulling, setCalcWirePulling] = useState<number>(0);

  // Tab 2: Circuits, Devices & IoT
  const [calcSockets, setCalcSockets] = useState<number>(0);
  const [calcSmartSockets, setCalcSmartSockets] = useState<number>(0);
  const [calcDataSockets, setCalcDataSockets] = useState<number>(0);
  const [calcLights, setCalcLights] = useState<number>(0);
  const [calcRecessed, setCalcRecessed] = useState<number>(0);
  const [calcLedStrips, setCalcLedStrips] = useState<number>(0);
  const [calcOutdoorLight, setCalcOutdoorLight] = useState<number>(0);
  const [calcCctv, setCalcCctv] = useState<number>(0);
  const [calcSecurity, setCalcSecurity] = useState<number>(0);
  const [calcDetectors, setCalcDetectors] = useState<number>(0);
  
  const [calcHVAC, setCalcHVAC] = useState<boolean>(false);
  const [calcEV, setCalcEV] = useState<boolean>(false);
  const [calcInduction, setCalcInduction] = useState<boolean>(false);

  // Tab 3: Services & Labor
  const [calcSurgeProtection, setCalcSurgeProtection] = useState<boolean>(false);
  const [calcThermo, setCalcThermo] = useState<boolean>(false);
  const [calcProjectDocs, setCalcProjectDocs] = useState<boolean>(false);
  const [calcPlastering, setCalcPlastering] = useState<boolean>(false);
  const [calcCleanup, setCalcCleanup] = useState<boolean>(false);
  const [calcRevision, setCalcRevision] = useState<boolean>(true);
  const [calcExpress, setCalcExpress] = useState<boolean>(false);
  const [calcHours, setCalcHours] = useState<number>(0);

  const [calcTotal, setCalcTotal] = useState<number>(0);
  const [dbPrices, setDbPrices] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/electrician-prices');
        if (res.ok) {
          const data = await res.json();
          setDbPrices(data.prices || null);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic prices:", err);
      }
    };
    fetchPrices();
  }, []);

  // Tools App State
  const [toolsActiveTab, setToolsActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const [toolsPower, setToolsPower] = useState<number>(3680); // W
  const [toolsVoltage, setToolsVoltage] = useState<230 | 400>(230);
  const [toolsLength, setToolsLength] = useState<number>(20); // m
  const [toolsMaterial, setToolsMaterial] = useState<"Cu" | "Al">("Cu");

  // Ohms Law State
  const [ohmU, setOhmU] = useState<number>(230);
  const [ohmI, setOhmI] = useState<number>(16);

  // Breaker State
  const [breakerOn, setBreakerOn] = useState<boolean>(false);
  const [bootProgress, setBootProgress] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breakerOn && bootProgress < 100) {
      timer = setTimeout(() => {
        setBootProgress(prev => Math.min(prev + Math.random() * 20 + 5, 100));
      }, 150);
    } else if (!breakerOn) {
      setBootProgress(0);
    }
    return () => clearTimeout(timer);
  }, [breakerOn, bootProgress]);

  useEffect(() => {
    let total = 0;
    let baseMultiplier = 1;
    
    const getPrice = (key: string, defaultVal: number) => dbPrices ? (dbPrices[key] ?? defaultVal) : defaultVal;

    if (calcPropertyType === "byt") total += getPrice("byt", 2000);
    else if (calcPropertyType === "dum") { total += getPrice("dum", 5000); baseMultiplier = getPrice("dum_mult", 1.1); }
    else if (calcPropertyType === "komerce") { total += getPrice("komerce", 12000); baseMultiplier = getPrice("komerce_mult", 1.3); }
    else if (calcPropertyType === "hala") { total += getPrice("hala", 25000); baseMultiplier = getPrice("hala_mult", 1.5); }

    if (calcProjectType === "remodel") total += getPrice("remodel", 4000);
    else if (calcProjectType === "service") total += getPrice("service", 1000);

    if (calcSwitchboard === "subpanel") total += getPrice("subpanel", 8500);
    else if (calcSwitchboard === "100A") total += getPrice("panel100A", 25000);
    else if (calcSwitchboard === "200A") total += getPrice("panel200A", 38000);
    else if (calcSwitchboard === "400A") total += getPrice("panel400A", 65000);

    if (calcSmartPanel) total += getPrice("smartPanel", 55000);
    if (calcDataRack) total += getPrice("dataRack", 18000);
    if (calcSolarPrep) total += getPrice("solarPrep", 12500);
    if (calcBessPrep) total += getPrice("bessPrep", 9500);

    total += calcMilling * getPrice("milling", 180);
    total += calcWirePulling * getPrice("wirePulling", 65);
    total += calcLedStrips * getPrice("ledStrips", 650);

    total += calcSockets * getPrice("sockets", 450);
    total += calcSmartSockets * getPrice("smartSockets", 850);
    total += calcDataSockets * getPrice("dataSockets", 600);
    total += calcLights * getPrice("lights", 450);
    total += calcRecessed * getPrice("recessed", 600);
    total += calcOutdoorLight * getPrice("outdoorLight", 1200);
    total += calcCctv * getPrice("cctv", 2500);
    total += calcSecurity * getPrice("security", 1100);
    total += calcDetectors * getPrice("detectors", 800);

    if (calcHVAC) total += getPrice("hvac", 4500);
    if (calcEV) total += getPrice("ev", 8500);
    if (calcInduction) total += getPrice("induction", 3500);

    if (calcSurgeProtection) total += getPrice("surgeProtection", 6500);
    if (calcThermo) total += getPrice("thermo", 3500);
    if (calcProjectDocs) total += getPrice("projectDocs", 15000) * baseMultiplier;
    
    if (calcPlastering) total += (calcSockets + calcSmartSockets + calcDataSockets + calcLights + calcRecessed + calcOutdoorLight + calcCctv + calcSecurity) * getPrice("plasteringBase", 100) + (calcMilling * getPrice("plasteringMilling", 60));
    if (calcCleanup) total += getPrice("cleanup", 2500) * baseMultiplier;
    if (calcRevision) total += getPrice("revision", 3500) * baseMultiplier;
    total += calcHours * getPrice("hours", 550);

    if (calcExpress) total = total * getPrice("expressMult", 1.3);

    setCalcTotal(Math.round(total));
  }, [
    calcPropertyType, calcProjectType, calcSwitchboard, calcSmartPanel, calcDataRack, calcSolarPrep, calcBessPrep,
    calcMilling, calcWirePulling,
    calcSockets, calcSmartSockets, calcDataSockets, calcLights, calcRecessed, calcLedStrips, calcOutdoorLight, calcCctv, calcSecurity, calcDetectors,
    calcHVAC, calcEV, calcInduction,
    calcSurgeProtection, calcThermo, calcProjectDocs, calcPlastering, calcCleanup, calcRevision, calcExpress, calcHours, dbPrices
  ]);

  if (!isClient) return null;

  // UI Helpers
  const renderSlider = (label: string, val: number, set: (v: number) => void, max: number, step: number, unit: string) => (
    <div key={label} className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">{label}</span>
        <span className="text-cyan-400 font-bold font-heading">{val} {unit}</span>
      </div>
      <input 
        type="range" min="0" max={max} step={step} value={val} 
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer hover:bg-cyan-900/50 transition-colors"
      />
    </div>
  );

  const renderToggle = (label: string, val: boolean, set: (v: boolean) => void) => (
    <div key={label} className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/10 bg-slate-900/30 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-pointer mb-3 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]" onClick={() => set(!val)}>
      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{label}</span>
      <div className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${val ? "bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" : "bg-slate-800 border border-slate-700"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-slate-950 transition-all ${val ? "left-4.5" : "left-0.5"}`} />
      </div>
    </div>
  );

  const renderTabButton = (tabId: 1|2|3, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 flex flex-col items-center justify-center py-4 border-b-2 transition-all ${
        activeTab === tabId 
          ? "border-cyan-400 text-cyan-400 bg-cyan-950/40 shadow-[inset_0_-10px_20px_-10px_rgba(34,211,238,0.3)]" 
          : "border-slate-800/50 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
      }`}
    >
      <Icon size={18} className="mb-2" />
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-center">{label}</span>
    </button>
  );

  // Desktop Icon Component with 3D Float
  const DesktopIcon = ({ id, label, icon: Icon }: { id: AppName, label: string, icon: any }) => (
    <div 
      className="flex flex-col items-center gap-4 md:gap-6 cursor-pointer group w-32 md:w-40 perspective-1000"
      onClick={() => setActiveApp(id)}
    >
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:bg-cyan-900/40 group-hover:border-cyan-400/80 transition-all duration-300 transform-style-3d group-hover:-translate-y-2 group-hover:shadow-[0_30px_50px_rgba(34,211,238,0.2),inset_0_1px_2px_rgba(255,255,255,0.2)]"
      >
        <Icon className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:scale-110 transition-transform duration-300 w-10 h-10 md:w-14 md:h-14" style={{ transform: "translateZ(20px)" }} />
      </motion.div>
      <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-slate-400 group-hover:text-cyan-400 text-center drop-shadow-md transition-colors">
        {label}
      </span>
    </div>
  );

  return (
    <div 
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans scroll-smooth"
      style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"%2322d3ee\" opacity=\"0.5\"/><circle cx=\"12\" cy=\"12\" r=\"2\" fill=\"%2322d3ee\"/></svg>') 12 12, auto" }}
    >
      {/* 3D OS Layer */}
      <main className="sticky top-0 h-screen w-full overflow-hidden flex flex-col perspective-1000 z-10 pointer-events-auto">
      {/* 3D Electrical Space Background */}
      <motion.div 
        style={{ rotateX: bgRotateX, rotateY: bgRotateY }}
        className="absolute inset-0 pointer-events-none z-0 transform-style-3d scale-110"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.2)_0%,transparent_70%)]" />
        
        {/* Circuit Board Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-30 mix-blend-color-dodge" />
        
        {/* Animated electrical pulses (vertical and horizontal lines) */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
           <motion.div className="absolute left-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,1)]" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
           <motion.div className="absolute left-3/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,1)]" animate={{ y: ['-200%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }} />
           <motion.div className="absolute top-1/3 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,1)]" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 0.5 }} />
        </div>

        {/* Holographic floor grid (schematic blueprint style) */}
        <div className="absolute -inset-[100%] top-1/2 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:linear-gradient(transparent,black_50%,transparent)]" style={{ transform: "rotateX(75deg) translateZ(-200px)" }}>
           {/* Grid glowing nodes */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_2px_at_5rem_5rem,rgba(34,211,238,0.8),transparent)] bg-[size:5rem_5rem]" />
        </div>
      </motion.div>

      {/* Return to MMBARBER Family (Top Left) */}
      <motion.div 
        style={{ y: barY, x: barX }}
        className="absolute top-6 left-6 z-20"
      >
        <Link 
          href="/rodina"
          className="group flex items-center gap-2 px-4 py-2 bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:border-cyan-400/80 transition-all overflow-hidden relative"
        >
          <div className="absolute inset-0 w-1 bg-cyan-400 group-hover:w-full transition-all duration-300 opacity-10" />
          <ChevronLeft size={16} className="text-cyan-400 group-hover:-translate-x-1 transition-transform relative z-10" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold relative z-10 drop-shadow-md">
            Rodina MMBARBER
          </span>
        </Link>
      </motion.div>

      {/* Admin Panel Shortcut */}
      <motion.div
        style={{ y: barY, x: barX }}
        className="absolute bottom-6 right-6 z-20"
      >
        <Link 
          href="/rodina/elektrikari/roman-jakubcak/admin"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all group backdrop-blur-xl shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <Lock size={14} className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
        </Link>
      </motion.div>

      {/* Electrical Language Switcher (Top Right) */}
      <motion.div 
        style={{ y: barY, x: barX }}
        className="absolute top-6 right-6 z-20 flex items-center gap-0 uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30 rounded-lg overflow-hidden"
      >
        <div className="bg-cyan-500/20 px-3 py-3 flex items-center gap-2 border-r border-cyan-500/30 backdrop-blur-xl">
          <Zap size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold hidden md:inline text-xs">
            {lang === 'cs' ? 'JAZYK_SYS' : 'LANG_SYS'}
          </span>
        </div>
        <div className="flex items-center bg-slate-950/80 backdrop-blur-xl text-sm">
          <button 
            onClick={() => switchLanguage('cs')} 
            className={`px-4 py-3 transition-all ${lang === 'cs' ? 'bg-cyan-500/20 text-cyan-400 font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 hover:text-cyan-400/50 hover:bg-slate-900'}`}
          >
            CZ
          </button>
          <div className="w-[1px] h-full bg-cyan-500/30" />
          <button 
            onClick={() => switchLanguage('en')} 
            className={`px-4 py-3 transition-all ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-500 hover:text-cyan-400/50 hover:bg-slate-900'}`}
          >
            EN
          </button>
        </div>
      </motion.div>

      {/* Desktop Area */}
      <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col items-center justify-center">
        
        {/* Holographic Intro Text */}
        <motion.div 
          style={{ rotateX: bgRotateX, rotateY: bgRotateY }}
          className="mb-16 md:mb-24 flex flex-col items-center text-center transform-style-3d pointer-events-none"
        >
          <h1 className="text-5xl md:text-8xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-600 tracking-tighter drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] mb-6" style={{ transform: "translateZ(50px)" }}>
            ROMAN <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">JAKUBČÁK</span>
          </h1>
          
          <div style={{ transform: "translateZ(20px)" }} className="pointer-events-auto">
            <p className="max-w-2xl text-slate-400 font-sans text-sm md:text-lg leading-relaxed transition-all duration-300 hover:scale-110 hover:text-cyan-300 cursor-default drop-shadow-md">
              {lang === 'cs' 
                ? "Profesionální elektroinstalace, inteligentní sítě a moderní technologie. Působím primárně v lokalitách Uherské Hradiště, Uherský Brod a okolí Zlínského kraje." 
                : "Professional electrical installations, smart grids, and modern technologies. Operating primarily in Uherské Hradiště, Uherský Brod, and the Zlín Region."}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-10 md:gap-20 lg:gap-28 justify-center w-full max-w-[1400px]">
          <DesktopIcon id="profile" label={lang === 'cs' ? "Identita" : "Identity"} icon={User} />
          <DesktopIcon id="calc" label={lang === 'cs' ? "Kalkulačka" : "Calculator"} icon={Calculator} />
          <DesktopIcon id="tools" label={lang === 'cs' ? "Nástroje" : "Tools"} icon={Wrench} />
          <DesktopIcon id="gallery" label={lang === 'cs' ? "Galerie" : "Gallery"} icon={Images} />
          <DesktopIcon id="modules" label={lang === 'cs' ? "Certifikace" : "Modules"} icon={Grid} />
          <DesktopIcon id="contact" label={lang === 'cs' ? "Komunikace" : "Comms"} icon={Phone} />
        </div>
      </div>

      {/* App Windows (3D Hologram Modal) */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, translateZ: -500, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, translateZ: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, translateZ: -500, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-12 pt-20 md:pt-24 perspective-1000"
          >
            {/* Dark overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setActiveApp(null)}
            />

            {/* The 3D Glass Window */}
            <motion.div 
              style={{ rotateX, rotateY }} // Interactive 3D tilt on window
              className="w-full h-full max-w-[95vw] xl:max-w-[1500px] max-h-[85vh] bg-slate-900/60 backdrop-blur-2xl border border-cyan-400/40 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2),0_0_50px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col relative transform-style-3d"
            >
              {/* Animated scanning line in window */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-0">
                <motion.div className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" animate={{ y: ['-100%', '1000%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
              </div>
              
              {/* App Header */}
              <div className="h-14 bg-slate-950/40 border-b border-cyan-500/20 flex items-center justify-between px-6 shrink-0 relative z-10" style={{ transform: "translateZ(30px)" }}>
                <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  {activeApp === 'profile' && "// USER_IDENTITY.sys"}
                  {activeApp === 'calc' && "// PRO_ESTIMATOR_CORE.sys"}
                  {activeApp === 'tools' && "// ELEC_UTILITIES_v2.sys"}
                  {activeApp === 'modules' && "// CERTIFIED_MODULES.sys"}
                  {activeApp === 'contact' && "// COMMS_LINK.sys"}
                </span>
                <button 
                  onClick={() => setActiveApp(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors border border-red-500/20"
                >
                  <X size={18} />
                </button>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative z-10" style={{ transform: "translateZ(20px)" }}>
                
                {/* 1. PROFILE APP */}
                {activeApp === 'profile' && (
                  <div className="flex flex-col md:flex-row gap-12 items-center justify-center h-full max-w-6xl mx-auto">
                    <div className="w-56 h-56 rounded-full border-4 border-cyan-500/40 p-4 shrink-0 bg-slate-950/80 relative shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                      <div className="absolute inset-0 rounded-full border border-cyan-300/50 animate-ping opacity-20" />
                      <Image src="/logo.png" alt="Roman" width={220} height={220} unoptimized className="w-full h-full object-contain filter brightness-150 contrast-125" />
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-4xl md:text-6xl font-heading font-black text-slate-100 uppercase tracking-tight mb-2 drop-shadow-lg">
                        Roman <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Jakubčák</span>
                      </h1>
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                        <p className="text-cyan-400 font-mono text-sm uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Master Electrician</p>
                        <span className="text-cyan-500/30">|</span>
                        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">IČO: 07221293</p>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-base md:text-lg bg-slate-950/30 p-6 rounded-2xl border border-cyan-500/10">
                        {lang === 'cs' ? 
                          "Elektroinstalacím se věnuji profesionálně již od 19 let. Zakládám si na absolutně čistém provedení rozvaděčů a kabelových tras. Garantuji maximální spolehlivost a absolutní shodu se současnými normami ČSN." : 
                          "Professional installations since age 19. I guarantee complete safety, absolute compliance with technical standards, and professional execution without compromise."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. GALLERY APP */}
                {activeApp === 'gallery' && (
                  <div className="flex flex-col h-full max-w-6xl mx-auto items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                      <Images className="text-cyan-400" size={32} />
                    </div>
                    <h2 className="text-3xl font-heading font-black text-slate-100 uppercase tracking-widest mb-4">
                      {lang === 'cs' ? "Projektová Galerie" : "Project Gallery"}
                    </h2>
                    <p className="text-slate-400 text-center max-w-md mb-12">
                      {lang === 'cs' 
                        ? "Prostor pro budoucí integraci 3D galerie ukázek práce a realizovaných projektů." 
                        : "Space for future integration of a 3D gallery showcasing work and completed projects."}
                    </p>
                    {/* Placeholder Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full opacity-30 pointer-events-none">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="aspect-square bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-center">
                          <Images size={24} className="text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. CALCULATOR APP */}
                {activeApp === 'calc' && (
                  <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto">
                    <div className="flex bg-slate-950/60 border border-cyan-500/30 rounded-2xl overflow-hidden mb-6 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      {renderTabButton(1, lang === 'cs' ? "Základ a Rozvaděče" : "Scope & Panels", Settings)}
                      {renderTabButton(2, lang === 'cs' ? "Okruhy a Prvky" : "Circuits & Devices", PlugZap)}
                      {renderTabButton(3, lang === 'cs' ? "Služby a Práce" : "Labor & Services", Wrench)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 min-h-0">
                      
                      <div className="md:col-span-7 space-y-6 overflow-y-auto pr-4 pb-8 custom-scrollbar">
                        <AnimatePresence mode="wait">
                          {activeTab === 1 && (
                            <motion.div key="tab1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Sektor / Objekt</label>
                                <div className="grid grid-cols-4 gap-2 md:gap-3">
                                  {[{ id: "byt", label: "Byt" }, { id: "dum", label: "Dům" }, { id: "komerce", label: "Komerce" }, { id: "hala", label: "Hala" }].map(type => (
                                    <button key={type.id} onClick={() => setCalcPropertyType(type.id as any)} className={`py-3 px-1 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all rounded-xl border ${calcPropertyType === type.id ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-slate-950/50 text-slate-400 border-cyan-500/20 hover:border-cyan-500/50"}`}>{type.label}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Rozvaděče a Infrastruktura</label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                                  {[{ id: "none", label: "Ne" }, { id: "subpanel", label: "Podružný" }, { id: "100A", label: "100A" }, { id: "200A", label: "200A" }, { id: "400A", label: "400A" }].map(type => (
                                    <button key={type.id} onClick={() => setCalcSwitchboard(type.id as any)} className={`py-3 px-1 text-center text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all rounded-xl border ${calcSwitchboard === type.id ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-slate-950/50 text-slate-400 border-cyan-500/20 hover:border-cyan-500/50"}`}>{type.label}</button>
                                  ))}
                                </div>
                                
                                {renderToggle("Smart Home Jádro (Loxone/KNX)", calcSmartPanel, setCalcSmartPanel)}
                                {renderToggle("Datový Rack (IT Sítě)", calcDataRack, setCalcDataRack)}
                                {renderToggle("Příprava pro FVE (Soláry)", calcSolarPrep, setCalcSolarPrep)}
                                {renderToggle("Příprava pro BESS (Baterie)", calcBessPrep, setCalcBessPrep)}
                              </div>
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10 mt-6">
                                {renderSlider("Frézování drážek v betonu/zdivu", calcMilling, setCalcMilling, 1000, 10, "m")}
                                <div className="h-4"></div>
                                {renderSlider("Tahání kabeláže (Rough-in)", calcWirePulling, setCalcWirePulling, 5000, 50, "m")}
                              </div>
                            </motion.div>
                          )}

                          {activeTab === 2 && (
                            <motion.div key="tab2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10 space-y-2">
                                {renderSlider("Běžné zásuvky/vypínače 230V", calcSockets, setCalcSockets, 250, 5, "ks")}
                                {renderSlider("Smart/Touch prvky (hlubší inst.)", calcSmartSockets, setCalcSmartSockets, 150, 1, "ks")}
                                {renderSlider("Datové zásuvky (RJ45 CAT6A)", calcDataSockets, setCalcDataSockets, 100, 1, "ks")}
                                {renderSlider("Vývody pro běžná světla", calcLights, setCalcLights, 150, 2, "ks")}
                                {renderSlider("Bodová světla (Recessed SDK)", calcRecessed, setCalcRecessed, 150, 2, "ks")}
                                {renderSlider("Frézované LED alu profily", calcLedStrips, setCalcLedStrips, 100, 1, "m")}
                              </div>

                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10 space-y-2">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Senzorika & Kamery</label>
                                {renderSlider("Zabezpečení (JABLOTRON/Paradox)", calcSecurity, setCalcSecurity, 30, 1, "ks")}
                                {renderSlider("Kamerový systém (PoE CCTV)", calcCctv, setCalcCctv, 20, 1, "ks")}
                                {renderSlider("Požární a CO2 Detektory", calcDetectors, setCalcDetectors, 20, 1, "ks")}
                                {renderSlider("Venkovní architektonické osvětlení", calcOutdoorLight, setCalcOutdoorLight, 50, 1, "ks")}
                              </div>
                              
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Dedikované Okruhy (3-Fáze / Zátěž)</label>
                                {renderToggle("EV Nabíječka (Wallbox 22kW)", calcEV, setCalcEV)}
                                {renderToggle("Klimatizace / Tepelné čerpadlo", calcHVAC, setCalcHVAC)}
                                {renderToggle("Indukční deska (3-fáze 400V)", calcInduction, setCalcInduction)}
                              </div>
                            </motion.div>
                          )}

                          {activeTab === 3 && (
                            <motion.div key="tab3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Projekce a Ochrana</label>
                                {renderToggle("Termovizní diagnostika zátěže", calcThermo, setCalcThermo)}
                                {renderToggle("Projektová dokumentace (AutoCAD)", calcProjectDocs, setCalcProjectDocs)}
                                {renderToggle("Přepěťová ochrana T1+T2+T3", calcSurgeProtection, setCalcSurgeProtection)}
                                {renderToggle("Výchozí Revizní Zpráva ČSN", calcRevision, setCalcRevision)}
                              </div>
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10">
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-4">Stavební zapravení</label>
                                {renderToggle("Začištění a sádrování po drážkách", calcPlastering, setCalcPlastering)}
                                {renderToggle("Finální stavební úklid (vysavač/tep)", calcCleanup, setCalcCleanup)}
                              </div>
                              <div className="bg-slate-900/40 p-5 rounded-2xl border border-cyan-500/10 border-red-500/30">
                                <label className="block text-[10px] font-mono text-red-400/80 uppercase tracking-widest mb-4">Mimořádné Služby</label>
                                {renderToggle("Expresní realizace / Víkendy (+30%)", calcExpress, setCalcExpress)}
                                {renderSlider("Konzultační hodinovka (Vícepráce)", calcHours, setCalcHours, 100, 1, "h")}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Right Column: Price summary pinned */}
                      <div className="md:col-span-5 h-full pb-8 md:pb-0">
                        <div className="p-8 rounded-3xl bg-cyan-950/40 border-2 border-cyan-400/30 relative overflow-hidden flex flex-col items-center justify-center h-full min-h-[350px] shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.2)_0%,transparent_70%)] pointer-events-none" />
                          <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 overflow-hidden">
                             <motion.div className="h-full bg-cyan-400" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                          </div>

                          <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.5em] mb-6 z-10 text-center drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                            Odhad Systému
                          </span>
                          
                          <motion.div 
                            key={calcTotal}
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black font-heading text-cyan-400 tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] z-10 flex flex-col md:flex-row items-center md:items-baseline gap-3"
                          >
                            {calcTotal.toLocaleString('cs-CZ')} <span className="text-2xl md:text-3xl text-cyan-400/60 font-medium">Kč</span>
                          </motion.div>
                          
                          <div className="absolute bottom-6 left-0 w-full text-center text-[9px] font-mono text-cyan-500/40 uppercase tracking-widest px-4">
                            Generováno AI algoritmem • Nezávazný odhad
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TOOLS APP */}
                {activeApp === 'tools' && (
                  <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
                    <div className="flex bg-slate-950/60 border border-cyan-500/30 rounded-2xl overflow-hidden mb-6 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <button onClick={() => setToolsActiveTab(1)} className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest transition-all ${toolsActiveTab === 1 ? 'bg-cyan-900/40 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        {lang === 'cs' ? "Kabeláž & Ztráty" : "Cables & Drop"}
                      </button>
                      <button onClick={() => setToolsActiveTab(2)} className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest transition-all ${toolsActiveTab === 2 ? 'bg-cyan-900/40 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        Ohmův Zákon
                      </button>
                      <button onClick={() => setToolsActiveTab(3)} className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest transition-all ${toolsActiveTab === 3 ? 'bg-cyan-900/40 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        {lang === 'cs' ? "Hlavní Jistič" : "Main Breaker"}
                      </button>
                      <button onClick={() => setToolsActiveTab(4)} className={`flex-1 py-4 font-mono text-xs uppercase tracking-widest transition-all ${toolsActiveTab === 4 ? 'bg-cyan-900/40 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                        {lang === 'cs' ? "Praktický Rádce" : "Guide"}
                      </button>
                    </div>

                    <div className="flex-1 bg-slate-900/40 p-6 md:p-10 rounded-3xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)] overflow-y-auto custom-scrollbar">
                      {toolsActiveTab === 1 && (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">Příkon zátěže (W)</label>
                                <input type="number" value={toolsPower} onChange={e => setToolsPower(Number(e.target.value))} className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400 transition-colors" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">Napájecí soustava</label>
                                <div className="flex gap-2">
                                  <button onClick={() => setToolsVoltage(230)} className={`flex-1 py-3 rounded-xl border font-bold transition-colors ${toolsVoltage === 230 ? 'bg-cyan-500 text-slate-900 border-cyan-400' : 'bg-slate-950 text-slate-400 border-cyan-500/20'}`}>230V (1-fáze)</button>
                                  <button onClick={() => setToolsVoltage(400)} className={`flex-1 py-3 rounded-xl border font-bold transition-colors ${toolsVoltage === 400 ? 'bg-cyan-500 text-slate-900 border-cyan-400' : 'bg-slate-950 text-slate-400 border-cyan-500/20'}`}>400V (3-fáze)</button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">Materiál vodiče</label>
                                <div className="flex gap-2">
                                  <button onClick={() => setToolsMaterial("Cu")} className={`flex-1 py-3 rounded-xl border font-bold transition-colors ${toolsMaterial === "Cu" ? 'bg-orange-500 text-slate-900 border-orange-400' : 'bg-slate-950 text-slate-400 border-cyan-500/20'}`}>Měď (Cu)</button>
                                  <button onClick={() => setToolsMaterial("Al")} className={`flex-1 py-3 rounded-xl border font-bold transition-colors ${toolsMaterial === "Al" ? 'bg-slate-300 text-slate-900 border-slate-200' : 'bg-slate-950 text-slate-400 border-cyan-500/20'}`}>Hliník (Al)</button>
                                </div>
                              </div>
                              {renderSlider("Délka vedení (m)", toolsLength, setToolsLength, 200, 1, "m")}
                            </div>
                            
                            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)] pointer-events-none" />
                              
                              {(() => {
                                const I = toolsVoltage === 230 ? toolsPower / 230 : toolsPower / (Math.sqrt(3) * 400);
                                const rho = toolsMaterial === "Cu" ? 0.0175 : 0.0282;
                                // Simple suggestion based on current for PVC cables
                                let recommendedSection = 1.5;
                                if (I > 13) recommendedSection = 2.5;
                                if (I > 16) recommendedSection = 4;
                                if (I > 25) recommendedSection = 6;
                                if (I > 32) recommendedSection = 10;
                                if (I > 50) recommendedSection = 16;
                                if (I > 70) recommendedSection = 25;
                                
                                const vDrop = toolsVoltage === 230 
                                  ? (2 * toolsLength * I * rho) / recommendedSection
                                  : (Math.sqrt(3) * toolsLength * I * rho) / recommendedSection;
                                const vDropPercent = (vDrop / toolsVoltage) * 100;
                                const isOverload = vDropPercent > 4;
                                
                                return (
                                  <motion.div 
                                    className={`w-full space-y-6 z-10 text-center relative p-6 rounded-2xl transition-colors duration-500 ${isOverload ? 'bg-red-950/40 border-2 border-red-500/50' : 'border-2 border-transparent'}`}
                                    animate={isOverload ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : {}}
                                    transition={isOverload ? { repeat: Infinity, duration: 0.2, ease: "linear" } : {}}
                                  >
                                    {isOverload && (
                                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-20">
                                        <div className="text-9xl text-red-500 font-black tracking-tighter mix-blend-overlay">OVERLOAD</div>
                                      </div>
                                    )}
                                    <div>
                                      <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isOverload ? 'text-red-400/80' : 'text-cyan-500/80'}`}>Kalkulovaný proud</div>
                                      <div className={`text-3xl font-heading font-black ${isOverload ? 'text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-slate-100'}`}>{I.toFixed(2)} A</div>
                                    </div>
                                    <div className={`h-px w-full ${isOverload ? 'bg-red-500/30' : 'bg-cyan-500/20'}`} />
                                    <div>
                                      <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isOverload ? 'text-red-400/80' : 'text-cyan-500/80'}`}>Doporučený průřez (min)</div>
                                      <div className={`text-4xl font-heading font-black ${isOverload ? 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-cyan-400'}`}>{recommendedSection} mm²</div>
                                    </div>
                                    <div className={`h-px w-full ${isOverload ? 'bg-red-500/30' : 'bg-cyan-500/20'}`} />
                                    <div>
                                      <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isOverload ? 'text-red-400/80' : 'text-cyan-500/80'}`}>Úbytek napětí</div>
                                      <div className={`text-2xl font-heading font-black ${isOverload ? 'text-red-500 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-green-400'}`}>
                                        {vDrop.toFixed(2)} V ({vDropPercent.toFixed(2)} %)
                                      </div>
                                      {isOverload && (
                                        <div className="text-xs text-red-400/90 mt-2 font-bold flex items-center justify-center gap-2 bg-red-950/80 p-3 rounded-xl border border-red-500/50 relative z-30 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                          <AlertTriangle size={16} className="animate-ping absolute opacity-30" />
                                          <AlertTriangle size={16} className="text-red-400 z-10" />
                                          <span className="z-10">KRITICKÝ ÚBYTEK NAPĚTÍ</span>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {toolsActiveTab === 2 && (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-300 flex flex-col items-center justify-center h-full relative">
                           {/* Animated Energy Flow lines */}
                           <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
                             <motion.div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,1)]" 
                               animate={{ y: ['-100%', '100%'] }} 
                               transition={{ duration: Math.max(0.2, 1.5 - (ohmI / 100)), repeat: Infinity, ease: "linear" }} 
                             />
                             <motion.div className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_rgba(249,115,22,1)]" 
                               animate={{ x: ['-100%', '100%'] }} 
                               transition={{ duration: Math.max(0.2, 2 - ((ohmU * ohmI) / 10000)), repeat: Infinity, ease: "linear", delay: 0.5 }} 
                             />
                           </div>

                           <div className="w-48 h-48 rounded-full border-4 border-cyan-500/30 flex items-center justify-center relative mb-8 z-10 backdrop-blur-sm bg-slate-950/50">
                             <div className="absolute top-4 font-heading font-black text-3xl text-cyan-400">U</div>
                             <div className="absolute bottom-4 left-8 font-heading font-black text-3xl text-cyan-400">R</div>
                             <div className="absolute bottom-4 right-8 font-heading font-black text-3xl text-cyan-400">I</div>
                             <div className="w-full h-1 bg-cyan-500/30 absolute top-1/2 -translate-y-1/2" />
                             <div className="w-1 h-1/2 bg-cyan-500/30 absolute bottom-0 left-1/2 -translate-x-1/2" />
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl relative z-10">
                             <div>
                               <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">Napětí U (Volty)</label>
                               <input type="number" value={ohmU} onChange={e => setOhmU(Number(e.target.value))} className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400 backdrop-blur-md" />
                             </div>
                             <div>
                               <label className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest mb-2">Proud I (Ampéry)</label>
                               <input type="number" value={ohmI} onChange={e => setOhmI(Number(e.target.value))} className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-400 font-bold focus:outline-none focus:border-cyan-400 backdrop-blur-md" />
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mt-8 relative z-10">
                             <div className="bg-cyan-900/30 border border-cyan-500/30 p-4 rounded-xl text-center backdrop-blur-md">
                               <div className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest mb-1">Odpor R (Ohmy)</div>
                               <div className="text-2xl font-bold text-slate-100">{ohmI > 0 ? (ohmU / ohmI).toFixed(2) : "∞"} Ω</div>
                             </div>
                             <div className="bg-orange-900/30 border border-orange-500/30 p-4 rounded-xl text-center backdrop-blur-md">
                               <div className="text-[10px] font-mono text-orange-500/80 uppercase tracking-widest mb-1">Výkon P (Watty)</div>
                               <div className="text-2xl font-bold text-slate-100">{(ohmU * ohmI).toFixed(0)} W</div>
                             </div>
                           </div>
                        </div>
                      )}

                      {toolsActiveTab === 3 && (
                        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300 relative">
                          <div className={`absolute inset-0 bg-cyan-500 transition-opacity duration-1000 pointer-events-none mix-blend-color-dodge ${breakerOn && bootProgress === 100 ? 'opacity-10' : 'opacity-0'}`} />
                          
                          <div className="mb-12 relative">
                            {/* Visual Glow behind breaker */}
                            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${breakerOn ? 'bg-cyan-500/30 scale-150' : 'bg-red-500/10 scale-100'}`} />
                            
                            {/* Breaker Box */}
                            <div className="w-48 h-64 bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center justify-between">
                              <div className="w-full flex justify-between px-2">
                                <span className={`text-[10px] font-bold font-mono tracking-widest transition-colors ${breakerOn ? 'text-green-400' : 'text-slate-500'}`}>ON</span>
                                <span className={`text-[10px] font-bold font-mono tracking-widest transition-colors ${!breakerOn ? 'text-red-400' : 'text-slate-500'}`}>OFF</span>
                              </div>
                              
                              {/* The Switch */}
                              <div 
                                onClick={() => setBreakerOn(!breakerOn)}
                                className={`w-20 h-40 rounded-xl relative cursor-pointer transition-all duration-300 shadow-inner ${breakerOn ? 'bg-slate-800' : 'bg-slate-950'}`}
                              >
                                <motion.div 
                                  className={`absolute left-2 right-2 h-20 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center border-b-4 border-slate-950 ${breakerOn ? 'bg-cyan-500' : 'bg-slate-700'}`}
                                  animate={{ top: breakerOn ? '8px' : '72px' }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                  <Power size={24} className={`transition-colors ${breakerOn ? 'text-slate-900' : 'text-slate-400'}`} />
                                </motion.div>
                              </div>
                              
                              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-2">
                                MAIN 400A
                              </div>
                            </div>
                          </div>

                          {/* Diagnostics Terminal */}
                          <div className="w-full max-w-xl h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />
                            {!breakerOn ? (
                              <div className="text-red-500/50 animate-pulse flex items-center gap-2">
                                <AlertTriangle size={14} /> SYSTEM OFFLINE. AWAITING POWER.
                              </div>
                            ) : (
                              <div className="text-cyan-400 space-y-1 relative z-10">
                                <div>{">"} INIT BOOT SEQUENCE...</div>
                                {bootProgress > 10 && <div>{">"} CHECKING PHASE BALANCE: <span className="text-green-400">OK</span></div>}
                                {bootProgress > 40 && <div>{">"} SENSORS ALIGNMENT: <span className="text-green-400">OK</span></div>}
                                {bootProgress > 70 && <div>{">"} SMART GRID CONNECTION: <span className="text-green-400">STABLE</span></div>}
                                {bootProgress >= 100 && (
                                  <div className="text-green-400 font-bold mt-2 animate-pulse">{">"} SYSTEM FULLY OPERATIONAL.</div>
                                )}
                                
                                {/* Progress Bar */}
                                <div className="w-full h-1 bg-slate-900 mt-3 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400" style={{ width: `${bootProgress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {toolsActiveTab === 4 && (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-300 w-full pb-10">
                          <h3 className="text-2xl md:text-3xl font-heading font-black text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-2 mb-8 text-center md:text-left">
                            Průvodce Elektroinstalací (Základy pro laiky)
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Kabely */}
                            <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                              <h4 className="text-lg font-bold text-slate-100 uppercase mb-6 flex items-center gap-3">
                                <Zap size={20} className="text-cyan-400" />
                                1. Správné Kabely (Standard CZ)
                              </h4>
                              <ul className="space-y-4 text-base text-slate-300">
                                <li className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <span className="font-bold text-cyan-400 text-lg">Světelné okruhy</span>
                                  <span className="text-sm mt-2">Kabel: <strong className="text-slate-100">CYKY-J 3x1.5</strong> | Jištění: <strong className="text-slate-100">10A</strong></span>
                                </li>
                                <li className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <span className="font-bold text-cyan-400 text-lg">Zásuvkové okruhy (230V)</span>
                                  <span className="text-sm mt-2">Kabel: <strong className="text-slate-100">CYKY-J 3x2.5</strong> | Jištění: <strong className="text-slate-100">16A</strong></span>
                                </li>
                                <li className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <span className="font-bold text-cyan-400 text-lg">Indukce / Varná deska (400V)</span>
                                  <span className="text-sm mt-2">Kabel: <strong className="text-slate-100">CYKY-J 5x2.5</strong> (příp. 5x4) | Jištění: <strong className="text-slate-100">3x 16A</strong></span>
                                </li>
                                <li className="flex flex-col bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <span className="font-bold text-cyan-400 text-lg">Data a Internet</span>
                                  <span className="text-sm mt-2">Kabel: <strong className="text-slate-100">UTP / FTP Cat6</strong> (hvězdicovitě do racku)</span>
                                </li>
                              </ul>
                            </div>

                            {/* Výšky a normy */}
                            <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                              <h4 className="text-lg font-bold text-slate-100 uppercase mb-6 flex items-center gap-3">
                                <Activity size={20} className="text-cyan-400" />
                                2. Instalační Výšky a Zóny
                              </h4>
                              <ul className="space-y-4 text-base text-slate-300">
                                <li className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                  <span><strong className="text-slate-100 block mb-1 text-lg">Vypínače (střed):</strong> 105 cm od čisté podlahy (běžně 15 cm od zárubní dveří na straně kliky).</span>
                                </li>
                                <li className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                  <span><strong className="text-slate-100 block mb-1 text-lg">Běžné zásuvky (střed):</strong> 20–30 cm od čisté podlahy.</span>
                                </li>
                                <li className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                  <span><strong className="text-slate-100 block mb-1 text-lg">Zásuvky nad prac. deskou:</strong> Běžně 120 cm (přizpůsobuje se výšce linky).</span>
                                </li>
                                <li className="flex items-start gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                  <span><strong className="text-slate-100 block mb-1 text-lg">Koupelny (Zóny):</strong> Zpřísněné bezpečnostní zóny kolem vany/sprchy. Zásuvky minimálně 60 cm od hrany vany, krytí min. IP44.</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Pojmy */}
                          <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                            <h4 className="text-lg font-bold text-slate-100 uppercase mb-6 flex items-center gap-3">
                              <ShieldCheck size={20} className="text-cyan-400" />
                              3. Co je co v rozvaděči (Slovníček)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                                <span className="font-bold text-cyan-400 block mb-3 text-xl">Jistič (MCB)</span>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed">Hlídá kabely. Vypne proud, pokud by obvodem teklo více proudu, než na kolik je kabel stavěný (aby nezačal hořet z důvodu přetížení), nebo pokud dojde k tvrdému zkratu L-N.</p>
                              </div>
                              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                                <span className="font-bold text-cyan-400 block mb-3 text-xl">Proudový chránič (RCD)</span>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed">Hlídá lidi. Měří rozdíl proudu, který do obvodu odteče a přiteče zpět. Pokud se část proudu "ztratí" (např. přes tělo člověka do země), okamžitě vybaví a zachrání život.</p>
                              </div>
                              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 md:col-span-2">
                                <span className="font-bold text-cyan-400 block mb-3 text-xl">Přepěťová ochrana (SPD)</span>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed">Hlídá elektroniku. Svede do země extrémní přepětí způsobené bleskem (přímý nebo nepřímý úder) nebo poruchou distribuční sítě. Zachrání vám drahé spotřebiče, pokud je instalovaná správně jako kaskáda (T1+T2 na vstupu do domu, T3 u citlivé techniky).</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. MODULES APP */}
                {activeApp === 'modules' && (
                  <div className="h-full flex flex-col items-center justify-center max-w-6xl w-full mx-auto">
                    <h2 className="text-2xl font-heading font-black text-cyan-400 uppercase mb-12 tracking-[0.3em] text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                      {lang === 'cs' ? "Certifikované Moduly" : "Certified Modules"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {[
                        { title: lang === 'cs' ? "Bytová elektroinstalace" : "Residential Electrical", icon: <Home className="w-6 h-6" /> },
                        { title: lang === 'cs' ? "Rodinné domy" : "Houses", icon: <Construction className="w-6 h-6" /> },
                        { title: lang === 'cs' ? "Veřejné budovy" : "Public Buildings", icon: <School className="w-6 h-6" /> },
                        { title: lang === 'cs' ? "Komerční prostory" : "Commercial", icon: <Building2 className="w-6 h-6" /> },
                        { title: lang === 'cs' ? "Průmyslová instalace" : "Industrial", icon: <Factory className="w-6 h-6" /> },
                        { title: lang === 'cs' ? "Revize elektro" : "Revisions", icon: <ShieldCheck className="w-6 h-6" /> },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-900/50 border border-cyan-500/30 p-6 rounded-2xl flex items-center gap-6 hover:bg-cyan-900/30 hover:border-cyan-400 transition-all cursor-crosshair group shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                          <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                            {s.icon}
                          </div>
                          <span className="font-heading font-bold text-base uppercase tracking-widest text-slate-200 group-hover:text-white">
                            {s.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. CONTACT APP */}
                {activeApp === 'contact' && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-40 h-40 rounded-full bg-cyan-500/10 border-4 border-cyan-400 flex items-center justify-center mb-12 relative shadow-[0_0_50px_rgba(34,211,238,0.5)]">
                       <Phone size={64} className="text-cyan-400 animate-pulse" />
                       <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping opacity-50" />
                       <div className="absolute -inset-8 rounded-full border border-cyan-500/30 animate-spin-slow border-dashed" />
                    </div>
                    <h2 className="text-3xl font-heading font-black text-slate-100 uppercase tracking-[0.3em] mb-4 drop-shadow-md">Comms Link Active</h2>
                    <p className="text-cyan-500/60 font-mono text-sm uppercase tracking-widest mb-8">Spojení zabezpečeno • End-to-End</p>
                    <a href="tel:+420732169799" className="text-6xl md:text-8xl font-black font-heading text-cyan-400 hover:text-white transition-colors drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] tracking-tighter">
                      +420 732 169 799
                    </a>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5); 
        }
        .perspective-1000 {
          perspective: 1500px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
      </main>

      {/* Massive scroll spacer to hide SEO from humans (90x scroll simulation) */}
      <div style={{ height: "15000px" }} aria-hidden="true" className="w-full relative z-0 pointer-events-none" />

      {/* 2026 Semantic Deep SEO Section */}
      <section className="relative z-20 bg-slate-950 border-t-2 border-cyan-500/20 p-8 md:p-24 text-slate-400 font-sans shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="flex items-center gap-4 mb-12">
             <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
             <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-200 uppercase tracking-widest">
               Indexace // Hloubková Sémantická Databáze 2026
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-cyan-500/20 pb-2">Architektura Inteligentních Sítí & Smart Home</h3>
              <p className="mb-4">
                Roman Jakubčák reprezentuje technologickou špičku v oboru elektroinstalací pro rok 2026. Specializace zahrnuje kompletní 
                návrh a realizaci systémů chytré domácnosti (Smart Home), integraci IoT (Internet of Things) senzoriky, KNX protokolů 
                a Loxone automatizace. V kontextu moderní energetiky zajišťujeme přípravu i montáž fotovoltaických elektráren (FVE), 
                bateriových úložišť (BESS - Battery Energy Storage Systems) a dedikovaných obvodů pro nabíjecí stanice elektromobilů (EV Wallbox / AC & DC nabíjení).
              </p>
              <p>
                Každá instalace podléhá přísným normám ČSN EN a je zakončena detailní výchozí revizí elektro. 
                Garantujeme absolutní symetrii fázového zatížení, rezistenci vůči harmonickému zkreslení a 
                špičkový cable management (skryté vedení tras) v rezidenčních i komerčních objektech.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-cyan-500/20 pb-2">Geografická Dostupnost & Průmyslové Instalace</h3>
              <p className="mb-4">
                Působnost pokrývá strategické oblasti Zlínského kraje: <strong>Zlín, Otrokovice, Uherské Hradiště, Napajedla, Malenovice a Staré Město</strong>. 
                V rámci B2B sektoru realizujeme těžké průmyslové instalace – připojení CNC obráběcích center, 
                dimenzování hlavních jističů nad 400A, instalace podružných rozvaděčů, kompenzace účiníku a instalace přepěťových ochran T1+T2+T3.
              </p>
              <p>
                Servisní zásahy, trasování defektů (troubleshooting) pomocí termokamer a 
                modernizace hliníkových rozvodů (retrofitting) na měděné (Cu) vodiče v panelových i historických zástavbách 
                jsou prováděny s mikroskopickou přesností.
              </p>
            </div>
          </div>

          {/* Semantic JSON-LD Structured Data Schema for AI/LLMs */}
          <div className="mt-16 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs font-mono overflow-hidden">
            <h4 className="text-cyan-500/50 uppercase tracking-widest mb-4">Semantic Entity (JSON-LD) - Neural Engine Parsing Only</h4>
            <pre className="text-slate-500 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "Electrician",
  "name": "Roman Jakubčák - Master Electrician",
  "image": "https://www.mmbarber.cz/logo.png",
  "description": "Profesionální elektroinstalace, Smart Home systémy, revize a průmyslové sítě ve Zlínském kraji. Integrace FVE a EV nabíječek.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Otrokovice",
    "addressRegion": "Zlínský kraj",
    "addressCountry": "CZ"
  },
  "areaServed": ["Zlín", "Otrokovice", "Uherské Hradiště", "Staré Město"],
  "telephone": "+420732169799",
  "priceRange": "$$",
  "knowsAbout": [
    "Elektroinstalace", "Smart Home", "KNX", "Loxone", 
    "FVE", "EV Wallbox", "Průmyslová automatizace", "Revize elektro"
  ]
}`}
            </pre>
          </div>

        </div>
      </section>
    </div>
  );
}
