"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  X, 
  Scissors, 
  CreditCard, 
  ShoppingBag, 
  Gift, 
  Users, 
  BookOpen, 
  Image as ImageIcon, 
  Shield, 
  Crown, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  HelpCircle, 
  Settings 
} from "lucide-react";

type Shortcut = {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  action: string;
};

const DEFAULT_SHORTCUTS: Shortcut[] = [
  // Sloupec 1
  { id: "services", label: "Služby", icon: "Scissors", x: 20, y: 20, action: "/#services" },
  { id: "cenik", label: "Ceník", icon: "CreditCard", x: 20, y: 120, action: "/cenik" },
  { id: "products", label: "E-shop", icon: "ShoppingBag", x: 20, y: 220, action: "/produkty" },
  { id: "vouchery", label: "Vouchery", icon: "Gift", x: 20, y: 320, action: "/vouchery" },

  // Sloupec 2
  { id: "team", label: "Rodina", icon: "Users", x: 140, y: 20, action: "/rodina" },
  { id: "pribeh", label: "Příběh", icon: "BookOpen", x: 140, y: 120, action: "/pribeh?v=2" },
  { id: "galerie", label: "Galerie", icon: "ImageIcon", x: 140, y: 220, action: "/galerie" },
  { id: "arzenal", label: "Arzenál", icon: "Shield", x: 140, y: 320, action: "/arzenal" },

  // Sloupec 3
  { id: "vip", label: "VIP Club", icon: "Crown", x: 260, y: 20, action: "/vip-club" },
  { id: "kariera", label: "Kariéra", icon: "Briefcase", x: 260, y: 120, action: "/kariera" },
  { id: "akademie", label: "Akademie", icon: "GraduationCap", x: 260, y: 220, action: "/akademie" },
  { id: "kontakt", label: "Kontakt", icon: "Phone", x: 260, y: 320, action: "/#kontakt" },

  // Sloupec 4
  { id: "faq", label: "FAQ", icon: "HelpCircle", x: 380, y: 20, action: "/faq" },
  { id: "settings", label: "Nastavení", icon: "Settings", x: 380, y: 120, action: "/nastaveni" },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Scissors, CreditCard, ShoppingBag, Gift, Users, BookOpen, ImageIcon, Shield, Crown, Briefcase, GraduationCap, Phone, HelpCircle, Settings
};

export function DesktopView() {
  const router = useRouter();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("mmbarber_desktop_shortcuts");
    if (saved) {
      try {
        let parsedSaved: Shortcut[] = JSON.parse(saved);
        
        // MIGRATION: if old icons were png paths, update them to the new Lucide icon names from DEFAULT_SHORTCUTS
        parsedSaved = parsedSaved.map(savedShortcut => {
          if (savedShortcut.icon.includes('/obr/')) {
            const defaultMatch = DEFAULT_SHORTCUTS.find(d => d.id === savedShortcut.id);
            if (defaultMatch) {
              return { ...savedShortcut, icon: defaultMatch.icon };
            }
          }
          return savedShortcut;
        });

        // Find any default shortcuts that are NOT in the saved array
        const missingDefaults = DEFAULT_SHORTCUTS.filter(
          def => !parsedSaved.find(s => s.id === def.id)
        );
        
        const finalShortcuts = [...parsedSaved, ...missingDefaults];
        setShortcuts(finalShortcuts);
        // Save the migrated array back
        localStorage.setItem("mmbarber_desktop_shortcuts", JSON.stringify(finalShortcuts));
        
      } catch (e) {
        setShortcuts(DEFAULT_SHORTCUTS);
      }
    } else {
      setShortcuts(DEFAULT_SHORTCUTS);
    }
  }, []);

  const savePositions = (newShortcuts: Shortcut[]) => {
    setShortcuts(newShortcuts);
    localStorage.setItem("mmbarber_desktop_shortcuts", JSON.stringify(newShortcuts));
  };

  const handleDragEnd = (id: string, info: any) => {
    const updated = shortcuts.map(s => {
      if (s.id === id) {
        return {
          ...s,
          x: s.x + info.offset.x,
          y: s.y + info.offset.y
        };
      }
      return s;
    });
    savePositions(updated);
  };

  const handleDelete = (id: string) => {
    const updated = shortcuts.filter(s => s.id !== id);
    savePositions(updated);
  };

  if (!isClient) return null;

  return (
    <div className="relative w-full h-[100dvh] bg-[url('/obr/main-hero.png')] bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-mafia-black/70 backdrop-blur-sm"></div>
      
      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black/80 backdrop-blur-xl border-t border-white/10 z-[1000] flex items-center px-4">
        <button 
          onClick={() => {
            localStorage.setItem("mmbarber_desktop_mode", "false");
            window.location.reload();
          }}
          className="flex items-center gap-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 text-mafia-gold px-4 py-1.5 rounded-sm font-mono text-sm border border-mafia-gold/30 transition-colors"
        >
          <X size={16} /> Vypnout režim plochy
        </button>
      </div>

      {/* Desktop Area */}
      <div className="absolute inset-0 pb-12 z-10 p-4">
        {shortcuts.map(shortcut => {
          const IconComponent = ICON_MAP[shortcut.icon] || Settings;

          return (
            <motion.div
              key={shortcut.id}
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => handleDragEnd(shortcut.id, info)}
              initial={{ x: shortcut.x, y: shortcut.y }}
              animate={{ x: shortcut.x, y: shortcut.y }}
              className="absolute flex flex-col items-center justify-center w-28 gap-3 cursor-pointer group"
            >
              <div className="relative w-20 h-20 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                
                <IconComponent size={40} className="text-mafia-gold" />
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(shortcut.id); }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
              <span className="text-sm text-white font-mono text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/50 px-3 py-1 rounded-sm">
                {shortcut.label}
              </span>

              {/* Click area to open */}
              <div 
                className="absolute inset-0 z-[-1]"
                onClick={() => router.push(shortcut.action)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
