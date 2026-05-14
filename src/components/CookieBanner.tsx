"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mmbarber_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mmbarber_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("mmbarber_cookie_consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[9999]"
        >
          <div className="relative bg-mafia-dark/95 backdrop-blur-2xl border-2 border-mafia-gold/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-mafia-gold/5 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-mafia-gold/50 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.5)]"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center bg-mafia-gold/10">
                  <Cookie className="text-mafia-gold animate-pulse" size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-mafia-gold uppercase tracking-[0.2em] italic">
                    COOKIE PROTOKOL
                  </h4>
                  <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em]">Security & Experience layer</p>
                </div>
                <button 
                    onClick={() => setShow(false)}
                    className="ml-auto text-white/20 hover:text-mafia-gold transition-colors"
                >
                    <X size={16} />
                </button>
              </div>

              <p className="text-smoke-white/70 font-sans text-xs leading-relaxed mb-8">
                Tento web používá soubory cookies k zajištění nejlepšího zážitku. Data využíváme k analýze návštěvnosti a personalizaci vaší cesty.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleAccept}
                  className="px-4 py-3 bg-mafia-gold text-mafia-black font-heading font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                >
                  Přijmout
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-3 border border-white/10 text-white/40 font-heading font-black text-[10px] uppercase tracking-widest hover:border-mafia-red hover:text-mafia-red transition-all"
                >
                  Odmítnout
                </button>
                <Link
                  href="/zasady-cookies"
                  className="px-4 py-3 border border-white/10 text-white/40 font-heading font-black text-[10px] uppercase tracking-widest hover:border-mafia-gold hover:text-mafia-gold transition-all text-center flex items-center justify-center"
                >
                  Nastavení
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                <ShieldCheck size={12} className="text-mafia-gold/40" />
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest italic">
                  Vaše soukromí je naší nejvyšší prioritou v UH.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
