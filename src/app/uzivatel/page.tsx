"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Home, Palette, Type, Zap, Sparkles, X, Check, Sliders, User, Shield, Volume2, VolumeX, Trophy, Activity, Moon, Sun, Ghost, Flame, Rocket, Star, Heart, Monitor, AlertTriangle, Camera, Wind, Skull, Flag, Diamond } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/utils/audio";
import { useGame } from "@/contexts/GameContext";

const FONTS = [
  { name: "Classic Noir", value: '"Courier New", Courier, monospace', preview: "Courier" },
  { name: "Modern Sans", value: 'var(--font-inter), sans-serif', preview: "Inter" },
  { name: "Elegant Serif", value: 'var(--font-playfair), serif', preview: "Playfair" },
  { name: "System", value: 'system-ui, sans-serif', preview: "System" }
];

const PRESETS = [
  {
    id: "noir",
    name: "Classic Noir",
    nameCs: "Klasický Noir",
    accentColor: "var(--color-mafia-gold)",
    glowIntensity: 50,
    fontFamily: '"Courier New", Courier, monospace',
    atmosphereOverride: 'classic',
    floatingItems: 'scissors',
    desc: "Tradiční styl MMBarber se zlatým tónem a létajícími nůžkami.",
    descEn: "Traditional MMBarber style with golden tones and flying scissors."
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    nameCs: "Kybernetická Záře",
    accentColor: "#00ccff",
    glowIntensity: 100,
    fontFamily: 'var(--font-inter), sans-serif',
    atmosphereOverride: 'galaxy',
    floatingItems: 'clippers',
    desc: "Moderní neonově modrý styl s vesmírnou atmosférou.",
    descEn: "Modern neon cyan theme featuring a deep cosmic atmosphere."
  },
  {
    id: "blood",
    name: "Blood Syndicate",
    nameCs: "Krvavý Syndikát",
    accentColor: "#ff1a1a",
    glowIntensity: 80,
    fontFamily: 'var(--font-playfair), serif',
    atmosphereOverride: 'classic',
    floatingItems: 'random',
    desc: "Dramatická rudá barva doprovázená elegantním patkovým písmem.",
    descEn: "Dramatic dark crimson red accompanied by elegant serif font."
  },
  {
    id: "stealth",
    name: "Stealth Agent",
    nameCs: "Tichý Agent",
    accentColor: "#a3a3a3",
    glowIntensity: 10,
    fontFamily: 'system-ui, sans-serif',
    atmosphereOverride: 'classic',
    floatingItems: 'off',
    desc: "Minimalistický design bez zářivých efektů a bez částic.",
    descEn: "Minimalist look with low intensity and no floating particles."
  }
];

const ATMOSPHERE_ITEMS = [
  { id: 'classic', label: 'Classic', icon: Shield },
  { id: 'winter', label: 'Winter', icon: Zap },
  { id: 'cny', label: 'C.N.Y.', icon: Flame },
  { id: 'valentine', label: 'Valentine', icon: Heart },
  { id: 'spring', label: 'Spring', icon: Sparkles },
  { id: 'easter', label: 'Easter', icon: Sparkles },
  { id: 'witches', label: 'Witches', icon: Flame },
  { id: 'may', label: 'May', icon: Heart },
  { id: 'sakura', label: 'Sakura', icon: Sparkles },
  { id: 'midsummer', label: 'Midsummer', icon: Sun },
  { id: 'summer', label: 'Summer', icon: Sun },
  { id: 'harvest', label: 'Harvest', icon: Activity },
  { id: 'halloween', label: 'Halloween', icon: Ghost },
  { id: 'allsouls', label: 'All Souls', icon: Moon },
  { id: 'christmas', label: 'Xmas', icon: Star },
  { id: 'silvestr', label: 'NYE', icon: Rocket },
  { id: 'galaxy', label: 'Galaxy', icon: Moon },
  { id: 'crt', label: 'CRT', icon: Monitor },
  { id: 'matrix', label: 'Matrix', icon: Monitor },
  { id: 'pixelate', label: 'Pixel', icon: Sparkles },
  { id: 'vintage', label: 'Vintage', icon: Camera },
  { id: 'noirblue', label: 'Cold', icon: Wind },
  { id: 'noirred', label: 'Hot', icon: Zap },
  { id: 'chaos', label: 'Chaos', icon: Ghost },
  { id: 'czech', label: 'CZECH', icon: Flag },
  { id: 'friday13', label: 'FRIDAY 13', icon: Skull },
  { id: 'secret', label: 'SECRET', icon: Diamond },
  { id: 'legacy', label: 'LEGACY', icon: Trophy }
];

