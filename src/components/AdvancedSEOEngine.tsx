"use client";

import React, { useEffect, useState } from "react";
import { ADVANCED_SEO_CONTENT, SEOVariant } from "@/data/AdvancedSEOContent";
import { useTranslation } from "../hooks/useTranslation";
import { useGame } from "../contexts/GameContext";
import { useUI } from "../contexts/UIContext";

export function AdvancedSEOEngine() {
  const { lang } = useTranslation();
  const { isAdmin } = useGame();
  const { atmosphereOverride, isNoirMode, isBloodMode } = useUI();
  
  const [activeVariant, setActiveVariant] = useState<SEOVariant | null>(null);

  useEffect(() => {
    const currentLang = lang || "cs";
    const contentDb = ADVANCED_SEO_CONTENT[currentLang] || ADVANCED_SEO_CONTENT["cs"];
    
    // Determine category based on atmosphere or date
    let category = "classic";
    
    // Check date-based events first (if not overridden by something else)
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    const isSlovackoTime = month === 8 && date >= 1 && date <= 15; // Sep 1-15
    
    if (atmosphereOverride === "slovacko" || (atmosphereOverride === "classic" && isSlovackoTime)) {
      category = "slovacko";
    } else if (atmosphereOverride === "noir" || atmosphereOverride === "blood" || isNoirMode || isBloodMode) {
      category = "noir";
    }
    
    const variants = contentDb[category] || contentDb["classic"];
    
    // Random rotation for A/B testing within the category
    // In a real app, this might be tied to a daily seed or session to prevent jumping
    const randomIndex = Math.floor(Math.random() * variants.length);
    setActiveVariant(variants[randomIndex]);
  }, [lang, atmosphereOverride, isNoirMode, isBloodMode]);

  if (!activeVariant) return null;

  return (
    <section className="w-full py-16 px-6 bg-transparent border-t border-white/5 relative z-10">
      <div className="max-w-5xl mx-auto text-left transition-all duration-1000 opacity-100 blur-none">
        <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-mafia-gold animate-pulse"></span>
          MMBARBER // ADVANCED SEO ENGINE V2.0
        </h4>
        
        <div className="prose prose-invert prose-mafia max-w-none">
          <h1 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-widest mb-8">
            {activeVariant.title}
          </h1>
          
          <div 
            className="text-sm md:text-base font-sans text-smoke-white/70 space-y-6 [&>h2]:text-mafia-gold [&>h2]:font-heading [&>h2]:text-xl [&>h2]:uppercase [&>h3]:text-white [&>h3]:font-bold [&>h3]:text-lg [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: activeVariant.content }}
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {activeVariant.keywords.map((kw: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono text-mafia-gold/60 uppercase tracking-widest rounded-sm">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

