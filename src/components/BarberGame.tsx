"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Minimize2, Maximize2, Heart, Ghost, Gift, Rocket, Monitor, Flag, Diamond, Flame, Sparkles } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { usePathname } from "next/navigation";
import { getActiveTheme } from "../lib/holidays";
import { playSound } from "../utils/audio";

interface GameItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  type: number;
}

interface Popup {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface VisualEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ThemeRank {
  title: string;
  desc: string;
}

interface ThemeData {
  ranks: ThemeRank[];
  quips: string[];
  hairTooltip: string;
  rankLabel: string;
}

const HAIR_COLORS = ["#4E3123", "#8D5524", "#C68642", "#E1AD01", "#7B7B7B", "#A12312"];
const HAIR_IMAGES = ["/hair_asset_fade.png", "/hair_asset_beard.png", "/hair_asset_pompadour.png"];

const THEME_IMAGES: Record<string, string> = {
  valentine: "/valentine_item.png",
  halloween: "/halloween_item.png",
  christmas: "/christmas_item.png",
  newyear: "/new_year_item.png",
  matrix: "/matrix_item.png",
  czech: "/czech_item.png",
  secret: "/secret_item.png",
  "childrens-day": "/toy_item.png",
};

const THEME_COLORS: Record<string, string[]> = {
  valentine: ["#ff4d4d", "#ff1a1a", "#e60000", "var(--color-mafia-gold)", "#ffffff"],
  halloween: ["#ff6600", "#cc5200", "#9900cc", "#660099", "#1a1a1a", "var(--color-mafia-gold)"],
  christmas: ["#e60000", "#009933", "var(--color-mafia-gold)", "#ffffff", "#ffd700"],
  newyear: ["#00ccff", "#33cc33", "#ffcc00", "#cc00ff", "#ffffff"],
  matrix: ["#00ff41", "#003b00", "#008f11", "#00ff41"],
  czech: ["#11457e", "#d7141a", "#ffffff", "var(--color-mafia-gold)"],
  secret: ["#8a0707", "var(--color-mafia-gold)", "#000000", "#ffffff"],
  easter: ["#FFD700", "#FF69B4", "#7FFFD4", "#E6E6FA", "#FFFFFF"],
  "childrens-day": ["#FF007F", "#00E5FF", "#00FF00", "#FFD700", "#FFFFFF"],
  witches: ["#ff4500", "#ff6600", "#ff8c00", "#ffd700", "#8b0000"]
};


export function BarberGame() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isVip = pathname === "/vip-club";

  const [items, setItems] = useState<GameItem[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  const [score, setScore] = useState(0);
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [isGameEnabled, setIsGameEnabled] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [isManuallyEnabled, setIsManuallyEnabled] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>('default');

  const themeMetadata = (t.game as Record<string, ThemeData>);
  const themeData = themeMetadata[activeTheme] || themeMetadata.default;
  const ranks = themeData.ranks;
  const thresholds = [0, 5, 12, 25, 50];
  const currentLevelObj = [...ranks].reverse().find((_, i) => score >= thresholds[ranks.length - 1 - i]) || ranks[0];

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 1024);
    checkPC();
    window.addEventListener("resize", checkPC);
    
    const syncGameState = () => {
      const vMode = (localStorage.getItem("mmbarber_dev_visual_mode") || 'default');
      const theme = getActiveTheme();
      
      let themeToSet = 'default';
      if (vMode !== 'default' && vMode !== 'normal') themeToSet = vMode;
      else if (theme !== 'default') themeToSet = theme;
      else themeToSet = localStorage.getItem("mmbarber_dev_theme_override") || 'default';
      
      setActiveTheme(themeToSet);

      // Visibility Rules:
      // 1. Special events (theme !== 'default') always auto-start.
      // 2. Default hair cutting game starts ONLY manually.
      const enabled = (themeToSet !== 'default') || isManuallyEnabled;
      setIsGameEnabled(enabled);

      // Notify Header about current status
      window.dispatchEvent(new CustomEvent('mmbarber-game-status-update', { detail: enabled }));

      if (!enabled) {
        setItems([]);
        setPopups([]);
        setEffects([]);
      }
    };

    const handleToggle = () => {
        setIsManuallyEnabled(prev => !prev);
    };
    
