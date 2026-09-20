"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Copy, Check, Server, Shield, Sword, Users, Calendar, 
  Globe
} from "lucide-react";
import { Footer } from "@/components/Footer";

import VoxelBuilder from "@/components/mc/VoxelBuilder";

const pageData = {
  hero: {
    title: "MM BARBER",
    subtitle: "SURVIVAL",
    description: "Exkluzivní server pro komunitu MMBarber. Zažijte jedinečné dobrodružství, ekonomiku a PVP turnaje ve světě, který si sami budujete.",
    ip: "mc.mmbarber.cz",
    version: "Verze 1.20.4+"
  },
  sections: [
    {
      id: "features",
      type: "grid",
      title: "O Serveru",
      items: [
        { icon: "Shield", title: "Ekonomika", desc: "Propracovaný systém obchodu a trhu" },
        { icon: "Sword", title: "PVP Arény", desc: "Speciální zóny pro souboje s odměnami" },
        { icon: "Users", title: "Klany", desc: "Vytvořte alianci a ovládněte území" },
        { icon: "Globe", title: "Dynmapa", desc: "Živý 3D pohled na mapu v prohlížeči" }
      ]
    },
    {
      id: "news",
      type: "feed",
      title: "Novinky",
      items: [
        { label: "15.09.2026", title: "Wipe & Nová Sezóna", desc: "Připravili jsme pro vás kompletní wipe mapy a spuštění nové sezóny s upravenou ekonomií a novými lokacemi." },
        { label: "02.09.2026", title: "Přidán nový VIP rank", desc: "Do storu byl přidán nový limitovaný balíček s exkluzivními výhodami pro ty nejvěrnější hráče." }
      ]
    },
    {
      id: "events",
      type: "highlight-feed",
      title: "Eventy",
      items: [
        { label: "Pátek 20:00", title: "Turnaj v aréně", desc: "Změřte síly s ostatními hráči o hodnotné odměny." },
        { label: "Neděle 18:00", title: "Boss Fight Event", desc: "Společný lov na nového custom bosse. Účast nutná!" }
      ]
    }
  ]
};

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const icons: Record<string, any> = { Shield, Sword, Users, Globe };
  const LucideIcon = icons[name] || Shield;
  return <LucideIcon {...props} />;
};

export default function MinecraftPremiumPage() {
  const { lang } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [accentColor, setAccentColor] = useState("var(--color-mafia-gold)");
  const [serverStatus, setServerStatus] = useState<'LOADING' | 'ONLINE' | 'OFFLINE'>('LOADING');
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--user-accent-color').trim();
      if (color && color !== "" && !color.includes('NaN')) setAccentColor(color);
    };
    updateColor();
    window.addEventListener('mmbarber-accent-update', updateColor);
    return () => window.removeEventListener('mmbarber-accent-update', updateColor);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${pageData.hero.ip}`);
        const data = await res.json();
        if (data.online) {
          setServerStatus('ONLINE');
          setPlayerCount(data.players?.online || 0);
        } else {
          setServerStatus('OFFLINE');
        }
      } catch (err) {
        setServerStatus('OFFLINE');
      }
    };
    fetchStatus();
    
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(pageData.hero.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* INTERAKTIVNÍ 3D POZADÍ (MINECRAFT) */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <VoxelBuilder pageData={pageData} />
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
        <Link 
          href="/komunita/projekty" 
          className="pointer-events-auto group flex items-center gap-4 text-white/50 hover:text-white transition-colors font-mono text-xs tracking-[0.4em] uppercase"
          style={{ color: copied ? accentColor : undefined }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" style={{ color: accentColor }} />
          {lang === 'cs' ? "ZPĚT NA PROJEKTY" : "BACK TO PROJECTS"}
        </Link>
        <div className="text-right pointer-events-auto flex items-center gap-4 bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10 rounded-md">
          <div className="flex items-center gap-2">
            <Server size={14} style={{ color: serverStatus === 'ONLINE' ? accentColor : serverStatus === 'OFFLINE' ? '#ef4444' : '#6b7280' }} className={serverStatus === 'ONLINE' ? "animate-pulse" : ""} />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: serverStatus === 'ONLINE' ? accentColor : serverStatus === 'OFFLINE' ? '#ef4444' : '#6b7280' }}>
              {serverStatus === 'ONLINE' ? `${playerCount} PLAYERS` : 'OFFLINE'}
            </span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <button onClick={handleCopyIP} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <span className="text-xs font-mono font-bold tracking-widest text-white">{pageData.hero.ip}</span>
             {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-white/50" />}
          </button>
        </div>
      </nav>
    </div>
  );
}
