"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Monitor, Shield, Zap, Sparkles, Eye, Ghost, Layers, Maximize, Scan, Target, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";

interface GraphicsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type GraphicsTier = 'low' | 'medium' | 'high' | 'ultra';

interface GraphicsConfig {
  tier: GraphicsTier;
  grainEnabled: boolean;
  blurEnabled: boolean;
  parallaxEnabled: boolean;
  animationsEnabled: boolean;
  crtEnabled: boolean;
  glowIntensity: number; // 0 to 1
  vignetteEnabled: boolean;
  chromaticAberration: boolean;
  letterboxEnabled: boolean;
  sharpness: number; // 0 to 1
  autoDetectEnabled: boolean;
}

export function GraphicsSettingsModal({ isOpen, onClose }: GraphicsSettingsModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { lang } = useTranslation();
  const [config, setConfig] = useState<GraphicsConfig>({
    tier: 'low',
    grainEnabled: false,
    blurEnabled: false,
    parallaxEnabled: false,
    animationsEnabled: false,
    crtEnabled: false,
    glowIntensity: 0.2,
    vignetteEnabled: false,
    chromaticAberration: false,
    letterboxEnabled: false,
    sharpness: 0.2,
    autoDetectEnabled: true
  });

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("mmbarber_graphics_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        applyConfigToDOM(parsed, false);
      } catch (e) {}
    } else {
        // Run auto-detect on first visit
        autoDetectSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyConfigToDOM = (newConfig: GraphicsConfig, isManual = false) => {
    const html = document.documentElement;
    html.setAttribute('data-graphics-tier', newConfig.tier);
    html.classList.toggle('reduce-motion', !newConfig.animationsEnabled);
    html.classList.toggle('disable-grain', !newConfig.grainEnabled);
    html.classList.toggle('vignette-active', newConfig.vignetteEnabled);
    html.classList.toggle('chromatic-active', newConfig.chromaticAberration);
    html.classList.toggle('letterbox-active', newConfig.letterboxEnabled);
    html.classList.toggle('crt-active', newConfig.crtEnabled);
    
    // Add animation trigger if requested (e.g. from a manual toggle)
    if (isManual) {
        html.classList.add('letterbox-animate');
        setTimeout(() => html.classList.remove('letterbox-animate'), 2000);
    }
    
    html.style.setProperty('--user-glow-intensity', newConfig.glowIntensity.toString());
    html.style.setProperty('--user-sharpness', newConfig.sharpness.toString());
  };

  const saveConfig = (newConfig: GraphicsConfig) => {
    setConfig(newConfig);
    localStorage.setItem("mmbarber_graphics_config", JSON.stringify(newConfig));
    applyConfigToDOM(newConfig, true);
    
    window.dispatchEvent(new CustomEvent('mmbarber-graphics-update', { detail: newConfig }));
    playSound("/sounds/click.mp3", 0.3);
  };

  const applyTier = (tier: GraphicsTier) => {
    let newConfig: GraphicsConfig;
    switch (tier) {
      case 'low':
        newConfig = { 
            tier, grainEnabled: false, blurEnabled: false, parallaxEnabled: false, 
            animationsEnabled: false, crtEnabled: false, glowIntensity: 0.2, 
            vignetteEnabled: false, chromaticAberration: false, letterboxEnabled: false, sharpness: 0.2,
            autoDetectEnabled: false
        };
        break;
      case 'medium':
        newConfig = { 
            tier, grainEnabled: true, blurEnabled: false, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 0.6, 
            vignetteEnabled: true, chromaticAberration: false, letterboxEnabled: false, sharpness: 0.5,
            autoDetectEnabled: false
        };
        break;
      case 'high':
        newConfig = { 
            tier, grainEnabled: true, blurEnabled: true, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 0.8, 
            vignetteEnabled: true, chromaticAberration: true, letterboxEnabled: false, sharpness: 0.7,
            autoDetectEnabled: false
        };
        break;
      case 'ultra':
        newConfig = { 
            tier, grainEnabled: true, blurEnabled: true, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 1.0, 
            vignetteEnabled: true, chromaticAberration: true, letterboxEnabled: true, sharpness: 1.0,
            autoDetectEnabled: false
        };
        break;
    }
    saveConfig(newConfig);
  };

  const autoDetectSettings = () => {
    // Basic heuristics for web performance tiers
    const cores = navigator.hardwareConcurrency || 0;
    // @ts-expect-error - experimental API
    const ram = navigator.deviceMemory || 0;
    
    let gpu = "unknown";
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        // @ts-expect-error - experimental API
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        // @ts-expect-error - experimental API
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
      }
    } catch (e) {}

    console.log(`Auto-detecting: Cores=${cores}, RAM=${ram}, GPU=${gpu}`);

    let recommended: GraphicsTier = 'low'; // Conservative default

    const highEndGpus = ['nvidia', 'rtx', 'gtx', 'radeon', 'apple m', 'arc'];
    const isHighEndGpu = highEndGpus.some(term => gpu.includes(term));
    const isMobile = window.innerWidth < 1280;

    if (isMobile) {
      if (cores >= 8 && ram >= 6) recommended = 'medium';
      else recommended = 'low';
    } else {
      // PC/Desktop Deduction
      if (cores >= 12 && ram >= 16 && isHighEndGpu) {
        recommended = 'ultra';
      } else if (cores >= 8 && ram >= 8 && isHighEndGpu) {
        recommended = 'high';
      } else if (cores >= 6 && ram >= 4) {
        recommended = 'medium';
      } else {
        recommended = 'low';
      }
    }

    // Fallback for missing info
    if (cores === 0 || ram === 0) recommended = 'low';

    let newConfig: GraphicsConfig;
    switch (recommended) {
      case 'low':
        newConfig = { 
            tier: recommended, grainEnabled: false, blurEnabled: false, parallaxEnabled: false, 
            animationsEnabled: false, crtEnabled: false, glowIntensity: 0.2, 
            vignetteEnabled: false, chromaticAberration: false, letterboxEnabled: false, sharpness: 0.2,
            autoDetectEnabled: true
        };
        break;
      case 'medium':
        newConfig = { 
            tier: recommended, grainEnabled: true, blurEnabled: false, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 0.6, 
            vignetteEnabled: true, chromaticAberration: false, letterboxEnabled: false, sharpness: 0.5,
            autoDetectEnabled: true
        };
        break;
      case 'high':
        newConfig = { 
            tier: recommended, grainEnabled: true, blurEnabled: true, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 0.8, 
            vignetteEnabled: true, chromaticAberration: true, letterboxEnabled: false, sharpness: 0.7,
            autoDetectEnabled: true
        };
        break;
      case 'ultra':
        newConfig = { 
            tier: recommended, grainEnabled: true, blurEnabled: true, parallaxEnabled: true, 
            animationsEnabled: true, crtEnabled: false, glowIntensity: 1.0, 
            vignetteEnabled: true, chromaticAberration: true, letterboxEnabled: true, sharpness: 1.0,
            autoDetectEnabled: true
        };
        break;
    }
    
    saveConfig(newConfig!);
    playSound("/sounds/naboje.mp3", 0.4);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10007] flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-4xl bg-[#050505] border border-mafia-gold/30 shadow-[0_0_100px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-mafia-gold/5">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-mafia-gold/20 text-mafia-gold">
                    <Settings size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black text-white uppercase tracking-[0.3em]">
                    {lang === 'cs' ? 'Grafické Rozhraní' : 'Graphics Engine'}
                  </h2>
                  <p className="text-[9px] font-mono text-mafia-gold/40 uppercase tracking-widest mt-1">Version 2.5.0 // Adaptive Optimization</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/20 hover:text-white transition-colors p-2">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Column: Tiers & Sliders */}
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                        <SectionLabel icon={<Layers size={14}/>} label={lang === 'cs' ? 'Systémové Presety' : 'System Presets'} />
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    if (!config.autoDetectEnabled) {
                                        autoDetectSettings();
                                    } else {
                                        saveConfig({ ...config, autoDetectEnabled: false });
                                    }
                                }}
                                className={`flex items-center gap-2 px-3 py-1 border text-[9px] font-black uppercase tracking-widest transition-all ${config.autoDetectEnabled ? 'bg-mafia-gold text-mafia-black border-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                            >
                                <Scan size={12} className={config.autoDetectEnabled ? 'animate-pulse' : ''} />
                                {lang === 'cs' ? (config.autoDetectEnabled ? 'Auto-Detekce AKTIVNÍ' : 'Auto-Detekce VYPNUTA') : (config.autoDetectEnabled ? 'Auto-Detect ACTIVE' : 'Auto-Detect OFF')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'ultra'] as GraphicsTier[]).map((t) => (
                        <button
                          key={t}
                          disabled={config.autoDetectEnabled}
                          onClick={() => applyTier(t)}
                          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all border ${config.tier === t ? 'bg-mafia-gold text-mafia-black border-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]' : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/30'} ${config.autoDetectEnabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <SectionLabel icon={<Target size={14}/>} label={lang === 'cs' ? 'Ladění Výkonu' : 'Performance Tuning'} />
                    
                    <div className="space-y-8 mt-6">
                        <RangeInput 
                            label={lang === 'cs' ? "Intenzita Záře (Bloom)" : "Glow Intensity (Bloom)"}
                            value={config.glowIntensity}
                            onChange={(v) => saveConfig({...config, glowIntensity: v, autoDetectEnabled: false})}
                        />
                        <RangeInput 
                            label={lang === 'cs' ? "Ostrost Obrazu (Sharpen)" : "Image Sharpness (Sharpen)"}
                            value={config.sharpness}
                            onChange={(v) => saveConfig({...config, sharpness: v, autoDetectEnabled: false})}
                        />
                    </div>
                  </section>

                  <section className="p-5 bg-white/[0.02] border border-white/5 rounded-sm">
                    <div className="flex items-start gap-4">
                        <Shield size={20} className="text-mafia-gold/50" />
                        <div>
                            <div className="text-[10px] font-heading font-black text-white uppercase tracking-wider mb-1">Adaptive Performance</div>
                            <p className="text-[10px] text-white/40 leading-relaxed font-mono uppercase tracking-tighter">
                                {lang === 'cs' 
                                    ? "Systém automaticky optimalizuje grafiku pro váš hardware. Manuální změna vypne auto-detekci."
                                    : "The system automatically optimizes graphics for your hardware. Manual changes will disable auto-detection."}
                            </p>
                        </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Toggles */}
                <div className="space-y-6">
                    <SectionLabel icon={<Wind size={14}/>} label={lang === 'cs' ? 'Post-Processing Efekty' : 'Post-Processing Effects'} />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <SettingToggle 
                            label={lang === 'cs' ? "Filmové Zrno" : "Film Grain"}
                            desc="Dither Noise"
                            active={config.grainEnabled}
                            icon={<Ghost size={16} />}
                            onClick={() => saveConfig({...config, grainEnabled: !config.grainEnabled, autoDetectEnabled: false})}
                        />
                        <SettingToggle 
                            label={lang === 'cs' ? "Motion Blur" : "Motion Blur"}
                            desc="Fluid Render"
                            active={config.blurEnabled}
                            icon={<Eye size={16} />}
                            onClick={() => saveConfig({...config, blurEnabled: !config.blurEnabled, autoDetectEnabled: false})}
                        />
                        <SettingToggle 
                            label={lang === 'cs' ? "Parallax" : "Parallax"}
                            desc="Depth Mapping"
                            active={config.parallaxEnabled}
                            icon={<Layers size={16} />}
                            onClick={() => saveConfig({...config, parallaxEnabled: !config.parallaxEnabled, autoDetectEnabled: false})}
                        />
                         <SettingToggle 
                            label={lang === 'cs' ? "Vinětace" : "Vignette"}
                            desc="Edge Darkening"
                            active={config.vignetteEnabled}
                            icon={<Maximize size={16} />}
                            onClick={() => saveConfig({...config, vignetteEnabled: !config.vignetteEnabled, autoDetectEnabled: false})}
                        />
                         <SettingToggle 
                            label={lang === 'cs' ? "Aberace" : "Aberration"}
                            desc="Lens Distortion"
                            active={config.chromaticAberration}
                            icon={<Sparkles size={16} />}
                            onClick={() => saveConfig({...config, chromaticAberration: !config.chromaticAberration, autoDetectEnabled: false})}
                        />
                         <SettingToggle 
                            label={lang === 'cs' ? "Kino Formát" : "Cinematic Form."}
                            desc="21:9 Letterbox"
                            active={config.letterboxEnabled}
                            icon={<Maximize size={16} />}
                            onClick={() => saveConfig({...config, letterboxEnabled: !config.letterboxEnabled, autoDetectEnabled: false})}
                        />
                        <SettingToggle 
                            label={lang === 'cs' ? "CRT Simulace" : "CRT Simulation"}
                            desc="Scanlines"
                            active={config.crtEnabled}
                            icon={<Monitor size={16} />}
                            onClick={() => saveConfig({...config, crtEnabled: !config.crtEnabled, autoDetectEnabled: false})}
                        />
                         <SettingToggle 
                            label={lang === 'cs' ? "Animace" : "Animations"}
                            desc="Transition Logic"
                            active={config.animationsEnabled}
                            icon={<Zap size={16} />}
                            onClick={() => saveConfig({...config, animationsEnabled: !config.animationsEnabled, autoDetectEnabled: false})}
                        />
                    </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                 <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">MM_ENGINE_INITIALIZED_001</div>
                 <button 
                    onClick={onClose}
                    className="px-12 py-3 bg-mafia-gold text-mafia-black text-[10px] font-heading font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                 >
                    {lang === 'cs' ? 'Aplikovat Nastavení' : 'Apply Settings'}
                 </button>
            </div>
            
            {/* Scanline line */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[1px] bg-mafia-gold/10 z-50 pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2 text-mafia-gold/60">
            {icon}
            <span className="text-[10px] font-mono uppercase tracking-[0.4em]">{label}</span>
        </div>
    );
}

function RangeInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    const id = `range-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="text-[10px] font-heading font-black text-white/70 uppercase tracking-widest cursor-pointer">{label}</label>
                <span className="text-[10px] font-mono text-mafia-gold">{Math.round(value * 100)}%</span>
            </div>
            <input 
                id={id}
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full appearance-none bg-white/5 h-1 cursor-pointer accent-mafia-gold hover:bg-white/10 transition-colors custom-range-input"
            />
        </div>
    );
}

function SettingToggle({ label, desc, active, icon, onClick }: { label: string, desc: string, active: boolean, icon: React.ReactNode, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`p-4 border text-left flex items-center justify-between transition-all group ${active ? 'bg-mafia-gold/10 border-mafia-gold/40 shadow-[inset_0_0_15px_rgba(197,160,89,0.05)]' : 'bg-white/[0.01] border-white/5 hover:border-white/20'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`${active ? 'text-mafia-gold' : 'text-white/20 group-hover:text-white/40'} transition-colors`}>
                    {icon}
                </div>
                <div>
                    <div className={`text-[10px] font-heading font-black uppercase tracking-wider ${active ? 'text-white' : 'text-white/40'}`}>{label}</div>
                    <div className="text-[8px] text-white/20 uppercase font-mono mt-0.5">{desc}</div>
                </div>
            </div>
            <div className={`w-3 h-3 border ${active ? 'bg-mafia-gold border-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-transparent border-white/20'}`}>
                {active && <div className="w-full h-full flex items-center justify-center text-mafia-black text-[6px] font-black">✓</div>}
            </div>
        </button>
    );
}
