"use client";

import { useEffect, useState } from "react";
import { 
  Sun, 
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

type WeatherState = 'clear' | 'rain' | 'snow' | 'thunderstorm' | 'live';

export function VipControlBar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);
  const [weatherOverride, setWeatherOverride] = useState<WeatherState>('live');
  const [isGameEnabled, setIsGameEnabled] = useState(false);
  const [floatingItemOverride, setFloatingItemOverride] = useState<string>('random');
  const [accentColor, setAccentColor] = useState<string>('gold');
  const [visualMode, setVisualMode] = useState<string>('normal');

  useEffect(() => {
    // Check dev mode visibility
    const devMode = localStorage.getItem("mmbarber_dev_mode") === "true";
    setIsVisible(devMode);

    const handleDevToggle = () => {
      setIsVisible(localStorage.getItem("mmbarber_dev_mode") === "true");
    };
    window.addEventListener("mmbarber-dev-mode-toggle", handleDevToggle);

    // Initial load from localStorage / actual class applied
    setIsNoirMode(document.documentElement.classList.contains("noir-mode"));
    const savedWeather = (localStorage.getItem("mmbarber_dev_weather_override") || 'live') as WeatherState;
    setWeatherOverride(savedWeather);
    setIsGameEnabled(localStorage.getItem("mmbarber_game_enabled") === "true");
    setFloatingItemOverride(localStorage.getItem("mmbarber_floating_item_override") || 'random');
    
    // Handle accent color
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
    
    const savedMode = localStorage.getItem("mmbarber_dev_visual_mode") || 'normal';
    setVisualMode(savedMode);
    if (savedMode !== 'normal') applyModeClass(savedMode);

    const onModeUpdate = () => {
      const m = localStorage.getItem("mmbarber_dev_visual_mode") || 'normal';
      setVisualMode(m);
      applyModeClass(m);
    };
    
    const onAccentUpdate = async () => {
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

    const onGameUpdate = () => setIsGameEnabled(localStorage.getItem("mmbarber_game_enabled") === "true");
    const onNoirUpdate = () => setIsNoirMode(document.documentElement.classList.contains("noir-mode"));

    window.addEventListener("mmbarber-mode-update", onModeUpdate);
    window.addEventListener("mmbarber-accent-update", onAccentUpdate);
    window.addEventListener("mmbarber-game-update", onGameUpdate);
    window.addEventListener("mmbarber-dev-mode-toggle", onNoirUpdate);

    return () => {
      window.removeEventListener("mmbarber-dev-mode-toggle", handleDevToggle);
      window.removeEventListener("mmbarber-mode-update", onModeUpdate);
      window.removeEventListener("mmbarber-accent-update", onAccentUpdate);
      window.removeEventListener("mmbarber-game-update", onGameUpdate);
      window.removeEventListener("mmbarber-dev-mode-toggle", onNoirUpdate);
    };
  }, []);

  const toggleNoirMode = () => {
    const newVal = !isNoirMode;
    setIsNoirMode(newVal);
    localStorage.setItem("mmbarber_noir_mode", String(newVal));
    if (newVal) document.documentElement.classList.add("noir-mode");
    else document.documentElement.classList.remove("noir-mode");
    window.dispatchEvent(new Event("mmbarber-dev-mode-toggle"));
  };

  const setWeather = (mode: WeatherState) => {
    setWeatherOverride(mode);
    localStorage.setItem("mmbarber_dev_weather_override", mode);
    window.dispatchEvent(new Event('mmbarber-weather-update'));
  };

  const toggleGame = () => {
    const newVal = !isGameEnabled;
    setIsGameEnabled(newVal);
    localStorage.setItem("mmbarber_game_enabled", String(newVal));
    window.dispatchEvent(new Event('mmbarber-game-update'));
  };

  const setFloatingItem = (itemType: string) => {
    setFloatingItemOverride(itemType);
    localStorage.setItem("mmbarber_floating_item_override", itemType);
    window.dispatchEvent(new Event('mmbarber-floaters-update'));
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
        document.documentElement.classList.remove("noir-mode");
      }
      
      // If user forces silver or blood, turn ON noir mode (grayscale)
      if (color === 'silver' || color === 'blood') {
        setIsNoirMode(true);
        localStorage.setItem("mmbarber_noir_mode", "true");
        document.documentElement.classList.add("noir-mode");
      }
    }
    window.dispatchEvent(new Event('mmbarber-accent-update'));
    window.dispatchEvent(new Event('mmbarber-theme-update'));
  };

  const applyThemeClass = (color: string) => {
    const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
    themeClasses.forEach(c => document.documentElement.classList.remove(c));
    if (color !== 'gold') document.documentElement.classList.add(`theme-${color}`);
  };

  const updateVisualMode = (mode: string) => {
    setVisualMode(mode);
    localStorage.setItem("mmbarber_dev_visual_mode", mode);
    applyModeClass(mode);
    window.dispatchEvent(new Event('mmbarber-mode-update'));
  };

  const applyModeClass = (mode: string) => {
    const classes = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
    classes.forEach(c => document.documentElement.classList.remove(c));
    if (mode !== 'normal') document.documentElement.classList.add(`mode-${mode}`);
  };

  if (!isVisible) return null;

  const visualModeItems: { id: string; icon: React.ElementType; label: string }[] = [
    { id: 'normal', icon: Scissors, label: 'Normal' },
    { id: 'crt', icon: Monitor, label: 'CRT' },
    { id: 'matrix', icon: Monitor, label: 'Matrix' },
    { id: 'pixelate', icon: Contrast, label: 'Pixel' },
    { id: 'vintage', icon: Camera, label: 'Vintage' },
    { id: 'noirblue', icon: Wind, label: 'Cold' },
    { id: 'noirred', icon: Zap, label: 'Hot' },
    { id: 'chaos', icon: Ghost, label: 'Chaos' },
    { id: 'valentine', icon: Heart, label: 'LOVE' },
    { id: 'halloween', icon: Ghost, label: 'FEST' },
    { id: 'christmas', icon: Gift, label: 'XMAS' },
    { id: 'newyear', icon: Rocket, label: 'NYE' },
    { id: 'czech', icon: Flag, label: 'CZECH' },
    { id: 'friday13', icon: Skull, label: 'FRIDAY 13' },
    { id: 'secret', icon: Diamond, label: 'SECRET' },
    { id: 'legacy', icon: Trophy, label: 'LEGACY' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-col items-start gap-2">
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
                    setIsVisible(false);
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
                  { id: 'gold', color: '#c5a059', label: 'Gold' },
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
              <div className="grid grid-cols-5 gap-1">
                {[
                  { id: 'live', icon: Monitor },
                  { id: 'clear', icon: Sun },
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

            {/* Visual Modes Grid (Now with all modes) */}
            <div className="space-y-2 pt-2 border-t border-mafia-gold/10">
              <span className="text-[10px] font-bold text-mafia-gold/60 uppercase tracking-widest">{t.devPanel.filters}</span>
              <div className="grid grid-cols-4 gap-1">
                {visualModeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateVisualMode(item.id)}
                    className={`px-1 py-2 flex flex-col items-center justify-center gap-1 border transition-all ${
                       visualMode === item.id ? "bg-mafia-gold text-black border-mafia-gold" : "bg-mafia-dark text-mafia-gold/40 border-mafia-gold/10"
                    }`}
                  >
                    {item.icon && <item.icon size={10} />}
                    <span className="text-[7px] font-mono font-black uppercase leading-tight truncate w-full text-center">{item.label}</span>
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
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
          isOpen ? "bg-mafia-gold text-black border-mafia-gold rotate-180 shadow-[0_0_20px_rgba(197,160,89,0.4)]" : "bg-mafia-black/80 text-mafia-gold border-mafia-gold/30 hover:border-mafia-gold"
        }`}
      >
        {isOpen ? <ChevronUp size={24} /> : <Settings size={22} className="animate-spin-slow" />}
      </button>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .thin-scrollbar::-webkit-scrollbar { width: 4px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(197, 160, 89, 0.3); }
      `}</style>
    </div>
  );
}
