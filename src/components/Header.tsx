"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ChevronDown, ChevronRight, X, Search, Calendar, Compass, Phone, Users, LayoutGrid, Menu, Volume2, VolumeX, Palette, Sparkles, Radio, Briefcase, CreditCard, MapPin, Monitor, Settings, Target, Handshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import dynamic from "next/dynamic";
const AboutMeModal = dynamic(() => import("./AboutMeModal").then(mod => mod.AboutMeModal), { ssr: false });
const ThoughtsModal = dynamic(() => import("./ThoughtsModal").then(mod => mod.ThoughtsModal), { ssr: false });
const VisionModal = dynamic(() => import("./VisionModal").then(mod => mod.VisionModal), { ssr: false });
const WebInfoModal = dynamic(() => import("./WebInfoModal").then(mod => mod.WebInfoModal), { ssr: false });
const PerformanceModal = dynamic(() => import("./PerformanceModal").then(mod => mod.PerformanceModal), { ssr: false });
const GraphicsSettingsModal = dynamic(() => import("./GraphicsSettingsModal").then(mod => mod.GraphicsSettingsModal), { ssr: false });
import { type Language } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { playSound } from "../utils/audio";

const CzFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-4 h-3 md:w-5 md:h-[14px] rounded-[2px] shadow-sm shrink-0">
    <rect fill="#d7141a" width="900" height="600" />
    <rect fill="#fff" width="900" height="300" />
    <polygon fill="#11457e" points="0,0 0,600 450,300" />
  </svg>
);

const GbFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-4 h-3 md:w-5 md:h-[14px] rounded-[2px] shadow-sm shrink-0">
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

const FLAG_MAP: Record<string, React.FC> = {
  cs: CzFlag, en: GbFlag,
};

