"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
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
  titleZh?: string;
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
  const [hoveredItem, setHoveredItem] = useState<string>("rezervace");

  const grainRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: "rezervace", titleCs: "Rezervace", titleEn: "Reservation", titleZh: "预约" },
    { id: "start", titleCs: "Přejít na web", titleEn: "Enter Website", titleZh: "进入网站" },
    { id: "galerie", titleCs: "Galerie", titleEn: "Gallery", titleZh: "画廊" },
    { id: "vice", titleCs: "Více o podniku", titleEn: "About Us", titleZh: "关于我们" },
    { id: "komunita", titleCs: "Rodina MM Barber", titleEn: "MM Barber Family", titleZh: "MM Barber 家族" },
    { id: "kontakt", titleCs: "Kontakt", titleEn: "Contact", titleZh: "联系我们" },
    { id: "seznamka", titleCs: "Seznamka", titleEn: "Dating", titleZh: "交友" },
  ];

  useEffect(() => {
    const savedName = localStorage.getItem("mmbarber_client_nickname");
    if (savedName) setNickname(savedName);

    // Mobile intro is now enabled, no longer bypassing.

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

    return () => {
      clearTimeout(introTimer);
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
          <div className="flex flex-col gap-4 text-center items-center">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "MM BARBER // VSTUP" : "MM BARBER // ENTER"}
            </span>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-wider leading-tight">
              {lang === 'cs' ? "Nejsme uzavřený klub" : "We are not a closed club"}
            </h3>
            <p className="text-base text-smoke-white/70 leading-relaxed font-sans mt-2 max-w-lg">
              {lang === 'cs' 
                ? "Jsme místo, do kterého tě srdečně zveme. Místo pro ty, co nepotřebují vykřikovat svůj styl do světa."
                : "We are a place to which we warmly invite you. A place for those who don't need to shout their style to the world."
              }
            </p>
            <div className="border-t border-b border-mafia-gold/30 px-6 py-3 mt-4 italic text-sm text-mafia-gold/80 font-mono">
              {lang === 'cs'
                ? "„Některá jména se zapomínají. Skutečný charakter zůstává.“"
                : "“Some names are forgotten. Real character remains.”"
              }
            </div>
          </div>
        );
      case "rezervace":
        return (
          <div className="flex flex-col items-center w-full">
            <div className="mb-6 md:mb-8 text-center flex flex-col items-center">
              <span className="text-sm md:text-base font-mono text-mafia-gold uppercase tracking-[0.3em] font-black drop-shadow-[0_0_8px_rgba(197,160,89,0.8)] border-b border-mafia-gold/50 pb-1">
                {lang === 'cs' ? 'Parkování zdarma' : 'Free parking'}
              </span>
              <a href="tel:+420577544073" className="text-2xl md:text-3xl font-heading font-black text-smoke-white mt-1 hover:text-mafia-gold transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                +420 577 544 073
              </a>
            </div>

            <div className="flex flex-col md:flex-row gap-10 md:gap-16 justify-center items-center w-full py-2">
              <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.3em] font-black">{lang === 'cs' ? "Zakladatel" : "Founder"}</span>
                <Image src="/obr/tomasmicka.png" alt="Tomáš" width={300} height={300} priority className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-sm border border-mafia-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]" />
                <div className="text-center">
                  <h4 className="text-3xl font-heading font-black text-smoke-white uppercase tracking-wider">Tomáš</h4>
                  <p className="text-xs font-mono text-smoke-white/50 uppercase tracking-widest mt-1">{lang === 'cs' ? "7 let praxe" : "7 years of exp."}</p>
                </div>
                <a href="https://mm.inthechair.com/micka" target="_blank" rel="noopener noreferrer" className="bg-mafia-gold text-black w-full max-w-[280px] md:w-auto px-10 py-4 md:px-8 md:py-3 mt-2 font-black uppercase tracking-widest text-lg md:text-sm text-center hover:bg-white transition-colors shadow-lg">
                  {lang === 'cs' ? "Rezervovat" : "Book"}
                </a>
              </div>
              <div className="flex flex-col items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                <span className="text-[10px] font-mono text-transparent uppercase tracking-[0.3em] font-black select-none hidden md:block">{lang === 'cs' ? "Mezera" : "Space"}</span>
                <Image src="/obr/nellapelikanova.png" alt="Nella" width={300} height={300} priority className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-sm border border-mafia-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]" />
                <div className="text-center">
                  <h4 className="text-3xl font-heading font-black text-smoke-white uppercase tracking-wider">Nella</h4>
                  <p className="text-xs font-mono text-smoke-white/50 uppercase tracking-widest mt-1">{lang === 'cs' ? "3 roky praxe" : "3 years of exp."}</p>
                </div>
                <a href="https://mmbarberx.setmore.com" target="_blank" rel="noopener noreferrer" className="bg-mafia-gold text-black w-full max-w-[280px] md:w-auto px-10 py-4 md:px-8 md:py-3 mt-2 font-black uppercase tracking-widest text-lg md:text-sm text-center hover:bg-white transition-colors shadow-lg">
                  {lang === 'cs' ? "Rezervovat" : "Book"}
                </a>
              </div>
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
          <div className="flex flex-col gap-4 text-left w-full">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "PŘÍBĚH // KODEX" : "THE STORY // THE CODE"}
            </span>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "KODEX A MOJE CESTA" : "THE CODE AND MY JOURNEY"}
            </h3>
            
            <div className="flex flex-col gap-4 text-base md:text-lg text-smoke-white/80 leading-relaxed font-sans mt-4 pr-4 overflow-y-auto max-h-[40vh] md:max-h-[50vh] custom-scrollbar">
              <p>
                {lang === 'cs'
                  ? "Starám se o své lidi, kteří ke mně chodí. Je to místo pro podnikatele a všechny, kdo sdílí podobnou mentalitu. Pomáháme si tu společně růst. Ale pokud tě to nezajímá, můžeš se prostě jen dojít ostříhat, odpočinout si a pokecat."
                  : "I take care of my people who come to me. It's a place for entrepreneurs and all those who share a similar mentality. We help each other grow. But if you're not into that, you can just come for a haircut, relax, and chat."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "Moje cesta začala pár let zpět v Royal Barbershop & Shop. Vystudoval jsem více škol a zaměření, abych své řemeslo ovládl dokonale. Tím to ale neskončilo – na vlastní pěst jsem se ponořil do oborů jako je psychologie a ekonomika, abych pochopil věci v širších souvislostech."
                  : "My journey started a few years ago at Royal Barbershop & Shop. I studied multiple schools and specializations to master my craft perfectly. But it didn't stop there – I taught myself many other fields, from psychology to economics, to understand the bigger picture."
                }
              </p>
              <p>
                {lang === 'cs'
                  ? "A tyhle stránky? Ty stále tvořím sám ve svém volném čase. Vše má svůj čas a kvalitu."
                  : "And this website? I'm still building it myself in my free time. Everything has its time and quality."
                }
              </p>
            </div>

            <div className="mt-4 border-l border-mafia-gold/50 pl-4 py-2 text-sm text-smoke-white/60 font-mono italic">
              {lang === 'cs' ? "Žádné zbytečné oči, jen ty, tvůj styl a loajalita." : "No unnecessary eyes, just you, your style, and loyalty."}
            </div>

            <div className="mt-6 flex justify-end">
              <Image src="/podpis.png" alt="Podpis" width={250} height={120} loading="lazy" className="h-24 md:h-32 w-auto object-contain opacity-100 filter drop-shadow-[0_0_12px_rgba(200,16,46,0.2)]" />
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
      case "komunita":
        return (
          <div className="flex flex-col gap-4 text-center md:text-left w-full h-full items-center md:items-start justify-center md:justify-start">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "MM BARBER // RODINA" : "MM BARBER // FAMILY"}
            </span>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "RODINA MM BARBER" : "MM BARBER FAMILY"}
            </h3>
            <p className="text-sm md:text-base text-smoke-white/60 leading-relaxed font-sans mt-2 max-w-lg">
              {lang === 'cs'
                ? "Není to jen o stříhání. Je to o komunitě, bratrství a stylu, který nás spojuje. Vstup do naší rodiny."
                : "It's not just about haircuts. It's about community, brotherhood, and style. Join our family."}
            </p>
            <div className="mt-8 flex justify-center md:justify-start w-full">
               <button onClick={(e) => { e.preventDefault(); handleMenuSelect('komunita'); }} className="bg-mafia-gold text-black px-8 py-3 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-lg">
                 {lang === 'cs' ? "Vstoupit do rodiny" : "Enter Family"}
               </button>
            </div>
          </div>
        );
      case "seznamka":
        return (
          <div className="flex flex-col gap-4 text-center w-full h-full items-center">
            <span className="text-xs font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "KOMUNITA // SEZNAMKA" : "COMMUNITY // DATING"}
            </span>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "ŽENY V SEZNAMCE" : "WOMEN IN DATING"}
            </h3>
            <p className="text-sm md:text-base text-smoke-white/60 leading-relaxed font-sans mt-2 max-w-lg">
              {lang === 'cs' 
                ? "Místo, kde se prolíná styl s osobností. Prohlédněte si naši galerii a seznamte se."
                : "A place where style meets personality. View our gallery and meet them."}
            </p>
            
            <div className="mt-8 flex flex-row flex-wrap justify-center gap-6 md:gap-10 w-full overflow-y-auto custom-scrollbar md:max-h-[50vh] px-2 pb-4">
              {/* Magda Profile */}
              <div className="flex flex-col items-center group w-full max-w-[240px] md:max-w-[320px]">
                <div className="relative w-full aspect-[3/2] overflow-hidden border border-mafia-gold/20 md:border-mafia-gold/30 md:group-hover:border-mafia-gold/60 transition-colors bg-mafia-dark shadow-xl rounded-sm">
                   <Image src="/obr/seznamka/magda.jpg" alt="Magda" fill className="object-cover object-top md:filter md:grayscale md:group-hover:grayscale-0 transition-all duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   <div className="absolute bottom-4 left-0 right-0 text-center z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-4 md:group-hover:translate-y-0 flex justify-center">
                      <span className="text-[10px] font-mono text-mafia-gold bg-black/80 md:bg-black/60 px-2 py-1 uppercase tracking-widest backdrop-blur-sm">{lang === 'cs' ? "Seznamka" : "Dating"}</span>
                   </div>
                </div>
                <div className="mt-5 text-center w-full">
                  <h4 className="text-xl md:text-2xl font-heading font-black text-smoke-white tracking-widest uppercase mb-1">Magda</h4>
                  <span className="text-[10px] font-mono text-mafia-gold/70 uppercase tracking-widest">{lang === 'cs' ? "Nezávislá žena" : "Independent woman"}</span>
                </div>
              </div>

              {/* Free Slot */}
              <div className="flex flex-col items-center group w-full max-w-[240px] md:max-w-[320px] cursor-pointer" onClick={(e) => { e.preventDefault(); handleMenuSelect('seznamka'); }}>
                <div className="relative w-full aspect-[3/2] overflow-hidden border border-white/5 md:group-hover:border-mafia-gold/40 transition-colors bg-mafia-dark/30 shadow-xl flex items-center justify-center rounded-sm">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   
                   <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center w-full">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-white/20 group-hover:text-mafia-gold group-hover:border-mafia-gold group-hover:scale-110 group-hover:bg-mafia-gold/10 transition-all duration-300">
                         <Plus size={24} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] md:text-[11px] font-sans text-mafia-gold/90 italic opacity-0 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 leading-relaxed font-bold px-4">
                         {lang === 'cs' ? "Tento slot čeká na tebe, princezno... 👑" : "This slot is waiting for you, princess... 👑"}
                      </span>
                   </div>
                   
                   <div className="absolute bottom-4 left-0 right-0 text-center z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-4 md:group-hover:translate-y-0 pointer-events-none flex justify-center">
                      <span className="text-[10px] font-mono text-mafia-gold bg-black/80 md:bg-black/60 px-2 py-1 uppercase tracking-widest backdrop-blur-sm">{lang === 'cs' ? "Seznamka" : "Dating"}</span>
                   </div>
                </div>
                <div className="mt-5 text-center w-full">
                  <h4 className="text-xl md:text-2xl font-heading font-black text-smoke-white/30 tracking-widest uppercase mb-1">{lang === 'cs' ? "Volný slot" : "Free slot"}</h4>
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{lang === 'cs' ? "Neznámá" : "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center w-full">
               <button onClick={(e) => { e.preventDefault(); handleMenuSelect('seznamka'); }} className="bg-mafia-gold text-black w-full max-w-[280px] md:w-auto px-8 py-3 font-black uppercase tracking-widest text-sm text-center hover:bg-white transition-colors shadow-lg">
                 {lang === 'cs' ? "Vstoupit do seznamky" : "Enter Dating"}
               </button>
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
    <div className={`fixed inset-0 w-full h-[100dvh] flex flex-col md:flex-row items-stretch justify-start overflow-y-auto overflow-x-hidden md:overflow-hidden z-[9990] transition-opacity duration-500 will-change-opacity ${isAnimating ? 'opacity-100 bg-[#070707]' : 'opacity-0 bg-[#020202] pointer-events-none'} ${isDismissed ? 'pointer-events-none invisible' : ''}`}>
        
        {/* Simple Background */}
        <div className="absolute inset-0 bg-[#070707] z-10 pointer-events-none"></div>

        {/* Left Side: Game Menu */}
        <div className="w-full md:w-[450px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-16 pt-24 pb-12 md:py-0 z-30 relative bg-black/80 md:bg-black/60 md:backdrop-blur-sm md:border-r border-b md:border-b-0 border-mafia-gold/15">
          {/* Menu Title / Brand Header */}
          <div className="mb-8 md:mb-12 flex flex-col items-center md:items-start gap-2 w-full text-center md:text-left">
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
              className="hidden md:block mt-4 mb-4 bg-transparent border-b border-mafia-gold/30 text-smoke-white font-mono text-sm md:text-base focus:outline-none focus:border-mafia-gold/80 transition-colors w-full md:w-4/5 pb-2 placeholder:text-smoke-white/30"
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
              className="flex flex-col items-center md:items-start gap-6 md:gap-10 mt-4 md:mt-8 w-full"
            >
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onClick={(e) => {
                    if (item.id === 'start') {
                      handleMenuSelect(item.id);
                    } else if (window.innerWidth < 1024) {
                      setHoveredItem(item.id);
                      setTimeout(() => {
                        document.getElementById('intro-right-col')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      handleMenuSelect(item.id);
                    }
                  }}
                  className="group flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4 py-2 md:text-left text-center relative focus:outline-none w-full md:w-fit"
                >
                  {/* Bullet / Line Selector */}
                  <div 
                    className={`hidden md:block w-4 h-[2px] bg-mafia-gold transition-all duration-300 ${
                      hoveredItem === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  />
                  
                  <div className="flex flex-col w-full items-center md:items-start">
                    <span className={`text-[10px] font-mono transition-colors duration-300 ${
                      hoveredItem === item.id ? "text-mafia-gold/80" : "text-smoke-white/20"
                    }`}>
                      0{index + 1}
                    </span>
                    <span className={`text-2xl md:text-2xl w-full md:w-auto font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                      hoveredItem === item.id 
                        ? "bg-mafia-gold text-mafia-black px-6 py-2 md:px-4 md:py-1 md:translate-x-2 shadow-[0_0_20px_rgba(197,160,89,0.4)]" 
                        : "text-smoke-white/50 hover:text-smoke-white/80"
                    }`}>
                      {lang === 'zh' ? (item.titleZh || item.titleEn) : lang === 'cs' ? item.titleCs : item.titleEn}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Language Switcher moved to top on mobile */}
          <div className="absolute top-6 left-6 md:top-auto md:bottom-8 md:left-16 flex items-center gap-4 md:border-t md:border-mafia-gold/10 md:pt-4 w-auto md:w-64 z-50">
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
        <div id="intro-right-col" className="flex-1 w-full md:w-auto md:h-full flex flex-col justify-start md:justify-center items-center px-4 py-8 md:px-24 md:py-0 z-30 relative bg-gradient-to-t md:bg-gradient-to-l from-black/80 to-transparent">
          {isFullyOpen && (
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-full flex flex-col gap-4 border border-mafia-gold/10 bg-mafia-black/80 md:bg-mafia-black/40 md:backdrop-blur-md p-6 md:p-8 shadow-2xl relative will-change-transform ${hoveredItem === 'rezervace' ? 'max-w-4xl' : 'max-w-md'}`}
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