const TABS = [
  { id: 'profile', label: 'Profil & Hra', labelEn: 'Profile & Game', icon: User },
  { id: 'aesthetics', label: 'Estetika', labelEn: 'Aesthetics', icon: Palette },
  { id: 'system', label: 'Systém', labelEn: 'System', icon: Sliders }
];

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function UserSettings() {
  const router = useRouter();
  const { lang, t } = useTranslation();
  const { totalCollected, isTomasUnlocked, isNellaUnlocked, mafiaRank, resetProgress } = useGame();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const defaultConfig = {
    accentColor: "var(--color-mafia-gold)",
    glowIntensity: 50,
    fontFamily: '"Courier New", Courier, monospace',
    atmosphereOverride: 'classic',
    floatingItems: 'scissors'
  };

  const [config, setConfig] = useState(defaultConfig);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mmbarber_user_config");
    if (saved) {
      try {
        setConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
    
    // Sync sound state
    setIsSoundEnabled(localStorage.getItem("mmbarber_sound_enabled") !== "false");
    
    // Also sync from the legacy overrides if they exist independently
    const savedAtmosphere = localStorage.getItem("mmbarber_atmosphere_override");
    if (savedAtmosphere) {
      setConfig(prev => ({...prev, atmosphereOverride: savedAtmosphere}));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("mmbarber_user_config", JSON.stringify(config));
    
    if (config.atmosphereOverride === 'classic') {
      localStorage.removeItem("mmbarber_atmosphere_override");
    } else {
      localStorage.setItem("mmbarber_atmosphere_override", config.atmosphereOverride);
    }
    localStorage.setItem("mmbarber_floating_item_override", config.floatingItems);

    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
    window.dispatchEvent(new CustomEvent('mmbarber-atmosphere-update', { detail: config.atmosphereOverride }));
    window.dispatchEvent(new CustomEvent('mmbarber-floaters-update', { detail: config.floatingItems }));

    playSound("/sounds/click.mp3", 0.3);

    // Success burst effect
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            addClickEffect(x, y, config.accentColor);
        }, i * 70);
    }
  };

  const handleReset = () => {
    if(!confirm(lang === 'cs' ? 'Opravdu chcete obnovit vizuál do základního nastavení?' : 'Reset visuals to default?')) return;
    
    setConfig(defaultConfig);
    localStorage.setItem("mmbarber_user_config", JSON.stringify(defaultConfig));
    localStorage.removeItem("mmbarber_atmosphere_override");
    localStorage.setItem("mmbarber_floating_item_override", "scissors");
    
    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
    window.dispatchEvent(new CustomEvent('mmbarber-atmosphere-update', { detail: 'classic' }));
    window.dispatchEvent(new CustomEvent('mmbarber-floaters-update', { detail: 'scissors' }));
    
    playSound("/sounds/click.mp3", 0.2);
  };

  const handleHardReset = () => {
    if(!confirm(lang === 'cs' ? 'VAROVÁNÍ: Tento krok vymaže veškerý váš postup hrou, rank a skryté úpravy. Opravdu to chcete udělat?' : 'WARNING: This will wipe all game progress, rank and settings. Are you sure?')) return;
    
    resetProgress();
    
    setConfig(defaultConfig);
    localStorage.setItem("mmbarber_user_config", JSON.stringify(defaultConfig));
    
    // Additional resets
    localStorage.removeItem("mmbarber_atmosphere_override");
    localStorage.removeItem("mmbarber_floating_item_override");
    localStorage.removeItem("mmbarber_visited");
    localStorage.removeItem("mmbarber_dev_mode");
    localStorage.removeItem("mmbarber_dev_visual_mode");
    localStorage.setItem("mmbarber_sound_enabled", "true");
    setIsSoundEnabled(true);
    
    // Force reload to completely clear memory
    window.location.href = "/";
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setConfig({
      accentColor: preset.accentColor,
      glowIntensity: preset.glowIntensity,
      fontFamily: preset.fontFamily,
      atmosphereOverride: preset.atmosphereOverride as any,
      floatingItems: preset.floatingItems as any
    });
    playSound("/sounds/click.mp3", 0.25);
  };

  const toggleSound = () => {
    const newVal = !isSoundEnabled;
    setIsSoundEnabled(newVal);
    localStorage.setItem("mmbarber_sound_enabled", String(newVal));
    if (newVal) playSound("/sounds/click.mp3", 0.3);
  };

  const addClickEffect = useCallback((x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setClickEffects(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== id));
    }, 1000);
  }, []);

  const handlePageClick = (e: React.MouseEvent) => {
    const color = config.accentColor.startsWith('var') ? '#c5a059' : config.accentColor;
    addClickEffect(e.clientX, e.clientY, color);
  };

  // Helper variables for UI
  const displayColor = config.accentColor.startsWith('var') ? '#c5a059' : config.accentColor;

  return (
    <main 
      onClick={handlePageClick}
      className="min-h-screen bg-mafia-black text-white pt-20 pb-20 px-4 md:px-8 font-sans relative overflow-x-hidden selection:bg-mafia-gold selection:text-mafia-black"
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          playSound("/sounds/click.mp3", 0.2);
          router.push("/");
        }}
        className="fixed top-6 right-6 md:top-20 md:left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 z-[100] group backdrop-blur-xl shadow-2xl hover:scale-110"
        style={{ hover: { borderColor: displayColor, color: displayColor } } as any}
      >
        <X size={20} className="transition-transform group-hover:rotate-90 duration-300" />
      </button>

      {/* Background Decorative */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000" style={{ backgroundColor: displayColor }}></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px] transition-colors duration-1000" style={{ backgroundColor: displayColor }}></div>
         <div className="absolute inset-0 bg-[url('/obr/pattern-carbon.png')] opacity-20"></div>
      </div>

      {/* Click Effects */}
      <AnimatePresence>
        {clickEffects.map(effect => (
          <motion.div
            key={effect.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed w-10 h-10 rounded-full border-2 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
            style={{ left: effect.x, top: effect.y, borderColor: effect.color, boxShadow: `0 0 20px ${effect.color}` }}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col min-h-[80vh]">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10 text-center"
        >
          <div className="relative mb-4">
            <Monitor size={48} className="opacity-80 transition-colors duration-700" style={{ color: displayColor, filter: `drop-shadow(0 0 15px ${displayColor}80)` }} />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black tracking-[0.2em] uppercase drop-shadow-2xl">
            {lang === 'cs' ? "OSOBNÍ TERMINÁL" : "PERSONAL TERMINAL"}
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            className="h-1 mt-4 transition-colors duration-700" 
            style={{ backgroundColor: displayColor, boxShadow: `0 0 20px ${displayColor}` }}
          ></motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 flex-grow">
          
          {/* LEFT SIDEBAR: Nav Tabs & Live Preview */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24 h-max">
            
            {/* Tabs */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 thin-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); playSound("/sounds/click.mp3", 0.1); }}
                  className={`flex items-center gap-3 px-5 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 min-w-[160px] lg:min-w-0 flex-shrink-0 border ${
                    activeTab === tab.id 
                      ? "bg-white/10 text-white shadow-lg" 
                      : "bg-black/30 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/10"
                  }`}
                  style={{ 
                    borderColor: activeTab === tab.id ? displayColor : '',
                    boxShadow: activeTab === tab.id ? `0 0 20px ${displayColor}30, inset 0 0 10px ${displayColor}10` : '' 
                  }}
                >
                  <tab.icon size={18} style={{ color: activeTab === tab.id ? displayColor : '' }} />
                  {lang === 'cs' ? tab.label : tab.labelEn}
                </button>
              ))}
            </div>

            {/* Live Preview Card */}
            <div className="hidden lg:block bg-black/60 border border-white/10 p-6 rounded-xl backdrop-blur-xl relative overflow-hidden shadow-2xl mt-4 group">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/20 uppercase tracking-widest z-10">Live Preview</div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500" style={{ borderColor: displayColor, boxShadow: `0 0 ${config.glowIntensity/3}px ${displayColor}`, backgroundColor: `${displayColor}10` }}>
                    <User size={18} style={{ color: displayColor }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg uppercase transition-colors" style={{ color: displayColor }}>MMBARBER</h3>
                    <p className="font-mono font-black text-[10px] text-mafia-gold/60 uppercase tracking-widest">Rank: {t.operatives.ranks[mafiaRank as keyof typeof t.operatives.ranks]}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '100%'] }} 
                      transition={{ duration: 3, repeat: Infinity }} 
                      className="h-full" 
                      style={{ backgroundColor: displayColor, boxShadow: `0 0 10px ${displayColor}` }}
                    ></motion.div>
                  </div>
                  <p className="text-[11px] italic leading-relaxed opacity-80" style={{ fontFamily: config.fontFamily }}>
                    &quot;Styl není jen o vzhledu. Je to tvoje brnění proti obyčejnosti.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                className="flex-grow py-3 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: displayColor, color: '#000', boxShadow: `0 0 ${config.glowIntensity/3}px ${displayColor}60` }}
              >
                <Save size={16} />
                {lang === 'cs' ? "Uložit Změny" : "Save Changes"}
              </button>
            </div>

          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PROFILE & GAME */}
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-black/40 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Shield size={100} />
                    </div>
                    
                    <h2 className="text-2xl font-heading font-black uppercase mb-6 flex items-center gap-3">
                      <Trophy style={{ color: displayColor }} />
                      {lang === 'cs' ? 'Váš Status' : 'Your Status'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Mafiánský Rank</p>
                        <p className="text-3xl font-black uppercase text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(45deg, #fff, ${displayColor})` }}>
                          {t.operatives.ranks[mafiaRank as keyof typeof t.operatives.ranks]}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono">{lang === 'cs' ? 'Nasbírané Cennosti' : 'Items Collected'}</p>
                        <p className="text-3xl font-black font-mono">
                          {totalCollected} <span className="text-sm text-white/30 ml-2">/ ∞</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono mb-4">{lang === 'cs' ? 'Odemčení Agenti (Bookable)' : 'Unlocked Agents'}</p>
                      <div className="flex gap-4">
                        <div className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${isTomasUnlocked ? 'bg-white/5 border-white/20' : 'bg-black/50 border-white/5 opacity-50 grayscale'}`}>
                          <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20" style={{ backgroundImage: "url('/obr/tomasmicka.png')" }}></div>
                          <div>
                            <p className="font-bold text-sm">Tomáš</p>
                            <p className="text-[9px] text-white/50 uppercase tracking-widest">{isTomasUnlocked ? 'Unlocked' : 'Locked'}</p>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${isNellaUnlocked ? 'bg-white/5 border-white/20' : 'bg-black/50 border-white/5 opacity-50 grayscale'}`}>
                          <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20" style={{ backgroundImage: "url('/obr/nellapelikanova.png')" }}></div>
                          <div>
                            <p className="font-bold text-sm">Nella</p>
                            <p className="text-[9px] text-white/50 uppercase tracking-widest">{isNellaUnlocked ? 'Unlocked' : 'Locked'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AESTHETICS */}
              {activeTab === 'aesthetics' && (
                <motion.div 
                  key="aesthetics"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Colors & Typography */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                      <h3 className="font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                        <Palette size={14} style={{ color: displayColor }} /> {lang === 'cs' ? 'Barva & Záře' : 'Color & Glow'}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <input 
                          type="color" 
                          value={displayColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="w-12 h-12 bg-transparent cursor-pointer rounded-full border-2 border-white/10 p-0 overflow-hidden"
                        />
                        <div className="flex-grow">
                          <input 
                            type="text" 
                            value={config.accentColor}
                            onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-xs font-mono outline-none focus:border-white/30"
                            style={{ color: displayColor }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-mono uppercase text-white/50">
                          <span>Intensity</span>
                          <span style={{ color: displayColor }}>{config.glowIntensity}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="150" 
                          value={config.glowIntensity}
                          onChange={(e) => setConfig({ ...config, glowIntensity: parseInt(e.target.value) })}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          style={{ '--user-accent': displayColor } as any}
                        />
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                      <h3 className="font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                        <Type size={14} style={{ color: displayColor }} /> {lang === 'cs' ? 'Typografie' : 'Typography'}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {FONTS.map(f => (
                          <button
                            key={f.name}
                            onClick={(e) => { e.stopPropagation(); setConfig({ ...config, fontFamily: f.value }); playSound("/sounds/click.mp3", 0.1); }}
                            className={`p-3 border rounded-lg text-left transition-all ${
                              config.fontFamily === f.value ? 'bg-white/10 border-white/30' : 'bg-transparent border-white/5 hover:border-white/15'
                            }`}
                            style={{ fontFamily: f.value, borderColor: config.fontFamily === f.value ? displayColor : '' }}
                          >
                            <div className="text-[9px] uppercase font-black tracking-widest mb-1 opacity-50">{f.name}</div>
                            <div className="text-lg">{f.preview}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Atmospheres */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                    <h3 className="font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                      <Sparkles size={14} style={{ color: displayColor }} /> {lang === 'cs' ? 'Atmosféra (Pozadí)' : 'Atmosphere (Background)'}
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {ATMOSPHERE_ITEMS.map(item => (
                        <button
                          key={item.id}
                          onClick={(e) => { e.stopPropagation(); setConfig({...config, atmosphereOverride: item.id}); playSound("/sounds/click.mp3", 0.1); }}
                          className={`flex flex-col items-center justify-center p-3 gap-2 border rounded-lg transition-all ${
                            config.atmosphereOverride === item.id ? 'bg-white/10 border-white/40 shadow-lg' : 'bg-transparent border-white/5 hover:bg-white/5'
                          }`}
                          style={{ borderColor: config.atmosphereOverride === item.id ? displayColor : '' }}
                        >
                          <item.icon size={16} style={{ color: config.atmosphereOverride === item.id ? displayColor : '#ffffff50' }} />
                          <span className="text-[8px] font-black uppercase tracking-wider text-center">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                    <h3 className="font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                      <Zap size={14} style={{ color: displayColor }} /> {lang === 'cs' ? 'Rychlé Styly' : 'Quick Presets'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={(e) => { e.stopPropagation(); applyPreset(preset); }}
                          className="p-3 border border-white/5 rounded-lg text-left hover:bg-white/5 transition-all group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accentColor.startsWith('var') ? '#c5a059' : preset.accentColor }}></div>
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-wider">{lang === 'cs' ? preset.nameCs : preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SYSTEM */}
              {activeTab === 'system' && (
                <motion.div 
                  key="system"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-black/40 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-xl">
                    <h2 className="text-2xl font-heading font-black uppercase mb-8 flex items-center gap-3">
                      <Sliders style={{ color: displayColor }} />
                      {lang === 'cs' ? 'Systémová Nastavení' : 'System Settings'}
                    </h2>

                    <div className="space-y-6">
                      {/* Audio Toggle */}
                      <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-black/50">
                        <div>
                          <p className="font-bold text-sm uppercase tracking-wider">{lang === 'cs' ? 'Globální Zvuky' : 'Global Audio'}</p>
                          <p className="text-[10px] text-white/50">{lang === 'cs' ? 'Zvukové efekty tlačítek a animací' : 'Sound effects for buttons and animations'}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSound(); }}
                          className={`p-4 rounded-full transition-all ${isSoundEnabled ? 'bg-white/10 text-white' : 'bg-black/80 text-white/30 border border-white/10'}`}
                          style={{ color: isSoundEnabled ? displayColor : '', borderColor: isSoundEnabled ? displayColor : '' }}
                        >
                          {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                      </div>

                      {/* Floating Items */}
                      <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-black/50">
                        <div>
                          <p className="font-bold text-sm uppercase tracking-wider">{lang === 'cs' ? 'Částice a Nůžky' : 'Floating Particles'}</p>
                          <p className="text-[10px] text-white/50">{lang === 'cs' ? 'Létající nástroje na pozadí' : 'Background flying tools'}</p>
                        </div>
                        <select 
                          value={config.floatingItems}
                          onChange={(e) => setConfig({...config, floatingItems: e.target.value})}
                          className="bg-black border border-white/20 rounded p-2 text-xs font-mono outline-none"
                        >
                          <option value="scissors">Scissors</option>
                          <option value="clippers">Clippers</option>
                          <option value="random">Random</option>
                          <option value="off">Off</option>
                        </select>
                      </div>

                      {/* Hard Reset */}
                      <div className="mt-12 p-5 border border-mafia-red/30 rounded-lg bg-mafia-red/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <AlertTriangle size={32} className="text-mafia-red shrink-0" />
                          <div>
                            <p className="font-bold text-mafia-red text-sm uppercase tracking-wider">{lang === 'cs' ? 'Vymazat Paměť (Hard Reset)' : 'Wipe Memory (Hard Reset)'}</p>
                            <p className="text-[10px] text-mafia-red/70">{lang === 'cs' ? 'Kompletně smaže váš herní postup, rank a veškerá nastavení. Tuto akci nelze vrátit.' : 'Completely deletes game progress, rank and settings. This cannot be undone.'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleHardReset(); }}
                          className="shrink-0 px-6 py-3 bg-mafia-red/20 text-mafia-red border border-mafia-red/50 font-black text-[10px] uppercase tracking-widest rounded hover:bg-mafia-red hover:text-white transition-all"
                        >
                          {lang === 'cs' ? 'Smazat Vše' : 'Wipe Data'}
                        </button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: var(--user-accent, var(--color-mafia-gold));
          cursor: pointer;
          box-shadow: 0 0 10px var(--user-accent, var(--color-mafia-gold));
          border: 2px solid white;
          margin-top: -7px;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 3px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1.5px;
        }
        .thin-scrollbar::-webkit-scrollbar { height: 4px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
      `}</style>
    </main>
  );
}
