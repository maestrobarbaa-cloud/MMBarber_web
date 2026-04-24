"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getActiveTheme } from "@/lib/holidays";
import { getLiveTemperature } from "@/lib/weather";
import { useTranslation } from "@/hooks/useTranslation";
import { MotionConfig } from "framer-motion";

const BarberGame = dynamic(() => import("@/components/BarberGame").then(mod => mod.BarberGame), { ssr: false });
const Radio = dynamic(() => import("@/components/Radio").then(mod => mod.Radio), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/CookieBanner").then(mod => mod.CookieBanner), { ssr: false });
const FloatingScissors = dynamic(() => import("@/components/FloatingScissors").then(mod => mod.FloatingScissors), { ssr: false });
const MobileCompass = dynamic(() => import("@/components/MobileCompass").then(mod => mod.MobileCompass), { ssr: false });

const VipControlBar = dynamic(() => import("@/components/VipControlBar").then(mod => mod.VipControlBar), { ssr: false });
const GlobalSound = dynamic(() => import("@/components/GlobalSound").then(mod => mod.GlobalSound), { ssr: false });
const MatrixBackground = dynamic(() => import("@/components/MatrixBackground").then(mod => mod.MatrixBackground), { ssr: false });
const EarthProtocol = dynamic(() => import("@/components/EarthProtocol").then(mod => mod.EarthProtocol), { ssr: false });
const BarberChat = dynamic(() => import("@/components/BarberChat").then(mod => mod.BarberChat), { ssr: false });
const UserSettingsManager = dynamic(() => import("@/components/UserSettingsManager").then(mod => mod.UserSettingsManager), { ssr: false });
const InstagramPopup = dynamic(() => import("@/components/InstagramPopup").then(mod => mod.InstagramPopup), { ssr: false });
const ElitaGame = dynamic(() => import("@/components/ElitaGame").then(mod => mod.ElitaGame), { ssr: false });

export function ClientWrapper() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isEarthProtocolOpen, setIsEarthProtocolOpen] = useState(false);
  const [isBarberChatOpen, setIsBarberChatOpen] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<"low" | "medium" | "high" | "ultra">("low");
  const [themeRevision, setThemeRevision] = useState(0);
  const { lang } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    
    const handleEarthProtocolTrigger = () => {
      setIsEarthProtocolOpen(true);
    };

    const handleChatToggle = () => {
      setIsBarberChatOpen(prev => !prev);
    };

    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
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
      
      let tier: "low" | "medium" | "high" | "ultra" = "low";
      
      // If data saving or slow connection, always force low tier regardless of hardware
      if (isDataSaving || isSlowConnection) {
        return "low";
      }

      if (isMobileDevice) {
        // Mobile defaults to low, medium only for high-end (e.g. 8 cores, 6GB+ RAM)
        tier = (cores >= 8 && ram >= 6) ? "medium" : "low";
      } else {
        // Desktop tiers
        if (cores >= 8 && ram >= 8) tier = "ultra";
        else if (cores >= 6 && ram >= 6) tier = "high";
        else if (cores >= 4 && ram >= 4) tier = "medium";
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
        // First time initialization - Add Geo-Language Detection
        (async () => {
           try {
             const res = await fetch('https://ipapi.co/json/');
             const data = await res.json();
             if (data.country_code === 'CZ') {
               window.dispatchEvent(new CustomEvent('language_changed', { detail: 'cs' }));
               localStorage.setItem('mmbarber_lang', 'cs');
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
        
        // Create initial config
        const initialConfig = {
          tier: detectedTier,
          grainEnabled: detectedTier !== "low",
          blurEnabled: detectedTier === "high" || detectedTier === "ultra",
          parallaxEnabled: detectedTier !== "low",
          animationsEnabled: detectedTier !== "low",
          crtEnabled: false,
          glowIntensity: detectedTier === "low" ? 0.2 : 0.6,
          vignetteEnabled: detectedTier !== "low",
          chromaticAberration: detectedTier === "high" || detectedTier === "ultra",
          letterboxEnabled: detectedTier === "ultra",
          sharpness: detectedTier === "low" ? 0.2 : 0.5
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
      
        if (currentTier === 'low') {
          localStorage.setItem("mmbarber_visited", "true");
        }
        
        setGraphicsTier(currentTier);
        document.documentElement.setAttribute('data-graphics-tier', currentTier);
      };

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);

    initializeGraphics();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mmbarber-earth-protocol', handleEarthProtocolTrigger as any);
    window.addEventListener('mmbarber-toggle-chat', handleChatToggle as any);
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as any);
    window.addEventListener('mmbarber-force-theme-eval', handleForceThemeEval);
    
    setMounted(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mmbarber-earth-protocol', handleEarthProtocolTrigger as any);
      window.removeEventListener('mmbarber-toggle-chat', handleChatToggle as any);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as any);
      window.removeEventListener('mmbarber-force-theme-eval', handleForceThemeEval);
    };
  }, []);

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

    // Restore Visual Mode Logic (CRT, Matrix, Holidays, etc.)
    const override = localStorage.getItem("mmbarber_dev_visual_mode");
    if (!override || override === 'normal') {
      (async () => {
        const theme = getActiveTheme();
        const temp = await getLiveTemperature();
        const currentClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
        currentClasses.forEach(c => document.documentElement.classList.remove(c));
        
        if (temp <= -10) {
          document.documentElement.classList.add('mode-noirblue');
        } else if (theme !== 'default') {
          document.documentElement.classList.add(`mode-${theme}`);
        }
        window.dispatchEvent(new Event('mmbarber-theme-update'));
      })();
    } else {
      const currentClasses = Array.from(document.documentElement.classList).filter(c => c.startsWith('mode-'));
      currentClasses.forEach(c => document.documentElement.classList.remove(c));
      document.documentElement.classList.add(`mode-${override}`);
      window.dispatchEvent(new Event('mmbarber-theme-update'));
    }
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




  if (!mounted) return null;

  const isRodinaPage = pathname === "/rodina";
  const showEffects = (!isMobile || isMobileEffectsEnabled) && !isRodinaPage && graphicsTier !== "low";

  return (
    <MotionConfig reducedMotion={graphicsTier === "low" ? "always" : "user"}>
      {/* Games are currently disabled by request */}
      {/* {showEffects && <BarberGame />} */}
      {showEffects && <BarberChat isOpen={isBarberChatOpen} />}
      {showEffects && <Radio />}
      <CookieBanner />
      {showEffects && <FloatingScissors />}
      <MobileCompass />
      <VipControlBar />
      {showEffects && <GlobalSound />}
      {showEffects && <MatrixBackground />}
      <UserSettingsManager />
      <EarthProtocol isOpen={isEarthProtocolOpen} onClose={() => setIsEarthProtocolOpen(false)} lang={lang} />
      <InstagramPopup />
      <ElitaGame />
    </MotionConfig>
  );
}
