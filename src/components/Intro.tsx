"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "./OptimizedImage";
import gsap from "gsap";
import { useTranslation } from "../hooks/useTranslation";
import { playSound } from "../utils/audio";
import { getVocative } from "../utils/nameInflection";

const CzFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-4 h-3 rounded-[2px] shadow-sm shrink-0">
    <rect fill="#d7141a" width="900" height="600" />
    <rect fill="#fff" width="900" height="300" />
    <polygon fill="#11457e" points="0,0 0,600 450,300" />
  </svg>
);

const GbFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-4 h-3 rounded-[2px] shadow-sm shrink-0">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

interface MenuItem {
  id: string;
  titleCs: string;
  titleEn: string;
}

export function CinematicIntro({ onDismiss }: { onDismiss?: (action?: string) => void }) {
  const { t, lang, switchLanguage } = useTranslation();
  const [isActuallyMobile, setIsActuallyMobile] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const [isLowTier, setIsLowTier] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string>("start");

  const grainRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: "start", titleCs: "Přejít na web", titleEn: "Enter Website" },
    { id: "rezervace", titleCs: "Rezervace", titleEn: "Reservation" },
    { id: "galerie", titleCs: "Galerie", titleEn: "Gallery" },
    { id: "vice", titleCs: "Více o podniku", titleEn: "About Us" },
    { id: "kontakt", titleCs: "Kontakt", titleEn: "Contact" },
  ];

  useEffect(() => {
    const savedName = localStorage.getItem("mmbarber_client_nickname");
    if (savedName) setNickname(savedName);

    // Check if on mobile (intros are bypassed on mobile/tablet for instant interaction)
    if (window.innerWidth < 1024) {
      setIsActuallyMobile(true);
      localStorage.setItem("mmbarber_visited", "true");
      window.dispatchEvent(new Event("introDismissed"));
      onDismiss?.();
      return;
    }

    // Check for low graphics tier
    const tier = document.documentElement.getAttribute('data-graphics-tier');
    if (tier === 'low') {
      setIsLowTier(true);
      localStorage.setItem("mmbarber_visited", "true");
      window.dispatchEvent(new Event("introDismissed"));
      onDismiss?.();
      return;
    }
    
    // Check if visited before
    const hasVisited = localStorage.getItem("mmbarber_visited") === "true";
    if (!hasVisited) {
      setShowIntro(true);
    }
  }, [onDismiss]);

  useEffect(() => {
    if (!showIntro || isDismissed) {
      document.body.style.overflow = '';
      return;
    }
    
    // Hide scrollbar while Intro is active
    document.body.style.overflow = 'hidden';

    // Start fade-in and set menu to active state quickly
    const introTimer = setTimeout(() => {
      setIsAnimating(true);
      setIsFullyOpen(true);
    }, 200);

    // Film grain animation
    const grainAnim = grainRef.current ? gsap.to(grainRef.current, {
      backgroundPosition: "400px 200px",
      duration: 0.1,
      repeat: -1,
      ease: "none",
    }) : null;

    // Random flicker/scratches animation
    const flickerInterval = setInterval(() => {
      if (flickerRef.current) {
        flickerRef.current.style.opacity = (Math.random() * 0.04).toString();
        flickerRef.current.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
      }
    }, 100);

    return () => {
      clearInterval(flickerInterval);
      clearTimeout(introTimer);
      grainAnim?.kill();
      document.body.style.overflow = '';
    };
  }, [showIntro, isDismissed]);

  const handleMouseEnter = (itemId: string) => {
    setHoveredItem(itemId);
    playSound("/sounds/click.mp3", 0.15);
  };

  const handleMenuSelect = (itemId: string) => {
    playSound("/sounds/magnum.mp3", 0.3);
    
    // Add a flash/shake effect to the body for screen feedback
    if (typeof document !== 'undefined') {
      const flash = document.createElement("div");
      flash.className = "fixed inset-0 bg-white z-[99999] pointer-events-none transition-opacity duration-300 opacity-40";
      document.body.appendChild(flash);
      setTimeout(() => {
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 300);
      }, 50);
    }
    
    setIsDismissed(true);
    localStorage.setItem("mmbarber_visited", "true");
    window.dispatchEvent(new Event("introDismissed"));
    
    // Call dismiss with selected action
    onDismiss?.(itemId);
  };

  const renderRightColumnContent = () => {
    switch (hoveredItem) {
      case "start":
        return (
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "MISE // INICIACE" : "MISSION // INITIATION"}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? (nickname ? `VÍTEJ, ${getVocative(nickname).toUpperCase()}` : "VSTOUPIT DO BARBERU") : (nickname ? `WELCOME, ${nickname.toUpperCase()}` : "ENTER THE SALON")}
            </h3>
            <p className="text-sm text-smoke-white/60 leading-relaxed font-sans mt-2">
              {lang === 'cs' 
                ? "Místo pro ty, co nepotřebují vykřikovat svůj styl do světa. Kvalita se pozná i bez zbytečných slov. Vstupte do našeho světa a zažijte poctivé řemeslo."
                : "A place for those who don't need to shout their style to the world. Quality is recognized even without useless words. Enter our world and experience the honest craft."
              }
            </p>
            <div className="border-l-2 border-mafia-gold/30 pl-4 py-1 mt-4 italic text-xs text-mafia-gold/60 font-mono">
              {lang === 'cs'
                ? "„Některá jména se zapomínají. Skutečný charakter zůstává.“"
                : "“Some names are forgotten. Real character remains.”"
              }
            </div>
          </div>
        );
      case "rezervace":
        return (
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "SLUŽBY // OBJEDNÁVKA" : "SERVICES // BOOKING"}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "REZERVAČNÍ PROTOKOL" : "BOOKING PROTOCOL"}
            </h3>
            <p className="text-sm text-smoke-white/60 leading-relaxed font-sans mt-2">
              {lang === 'cs'
                ? "Jedeme podle rezervačního systému. Vyberte si svůj čas a styl. Ceny jsou nastavené férově podle času stráveného v křesle."
                : "We run on a booking system. Select your time and style. Prices are set fairly based on the time spent in the chair."
              }
            </p>
            <div className="flex flex-col gap-2 mt-4 bg-mafia-black/50 border border-mafia-gold/20 p-4 rounded-none">
              <span className="text-[10px] font-mono text-mafia-gold/70 tracking-widest uppercase">
                {lang === 'cs' ? "PODPOROVANÉ PLATBY // PAYMENT METHODS" : "SUPPORTED PAYMENTS"}
              </span>
              <span className="text-sm font-heading font-bold text-smoke-white">
                {lang === 'cs' ? "HOTOVOST / QR PLATBA" : "CASH / QR PAYMENTS"}
              </span>
              <span className="text-[10px] text-smoke-white/40 font-mono italic">
                {lang === 'cs' ? "Pokud vidíš volný termín, je tvůj." : "If you see an opening, it is yours."}
              </span>
            </div>
          </div>
        );
      case "galerie":
        return (
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "VIZUÁLY // HISTORIE" : "VISUALS // HISTORY"}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "FILMOVÝ PÁS A STŘIHY" : "FILM STRIP & CUTS"}
            </h3>
            <p className="text-sm text-smoke-white/60 leading-relaxed font-sans mt-2">
              {lang === 'cs'
                ? "Archivní i detailní snímky z našeho revíru. Nahlédněte pod pokličku naší práce a přesvědčte se o naší preciznosti na vlastní oči."
                : "Archive and detailed shots from our territory. Take a look under the hood of our work and see our precision with your own eyes."
              }
            </p>
            <div className="mt-4 flex gap-2">
              <div className="w-16 h-16 bg-[url('/obr/atmosfera/barber-4.jpg')] bg-cover border border-mafia-gold/20 opacity-60"></div>
              <div className="w-16 h-16 bg-[url('/obr/atmosfera/barber-5.jpg')] bg-cover border border-mafia-gold/20 opacity-60"></div>
              <div className="w-16 h-16 bg-[url('/obr/atmosfera/barber-7.jpg')] bg-cover border border-mafia-gold/20 opacity-60"></div>
            </div>
          </div>
        );
      case "vice":
        return (
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "INFORMACE // KODEX" : "INFORMATION // THE CODE"}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "KODEX RODINY MMBARBER" : "THE CODE OF THE FAMILY"}
            </h3>
            <p className="text-sm text-smoke-white/60 leading-relaxed font-sans mt-2">
              {lang === 'cs'
                ? "To, co se u nás řekne, u nás také zůstane. Jsme bezpečný prostor pro váš odpočinek. Zjistěte více o našem provozu, parkování a chodu."
                : "What is said here, stays here. We are a safe space for your relaxation. Find out more about our operation, parking, and daily business."
              }
            </p>
            <div className="mt-4 border-l border-mafia-red/50 pl-4 py-1 text-xs text-smoke-white/40 font-mono">
              {lang === 'cs' ? "Žádné zbytečné oči, jen ty a tvůj styl." : "No unnecessary eyes, just you and your style."}
            </div>
          </div>
        );
      case "kontakt":
        return (
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "LOKALITA // SPOJENÍ" : "LOCATION // CONTACT"}
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "KUDY K NÁM DO MAŘATIC" : "HOW TO FIND US"}
            </h3>
            <p className="text-sm text-smoke-white/60 leading-relaxed font-sans mt-2">
              {lang === 'cs'
                ? "Sadová 1383, 686 05 Uherské Hradiště 5. Parkování je zcela bezplatné přímo u naší provozovny."
                : "Sadová 1383, 686 05 Uherské Hradiště 5. Parking is completely free right next to our shop."
              }
            </p>
            <div className="mt-4 flex flex-col gap-1 text-[11px] font-mono text-mafia-gold/80">
              <span>{lang === 'cs' ? "MHD: Zastávka Rudy Kubíčka" : "MHD: Rudy Kubicka stop"}</span>
              <span>{lang === 'cs' ? "Waze: Pozor, občas naviguje o dům dál." : "Waze: Watch out, sometimes guides a house away."}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If already dismissed, don't render anything
  if (!showIntro || isDismissed || isLowTier || isActuallyMobile) return null;

  return (
    <div className={`fixed inset-0 w-full h-screen flex flex-col md:flex-row items-stretch justify-start overflow-hidden z-[9990] transition-all duration-1000 ${isAnimating ? 'opacity-100 bg-[#070707]' : 'opacity-0 bg-[#020202] pointer-events-none'} ${isDismissed ? 'pointer-events-none invisible' : ''}`}>
        
        {/* Background Smoke Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-lighten pointer-events-none z-10" 
          src="/smoke.mp4" 
        />

        {/* Cinematic Filters */}
        <div 
          ref={grainRef}
          className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none z-20"
        ></div>

        <div 
          ref={flickerRef}
          className="absolute inset-0 bg-white opacity-0 mix-blend-overlay pointer-events-none transition-opacity duration-75 z-20"
        ></div>

        {/* Dramatic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)] pointer-events-none z-20"></div>

        {/* Left Side: Game Menu */}
        <div className="w-full md:w-[450px] h-full flex flex-col justify-center px-8 md:px-16 z-30 relative bg-black/60 backdrop-blur-sm border-r border-mafia-gold/15">
          {/* Menu Title / Brand Header */}
          <div className="mb-12 flex flex-col gap-2">
            <span className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-[0.4em]">MMBARBER // EST 2024</span>
            <input 
              type="text" 
              placeholder={lang === 'cs' ? "Vaše přezdívka..." : "Your nickname..."}
              value={nickname}
              onChange={(e) => {
                 setNickname(e.target.value);
                 localStorage.setItem("mmbarber_client_nickname", e.target.value);
                 window.dispatchEvent(new Event('mmbarber_ratings_updated'));
              }}
              className="mt-2 mb-2 bg-transparent border-b border-mafia-gold/30 text-smoke-white font-mono text-xs focus:outline-none focus:border-mafia-gold/80 transition-colors w-2/3 pb-1"
            />
            <h2 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,215,0,0.25)]">
              {lang === 'cs' ? "HLAVNÍ MENU" : "MAIN MENU"}
            </h2>
            <div className="w-20 h-[1.5px] bg-mafia-gold/30 mt-1"></div>
          </div>

          {/* Menu Options */}
          {isFullyOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-5"
            >
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onClick={() => handleMenuSelect(item.id)}
                  className="group flex items-center gap-4 py-2 text-left relative focus:outline-none w-fit"
                >
                  {/* Bullet / Line Selector */}
                  <div 
                    className={`w-4 h-[2px] bg-mafia-gold transition-all duration-300 ${
                      hoveredItem === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  />
                  
                  <div className="flex flex-col">
                    <span className={`text-[9px] font-mono transition-colors duration-300 ${
                      hoveredItem === item.id ? "text-mafia-gold/80" : "text-smoke-white/20"
                    }`}>
                      0{index + 1}
                    </span>
                    <span className={`text-xl md:text-2xl font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                      hoveredItem === item.id 
                        ? "text-mafia-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] translate-x-2" 
                        : "text-smoke-white/50 hover:text-smoke-white/80"
                    }`}>
                      {lang === 'cs' ? item.titleCs : item.titleEn}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Footer removed per user request, added Language Switcher instead */}
          <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-4 border-t border-mafia-gold/10 pt-4 w-64">
            <button 
              onClick={() => switchLanguage('cs')} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'cs' ? 'opacity-100' : 'opacity-30 hover:opacity-100 grayscale hover:grayscale-0'}`}
            >
               <CzFlag />
               <span className={`text-[9px] font-mono uppercase tracking-widest ${lang === 'cs' ? 'text-mafia-gold font-bold' : 'text-white'}`}>CS</span>
            </button>
            <div className="w-px h-3 bg-mafia-gold/20" />
            <button 
              onClick={() => switchLanguage('en')} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'en' ? 'opacity-100' : 'opacity-30 hover:opacity-100 grayscale hover:grayscale-0'}`}
            >
               <GbFlag />
               <span className={`text-[9px] font-mono uppercase tracking-widest ${lang === 'en' ? 'text-mafia-gold font-bold' : 'text-white'}`}>EN</span>
            </button>
          </div>
        </div>

        {/* Right Side: Details / Information */}
        <div className="flex-1 h-full hidden md:flex flex-col justify-center items-start px-16 md:px-24 z-30 relative bg-gradient-to-l from-black/80 to-transparent">
          {isFullyOpen && (
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredItem}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full flex flex-col gap-4 border border-mafia-gold/10 bg-mafia-black/40 backdrop-blur-md p-8 shadow-2xl relative"
              >
                {/* Decorative border corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-mafia-gold/40"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-mafia-gold/40"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-mafia-gold/40"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-mafia-gold/40"></div>

                {renderRightColumnContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
  );
}
