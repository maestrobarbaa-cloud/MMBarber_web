"use client";

import React from "react";
import Link from "next/link";
import { Skull, MapPin } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] bg-mafia-red/20"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="text-center z-10 max-w-2xl">
          <div className="w-20 h-20 mx-auto border-2 border-mafia-red/50 rounded-full flex items-center justify-center mb-6 bg-mafia-red/10 shadow-[0_0_30px_rgba(179,0,0,0.4)]">
              <Skull className="text-mafia-red" size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-[0.1em] mb-4 drop-shadow-2xl">
              ZTRÁTA <span className="text-mafia-red">SPOJENÍ</span>
          </h1>
          <p className="text-mafia-red font-mono tracking-widest text-sm md:text-base mb-12 uppercase font-bold bg-mafia-red/10 border border-mafia-red/20 p-4 rounded inline-block">
            Systém: Jsi v podzemí. Signál s Rodinou přerušen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white uppercase font-bold tracking-widest rounded transition-all duration-300">
              Zkusit znovu
            </Link>
          </div>
      </div>
    </div>
  );
}
