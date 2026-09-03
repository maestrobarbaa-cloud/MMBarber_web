"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import gsap from "gsap";
import { ChevronDown, ChevronRight, X, Search, Calendar, Compass, Phone, Users, LayoutGrid, Menu, Volume2, VolumeX, Palette, Sparkles, Radio, Briefcase, CreditCard, MapPin, Monitor, Settings, Target, Handshake, Trophy, Star, Crown, Dices } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import { useHeaderSearch } from "@/hooks/useHeaderSearch";
import { HeaderSearchBar } from "./HeaderSearchBar";
import dynamic from "next/dynamic";
const AboutMeModal = dynamic(() => import("./AboutMeModal").then(mod => mod.AboutMeModal), { ssr: false });
const ThoughtsModal = dynamic(() => import("./ThoughtsModal").then(mod => mod.ThoughtsModal), { ssr: false });
const VisionModal = dynamic(() => import("./VisionModal").then(mod => mod.VisionModal), { ssr: false });
const WebInfoModal = dynamic(() => import("./WebInfoModal").then(mod => mod.WebInfoModal), { ssr: false });
const PerformanceModal = dynamic(() => import("./PerformanceModal").then(mod => mod.PerformanceModal), { ssr: false });
const GraphicsSettingsModal = dynamic(() => import("./GraphicsSettingsModal").then(mod => mod.GraphicsSettingsModal), { ssr: false });
import { type Language } from "../hooks/useTranslation";
import { useUI } from "@/contexts/UIContext";
import { trackEvent } from "../utils/analytics";
import { playSound } from "../utils/audio";
import { getUserRatingsData } from "@/utils/voting";
import { GameFragment } from "./GameFragment";
import { useGame } from "@/contexts/GameContext";
import { getMegaMenuData } from "@/data/megaMenuData";
import { DesktopMegaMenu } from "./DesktopMegaMenu";
import { MobileMegaMenu } from "./MobileMegaMenu";

