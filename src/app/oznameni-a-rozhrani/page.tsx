"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Monitor,
  Flame,
  Clock,
  Calendar,
  Cloud,
  Sparkles,
  Check,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";

// ── Typy ──────────────────────────────────────────────────────────────────────
interface UIPreference {
  key: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
  group: "widgety" | "atmosfera";
}

// ── Definice preferencí ────────────────────────────────────────────────────────
const PREFERENCES: UIPreference[] = [
  {
    key: "mmbarber_hide_hot_activity",
    label: "Žhavá aktivita",
    desc: "Pop-up notifikace o tom, kdo si právě prohlíží barbery nebo tvoří rezervaci.",
    icon: <Flame size={22} />,
    accentColor: "rgba(220, 80, 50, 0.8)",
    group: "widgety",
  },
  {
    key: "mmbarber_hide_historical_events",
    label: "Dnes v historii",
    desc: "Tlačítko v levém dolním rohu s historickými událostmi pro dnešní datum.",
    icon: <Clock size={22} />,
    accentColor: "rgba(197, 160, 89, 0.8)",
    group: "widgety",
  },
  {
    key: "mmbarber_hide_events",
    label: "Eventy a akce",
    desc: "Sekce s týdenními akcemi a speciálními nabídkami (Casino čtvrtek, Prohibiční pondělí…).",
    icon: <Calendar size={22} />,
    accentColor: "rgba(80, 160, 220, 0.8)",
    group: "widgety",
  },
  {
    key: "mmbarber_hide_weather",
    label: "Počasí overlay",
    desc: "Atmosférický vizuální efekt počasí (déšť, sníh, bouřka) na pozadí webu.",
    icon: <Cloud size={22} />,
    accentColor: "rgba(100, 180, 255, 0.8)",
    group: "atmosfera",
  },
  {
    key: "mmbarber_hide_seasonal",
    label: "Sezónní atmosféra",
    desc: "Animované sezónní efekty — padající listí, sníh, Halloween plameny a další.",
    icon: <Sparkles size={22} />,
    accentColor: "rgba(197, 160, 89, 0.8)",
    group: "atmosfera",
  },
];

