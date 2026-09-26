"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lock, Volume2, VolumeX } from "lucide-react";
import Image from "./OptimizedImage";
import gsap from "gsap";
import { useTranslation } from "../hooks/useTranslation";
import { useGame } from "../contexts/GameContext";
import { useBarbers } from "@/contexts/BarberContext";
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
  devMode?: boolean;
  disabled?: boolean;
}

const FireAmbient = ({ marginX, marginY, scale, setScale, isAdmin, isDragging, onPointerDown, parallaxTransform }: any) => (
  <div 
    id="drag-flame"
    className={`absolute w-32 h-48 -ml-16 -mt-24 ${isAdmin ? 'z-[9999] pointer-events-auto cursor-grab' : 'z-[15] pointer-events-none'} ${isDragging ? 'cursor-grabbing' : ''} group`}
    style={{ transform: `translate(${marginX}, ${marginY}) ${parallaxTransform !== 'none' ? parallaxTransform : ''}`, top: '50%', left: 'calc(50% + 175px)' }}
    onPointerDown={onPointerDown}
  >
    {isAdmin && (
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-[60] flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto" onPointerDown={e => e.stopPropagation()}>
        <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Velikost Plamene</span>
        <div className="flex items-center justify-between gap-4">
           <input type="range" min="0.1" max="3" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
         </div>
      </div>
    )}
    
    <div className="w-full h-full relative mix-blend-screen opacity-90 pointer-events-none" style={{ transform: `scale(${scale})` }}>
      {/* Base Core Light - Centered around the flame */}
      <motion.div 
        animate={{ opacity: [0.6, 0.8, 0.7, 0.9, 0.6], scale: [1, 1.02, 0.98, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#ff5500]/50 via-[#ff0000]/10 to-transparent blur-[50px] rounded-full pointer-events-none"
      />
      {/* Outer Ambient Glow - Centered around the flame */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.35, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-[#ff4500]/30 via-[#8a0303]/10 to-transparent blur-[80px] rounded-full pointer-events-none"
      />
      
      {/* Stylized flame bodies (visible fire) */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Background large orange body */}
         <motion.div 
           animate={{ scaleY: [1, 1.1, 0.95, 1.15, 1], x: [-1, 1, -2, 2, -1], rotate: [-1, 2, -1, 1, 0] }}
           transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
           style={{ transformOrigin: "bottom center" }}
           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-40 bg-[#ff4400] blur-[12px] rounded-t-[100%] rounded-b-[40%]"
         />
         {/* Mid yellow body */}
         <motion.div 
           animate={{ scaleY: [1, 1.25, 0.9, 1.2, 1], x: [1, -1, 1, -2, 0], rotate: [2, -2, 1, -1, 0] }}
           transition={{ duration: 0.25, repeat: Infinity, repeatType: "mirror", delay: 0.1 }}
           style={{ transformOrigin: "bottom center" }}
           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-32 bg-[#ffaa00] blur-[8px] rounded-t-[100%] rounded-b-[30%]"
         />
         {/* Foreground bright yellow/white core */}
         <motion.div 
           animate={{ scaleY: [1, 1.4, 0.85, 1.3, 1], x: [-0.5, 0.5, -1, 1, 0] }}
           transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror", delay: 0.05 }}
           style={{ transformOrigin: "bottom center" }}
           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-20 bg-[#ffeeaa] blur-[4px] rounded-t-[100%] rounded-b-md"
         />
         {/* Tiny intense white core at the very bottom */}
         <motion.div 
           animate={{ scaleY: [1, 1.2, 0.9, 1] }}
           transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
           style={{ transformOrigin: "bottom center" }}
           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-10 bg-white blur-[2px] rounded-t-[100%] rounded-b-sm"
         />
         
         {/* Sparks flying up */}
         {Array.from({ length: 6 }).map((_, i) => (
           <motion.div
             key={i}
             initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
             animate={{ 
               y: -150 - Math.random() * 100, 
               x: (Math.random() - 0.5) * 80,
               opacity: 0,
               scale: 0 
             }}
             transition={{ 
               duration: 1 + Math.random() * 1.5, 
               repeat: Infinity, 
               delay: Math.random() * 2 
             }}
             className="absolute bottom-10 left-1/2 w-1.5 h-1.5 bg-[#ffcc00] rounded-full blur-[0.5px]"
           />
         ))}
      </div>
    </div>
  </div>
);

export function CinematicIntro({ onDismiss, forceShow = false }: { onDismiss?: (action?: string) => void, forceShow?: boolean }) {
  const { t, lang, switchLanguage } = useTranslation();
  const { totalCollected } = useGame();
  const { barbers } = useBarbers();
  const [isActuallyMobile, setIsActuallyMobile] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLowTier, setIsLowTier] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string>("rezervace");
  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({});
  const [introConfig, setIntroConfig] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState<string>('ultra');
  const isHighTier = graphicsTier === 'ultra' || graphicsTier === 'high';
  const isLiteTier = graphicsTier === 'lite';
  const [testHour, setTestHour] = useState<number | null>(null);
  const [tomasWidth, setTomasWidth] = useState(800);
  const [tomasMargin, setTomasMargin] = useState(200);
  const [tomasMarginLeft, setTomasMarginLeft] = useState(0);

  const [tomasBtnMarginTop, setTomasBtnMarginTop] = useState(0);
  const [tomasBtnMarginLeft, setTomasBtnMarginLeft] = useState(0);
  const [tomasBtnScale, setTomasBtnScale] = useState(1);

  const [tomasNameMarginTop, setTomasNameMarginTop] = useState(0);
  const [tomasNameMarginLeft, setTomasNameMarginLeft] = useState(0);
  const [tomasNameScale, setTomasNameScale] = useState(1);

  const [tomasTitleMarginTop, setTomasTitleMarginTop] = useState(0);
  const [tomasTitleMarginLeft, setTomasTitleMarginLeft] = useState(0);
  const [tomasTitleScale, setTomasTitleScale] = useState(1);

  const [tomasExpMarginTop, setTomasExpMarginTop] = useState(0);
  const [tomasExpMarginLeft, setTomasExpMarginLeft] = useState(0);
  const [tomasExpScale, setTomasExpScale] = useState(1);

  const [headerMargin, setHeaderMargin] = useState(-96);
  const [headerMarginLeft, setHeaderMarginLeft] = useState(0);

  const [menuItemsMargin, setMenuItemsMargin] = useState(16);
  const [menuItemsMarginLeft, setMenuItemsMarginLeft] = useState(0);

  const [langMarginTop, setLangMarginTop] = useState(0);
  const [langMarginLeft, setLangMarginLeft] = useState(0);

  const [sunVisible, setSunVisible] = useState(false);
  const [sunMarginTop, setSunMarginTop] = useState(0);
  const [sunMarginLeft, setSunMarginLeft] = useState(0);
  const [sunScale, setSunScale] = useState(1);

  const [moonVisible, setMoonVisible] = useState(false);
  const [moonMarginTop, setMoonMarginTop] = useState(0);
  const [moonMarginLeft, setMoonMarginLeft] = useState(0);
  const [moonScale, setMoonScale] = useState(1);

  const [ambientLightMarginTop, setAmbientLightMarginTop] = useState(0);
  const [ambientLightMarginLeft, setAmbientLightMarginLeft] = useState(0);
  const [ambientLightScale, setAmbientLightScale] = useState(1);

  const [rightColMargins, setRightColMargins] = useState<Record<string, {x: number, y: number}>>({});

  const [flameMarginTop, setFlameMarginTop] = useState(0);
  const [flameMarginLeft, setFlameMarginLeft] = useState(0);
  const [flameScale, setFlameScale] = useState(0.5);

  const [bgImage, setBgImage] = useState<string>("/obr/start-odpoledne.png");
  
  const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, initialX: number, initialY: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getScaled = (val: number) => `${val}px`;

  useEffect(() => {
    if (graphicsTier !== 'ultra') return;
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    let ticking = false;
    const handleGlobalMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleGlobalMove);
    return () => window.removeEventListener('mousemove', handleGlobalMove);
  }, [graphicsTier]);

  const getActiveHour = useCallback(() => {
    return (isAdmin && testHour !== null) ? testHour : new Date().getHours();
  }, [testHour, isAdmin]);

  useEffect(() => {
    const hour = getActiveHour();
    const month = new Date().getMonth();
    const isSummer = month >= 3 && month <= 9;
    
    let newBg = "/obr/start-noc.png";
    if (isSummer) {
      if (hour >= 5 && hour < 12) newBg = "/obr/start-rano.png";
      else if (hour >= 12 && hour < 19) newBg = "/obr/start-odpoledne.png";
      else if (hour >= 19 && hour < 22) newBg = "/obr/start-zapad.png";
    } else {
      if (hour >= 6 && hour < 12) newBg = "/obr/start-rano.png";
      else if (hour >= 12 && hour < 15) newBg = "/obr/start-odpoledne.png";
      else if (hour >= 15 && hour < 17) newBg = "/obr/start-zapad.png";
    }
    setBgImage(newBg);
  }, [getActiveHour]);

  // Dynamic Intensity for Celestial Bodies based on real time
  let sunIntensity = 1;
  let moonIntensity = 1;
  let ambientIntensity = 1;
  if (typeof window !== 'undefined') {
    const hour = getActiveHour();
    const minute = (isAdmin && testHour !== null) ? 30 : new Date().getMinutes();
    const exactTime = hour + (minute / 60);
    const isSummer = new Date().getMonth() >= 3 && new Date().getMonth() <= 9;

    if (bgImage.includes('zapad')) {
      const zapadStart = isSummer ? 19 : 15;
      const zapadEnd = isSummer ? 22 : 17;
      const peak = (zapadStart + zapadEnd) / 2;
      const maxDist = (zapadEnd - zapadStart) / 2;
      const dist = Math.abs(exactTime - peak);
      const norm = Math.max(0, Math.min(1, dist / maxDist));
      sunIntensity = 1 - (norm * 0.7); // 1.0 at peak (middle of sunset), 0.3 at edges
    }

    if (bgImage.includes('noc')) {
      const nocStart = isSummer ? 22 : 17;
      const nocEnd = isSummer ? 5 : 6;
      let shiftedTime = exactTime < 12 ? exactTime + 24 : exactTime;
      const peak = 24; // Midnight
      const maxDist = Math.max(24 - nocStart, nocEnd); // distance from start to midnight or midnight to end
      const dist = Math.abs(shiftedTime - peak);
      const norm = Math.max(0, Math.min(1, dist / maxDist));
      moonIntensity = 1 - (norm * 0.6); // 1.0 at midnight, 0.4 at dusk/dawn
    }

    if (bgImage.includes('zapad')) {
      ambientIntensity = sunIntensity;
    } else if (bgImage.includes('noc')) {
      ambientIntensity = moonIntensity;
    }
  }

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const baseW = introConfig?.baseWidth || 1920;
      const baseH = introConfig?.baseHeight || 1080;
      const winW = windowSize.width || window.innerWidth;
      const winH = windowSize.height || window.innerHeight;
      const scale = Math.max(winW / baseW, winH / baseH);

      const dx = (e.clientX - dragState.startX) / scale;
      const dy = (e.clientY - dragState.startY) / scale;
      const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
      const limitX = 2500; // use a large limit instead of window size for base values
      const limitY = 2500;
      
      const newX = clamp(dragState.initialX + dx, -limitX, limitX);
      const newY = clamp(dragState.initialY + dy, -limitY, limitY);

      const el = document.getElementById(`drag-${dragState.id}`);
      if (el) {
        // preserve scale during drag if needed, but translate is enough for visual movement
        const currentScale = el.style.transform.match(/scale\((.*?)\)/)?.[1] || 1;
        el.style.transform = `translate(${getScaled(newX, 'x')}, ${getScaled(newY, 'y')}) scale(${currentScale})`;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const scaleX = windowSize.width / (introConfig?.baseWidth || windowSize.width);
      const scaleY = windowSize.height / (introConfig?.baseHeight || windowSize.height);
      const dx = (e.clientX - dragState.startX) / scaleX;
      const dy = (e.clientY - dragState.startY) / scaleY;

      const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
      const limitX = 2500;
      const limitY = 2500;
      
      const finalX = clamp(dragState.initialX + dx, -limitX, limitX);
      const finalY = clamp(dragState.initialY + dy, -limitY, limitY);

      if (dragState.id === 'tomas') {
        setTomasMarginLeft(finalX);
        setTomasMargin(finalY);
      } else if (dragState.id === 'tomasBtn') {
        setTomasBtnMarginLeft(finalX);
        setTomasBtnMarginTop(finalY);
      } else if (dragState.id === 'tomasName') {
        setTomasNameMarginLeft(finalX);
        setTomasNameMarginTop(finalY);
      } else if (dragState.id === 'tomasTitle') {
        setTomasTitleMarginLeft(finalX);
        setTomasTitleMarginTop(finalY);
      } else if (dragState.id === 'tomasExp') {
        setTomasExpMarginLeft(finalX);
        setTomasExpMarginTop(finalY);
      } else if (dragState.id === 'header') {
        setHeaderMarginLeft(finalX);
        setHeaderMargin(finalY);
      } else if (dragState.id === 'menuItems') {
        setMenuItemsMarginLeft(finalX);
        setMenuItemsMargin(finalY);
      } else if (dragState.id === 'bottomMenu') {
        setLangMarginLeft(finalX);
        setLangMarginTop(finalY);
      } else if (dragState.id === 'sun') {
        setSunMarginLeft(finalX);
        setSunMarginTop(finalY);
      } else if (dragState.id === 'moon') {
        setMoonMarginLeft(finalX);
        setMoonMarginTop(finalY);
      } else if (dragState.id === 'ambientLight') {
        setAmbientLightMarginLeft(finalX);
        setAmbientLightMarginTop(finalY);
      } else if (dragState.id === 'flame') {
        setFlameMarginLeft(finalX);
        setFlameMarginTop(finalY);
      } else if (dragState.id.startsWith('rightCol_')) {
        const item = dragState.id.split('_')[1];
        setRightColMargins(prev => ({
          ...prev,
          [item]: {
            x: finalX,
            y: finalY
          }
        }));
      }
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState]);

  useEffect(() => {
    setGraphicsTier(document.documentElement.getAttribute('data-graphics-tier') || 'ultra');
    const observer = new MutationObserver(() => {
      setGraphicsTier(document.documentElement.getAttribute('data-graphics-tier') || 'ultra');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-graphics-tier'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (introConfig && bgImage) {
      const layout = introConfig.layouts?.[bgImage] || introConfig;

      setTomasWidth(layout.tomasSize ?? 800);
      setTomasMargin(layout.tomasTopMargin ?? 200);
      setTomasMarginLeft(layout.tomasMarginLeft ?? 0);

      setTomasBtnMarginTop(layout.tomasBtnMarginTop ?? 0);
      setTomasBtnMarginLeft(layout.tomasBtnMarginLeft ?? 0);
      setTomasBtnScale(layout.tomasBtnScale ?? 1);

      setTomasNameMarginTop(layout.tomasNameMarginTop ?? 0);
      setTomasNameMarginLeft(layout.tomasNameMarginLeft ?? 0);
      setTomasNameScale(layout.tomasNameScale ?? 1);

      setTomasTitleMarginTop(layout.tomasTitleMarginTop ?? 0);
      setTomasTitleMarginLeft(layout.tomasTitleMarginLeft ?? 0);
      setTomasTitleScale(layout.tomasTitleScale ?? 1);

      setTomasExpMarginTop(layout.tomasExpMarginTop ?? 0);
      setTomasExpMarginLeft(layout.tomasExpMarginLeft ?? 0);
      setTomasExpScale(layout.tomasExpScale ?? 1);

      setHeaderMargin(layout.headerMargin ?? -96);
      setHeaderMarginLeft(layout.headerMarginLeft ?? 0);

      setMenuItemsMargin(layout.menuItemsMargin ?? 16);
      setMenuItemsMarginLeft(layout.menuItemsMarginLeft ?? 0);

      setRightColMargins(layout.rightColMargins || {});

      setFlameMarginTop(layout.flameMarginTop ?? 0);
      setFlameMarginLeft(layout.flameMarginLeft ?? 0);
      setFlameScale(layout.flameScale ?? 0.5);

      setLangMarginTop(layout.langMarginTop ?? 0);
      setLangMarginLeft(layout.langMarginLeft ?? 0);

      setSunVisible(layout.sunVisible ?? false);
      setSunMarginTop(layout.sunMarginTop ?? 0);
      setSunMarginLeft(layout.sunMarginLeft ?? 0);
      setSunScale(layout.sunScale ?? 1);

      setMoonVisible(layout.moonVisible ?? false);
      setMoonMarginTop(layout.moonMarginTop ?? 0);
      setMoonMarginLeft(layout.moonMarginLeft ?? 0);
      setMoonScale(layout.moonScale ?? 1);

      setAmbientLightMarginTop(layout.ambientLightMarginTop ?? 0);
      setAmbientLightMarginLeft(layout.ambientLightMarginLeft ?? 0);
      setAmbientLightScale(layout.ambientLightScale ?? 1);
    }
  }, [introConfig, bgImage]);

  const grainRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { id: "rezervace", titleCs: "Rezervace", titleEn: "Reservation", titleZh: "预约" },
    { id: "start", titleCs: "Přejít na web", titleEn: "Enter Website", titleZh: "进入网站" },
    { id: "galerie", titleCs: "Galerie", titleEn: "Gallery", titleZh: "画廊" },
    { id: "vice", titleCs: "Více o podniku", titleEn: "About Us", titleZh: "关于我们" },
    { id: "komunita", titleCs: "Rodina MM Barber", titleEn: "MM Barber Family", titleZh: "MM Barber 家族" },
    { id: "kontakt", titleCs: "Kontakt", titleEn: "Contact", titleZh: "联系我们" },
  ].map(item => {
    // Map to intro settings keys (start has special keys or no keys)
    let key = `visibility_intro_${item.id}`;
    if (item.id === 'start') return item; // Start is always visible

    const status = globalSettings[key];
    if (status === 'hidden') return null;
    return { ...item, devMode: status === 'dev', disabled: status === 'locked' };
  }).filter(Boolean) as MenuItem[];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const parsedSettings: Record<string, string> = {};
          Object.entries(data.values).forEach(([k, val]) => {
            if (k === 'intro_menu_config') {
              try {
                const parsed = JSON.parse(String(val));
                setIntroConfig(parsed);
                if (parsed.adminTestHour !== undefined) {
                  setTestHour(parsed.adminTestHour);
                }
              } catch(e) {}
              return;
            }
            const v = String(val).toLowerCase();
            parsedSettings[k] = (v === 'false' || v === 'hidden' || v === 'skryté') ? 'hidden' : ((v === 'locked' || v === 'zamčené') ? 'locked' : ((v === 'dev' || v === 've vývoji') ? 'dev' : 'visible'));
          });
          setGlobalSettings(parsedSettings);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
    
    const savedName = localStorage.getItem("mmbarber_client_nickname");
    if (savedName) setNickname(savedName);

    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAdmin(true);
    }

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
    if (!hasVisited || forceShow) {
      setShowIntro(true);
    }
  }, [onDismiss, forceShow]);

  useEffect(() => {
    if (!showIntro || isDismissed) {
      document.body.style.overflow = '';
      return;
    }
    
    // Hide scrollbar while Intro is active
    document.body.style.overflow = 'hidden';

    // Store and temporarily remove global themes so Intro is natural
    const wasBlood = document.documentElement.classList.contains('theme-blood');
    const wasNoir = document.documentElement.classList.contains('noir-mode');
    document.documentElement.classList.remove('theme-blood', 'noir-mode');

    // Prevent other components from re-applying themes while Intro is active
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('theme-blood') || document.documentElement.classList.contains('noir-mode')) {
        document.documentElement.classList.remove('theme-blood', 'noir-mode');
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Start fade-in and set menu to active state quickly
    const introTimer = setTimeout(() => {
      setIsAnimating(true);
      setIsFullyOpen(true);
      if (typeof window !== 'undefined') {
        const isNight = bgImage === "/obr/start-noc.png";
        const widgetColor = isNight ? '#8a0303' : 'var(--color-mafia-gold)';
        window.dispatchEvent(new CustomEvent('mmbarber-set-radio-track', { 
          detail: { track: '/sounds/Notte di Palermo.mp3', name: 'Notte di Palermo', color: widgetColor } 
        }));
      }
    }, 200);

    return () => {
      observer.disconnect();
      clearTimeout(introTimer);
      document.body.style.overflow = '';
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mmbarber-set-radio-track', { detail: null }));
      }
      
      // Restore themes if they were active
      if (wasBlood) document.documentElement.classList.add('theme-blood');
      if (wasNoir) document.documentElement.classList.add('noir-mode');
    };
  }, [showIntro, isDismissed]);

  useEffect(() => {
    if (isFullyOpen && typeof window !== 'undefined') {
      const isNight = bgImage === "/obr/start-noc.png";
      const widgetColor = isNight ? '#8a0303' : 'var(--color-mafia-gold)';
      window.dispatchEvent(new CustomEvent('mmbarber-set-radio-track', { 
        detail: { track: '/sounds/Notte di Palermo.mp3', name: 'Notte di Palermo', color: widgetColor } 
      }));
    }
  }, [bgImage, isFullyOpen]);

  const handleMouseEnter = (itemId: string) => {
    setHoveredItem(itemId);
    playSound("/sounds/click.mp3", 0.15);
  };

  const handleMenuSelect = (item: MenuItem | string) => {
    const isString = typeof item === 'string';
    const devMode = isString ? false : item.devMode;
    const itemId = isString ? item : item.id;

    if (isAdmin) {
      // In admin edit mode, don't navigate away
      playSound("/sounds/click.mp3", 0.1);
      return;
    }

    if (devMode) {
      // Don't navigate if in dev mode, maybe play a different sound
      playSound("/sounds/click.mp3", 0.1);
      return;
    }
    
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

  // Pomocná funkce pro roky praxe
  const getTomasExp = (lang: string) => {
    const startDate = new Date(2019, 8, 1);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years <= 0 && months <= 0) return null;
    
    if (lang === 'cs') {
      let yearStr = '';
      if (years === 1) yearStr = '1 rok';
      else if (years >= 2 && years <= 4) yearStr = `${years} roky`;
      else if (years > 4) yearStr = `${years} let`;

      let monthStr = '';
      if (months === 1) monthStr = '1 měsíc';
      else if (months >= 2 && months <= 4) monthStr = `${months} měsíce`;
      else if (months > 4) monthStr = `${months} měsíců`;

      if (years === 0) return `${monthStr} praxe`;
      if (months === 0) return `${yearStr} praxe`;
      return `${yearStr} a ${monthStr} praxe`;
    } else {
      const yearStr = years === 1 ? '1 year' : `${years} years`;
      const monthStr = months === 1 ? '1 month' : `${months} months`;
      if (years === 0) return `${monthStr} of experience`;
      if (months === 0) return `${yearStr} of experience`;
      return `${yearStr} and ${monthStr} of experience`;
    }
  };

  const renderRightColumnContent = () => {
    switch (hoveredItem) {
      case "start":
        return (
          <div className="flex flex-col gap-4 text-center items-center">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "MM BARBER // VSTUP" : "MM BARBER // ENTER"}
            </span>
            <h3 className="text-2xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider leading-tight">
              {lang === 'cs' ? "Nejsme uzavřený klub" : "We are not a closed club"}
            </h3>
            <p className="text-sm text-smoke-white/70 leading-relaxed font-sans mt-2 max-w-md">
              {lang === 'cs' 
                ? "Jsme místo, do kterého tě srdečně zveme. Místo pro ty, co nepotřebují vykřikovat svůj styl do světa."
                : "We are a place to which we warmly invite you. A place for those who don't need to shout their style to the world."
              }
            </p>
            <div className="px-6 py-2 mt-4 italic text-xs text-mafia-gold/80 font-mono">
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
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center w-full py-2">
              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                {(() => {
                  const hour = getActiveHour();
                  const isDay = hour >= 6 && hour < 18;
                  const jacketSrc = isDay ? '/hierarchie/tomáš-sako-den.png' : '/hierarchie/tomáš-sako-večer.png';
                  
                  const btnColors = isDay 
                    ? "from-mafia-gold via-[#e3c683] to-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_40px_rgba(197,160,89,0.6)] border-mafia-gold/50 text-black"
                    : "from-[#8a1c1c] via-[#d62828] to-[#8a1c1c] shadow-[0_0_20px_rgba(214,40,40,0.3)] hover:shadow-[0_0_40px_rgba(214,40,40,0.6)] border-[#d62828]/50 text-white hover:from-white hover:to-white hover:text-black";

                  return (
                    <>
                    <div 
                      id="drag-tomas"
                      className="relative group cursor-pointer mb-4" 
                      style={{ transform: `translate(${getScaled(tomasMarginLeft, 'x')}, ${getScaled(tomasMargin, 'y')})`, cursor: isAdmin ? (dragState?.id === 'tomas' ? 'grabbing' : 'grab') : 'pointer' }}
                      onPointerDown={(e) => {
                        if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setDragState({ id: 'tomas', startX: e.clientX, startY: e.clientY, initialX: tomasMarginLeft, initialY: tomasMargin });
                      }}
                    >
                       {isAdmin && (
                         <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-3 z-50 flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto min-w-[200px]">
                           <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase mb-1 whitespace-nowrap">Úprava Tomáše</span>
                           <div className="flex items-center justify-between gap-4">
                             <span className="text-[10px] text-white">Šířka:</span>
                             <input type="range" min="200" max="1500" value={tomasWidth} onChange={(e) => setTomasWidth(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                           </div>
                           <div className="flex items-center justify-between gap-4">
                             <span className="text-[10px] text-white">X (do stran):</span>
                             <input type="range" min="-800" max="800" value={tomasMarginLeft} onChange={(e) => setTomasMarginLeft(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                           </div>
                           <div className="flex items-center justify-between gap-4">
                             <span className="text-[10px] text-white">Y (nahoru/dolů):</span>
                             <input type="range" min="-300" max="800" value={tomasMargin} onChange={(e) => setTomasMargin(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                           </div>
                         </div>
                       )}
                       <motion.div
                         style={{ transformOrigin: "50% 35%" }}
                         animate={graphicsTier === 'ultra' ? { 
                           scaleX: [1, 1.008, 1]
                         } : {}}
                         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                       >
                         <img 
                           src={jacketSrc} 
                           alt="Tomáš" 
                           className={`h-auto object-contain ${isLiteTier ? 'transition-none' : 'transition-all duration-500'} ${isHighTier ? 'group-hover:scale-[1.03]' : ''} ${!isHighTier ? '' : (!isDay ? 'drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]' : 'drop-shadow-[0_0_15px_rgba(0,0,0,0.3)]')}`} 
                           style={{ width: `${getScaled(tomasWidth, 'x')}`, maxWidth: '100vw' }} 
                         />
                       </motion.div>
                    </div>
                <div 
                  id="drag-tomasName"
                  className="text-center mt-2 relative group"
                  style={{ transform: `translate(${getScaled(tomasNameMarginLeft, 'x')}, ${getScaled(tomasNameMarginTop, 'y')}) scale(${tomasNameScale})`, cursor: isAdmin ? (dragState?.id === 'tomasName' ? 'grabbing' : 'grab') : 'auto' }}
                  onPointerDown={(e) => {
                    if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragState({ id: 'tomasName', startX: e.clientX, startY: e.clientY, initialX: tomasNameMarginLeft, initialY: tomasNameMarginTop });
                  }}
                >
                  {isAdmin && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-[60] flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto">
                      <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Jméno</span>
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">Velikost:</span>
                         <input type="range" min="0.5" max="3" step="0.05" value={tomasNameScale} onChange={(e) => setTomasNameScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                    </div>
                  )}
                  <motion.h4 
                    initial={{ opacity: 0, x: -100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1, color: isDay ? '#f8f8f8' : '#c5a059' }}
                    transition={{ 
                      duration: 0.8, 
                      type: "spring", 
                      bounce: 0.4
                    }}
                    className="text-2xl font-heading font-black uppercase tracking-wider"
                  >
                    Tomáš
                  </motion.h4>
                </div>

                {/* Praxe */}
                <div 
                  id="drag-tomasExp"
                  className="text-center mt-1 relative group"
                  style={{ transform: `translate(${getScaled(tomasExpMarginLeft, 'x')}, ${getScaled(tomasExpMarginTop, 'y')}) scale(${tomasExpScale})`, cursor: isAdmin ? (dragState?.id === 'tomasExp' ? 'grabbing' : 'grab') : 'auto' }}
                  onPointerDown={(e) => {
                    if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragState({ id: 'tomasExp', startX: e.clientX, startY: e.clientY, initialX: tomasExpMarginLeft, initialY: tomasExpMarginTop });
                  }}
                >
                  {isAdmin && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-[60] flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto">
                      <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Praxe</span>
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">Velikost:</span>
                         <input type="range" min="0.5" max="3" step="0.05" value={tomasExpScale} onChange={(e) => setTomasExpScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                    </div>
                  )}
                  <motion.p 
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0, color: isDay ? '#888888' : '#e3c683' }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2,
                      type: "spring", 
                      bounce: 0.4
                    }}
                    className="text-[10px] font-mono uppercase tracking-widest"
                  >
                    {getTomasExp(lang)}
                  </motion.p>
                </div>
                
                {/* Zakladatel */}
                <div 
                  id="drag-tomasTitle"
                  className="text-center mt-2 relative group"
                  style={{ transform: `translate(${getScaled(tomasTitleMarginLeft, 'x')}, ${getScaled(tomasTitleMarginTop, 'y')}) scale(${tomasTitleScale})`, cursor: isAdmin ? (dragState?.id === 'tomasTitle' ? 'grabbing' : 'grab') : 'auto' }}
                  onPointerDown={(e) => {
                    if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragState({ id: 'tomasTitle', startX: e.clientX, startY: e.clientY, initialX: tomasTitleMarginLeft, initialY: tomasTitleMarginTop });
                  }}
                >
                  {isAdmin && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-[60] flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto">
                      <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Titul (Zakladatel)</span>
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">Velikost:</span>
                         <input type="range" min="0.5" max="3" step="0.05" value={tomasTitleScale} onChange={(e) => setTomasTitleScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                    </div>
                  )}
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, color: isDay ? '#c5a059' : '#ffffff' }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.4
                    }}
                    className="text-[9px] font-mono uppercase tracking-[0.3em] font-black pointer-events-none"
                  >
                    {lang === 'cs' ? "Zakladatel" : "Founder"}
                  </motion.span>
                </div>

                <div 
                  id="drag-tomasBtn"
                  className="relative group w-full flex flex-col items-center gap-3 mt-2" 
                  style={{ transform: `translate(${getScaled(tomasBtnMarginLeft, 'x')}, ${getScaled(tomasBtnMarginTop, 'y')}) scale(${tomasBtnScale})`, cursor: isAdmin ? (dragState?.id === 'tomasBtn' ? 'grabbing' : 'grab') : 'auto' }}
                  onPointerDown={(e) => {
                    if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragState({ id: 'tomasBtn', startX: e.clientX, startY: e.clientY, initialX: tomasBtnMarginLeft, initialY: tomasBtnMarginTop });
                  }}
                >
                   {isAdmin && (
                     <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-3 z-[60] flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto min-w-[200px]">
                       <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase mb-1 whitespace-nowrap text-center">Úprava Tlačítka</span>
                       <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">X (do stran):</span>
                         <input type="range" min="-800" max="800" value={tomasBtnMarginLeft} onChange={(e) => setTomasBtnMarginLeft(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                       <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">Y (nahoru/dolů):</span>
                         <input type="range" min="-800" max="800" value={tomasBtnMarginTop} onChange={(e) => setTomasBtnMarginTop(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                       <div className="flex items-center justify-between gap-4">
                         <span className="text-[10px] text-white">Velikost:</span>
                         <input type="range" min="0.5" max="2" step="0.05" value={tomasBtnScale} onChange={(e) => setTomasBtnScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                       </div>
                     </div>
                   )}
                  <motion.a 
                     initial={{ opacity: 0, scale: 0.5, y: 50 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     transition={{ duration: 0.7, delay: 0.6, type: "spring" }}
                     href="https://mm.inthechair.com/micka" 
                     target={isAdmin ? "_self" : "_blank"} 
                     rel="noopener noreferrer" 
                     onClick={(e) => isAdmin && e.preventDefault()} 
                     className={`relative inline-flex items-center justify-center bg-gradient-to-r w-full max-w-[280px] md:w-auto px-10 py-4 font-black uppercase tracking-widest text-sm text-center transition-all duration-300 pointer-events-auto hover:scale-110 border group/btn rounded-sm ${btnColors}`}
                  >
                    <span className="relative z-10">{lang === 'cs' ? "Rezervovat" : "Book"}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                  </motion.a>
                </div>
                </>
                );
              })()}
              </div>
            </div>
          </div>
        );
      case "galerie":
        return (
          <div className="flex flex-col gap-3 text-left">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "VIZUÁLY // HISTORIE" : "VISUALS // HISTORY"}
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "FILMOVÝ PÁS A STŘIHY" : "FILM STRIP & CUTS"}
            </h3>
            <p className="text-xs text-smoke-white/60 leading-relaxed font-sans mt-1">
              {lang === 'cs'
                ? "Archivní i detailní snímky z našeho revíru. Nahlédněte pod pokličku naší práce a přesvědčte se o naší preciznosti na vlastní oči."
                : "Archive and detailed shots from our territory. Take a look under the hood of our work and see our precision with your own eyes."
              }
            </p>
            <div className="mt-3 flex gap-2">
              <div className="w-14 h-14 bg-[url('/obr/atmosfera/barber-4.jpg')] bg-cover opacity-60"></div>
              <div className="w-14 h-14 bg-[url('/obr/atmosfera/barber-5.jpg')] bg-cover opacity-60"></div>
              <div className="w-14 h-14 bg-[url('/obr/atmosfera/barber-7.jpg')] bg-cover opacity-60"></div>
            </div>
          </div>
        );
      case "vice":
        return (
          <div className="flex flex-col gap-3 text-left w-full">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "PŘÍBĚH // KODEX" : "THE STORY // THE CODE"}
            </span>
            <h3 className="text-2xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "KODEX A MOJE CESTA" : "THE CODE AND MY JOURNEY"}
            </h3>
            
            <div className="flex flex-col gap-3 text-sm md:text-base text-smoke-white/80 leading-relaxed font-sans mt-2 pr-4 overflow-y-auto max-h-[40vh] md:max-h-[50vh] custom-scrollbar">
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

            <div className="mt-3 pl-4 py-2 text-xs text-smoke-white/60 font-mono italic">
              {lang === 'cs' ? "Žádné zbytečné oči, jen ty, tvůj styl a loajalita." : "No unnecessary eyes, just you, your style, and loyalty."}
            </div>

            <div className="mt-4 flex justify-end">
              <Image src="/podpis.png" alt="Podpis" width={250} height={120} loading="lazy" className="h-16 md:h-20 w-auto object-contain opacity-100 filter drop-shadow-[0_0_12px_rgba(200,16,46,0.2)]" />
            </div>
          </div>
        );
      case "kontakt":
        return (
          <div className="flex flex-col gap-3 text-left">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "LOKALITA // SPOJENÍ" : "LOCATION // CONTACT"}
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "KUDY K NÁM DO MAŘATIC" : "HOW TO FIND US"}
            </h3>
            <p className="text-xs text-smoke-white/60 leading-relaxed font-sans mt-1">
              {lang === 'cs'
                ? "Sadová 1383, 686 05 Uherské Hradiště 5. Parkování je zcela bezplatné přímo u naší provozovny."
                : "Sadová 1383, 686 05 Uherské Hradiště 5. Parking is completely free right next to our shop."
              }
            </p>
            <div className="mt-3 flex flex-col gap-1 text-[10px] font-mono text-mafia-gold/80">
              <span>{lang === 'cs' ? "MHD: Zastávka Rudy Kubíčka" : "MHD: Rudy Kubicka stop"}</span>
              <span>{lang === 'cs' ? "Waze: Pozor, občas naviguje o dům dál." : "Waze: Watch out, sometimes guides a house away."}</span>
            </div>
          </div>
        );
      case "komunita":
        return (
          <div className="flex flex-col gap-3 text-center md:text-left w-full h-full items-center md:items-start justify-center md:justify-start">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "MM BARBER // RODINA" : "MM BARBER // FAMILY"}
            </span>
            <h3 className="text-2xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "RODINA MM BARBER" : "MM BARBER FAMILY"}
            </h3>
            <p className="text-xs md:text-sm text-smoke-white/60 leading-relaxed font-sans mt-1 max-w-sm">
              {lang === 'cs'
                ? "Není to jen o stříhání. Je to o komunitě, bratrství a stylu, který nás spojuje. Vstup do naší rodiny."
                : "It's not just about haircuts. It's about community, brotherhood, and style. Join our family."}
            </p>
            <div className="mt-6 flex justify-center md:justify-start w-full">
               <button onClick={(e) => { e.preventDefault(); handleMenuSelect('komunita'); }} className="bg-mafia-gold text-black px-6 py-2 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-lg">
                 {lang === 'cs' ? "Vstoupit do rodiny" : "Enter Family"}
               </button>
            </div>
          </div>
        );
      case "seznamka":
        return (
          <div className="flex flex-col gap-3 text-center w-full h-full items-center">
            <span className="text-[10px] font-mono text-mafia-gold/50 tracking-[0.3em] uppercase">
              {lang === 'cs' ? "KOMUNITA // SEZNAMKA" : "COMMUNITY // DATING"}
            </span>
            <h3 className="text-2xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
              {lang === 'cs' ? "ŽENY V SEZNAMCE" : "WOMEN IN DATING"}
            </h3>
            <p className="text-xs md:text-sm text-smoke-white/60 leading-relaxed font-sans mt-1 max-w-sm">
              {lang === 'cs' 
                ? "Místo, kde se prolíná styl s osobností. Prohlédněte si naši galerii a seznamte se."
                : "A place where style meets personality. View our gallery and meet them."}
            </p>
            
            <div className="mt-6 flex flex-row flex-wrap justify-center gap-4 md:gap-8 w-full overflow-y-auto custom-scrollbar md:max-h-[50vh] px-2 pb-4">
              {/* Magda Profile */}
              <div className="flex flex-col items-center group w-full max-w-[200px] md:max-w-[260px]">
                <div className="relative w-full aspect-[3/2] overflow-hidden transition-colors bg-mafia-dark shadow-xl rounded-sm">
                   <Image src="/obr/seznamka/magda.jpg" alt="Magda" fill className="object-cover object-top transition-all duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   <div className="absolute bottom-4 left-0 right-0 text-center z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-4 md:group-hover:translate-y-0 flex justify-center">
                      <span className="text-[9px] font-mono text-mafia-gold bg-black/80 md:bg-black/60 px-2 py-1 uppercase tracking-widest backdrop-blur-sm">{lang === 'cs' ? "Seznamka" : "Dating"}</span>
                   </div>
                </div>
                <div className="mt-4 text-center w-full">
                  <h4 className="text-lg md:text-xl font-heading font-black text-smoke-white tracking-widest uppercase mb-1">Magda</h4>
                  <span className="text-[9px] font-mono text-mafia-gold/70 uppercase tracking-widest">{lang === 'cs' ? "Nezávislá žena" : "Independent woman"}</span>
                </div>
              </div>

              {/* Free Slot */}
              <div className="flex flex-col items-center group w-full max-w-[200px] md:max-w-[260px] cursor-pointer" onClick={(e) => { e.preventDefault(); handleMenuSelect('seznamka'); }}>
                <div className="relative w-full aspect-[3/2] overflow-hidden transition-colors bg-mafia-dark/30 shadow-xl flex items-center justify-center rounded-sm">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   
                   <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center w-full">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-white/20 group-hover:text-mafia-gold group-hover:scale-110 group-hover:bg-mafia-gold/10 transition-all duration-300">
                         <Plus size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-sans text-mafia-gold/90 italic opacity-0 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 leading-relaxed font-bold px-3">
                         {lang === 'cs' ? "Tento slot čeká na tebe... 👑" : "This slot is waiting for you... 👑"}
                      </span>
                   </div>
                   
                   <div className="absolute bottom-4 left-0 right-0 text-center z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-y-4 md:group-hover:translate-y-0 pointer-events-none flex justify-center">
                      <span className="text-[9px] font-mono text-mafia-gold bg-black/80 md:bg-black/60 px-2 py-1 uppercase tracking-widest backdrop-blur-sm">{lang === 'cs' ? "Seznamka" : "Dating"}</span>
                   </div>
                </div>
                <div className="mt-4 text-center w-full">
                  <h4 className="text-lg md:text-xl font-heading font-black text-smoke-white/30 tracking-widest uppercase mb-1">{lang === 'cs' ? "Volný slot" : "Free slot"}</h4>
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{lang === 'cs' ? "Neznámá" : "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
               <button onClick={(e) => { e.preventDefault(); handleMenuSelect('seznamka'); }} className="bg-mafia-gold text-black w-full max-w-[240px] md:w-auto px-6 py-2 font-black uppercase tracking-widest text-xs text-center hover:bg-white transition-colors shadow-lg">
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
  if (!forceShow && (!showIntro || isDismissed || isLowTier || isActuallyMobile)) return null;

  return createPortal(
    <div id="intro-overlay-screen" className={`fixed inset-0 w-full h-[100dvh] overflow-hidden z-[999999] transition-opacity duration-500 will-change-opacity ${isAnimating ? 'opacity-100 bg-[#070707]' : 'opacity-0 bg-[#020202] pointer-events-none'} ${isDismissed ? 'pointer-events-none invisible' : ''}`}>
      
      <div 
        id="scale-wrapper"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${introConfig?.baseWidth || 1920}px`,
          height: `${introConfig?.baseHeight || 1080}px`,
          transform: `translate(-50%, -50%) scale(${Math.max((windowSize.width || (typeof window !== 'undefined' ? window.innerWidth : 1920)) / (introConfig?.baseWidth || 1920), (windowSize.height || (typeof window !== 'undefined' ? window.innerHeight : 1080)) / (introConfig?.baseHeight || 1080))})`,
          transformOrigin: 'center center',
        }}
        className="flex flex-col md:flex-row items-stretch justify-start"
      >
        
        {/* Dynamic Background with Parallax on Ultra */}
        <div 
          className="absolute inset-[-5%] z-10 pointer-events-none bg-cover bg-center bg-no-repeat transition-transform duration-200 ease-out"
          style={{ 
            backgroundImage: isLiteTier ? 'none' : `url('${bgImage}')`,
            transform: (graphicsTier === 'ultra' && typeof window !== 'undefined') 
              ? `translate(${(mousePos.x - window.innerWidth / 2) * -0.008}px, ${(mousePos.y - window.innerHeight / 2) * -0.008}px)` 
              : 'none'
          }}
        >
        </div>

        {/* Celestial Body: Sun */}
        {graphicsTier === 'ultra' && bgImage.includes('zapad') && (sunVisible || isAdmin) && (
          <div
            id="drag-sun"
            className={`absolute z-[40] ${isAdmin ? 'pointer-events-auto cursor-grab' : 'pointer-events-none'} group mix-blend-screen w-32 h-32 -ml-16 -mt-16`}
            style={{ 
              transform: `translate(${getScaled(sunMarginLeft)}, ${getScaled(sunMarginTop)})`,
              top: '50%', left: '50%',
              opacity: (sunVisible || isAdmin) ? (sunVisible ? sunIntensity : 0.3) : 0
            }}
            onPointerDown={(e) => {
              if (!isAdmin || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('input')) return;
              e.preventDefault();
              e.stopPropagation();
              setDragState({ id: 'sun', startX: e.clientX, startY: e.clientY, initialX: sunMarginLeft, initialY: sunMarginTop });
            }}
          >
            <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-auto" style={{ transform: `scale(${sunScale * (0.8 + 0.4 * sunIntensity)})` }}>
              <div className="absolute w-[800%] h-[800%] rounded-full bg-[radial-gradient(circle,rgba(255,50,0,0.25)_0%,rgba(255,50,0,0.05)_30%,rgba(255,50,0,0)_70%)] pointer-events-none" />
              <div className="absolute w-[400%] h-[400%] rounded-full bg-[radial-gradient(circle,rgba(255,100,0,0.5)_0%,rgba(255,50,0,0.2)_40%,rgba(255,50,0,0)_70%)] pointer-events-none" />
              <div className="absolute w-[200%] h-[200%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,230,200,0.5)_15%,rgba(255,150,0,0.2)_40%,rgba(255,150,0,0)_70%)] pointer-events-none" />
            </div>

            {isAdmin && (
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/90 backdrop-blur-md border border-mafia-gold p-2 z-[9999] flex flex-col gap-2 transition-opacity rounded shadow-[0_0_30px_rgba(0,0,0,1)] pointer-events-auto min-w-[200px]">
                <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Slunce</span>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white">Zobrazit:</span>
                  <input type="checkbox" checked={sunVisible} onChange={(e) => setSunVisible(e.target.checked)} className="accent-mafia-gold" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white">Velikost:</span>
                  <input type="range" min="0.1" max="5" step="0.1" value={sunScale} onChange={(e) => setSunScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Celestial Body: Moon */}
        {graphicsTier === 'ultra' && bgImage.includes('noc') && (moonVisible || isAdmin) && (
          <div
            id="drag-moon"
            className={`absolute z-[40] ${isAdmin ? 'pointer-events-auto cursor-grab' : 'pointer-events-none'} group mix-blend-screen w-24 h-24 -ml-12 -mt-12`}
            style={{ 
              transform: `translate(${getScaled(moonMarginLeft)}, ${getScaled(moonMarginTop)})`,
              top: '50%', left: '50%',
              opacity: (moonVisible || isAdmin) ? (moonVisible ? moonIntensity : 0.3) : 0
            }}
            onPointerDown={(e) => {
              if (!isAdmin || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('input')) return;
              e.preventDefault();
              e.stopPropagation();
              setDragState({ id: 'moon', startX: e.clientX, startY: e.clientY, initialX: moonMarginLeft, initialY: moonMarginTop });
            }}
          >
            <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-auto" style={{ transform: `scale(${moonScale * (0.7 + 0.5 * moonIntensity)})` }}>
              <div className="absolute w-[800%] h-[800%] rounded-full bg-[radial-gradient(circle,rgba(226,232,240,0.25)_0%,rgba(148,163,184,0.05)_30%,rgba(148,163,184,0)_70%)] pointer-events-none" />
              <div className="absolute w-[400%] h-[400%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,rgba(226,232,240,0.25)_40%,rgba(226,232,240,0)_70%)] pointer-events-none" />
              <div className="absolute w-[200%] h-[200%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(226,232,240,0.6)_20%,rgba(148,163,184,0.3)_50%,rgba(148,163,184,0)_70%)] pointer-events-none" />
            </div>

            {isAdmin && (
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/90 backdrop-blur-md border border-mafia-gold p-2 z-[9999] flex flex-col gap-2 transition-opacity rounded shadow-[0_0_30px_rgba(0,0,0,1)] pointer-events-auto min-w-[200px]">
                <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Měsíc</span>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white">Zobrazit:</span>
                  <input type="checkbox" checked={moonVisible} onChange={(e) => setMoonVisible(e.target.checked)} className="accent-mafia-gold" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white">Velikost:</span>
                  <input type="range" min="0.1" max="5" step="0.1" value={moonScale} onChange={(e) => setMoonScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulated Fire Ambient for High and Ultra */}
        {(graphicsTier === 'high' || graphicsTier === 'ultra') && (
          <FireAmbient 
            marginX={getScaled(flameMarginLeft, 'x')} 
            marginY={getScaled(flameMarginTop, 'y')} 
            scale={flameScale} 
            setScale={setFlameScale}
            isAdmin={isAdmin}  
            parallaxTransform={(graphicsTier === 'ultra' && typeof window !== 'undefined') ? `translate(${(mousePos.x - window.innerWidth / 2) * -0.008}px, ${(mousePos.y - window.innerHeight / 2) * -0.008}px)` : 'none'}
            isDragging={dragState?.id === 'flame'}
            onPointerDown={(e: any) => {
              if (!isAdmin) return;
              e.preventDefault();
              e.stopPropagation();
              setDragState({ 
                id: 'flame', 
                startX: e.clientX, 
                startY: e.clientY, 
                initialX: flameMarginLeft, 
                initialY: flameMarginTop 
              });
            }}
          />
        )}

        {/* Ultra Graphics Only Premium Effects */}
        {graphicsTier === 'ultra' && (
          <>
            {/* Deep Vignette */}
            <div className="absolute inset-0 z-[15] pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.95)]" />
            
            {/* Ambient Gold Dust */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-mafia-gold shadow-[0_0_6px_rgba(197,160,89,0.8)]"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -Math.random() * 150 - 50],
                    x: [0, (Math.random() - 0.5) * 80],
                    opacity: [0, Math.random() * 0.5 + 0.1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 15,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 5
                  }}
                />
              ))}
            </div>
            
            {/* Soft Ambient Light Leak (Draggable) */}
            <div
              id="drag-ambient-light"
              className={`absolute top-0 right-0 w-32 h-32 ${isAdmin ? 'pointer-events-auto cursor-grab z-[9999]' : 'pointer-events-none z-[11]'} group transition-opacity duration-1000`}
              style={{ 
                transform: `translate(${getScaled(ambientLightMarginLeft)}, ${getScaled(ambientLightMarginTop)})`,
                opacity: ambientIntensity,
              }}
              onPointerDown={(e) => {
                if (!isAdmin || (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('input')) return;
                e.preventDefault();
                e.stopPropagation();
                setDragState({ id: 'ambientLight', startX: e.clientX, startY: e.clientY, initialX: ambientLightMarginLeft, initialY: ambientLightMarginTop });
              }}
            >
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full pointer-events-none mix-blend-screen transition-all duration-1000" 
                style={{ 
                  transform: `scale(${ambientLightScale * (0.8 + 0.4 * ambientIntensity)})`,
                  background: (getActiveHour() >= 6 && getActiveHour() < 18) 
                    ? 'radial-gradient(circle, rgba(254,243,199,0.15) 0%, rgba(254,243,199,0.05) 40%, rgba(254,243,199,0) 70%)' 
                    : 'radial-gradient(circle, rgba(197,160,89,0.1) 0%, rgba(197,160,89,0.03) 40%, rgba(197,160,89,0) 70%)'
                }}
              />

              {isAdmin && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-black/90 backdrop-blur-md border border-mafia-gold p-2 z-[9999] flex flex-col gap-2 transition-opacity rounded shadow-[0_0_30px_rgba(0,0,0,1)] pointer-events-auto min-w-[200px]">
                  <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap text-center">Atmosférické světlo</span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] text-white">Velikost:</span>
                    <input type="range" min="0.1" max="3" step="0.1" value={ambientLightScale} onChange={(e) => setAmbientLightScale(Number(e.target.value))} className="w-24 accent-mafia-gold" />
                  </div>
                </div>
              )}
            </div>

          </>
        )}

        {/* Left Side: Game Menu */}
        <div className={`w-[350px] flex-none flex flex-col items-center md:items-start justify-center px-4 md:px-10 z-30 relative ${isLiteTier ? 'bg-[#050505]' : 'bg-black/80 md:bg-black/60 md:backdrop-blur-sm'}`}>
          {/* Menu Title / Brand Header */}
          <div 
            id="drag-header"
            className="mb-6 md:mb-8 flex flex-col items-center md:items-start gap-2 w-full text-center md:text-left relative group z-[20]" 
            style={{ transform: `translate(${getScaled(headerMarginLeft, 'x')}, ${getScaled(headerMargin, 'y')})`, cursor: isAdmin ? (dragState?.id === 'header' ? 'grabbing' : 'grab') : 'auto' }}
            onPointerDown={(e) => {
              if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
              e.preventDefault();
              e.stopPropagation();
              setDragState({ id: 'header', startX: e.clientX, startY: e.clientY, initialX: headerMarginLeft, initialY: headerMargin });
            }}
          >
            {isAdmin && (
              <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-50 flex items-center gap-4 transition-opacity rounded shadow-2xl pointer-events-auto">
                <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap">Úprava Hlavičky</span>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] text-white">X:</span>
                    <input type="range" min="-300" max="300" value={headerMarginLeft} onChange={(e) => setHeaderMarginLeft(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] text-white">Y:</span>
                    <input type="range" min="-300" max="300" value={headerMargin} onChange={(e) => setHeaderMargin(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                  </div>
                </div>
              </div>
            )}
            <span className={`text-xs md:text-sm font-mono text-mafia-gold/50 uppercase tracking-[0.4em]`}>{lang === 'cs' ? (introConfig?.sloganCs || "MMBARBER // EST 2024") : (introConfig?.sloganEn || "MMBARBER // EST 2024")}</span>
            <span className={`text-sm md:text-base font-mono text-mafia-gold uppercase tracking-[0.3em] font-black pb-1 mt-1 ${isHighTier ? 'drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]' : ''}`}>
              {lang === 'cs' ? (introConfig?.parkingCs || 'Parkování zdarma') : (introConfig?.parkingEn || 'Free parking')}
            </span>
            <a href={`tel:${introConfig?.phone || '+420 577 544 073'}`} className={`text-2xl md:text-3xl font-heading font-black text-smoke-white hover:text-mafia-gold transition-colors ${isHighTier ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : ''}`}>
              {introConfig?.phone || '+420 577 544 073'}
            </a>
            <h2 className={`text-2xl md:text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mt-16 md:mt-24 ${isHighTier ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.25)]' : ''}`}>
              {lang === 'cs' ? "HLAVNÍ MENU" : "MAIN MENU"}
            </h2>
            <div className="w-16 h-[1.5px] bg-mafia-gold/30 mt-1"></div>
          </div>

          {/* Menu Options */}
          {isFullyOpen && (
            <div
              id="drag-menuItems"
              className="w-full relative group"
              style={{ transform: `translate(${getScaled(menuItemsMarginLeft, 'x')}, ${getScaled(menuItemsMargin, 'y')})`, cursor: isAdmin ? (dragState?.id === 'menuItems' ? 'grabbing' : 'grab') : 'auto' }}
              onPointerDown={(e) => {
                if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                e.preventDefault();
                e.stopPropagation();
                setDragState({ id: 'menuItems', startX: e.clientX, startY: e.clientY, initialX: menuItemsMarginLeft, initialY: menuItemsMargin });
              }}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center md:items-start gap-4 md:gap-6 w-full relative"
              >
              {isAdmin && (
                <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-50 flex items-center gap-4 transition-opacity rounded shadow-2xl pointer-events-auto">
                  <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap">Úprava Menu</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] text-white">X:</span>
                      <input type="range" min="-300" max="300" value={menuItemsMarginLeft} onChange={(e) => setMenuItemsMarginLeft(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] text-white">Y:</span>
                      <input type="range" min="-300" max="300" value={menuItemsMargin} onChange={(e) => setMenuItemsMargin(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                    </div>
                  </div>
                </div>
              )}
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onMouseEnter={() => {
                    if (!dragState) handleMouseEnter(item.id);
                  }}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                      if (window.innerWidth < 1024) {
                        setHoveredItem(item.id);
                        setTimeout(() => {
                          document.getElementById('intro-right-col')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                      return;
                    }
                    if (item.devMode) {
                      e.preventDefault();
                      handleMenuSelect(item);
                      return;
                    }
                    if (item.id === 'start') {
                      handleMenuSelect(item);
                    } else if (window.innerWidth < 1024) {
                      setHoveredItem(item.id);
                      setTimeout(() => {
                        document.getElementById('intro-right-col')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      handleMenuSelect(item);
                    }
                  }}
                  className={`group flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-4 py-2 md:text-left text-center relative focus:outline-none w-full md:w-fit ${item.devMode ? 'opacity-50' : ''} ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {/* Bullet / Line Selector */}
                  <div 
                    className={`hidden md:block w-4 h-[2px] bg-mafia-gold transition-all duration-300 ${
                      hoveredItem === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  />
                  
                  <div className="flex flex-col w-full items-center md:items-start">
                    <span className={`text-[9px] font-mono transition-colors duration-300 ${
                      hoveredItem === item.id ? "text-mafia-gold/80" : "text-smoke-white/20"
                    }`}>
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      {item.devMode && (
                        <span className="text-[8px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 uppercase tracking-widest rounded-sm whitespace-nowrap">
                          {lang === 'cs' ? 'Ve vývoji' : 'In Dev'}
                        </span>
                      )}
                      {item.disabled && (
                        <Lock size={12} className="text-white/30 shrink-0" />
                      )}
                      <span className={`text-xl md:text-xl w-full md:w-auto font-heading font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                        hoveredItem === item.id 
                          ? `bg-mafia-gold text-mafia-black px-4 py-1.5 md:px-3 md:py-0.5 md:translate-x-2 ${isHighTier ? 'shadow-[0_0_20px_rgba(197,160,89,0.4)]' : ''}` 
                          : item.id === 'rezervace' ? "text-mafia-gold hover:text-mafia-gold/80 drop-shadow-[0_0_5px_rgba(197,160,89,0.3)]" : "text-smoke-white/50 hover:text-smoke-white/80"
                      }`}>
                        {lang === 'zh' ? (item.titleZh || item.titleEn) : lang === 'cs' ? item.titleCs : item.titleEn}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              </motion.div>
            </div>
          )}

          {/* Language Switcher moved to top on mobile */}
          <div 
            id="drag-bottomMenu"
            className="absolute top-4 left-4 md:top-auto md:bottom-6 md:left-10 flex items-center gap-4 md:pt-4 w-auto md:w-64 z-50 group"
            style={{ transform: `translate(${getScaled(langMarginLeft)}, ${getScaled(langMarginTop)})`, cursor: isAdmin ? (dragState?.id === 'bottomMenu' ? 'grabbing' : 'grab') : 'auto' }}
            onPointerDown={(e) => {
              if (!isAdmin || (e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
              e.preventDefault();
              e.stopPropagation();
              setDragState({ id: 'bottomMenu', startX: e.clientX, startY: e.clientY, initialX: langMarginLeft, initialY: langMarginTop });
            }}
          >
            {isAdmin && (
              <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-2 z-50 flex items-center gap-4 transition-opacity rounded shadow-2xl pointer-events-auto">
                <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase whitespace-nowrap">Panel přepínačů</span>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] text-white">X:</span>
                    <input type="range" min="-800" max="800" value={langMarginLeft} onChange={(e) => setLangMarginLeft(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] text-white">Y:</span>
                    <input type="range" min="-800" max="800" value={langMarginTop} onChange={(e) => setLangMarginTop(Number(e.target.value))} className="w-20 accent-mafia-gold" />
                  </div>
                </div>
              </div>
            )}
            <button 
              onClick={() => switchLanguage('cs')} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'cs' ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
            >
               <CzFlag />
               <span className={`text-[9px] font-mono uppercase tracking-widest ${lang === 'cs' ? 'text-mafia-gold font-bold' : 'text-white'}`}>CS</span>
            </button>
            <div className="w-px h-3 bg-mafia-gold/20" />
            <button 
              onClick={() => switchLanguage('en')} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'en' ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
            >
               <GbFlag />
               <span className={`text-[9px] font-mono uppercase tracking-widest ${lang === 'en' ? 'text-mafia-gold font-bold' : 'text-white'}`}>EN</span>
            </button>
            <div className="w-px h-3 bg-mafia-gold/20 mx-2" />
            
            <button 
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isAudioMuted;
                  setIsAudioMuted(!isAudioMuted);
                  if (isAudioMuted) {
                    audioRef.current.play().catch(() => {});
                  }
                }
              }} 
              className="flex items-center justify-center p-3 rounded-full border border-mafia-gold/30 hover:border-mafia-gold hover:bg-mafia-gold/10 transition-all duration-300 group ml-8 md:ml-12"
              title={isAudioMuted ? "Zapnout zvuk" : "Vypnout zvuk"}
            >
              {isAudioMuted ? (
                <VolumeX className="w-7 h-7 text-mafia-gold/50 group-hover:text-mafia-gold" />
              ) : (
                <Volume2 className="w-7 h-7 text-mafia-gold group-hover:text-[#e3c683]" />
              )}
            </button>
          </div>
          
          <audio ref={audioRef} src="/sounds/Notte di Palermo.mp3" loop />
        </div>

        {/* Right Side: Details / Information */}
        <div id="intro-right-col" className="flex-1 w-full md:w-auto md:h-full flex flex-col justify-start md:justify-center items-center px-4 py-8 md:px-12 md:py-0 z-30 relative bg-gradient-to-t md:bg-gradient-to-l from-black/80 to-transparent group pointer-events-none">
          
          {isAdmin && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md border border-mafia-gold p-3 z-50 flex flex-col gap-2 transition-opacity rounded shadow-2xl pointer-events-auto min-w-[200px]">
              <span className="text-[10px] font-mono text-mafia-gold font-bold uppercase mb-1 whitespace-nowrap text-center">Úprava Detailu: {hoveredItem}</span>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-white">X (do stran):</span>
                <input type="range" min="-800" max="800" value={rightColMargins[hoveredItem]?.x || 0} onChange={(e) => setRightColMargins(prev => ({ ...prev, [hoveredItem]: { ...prev[hoveredItem], x: Number(e.target.value) } }))} className="w-24 accent-mafia-gold" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-white">Y (nahoru/dolů):</span>
                <input type="range" min="-800" max="800" value={rightColMargins[hoveredItem]?.y || 0} onChange={(e) => setRightColMargins(prev => ({ ...prev, [hoveredItem]: { ...prev[hoveredItem], y: Number(e.target.value) } }))} className="w-24 accent-mafia-gold" />
              </div>
            </div>
          )}

          {isFullyOpen && (
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div
                  id={`drag-rightCol_${hoveredItem}`}
                  className={`w-full flex flex-col gap-3 relative will-change-transform ${hoveredItem === 'rezervace' ? 'max-w-3xl' : (isHighTier ? 'bg-mafia-black/80 md:bg-mafia-black/40 md:backdrop-blur-md shadow-2xl border border-mafia-gold/20 bg-gradient-to-b from-mafia-gold/[0.05] to-transparent' : 'bg-mafia-black/95 shadow-none border border-white/5')} p-5 md:p-6 max-w-sm rounded-sm pointer-events-auto`}
                  style={{ 
                    transform: `translate(${getScaled(rightColMargins[hoveredItem]?.x || 0, 'x')}, ${getScaled(rightColMargins[hoveredItem]?.y || 0, 'y')})`,
                    cursor: isAdmin ? (dragState?.id === `rightCol_${hoveredItem}` ? 'grabbing' : 'grab') : 'auto'
                  }}
                  onPointerDown={(e) => {
                    if (!isAdmin || (e.target as HTMLElement).closest('input')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragState({ 
                      id: `rightCol_${hoveredItem}`, 
                      startX: e.clientX, 
                      startY: e.clientY, 
                      initialX: rightColMargins[hoveredItem]?.x || 0, 
                      initialY: rightColMargins[hoveredItem]?.y || 0 
                    });
                  }}
                >
                  {renderRightColumnContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>

      {/* Interactive Mouse Spotlight (Moved outside scale-wrapper to align perfectly with screen cursor) */}
      {graphicsTier === 'ultra' && (
        <div 
          className="fixed inset-0 z-[90] pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(197,160,89,0.15), transparent 60%)`,
            mixBlendMode: 'lighten'
          }}
        />
      )}

        {isAdmin && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999999] flex flex-col items-center gap-4">
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-md border border-mafia-gold flex items-center gap-4">
              <span className="text-white font-mono text-xs uppercase whitespace-nowrap text-center">
                Simulace času <br/>
                <span className="text-mafia-gold font-bold">{testHour === null ? 'Reálný čas' : `${testHour}:00`}</span>
              </span>
              <input 
                type="range" 
                min="-1" 
                max="23" 
                value={testHour === null ? -1 : testHour} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTestHour(val === -1 ? null : val);
                }} 
                className="w-24 accent-mafia-gold" 
              />
              
              <div className="flex flex-col items-center gap-2 border-l border-white/20 pl-4 ml-2">
                <span className="text-[10px] text-white/50 uppercase font-mono tracking-widest">Režim grafiky</span>
                <div className="flex gap-2">
                  {['ultra', 'high', 'medium', 'low', 'lite'].map(t => (
                    <button
                      key={t}
                      onClick={() => document.documentElement.setAttribute('data-graphics-tier', t)}
                      className={`px-3 py-1 text-[10px] uppercase font-bold border rounded-sm transition-all ${graphicsTier === t ? 'bg-mafia-gold text-black border-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'border-white/30 text-white/50 hover:border-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const currentLayout = {
                  tomasSize: tomasWidth, tomasTopMargin: tomasMargin, tomasMarginLeft,
                  tomasBtnMarginTop, tomasBtnMarginLeft, tomasBtnScale,
                  tomasNameMarginTop, tomasNameMarginLeft, tomasNameScale,
                  tomasTitleMarginTop, tomasTitleMarginLeft, tomasTitleScale,
                  tomasExpMarginTop, tomasExpMarginLeft, tomasExpScale,
                  headerMargin, headerMarginLeft,
                  menuItemsMargin, menuItemsMarginLeft,
                  rightColMargins,
                  flameMarginTop, flameMarginLeft, flameScale,
                  langMarginTop, langMarginLeft,
                  sunVisible, sunMarginTop, sunMarginLeft, sunScale,
                  moonVisible, moonMarginTop, moonMarginLeft, moonScale,
                  ambientLightMarginTop, ambientLightMarginLeft, ambientLightScale
                };
                const newConfig = {  
                  ...introConfig, 
                  ...currentLayout,
                  layouts: {
                    ...(introConfig?.layouts || {}),
                    [bgImage]: currentLayout
                  },
                  adminTestHour: testHour,
                  baseWidth: windowSize.width || window.innerWidth,
                  baseHeight: windowSize.height || window.innerHeight
                };
                setIntroConfig(newConfig);
                fetch("/api/settings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ key: "intro_menu_config", value: JSON.stringify(newConfig) })
                }).then(() => alert("Úspěšně uloženo!"));
              }}
              className="bg-mafia-gold text-mafia-black font-black uppercase tracking-widest px-8 py-4 shadow-[0_0_20px_rgba(197,160,89,0.5)] hover:bg-white transition-colors flex items-center gap-2 rounded-sm"
            >
              Uložit vše
            </button>
          </div>
        )}
      </div>,
      document.body
    );
  }
