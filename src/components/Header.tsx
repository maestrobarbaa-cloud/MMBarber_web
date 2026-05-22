"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ChevronDown, ChevronRight, X, Search, Calendar, Compass, Phone, Users, LayoutGrid, Menu, Volume2, VolumeX, Palette, Sparkles, Radio, Briefcase, CreditCard, MapPin, Monitor, Settings, Target, Handshake, Trophy, Star, Crown } from "lucide-react";
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
import { getUserRatingsData } from "@/utils/voting";
import { GameFragment } from "./GameFragment";

export function Header() {
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const settingsContainerRef = useRef<HTMLDivElement>(null);
   const [isSoundEnabled, setIsSoundEnabled] = useState(true);
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

  useEffect(() => {
    const savedSound = localStorage.getItem("mmbarber_sound_enabled");
    // Default to DISABLED (false) on first visit
    const initialSound = savedSound === "true";
    setIsSoundEnabled(initialSound);
    if (savedSound === null) {
      localStorage.setItem("mmbarber_sound_enabled", "false");
    }


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
        } catch {}
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

    const handleSoundToggleRemote = () => {
      const savedSound = localStorage.getItem("mmbarber_sound_enabled");
      setIsSoundEnabled(savedSound === "true");
    };

    readAccentColor();
    window.addEventListener("mmbarber-user-settings-update", readAccentColor);
    window.addEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
    window.addEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
    window.addEventListener("mmbarber-graphics-open", handleGraphicsOpen);
    window.addEventListener("mmbarber-sound-update-remote", handleSoundToggleRemote);

    return () => {
      window.removeEventListener("mmbarber-user-settings-update", readAccentColor);
      window.removeEventListener("mmbarber-radio-update", handleRadioUpdate as EventListener);
      window.removeEventListener("mmbarber-game-status-update", handleGameUpdate as EventListener);
      window.removeEventListener("mmbarber-graphics-open", handleGraphicsOpen);
      window.removeEventListener("mmbarber-sound-update-remote", handleSoundToggleRemote);
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

  const searchIndex = [
    { keywords: ["barber", "tomáš", "tomas", "specialista", "specialist", "rezerv", "book", "kadeřník", "holič", "operativci"], id: "operativi" },
    { keywords: ["informace", "info", "pravidla", "platba", "cash", "parkování", "parking", "vlasy", "hair", "gel", "umyt", "wash", "svátky", "holiday", "calend", "kalendář"], id: "holidays" },
    { keywords: ["kontakt", "contact", "adresa", "address", "telefon", "phone", "mapa", "map", "najít", "find"], id: "kontakt" },
    { keywords: ["ceník", "cena", "price", "services", "služby", "střih", "cut", "vous", "beard", "kombo", "combo", "exclusive", "premium", "fade", "basic"], id: "services" },
    { keywords: ["galerie", "gallery", "foto", "photo", "prostředí", "environment", "salon", "interior"], id: "galerie-prostredi" },
    { keywords: ["hodnocení", "hodnoceni", "přezdívky", "prezdivky", "rating", "nicknames", "elita", "elite"], id: "hodnoceni_page" },
  ];

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const runCommand = (cmd: string) => {
    const query = cmd.toLowerCase().trim();
    setIsConsoleOpen(true);
    setConsoleOutput(lang === 'cs' ? ["Inicializace..."] : ["Initializing..."]);
    
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, lang === 'cs' ? `Vyhledávání v databázi pro: ${query}` : `Searching database for: ${query}`]);
      
      setTimeout(() => {
        if (query === "intro" || query === "menu" || query === "welcome") {
          localStorage.removeItem("mmbarber_visited");
          const csIntroReset = ["RESETOVÁNÍ PŘÍZNAKU NÁVŠTĚVY...", "SPUŠTĚNÍ UVÍTACÍHO MENU...", "ČEKEJTE."];
          const enIntroReset = ["RESETTING VISIT FLAG...", "LAUNCHING WELCOME MENU...", "STAND BY."];
          setConsoleOutput(prev => [...prev, ...(lang === 'cs' ? csIntroReset : enIntroReset)]);
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => {
            setIsConsoleOpen(false);
            window.dispatchEvent(new Event("mmbarber-trigger-intro"));
          }, 1800);
        } else if (query === "odkrýt" || query === "odkryt" || query === "reveal") {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "PŘÍSTUP POVOLEN." : "ACCESS GRANTED.", lang === 'cs' ? "Dešifrování operativních souborů..." : "Decrypting operative files...", lang === 'cs' ? "Profily odhaleny." : "Profiles revealed."]);
          window.dispatchEvent(new Event("mmbarber-reveal-barbers"));
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => setIsConsoleOpen(false), 3000);
        } else if (query === "admin") {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "DETEKOVÁNO ADMINISTRÁTORSKÉ OPRÁVNĚNÍ." : "ADMIN CLEARANCE DETECTED.", lang === 'cs' ? "Přesměrování na centrální velitelství..." : "Redirecting to central command...", lang === 'cs' ? "Čekejte." : "Stand by."]);
          playSound("/sounds/success.mp3", 0.5);
          setTimeout(() => {
            setIsConsoleOpen(false);
            router.push("/admin");
          }, 2000);
        } else {
          setConsoleOutput(prev => [...prev, lang === 'cs' ? "CHYBA: Příkaz nenalezen nebo přístup odepřen." : "ERROR: Command not found or Access Denied."]);
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

    if (query === "intro" || query === "menu" || query === "welcome" || query === "odkrýt" || query === "odkryt" || query === "reveal" || query === "admin") {
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

    if (query === "galaxy" || query === "noc" || query === "night") {
      localStorage.setItem("mmbarber_atmosphere_override", "galaxy");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_atmosphere_galaxy");
      return;
    }

    if (query === "classic" || query === "den" || query === "day" || query === "standard") {
      localStorage.setItem("mmbarber_atmosphere_override", "classic");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
      trackEvent("header_search_atmosphere_classic");
      return;
    }

    if (query === "auto" || query === "reset") {
      localStorage.removeItem("mmbarber_atmosphere_override");
      window.dispatchEvent(new Event("mmbarber-atmosphere-update"));
      setIsSearchOpen(false);
      setSearchQuery("");
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
      } else if (match.id === "hodnoceni_page") {
        router.push("/hodnoceni");
        trackEvent("header_search", { query, matched: "hodnoceni_page" });
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



  return (
    <>

      <div className={`w-full ${(isIntroActive || pathname === "/") ? 'hidden' : 'h-[calc(88px+env(safe-area-inset-top,0px))] block'}`} aria-hidden="true" />
      <header
        className={`fixed top-0 w-full left-0 z-[30000] px-4 md:px-12 flex items-center justify-between xl:justify-center xl:gap-16 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[env(safe-area-inset-top,0px)] h-[calc(5.5rem+env(safe-area-inset-top,0px))] gpu-accelerate 
          ${isScrolled || pathname !== '/' || isMobile ? 'bg-mafia-black/80 backdrop-blur-xl border-b border-white/5' : `bg-transparent border-b border-transparent ${isMenuOpen ? 'bg-mafia-black' : ''}`} 
          ${(isIntroActive && pathname === "/") 
            ? "xl:opacity-0 xl:-translate-y-full xl:pointer-events-none opacity-100 translate-y-0" 
            : (!isVisible && !isMenuOpen && !isMobile) 
              ? "-translate-y-full opacity-0 pointer-events-none" 
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
                className="text-lg md:text-xl font-heading font-black text-mafia-gold noir-mode:text-smoke-white tracking-widest group-hover:text-smoke-white transition-all duration-300 logo-neon leading-none"
              >
                MMBARBER
              </span>
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
        <nav className="hidden xl:flex items-center gap-8 font-sans text-[11px] tracking-[0.2em] uppercase text-smoke-white/70">

            <Link 
              href="/jak-to-chodi" 
              onClick={(e) => {
                trackEvent("nav_link_click", { label: "jak-to-chodi" });
              }} 
              className="hover:text-mafia-gold transition-colors duration-300"
            >
              {t.header.startMission}
            </Link>
            <Link href="/pribeh" onClick={() => trackEvent("nav_link_click", { label: "pribeh" })} className="hover:text-mafia-gold transition-colors duration-300">
              {t.header.aboutUs}
            </Link>

            <Link 
              href="/#services" 
              onClick={(e) => {
                trackEvent("nav_link_click", { label: "sluzby" });
                if (pathname === "/") {
                  e.preventDefault();
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                }
              }} 
              className="hover:text-mafia-gold transition-colors duration-300"
            >
              {t.header.services}
            </Link>

            <Link 
              href="/cenik" 
              onClick={() => trackEvent("nav_link_click", { label: "cenik" })} 
              className="hover:text-mafia-gold transition-colors duration-300"
            >
              {t.header.priceList}
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
              className="hover:text-mafia-gold transition-colors duration-300"
            >
              {t.header.kudy_k_nam}
            </Link>
            <Link 
              href="/specialni-mise" 
              onClick={() => {
                trackEvent("nav_link_click", { label: "designed_by_tm" });
              }} 
              className="hover:text-mafia-gold transition-colors duration-300"
            >
              {t.header.web || "WEB"}
            </Link>

            {/* VIP link removed per user request - access via 'VIP' keyword in search */}
            {visitCount >= 5 && (
              <Link 
                href="/vip-club" 
                onClick={() => trackEvent("nav_link_click", { label: "vip-club-visiting" })} 
                className="text-mafia-gold font-black transition-all duration-300 hover:scale-110 drop-shadow-[0_0_8px_rgba(var(--color-mafia-gold-rgb),0.5)] ml-4 flex items-center gap-2"
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
                        id="header-search-desktop"
                        type="text"
                        aria-label={lang === 'cs' ? "Vyhledat" : "Search"}
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
                  className="text-mafia-gold hover:scale-110 transition-transform p-1 animate-pulse"
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
              <Search size={20} className="relative z-10 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--user-accent-color)', filter: `drop-shadow(0 0 8px var(--user-glow-color))` }} />
            </button>

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
      </header>

      {/* Mobile Navigation Overlay - Windows Mobile inspired tile menu */}
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
               {/* Close button removed here because the main header button now stays on top */}
            </div>

            {/* Search Bar in Mobile Menu */}
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

            {/* List Menu Layout */}
            <div className="flex flex-col gap-3 mb-8 pb-10">
              {/* LIST MENU TILES - ALPHABETICAL ORDER */}
              <Link href="/jak-to-chodi" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{lang === 'cs' ? 'INSTRUKCE' : 'INSTRUCTIONS'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.startMission}</span>
                </div>
              </Link>

              <Link href="/pribeh" onClick={handleNavLinkClick} className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left">
                <div className="text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60">
                   <Users size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60 uppercase tracking-widest">{lang === 'cs' ? 'NÁŠ PŘÍBĚH' : 'OUR STORY'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.aboutUs}</span>
                </div>
              </Link>



              <Link 
                href="/#services" 
                onClick={(e) => {
                  handleNavLinkClick();
                  if (pathname === "/") {
                    e.preventDefault();
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  }
                }} 
                className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left"
              >
                <div className="text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60">
                   <Briefcase size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60 uppercase tracking-widest">{lang === 'cs' ? 'NABÍDKA' : 'OFFER'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.services}</span>
                </div>
              </Link>

              <Link 
                href="/cenik" 
                onClick={handleNavLinkClick} 
                className="bg-white/5 border border-white/10 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left"
              >
                <div className="text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60">
                   <CreditCard size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60 uppercase tracking-widest">{lang === 'cs' ? 'TARIF' : 'TARIFF'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.priceList}</span>
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
                <div className="text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60">
                   <MapPin size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-mafia-gold/60 noir-mode:text-mafia-silver/60 theme-blood:text-mafia-blood/60 uppercase tracking-widest">{lang === 'cs' ? 'SPOJENÍ' : 'CONNECTION'}</span>
                   <span className="text-sm font-sans font-bold text-smoke-white uppercase">{t.header.kudy_k_nam}</span>
                </div>
              </Link>

              {/* VIP link removed per user request - access via 'VIP' keyword in search */}
              {visitCount >= 5 && (
                <Link 
                  href="/vip-club" 
                  onClick={handleNavLinkClick} 
                  className="bg-mafia-gold/10 noir-mode:bg-mafia-silver/10 theme-blood:bg-mafia-blood/10 border border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-blood/30 px-6 py-5 flex items-center justify-start gap-5 active:scale-95 transition-transform text-left"
                >
                  <div className="text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-blood">
                     <Sparkles size={28} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-mono text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-blood uppercase tracking-widest">EXKLUZIVNÍ PŘÍSTUP</span>
                     <span className="text-sm font-sans font-black text-mafia-gold noir-mode:text-mafia-silver theme-blood:text-mafia-blood uppercase">VIP CLUB</span>
                  </div>
                </Link>
              )}

               {/* RODINA MMBARBERU TILE (Mobile) */}
              <button 
                onClick={() => {
                  markFamilyOpened();
                  handleNavLinkClick();
                  router.push("/rodina");
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${shouldFlashFamily ? 'border-mafia-gold bg-mafia-gold/5 animate-pulse shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.2)]' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${shouldFlashFamily ? 'border-mafia-gold bg-mafia-gold/20' : 'border-white/20'}`}>
                    <Users size={28} className={shouldFlashFamily ? 'text-mafia-gold' : 'text-white/40'} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{lang === 'cs' ? 'RODINA' : 'FAMILY'}</span>
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase">{lang === 'cs' ? 'STAŇ SE ČLENEM' : 'BECOME A MEMBER'}</span>
                  </div>
                </div>
                <ChevronRight size={20} className={shouldFlashFamily ? 'text-mafia-gold' : 'text-white/20'} />
              </button>

              {/* HODNOCENÍ ELITY TILE (Mobile) */}
              <button 
                onClick={() => {
                  handleNavLinkClick();
                  router.push("/hodnoceni");
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 hover:bg-white/10 ${shouldFlashRating ? 'border-mafia-gold bg-mafia-gold/5 animate-pulse' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-500 ${shouldFlashRating ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.3)]' : 'border-white/20'}`}>
                    <Crown size={28} className={shouldFlashRating ? 'text-mafia-gold' : 'text-white/40'} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{t.header.ratingAndNicknames}</span>
                    <span className="text-[10px] font-mono text-mafia-gold/40 uppercase">{lang === 'cs' ? 'KOMUNITNÍ HLASOVÁNÍ' : 'COMMUNITY VOTING'}</span>
                  </div>
                </div>
                <ChevronRight size={20} className={shouldFlashRating ? 'text-mafia-gold' : 'text-white/20'} />
              </button>

              {/* ELITNÍ STŘELBA TILE (Mobile Only Launcher) */}
              <button 
                onClick={() => {
                  markShootingOpened();
                  setIsMenuOpen(false);
                  window.dispatchEvent(new Event('mmbarber-elita-game-open'));
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 hover:bg-white/10 ${shouldFlashShooting ? 'border-mafia-gold bg-mafia-gold/5 animate-pulse' : 'border-white/10'}`}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-700 bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    style={{ borderColor: shouldFlashShooting ? 'var(--color-mafia-gold)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <Trophy 
                      size={20} 
                      className="transition-all duration-700"
                      style={{ color: shouldFlashShooting ? (isBloodMode ? 'var(--color-mafia-blood)' : 'var(--color-mafia-gold)') : 'rgba(255,255,255,0.4)' }}
                    />
                    {shouldFlashShooting && (
                      <div className="absolute -top-1 -right-1 flex flex-col gap-0.5">
                        <div className="w-4 h-[1px] bg-white opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-xl font-sans font-black text-smoke-white uppercase tracking-widest">{lang === 'cs' ? 'STŘELBA' : 'SHOOTING'}</span>
                    <span className="text-[10px] font-mono uppercase" style={{ color: shouldFlashShooting ? 'var(--color-mafia-gold)' : 'rgba(255,255,255,0.3)' }}>{lang === 'cs' ? 'ZÍSKEJ RESPEKT' : 'EARN RESPECT'}</span>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: shouldFlashShooting ? 'var(--color-mafia-gold)' : 'rgba(255,255,255,0.2)' }} />
              </button>

              {/* EFFECTS TOGGLE TILE */}
              <button 
                onClick={() => {
                  const newState = !isMobileEffectsEnabled;
                  localStorage.setItem("mmbarber_mobile_effects_enabled", String(newState));
                  window.dispatchEvent(new CustomEvent('mmbarber-mobile-effects-update', { detail: newState }));
                }}
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${isMobileEffectsEnabled ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.1)]' : 'border-white/10'}`}
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
                className={`bg-white/5 border px-6 py-6 flex items-center justify-between active:scale-95 transition-all duration-500 ${isSoundEnabled ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.1)]' : 'border-white/10'}`}
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
                <button onClick={() => { window.dispatchEvent(new CustomEvent('mmbarber-toggle-compass')); handleNavLinkClick(); }} className="bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
                    <Compass size={32} className="text-mafia-gold animate-pulse" />
                    <span className="text-xs font-sans font-black tracking-widest uppercase text-white">{t.header.navigate || 'NAVIGOVAT'}</span>
                </button>
              </div>
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