export function Header() {
  const { mafiaRank } = useGame();
  const [clicks, setClicks] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  useEffect(() => {
    const checkModes = () => {
      const html = document.documentElement;
      const hour = new Date().getHours();
      const isNightTime = hour >= 19 || hour < 6;
      
      const hasSpecialMode = html.classList.contains('theme-silver') || 
                           html.classList.contains('theme-blood') || 
                           html.classList.contains('mode-poppy') ||
                           html.classList.contains('noir-mode');
                           
      if (hasSpecialMode || isNightTime) {
        setActiveMode('night');
      } else {
        setActiveMode(null);
      }
    };

    checkModes();
    
    // Observer for mode changes
    const observer = new MutationObserver(checkModes);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 1280);
  }, []);
  const [isVisible, setIsVisible] = useState(true);
  const [isIntroActive, setIsIntroActive] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const { t, lang, switchLanguage } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isWebInfoOpen, setIsWebInfoOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isGraphicsOpen, setIsGraphicsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  
  const searchProps = useHeaderSearch({
    lang,
    switchLanguage,
    setIsAboutMeOpen,
    setIsThoughtsOpen,
    setIsVisionOpen,
    setIsWebInfoOpen,
    setIsPerformanceOpen
  });
   const [isRadioPlaying, setIsRadioPlaying] = useState(false);
   const [isGameActive, setIsGameActive] = useState(false);
   const [userAccentColor, setUserAccentColor] = useState<string>("var(--color-mafia-gold)");
   const [isCustomLookActive, setIsCustomLookActive] = useState(false);
   const [isOffline, setIsOffline] = useState(false);
   const [isBloodMode, setIsBloodMode] = useState(false);
   const [isNoirMode, setIsNoirMode] = useState(false);
   const [shouldFlashShooting, setShouldFlashShooting] = useState(false);
   const [shouldFlashFamily, setShouldFlashFamily] = useState(false);
   const [shouldFlashRating, setShouldFlashRating] = useState(false);
   const [clientNickname, setClientNickname] = useState<string | null>(null);
   const { isSoundEnabled, setIsSoundEnabled, isStealthMode, setIsStealthMode } = useUI();
   const [geoCity, setGeoCity] = useState<string | null>(null);
   const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

   const megaMenuData = getMegaMenuData(lang);

  useEffect(() => {
    // UIContext now handles stealth mode persistence
    
    const savedCity = localStorage.getItem('mmbarber_geo_city');
    if (savedCity) setGeoCity(savedCity);
    const handleGeofence = (e: Event) => setGeoCity((e as CustomEvent).detail);
    window.addEventListener('mmbarber-geofence', handleGeofence as any);
    
    // Read accent color from CSS variable or localStorage
    const readAccentColor = () => {
      const saved = localStorage.getItem("mmbarber_user_config");
      const defaultHex = "var(--color-mafia-gold)";
      const defaultRgb = "rgb(197, 160, 89)";

      if (saved) {
        try {
          const config = JSON.parse(saved);
          if (config.accentColor) {
            setUserAccentColor(config.accentColor);
            
            // Consider active if anything is different from default
            const isDefault = (config.accentColor.toLowerCase() === defaultHex || config.accentColor === defaultRgb) && 
                             (config.glowIntensity === 50 || config.glowIntensity === undefined) && 
                             (config.fontFamily === '"Courier New", Courier, monospace' || config.fontFamily === undefined);
            setIsCustomLookActive(!isDefault);
            return;
          }
        } catch (e) {}
      }
      
      // Fallback: read from CSS variable
      const cssColor = getComputedStyle(document.documentElement).getPropertyValue("--user-accent-color").trim();
      if (cssColor && cssColor !== "" && !cssColor.includes("NaN")) {
        // If it's an RGB string from computed style, that's fine for simple color props
        // but we should avoid appending hex suffixes to it later.
        setUserAccentColor(cssColor);
        const isActive = cssColor.toLowerCase() !== defaultHex && cssColor !== defaultRgb;
        setIsCustomLookActive(isActive);
      } else {
        setUserAccentColor(defaultHex);
        setIsCustomLookActive(false);
      }
    };
    const handleRadioUpdate = (e: Event) => {
      setIsRadioPlaying((e as CustomEvent).detail);
    };

    const handleGameUpdate = (e: Event) => {
      setIsGameActive((e as CustomEvent).detail);
    };

    const handleGraphicsOpen = () => {
      setIsGraphicsOpen(true);
    };

    readAccentColor();
    window.addEventListener("mmbarber-user-settings-update", readAccentColor);
    window.addEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
    window.addEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
    window.addEventListener("mmbarber-graphics-open", handleGraphicsOpen);

    return () => {
      window.removeEventListener("mmbarber-user-settings-update", readAccentColor);
      window.removeEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
      window.removeEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
      window.removeEventListener("mmbarber-graphics-open", handleGraphicsOpen);
      // stealth update event listener removed
      window.removeEventListener('mmbarber-geofence', handleGeofence as any);
    };
  }, []);

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem("mmbarber_sound_enabled", String(newState));
    window.dispatchEvent(new CustomEvent('mmbarber-sound-update', { detail: newState }));
    trackEvent("header_sound_toggle", { enabled: newState });
  };

  const toggleRadio = () => {
    window.dispatchEvent(new Event('mmbarber-radio-toggle'));
    trackEvent("header_radio_toggle_remote");
  };

  const toggleGame = () => {
    window.dispatchEvent(new Event('mmbarber-game-toggle'));
    trackEvent("header_game_toggle_remote");
  };

  const [isCompassActive, setIsCompassActive] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem('mmbarber_visit_count') || '0');
    setVisitCount(count);

    const handleVisitUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setVisitCount(detail || parseInt(localStorage.getItem('mmbarber_visit_count') || '0'));
    };

    const checkTheme = () => {
      setIsBloodMode(document.documentElement.classList.contains('theme-blood'));
      setIsNoirMode(document.documentElement.classList.contains('noir-mode'));
    };

    window.addEventListener('mmbarber-visit-count-update', handleVisitUpdate as EventListener);
    
    setIsCompassActive(localStorage.getItem("mmbarber_compass_enabled") === "true");
    setIsMobileEffectsEnabled(localStorage.getItem("mmbarber_mobile_effects_enabled") === "true");

    const checkRatingStatus = async () => {
      const { getInternalIdentity } = await import("@/utils/identity");
      const id = await getInternalIdentity();
      const { getTodayMultiVote } = await import("@/utils/voting");
      const votedRatings = await getTodayMultiVote(id);
      setShouldFlashRating(!votedRatings);
    };
    checkRatingStatus();

    const handleCompassStateChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsCompassActive(detail);
    };

    const handleMobileEffectsStateChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };

    window.addEventListener('mmbarber-compass-state', handleCompassStateChange as EventListener);
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsStateChange as EventListener);
    
    // Noir Mode Background logic
    const checkNoirMode = () => {
      const isNoir = document.documentElement.classList.contains('noir-mode');
      setIsNoirModeActive(isNoir);
      checkTheme();
    };
    
    checkNoirMode();
    checkTheme();

    // Check flashing status
    const checkFlashing = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastShootingDate = localStorage.getItem('mmbarber_shooting_last_opened');
      setShouldFlashShooting(lastShootingDate !== today);

      const familyVisited = localStorage.getItem('mmbarber_family_visited') === 'true';
      setShouldFlashFamily(!familyVisited);
    };
    checkFlashing();

    window.addEventListener('mmbarber-theme-update', checkNoirMode);
    window.addEventListener('storage', checkFlashing); // Handle cross-tab updates if any
    
    const checkNickname = () => {
      const data = getUserRatingsData();
      if (data && data.clientNickname) {
        setClientNickname(data.clientNickname);
      } else {
        setClientNickname(null);
      }
    };
    
    checkNickname();
    window.addEventListener('mmbarber_ratings_updated', checkNickname);
    window.addEventListener('storage', checkNickname);
    
    return () => {
      window.removeEventListener('mmbarber_ratings_updated', checkNickname);
      window.removeEventListener('storage', checkNickname);
      window.removeEventListener('mmbarber-visit-count-update', handleVisitUpdate as EventListener);
      window.removeEventListener('mmbarber-compass-state', handleCompassStateChange as EventListener);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsStateChange as EventListener);
      window.removeEventListener('mmbarber-theme-update', checkNoirMode);
      window.removeEventListener('storage', checkFlashing);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsContainerRef.current && !settingsContainerRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isNoirModeActive, setIsNoirModeActive] = useState(false);
  const [isBelowServices, setIsBelowServices] = useState(false);
  const logoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only play if Hero is actually visible
        setIsBelowServices(!entry.isIntersecting); 
      },
      { threshold: 0 }
    );

    const heroSection = document.getElementById('hero');
    if (heroSection) observer.observe(heroSection);

    return () => observer.disconnect();
  }, [pathname]); // Re-run on path change to find element

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Check if it's specifically Blood Mode
    const isBloodMode = typeof document !== 'undefined' && document.documentElement.classList.contains('theme-blood');
    
    const shouldPlay = isNoirModeActive && isBloodMode && !isBelowServices && typeof window !== 'undefined' && window.innerWidth >= 1280 && isSoundEnabled;

    if (shouldPlay) {
      const play = () => {
        playSound("/sounds/neon.mp3", 0.08);
      };
      play();
      interval = setInterval(play, 6000); 
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNoirModeActive, isBelowServices]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1280;
    const hasVisited = typeof window !== 'undefined' && localStorage.getItem("mmbarber_visited") === "true";
    
    if (!isMobileDevice && !hasVisited && pathname === "/") {
      setIsIntroActive(true);
    }
    
    const handleIntroDismissed = () => {
       setIsIntroActive(false);
       setIsVisible(true);
    };
    window.addEventListener("introDismissed", handleIntroDismissed);

    // Safety timeout for Intro - ensure header eventually shows up
    const safetyTimer = setTimeout(() => {
      if (isIntroActive) handleIntroDismissed();
    }, 8000);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (isIntroActive) return;
      
      // ALWAYS visible on mobile/tablet to fix Android visibility issues
      if (isMobile) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setIsVisible(false); // Scrolling down
      } else if (currentScrollY < lastScrollY.current - 15) {
        setIsVisible(true); // Scrolling up
      }
      
      if (!hasVisited && currentScrollY > window.innerHeight * 0.4) {
        localStorage.setItem("mmbarber_visited", "true");
        window.dispatchEvent(new Event("introDismissed"));
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("introDismissed", handleIntroDismissed);
      clearTimeout(safetyTimer);
    };
  }, [pathname, isIntroActive, isVisible, isMobile]);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (newState) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  };

  const handleLogoClick = () => {
    // Increment clicks for the VIP easter egg regardless of path
    setClicks(prev => prev + 1);
    trackEvent("nav_logo_click", { current_path: pathname });

    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => setClicks(0), 1000);

    // Navigate to story page if on home, or back to home if elsewhere
    if (pathname !== "/") {
      router.push("/");
    } else {
      router.push("/pribeh");
    }
  };

  useEffect(() => {
    if (clicks === 5) {
      gsap.to("body", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          router.push("/vip-club");
          setClicks(0);
        }
      });
    }
  }, [clicks, router]);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.settings-container')) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSettingsOpen]);

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };

  const markShootingOpened = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('mmbarber_shooting_last_opened', today);
    setShouldFlashShooting(false);
  };

  const markFamilyOpened = () => {
    localStorage.setItem('mmbarber_family_visited', 'true');
    setShouldFlashFamily(false);
  };

  if (pathname === '/rodina/elektrikari/roman-jakubcak' || pathname === '/rodina/elektrikari/roman-jakubcak/admin') return null;

  return (
    <>
      <AnimatePresence>
        {geoCity && pathname === '/' && localStorage.getItem('mmbarber_geo_city_dismissed') !== 'true' && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 32, opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="fixed top-0 left-0 w-full h-8 z-[35000] bg-mafia-black border-b border-mafia-gold/30 flex items-center justify-center overflow-hidden"
           >
             <div className="flex items-center gap-4 h-full">
                <MapPin size={12} className="text-mafia-gold animate-bounce" />
                <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest whitespace-nowrap truncate max-w-[80vw]">
                  {lang === 'cs' ? `DALEKÁ CESTA Z MĚSTA ${geoCity}? RODINA TĚ VÍTÁ.` : `LONG WAY FROM ${geoCity}? THE FAMILY WELCOMES YOU.`}
                </span>
                <button onClick={() => { setGeoCity(null); localStorage.setItem('mmbarber_geo_city_dismissed', 'true'); }} className="text-white/40 hover:text-white p-1 ml-4">
                  <X size={12} />
                </button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full ${(isIntroActive || pathname === "/") ? 'hidden' : 'h-[calc(88px+env(safe-area-inset-top,0px))] block'} ${geoCity && pathname === '/' && localStorage.getItem('mmbarber_geo_city_dismissed') !== 'true' ? 'mt-8' : ''}`} aria-hidden="true" />
      <header
        className={`fixed w-full left-0 z-[30000] px-4 md:px-12 flex items-center justify-between xl:justify-center xl:gap-16 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[env(safe-area-inset-top,0px)] h-[calc(5.5rem+env(safe-area-inset-top,0px))] gpu-accelerate 
          ${geoCity && pathname === '/' && localStorage.getItem('mmbarber_geo_city_dismissed') !== 'true' ? 'top-8' : 'top-0'}
          ${hoveredCategory ? 'bg-mafia-black border-b border-white/5' : (isScrolled || pathname !== '/' || isMobile ? 'bg-mafia-black/80 backdrop-blur-xl border-b border-white/5' : `bg-transparent border-b border-transparent ${isMenuOpen ? 'bg-mafia-black' : ''}`)} 
          ${(isIntroActive && pathname === "/") 
            ? "xl:opacity-0 xl:-translate-y-[calc(100%+2rem)] xl:pointer-events-none opacity-100 translate-y-0" 
            : (!isVisible && !isMenuOpen && !isMobile) 
              ? "-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none" 
              : "translate-y-0 opacity-100 pointer-events-auto"
          }`}
      >
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="group flex items-center outline-none"
            aria-label="MMBARBER Logo"
          >
            <div className="relative w-10 h-8 md:w-12 md:h-10 flex-shrink-0 transition-transform duration-500 ease-in-out group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="MM"
                width={64}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative ml-2 flex flex-col justify-center">
              <span 
                ref={logoRef}
                className="text-lg md:text-xl font-heading font-black text-mafia-gold noir-mode:text-smoke-white tracking-widest group-hover:text-smoke-white transition-all duration-300 leading-none"
              >
                MMBARBER
              </span>
              <div className="flex items-center gap-1 mt-0.5 opacity-80">
                <Crown size={10} className="text-mafia-gold" />
                <span className="text-[9px] md:text-[10px] font-mono text-mafia-gold uppercase tracking-widest">{mafiaRank}</span>
              </div>
            </div>
          </button>
        </div>
        
        {/* Mobile Actions (Top Right) */}
        <div className="xl:hidden flex items-center gap-2 relative z-[30001]">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'));
              playSound("/sounds/bullet-hit.mp3", 0.4);
            }}
            className="flex items-center gap-2 px-3 py-2.5 bg-mafia-black border-2 border-mafia-gold/50 hover:bg-mafia-gold/20 active:scale-95 transition-all shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.2)]"
            aria-label="Open Compass"
          >
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-black tracking-[0.1em] text-mafia-gold uppercase leading-none">
                {lang === 'cs' ? 'KOMPAS' : 'COMPASS'}
              </span>
            </div>
            <Compass size={22} className="text-mafia-gold animate-pulse" />
          </button>
          
          <button
            onClick={toggleMenu}
            className={`flex items-center gap-2 px-4 py-2.5 shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)] noir-mode:shadow-[0_0_20px_rgba(192,192,192,0.2)] border-2 transition-all duration-500 ${isMenuOpen ? 'bg-mafia-gold noir-mode:bg-mafia-silver theme-blood:bg-mafia-red border-white' : 'bg-mafia-black border-mafia-gold noir-mode:border-mafia-silver theme-blood:border-mafia-red group hover:bg-mafia-gold/20'}`}
            aria-label="Open Hamburger Menu"
          >
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black tracking-[0.2em] uppercase leading-none ${isMenuOpen ? 'text-mafia-black' : 'text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-red'}`}>{isMenuOpen ? (lang === 'cs' ? 'ZAVŘÍT' : '') : 'MENU'}</span>
            </div>
            {!isMenuOpen ? (
              <Menu size={24} className="text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-red transition-all duration-500 group-hover:scale-110" />
            ) : (
              <X size={24} className="text-mafia-black transition-all duration-500 group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
        <nav 
          className="hidden xl:flex items-center gap-8 font-sans text-[11px] tracking-[0.2em] uppercase text-smoke-white/70 h-full relative"
          onMouseLeave={() => setHoveredCategory(null)}
        >
            {Object.entries(megaMenuData).map(([key, data]) => (
              <div 
                key={key} 
                className="h-full flex items-center"
                onMouseEnter={() => setHoveredCategory(key)}
              >
                <Link 
                  href={data.path} 
                  onClick={(e) => {
                    trackEvent("nav_link_click", { label: key });
                    setHoveredCategory(null);
                    if (data.path.includes('#') && pathname === "/") {
                      e.preventDefault();
                      document.querySelector(data.path.replace('/', ''))?.scrollIntoView({ behavior: "smooth" });
                    }
                  }} 
                  className={`transition-colors duration-300 py-6 h-full flex items-center ${hoveredCategory === key ? 'text-mafia-gold' : 'hover:text-mafia-gold'}`}
                >
                  {data.title}
                </Link>
              </div>
            ))}

            {/* VIP link removed per user request - access via 'VIP' keyword in search */}
            {visitCount >= 5 && (
              <Link 
                href="/vip-club" 
                onClick={() => trackEvent("nav_link_click", { label: "vip-club-visiting" })} 
                className="text-mafia-gold font-black transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.5)] ml-4 flex items-center gap-2"
                onMouseEnter={() => setHoveredCategory(null)}
              >
                <Sparkles size={16} className="animate-pulse" />
                VIP CLUB
              </Link>
            )}

          {/* Advanced Game-style Search Bar & Action Icons */}
          <div className="relative flex items-center h-full gap-2 ml-4">
            <HeaderSearchBar lang={lang} t={t} {...searchProps} />

            {clientNickname && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-mafia-gold/25 rounded-sm shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-mafia-gold animate-pulse" />
                <span className="text-[10px] font-heading font-black text-mafia-gold tracking-widest uppercase truncate max-w-[100px]">
                  {clientNickname}
                </span>
              </div>
            )}

          </div>

          <button 
            onClick={() => { 
                markFamilyOpened();
                setIsMenuOpen(false);
                trackEvent("cta_header_rodina"); 
                playSound("/sounds/naboje.mp3", 0.2);
                router.push("/rodina");
            }}
            className={`group relative overflow-hidden bg-mafia-dark border px-6 md:px-8 py-3.5 transition-all duration-300 header-booking-btn flex items-center gap-3 ${isMounted && shouldFlashFamily && (!isMobile || isMobileEffectsEnabled) && !activeMode ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
            style={{ 
              borderColor: 'var(--color-mafia-gold)',
              boxShadow: !isMounted ? 'none' : (isMobile && !isMobileEffectsEnabled) ? 'none' : (activeMode || !shouldFlashFamily ? (shouldFlashFamily ? `0 0 10px var(--color-mafia-gold)` : 'none') : '0 0 15px var(--color-mafia-gold), inset 0 0 10px var(--color-mafia-gold)'),
              animation: !isMounted || (isMobile && !isMobileEffectsEnabled) || activeMode || !shouldFlashFamily ? 'none' : undefined
            }}
          >
            <div className="absolute inset-0 block -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0" style={{ backgroundColor: 'var(--color-mafia-gold)' }}></div>
            <Users size={20} className="relative z-10 transition-colors group-hover:text-black" style={{ color: 'var(--color-mafia-gold)' }} />
            <span className="relative z-10 font-sans uppercase tracking-[0.25em] font-black group-hover:!text-black transition-colors whitespace-nowrap header-booking-btn-text text-xs md:text-sm" style={{ color: 'var(--color-mafia-gold)' }}>
              {lang === 'cs' ? "Rodina MMBarberu" : "MMBarber Family"}
            </span>
          </button>
        </nav>
        
        {/* Apple Style Mega Menu Dropdown */}
        <DesktopMegaMenu 
          lang={lang} 
          hoveredCategory={hoveredCategory} 
          setHoveredCategory={setHoveredCategory} 
          isMenuOpen={isMenuOpen}
          isMobile={isMobile}
          pathname={pathname}
        />
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileMegaMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        lang={lang}
        t={t}
        searchQuery={searchProps.searchQuery}
        setSearchQuery={searchProps.setSearchQuery}
        handleSearch={searchProps.handleSearch}
        shouldFlashFamily={shouldFlashFamily}
        markFamilyOpened={markFamilyOpened}
        shouldFlashShooting={shouldFlashShooting}
        markShootingOpened={markShootingOpened}
        visitCount={visitCount}
      />


      <AboutMeModal isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />
      <ThoughtsModal isOpen={isThoughtsOpen} onClose={() => setIsThoughtsOpen(false)} />
      <VisionModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <WebInfoModal isOpen={isWebInfoOpen} onClose={() => setIsWebInfoOpen(false)} />
      <PerformanceModal isOpen={isPerformanceOpen} onClose={() => setIsPerformanceOpen(false)} />
      <GraphicsSettingsModal isOpen={isGraphicsOpen} onClose={() => setIsGraphicsOpen(false)} />
      <GraphicsSettingsModal isOpen={isGraphicsOpen} onClose={() => setIsGraphicsOpen(false)} />
    </>
  );
}