    syncGameState();
    window.addEventListener('mmbarber-game-update', syncGameState);
    window.addEventListener('mmbarber-game-force-update', syncGameState);
    window.addEventListener('mmbarber-mode-update', syncGameState);
    window.addEventListener('mmbarber-theme-update', syncGameState);
    window.addEventListener('mmbarber-game-toggle', handleToggle);
    
    return () => {
      window.removeEventListener("resize", checkPC);
      window.removeEventListener('mmbarber-game-update', syncGameState);
      window.removeEventListener('mmbarber-game-force-update', syncGameState);
      window.removeEventListener('mmbarber-mode-update', syncGameState);
      window.removeEventListener('mmbarber-theme-update', syncGameState);
      window.removeEventListener('mmbarber-game-toggle', handleToggle);
    };
  }, [isManuallyEnabled]); // Re-sync when manual state changes

  const spawnItem = useCallback(() => {
    if (items.length >= 8) return;

    const isLeftSide = Math.random() < 0.5;
    const xCoord = isLeftSide
      ? Math.random() * 20 + 10 
      : Math.random() * 20 + 70;

    const colors = THEME_COLORS[activeTheme] || HAIR_COLORS;

    const newItem = {
      id: Date.now() + Math.random(),
      x: xCoord,
      y: Math.random() * 60 + 20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.floor(Math.random() * 3), // Max 3 types
    };

    setItems(prev => [...prev, newItem]);
  }, [items, activeTheme]);

  useEffect(() => {
    if (!isPC || !isGameEnabled) return;

    const timeout = setTimeout(spawnItem, 5000);
    const interval = setInterval(() => {
      spawnItem();
    }, Math.random() * 15000 + 15000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [spawnItem, isPC, isGameEnabled]);

  const interactItem = (item: GameItem) => {
    setItems(prev => prev.filter(h => h.id !== item.id));
    setScore(prev => prev + 1);

    const quips = activeTheme === 'matrix' 
      ? ['SYSTEM OVERRIDE', 'WAKE UP NEO', 'DATA RECOVERED', 'DECODING...', 'ACCESS GRANTED']
      : themeData.quips;

    const newPopup = {
      id: Date.now(),
      text: quips[Math.floor(Math.random() * quips.length)],
      x: item.x,
      y: item.y
    };
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 7000);

    // Special Effects
    if (activeTheme === 'newyear' || activeTheme === 'matrix' || activeTheme === 'secret') {
      const effectCount = (activeTheme === 'newyear' || activeTheme === 'secret') ? 4 : 2;
      for (let i = 0; i < effectCount; i++) {
        setTimeout(() => {
          const effect = { 
            id: Date.now() + i, 
            x: item.x + (Math.random() * 10 - 5), 
            y: item.y + (Math.random() * 10 - 5), 
            color: activeTheme === 'matrix' ? '#00ff41' : (activeTheme === 'secret' ? '#8a0707' : item.color)
          };
          setEffects(prev => [...prev, effect]);
          setTimeout(() => setEffects(prev => prev.filter(e => e.id !== effect.id)), 1000);
        }, i * 150);
      }
    }


    playSound('/scissors.mp3', 0.3);
  };



  if (!isPC || !isGameEnabled) return null;

  const getThemeIcon = (item: GameItem) => {
    // Icon selection based on theme
    const iconList = {
      valentine: [Heart],
      halloween: [Ghost],
      christmas: [Gift],
      newyear: [Rocket],
      matrix: [Monitor],
      czech: [Flag],
      secret: [Diamond],
      "childrens-day": [Rocket], // Simplified
      witches: [Flame, Sparkles, Flame],
      default: [Scissors, Scissors, Scissors] // Focusing on scissors for default
    };

    const icons = iconList[activeTheme as keyof typeof iconList] || iconList.default;
    const IconComponent = icons[item.type % icons.length] || Scissors;
    
    return (
      <motion.div
        animate={{ 
          rotate: item.rotation,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-mafia-gold flex items-center justify-center"
      >
        <IconComponent 
          size={isPC ? 64 : 48} 
          strokeWidth={1.5}
          className="drop-shadow-[0_0_15px_rgba(197,160,89,0.8)] filter transition-all duration-300 group-hover:scale-125" 
        />
      </motion.div>
    );
  };

  const HudIconMap: Record<string, React.ElementType> = {
    valentine: Heart,
    halloween: Ghost,
    christmas: Gift,
    newyear: Rocket,
    matrix: Monitor,
    czech: Flag,
    secret: Diamond,
    witches: Flame,
    default: Scissors
  };
  const HudIcon = HudIconMap[activeTheme] || Scissors;

  return (
    <>
      <style>{`
        .game-cursor {
          cursor: crosshair;
        }
        @keyframes floatItem {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translate(-50%, 0); }
          20% { opacity: 1; transform: translate(-50%, -20px); }
          100% { opacity: 0; transform: translate(-50%, -60px); }
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-item { animation: floatItem 6s ease-in-out infinite; }
        .animate-popup { animation: fadeUp 2s ease-out forwards; }
        .animate-bounce-x { animation: bounce-x 1s ease-in-out infinite; }
      `}</style>

      <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none">
        

        {/* Falling Items */}
        {items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              interactItem(item);
            }}
            className="absolute pointer-events-auto game-cursor group p-8 transition-transform duration-300 hover:scale-110"
            style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="animate-item transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
              {getThemeIcon(item)}
            </div>
            <div className="absolute top-[85%] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-mafia-black border border-mafia-gold/50 text-mafia-gold text-[10px] font-mono px-2 py-1 uppercase tracking-tighter whitespace-nowrap z-20">
              {themeData.hairTooltip}
            </div>
          </div>
        ))}

        {/* Fireworks / Glitch Effects */}
        {effects.map(effect => (
          <div key={effect.id} className="absolute pointer-events-none z-[105]" style={{ left: `${effect.x}%`, top: `${effect.y}%` }}>
            <div className="relative">
               <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: effect.color, transform: 'translate(-20px, -20px)', animationDuration: '0.6s' }}></div>
               <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: effect.color, transform: 'translate(20px, -20px)', animationDuration: '0.8s', animationDelay: '0.1s' }}></div>
               <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: effect.color, transform: 'translate(-20px, 20px)', animationDuration: '0.5s', animationDelay: '0.2s' }}></div>
               <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: effect.color, transform: 'translate(20px, 20px)', animationDuration: '0.7s', animationDelay: '0.15s' }}></div>
            </div>
          </div>
        ))}

        {/* Popups */}
        {popups.map(popup => (
          <div 
            key={popup.id}
            className="absolute animate-popup text-mafia-gold font-heading font-black text-xl md:text-2xl uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] z-30"
            style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
          >
            {popup.text}
          </div>
        ))}

        {/* Score HUD */}
        <div className={`fixed ${isVip ? 'bottom-[102px]' : 'bottom-[164px]'} right-6 pointer-events-auto z-[110] transition-all duration-500`}>
          <div className={`bg-mafia-black/95 border-2 border-mafia-gold/30 p-4 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-500 rounded-none flex items-center ${isHudMinimized ? "w-16 h-16" : "w-64 h-[72px]"}`}>
            
            {!isHudMinimized && (
              <button 
                onClick={() => setIsHudMinimized(true)}
                className="absolute top-1 right-1 p-1 text-mafia-gold/50 hover:text-mafia-gold z-20"
              >
                  <Minimize2 size={12} />
              </button>
            )}

            {isHudMinimized && (
              <button 
                onClick={() => setIsHudMinimized(false)}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-1 text-mafia-gold/50 hover:text-mafia-gold z-20"
              >
                  <Maximize2 size={12} />
              </button>
            )}

            <div className="flex items-center gap-4">
              <div className={`shrink-0 bg-mafia-gold/10 border border-mafia-gold/30 flex items-center justify-center relative ${isHudMinimized ? "w-full h-full border-none" : "w-12 h-12"}`}>
                <HudIcon className="text-mafia-gold drop-shadow-[0_0_5px_currentColor]" size={isHudMinimized ? 24 : 18} />
                <span className="absolute -top-4 -right-2 bg-mafia-red text-white text-[10px] font-black px-1.5 py-0.5 shadow-md z-[115]">
                  {score}
                </span>
              </div>

              {!isHudMinimized && (
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-mono text-mafia-gold/60 tracking-widest">{themeData.rankLabel}</p>
                  <h4 className="text-smoke-white font-heading font-bold text-sm truncate uppercase tracking-tighter">{currentLevelObj.title}</h4>
                  <p className="text-[10px] text-smoke-white/40 italic font-sans leading-tight mt-0.5">{currentLevelObj.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
