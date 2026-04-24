"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { VipCalendar } from "@/components/VipCalendar";
import { useTranslation } from "@/hooks/useTranslation";
import { playSound } from "@/utils/audio";

export default function VipClub() {
  const [password, setPassword] = useState("");
  const [datePassword, setDatePassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isNoirMode, setIsNoirMode] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const tickingAudioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthorized) return;

    if (countdown === 0) {
      if (tickingAudioRef.current) {
        tickingAudioRef.current.pause();
        tickingAudioRef.current.currentTime = 0;
      }
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        return prev > 0 ? prev - 1 : 0;
      });
      
      const isSoundEnabled = localStorage.getItem("mmbarber_sound_enabled") === "true";
      if (isSoundEnabled) {
        const audio = new Audio("/sounds/time.mp3");
        audio.volume = 0.3;
        tickingAudioRef.current = audio;
        audio.play().catch(() => {});
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (tickingAudioRef.current) {
        tickingAudioRef.current.pause();
        tickingAudioRef.current.currentTime = 0;
      }
    };
  }, [isAuthorized, router, countdown]);

  useEffect(() => {
    // Basic no-index injection
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.getElementsByTagName('head')[0].appendChild(meta);

    // Initial fade in
    gsap.to("body", { opacity: 1, duration: 1 });

    // Check local storage for session
    const auth = localStorage.getItem("mmbarber_vip_auth");
    if (auth === "true") {
      setIsAuthorized(true);
    }

    // Pick up the trail - enable gold slogans for the future
    localStorage.setItem("mmbarber_gold_slogans_enabled", "true");

    // Initialize Noir mode state
    const noir = document.documentElement.classList.contains("noir-mode");
    setIsNoirMode(noir);
  }, []);

  const toggleNoirMode = () => {
    const newMode = !isNoirMode;
    setIsNoirMode(newMode);
    localStorage.setItem("mmbarber_noir_mode", String(newMode));

    if (newMode) {
      document.documentElement.classList.add("noir-mode");
    } else {
      document.documentElement.classList.remove("noir-mode");
    }
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const p1 = password.trim().toUpperCase();
    const p2 = datePassword.trim().toLowerCase();

    if (p1 === "omerta" && p2 === "mmbarber") {
      // Correct passwords
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-mafia-gold').trim();
      const tl = gsap.timeline();
      tl.to(".safe-lock", { rotate: 720, scale: 0, opacity: 0, duration: 0.6, ease: "power4.in" })
        .to(".safe-prompt", { y: -50, opacity: 0, duration: 0.4 }, "-=0.2")
        .to("body", { backgroundColor: accentColor, duration: 0.1 })
        .to("body", { backgroundColor: "#0a0a0a", duration: 0.3 })
        .call(() => {
          setIsAuthorized(true);
          localStorage.setItem("mmbarber_vip_auth", "true");
        });
    } else {
      // Incorrect passwords
      playSound("/sounds/vrong.mp3", 0.5);

      setError(true);
      gsap.fromTo(".safe-prompt",
        { x: -10 },
        {
          x: 10, duration: 0.1, repeat: 5, yoyo: true, onComplete: () => {
            setPassword("");
            setDatePassword("");
          }
        }
      );
      setTimeout(() => setError(false), 2000);
    }
  };


  if (isAuthorized) {
    return (
      <main className="min-h-screen bg-mafia-black text-smoke-white pt-24 md:pt-32 px-4 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,rgba(10,10,10,1)_80%)] pointer-events-none"></div>
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]"></div>

        <div className="relative z-10 container mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-mafia-gold/50"></div>
            <span className="text-mafia-gold font-mono uppercase tracking-[0.4em] text-[10px] font-black">{t.club.topSecret}</span>
            <div className="h-px w-12 bg-mafia-gold/50"></div>
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-heading font-black text-mafia-gold uppercase tracking-[0.1em] mb-4 drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]">
            {t.club.title}
          </h1>
          <p className="text-smoke-white/60 font-sans text-base md:text-xl italic max-w-2xl mx-auto border-y border-mafia-gold/20 py-4">
            {t.club.subtitle}
          </p>
        </div>

        <VipCalendar />
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-mafia-black flex flex-col items-center justify-center p-6 select-none overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08)_0%,rgba(5,5,5,1)_70%)] pointer-events-none"></div>

      {/* Countdown Timer HUD style */}
      <div className="absolute top-12 md:top-20 font-mono text-mafia-red/40 text-sm md:text-xl tracking-[0.5em] flex flex-col items-center">
        <span className="mb-2 opacity-50 uppercase text-[10px] tracking-[0.2em]">{t.club.timeExpires}</span>
        <div className={`text-4xl md:text-6xl font-black ${countdown <= 10 ? 'text-mafia-red animate-pulse' : 'text-mafia-gold'} transition-colors`}>
          {countdown < 10 ? `0${countdown}` : countdown}:00
        </div>
      </div>

      <div className="safe-prompt relative z-10 max-w-md w-full flex flex-col items-center text-center">

        <h2 className="text-2xl md:text-3xl font-heading font-black text-smoke-white uppercase tracking-widest mb-4 px-4 bg-mafia-gold/10 py-3 rounded border border-mafia-gold/20">
          {t.club.loginTitle}
        </h2>

        <p className="text-mafia-gold/60 font-sans text-xs md:text-base mb-12 uppercase tracking-[0.3em] font-black">
          {t.club.loginSubtitle}
        </p>

        <form onSubmit={handleUnlock} className="w-full space-y-8">
          <div className="space-y-4">
            <div className="relative border-b-2 border-mafia-gold/30 focus-within:border-mafia-gold transition-colors">
              <KeyRound size={20} className="absolute left-0 bottom-3 text-mafia-gold/30" />
              {/* Hidden username field for accessibility/password managers */}
              <input type="text" name="username" value="vip-member" readOnly className="hidden" aria-hidden="true" />
              <input
                ref={inputRef}
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3 pl-8 text-center text-2xl font-black text-mafia-gold placeholder:text-mafia-gold/10 outline-none uppercase tracking-[0.5em]"
              />
            </div>

            <div className="relative border-b-2 border-mafia-gold/30 focus-within:border-mafia-gold transition-colors">
              <KeyRound size={20} className="absolute left-0 bottom-3 text-mafia-gold/30" />
              <input
                type="password"
                autoComplete="new-password"
                value={datePassword}
                onChange={(e) => setDatePassword(e.target.value)}
                className="w-full bg-transparent py-3 pl-8 text-center text-xl font-black text-mafia-gold placeholder:text-mafia-gold/10 outline-none uppercase tracking-[0.5em]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-mafia-gold text-mafia-black font-heading font-black py-4 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 group relative overflow-hidden transition-all duration-700 shadow-[0_5px_30px_rgba(197,160,89,0.3)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <ShieldCheck size={20} className="relative z-10 transition-transform group-hover:scale-110" />
            <span className="relative z-10">{t.club.unlockButton}</span>
          </button>
        </form>

        {error && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center gap-2 text-mafia-red font-sans text-xs uppercase tracking-widest font-bold bg-mafia-red/10 px-4 py-2 rounded-full border border-mafia-red/20"
            >
              <ShieldAlert size={14} /> {t.club.wrongPassword}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
