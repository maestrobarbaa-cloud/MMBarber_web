"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";
import { getMegaMenuData, type MegaMenuData } from "@/data/megaMenuData";
import { useGame } from "@/contexts/GameContext";
import { type Language } from "@/hooks/useTranslation";
import { useUI } from "@/contexts/UIContext";

interface DesktopMegaMenuProps {
  lang: Language;
  hoveredCategory: string | null;
  setHoveredCategory: (category: string | null) => void;
  isMenuOpen: boolean;
  isMobile: boolean;
  pathname: string;
}

export const DesktopMegaMenu = React.memo(function DesktopMegaMenu({
  lang,
  hoveredCategory,
  setHoveredCategory,
  isMenuOpen,
  isMobile,
  pathname,
}: DesktopMegaMenuProps) {
  const megaMenuData = getMegaMenuData(lang);
  const currentCategory = hoveredCategory as keyof typeof megaMenuData;
  const { totalCollected, chapterXp } = useGame();
  const { isBloodMode } = useUI();
  
  // Zamezíme chybám při hydrataci tím, že počkáme na mount pro jiskry
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);

  return (
    <AnimatePresence>
      {hoveredCategory && !isMenuOpen && !isMobile && megaMenuData[currentCategory] && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[100%] left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-mafia-gold/20 overflow-hidden z-[29000] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {/* Žhavé jiskry v pozadí megamenu */}
          {isMounted && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0] opacity-50">
              {Array.from({ length: 15 }).map((_, i) => {
                const startX = Math.random() * 120 - 20;
                const distanceX = Math.random() * 20 + 10;
                const width = Math.random() * 2 + 1;
                return (
                  <motion.div
                    key={`megamenu-spark-${i}`}
                    className={`absolute rounded-full shadow-[0_0_8px_1px_currentColor] ${isBloodMode ? 'bg-mafia-red text-mafia-red' : (typeof document !== 'undefined' && document.documentElement.classList.contains('noir-mode')) ? 'bg-white text-white' : 'bg-[#ffd700] text-[#ffd700]'}`}
                    style={{
                      width: `${width}px`,
                      height: `${width}px`,
                      filter: `blur(${Math.random() * 0.5}px)`,
                    }}
                    initial={{ 
                       y: '300px',
                       x: `${startX}vw`,
                       opacity: 0
                    }}
                    animate={{
                      y: '-20px',
                      x: `${startX + distanceX}vw`,
                      opacity: [0, Math.random() * 0.5 + 0.3, 0]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 10
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="max-w-7xl mx-auto px-12 py-12 flex justify-center gap-24 relative z-10">
            {megaMenuData[currentCategory].groups.map((group, idx) => (
              <div key={idx} className="flex flex-col">
                <h3 className="text-mafia-gold/60 text-[10px] font-mono tracking-widest uppercase mb-6">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {group.items.map((item, itemIdx) => {
                    const isLocked = item.requiredXP && (
                      item.path === '/komunita' 
                        ? (chapterXp['community'] || 0) < item.requiredXP 
                        : totalCollected < item.requiredXP
                    );
                    
                    return (
                    <li key={itemIdx}>
                      {isLocked ? (
                        <div className="text-white/30 text-sm font-sans flex items-center gap-2 cursor-not-allowed opacity-50">
                          <Lock size={14} className="text-white/30" />
                          {item.name}
                          <span className="text-[10px] font-mono text-mafia-gold/40 ml-2">{item.requiredXP} XP</span>
                        </div>
                      ) : (
                        <Link
                          href={item.path}
                          className="text-smoke-white text-sm font-sans hover:text-mafia-gold transition-colors block whitespace-nowrap"
                          onClick={(e) => {
                            setHoveredCategory(null);
                            if (item.path.includes("#") && pathname === "/") {
                              e.preventDefault();
                              document
                                .querySelector(item.path.replace("/", ""))
                                ?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  );
                  })}
                </ul>
              </div>
            ))}

            {megaMenuData[currentCategory].promo && (
              <Link
                href={megaMenuData[currentCategory].promo!.path}
                onClick={() => setHoveredCategory(null)}
                className="group relative w-[340px] rounded-xl overflow-hidden border border-mafia-gold/20 flex flex-col justify-end p-6 hover:border-mafia-gold/60 transition-all duration-500 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={megaMenuData[currentCategory].promo!.image}
                    alt="Promo"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-mafia-black via-mafia-black/80 to-transparent" />
                </div>
                <div className="relative z-10 flex flex-col gap-3">
                  <h4 className="text-smoke-white font-playfair font-bold text-2xl leading-tight group-hover:text-mafia-gold transition-colors">
                    {megaMenuData[currentCategory].promo!.title}
                  </h4>
                  <p className="text-white/70 text-xs font-sans leading-relaxed">
                    {megaMenuData[currentCategory].promo!.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-mafia-gold text-[11px] font-black uppercase tracking-widest">
                    {megaMenuData[currentCategory].promo!.cta}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
