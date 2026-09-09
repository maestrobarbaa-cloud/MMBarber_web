"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Monitor,
  Palette,
  Bell,
  Volume2,
  VolumeX,
  ChevronRight,
  Radio,
  X,
  Lock
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";

export default function NastaveniRozcestnik() {
  const router = useRouter();
  const { chapterXp } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Výpočet potřebných XP (shodný s Battlepassem)
  const calculateXpForLevel = (targetLevel: number) => {
    let xp = 0;
    for (let i = 1; i <= targetLevel; i++) {
      xp += 10 + (Math.floor(i / 5) * 5);
    }
    return xp;
  };

  const settingsXp = chapterXp['settings'] || 0;
  const productsXp = chapterXp['products'] || 0;
  
  // Odemčené funkce podle milníků v kapitole 'settings' a 'products'
  // Grafika a Audio jsou nyní v kapitole products (Nastavení webu) na levelu 1 (1 XP) a levelu 2 (2 XP)
  const isVisualsUnlocked = productsXp >= 1;
  const isAudioUnlocked = productsXp >= 2;
  
  // Ostatní zůstávají v settings
  const isWidgetsUnlocked = settingsXp >= calculateXpForLevel(15);
  const isAppearanceUnlocked = settingsXp >= calculateXpForLevel(30);

  useEffect(() => {
    const readSound = () => {
      setSoundEnabled(localStorage.getItem("mmbarber_sound_enabled") === "true");
    };
    readSound();
    
    // Listen for remote updates
    window.addEventListener("mmbarber-sound-update-remote", readSound);
    return () => window.removeEventListener("mmbarber-sound-update-remote", readSound);
  }, []);

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem("mmbarber_sound_enabled", String(nextState));
    window.dispatchEvent(new CustomEvent('mmbarber-sound-update', { detail: nextState }));
    window.dispatchEvent(new Event('mmbarber-sound-update-remote'));
  };

  const handleGraphicsOpen = () => {
    window.dispatchEvent(new Event('mmbarber-graphics-open'));
  };

  return (
    <main className="min-h-screen bg-mafia-black text-white">
      {/* Zavřít */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push("/");
        }}
        className="fixed top-6 right-6 md:top-10 md:right-12 z-[100] px-4 md:px-6 py-2 md:py-3 bg-black/50 border border-white/10 text-white hover:bg-mafia-gold hover:text-black hover:border-mafia-gold transition-all duration-300 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] backdrop-blur-md flex items-center gap-2 group"
      >
        <X size={14} className="group-hover:rotate-90 transition-transform" />
        <span className="hidden md:inline">[ ESC ] ZAVŘÍT</span>
        <span className="md:hidden">ZAVŘÍT</span>
      </button>

      {/* Pozadí */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      {/* Obsah */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 py-16 pb-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
              <Settings size={22} className="text-white/80" />
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-widest leading-tight">
            Centrální
            <span className="text-white/40"> Nastavení</span>
          </h1>
          <p className="text-white/40 font-mono text-sm mt-4 leading-relaxed max-w-xl">
            Zde můžete přizpůsobit veškeré chování, vizuál a notifikace webu přesně podle svých preferencí.
          </p>
        </motion.div>

        {/* Mřížka rozcestníku */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Grafika */}
          <motion.button
            onClick={() => {
              if (isVisualsUnlocked) {
                handleGraphicsOpen();
              } else {
                router.push('/postup');
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`group relative flex flex-col text-left p-6 border transition-all duration-300 overflow-hidden ${isVisualsUnlocked ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30' : 'border-white/5 bg-black/40 grayscale opacity-60 hover:opacity-100'}`}
          >
            {isVisualsUnlocked && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-sm relative">
                <Monitor size={24} className="text-white" />
                {!isVisualsUnlocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-white/50" />}
              </div>
              {!isVisualsUnlocked ? (
                <div className="text-[9px] font-mono uppercase tracking-widest text-mafia-gold/50 bg-mafia-gold/10 px-2 py-1">Úroveň 1 (Nastavení webu)</div>
              ) : (
                <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
              )}
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Grafika systému</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed">
              {isVisualsUnlocked ? "Úprava stínů, odlesků a výkonnostních profilů." : "Pro odemčení pokračuj v Postupu - kapitola Nastavení webu."}
            </p>
          </motion.button>

          {/* 2. Vzhled rozhraní */}
          <motion.button
            onClick={() => {
              if (isAppearanceUnlocked) {
                router.push('/uzivatel');
              } else {
                router.push('/postup');
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`group relative flex flex-col text-left p-6 border transition-all duration-300 overflow-hidden ${isAppearanceUnlocked ? 'border-white/10 bg-white/5 hover:bg-mafia-gold/10 hover:border-mafia-gold/30' : 'border-white/5 bg-black/40 grayscale opacity-60 hover:opacity-100'}`}
          >
            {isAppearanceUnlocked && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-mafia-gold/10 rounded-sm relative">
                <Palette size={24} className="text-mafia-gold" />
                {!isAppearanceUnlocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-white/50" />}
              </div>
              {!isAppearanceUnlocked ? (
                <div className="text-[9px] font-mono uppercase tracking-widest text-mafia-gold/50 bg-mafia-gold/10 px-2 py-1">Milník 30</div>
              ) : (
                <ChevronRight size={20} className="text-white/20 group-hover:text-mafia-gold transition-colors" />
              )}
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Vzhled rozhraní</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
              {isAppearanceUnlocked ? "Volba barevných schémat a témat webu." : "Pro odemčení pokračuj v Postupu - kapitola Centrální Nastavení."}
            </p>
          </motion.button>

          {/* 3. Oznámení a Widgety */}
          <motion.button
            onClick={() => {
              if (isWidgetsUnlocked) {
                router.push('/oznameni-a-rozhrani');
              } else {
                router.push('/postup');
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`group relative flex flex-col text-left p-6 border transition-all duration-300 overflow-hidden ${isWidgetsUnlocked ? 'border-white/10 bg-white/5 hover:bg-mafia-gold/10 hover:border-mafia-gold/30' : 'border-white/5 bg-black/40 grayscale opacity-60 hover:opacity-100'}`}
          >
            {isWidgetsUnlocked && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-mafia-gold/10 rounded-sm relative">
                <Bell size={24} className="text-mafia-gold" />
                {!isWidgetsUnlocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-white/50" />}
              </div>
              {!isWidgetsUnlocked ? (
                <div className="text-[9px] font-mono uppercase tracking-widest text-mafia-gold/50 bg-mafia-gold/10 px-2 py-1">Milník 15</div>
              ) : (
                <ChevronRight size={20} className="text-white/20 group-hover:text-mafia-gold transition-colors" />
              )}
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Oznámení & Widgety</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
              {isWidgetsUnlocked ? "Zapínání či vypínání rušivých prvků a upozornění." : "Pro odemčení pokračuj v Postupu - kapitola Centrální Nastavení."}
            </p>
          </motion.button>

          {/* 4. Zvuky (Přepínač) */}
          <motion.button
            onClick={() => {
              if (isAudioUnlocked) {
                handleSoundToggle();
              } else {
                router.push('/postup');
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`group relative flex flex-col text-left p-6 border transition-all duration-300 overflow-hidden ${
              isAudioUnlocked
                ? (soundEnabled ? "border-mafia-gold/30 bg-mafia-gold/10" : "border-white/10 bg-white/5 hover:bg-white/10")
                : "border-white/5 bg-black/40 grayscale opacity-60 hover:opacity-100"
            }`}
          >
            {soundEnabled && isAudioUnlocked && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold to-transparent opacity-70" />
            )}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-sm transition-colors relative ${isAudioUnlocked ? (soundEnabled ? "bg-mafia-gold/20" : "bg-white/10") : "bg-white/5"}`}>
                {soundEnabled && isAudioUnlocked ? (
                  <Volume2 size={24} className="text-mafia-gold" />
                ) : (
                  <VolumeX size={24} className="text-white/50" />
                )}
                {!isAudioUnlocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-white/50" />}
              </div>
              
              {!isAudioUnlocked ? (
                <div className="text-[9px] font-mono uppercase tracking-widest text-mafia-gold/50 bg-mafia-gold/10 px-2 py-1">Úroveň 2 (Nastavení webu)</div>
              ) : (
                <div className="relative w-12 h-6 rounded-full bg-black/50 border border-white/10 flex items-center px-1">
                  <motion.div
                    animate={{ x: soundEnabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-4 h-4 rounded-full ${soundEnabled ? "bg-mafia-gold" : "bg-white/30"}`}
                  />
                </div>
              )}
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Zvukové efekty</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed">
              {isAudioUnlocked ? (
                <>Stav: <span className={soundEnabled ? "text-mafia-gold font-bold" : "text-white/50"}>{soundEnabled ? "ZAPNUTO" : "VYPNUTO"}</span></>
              ) : (
                "Pro odemčení pokračuj v Postupu - kapitola Nastavení webu."
              )}
            </p>
          </motion.button>

          {/* 5. MMBarber Rádio */}
          <motion.button
            onClick={() => {
              if (isAudioUnlocked) {
                window.dispatchEvent(new Event('mmbarber-radio-toggle'));
              } else {
                router.push('/postup');
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`group relative flex flex-col text-left p-6 border transition-all duration-300 overflow-hidden ${isAudioUnlocked ? 'border-white/10 bg-white/5 hover:bg-mafia-gold/10 hover:border-mafia-gold/30' : 'border-white/5 bg-black/40 grayscale opacity-60 hover:opacity-100'}`}
          >
            {isAudioUnlocked && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 group-hover:bg-mafia-gold/20 rounded-sm transition-colors relative">
                <Radio size={24} className="text-white group-hover:text-mafia-gold transition-colors" />
                {!isAudioUnlocked && <Lock size={12} className="absolute -bottom-1 -right-1 text-white/50" />}
              </div>
              {!isAudioUnlocked ? (
                <div className="text-[9px] font-mono uppercase tracking-widest text-mafia-gold/50 bg-mafia-gold/10 px-2 py-1">Úroveň 2 (Nastavení webu)</div>
              ) : (
                <ChevronRight size={20} className="text-white/20 group-hover:text-mafia-gold transition-colors" />
              )}
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">MMBarber Rádio</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
              {isAudioUnlocked ? "Spustit nebo zastavit exkluzivní výběr hudby." : "Pro odemčení pokračuj v Postupu - kapitola Nastavení webu."}
            </p>
          </motion.button>

        </div>
      </div>
    </main>
  );
}
