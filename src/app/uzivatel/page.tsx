"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Home, Palette, Type, Zap, Sparkles, MousePointer2, X, Check, Sliders } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/utils/audio";

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
    atmosphereOverride: 'auto',
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
    desc: "Moderní neonově modrý styl s vesmírnou atmosférou na pozadí.",
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
    floatingItems: 'scissors',
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
    desc: "Minimalistický design bez zářivých efektů a s vypnutým pozadím.",
    descEn: "Minimalist look with low intensity and no floating particles."
  }
];

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function UserSettings() {
  const router = useRouter();
  const { lang } = useTranslation();
  
  const defaultConfig = {
    accentColor: "var(--color-mafia-gold)",
    glowIntensity: 50,
    fontFamily: '"Courier New", Courier, monospace',
    atmosphereOverride: 'auto',
    floatingItems: 'scissors'
  };

  const [config, setConfig] = useState(defaultConfig);
  const isCustomActive = config.accentColor !== defaultConfig.accentColor || 
                        config.glowIntensity !== defaultConfig.glowIntensity || 
                        config.fontFamily !== defaultConfig.fontFamily;

  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mmbarber_user_config");
    if (saved) {
      try {
        setConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("mmbarber_user_config", JSON.stringify(config));
    
    // Sync with legacy storage and graphics config
    localStorage.setItem("mmbarber_atmosphere_override", config.atmosphereOverride);
    localStorage.setItem("mmbarber_floating_item_override", config.floatingItems);
    
    const graphicsSaved = localStorage.getItem("mmbarber_graphics_config");
    if (graphicsSaved) {
      try {
        const parsed = JSON.parse(graphicsSaved);
        parsed.atmosphereOverride = config.atmosphereOverride;
        parsed.floatingItems = config.floatingItems;
        localStorage.setItem("mmbarber_graphics_config", JSON.stringify(parsed));
      } catch (e) {}
    }

    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
    window.dispatchEvent(new CustomEvent('mmbarber-atmosphere-update', { detail: config.atmosphereOverride }));
    window.dispatchEvent(new CustomEvent('mmbarber-floaters-update', { detail: config.floatingItems }));

    playSound("/sounds/click.mp3", 0.3);

    // Create a special success burst effect
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            addClickEffect(x, y, config.accentColor);
        }, i * 70);
    }
  };

  const handleReset = () => {
    const default_ = {
      accentColor: "var(--color-mafia-gold)",
      glowIntensity: 50,
      fontFamily: '"Courier New", Courier, monospace',
      atmosphereOverride: 'auto' as const,
      floatingItems: 'scissors' as const
    };
    setConfig(default_);
    localStorage.setItem("mmbarber_user_config", JSON.stringify(default_));
    localStorage.setItem("mmbarber_atmosphere_override", "auto");
    localStorage.setItem("mmbarber_floating_item_override", "scissors");
    
    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
    window.dispatchEvent(new CustomEvent('mmbarber-atmosphere-update', { detail: 'auto' }));
    window.dispatchEvent(new CustomEvent('mmbarber-floaters-update', { detail: 'scissors' }));
    
    playSound("/sounds/click.mp3", 0.2);
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

  const addClickEffect = useCallback((x: number, y: number, color: string) => {
    const id = Date.now() + Math.random();
    setClickEffects(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(e => e.id !== id));
    }, 1000);
  }, []);

  const handlePageClick = (e: React.MouseEvent) => {
    addClickEffect(e.clientX, e.clientY, config.accentColor);
  };

  return (
    <main 
      onClick={handlePageClick}
      className="min-h-screen bg-mafia-black text-white pt-24 pb-20 px-4 md:px-8 font-sans relative overflow-hidden selection:bg-mafia-gold selection:text-mafia-black"
    >
      {/* Floating Close Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          playSound("/sounds/click.mp3", 0.2);
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="fixed top-6 right-6 md:top-24 md:left-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-mafia-gold hover:border-mafia-gold transition-all duration-300 z-[100] group"
        aria-label="Zavřít"
      >
        <X size={20} className="transition-transform group-hover:rotate-90 duration-300" />
      </button>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: config.accentColor }}></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px]" style={{ backgroundColor: config.accentColor }}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      {/* Click Effects Layer */}
      <AnimatePresence>
        {clickEffects.map(effect => (
          <motion.div
            key={effect.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed w-10 h-10 rounded-full border-2 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
            style={{ left: effect.x, top: effect.y, borderColor: effect.color, boxShadow: `0 0 20px ${effect.color}` }}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10 text-center"
        >
          <div className="relative mb-4">
            <Palette 
              className={`transition-all duration-700 ${isCustomActive ? 'animate-pulse' : 'opacity-30'}`} 
              size={56} 
              style={{ 
                color: isCustomActive ? config.accentColor : '#ffffff', 
                filter: isCustomActive ? `drop-shadow(0 0 15px ${config.accentColor})` : 'none' 
              }} 
            />
            {isCustomActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-12 px-2 py-0.5 bg-mafia-gold text-mafia-black text-[8px] font-black rounded uppercase tracking-widest"
                style={{ backgroundColor: config.accentColor }}
              >
                Active
              </motion.div>
            )}
            <Sparkles className={`absolute -top-2 -right-2 text-white/50 transition-opacity duration-700 ${isCustomActive ? 'opacity-100 animate-bounce' : 'opacity-0'}`} size={20} />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-[0.2em] uppercase drop-shadow-2xl">
            {lang === 'cs' ? "VLASTNÍ VZHLED" : "CUSTOM LOOK"}
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            className="h-1 mt-4" 
            style={{ backgroundColor: config.accentColor, boxShadow: `0 0 20px ${config.accentColor}` }}
          ></motion.div>
          <p className="mt-3 text-white/40 font-mono text-[9px] uppercase tracking-[0.4em]">Personalized Aesthetic Protocol v2.5</p>
        </motion.div>

        {/* Master Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR (lg:col-span-4): Sticky Live Preview & Action Deck */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6 lg:sticky lg:top-24"
          >
            {/* Live Preview Card */}
            <div className="bg-mafia-black/80 border border-white/10 p-6 backdrop-blur-xl relative group overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">Live Preview</div>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500" style={{ borderColor: config.accentColor, boxShadow: `0 0 ${config.glowIntensity/3}px ${config.accentColor}`, backgroundColor: `${config.accentColor}10` }}>
                    <MousePointer2 size={18} style={{ color: config.accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg uppercase transition-colors" style={{ color: config.accentColor }}>MMBARBER</h3>
                    <p className="text-[9px] opacity-45 uppercase tracking-widest">Est. 2024</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '100%'] }} 
                      transition={{ duration: 3, repeat: Infinity }} 
                      className="h-full" 
                      style={{ backgroundColor: config.accentColor }}
                    ></motion.div>
                  </div>
                  <p className="text-[11px] italic leading-relaxed opacity-80" style={{ fontFamily: config.fontFamily }}>
                    &quot;Když se podíváš do zrcadla, měl bys vidět muže, který má svůj osud pod kontrolou. Styl je tvoje brnění.&quot;
                  </p>
                </div>
                
                <button className="w-full py-2.5 border font-black text-[10px] uppercase tracking-widest transition-all" style={{ borderColor: config.accentColor, color: config.accentColor, boxShadow: `0 0 ${config.glowIntensity/5}px ${config.accentColor}` }}>
                  {lang === 'cs' ? 'Rezervovat Termín' : 'Book Appointment'}
                </button>
              </div>
            </div>

            {/* HIGH-TECH ACTION DECK - User Friendly placement */}
            <div className="bg-mafia-dark/80 border border-white/10 p-5 backdrop-blur-xl space-y-4 shadow-2xl">
              <button 
                onClick={handleSave}
                className="w-full bg-mafia-gold text-mafia-black py-4 font-heading font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg group"
                style={{ backgroundColor: config.accentColor, boxShadow: `0 8px 24px ${config.accentColor}30` }}
              >
                <Save size={18} className="group-hover:rotate-12 transition-transform" />
                {lang === 'cs' ? "ULOŽIT ARCHIV" : "SAVE CONFIG"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleReset}
                  className="py-3.5 border border-white/10 text-white/40 hover:border-mafia-red hover:text-mafia-red active:scale-95 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider group"
                  title="Reset to defaults"
                >
                  <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                  {lang === 'cs' ? "RESET" : "RESET"}
                </button>
                
                <button 
                  onClick={() => router.push("/")}
                  className="py-3.5 bg-white/5 border border-transparent text-white/40 hover:bg-white/10 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider"
                >
                  <Home size={14} />
                  {lang === 'cs' ? "DOMŮ" : "HOME"}
                </button>
              </div>
            </div>

            {/* Caution Alert */}
            <div className="bg-mafia-red/5 border border-mafia-red/20 p-4 flex gap-3 items-center">
              <Zap className="text-mafia-red shrink-0" size={20} />
              <p className="text-[9px] text-mafia-red/80 uppercase tracking-wider font-bold leading-relaxed">
                {lang === 'cs' ? "POZOR: Změny vzhledu se okamžitě projeví napříč celou touto aplikací." : "CAUTION: Aesthetic settings apply instantly across the entire application."}
              </p>
            </div>
          </motion.div>

          {/* RIGHT CONTROL GRID (lg:col-span-8): 2x2 Grid of settings cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: Color & Glow */}
              <section className="bg-mafia-dark/30 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
                    <div className="flex items-center gap-2">
                      <Palette size={18} style={{ color: config.accentColor }} />
                      <h2 className="text-lg font-heading font-black uppercase tracking-wider">
                        {lang === 'cs' ? "BARVA A NEON" : "COLOR & NEON"}
                      </h2>
                    </div>
                    <span className="font-mono text-[8px] text-white/30 uppercase">Accent Style</span>
                  </div>
                  
                  <div className="flex items-center gap-5 mb-5">
                    {/* Circle Color Picker */}
                    <div className="relative shrink-0">
                      <input 
                        type="color" 
                        value={config.accentColor.startsWith('var') ? '#c5a880' : config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="w-16 h-16 bg-transparent cursor-pointer rounded-full border-2 border-white/15 appearance-none overflow-hidden"
                        style={{ boxShadow: `0 0 ${config.glowIntensity/2}px ${config.accentColor}` }}
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-full ring-2 ring-black ring-inset"></div>
                    </div>

                    {/* HEX Input */}
                    <div className="flex-grow space-y-2">
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="bg-black/50 border border-white/10 px-4 py-2.5 text-sm font-mono w-full outline-none focus:border-mafia-gold transition-all text-center rounded"
                          style={{ color: config.accentColor }}
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-500" style={{ backgroundColor: config.accentColor }}></div>
                      </div>
                      
                      {/* Presets Dots */}
                      <div className="flex gap-1.5 justify-center">
                        {["var(--color-mafia-gold)", "#ff1a1a", "#00ff41", "#00ccff", "#ffffff"].map(c => (
                          <button 
                            key={c} 
                            onClick={() => setConfig({...config, accentColor: c})}
                            className="h-5 w-5 rounded-full border border-white/10 hover:scale-125 transition-transform cursor-pointer" 
                            style={{ 
                              backgroundColor: c.startsWith('var') ? '#c5a880' : c,
                              boxShadow: config.accentColor === c ? `0 0 8px ${c.startsWith('var') ? '#c5a880' : c}` : 'none'
                            }} 
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Intensity */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Sliders size={12} />
                      {lang === 'cs' ? "ZÁŘE NEONU" : "GLOW INTENSITY"}
                    </span>
                    <span style={{ color: config.accentColor }} className="font-mono">{config.glowIntensity}%</span>
                  </div>
                  <div className="relative py-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="150" 
                      value={config.glowIntensity}
                      onChange={(e) => setConfig({ ...config, glowIntensity: parseInt(e.target.value) })}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mafia-gold"
                      style={{ '--user-accent': config.accentColor } as any}
                    />
                    <div className="flex justify-between mt-2 text-[7px] font-mono text-white/20 uppercase tracking-widest">
                      <span>Muted</span>
                      <span>Classic</span>
                      <span>Overdrive</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CARD 2: Typography Selection */}
              <section className="bg-mafia-dark/30 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Type size={18} style={{ color: config.accentColor }} />
                      <h2 className="text-lg font-heading font-black uppercase tracking-wider">
                        {lang === 'cs' ? "TYPOGRAFIE" : "TYPOGRAPHY"}
                      </h2>
                    </div>
                    <span className="font-mono text-[8px] text-white/30 uppercase">Global Font</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {FONTS.map((f) => {
                      const isSelected = config.fontFamily === f.value;
                      return (
                        <button
                          key={f.name}
                          onClick={() => setConfig({ ...config, fontFamily: f.value })}
                          className={`group p-3 border rounded text-left relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                            isSelected ? "border-mafia-gold bg-white/5" : "border-white/5 hover:border-white/10"
                          }`}
                          style={{ 
                            fontFamily: f.value,
                            borderColor: isSelected ? config.accentColor : undefined
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] uppercase font-black tracking-wider group-hover:text-mafia-gold transition-colors" style={{ color: isSelected ? config.accentColor : undefined }}>
                              {f.name}
                            </span>
                            {isSelected && <Check size={10} style={{ color: config.accentColor }} />}
                          </div>
                          <div className="text-xl font-bold opacity-75 mt-1 text-center py-1">
                            {f.preview}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="text-[8px] text-white/30 uppercase tracking-widest mt-4 pt-2 border-t border-white/5 text-center font-mono">
                  {lang === 'cs' ? "Mění vzhled veškerých textů a nabídek" : "Alters the typography for all descriptions and headers"}
                </div>
              </section>

              {/* CARD 3: Atmosphere & Animation settings */}
              <section className="bg-mafia-dark/30 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} style={{ color: config.accentColor }} />
                      <h2 className="text-lg font-heading font-black uppercase tracking-wider">
                        {lang === 'cs' ? "ATMOSFÉRA" : "ATMOSPHERE"}
                      </h2>
                    </div>
                    <span className="font-mono text-[8px] text-white/30 uppercase">FX Elements</span>
                  </div>

                  <div className="space-y-4">
                    {/* Environment Override */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{lang === 'cs' ? "Pozadí a Efekty" : "Background Mode"}</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['auto', 'classic', 'galaxy'] as const).map((mode) => {
                          const isActive = config.atmosphereOverride === mode;
                          return (
                            <button
                              key={mode}
                              onClick={() => setConfig({...config, atmosphereOverride: mode})}
                              className={`py-2 text-[9px] font-black uppercase tracking-wider transition-all border rounded cursor-pointer ${isActive ? 'text-black' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                              style={{ 
                                backgroundColor: isActive ? config.accentColor : undefined, 
                                borderColor: isActive ? config.accentColor : undefined 
                              }}
                            >
                              {mode}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Floating Items */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{lang === 'cs' ? "Poletující prvky" : "Floating Floaties"}</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['scissors', 'clippers', 'off'] as const).map((item) => {
                          const isActive = config.floatingItems === item;
                          return (
                            <button
                              key={item}
                              onClick={() => setConfig({...config, floatingItems: item})}
                              className={`py-2 text-[9px] font-black uppercase tracking-wider transition-all border rounded cursor-pointer ${isActive ? 'text-black' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                              style={{ 
                                backgroundColor: isActive ? config.accentColor : undefined, 
                                borderColor: isActive ? config.accentColor : undefined 
                              }}
                            >
                              {item === 'scissors' ? (lang === 'cs' ? 'Nůžky' : 'Scissors') : item === 'clippers' ? (lang === 'cs' ? 'Strojky' : 'Clippers') : (lang === 'cs' ? 'Vypnuto' : 'Off')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[8px] text-white/30 uppercase tracking-widest mt-4 pt-2 border-t border-white/5 text-center font-mono">
                  {lang === 'cs' ? "Vymění poletující nůžky za strojky nebo je vypne" : "Swap the default floating particles for custom shapes"}
                </div>
              </section>

              {/* CARD 4: Quick Presets (Awesome new user-friendly addition) */}
              <section className="bg-mafia-dark/30 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap size={18} style={{ color: config.accentColor }} />
                      <h2 className="text-lg font-heading font-black uppercase tracking-wider">
                        {lang === 'cs' ? "RYCHLÉ STYLY" : "QUICK STYLES"}
                      </h2>
                    </div>
                    <span className="font-mono text-[8px] text-white/30 uppercase">One-Click Look</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {PRESETS.map((preset) => {
                      const isMatching = config.accentColor === preset.accentColor && 
                                        config.glowIntensity === preset.glowIntensity && 
                                        config.fontFamily === preset.fontFamily &&
                                        config.atmosphereOverride === preset.atmosphereOverride &&
                                        config.floatingItems === preset.floatingItems;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset)}
                          className={`group p-2.5 border rounded text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[75px] ${
                            isMatching ? 'border-white bg-white/5 shadow-lg' : 'border-white/5 hover:border-white/10'
                          }`}
                          style={{
                            boxShadow: isMatching ? `0 0 12px ${preset.accentColor}20` : 'none',
                            borderColor: isMatching ? preset.accentColor : undefined
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider transition-colors" style={{ color: preset.accentColor }}>
                              {lang === 'cs' ? preset.nameCs : preset.name}
                            </span>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accentColor.startsWith('var') ? '#c5a880' : preset.accentColor }} />
                          </div>
                          
                          <p className="text-[7.5px] opacity-40 uppercase leading-normal tracking-tight group-hover:opacity-60 transition-opacity mt-1">
                            {lang === 'cs' ? preset.desc : preset.descEn}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="text-[8px] text-white/30 uppercase tracking-widest mt-4 pt-2 border-t border-white/5 text-center font-mono">
                  {lang === 'cs' ? "Kliknutím okamžitě změníte celkový vzhled" : "Instantly load a curated set of aesthetic settings"}
                </div>
              </section>

            </div>
          </motion.div>
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
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: var(--user-accent, var(--color-mafia-gold));
          cursor: pointer;
          box-shadow: 0 0 10px var(--user-accent, var(--color-mafia-gold));
          border: 2px solid white;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 3px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1.5px;
        }
      `}</style>
    </main>
  );
}
