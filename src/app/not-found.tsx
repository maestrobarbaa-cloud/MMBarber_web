"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "../utils/analytics";

export default function NotFound() {
  useEffect(() => {
    trackEvent("page_view_404", { 
      path: typeof window !== "undefined" ? window.location.pathname : "unknown" 
    });
  }, []);

  return (
    <div className="min-h-screen bg-mafia-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg border border-mafia-gold/30 p-12 bg-mafia-dark/50 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-mafia-red/50"></div>
        
        <h1 className="text-8xl md:text-9xl font-heading font-black text-mafia-gold mb-4 opacity-20">404</h1>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-smoke-white mb-4 uppercase tracking-widest">
            Spletl sis uličku
          </h2>
          <p className="text-smoke-white/60 font-sans mb-10 leading-relaxed italic">
            Někdy je lepší se neptat na cestu, ale tady jsi opravdu na špatné adrese. Tohle místo neexistuje... nebo aspoň ne pro tebe.
          </p>
          
          <Link
            href="/"
            onClick={() => trackEvent("click_404_back_home")}
            className="inline-block border-2 border-mafia-gold px-8 py-3 text-mafia-gold font-bold uppercase tracking-[0.2em] text-sm hover:bg-mafia-gold hover:text-mafia-black transition-all duration-500"
          >
            Zpět na centrálu
          </Link>
        </div>
      </div>
    </div>
  );
}
