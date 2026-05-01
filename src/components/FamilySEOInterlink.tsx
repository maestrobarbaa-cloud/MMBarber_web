"use client";

import React from "react";
import Link from "next/link";
import { Users, Hammer, Camera, UtensilsCrossed, Zap, Droplets } from "lucide-react";

export function FamilySEOInterlink() {
  const categories = [
    { 
      title: "Instalatéři a Topenáři", 
      slug: "voda", 
      icon: <Droplets size={16} />,
      keywords: ["Vodo Topo Jahoda", "Zdeněk Mička", "opravy vody UH", "topení Bílovice", "havárie vody Slovácko"]
    },
    { 
      title: "Elektro a Revize", 
      slug: "elektro", 
      icon: <Zap size={16} />,
      keywords: ["Roman Jakubčák", "elektrikář Uherské Hradiště", "revize elektro", "elektroinstalace", "silnoproud"]
    },
    { 
      title: "Reality a Stavba", 
      slug: "stavebnictvi", 
      icon: <Hammer size={16} />,
      keywords: ["Sluneční Reality", "Comites", "reality Uherské Hradiště", "stavební dozor", "prodej bytů UH"]
    },
    { 
      title: "Gastro a Zážitky", 
      slug: "gastro", 
      icon: <UtensilsCrossed size={16} />,
      keywords: ["O Shawarma Beef", "Dvůr pod Starýma Horama", "Poe Poe", "nejlepší jídlo UH", "ubytování Slovácko"]
    },
    { 
      title: "Právo a Účty", 
      slug: "ucetni", 
      icon: <Users size={16} />,
      keywords: ["Romana Mičková", "účetnictví Uherské Hradiště", "daně Slovácko", "mzdová agenda", "účetní poradenství"]
    },
    { 
      title: "Kola a Servis", 
      slug: "kola", 
      icon: <Users size={16} />,
      keywords: ["O Kolečko víc", "servis jízdních kol UH", "prodej elektrokol", "cykloservis Slovácko", "horská kola"]
    },
    { 
      title: "Vzdělávání", 
      slug: "akademie", 
      icon: <Users size={16} />,
      keywords: ["MM BARBER Akademie", "kurzy stříhání UH", "barber workshop", "mentorství pro muže", "výuka řemesla"]
    },
    { 
      title: "Technologie", 
      slug: "team", 
      icon: <Zap size={16} />,
      keywords: ["Tomáš Mička Design", "vývoj webů UH", "digitální identita", "SEO optimalizace", "AI integrace"]
    }
  ];

  const getTargetUrl = (slug: string) => {
    if (slug === 'akademie') return '/akademie';
    if (slug === 'team') return '/specialni-mise';
    return `/rodina?div=${slug}`;
  };

  return (
    <div className="w-full bg-mafia-black border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-12 opacity-40">
          <Users size={20} className="text-mafia-gold" />
          <h2 className="font-mono text-xs uppercase tracking-[0.5em] text-mafia-gold">MM_BARBER_FAMILY_PROFESSIONAL_DIRECTORY</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-2 text-mafia-gold">
                {cat.icon}
                <span className="font-heading font-black text-sm uppercase tracking-wider">{cat.title}</span>
              </div>
              <div className="flex flex-col gap-2">
                {cat.keywords.map((kw, kIdx) => (
                  <Link 
                    key={kIdx} 
                    href={getTargetUrl(cat.slug)}
                    className="text-smoke-white/40 hover:text-mafia-gold transition-colors text-xs font-sans border-l border-white/5 pl-3 hover:border-mafia-gold/40 py-1"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hidden SEO Density Layer */}
        <div className="mt-20 opacity-[0.01] select-none pointer-events-none text-[6px] columns-3 md:columns-5 gap-4">
          <p>
            Prověřené služby Uherské Hradiště, doporučení řemeslníci Slovácko, nejlepší instalatér Mařatice, 
            revize elektro Kunovice, realitní makléř Staré Město, svatební fotograf Zlín, 
            půjčovna kol UH, stínící technika Slovácko, účetní služby Hradiště. 
            MM BARBER Rodina propojuje lokální patrioty a špičkové mistry svého oboru. 
            Kvalita, důvěra a osobní doporučení v regionu Uherské Hradiště.
          </p>
        </div>

      </div>
    </div>
  );
}
