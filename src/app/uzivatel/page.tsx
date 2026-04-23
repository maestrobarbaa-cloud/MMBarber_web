"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Home, Palette, Type, Zap, Sparkles, MousePointer2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

const FONTS = [
  { name: "Classic Noir", value: '"Courier New", Courier, monospace' },
  { name: "Modern Sans", value: 'var(--font-inter), sans-serif' },
  { name: "Elegant Serif", value: 'var(--font-playfair), serif' },
  { name: "System", value: 'system-ui, sans-serif' }
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
    accentColor: "#c5a059",
    glowIntensity: 50,
    fontFamily: '"Courier New", Courier, monospace'
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
    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
    // Create a special success effect
    for(let i=0; i<10; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            addClickEffect(x, y, config.accentColor);
        }, i * 100);
    }
  };

  const handleReset = () => {
    const default_ = {
      accentColor: "#c5a059",
      glowIntensity: 50,
      fontFamily: '"Courier New", Courier, monospace'
    };
    setConfig(default_);
    localStorage.setItem("mmbarber_user_config", JSON.stringify(default_));
    window.dispatchEvent(new Event("mmbarber-user-settings-update"));
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
      className="min-h-screen bg-mafia-black text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden selection:bg-mafia-gold selection:text-mafia-black"
    >
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

      <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-16"
          >
             <div className="relative mb-6">
                <Palette 
                  className={`transition-all duration-700 ${isCustomActive ? 'animate-pulse' : 'opacity-30'}`} 
                  size={64} 
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
                  >
                    Active
                  </motion.div>
                )}
                <Sparkles className={`absolute -top-2 -right-2 text-white/50 transition-opacity duration-700 ${isCustomActive ? 'opacity-100 animate-bounce' : 'opacity-0'}`} size={24} />
             </div>
           <h1 className="text-5xl md:text-8xl font-heading font-black tracking-[0.2em] uppercase text-center drop-shadow-2xl">
             {lang === 'cs' ? "VLASTNÍ VZHLED" : "CUSTOM LOOK"}
           </h1>
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: 160 }}
             className="h-1.5 mt-6" 
             style={{ backgroundColor: config.accentColor, boxShadow: `0 0 20px ${config.accentColor}` }}
           ></motion.div>
           <p className="mt-4 text-white/40 font-mono text-[10px] uppercase tracking-[0.4em]">Personalized Aesthetic Protocol v2.4</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-32"
          >
            <div className="bg-mafia-black/80 border border-white/10 p-8 backdrop-blur-xl relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">Live Preview</div>
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500" style={{ borderColor: config.accentColor, boxShadow: `0 0 ${config.glowIntensity/3}px ${config.accentColor}`, backgroundColor: `${config.accentColor}10` }}>
                        <MousePointer2 size={20} style={{ color: config.accentColor }} />
                     </div>
                     <div>
                        <h3 className="font-heading font-black text-xl uppercase" style={{ color: config.accentColor }}>MMBARBER</h3>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest">Est. 2024</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full" style={{ backgroundColor: config.accentColor }}></motion.div>
                     </div>
                     <p className="text-[12px] italic leading-relaxed" style={{ fontFamily: config.fontFamily }}>
                        &quot;Když se podíváš do zrcadla, měl bys vidět muže, který má svůj osud pod kontrolou. Styl je tvoje brnění.&quot;
                     </p>
                  </div>
                  <button className="w-full py-3 border font-black text-xs uppercase tracking-widest transition-all" style={{ borderColor: config.accentColor, color: config.accentColor, boxShadow: `0 0 ${config.glowIntensity/5}px ${config.accentColor}` }}>
                     Rezervovat Termín
                  </button>
               </div>
            </div>

            <div className="bg-mafia-red/5 border border-mafia-red/20 p-6 flex gap-4 items-center">
               <Zap className="text-mafia-red shrink-0" size={24} />
               <p className="text-[10px] text-mafia-red/80 uppercase tracking-wider font-bold">
                  {lang === 'cs' ? "POZOR: Změny barev se projeví napříč celým systémem." : "CAUTION: Color changes propagate across the entire system."}
               </p>
            </div>
          </motion.div>

          {/* Right Panel: Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="bg-mafia-dark/40 border border-white/10 p-10 backdrop-blur-md space-y-12">
              
              {/* Color Picker */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Palette size={20} style={{ color: config.accentColor }} />
                    <h2 className="text-2xl font-heading font-black uppercase tracking-wider">
                      {lang === 'cs' ? "BARVA & ZÁŘE" : "COLOR & GLOW"}
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-white/30 uppercase">Primary Accent</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative shrink-0">
                    <input 
                      type="color" 
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      className="w-32 h-32 bg-transparent cursor-pointer rounded-full border-4 border-white/10 appearance-none overflow-hidden"
                      style={{ boxShadow: `0 0 ${config.glowIntensity}px ${config.accentColor}` }}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-full ring-4 ring-black ring-inset"></div>
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="bg-black/50 border-2 border-white/10 px-6 py-4 text-xl font-mono w-full outline-none focus:border-mafia-gold transition-all text-center md:text-left"
                        style={{ color: config.accentColor }}
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-focus-within:w-full transition-all duration-500" style={{ backgroundColor: config.accentColor }}></div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                       {["#c5a059", "#ff1a1a", "#00ff41", "#00ccff", "#ffffff"].map(c => (
                         <button 
                           key={c} 
                           onClick={() => setConfig({...config, accentColor: c})}
                           className="h-8 border border-white/10 hover:scale-110 transition-transform" 
                           style={{ backgroundColor: c }}
                         ></button>
                       ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Glow Intensity */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Zap size={20} style={{ color: config.accentColor }} />
                    <h2 className="text-2xl font-heading font-black uppercase tracking-wider">
                      {lang === 'cs' ? "INTENZITA NEONU" : "NEON INTENSITY"}
                    </h2>
                  </div>
                  <span className="font-mono text-xl" style={{ color: config.accentColor }}>{config.glowIntensity}%</span>
                </div>
                <div className="relative py-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="150" 
                    value={config.glowIntensity}
                    onChange={(e) => setConfig({ ...config, glowIntensity: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mafia-gold"
                    style={{ '--user-accent': config.accentColor } as any}
                  />
                  <div className="flex justify-between mt-4 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                    <span>Stealth</span>
                    <span>Standard</span>
                    <span>Overdrive</span>
                  </div>
                </div>
              </section>

              {/* Font Selection */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Type size={20} style={{ color: config.accentColor }} />
                    <h2 className="text-2xl font-heading font-black uppercase tracking-wider">
                      {lang === 'cs' ? "TYPOGRAFIE" : "TYPOGRAPHY"}
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FONTS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setConfig({ ...config, fontFamily: f.value })}
                      className={`group p-6 border-2 transition-all text-left relative overflow-hidden ${
                        config.fontFamily === f.value ? "border-mafia-gold" : "border-white/5 hover:border-white/20"
                      }`}
                      style={{ fontFamily: f.value }}
                    >
                      {config.fontFamily === f.value && (
                         <div className="absolute inset-0 opacity-10" style={{ backgroundColor: config.accentColor }}></div>
                      )}
                      <span className="block text-lg uppercase font-black transition-colors group-hover:text-mafia-gold" style={{ color: config.fontFamily === f.value ? config.accentColor : 'inherit' }}>{f.name}</span>
                      <span className="text-[10px] opacity-40 uppercase tracking-tighter">The future is being cut today</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Actions */}
              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-mafia-gold text-mafia-black py-5 font-heading font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl group"
                  style={{ backgroundColor: config.accentColor, boxShadow: `0 10px 30px ${config.accentColor}40` }}
                >
                  <Save size={24} className="group-hover:rotate-12 transition-transform" />
                  {lang === 'cs' ? "ULOŽIT ARCHIV" : "SAVE ARCHIVE"}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={handleReset}
                    className="p-5 border-2 border-white/10 text-white/40 hover:border-mafia-red hover:text-mafia-red transition-all group"
                    title="Reset to defaults"
                  >
                    <RotateCcw size={24} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                  </button>
                  <button 
                    onClick={() => router.push("/")}
                    className="p-5 bg-white/5 border-2 border-transparent text-white/40 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Home size={24} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--user-accent, #c5a059);
          cursor: pointer;
          box-shadow: 0 0 15px var(--user-accent, #c5a059);
          border: 3px solid white;
          margin-top: -10px;
        }
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: var(--user-accent, #c5a059);
          cursor: pointer;
          box-shadow: 0 0 15px var(--user-accent, #c5a059);
          border: 3px solid white;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
      `}</style>
    </main>
  );
}
