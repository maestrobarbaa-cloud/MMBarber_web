"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getActiveTheme } from "@/lib/holidays";
import { getLiveTemperature } from "@/lib/weather";
import { useTranslation } from "@/hooks/useTranslation";
import { MotionConfig } from "framer-motion";
import { useUI } from "@/contexts/UIContext";

const BarberGame = dynamic(() => import("@/components/BarberGame").then(mod => mod.BarberGame), { ssr: false });
const Radio = dynamic(() => import("@/components/Radio").then(mod => mod.Radio), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/CookieBanner").then(mod => mod.CookieBanner), { ssr: false });
const FloatingScissors = dynamic(() => import("@/components/FloatingScissors").then(mod => mod.FloatingScissors), { ssr: false });

const VipControlBar = dynamic(() => import("@/components/VipControlBar").then(mod => mod.VipControlBar), { ssr: false });
const GlobalSound = dynamic(() => import("@/components/GlobalSound").then(mod => mod.GlobalSound), { ssr: false });
const MatrixBackground = dynamic(() => import("@/components/MatrixBackground").then(mod => mod.MatrixBackground), { ssr: false });
const EarthProtocol = dynamic(() => import("@/components/EarthProtocol").then(mod => mod.EarthProtocol), { ssr: false });
const BarberChat = dynamic(() => import("@/components/BarberChat").then(mod => mod.BarberChat), { ssr: false });
const UserSettingsManager = dynamic(() => import("@/components/UserSettingsManager").then(mod => mod.UserSettingsManager), { ssr: false });
const ElitaGame = dynamic(() => import("@/components/ElitaGame").then(mod => mod.ElitaGame), { ssr: false });
const SlotMachine = dynamic(() => import("@/components/SlotMachine").then(mod => mod.SlotMachine), { ssr: false });
const CorporateTricks = dynamic(() => import("@/components/CorporateTricks").then(mod => mod.CorporateTricks), { ssr: false });
const SeasonalAtmosphere = dynamic(() => import("@/components/SeasonalAtmosphere").then(mod => mod.SeasonalAtmosphere), { ssr: false });
export function ClientWrapper() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEarthProtocolOpen, setIsEarthProtocolOpen] = useState(false);
  const [isBarberChatOpen, setIsBarberChatOpen] = useState(false);
  const { isMobileEffectsEnabled, setIsMobileEffectsEnabled, graphicsTier, setGraphicsTier, isStealthMode, atmosphereOverride } = useUI();
  const [themeRevision, setThemeRevision] = useState(0);
  const { lang } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW setup failed', err));
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    const handleEarthProtocolTrigger = () => {
      setIsEarthProtocolOpen(true);
    };

    const handleChatToggle = () => {
      setIsBarberChatOpen(prev => !prev);
    };

    const handleForceThemeEval = () => {
      setThemeRevision(prev => prev + 1);
    };

    // PERFORMANCE & GRAPHICS INITIALIZATION
    const detectPerformance = () => {
      const isMobileDevice = window.innerWidth < 1024;
      const cores = navigator.hardwareConcurrency || 4;
      // @ts-expect-error - experimental API
      const ram = navigator.deviceMemory || 4;
      // @ts-expect-error - experimental API
      const connection = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const isDataSaving = connection?.saveData === true;
      const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === '3g';
      
      let tier: "lite" | "low" | "medium" | "high" | "ultra" | "soft" = "low";
      
      if (isDataSaving || isSlowConnection) {
        return "lite";
      }

      if (isMobileDevice) {
        if (cores >= 8 && ram >= 8) tier = "medium";
        else if (cores <= 2 || ram <= 2) tier = "lite";
        else tier = "low";
      } else {
        // Desktop tiers - MORE RESTRICTIVE
        if (cores >= 12 && ram >= 16) tier = "ultra";
        else if (cores >= 8 && ram >= 12) tier = "high";
        else if (cores >= 6 && ram >= 8) tier = "medium";
        else if (cores <= 2 || ram <= 2) tier = "lite";
        else tier = "low";
      }
      return tier;
    };

    const initializeGraphics = () => {
      const saved = localStorage.getItem("mmbarber_graphics_config");
      let currentTier: any = "low";

      if (saved) {
        try {
          const config = JSON.parse(saved);
          currentTier = config.tier;
        } catch (e) {}
      } else {
        // First time initialization - Add Geo-Language Detection & Faction Assignment
        if (!localStorage.getItem('mmbarber_cohort')) {
           localStorage.setItem('mmbarber_cohort', Math.random() > 0.5 ? 'blood' : 'gold');
        }

        (async () => {
           try {
             const res = await fetch('https://ipapi.co/json/');
             const data = await res.json();
             if (data.country_code === 'CZ') {
               window.dispatchEvent(new CustomEvent('language_changed', { detail: 'cs' }));
               localStorage.setItem('mmbarber_lang', 'cs');
               
               if (data.city && !data.city.includes('Hradiště') && !data.city.includes('Hradiste')) {
                  localStorage.setItem('mmbarber_geo_city', data.city);
                  window.dispatchEvent(new CustomEvent('mmbarber-geofence', { detail: data.city }));
               }
             } else {
               window.dispatchEvent(new CustomEvent('language_changed', { detail: 'en' }));
               localStorage.setItem('mmbarber_lang', 'en');
             }
           } catch (e) {
             console.error("Geo-detection failed", e);
           }
        })();

        // First time initialization
        const detectedTier = detectPerformance();
        currentTier = detectedTier;
        
        // Create initial config - MORE CONSERVATIVE
        const initialConfig = {
          tier: detectedTier,
          grainEnabled: detectedTier === "ultra",
          blurEnabled: detectedTier === "ultra",
          parallaxEnabled: detectedTier === "high" || detectedTier === "ultra",
          animationsEnabled: detectedTier === "high" || detectedTier === "ultra",
          crtEnabled: false,
          glowIntensity: detectedTier === "low" ? 0.2 : 0.4,
          vignetteEnabled: detectedTier === "high" || detectedTier === "ultra",
          chromaticAberration: detectedTier === "ultra",
          letterboxEnabled: false, // Disabled by default as it interferes with the fixed header during zoom
          sharpness: detectedTier === "low" ? 0.1 : 0.3
        };
        
        localStorage.setItem("mmbarber_graphics_config", JSON.stringify(initialConfig));
        
        // Also auto-enable mobile effects if performance is good enough AND not in data-saving mode
        // @ts-expect-error - experimental API
        const connection = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        const isDataSaving = connection?.saveData === true;
        const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === '3g';

        if (window.innerWidth < 1024 && detectedTier !== "low" && !isDataSaving && !isSlowConnection) {
          localStorage.setItem("mmbarber_mobile_effects_enabled", "true");
          setIsMobileEffectsEnabled(true);
        }
      }
      
        if (currentTier === 'low' || currentTier === 'lite') {
          localStorage.setItem("mmbarber_visited", "true");
        }
        
        setGraphicsTier(currentTier);
        document.documentElement.setAttribute('data-graphics-tier', currentTier);
        window.dispatchEvent(new CustomEvent('mmbarber-graphics-update', { detail: { tier: currentTier } }));
      };

    initializeGraphics();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mmbarber-earth-protocol', handleEarthProtocolTrigger as any);
    window.addEventListener('mmbarber-toggle-chat', handleChatToggle as any);
    window.addEventListener('mmbarber-force-theme-eval', handleForceThemeEval);

    setMounted(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mmbarber-earth-protocol', handleEarthProtocolTrigger as any);
      window.removeEventListener('mmbarber-toggle-chat', handleChatToggle as any);
      window.removeEventListener('mmbarber-force-theme-eval', handleForceThemeEval);
    };
  }, []);

  // Sync stealth mode class to DOM
  useEffect(() => {
    if (isStealthMode) {
      document.documentElement.classList.add('mode-stealth');
    } else {
      document.documentElement.classList.remove('mode-stealth');
    }
  }, [isStealthMode]);

  // Theme Management Effect
  useEffect(() => {
    if (!mounted) return;

    if (pathname === "/vip-club") {
      document.documentElement.classList.remove("noir-mode");
      document.documentElement.classList.remove("theme-blood");
      window.dispatchEvent(new Event('mmbarber-theme-update')); // Notify Header
      return;
    }

    // Normal Theme Logic (Silver/Night/Blood)
    const storedNoir = localStorage.getItem('mmbarber_noir_mode');
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;
    const isBloodTime = hour >= 3 && hour < 6;

    if (storedNoir === 'true' || (storedNoir === null && isNight)) {
      document.documentElement.classList.add('noir-mode');
      if (isBloodTime) {
        document.documentElement.classList.add('theme-blood');
      } else {
        document.documentElement.classList.remove('theme-blood');
      }
    } else {
      document.documentElement.classList.remove('noir-mode');
      document.documentElement.classList.remove('theme-blood');
    }

    // Removed legacy mmbarber_dev_visual_mode logic
  }, [pathname, mounted, themeRevision]);

  // Visit Count Logic
  useEffect(() => {
    if (!mounted) return;
    
    const totalVisits = parseInt(localStorage.getItem('mmbarber_visit_count') || '0');
    const newCount = totalVisits + 1;
    localStorage.setItem('mmbarber_visit_count', newCount.toString());
    // Dispatch event so Header can update if needed
    window.dispatchEvent(new CustomEvent('mmbarber-visit-count-update', { detail: newCount }));
  }, [mounted]);




  const [isGalaxyVisible, setIsGalaxyVisible] = useState(false);
  const [activeTheme, setActiveTheme] = useState<any>('default');

  useEffect(() => {
    if (!mounted) return;
    
    const now = new Date();
    const hour = now.getHours();
    
    let isGalaxy = hour >= 22 || hour < 4;
    let currentTheme = getActiveTheme();
    
    if (atmosphereOverride === "galaxy") { 
      isGalaxy = true; 
      currentTheme = 'default'; 
    } else if (atmosphereOverride === "classic") { 
      isGalaxy = false; 
      currentTheme = 'default'; 
    } else if (atmosphereOverride && atmosphereOverride !== 'galaxy') {
      isGalaxy = false;
      currentTheme = atmosphereOverride as any;
    }
    
    if (pathname === '/') {
      if (atmosphereOverride !== 'galaxy') {
         isGalaxy = false;
      }
    }

    setIsGalaxyVisible(isGalaxy);
    setActiveTheme(currentTheme);

    const currentClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
    currentClasses.forEach(c => document.documentElement.classList.remove(c));
    
    const visualThemes = ['matrix', 'crt', 'pixelate', 'vintage', 'noirblue', 'noirred', 'chaos', 'czech', 'friday13', 'legacy', 'secret'];
    if (visualThemes.includes(currentTheme)) {
      document.documentElement.classList.add(`mode-${currentTheme}`);
    }
    
    window.dispatchEvent(new Event('mmbarber-mode-update'));
  }, [mounted, atmosphereOverride, pathname]);

  useEffect(() => {
    if (!mounted) return;
    
    let keySequence = "";
    const targetSequence = "valentyn";
    
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Prevent listening when user is typing in inputs or textareas
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      keySequence += e.key.toLowerCase();
      
      if (keySequence.length > targetSequence.length) {
        keySequence = keySequence.slice(-targetSequence.length);
      }
      
      if (keySequence === targetSequence) {
        // Flash screen effect before redirecting
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.backgroundColor = 'white';
        flash.style.zIndex = '999999';
        flash.style.opacity = '1';
        flash.style.transition = 'opacity 0.5s ease-out';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        
        setTimeout(() => {
          window.location.href = "/valentynmatch";
        }, 100);
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [mounted]);

  if (!mounted) return null;

  const isRodinaPage = pathname === "/rodina";
  const isActuallyMobile = isMobile || (typeof window !== 'undefined' && window.innerWidth < 1024);
  const showEffects = !isActuallyMobile && !isRodinaPage && (graphicsTier === "high" || graphicsTier === "ultra");

  return (
    <MotionConfig reducedMotion={isActuallyMobile || graphicsTier === "low" || graphicsTier === "medium" || graphicsTier === "lite" ? "always" : "user"}>
      {/* Games are currently disabled by request */}
      {/* {showEffects && <BarberGame />} */}
      {/* {showEffects && <BarberChat isOpen={isBarberChatOpen} />} */}
      {showEffects && <Radio />}
      <CorporateTricks />
      <CookieBanner />
      {activeTheme !== 'default' && <SeasonalAtmosphere theme={activeTheme} />}
      {!isActuallyMobile && !isRodinaPage && !isGalaxyVisible && activeTheme === 'default' && graphicsTier !== 'lite' && graphicsTier !== 'low' && <FloatingScissors />}
      <VipControlBar />
      {showEffects && <GlobalSound />}
      {showEffects && <MatrixBackground />}
      <UserSettingsManager />
      {graphicsTier !== 'lite' && <EarthProtocol isOpen={isEarthProtocolOpen} onClose={() => setIsEarthProtocolOpen(false)} lang={lang} />}
      {graphicsTier !== 'lite' && <ElitaGame />}
      {graphicsTier !== 'lite' && <SlotMachine />}
    </MotionConfig>
  );
}
