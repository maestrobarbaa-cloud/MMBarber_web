"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronLeft, QrCode, Lock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/utils/audio";

export default function PaymentPage() {
  const { lang } = useTranslation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playKasaSound = () => {
    playSound("/sounds/kasa.mp3", 0.5);
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (password.toLowerCase() === "platba") {
      playKasaSound();
      setIsUnlocked(true);
      setError(false);
    } else {
      playSound("/sounds/vrong.mp3", 0.5);
      
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };
  
  const text = {
    cs: {
      title: "PLATBA",
      description: "Potřebujete zaplatit například dopředu? Žádný problém – částku dle ceníku prosím pošlete na tento účet.",
      accountLabel: "Bankovní spojení",
      qrLabel: "QR Kód",
      back: "Zpět k barberům",
      ctaDescription: "Níže naleznete platební údaje:",
      enterAmount: "Zadejte částku",
      gateTitle: "AUTORIZACE PŘÍSTUPU",
      gateSubtitle: "Tato sekce je určena pouze pro klienty MMBarber.",
      gatePlaceholder: "Zadejte přístupový kód",
      gateError: "NEPLATNÝ KÓD - PŘÍSTUP ODEPŘEN",
      gateSuccess: "PŘÍSTUP POVOLEN",
      gateBack: "Návrat na základnu"
    },
    en: {
      title: "PAYMENT",
      description: "Need to pay in advance? No problem – please send the amount according to the price list to this account.",
      accountLabel: "Bank Account",
      qrLabel: "QR Code",
      back: "Back to Barbers",
      ctaDescription: "Follow the payment instructions below:",
      enterAmount: "Enter amount",
      gateTitle: "ACCESS AUTHORIZATION",
      gateSubtitle: "This section is reserved for MMBarber clients only.",
      gatePlaceholder: "Enter access code",
      gateError: "INVALID CODE - ACCESS DENIED",
      gateSuccess: "ACCESS GRANTED",
      gateBack: "Return to base"
    }
  };

  const currentText = lang === 'cs' ? text.cs : text.en;

  if (!isMounted) return null;

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#050505] text-smoke-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-mafia-black/80 backdrop-blur-2xl border-2 border-mafia-gold/20 p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col items-center"
        >
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-mafia-gold"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-mafia-gold"></div>

          <div className="mb-8 p-6 rounded-full border-2 border-mafia-gold/10 bg-mafia-gold/5">
            <Lock className="text-mafia-gold animate-pulse" size={40} />
          </div>

          <h2 className="text-2xl md:text-3xl font-heading font-black text-mafia-gold text-center mb-4 tracking-[0.2em] uppercase">
             {currentText.gateTitle}
          </h2>
          <p className="text-smoke-white/40 text-[10px] uppercase tracking-[0.3em] text-center mb-10 font-mono">
             {currentText.gateSubtitle}
          </p>

          <form onSubmit={handleUnlock} className="w-full flex flex-col gap-6">
            <div className="relative">
              {/* Hidden username field for accessibility/password managers */}
              <input type="text" name="username" value="client" readOnly className="hidden" aria-hidden="true" />
              <input 
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentText.gatePlaceholder}
                className={`w-full bg-mafia-black border-b-2 ${error ? 'border-mafia-red text-mafia-red' : 'border-mafia-gold/30 text-mafia-gold'} p-4 text-center font-mono text-sm tracking-[0.5em] focus:outline-none focus:border-mafia-gold transition-all placeholder:text-mafia-gold/20 uppercase`}
                autoFocus
              />
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-0 right-0 text-center text-mafia-red font-mono text-[9px] font-black uppercase tracking-widest"
                  >
                    {currentText.gateError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              className="mt-6 group relative overflow-hidden bg-mafia-gold text-mafia-black p-4 font-heading font-black text-sm uppercase tracking-[0.4em] transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
            >
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {lang === 'cs' ? "AUTORIZOVAT" : "AUTHORIZE"}
                <ArrowRight size={18} />
              </span>
            </button>
          </form>

          <Link 
            href="/" 
            className="mt-12 text-smoke-white/30 hover:text-mafia-gold font-mono text-[9px] uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={12} />
            {currentText.gateBack}
          </Link>
        </motion.div>

        {/* HUD Elements */}
        <div className="absolute top-10 left-10 text-mafia-gold/20 font-mono text-[8px] uppercase tracking-[0.5em] flex flex-col gap-2">
            <span>TERMINAL_ID: PLATBA_AUTH_01</span>
            <span>SYSTEM: MM_SECURITY_CORE_V3</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white pt-32 pb-16 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(10,10,10,1)_100%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* Gold ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-mafia-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-mafia-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <h1 className="text-6xl md:text-8xl font-heading font-black text-smoke-white mb-6 uppercase tracking-tighter drop-shadow-[0_4px_30px_rgba(197,160,89,0.3)]">
          {currentText.title}
        </h1>

        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-mafia-gold/40 to-transparent mb-8"></div>

        <p className="text-smoke-white/60 text-base md:text-lg font-sans italic mb-4 max-w-2xl text-center">
          {currentText.description}
        </p>
        
        <p className="text-mafia-gold font-sans font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-mafia-gold/20 pb-2">
          {currentText.ctaDescription}
        </p>

        {/* QR Block */}
        <div className="w-full flex justify-center mb-16">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center justify-center p-8 md:p-12 bg-mafia-black/80 backdrop-blur-md border border-mafia-gold/20 hover:border-mafia-gold transition-all relative group max-w-md w-full"
          >
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold opacity-30 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold opacity-30 group-hover:opacity-100 transition-opacity"></div>
            
            <QrCode size={48} className="text-mafia-gold mb-6 opacity-20 group-hover:opacity-60 transition-opacity" />
            <h3 className="text-mafia-gold font-mono text-xs uppercase tracking-[0.4em] mb-8 font-black">{currentText.qrLabel}</h3>
            
            <div className="relative p-2 bg-white shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-mafia-gold/10">
               <Image
                src="/obr/qr.jpg"
                alt="Payment QR Code"
                width={200}
                height={200}
                className="w-full h-full object-contain hover:grayscale-0 transition-all duration-500"
              />
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
               <div className="px-6 py-2 border-2 border-mafia-gold bg-mafia-gold text-mafia-black font-heading font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                 {currentText.enterAmount}
               </div>
               <div className="text-[8px] font-mono text-mafia-gold opacity-40 uppercase tracking-widest mt-2 font-bold tracking-[0.3em]">Naskenovat mobilem</div>
            </div>
          </motion.div>
        </div>

        {/* Account Details - Moved below blocks and made larger/gold */}
        <div className="w-full flex flex-col items-center mb-24">
          <div className="flex flex-col items-center gap-2">
            <span className="text-mafia-gold/40 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 text-center font-black">{currentText.accountLabel}</span>
            <div className="px-12 py-8 bg-mafia-gold/5 border-2 border-mafia-gold/20 flex flex-col items-center gap-2 backdrop-blur-sm group hover:border-mafia-gold transition-colors duration-500">
              <span className="text-3xl md:text-5xl font-heading font-black text-mafia-gold tracking-[0.1em] drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                235888143 / 0800
              </span>
              <span className="text-smoke-white/40 text-xs font-mono uppercase tracking-[0.3em] mt-2 font-bold">Česká spořitelna, a.s.</span>
            </div>
          </div>
        </div>

        {/* Back Link - At the bottom, larger and gold */}
        <Link 
          href="/#operativi" 
          className="flex items-center gap-6 text-mafia-gold hover:text-smoke-white transition-all mb-12 font-heading font-black text-2xl md:text-3xl uppercase tracking-[0.3em] group border-b-4 border-mafia-gold/30 hover:border-smoke-white pb-3 drop-shadow-lg"
        >
          <ChevronLeft size={32} className="group-hover:-translate-x-3 transition-transform" />
          {currentText.back}
        </Link>

        <div className="w-64 h-px bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent mb-8"></div>
        
        <p className="text-smoke-white/20 text-[9px] font-mono uppercase tracking-[0.4em] font-bold">
          MMBARBER - PRIVATE CLUB • UH. HRADIŠTĚ
        </p>
      </motion.div>
    </main>
  );
}
