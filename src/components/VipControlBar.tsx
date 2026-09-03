"use client";

import { useEffect, useState } from "react";
import { 
  Sun, 
  Cloud,
  CloudRain, 
  Snowflake, 
  CloudLightning, 
  Monitor, 
  Contrast,
  Settings,
  ChevronUp,
  Scissors,
  Heart,
  Ghost,
  Gift,
  Rocket,
  Flag,
  Diamond,
  X,
  Zap,
  Camera,
  Wind,
  Trophy,
  Skull
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { isDaytime } from "../lib/weather";
import { useUI } from "@/contexts/UIContext";

type WeatherState = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'live';

export function VipControlBar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isDevMode, setIsDevMode,
    isNoirMode, setIsNoirMode,
    weatherOverride, setWeatherOverride,
    isGameEnabled, setIsGameEnabled,
    floatingItemOverride, setFloatingItemOverride,
    atmosphereOverride, setAtmosphereOverride,
    accentColor, setAccentColor
  } = useUI();


  useEffect(() => {
    // Initial load from localStorage (most already handled by UIContext, but we ensure Accent Color syncs here since it controls DOM classes directly within VipControlBar)
    const initAccentColor = async () => {
      const savedColor = localStorage.getItem("mmbarber_dev_accent_color");
      if (savedColor) {
        setAccentColor(savedColor);
        applyThemeClass(savedColor);
      } else {
        setAccentColor('live');
        const day = await isDaytime();
        applyThemeClass(day ? 'gold' : 'silver');
      }
    };
    initAccentColor();

  }, []);

  const toggleNoirMode = () => {
    const newVal = !isNoirMode;
    setIsNoirMode(newVal);
    localStorage.setItem("mmbarber_noir_mode", String(newVal));
  };

  const setWeather = (mode: WeatherState) => {
    setWeatherOverride(mode);
    localStorage.setItem("mmbarber_dev_weather_override", mode);
  };

  const setAtmosphere = (mode: string) => {
    setAtmosphereOverride(mode);
    if (mode === 'classic') {
      localStorage.removeItem("mmbarber_atmosphere_override");
    } else {
      localStorage.setItem("mmbarber_atmosphere_override", mode);
    }
  };

  const toggleGame = () => {
    const newVal = !isGameEnabled;
    setIsGameEnabled(newVal);
    localStorage.setItem("mmbarber_game_enabled", String(newVal));
  };

  const setFloatingItem = (itemType: string) => {
    setFloatingItemOverride(itemType);
    localStorage.setItem("mmbarber_floating_item_override", itemType);
  };

  const updateAccentColor = async (color: string) => {
    setAccentColor(color);
    if (color === 'live') {
      localStorage.removeItem("mmbarber_dev_accent_color");
      const day = await isDaytime();
      const hour = new Date().getHours();
      const isBloodTime = hour >= 3 && hour < 6;
      const isNight = hour >= 19 || hour < 6;
      
      applyThemeClass(isBloodTime ? 'blood' : (day ? 'gold' : 'silver'));
      
      // Sync noir mode with night time in LIVE
      if (isNight) {
        setIsNoirMode(true);
        localStorage.setItem("mmbarber_noir_mode", "true");
        document.documentElement.classList.add("noir-mode");
      } else {
        setIsNoirMode(false);
        localStorage.setItem("mmbarber_noir_mode", "false");
        document.documentElement.classList.remove("noir-mode");
      }
    } else {
      localStorage.setItem("mmbarber_dev_accent_color", color);
      applyThemeClass(color);
      
      // If user forces gold, turn off noir mode (grayscale) so they see the color
      if (color === 'gold') {
        setIsNoirMode(false);
        localStorage.setItem("mmbarber_noir_mode", "false");
      }
      
      // If user forces silver or blood, turn ON noir mode (grayscale)
      if (color === 'silver' || color === 'blood') {
        setIsNoirMode(true);
        localStorage.setItem("mmbarber_noir_mode", "true");
      }
    }
  };

  const applyThemeClass = (color: string) => {
    const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
    themeClasses.forEach(c => document.documentElement.classList.remove(c));
    if (color !== 'gold') document.documentElement.classList.add(`theme-${color}`);
  };

  if (!isDevMode) return null;



  const atmosphereItems = [
    { id: 'classic', label: 'Classic' },
    { id: 'winter', label: 'Winter' },
    { id: 'cny', label: 'C.N.Y.' },
    { id: 'valentine', label: 'Valentine' },
    { id: 'spring', label: 'Spring' },
    { id: 'easter', label: 'Easter' },
    { id: 'witches', label: 'Witches' },
    { id: 'may', label: 'May' },
    { id: 'sakura', label: 'Sakura' },
    { id: 'midsummer', label: 'Midsummer' },
    { id: 'summer', label: 'Summer' },
    { id: 'harvest', label: 'Harvest' },
    { id: 'halloween', label: 'Halloween' },
    { id: 'allsouls', label: 'All Souls' },
    { id: 'christmas', label: 'Xmas' },
    { id: 'silvestr', label: 'NYE' },
    { id: 'galaxy', label: 'Galaxy' },
    { id: 'crt', label: 'CRT' },
    { id: 'matrix', label: 'Matrix' },
    { id: 'pixelate', label: 'Pixel' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'noirblue', label: 'Cold' },
    { id: 'noirred', label: 'Hot' },
    { id: 'chaos', label: 'Chaos' },
    { id: 'czech', label: 'CZECH' },
    { id: 'friday13', label: 'FRIDAY 13' },
    { id: 'secret', label: 'SECRET' },
    { id: 'legacy', label: 'LEGACY' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-mafia-black/95 backdrop-blur-xl border border-mafia-gold/30 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-4 min-w-[280px] max-h-[85vh] overflow-y-auto thin-scrollbar"
          >
            <div className="flex flex-col gap-1 mb-2 border-b border-mafia-gold/10 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-mafia-gold font-mono text-[10px] font-black uppercase tracking-[0.2em]">
                  {t.devPanel.title}
                </span>
                <button 
                  onClick={() => {
                    localStorage.setItem("mmbarber_dev_mode", "false");
                    setIsDevMode(false);
                  }}
                  className="text-mafia-red hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-mafia-gold/60 uppercase tracking-widest">{t.devPanel.accent}</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'gold', color: 'var(--color-mafia-gold)', label: 'Gold' },
                  { id: 'silver', color: '#e2e2e2', label: 'Silver' },
                  { id: 'blood', color: '#8b0000', label: 'Blood' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateAccentColor(item.id)}
                    className={`h-8 w-full border transition-all flex items-center justify-center ${
                      accentColor === item.id ? "border-white scale-105 z-10" : "border-transparent opacity-60"
                    }`}
                    style={{ backgroundColor: item.color }}
                  >
                    <span className={`text-[8px] font-black uppercase ${item.id === 'blood' ? 'text-white' : 'text-black'}`}>{item.label}</span>
                  </button>
                ))}
                <button onClick={() => updateAccentColor('live')} className={`h-8 col-span-3 flex items-center justify-center gap-2 border ${accentColor === 'live' ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-black border-mafia-gold/20 text-mafia-gold/40"}`}>
                  <Monitor size={12} /><span className="text-[9px] font-black uppercase">LIVE (AUTO)</span>
                </button>
              </div>
            </div>

            {/* Weather Selection */}
            <div className="space-y-2 pt-2 border-t border-mafia-gold/10">
              <span className="text-[10px] font-bold text-mafia-gold/60 uppercase tracking-widest">{t.devPanel.atmosphere}</span>
              <div className="grid grid-cols-6 gap-1">
                {[
                  { id: 'live', icon: Monitor },
                  { id: 'clear', icon: Sun },
                  { id: 'clouds', icon: Cloud },
                  { id: 'rain', icon: CloudRain },
                  { id: 'snow', icon: Snowflake },
                  { id: 'thunderstorm', icon: CloudLightning }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWeather(item.id as WeatherState)}
                    className={`p-2 flex flex-col items-center border transition-all ${
                      weatherOverride === item.id ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-black text-mafia-gold/40 border-mafia-gold/10"
                    }`}
                  >
                    <item.icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Atmosphere Override */}
            <div className="space-y-2 pt-2 border-t border-mafia-gold/10">
              <span className="text-[10px] font-bold text-mafia-gold/60 uppercase tracking-widest">Atmosphere</span>
              <div className="grid grid-cols-4 gap-1">
                {atmosphereItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAtmosphere(item.id)}
                    className={`py-2 px-1 border text-[7.5px] font-black uppercase transition-all truncate text-center ${
                      (!localStorage.getItem("mmbarber_atmosphere_override") && item.id === 'classic') || atmosphereOverride === item.id 
                        ? "bg-mafia-gold text-black border-mafia-gold" 
                        : "bg-mafia-black text-mafia-gold/40 border-mafia-gold/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Items Override */}
            <div className="space-y-2 pt-2 border-t border-mafia-gold/10">
              <span className="text-[10px] font-bold text-mafia-gold/60 uppercase tracking-widest">{t.devPanel.tools}</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'scissors', label: 'Scissors' },
                  { id: 'clipper', label: 'Clippers' },
                  { id: 'random', label: 'Mix' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFloatingItem(item.id)}
                    className={`py-2 border text-[8px] font-black uppercase transition-all ${
                      floatingItemOverride === item.id ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-black text-mafia-gold/40 border-mafia-gold/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>



            {/* General Toggles */}
            <div className="space-y-2 pt-2 border-t border-mafia-gold/10">
              <button onClick={toggleNoirMode} className={`w-full flex items-center gap-2 px-3 py-2 border transition-all ${isNoirMode ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-dark text-mafia-gold/40 border-mafia-gold/10"}`}>
                <Contrast size={14} /><span className="text-[9px] font-black uppercase tracking-tighter">Noir Mode</span>
              </button>

              <button onClick={toggleGame} className={`w-full flex items-center gap-2 px-3 py-2 border transition-all ${isGameEnabled ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-dark text-mafia-gold/40 border-mafia-gold/10"}`}>
                <Scissors size={14} /><span className="text-[9px] font-black uppercase tracking-tighter">{t.devPanel.game}</span>
              </button>

              <button 
                onClick={() => {
                  localStorage.removeItem("mmbarber_visited");
                  window.dispatchEvent(new Event("mmbarber-trigger-intro"));
                  setIsOpen(false);
                }} 
                className="w-full flex items-center gap-2 px-3 py-2 border border-mafia-gold/30 bg-mafia-black/60 text-mafia-gold hover:bg-mafia-gold/10 transition-all"
              >
                <Monitor size={14} /><span className="text-[9px] font-black uppercase tracking-tighter">Test Welcome Menu</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
          isOpen ? "bg-mafia-gold text-black border-mafia-gold rotate-180 shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.4)]" : "bg-mafia-black/80 text-mafia-gold border-mafia-gold/30 hover:border-mafia-gold"
        }`}
      >
        {isOpen ? <ChevronUp size={24} /> : <Settings size={22} className="animate-spin-slow" />}
      </button>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .thin-scrollbar::-webkit-scrollbar { width: 4px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--color-mafia-gold-rgb), 0.3); }
      `}</style>
    </div>
  );
}