// ── Toggle komponenta ──────────────────────────────────────────────────────────
function PreferenceToggle({
  pref,
  isHidden,
  onToggle,
  index,
  disabled,
}: {
  pref: UIPreference;
  isHidden: boolean;
  onToggle: (key: string) => void;
  index: number;
  disabled?: boolean;
}) {
  const isEnabled = !isHidden;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`relative group border transition-all duration-500 ${
        disabled
          ? "border-mafia-red/30 bg-mafia-red/5 opacity-50 grayscale"
          : isEnabled
          ? "border-mafia-gold/30 bg-mafia-gold/5"
          : "border-white/8 bg-white/3"
      }`}
    >
      {/* Top accent */}
      {isEnabled && !disabled && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${pref.accentColor}, transparent)`,
          }}
        />
      )}

      <div className="flex items-center justify-between p-5 gap-4">
        {/* Ikona + text */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              borderColor: isEnabled ? pref.accentColor : "rgba(255,255,255,0.12)",
              backgroundColor: isEnabled
                ? `rgba(${pref.accentColor
                    .replace(/rgba\(/, "")
                    .replace(/,\s*[\d.]+\)/, "")}, 0.12)`
                : "rgba(255,255,255,0.04)",
              color: isEnabled ? pref.accentColor : "rgba(255,255,255,0.3)",
            }}
          >
            {pref.icon}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`font-sans font-black uppercase text-sm tracking-wider transition-colors duration-300 ${
                  isEnabled ? "text-white" : "text-white/40"
                }`}
              >
                {pref.label}
              </span>
              {isEnabled ? (
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-green-400/70">
                  <Eye size={9} /> ZOBRAZENO
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-white/25">
                  <EyeOff size={9} /> SKRYTO
                </span>
              )}
            </div>
            <p
              className={`text-xs font-mono leading-relaxed mt-0.5 transition-colors duration-300 ${
                isEnabled ? "text-white/50" : "text-white/25"
              }`}
            >
              {pref.desc}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => !disabled && onToggle(pref.key)}
          aria-label={`Přepnout: ${pref.label}`}
          disabled={disabled}
          className={`shrink-0 relative w-12 h-6 rounded-full transition-all duration-400 flex items-center focus:outline-none active:scale-95 ${
            disabled
              ? "bg-mafia-red/20 cursor-not-allowed"
              : isEnabled
              ? "bg-mafia-gold"
              : "bg-white/10"
          }`}
        >
          <motion.div
            animate={{ x: isEnabled ? 24 : 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-4 h-4 rounded-full shadow-md transition-colors duration-300 ${
              isEnabled ? "bg-black" : "bg-white/40"
            }`}
          />
          {isEnabled && (
            <Check
              size={8}
              className="absolute right-1.5 text-black pointer-events-none"
            />
          )}
          {!isEnabled && (
            <X
              size={8}
              className="absolute left-1.5 text-white/30 pointer-events-none"
            />
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ── Hlavní stránka ─────────────────────────────────────────────────────────────
export default function OznameniARozhrani() {
  const router = useRouter();
  const { graphicsTier } = useUI();
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});
  const [savedFlash, setSavedFlash] = useState(false);

  // Načteme uložená nastavení z localStorage
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    PREFERENCES.forEach((p) => {
      initial[p.key] = localStorage.getItem(p.key) === "true";
    });
    setHiddenKeys(initial);
  }, []);

  const handleToggle = (key: string) => {
    setHiddenKeys((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(key, String(next[key]));
      return next;
    });
    // Dispatch asynchronně — po dokončení React renderu
    setTimeout(() => window.dispatchEvent(new Event("mmbarber-ui-prefs-update")), 0);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const resetAll = () => {
    const reset: Record<string, boolean> = {};
    PREFERENCES.forEach((p) => {
      localStorage.removeItem(p.key);
      reset[p.key] = false;
    });
    setHiddenKeys(reset);
    // Dispatch asynchronně — po dokončení React renderu
    setTimeout(() => window.dispatchEvent(new Event("mmbarber-ui-prefs-update")), 0);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const widgety = PREFERENCES.filter((p) => p.group === "widgety");
  const atmosfera = PREFERENCES.filter((p) => p.group === "atmosfera");

  const hiddenCount = Object.values(hiddenKeys).filter(Boolean).length;
  
  const isLowGraphics = graphicsTier === "lite" || graphicsTier === "low";

  return (
    <main className="min-h-screen bg-mafia-black text-white">
      {/* Zavřít */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          router.push("/");
        }}
        className="fixed top-6 right-6 md:top-10 md:right-12 z-[100] px-4 md:px-6 py-2 md:py-3 bg-black/50 border border-white/10 text-white hover:bg-mafia-gold hover:text-black hover:border-mafia-gold transition-all duration-300 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] backdrop-blur-md flex items-center gap-2 group"
      >
        <X size={14} className="group-hover:rotate-90 transition-transform" />
        <span className="hidden md:inline">[ ESC ] ZAVŘÍT</span>
        <span className="md:hidden">ZAVŘÍT</span>
      </button>

      {/* Pozadí */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(197,160,89,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      </div>

      {/* Obsah */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 py-16 pb-32">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border border-mafia-gold/30 bg-mafia-gold/10 flex items-center justify-center">
              <Bell size={18} className="text-mafia-gold" />
            </div>
            <div className="w-10 h-10 rounded-full border border-mafia-gold/30 bg-mafia-gold/10 flex items-center justify-center">
              <Monitor size={18} className="text-mafia-gold" />
            </div>
            <div className="h-px flex-1 bg-mafia-gold/15" />
            {/* Stav */}
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              {hiddenCount === 0
                ? "VŠE ZOBRAZENO"
                : `${hiddenCount} SKRYTO`}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-widest leading-tight">
            Oznámení
            <span className="text-mafia-gold"> & Rozhraní</span>
          </h1>
          <p className="text-white/40 font-mono text-sm mt-3 leading-relaxed max-w-lg">
            Ovládej co se ti na webu zobrazuje. Změny se projevují okamžitě — žádné načítání.
          </p>

          {isLowGraphics && (
            <div className="mt-6 flex items-start gap-3 bg-mafia-red/10 border border-mafia-red/30 p-4 rounded-sm">
              <AlertTriangle className="text-mafia-red shrink-0 mt-0.5" size={18} />
              <div className="flex flex-col">
                <span className="text-mafia-red font-bold text-sm uppercase tracking-wide">Grafické Omezení</span>
                <span className="text-white/60 text-xs mt-1 leading-relaxed">
                  Váš aktuální grafický profil ({graphicsTier}) neumožňuje zobrazení náročných atmosférických prvků (počasí, sezónní částice, speciální widgety). Pro jejich aktivaci si zvyšte grafické nastavení v hlavní navigaci.
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Saved flash */}
        <motion.div
          initial={false}
          animate={{ opacity: savedFlash ? 1 : 0, y: savedFlash ? 0 : -4 }}
          className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-green-500/15 border border-green-500/30 px-4 py-2 text-green-400 text-xs font-mono uppercase tracking-widest pointer-events-none"
        >
          <Check size={12} /> Uloženo
        </motion.div>

        {/* Sekce: Widgety */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em]">
              Widgety webu
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <div className="flex flex-col gap-2">
            {widgety.map((pref, i) => (
              <PreferenceToggle
                key={pref.key}
                pref={pref}
                isHidden={hiddenKeys[pref.key] ?? false}
                onToggle={handleToggle}
                index={i}
                disabled={isLowGraphics && (pref.key === "mmbarber_hide_events" || pref.key === "mmbarber_hide_historical_events")}
              />
            ))}
          </div>
        </section>

        {/* Sekce: Atmosféra */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.3em]">
              Atmosféra & Vizuální efekty
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>
          <div className="flex flex-col gap-2">
            {atmosfera.map((pref, i) => (
              <PreferenceToggle
                key={pref.key}
                pref={pref}
                isHidden={hiddenKeys[pref.key] ?? false}
                onToggle={handleToggle}
                index={i + widgety.length}
                disabled={isLowGraphics}
              />
            ))}
          </div>
        </section>

        {/* Reset tlačítko */}
        <div className="flex items-center justify-between border-t border-white/8 pt-6">
          <p className="text-white/25 font-mono text-xs">
            Nastavení je uloženo v prohlížeči
          </p>
          <button
            onClick={resetAll}
            className="text-xs font-mono uppercase tracking-widest text-white/30 hover:text-mafia-gold transition-colors duration-300 border border-white/10 hover:border-mafia-gold/30 px-4 py-2"
          >
            Obnovit výchozí
          </button>
        </div>

      </div>
    </main>
  );
}
