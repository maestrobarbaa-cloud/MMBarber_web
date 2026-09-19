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
  Lock,
  Droplet, 
  Hammer, 
  Paintbrush
} from "lucide-react";
import Image from "@/components/OptimizedImage";
import Link from "next/link";
import CraftCalculator, { CraftType } from "@/components/crafts/CraftCalculator";
import { useTranslation } from "@/hooks/useTranslation";

type AppName = 'profile' | 'calc' | 'contact' | 'modules' | 'gallery' | 'tools' | null;

export default function RemeslaPage() {
  const { lang, switchLanguage } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [activeApp, setActiveApp] = useState<AppName>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
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
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [calcTotal, setCalcTotal] = useState(0);
  const [activeGlobalCraft, setActiveGlobalCraft] = useState<CraftType>("elektrika");

  

  
  // Theme map
  const themeColors: Record<CraftType, any> = {
    elektrika: { color: 'cyan', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]', name: 'Elektro', tailwindBg: 'bg-cyan-500', tailwindBorder: 'border-cyan-400' },
    voda: { color: 'teal', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]', name: 'Voda & Topení', tailwindBg: 'bg-teal-500', tailwindBorder: 'border-teal-400' },
    zednik: { color: 'amber', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]', name: 'Zednictví', tailwindBg: 'bg-amber-500', tailwindBorder: 'border-amber-400' },
    drevo: { color: 'green', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.5)]', name: 'Dřevo & Podlahy', tailwindBg: 'bg-green-500', tailwindBorder: 'border-green-400' },
    malir: { color: 'purple', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]', name: 'Malířství', tailwindBg: 'bg-purple-500', tailwindBorder: 'border-purple-400' }
  };
  const theme = themeColors[activeGlobalCraft];

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
          href="/rodina/remesla/admin"
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
            {theme.name} <span className={theme.text + " drop-shadow-md"}>TÝM</span>
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
                      <Image src="/logo.png" alt="Roman" width={220} height={220} className="w-full h-full object-contain filter brightness-150 contrast-125" />
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-4xl md:text-6xl font-heading font-black text-slate-100 uppercase tracking-tight mb-2 drop-shadow-lg">
                        MMBarber <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${theme.color}-400 to-${theme.color}-600`}>{theme.name}</span>
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
                  <CraftCalculator setGlobalTotal={setCalcTotal} activeCraft={activeGlobalCraft} />
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
                Tým MMBarber reprezentuje technologickou špičku v oboru pro rok 2026. Specializace zahrnuje kompletní 
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
  "name": "MMBarber Řemesla",
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

