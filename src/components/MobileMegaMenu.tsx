"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Users, 
  CreditCard, 
  LayoutGrid, 
  Target, 
  Briefcase, 
  MapPin, 
  Crown, 
  Trophy, 
  Dices, 
  Settings, 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Phone, 
  Compass, 
  Search 
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { type Language } from "@/hooks/useTranslation";

interface MobileMegaMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  lang: Language;
  t: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  shouldFlashFamily: boolean;
  markFamilyOpened: () => void;
  shouldFlashShooting: boolean;
  markShootingOpened: () => void;
  visitCount: number;
}

export function MobileMegaMenu({
  isMenuOpen,
  setIsMenuOpen,
  lang,
  t,
  searchQuery,
  setSearchQuery,
  handleSearch,
  shouldFlashFamily,
  markFamilyOpened,
  shouldFlashShooting,
  markShootingOpened,
  visitCount
}: MobileMegaMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const {
    isStealthMode, setIsStealthMode,
    isMobileEffectsEnabled, setIsMobileEffectsEnabled,
    isSoundEnabled, setIsSoundEnabled
  } = useUI();

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const toggleSound = () => {
    const newVal = !isSoundEnabled;
    setIsSoundEnabled(newVal);
    localStorage.setItem("mmbarber_sound_enabled", String(newVal));
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 h-[100dvh] bg-mafia-black z-[20000] overflow-y-auto touch-pan-y px-4 py-4 pb-24 overscroll-contain"
        >
          <div className="flex items-center justify-between mb-8 overflow-hidden shrink-0">
             <div className="flex items-center">
                <Image src="/logo.png" alt="MM" width={40} height={32} className="w-10 h-8 object-contain" />
                <span className="text-xl font-heading font-black text-mafia-gold tracking-widest ml-2">MMBARBER</span>
             </div>
          </div>

          <div className="mb-6 px-2">
            <form onSubmit={handleSearch} className="relative group">
              <input
                id="header-search-mobile"
                type="text"
                aria-label={lang === 'cs' ? "Vyhledat" : "Search"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'cs' ? "ZADEJTE CÍL..." : "SEARCH TARGET..."}
                className="w-full bg-white/5 border-2 border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-blood/30 text-white text-base font-mono px-6 py-4 outline-none focus:border-mafia-gold noir-mode:focus:border-mafia-silver theme-blood:focus:border-mafia-blood transition-all tracking-[0.2em] uppercase"
              />
              <div className="absolute top-0 right-0 h-full flex items-center pr-6 pointer-events-none">
                <Search size={20} className="text-mafia-gold/40 noir-mode:text-mafia-silver/40 theme-blood:text-mafia-blood/40" />
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-3 mb-8 pb-10">

            <button 
              onClick={() => {
                markFamilyOpened();
                handleNavLinkClick();
                router.push("/rodina");
              }}
              className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${shouldFlashFamily ? 'border-mafia-gold bg-mafia-gold/5 animate-pulse shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.2)]' : 'border-mafia-gold/50'}`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${shouldFlashFamily ? 'border-mafia-gold bg-mafia-gold/20' : 'border-mafia-gold/20 bg-mafia-gold/10'}`}>
                  <Users size={28} className={shouldFlashFamily ? 'text-mafia-gold' : 'text-mafia-gold'} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xl font-sans font-black text-mafia-gold uppercase tracking-widest">{lang === 'cs' ? 'RODINA' : 'FAMILY'}</span>
                  <span className="text-[10px] font-mono text-mafia-gold/60 uppercase">{lang === 'cs' ? 'STAŇ SE ČLENEM' : 'BECOME A MEMBER'}</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-mafia-gold" />
            </button>

            <Link 
              href="/cenik" 
              onClick={handleNavLinkClick} 
              className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-between active:scale-95 transition-all duration-500 hover:border-mafia-gold/50"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                   <CreditCard size={28} className="text-white/60" />
                </div>
                <div className="flex flex-col items-start text-left">
                   <span className="text-lg font-sans font-black text-smoke-white uppercase">{t?.header?.priceList || 'Ceník'}</span>
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{lang === 'cs' ? 'TARIF SLUŽEB' : 'SERVICE TARIFF'}</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/20" />
            </Link>

            <div className={`border transition-all duration-300 ${activeFolder === 'main' ? 'border-mafia-gold bg-mafia-gold/5' : 'border-white/10 bg-white/5'}`}>
              <button 
                onClick={() => setActiveFolder(activeFolder === 'main' ? null : 'main')}
                className="w-full px-6 py-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <LayoutGrid size={24} className={activeFolder === 'main' ? 'text-mafia-gold' : 'text-white/40'} />
                  <span className={`font-sans font-black uppercase tracking-widest ${activeFolder === 'main' ? 'text-mafia-gold' : 'text-smoke-white'}`}>
                    {lang === 'cs' ? 'HLAVNÍ MENU' : 'MAIN MENU'}
                  </span>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-300 ${activeFolder === 'main' ? 'rotate-180 text-mafia-gold' : 'text-white/20'}`} />
              </button>
              <AnimatePresence>
                {activeFolder === 'main' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col px-6 pb-4 gap-2">
                      <Link href="/jak-to-chodi" onClick={handleNavLinkClick} className="py-5 px-6 border border-white/10 flex items-center gap-4 active:scale-95 bg-black/20">
                         <Target size={24} className="text-white/40" />
                         <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{t?.header?.startMission || 'Jak to u nás chodí'}</span>
                      </Link>
                      <Link href="/kariera" onClick={handleNavLinkClick} className="py-5 px-6 border border-white/10 flex items-center gap-4 active:scale-95 bg-black/20">
                         <Briefcase size={24} className="text-white/40" />
                         <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{lang === 'cs' ? 'Pracovní pozice' : 'Jobs'}</span>
                      </Link>
                      <Link href="/pribeh" onClick={handleNavLinkClick} className="py-5 px-6 border border-white/10 flex items-center gap-4 active:scale-95 bg-black/20">
                         <Users size={24} className="text-white/40" />
                         <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{t?.header?.aboutUs || 'O Nás'}</span>
                      </Link>
                      <Link href="/#services" onClick={(e) => { handleNavLinkClick(); if (pathname === "/") { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); } }} className="py-5 px-6 border border-white/10 flex items-center gap-4 active:scale-95 bg-black/20">
                         <Briefcase size={24} className="text-white/40" />
                         <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{t?.header?.services || 'Služby'}</span>
                      </Link>
                      <Link href="/#kontakt" onClick={(e) => { handleNavLinkClick(); if (pathname === "/") { e.preventDefault(); document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }); } }} className="py-5 px-6 border border-white/10 flex items-center gap-4 active:scale-95 bg-black/20">
                         <MapPin size={24} className="text-white/40" />
                         <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{t?.header?.kudy_k_nam || 'Kudy k nám'}</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`border transition-all duration-300 ${activeFolder === 'games' ? 'border-mafia-gold bg-mafia-gold/5' : 'border-white/10 bg-white/5'}`}>
              <button 
                onClick={() => setActiveFolder(activeFolder === 'games' ? null : 'games')}
                className="w-full px-6 py-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Target size={24} className={activeFolder === 'games' ? 'text-mafia-gold' : 'text-white/40'} />
                  <span className={`font-sans font-black uppercase tracking-widest ${activeFolder === 'games' ? 'text-mafia-gold' : 'text-smoke-white'}`}>
                    {lang === 'cs' ? 'HRY & ELITA' : 'GAMES & ELITE'}
                  </span>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-300 ${activeFolder === 'games' ? 'rotate-180 text-mafia-gold' : 'text-white/20'}`} />
              </button>
              <AnimatePresence>
                {activeFolder === 'games' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col px-6 pb-4 gap-2">
                      <button onClick={() => { handleNavLinkClick(); router.push("/hodnoceni"); }} className="py-5 px-6 border flex items-center gap-4 active:scale-95 transition-all bg-black/20 border-white/10 hover:border-mafia-gold/30 text-left">
                         <Crown size={24} className="text-mafia-gold shrink-0" />
                         <div className="flex flex-col leading-tight">
                            <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{t?.header?.ratingAndNicknames || 'HODNOCENÍ ELITY'}</span>
                            <span className="text-[10px] font-mono text-mafia-gold/50 uppercase mt-1">{lang === 'cs' ? 'KOMUNITNÍ HLASOVÁNÍ' : 'COMMUNITY VOTING'}</span>
                         </div>
                      </button>
                      <button onClick={() => { markShootingOpened(); setIsMenuOpen(false); window.dispatchEvent(new Event('mmbarber-elita-game-open')); }} className={`py-5 px-6 border flex items-center gap-4 active:scale-95 transition-all bg-black/20 text-left ${shouldFlashShooting ? 'border-mafia-gold shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.2)]' : 'border-white/10 hover:border-mafia-gold/30'}`}>
                         <Trophy size={24} className="text-mafia-red shrink-0" />
                         <div className="flex flex-col leading-tight">
                            <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{lang === 'cs' ? 'ELITNÍ STŘELBA' : 'ELITE SHOOTING'}</span>
                            <span className="text-[10px] font-mono text-mafia-red/70 uppercase mt-1">{lang === 'cs' ? 'ZÍSKEJ RESPEKT' : 'EARN RESPECT'}</span>
                         </div>
                      </button>
                      <button onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new Event('mmbarber-slot-machine-open')); }} className="py-5 px-6 border flex items-center gap-4 active:scale-95 transition-all bg-black/20 border-white/10 hover:border-mafia-gold/30 text-left">
                         <Dices size={24} className="text-mafia-gold shrink-0" />
                         <div className="flex flex-col leading-tight">
                            <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{lang === 'cs' ? 'HAZARDNÍ AUTOMAT' : 'SLOT MACHINE'}</span>
                            <span className="text-[10px] font-mono text-mafia-gold/50 uppercase mt-1">{lang === 'cs' ? 'KASINO & VÝHRA' : 'CASINO & WIN'}</span>
                         </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`border transition-all duration-300 ${activeFolder === 'settings' ? 'border-mafia-gold bg-mafia-gold/5' : 'border-white/10 bg-white/5'}`}>
              <button 
                onClick={() => setActiveFolder(activeFolder === 'settings' ? null : 'settings')}
                className="w-full px-6 py-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Settings size={24} className={activeFolder === 'settings' ? 'text-mafia-gold' : 'text-white/40'} />
                  <span className={`font-sans font-black uppercase tracking-widest ${activeFolder === 'settings' ? 'text-mafia-gold' : 'text-smoke-white'}`}>
                    {lang === 'cs' ? 'NASTAVENÍ' : 'SETTINGS'}
                  </span>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-300 ${activeFolder === 'settings' ? 'rotate-180 text-mafia-gold' : 'text-white/20'}`} />
              </button>
              <AnimatePresence>
                {activeFolder === 'settings' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col px-6 pb-4 gap-2">
                      <button onClick={() => { const newState = !isStealthMode; setIsStealthMode(newState); localStorage.setItem("mmbarber_stealth_mode", String(newState)); window.dispatchEvent(new CustomEvent('mmbarber-stealth-update', { detail: newState })); }} className="py-5 px-6 border border-white/10 flex items-center justify-between active:scale-95 transition-all bg-black/20">
                        <div className="flex items-center gap-4">
                          <Radio size={24} className={isStealthMode ? 'text-[#0f0]' : 'text-white/40'} />
                          <span className={`text-sm md:text-base font-sans font-bold uppercase ${isStealthMode ? 'text-[#0f0]' : 'text-smoke-white'}`}>{lang === 'cs' ? 'STEALTH MÓD' : 'STEALTH MODE'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isStealthMode ? 'bg-[#0f0]' : 'bg-white/10'}`}>
                           <motion.div animate={{ x: isStealthMode ? 22 : 3 }} className="w-3.5 h-3.5 rounded-full bg-black shadow-sm" />
                        </div>
                      </button>
                      <button onClick={() => { const newState = !isMobileEffectsEnabled; setIsMobileEffectsEnabled(newState); localStorage.setItem("mmbarber_mobile_effects_enabled", String(newState)); window.dispatchEvent(new CustomEvent('mmbarber-mobile-effects-update', { detail: newState })); }} className="py-5 px-6 border border-white/10 flex items-center justify-between active:scale-95 transition-all bg-black/20">
                        <div className="flex items-center gap-4">
                          <Sparkles size={24} className={isMobileEffectsEnabled ? 'text-mafia-gold' : 'text-white/40'} />
                          <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{lang === 'cs' ? 'EFEKTY' : 'EFFECTS'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isMobileEffectsEnabled ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                           <motion.div animate={{ x: isMobileEffectsEnabled ? 22 : 3 }} className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                        </div>
                      </button>
                      <button onClick={toggleSound} className="py-5 px-6 border border-white/10 flex items-center justify-between active:scale-95 transition-all bg-black/20">
                        <div className="flex items-center gap-4">
                          {isSoundEnabled ? <Volume2 size={24} className="text-mafia-gold" /> : <VolumeX size={24} className="text-white/40" />}
                          <span className="text-sm md:text-base font-sans font-bold text-smoke-white uppercase">{lang === 'cs' ? 'ZVUK' : 'SOUND'}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isSoundEnabled ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                           <motion.div animate={{ x: isSoundEnabled ? 22 : 3 }} className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {visitCount >= 5 && (
              <Link 
                href="/vip-club" 
                onClick={handleNavLinkClick} 
                className="bg-mafia-gold/10 noir-mode:bg-mafia-silver/10 theme-blood:bg-mafia-blood/10 border border-mafia-gold/50 px-6 py-5 flex items-center justify-between active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <Sparkles size={24} className="text-mafia-gold animate-pulse" />
                  <span className="text-lg font-sans font-black text-mafia-gold uppercase">VIP CLUB</span>
                </div>
                <ChevronRight size={20} className="text-mafia-gold" />
              </Link>
            )}

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button onClick={() => { window.location.href = "tel:+420577544073"; handleNavLinkClick(); }} className="bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                 <Phone size={24} className="text-mafia-gold" />
                 <span className="text-[10px] font-sans font-black tracking-widest uppercase text-white">{t?.specialProjects?.callUs || 'ZAVOLAT'}</span>
              </button>
              <button onClick={() => { window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass')); handleNavLinkClick(); }} className="bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                  <Compass size={24} className="text-mafia-gold animate-pulse" />
                  <span className="text-[10px] font-sans font-black tracking-widest uppercase text-white">{t?.header?.navigate || 'NAVIGOVAT'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
