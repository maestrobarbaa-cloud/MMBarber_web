"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Target,
  Dices,
  ChevronRight,
  Gamepad2
} from "lucide-react";

export default function GamesHub() {
  const handleShootingGame = () => {
    window.dispatchEvent(new Event('mmbarber-elita-game-open'));
  };

  const handleSlotMachine = () => {
    window.dispatchEvent(new Event('mmbarber-slot-machine-open'));
  };

  return (
    <main className="min-h-screen bg-mafia-black text-white">
      {/* Pozadí */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(138,7,7,0.04)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(138,7,7,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(138,7,7,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>

      {/* Obsah */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 py-16 pb-32">
        {/* Zpět */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 font-mono text-xs uppercase tracking-widest mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Zpět na hlavní stránku
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full border border-mafia-red/20 bg-mafia-red/5 flex items-center justify-center">
              <Gamepad2 size={22} className="text-mafia-red/80" />
            </div>
            <div className="h-px flex-1 bg-mafia-red/10" />
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-widest leading-tight">
            Zábava
            <span className="text-mafia-red"> & Podsvětí</span>
          </h1>
          <p className="text-white/40 font-mono text-sm mt-4 leading-relaxed max-w-xl">
            Prokaž svou mušku nebo zkus štěstí na automatech. Zde najdeš exkluzivní způsoby, jak ukrátit čas a získat respekt.
          </p>
        </motion.div>

        {/* Mřížka her */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Elitní střelba */}
          <motion.button
            onClick={handleShootingGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col text-left p-6 border border-white/10 bg-white/5 hover:bg-mafia-red/10 hover:border-mafia-red/30 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-red/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 group-hover:bg-mafia-red/20 rounded-sm transition-colors">
                <Target size={24} className="text-white group-hover:text-mafia-red transition-colors" />
              </div>
              <ChevronRight size={20} className="text-white/20 group-hover:text-mafia-red transition-colors" />
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Elitní střelba</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">Minihra testující tvé reflexy a přesnost.</p>
          </motion.button>

          {/* 2. Hazardní automat */}
          <motion.button
            onClick={handleSlotMachine}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative flex flex-col text-left p-6 border border-white/10 bg-white/5 hover:bg-mafia-gold/10 hover:border-mafia-gold/30 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mafia-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 group-hover:bg-mafia-gold/20 rounded-sm transition-colors">
                <Dices size={24} className="text-white group-hover:text-mafia-gold transition-colors" />
              </div>
              <ChevronRight size={20} className="text-white/20 group-hover:text-mafia-gold transition-colors" />
            </div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-2">Hazardní automat</h2>
            <p className="text-sm font-mono text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">Zkus štěstí na automatech a vyhraj exkluzivní odměny.</p>
          </motion.button>

        </div>
      </div>
    </main>
  );
}