export function Header() {
  const [clicks, setClicks] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  useEffect(() => {
    const checkModes = () => {
      const html = document.documentElement;
      const hour = new Date().getHours();
      const isNightTime = hour >= 19 || hour < 6;
      
      const hasSpecialMode = html.classList.contains('mode-silver') || 
                           html.classList.contains('mode-blood') || 
                           html.classList.contains('mode-poppy') ||
                           html.classList.contains('mode-noir');
                           
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
  const [isMobile, setIsMobile] = useState(false);
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
  const searchInputRef = useRef<HTMLInputElement>(null);
   const [isSoundEnabled, setIsSoundEnabled] = useState(true);
   const [isRadioPlaying, setIsRadioPlaying] = useState(false);
   const [isGameActive, setIsGameActive] = useState(false);
   const [userAccentColor, setUserAccentColor] = useState<string>("#c5a059");
   const [isCustomLookActive, setIsCustomLookActive] = useState(false);
   const [weaponType, setWeaponType] = useState<'pistol' | 'burst'>('pistol');

  useEffect(() => {
    const savedSound = localStorage.getItem("mmbarber_sound_enabled");
    // Default to DISABLED (false) on first visit
    const initialSound = savedSound === "true";
    setIsSoundEnabled(initialSound);
    if (savedSound === null) {
      localStorage.setItem("mmbarber_sound_enabled", "false");
    }

    const savedWeapon = localStorage.getItem("mmbarber_weapon_type") as 'pistol' | 'burst';
    if (savedWeapon) setWeaponType(savedWeapon);

    // Read accent color from CSS variable or localStorage
    const readAccentColor = () => {
      const saved = localStorage.getItem("mmbarber_user_config");
      const defaultHex = "#c5a059";
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
        } catch {}
      }
      
      // Fallback: read from CSS variable
      const cssColor = getComputedStyle(document.documentElement).getPropertyValue("--user-accent-color").trim().toLowerCase();
      if (cssColor) {
        setUserAccentColor(cssColor);
        const isActive = cssColor !== defaultHex && cssColor !== defaultRgb && cssColor !== "";
        setIsCustomLookActive(isActive);
      } else {
        setIsCustomLookActive(false);
      }
    };
    const handleRadioUpdate = (e: Event) => {
      setIsRadioPlaying((e as CustomEvent).detail);
    };

    const handleGameUpdate = (e: Event) => {
      setIsGameActive((e as CustomEvent).detail);
    };

    readAccentColor();
    window.addEventListener("mmbarber-user-settings-update", readAccentColor);
    window.addEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
    window.addEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
    return () => {
      window.removeEventListener("mmbarber-user-settings-update", readAccentColor);
      window.removeEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
      window.removeEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
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

    window.addEventListener('mmbarber-visit-count-update', handleVisitUpdate as EventListener);
    
    setIsCompassActive(localStorage.getItem("mmbarber_compass_enabled") === "true");
    setIsMobileEffectsEnabled(localStorage.getItem("mmbarber_mobile_effects_enabled") === "true");

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
    };
    
    checkNoirMode();
    window.addEventListener('mmbarber-theme-update', checkNoirMode);
    
    return () => {
      window.removeEventListener('mmbarber-visit-count-update', handleVisitUpdate as EventListener);
      window.removeEventListener('mmbarber-compass-state', handleCompassStateChange as EventListener);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsStateChange as EventListener);
      window.removeEventListener('mmbarber-theme-update', checkNoirMode);
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

  const searchIndex = [
    { keywords: ["barber", "tomáš", "tomas", "nella", "specialista", "specialist", "rezerv", "book", "kadeřník", "holič"], id: "operativi" },
    { keywords: ["informace", "info", "pravidla", "platba", "cash", "parkování", "parking", "vlasy", "hair", "gel", "umyt", "wash", "svátky", "holiday", "calend", "kalendář"], id: "holidays" },
    { keywords: ["kontakt", "contact", "adresa", "address", "telefon", "phone", "mapa", "map", "najít", "find"], id: "kontakt" },
    { keywords: ["ceník", "cena", "price", "services", "služby", "střih", "cut", "vous", "beard", "kombo", "combo", "exclusive", "premium", "fade", "basic"], id: "services" },
    { keywords: ["galerie", "gallery", "foto", "photo", "prostředí", "environment", "salon", "interior"], id: "galerie-prostredi" },
  ];

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const runCommand = (cmd: string) => {
    const query = cmd.toLowerCase().trim();
    setIsConsoleOpen(true);
    setConsoleOutput(["Initializing..."]);
    
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, `Searching database for: ${query}`]);
      
      setTimeout(() => {
        if (query === "odkrýt" || query === "odkryt" || query === "reveal") {
          setConsoleOutput(prev => [...prev, "ACCESS GRANTED.", "Decrypting operative files...", "Profiles revealed."]);
          window.dispatchEvent(new Event("mmbarber-reveal-barbers"));
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => setIsConsoleOpen(false), 3000);
        } else {
          setConsoleOutput(prev => [...prev, "ERROR: Command not found or Access Denied."]);
          playSound("/sounds/vrong.mp3", 0.5);
          setTimeout(() => setIsConsoleOpen(false), 2000);
        }
      }, 800);
    }, 500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    if (query === "odkrýt" || query === "odkryt" || query === "reveal") {
      runCommand(query);
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }

    if (query === "dev") {
      const current = localStorage.getItem("mmbarber_dev_mode") === "true";
      localStorage.setItem("mmbarber_dev_mode", String(!current));
      window.dispatchEvent(new Event("mmbarber-dev-mode-toggle"));
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_dev", { enabled: !current });
      return;
    }

    if (query === "země" || query === "zeme" || query === "earth") {
      setIsSearchOpen(false);
      setSearchQuery("");
      window.dispatchEvent(new Event('mmbarber-earth-protocol'));
      trackEvent("header_search_earth_protocol");
      return;
    }

    if (query === "uživatel" || query === "uzivatel" || query === "nastavení" || query === "nastaveni" || query === "user") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/uzivatel");
      trackEvent("header_search_user_settings");
      return;
    }

    if (query === "vip") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/vip-club");
      trackEvent("header_search_vip_access");
      return;
    }

    if (query === "mák" || query === "maky" || query === "poppy" || query === "veteran") {
      localStorage.setItem("mmbarber_dev_visual_mode", "poppy");
      window.dispatchEvent(new Event("mmbarber-force-theme-eval"));
      setIsSearchOpen(false);
      setSearchQuery("");
      return;
    }

    if (query === "normal") {
      localStorage.setItem("mmbarber_dev_visual_mode", "normal");
      window.dispatchEvent(new Event("mmbarber-force-theme-eval"));
      setIsSearchOpen(false);
      setSearchQuery("");
      return;
    }

    if (query === "737") {
      setIsSearchOpen(false);
      setSearchQuery("");
      window.dispatchEvent(new Event('mmbarber-trigger-737'));
      trackEvent("header_search_737_sequence");
      return;
    }

    if (query === "cheat" || query === "cheaty" || query === "kódy" || query === "kody") {
      setIsSearchOpen(false);
      setSearchQuery("");
      router.push("/the-cheats");
      trackEvent("header_search_cheat_sheet");
      return;
    }

    if (query === "normal") {
      const modeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      modeClasses.forEach(c => document.documentElement.classList.remove(c));
      localStorage.setItem("mmbarber_dev_visual_mode", 'normal');
      window.dispatchEvent(new Event('mmbarber-mode-update'));

      const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('theme-'));
      themeClasses.forEach(c => document.documentElement.classList.remove(c));
      localStorage.removeItem("mmbarber_dev_accent_color");
      window.dispatchEvent(new Event('mmbarber-accent-update'));

      document.documentElement.classList.remove("noir-mode");
      localStorage.setItem("mmbarber_noir_mode", "false");
      localStorage.setItem("mmbarber_game_enabled", "false");
      localStorage.setItem("mmbarber_dev_theme_override", 'default');
      switchLanguage('cs');
      
      window.dispatchEvent(new Event('mmbarber-game-update'));
      window.dispatchEvent(new Event('mmbarber-theme-update'));
      window.dispatchEvent(new Event('mmbarber-dev-mode-toggle'));

      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_reset_all");
      return;
    }

    if (query === "omne" || query === "autor" || query === "micka") {
      setIsAboutMeOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_about_me");
      return;
    }

    if (query === "myslenky" || query === "filozofie" || query === "pravda") {
      setIsThoughtsOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_thoughts");
      return;
    }

    if (query === "vize" || query === "budoucnost" || query === "sny") {
      setIsVisionOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_vision");
      return;
    }

    if (query === "o webu" || query === "owebu" || query === "o-webu" || query === "web") {
      setIsWebInfoOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_web_info");
      return;
    }

    if (query === "výkon" || query === "vykon" || query === "performance" || query === "stats" || query === "diagnostika") {
      setIsPerformanceOpen(true);
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_performance");
      return;
    }

    if (query === "boss") {
      switchLanguage('boss');
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_boss_mode");
      return;
    }

    if (query === "falco" || query === "pes" || query === "dog") {
      switchLanguage('falco');
      
      const classes = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      classes.forEach(c => document.documentElement.classList.remove(c));
      document.documentElement.classList.add('mode-falco');
      localStorage.setItem("mmbarber_dev_visual_mode", "falco");
      window.dispatchEvent(new Event('mmbarber-mode-update'));

      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_falco_mode");
      return;
    }

    if (query === "radio") {
      const current = localStorage.getItem("mmbarber_radio_forced") === "true";
      localStorage.setItem("mmbarber_radio_forced", String(!current));
      window.dispatchEvent(new Event('mmbarber-radio-force-update'));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_radio_toggle", { enabled: !current });
      return;
    }

    if (query === "hry" || query === "games") {
      const current = localStorage.getItem("mmbarber_game_forced") === "true";
      localStorage.setItem("mmbarber_game_forced", String(!current));
      window.dispatchEvent(new Event('mmbarber-game-force-update'));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_game_force");
      return;
    }

    if (query === "legacy" || query === "812" || query === "founder") {
      setIsSearchOpen(false);
      setSearchQuery("");
      const classes = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      classes.forEach(c => document.documentElement.classList.remove(c));
      document.documentElement.classList.add('mode-legacy');
      localStorage.setItem("mmbarber_dev_visual_mode", "legacy");
      window.dispatchEvent(new Event('mmbarber-mode-update'));
      trackEvent("header_search_legacy_mode");
      return;
    }

    if (["matrix", "crt", "pixel", "chaos", "valentine", "halloween", "christmas", "newyear", "czech", "secret", "tajne", "tajně", "patrik", "stpatricks", "patrick", "friday13", "friday15", "witches", "carodejnice", "victory", "vitezstvi", "vítězství"].includes(query)) {
      const themeClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      themeClasses.forEach(c => document.documentElement.classList.remove(c));
      
      let mode = query;
      if (query === 'pixel') mode = 'pixelate';
      if (query === 'tajne' || query === 'tajně') mode = 'secret';
      if (['patrik', 'stpatricks', 'patrick'].includes(query)) mode = 'st-patricks';
      if (query === 'friday15') mode = 'friday13';
      if (query === 'carodejnice') mode = 'witches';
      if (query === 'vitezstvi' || query === 'vítězství') mode = 'victory';

      document.documentElement.classList.add(`mode-${mode}`);
      localStorage.setItem("mmbarber_dev_visual_mode", mode);
      
      window.dispatchEvent(new Event('mmbarber-mode-update'));
      setSearchQuery("");
      setIsSearchOpen(false);
      trackEvent("header_search_visual_mode", { mode });
      return;
    }

    const match = searchIndex.find(item =>
      item.keywords.some(kw => query.includes(kw) || kw.includes(query))
    );

    if (match) {
      if (match.id === "services") {
        router.push("/cenik");
        trackEvent("header_search", { query, matched: "cenik_page" });
      } else {
        const el = document.getElementById(match.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          trackEvent("header_search", { query, matched: match.id });
        }
      }
    } else {
      playSound("/sounds/vrong.mp3", 0.5);
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(prev => {
      if (!prev) setTimeout(() => searchInputRef.current?.focus(), 100);
      return !prev;
    });
  };

  useEffect(() => {
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1280;
    const hasVisited = typeof window !== 'undefined' && localStorage.getItem("mmbarber_visited") === "true";
    
    if (!isMobileDevice && !hasVisited && pathname === "/") {
      setIsIntroActive(true);
    }
    
    const handleIntroDismissed = () => {
       setIsIntroActive(false);
       if (window.scrollY < 10) setIsVisible(true);
    };
    window.addEventListener("introDismissed", handleIntroDismissed);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isIntroActive) return;

      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + (isMobile ? 30 : 10)) {
        setIsVisible(false); // Scrolling down - more threshold for mobile
      } else if (currentScrollY < lastScrollY.current - (isMobile ? 40 : 15)) {
        setIsVisible(true); // Scrolling up - more threshold for mobile
      }
      
      if (!isMobile && !hasVisited && currentScrollY > window.innerHeight * 0.4) {
        localStorage.setItem("mmbarber_visited", "true");
        window.dispatchEvent(new Event("introDismissed"));
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("introDismissed", handleIntroDismissed);
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

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };



  return (
    <>
      <div className={`w-full ${(isIntroActive || pathname === "/") ? 'hidden' : 'h-20 md:h-24 block'}`} aria-hidden="true" />
      <header
        className={`w-full left-0 z-[100100] bg-gradient-to-b from-mafia-black/95 via-mafia-black/70 to-transparent py-4 md:py-6 px-4 md:px-12 flex items-center justify-between transition-all duration-700 pt-[calc(1rem+env(safe-area-inset-top,0px))] gpu-accelerate ${isMenuOpen ? 'fixed top-0 bg-mafia-black h-24 md:h-24' : (isMobile ? 'fixed top-0 bg-mafia-black/90 backdrop-blur-xl h-24' : 'absolute top-0')} ${isIntroActive ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'} ${(!isVisible && !isMenuOpen) ? '-translate-y-full shadow-none' : 'translate-y-0'}`}
      >
        <div className="flex items-center gap-8">
          <button
            onClick={handleLogoClick}
            className="group flex items-center outline-none"
            aria-label="MMBARBER Logo"
          >
            <div className="relative w-12 h-10 md:w-20 md:h-14 flex-shrink-0 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="MM"
                width={80}
                height={56}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative ml-2 flex flex-col justify-center">
              <span 
                ref={logoRef}
                className="text-lg md:text-3xl font-heading font-black text-mafia-gold tracking-widest group-hover:text-smoke-white transition-all duration-300 logo-neon leading-none"
              >
                MMBARBER
              </span>
              <span className="absolute top-[100%] left-0 text-[7px] md:text-[9px] text-mafia-gold/0 group-hover:text-mafia-gold/60 transition-all duration-700 font-mono uppercase tracking-[0.3em] whitespace-nowrap pt-1 blur-sm group-hover:blur-0 translate-y-1 group-hover:translate-y-0 pointer-events-none">
                Z lidí vzniká styl. Ze stylu vzniká značka.
              </span>
            </div>
          </button>
        </div>
        
        {/* Mobile Actions (Top Right) */}
        {isMobile && (
          <div className="flex items-center gap-2 relative z-20">
            {/* Compass integrated into the bar */}
            {!isCompassActive && !isMenuOpen && (
              <button 
                onClick={() => window.dispatchEvent(new Event('mmbarber-toggle-compass'))}
                className="flex items-center gap-2 px-3 py-2.5 bg-mafia-black border-2 border-mafia-gold group hover:bg-mafia-gold/20 transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
              >
                <Compass size={24} className="text-mafia-gold animate-[spin_8s_linear_infinite] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-heading font-black text-mafia-gold tracking-[0.1em] uppercase whitespace-nowrap hidden min-[380px]:inline">{lang === 'cs' ? 'Kompas' : 'Compass'}</span>
              </button>
            )}

            <button
              onClick={toggleMenu}
              className={`flex items-center gap-2 px-4 py-2.5 shadow-[0_0_20px_rgba(197,160,89,0.3)] border-2 transition-all duration-500 ${isMenuOpen ? 'bg-mafia-gold border-white' : 'bg-mafia-black border-mafia-gold group hover:bg-mafia-gold/20'}`}
              aria-label="Open Hamburger Menu"
            >
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black tracking-[0.2em] uppercase leading-none ${isMenuOpen ? 'text-mafia-black' : 'text-mafia-gold'}`}>{isMenuOpen ? (lang === 'cs' ? 'ZAVŘÍT' : 'X') : 'MENU'}</span>
              </div>
              {!isMenuOpen ? (
                <Menu size={24} className="text-mafia-gold transition-all duration-700 group-hover:scale-110" />
              ) : (
                <X size={24} className="text-mafia-black transition-all duration-700 group-hover:scale-110" />
              )}
            </button>
          </div>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-8 font-sans text-sm tracking-widest uppercase text-smoke-white/70">
            {/* Weapon Selector - Only when sound is on */}
            <AnimatePresence>
              {isSoundEnabled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-1 bg-mafia-black/40 border border-mafia-gold/20 p-1 rounded-none mr-4"
                >
                  <button
                    onClick={() => {
                      localStorage.setItem("mmbarber_weapon_type", "pistol");
                      window.dispatchEvent(new CustomEvent('mmbarber-weapon-update', { detail: 'pistol' }));
                      setWeaponType('pistol');
                      playSound("/sounds/magnum.mp3", 0.3);
                    }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${weaponType === 'pistol' ? 'bg-mafia-gold text-mafia-black' : 'text-mafia-gold/40 hover:text-mafia-gold'}`}
                  >
                    Pistole
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("mmbarber_weapon_type", "burst");
                      window.dispatchEvent(new CustomEvent('mmbarber-weapon-update', { detail: 'burst' }));
                      setWeaponType('burst');
                      playSound("/sounds/kulomet.mp3", 0.3);
                    }}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${weaponType === 'burst' ? 'bg-mafia-gold text-mafia-black' : 'text-mafia-gold/40 hover:text-mafia-gold'}`}
                  >
                    Samopal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Link 
              href="/jak-to-chodi" 
              onClick={(e) => {
                trackEvent("nav_link_click", { label: "jak-to-chodi" });
              }} 
              className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2"
            >
              <Compass size={16} style={{ color: userAccentColor }} />
              {t.header.startMission}
            </Link>
            <Link href="/kariera" onClick={() => trackEvent("nav_link_click", { label: "kariera" })} className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2">
              <Briefcase size={16} style={{ color: userAccentColor }} />
              {t.header.career}
            </Link>
            <Link href="/franchise" onClick={() => trackEvent("nav_link_click", { label: "franchise" })} className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2">
              <Handshake size={16} style={{ color: userAccentColor }} />
              {t.header.franchise}
            </Link>
            <Link href="/payment" onClick={() => trackEvent("nav_link_click", { label: "payment" })} className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2">
              <CreditCard size={16} style={{ color: userAccentColor }} />
              {t.header.payment}
            </Link>
            <Link 
              href="/#kontakt" 
              onClick={(e) => {
                trackEvent("nav_link_click", { label: "kontakt" });
                if (pathname === "/") {
                  e.preventDefault();
                  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                }
              }} 
              className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2"
            >
              <MapPin size={16} style={{ color: userAccentColor }} />
              {t.footer.contact}
            </Link>
            <Link 
              href="/specialni-mise" 
              onClick={() => {
                trackEvent("nav_link_click", { label: "designed_by_tm" });
              }} 
              className="hover:text-mafia-gold transition-colors duration-300 flex items-center gap-2"
            >
              <LayoutGrid size={16} style={{ color: userAccentColor }} />
              {t.header.web || "WEB"}
            </Link>

            {/* VIP link removed per user request - access via 'VIP' keyword in search */}
            {visitCount >= 5 && (
              <Link 
                href="/vip-club" 
                onClick={() => trackEvent("nav_link_click", { label: "vip-club-visiting" })} 
                className="text-mafia-gold font-black transition-all duration-300 flex items-center gap-2 hover:scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] ml-4"
              >
                <Sparkles size={16} className="animate-pulse" />
                VIP CLUB
              </Link>
            )}

          {/* Advanced Game-style Search Bar & Action Icons */}
          <div className="relative flex items-center h-full gap-2 ml-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0, x: 20 }}
                    animate={{ width: 220, opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden relative"
                  >
                    {/* Search Field with Shimmer & Scanlines */}
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.header.searchPlaceholder || (lang === 'cs' ? "VYHLEDAT CÍL..." : "LOCATE TARGET...")}
                        className="w-full bg-mafia-black/90 border-2 border-mafia-gold/50 text-white text-[10px] font-mono px-4 py-2 outline-none placeholder:text-mafia-gold/20 focus:border-mafia-gold transition-all tracking-[0.2em] relative z-10"
                        onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                      />
                      {/* Animated Scanline Overlay */}
                      <div className="absolute inset-0 pointer-events-none z-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] opacity-30"></div>
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[1px] bg-mafia-gold/30 shadow-[0_0_10px_var(--color-mafia-gold-glow)] z-30 opacity-50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isSearchOpen && (
                <button 
                  type="submit" 
                  className="text-mafia-gold hover:scale-110 transition-transform p-1"
                >
                  <Search size={18} />
                </button>
              )}
            </form>
            
            <button
              onClick={toggleSearch}
              className={`p-2 transition-all duration-300 rounded-full hover:bg-white/5 group relative ${isSearchOpen ? 'scale-110' : 'hover:scale-110'}`}
              aria-label={lang === 'cs' ? "Vyhledat" : "Search"}
            >
              <Search 
                size={20} 
                className="relative z-10" 
                style={{ 
                  color: userAccentColor, 
                  filter: `drop-shadow(0 0 8px ${userAccentColor}80)`,
                  opacity: isSearchOpen ? 1 : 0.7 
                }} 
              />
              {isSearchOpen && (
                <motion.div
                  layoutId="header-action-glow"
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ backgroundColor: `${userAccentColor}18` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </button>

            {/* Unified Settings Gear */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                onBlur={() => setTimeout(() => setIsSettingsOpen(false), 200)}
                className={`p-2 transition-all duration-500 rounded-full hover:bg-white/5 group relative ${isSettingsOpen ? 'scale-110 bg-white/5' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                aria-label={lang === 'cs' ? "Nastavení" : "Settings"}
              >
                <Settings 
                  size={20} 
                  className={`relative z-10 ${isSettingsOpen ? 'rotate-90' : ''} transition-transform duration-500`}
                  style={{ color: userAccentColor, filter: `drop-shadow(0 0 8px ${userAccentColor}40)` }} 
                />
                {(isRadioPlaying || isGameActive || isCustomLookActive) && !isSettingsOpen && (
                   <div className="absolute top-0 right-0 w-2 h-2 bg-mafia-gold rounded-full shadow-[0_0_8px_var(--color-mafia-gold)] z-20" />
                )}
              </button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-mafia-black border border-mafia-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-[60] flex flex-col gap-1 rounded-sm"
                  >
                    {/* Appearance */}
                    <button
                      onClick={() => {
                        trackEvent("header_user_settings_open");
                        router.push("/uzivatel");
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left"
                    >
                      <Palette size={18} style={{ color: isCustomLookActive ? userAccentColor : undefined }} className={!isCustomLookActive ? "opacity-30" : ""} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {lang === 'cs' ? "Vzhled" : "Appearance"}
                      </span>
                    </button>

                    {/* Sound */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSound(); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left"
                    >
                      {isSoundEnabled ? <Volume2 size={18} style={{ color: userAccentColor }} /> : <VolumeX size={18} className="opacity-30" />}
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {lang === 'cs' ? "Zvuk" : "Sound"}
                      </span>
                    </button>

                    {/* Graphics */}
                    <button
                      onClick={() => {
                        setIsGraphicsOpen(true);
                        setIsSettingsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left"
                    >
                      <Monitor size={18} className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: userAccentColor }} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {lang === 'cs' ? "Grafika" : "Graphics"}
                      </span>
                    </button>

                    {/* Radio */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRadio(); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left"
                    >
                      <Radio size={18} className={isRadioPlaying ? 'animate-pulse' : 'opacity-30'} style={{ color: userAccentColor }} />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {lang === 'cs' ? "Rádio" : "Radio"}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
                onClick={() => window.dispatchEvent(new Event('mmbarber-elita-game-open'))}
                className="p-2 transition-all duration-500 rounded-full hover:bg-white/5 group relative hover:scale-125 ml-1"
                aria-label={lang === 'cs' ? "ELITNÍ STŘELBA" : "ELITE SHOOTING"}
            >
                <Target 
                  size={24} 
                  className="relative z-10 animate-pulse" 
                  style={{ 
                    color: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? '#8b0000' : userAccentColor,
                    filter: `drop-shadow(0 0 10px ${(typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? 'rgba(139,0,0,0.5)' : (userAccentColor + '80')})`
                  }} 
                />
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative group cursor-pointer h-full flex items-center py-2 mx-2">
            <span className="flex items-center gap-1.5 hover:text-mafia-gold transition-colors duration-300">
              {FLAG_MAP[lang] ? React.createElement(FLAG_MAP[lang]) : null}
              {lang.toUpperCase()} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </span>
            <div className="absolute top-full right-0 pt-2 w-44 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 flex flex-col">
              <div className="bg-mafia-black border border-mafia-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 flex flex-col max-h-80 overflow-y-auto">
                {([['cs','Česky'],['en','English']] as [Language, string][]).map(([code, label]) => {
                  const FlagComp = FLAG_MAP[code];
                  return (
                    <button key={code} onClick={() => { switchLanguage(code); trackEvent("nav_language_change", { lang: code }); }} className={`px-4 py-2.5 hover:bg-mafia-dark hover:text-mafia-gold transition-colors text-xs flex items-center gap-2.5 w-full text-left ${lang === code ? 'text-mafia-gold bg-mafia-gold/5' : 'text-smoke-white/70'}`}>
                      {FlagComp ? <FlagComp /> : <span className="w-5 h-3 text-[8px] font-bold text-mafia-gold/40 border border-mafia-gold/20 flex items-center justify-center">{code.toUpperCase()}</span>}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            onClick={() => { 
                setIsMenuOpen(false);
                trackEvent("cta_header_rodina"); 
                playSound("/sounds/naboje.mp3", 0.2);
                router.push("/rodina");
            }}
            className={`group relative overflow-hidden bg-mafia-dark border px-4 md:px-6 py-2 transition-all duration-300 header-booking-btn flex items-center gap-2 ${(!isMobile || isMobileEffectsEnabled) && !activeMode ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`}
            style={{ 
              borderColor: 'var(--user-accent-color)',
              boxShadow: (isMobile && !isMobileEffectsEnabled) ? 'none' : (activeMode ? `0 0 10px var(--user-accent-color)` : '0 0 15px var(--user-accent-color), inset 0 0 10px var(--user-accent-color)'),
              animation: (isMobile && !isMobileEffectsEnabled) || activeMode ? 'none' : undefined
            }}
          >
            <div className="absolute inset-0 block -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0" style={{ backgroundColor: 'var(--user-accent-color)' }}></div>
            <Users size={18} className="relative z-10 transition-colors group-hover:text-black" style={{ color: 'var(--user-accent-color)' }} />
            <span className="relative z-10 font-sans uppercase tracking-[0.2em] font-black group-hover:!text-black transition-colors whitespace-nowrap header-booking-btn-text" style={{ color: 'var(--user-accent-color)' }}>
              {lang === 'cs' ? "Rodina MMBarberu" : "MMBarber Family"}
            </span>
          </button>
        </nav>
        )}
      </header>

      {/* Mobile Navigation Overlay - Windows Mobile inspired tile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 h-[100dvh] bg-mafia-black z-[20000] overflow-y-auto touch-pan-y px-4 py-6 pb-24 overscroll-contain"
          >
            {/* Header in Overlay */}
            <div className="flex items-center justify-between mb-8 overflow-hidden shrink-0">
               <div className="flex items-center">
                  <Image src="/logo.png" alt="MM" width={40} height={32} className="w-10 h-8 object-contain" />
                  <span className="text-xl font-heading font-black text-mafia-gold tracking-widest ml-2">MMBARBER</span>
               </div>
               <button onClick={toggleMenu} className="p-3 bg-mafia-dark/50 rounded-full border border-mafia-gold/30 text-mafia-gold hover:bg-mafia-gold hover:text-mafia-black transition-colors">
                  <X size={40} />
               </button>
            </div>

            {/* Search Bar in Mobile Menu */}
            <div className="mb-6 px-2">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'cs' ? "ZADEJTE CÍL..." : "SEARCH TARGET..."}
                  className="w-full bg-white/5 border-2 border-mafia-gold/30 text-white text-base font-mono px-6 py-4 outline-none focus:border-mafia-gold transition-all tracking-[0.2em] uppercase"
                />
                <div className="absolute top-0 right-0 h-full flex items-center pr-6 pointer-events-none">
                  <Search size={20} className="text-mafia-gold/40" />
                </div>
              </form>
            </div>

            {/* List Menu Layout */}
            <div className="flex flex-col gap-3 mb-8 pb-10">
              {/* LIST MENU TILES - ALPHABETICAL ORDER */}
              <Link href="/jak-to-chodi" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{lang === 'cs' ? 'INSTRUKCE' : 'INSTRUCTIONS'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.startMission}</span>
                </div>
              </Link>

              <Link href="/kariera" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="text-mafia-gold/60">
                   <Briefcase size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">{lang === 'cs' ? 'KARIÉRA' : 'CAREER'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header?.career || 'KARIÉRA'}</span>
                </div>
              </Link>

              <Link href="/franchise" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="text-mafia-gold/60">
                   <Handshake size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">{lang === 'cs' ? 'PODNIKÁNÍ' : 'BUSINESS'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header?.franchise || 'FRANCHISE'}</span>
                </div>
              </Link>

              <Link href="/payment" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="text-white/40">
                   <ChevronDown size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{lang === 'cs' ? 'TRANSAKCE' : 'TRANSACTION'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.payment}</span>
                </div>
              </Link>

              <Link 
                href="/#kontakt" 
                onClick={(e) => {
                  handleNavLinkClick();
                  if (pathname === "/") {
                    e.preventDefault();
                    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                  }
                }} 
                className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left"
              >
                <div className="text-mafia-gold/60">
                   <Phone size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-widest">{lang === 'cs' ? 'SPOJENÍ' : 'CONNECTION'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.footer?.contact || 'KONTAKT'}</span>
                </div>
              </Link>

              {/* VIP link removed per user request - access via 'VIP' keyword in search */}
              {visitCount >= 5 && (
                <Link 
                  href="/vip-club" 
                  onClick={handleNavLinkClick} 
                  className="bg-mafia-gold/10 border border-mafia-gold/30 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left"
                >
                  <div className="text-mafia-gold">
                     <Sparkles size={28} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest">EXKLUZIVNÍ PŘÍSTUP</span>
                     <span className="text-sm font-sans font-black text-mafia-gold uppercase">VIP CLUB</span>
                  </div>
                </Link>
              )}

              {/* COMPASS TOGGLE TILE */}
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass'));
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${isCompassActive ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${isCompassActive ? 'border-mafia-gold bg-mafia-gold/10' : 'border-mafia-gold/30'}`}>
                    <Compass size={28} className={`text-mafia-gold ${isCompassActive ? 'animate-[spin_8s_linear_infinite]' : 'opacity-40'}`} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{t.header.compass || 'KOMPAS'}</span>
                      <div className={`px-1.5 py-0.5 text-[8px] font-black rounded ${isCompassActive ? 'bg-mafia-gold text-mafia-black' : 'bg-white/10 text-white/40'}`}>
                        {isCompassActive ? (t.header.on || 'ZAPNUTO') : (t.header.off || 'VYPNUTO')}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase">{isCompassActive ? (t.header.tracking || 'SLEDUJI POLOHU') : (t.header.savingData || 'ŠETŘÍ DATA')}</span>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isCompassActive ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                   <motion.div 
                     animate={{ x: isCompassActive ? 22 : 4 }}
                     className="w-3 h-3 rounded-full bg-white shadow-sm"
                   />
                </div>
              </button>

              {/* ELITNÍ STŘELBA TILE (Mobile Only Launcher) */}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  window.dispatchEvent(new Event('mmbarber-elita-game-open'));
                }}
                className="bg-white/5 border border-white/10 px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 hover:bg-white/10"
                style={{
                  borderColor: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? 'rgba(139,0,0,0.3)' : undefined,
                  backgroundColor: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? 'rgba(139,0,0,0.05)' : undefined
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center bg-white/5"
                    style={{ borderColor: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? '#8b0000' : userAccentColor }}
                  >
                    <Target size={28} className="animate-pulse" 
                      style={{ color: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? '#8b0000' : userAccentColor }}
                    />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{lang === 'cs' ? 'ELITNÍ STŘELBA' : 'ELITE SHOOTING'}</span>
                    <span className="text-[10px] font-mono uppercase" style={{ color: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? '#8b0000' : userAccentColor }}>{lang === 'cs' ? 'ZÍSKEJ RESPEKT' : 'EARN RESPECT'}</span>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: (typeof document !== 'undefined' && (document.documentElement.classList.contains('mode-blood') || document.documentElement.classList.contains('theme-blood'))) ? '#8b0000' : userAccentColor }} />
              </button>

              {/* EFFECTS TOGGLE TILE */}
              <button 
                onClick={() => {
                  const newState = !isMobileEffectsEnabled;
                  localStorage.setItem("mmbarber_mobile_effects_enabled", String(newState));
                  window.dispatchEvent(new CustomEvent('mmbarber-mobile-effects-update', { detail: newState }));
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${isMobileEffectsEnabled ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${isMobileEffectsEnabled ? 'border-mafia-gold bg-mafia-gold/10' : 'border-mafia-gold/30'}`}>
                    <Sparkles size={28} className={`text-mafia-gold ${isMobileEffectsEnabled ? 'animate-pulse' : 'opacity-40'}`} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{lang === 'cs' ? 'EFEKTY' : 'EFFECTS'}</span>
                      <div className={`px-1.5 py-0.5 text-[8px] font-black rounded ${isMobileEffectsEnabled ? 'bg-mafia-gold text-mafia-black' : 'bg-white/10 text-white/40'}`}>
                        {isMobileEffectsEnabled ? (t.header.on || 'ZAPNUTO') : (t.header.off || 'VYPNUTO')}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase">{isMobileEffectsEnabled ? (lang === 'cs' ? 'PLNÝ ZÁŽITEK' : 'FULL EXPERIENCE') : (lang === 'cs' ? 'ŠETŘÍ BATERII' : 'SAVES BATTERY')}</span>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isMobileEffectsEnabled ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                   <motion.div 
                     animate={{ x: isMobileEffectsEnabled ? 22 : 4 }}
                     className="w-3 h-3 rounded-full bg-white shadow-sm"
                   />
                </div>
              </button>



              {/* SOUNDS TOGGLE TILE */}
              <button 
                onClick={() => {
                  toggleSound();
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${isSoundEnabled ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${isSoundEnabled ? 'border-mafia-gold bg-mafia-gold/10' : 'border-mafia-gold/30'}`}>
                    {isSoundEnabled ? (
                      <Volume2 size={28} className="text-mafia-gold animate-pulse" />
                    ) : (
                      <VolumeX size={28} className="text-mafia-gold opacity-40" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{lang === 'cs' ? 'ZVUK' : 'SOUND'}</span>
                      <div className={`px-1.5 py-0.5 text-[8px] font-black rounded ${isSoundEnabled ? 'bg-mafia-gold text-mafia-black' : 'bg-white/10 text-white/40'}`}>
                        {isSoundEnabled ? (t.header.on || 'ZAPNUTO') : (t.header.off || 'VYPNUTO')}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase">{isSoundEnabled ? (lang === 'cs' ? 'AUDIO AKTIVNÍ' : 'AUDIO ACTIVE') : (lang === 'cs' ? 'TICHO' : 'SILENT')}</span>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 flex items-center ${isSoundEnabled ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                   <motion.div 
                     animate={{ x: isSoundEnabled ? 22 : 4 }}
                     className="w-3 h-3 rounded-full bg-white shadow-sm"
                   />
                </div>
              </button>

              {/* QUICK CALL & MAP TILES (Side by side for these two) */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={() => { window.location.href = "tel:+420577544073"; handleNavLinkClick(); }} className="bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                   <Phone size={32} className="text-mafia-gold" />
                   <span className="text-xs font-sans font-black tracking-widest uppercase text-white">{t.specialProjects?.callUs || 'ZAVOLAT'}</span>
                </button>
                <button onClick={() => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("MMBARBER Mařatice")}`, '_blank'); handleNavLinkClick(); }} className="bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                    <Image src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="Maps" width={32} height={32} className="w-8 h-8 grayscale brightness-150" />
                    <span className="text-xs font-sans font-black tracking-widest uppercase text-white">{t.header.navigate || 'NAVIGOVAT'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Language Utilities */}
            <div className="flex items-center justify-between gap-4">
               <button onClick={() => { switchLanguage('cs'); handleNavLinkClick(); }} className={`flex-1 py-4 border-2 transition-all ${lang === 'cs' ? 'bg-mafia-gold text-mafia-black border-mafia-gold' : 'bg-transparent border-white/10 text-smoke-white/40'} text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2`}>
                 <CzFlag /> ČESKY
               </button>
               <button onClick={() => { switchLanguage('en'); handleNavLinkClick(); }} className={`flex-1 py-4 border-2 transition-all ${lang === 'en' ? 'bg-mafia-gold text-mafia-black border-mafia-gold' : 'bg-transparent border-white/10 text-smoke-white/40'} text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2`}>
                 <GbFlag /> ENGLISH
               </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>


      <AboutMeModal isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />
      <ThoughtsModal isOpen={isThoughtsOpen} onClose={() => setIsThoughtsOpen(false)} />
      <VisionModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <WebInfoModal isOpen={isWebInfoOpen} onClose={() => setIsWebInfoOpen(false)} />
      <PerformanceModal isOpen={isPerformanceOpen} onClose={() => setIsPerformanceOpen(false)} />
      <GraphicsSettingsModal isOpen={isGraphicsOpen} onClose={() => setIsGraphicsOpen(false)} />
      {/* Console Overlay */}
      <AnimatePresence>
        {isConsoleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-10 z-[100] w-[350px] bg-black/90 border border-mafia-gold/30 p-6 font-mono text-[10px] text-mafia-gold shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-sm"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-mafia-gold/10 pb-2">
              <div className="w-2 h-2 rounded-full bg-mafia-gold animate-pulse" />
              <span className="uppercase tracking-[0.2em] font-bold">MM SYSTEM CONSOLE</span>
            </div>
            <div className="space-y-1">
              {consoleOutput.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="opacity-40">{">"}</span>
                  <span className="tracking-widest">{line}</span>
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-1.5 h-3 bg-mafia-gold ml-4 inline-block align-middle"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
