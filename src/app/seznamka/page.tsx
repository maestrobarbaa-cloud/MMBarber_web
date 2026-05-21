"use client";

import {
  Scissors, Users, Target, ShieldCheck, CheckCircle2,
  ChevronDown, ChevronLeft, Lock, Heart, Send, AlertCircle, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { DatingSEOArchive } from "@/components/DatingSEOArchive";

// ── Seznamka Form constants ─────────────────────────────────
const CHARACTER_OPTIONS = [
  "Ambiciózní", "Humorný", "Klidný", "Dobrodružný",
  "Romantický", "Pečující", "Cílevědomý", "Spontánní",
];
const RATE_LIMIT_KEY = "mmbarber_seznamka_last_submit";
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

function checkRateLimit(): boolean {
  try {
    const last = localStorage.getItem(RATE_LIMIT_KEY);
    if (!last) return true;
    return Date.now() - Number(last) > RATE_LIMIT_MS;
  } catch { return true; }
}
function setRateLimit() {
  try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch {}
}

// ── Main page ────────────────────────────────────────────────
export default function SeznamkaPage() {
  const { t, lang } = useTranslation();
  const [activeVariant, setActiveVariant] = useState<"selection" | "A" | "C">("selection");

  // Variant A state
  const [confirmedSteps, setConfirmedSteps] = useState<string[]>([]);
  const allConfirmed = confirmedSteps.length === 3;
  const handleConfirm = (id: string) => {
    if (!confirmedSteps.includes(id)) setConfirmedSteps([...confirmedSteps, id]);
  };

  // Variant C state
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error" | "ratelimit">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "", age: "", email: "", phone: "",
    idealMan: "", characters: [] as string[],
    ageMin: 25, ageMax: 45, dealbreaker: "", consent: false,
  });
  const toggleCharacter = (c: string) =>
    setForm(f => ({
      ...f,
      characters: f.characters.includes(c)
        ? f.characters.filter(x => x !== c)
        : [...f.characters, c],
    }));

  // Legal
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);

  // Steps for Variant A
  const steps = [
    { id: "01", title: t.seznamka.steps[0].title, desc: t.seznamka.steps[0].desc, icon: <Users className="text-mafia-gold" size={32} /> },
    { id: "02", title: t.seznamka.steps[1].title, desc: t.seznamka.steps[1].desc, icon: <Scissors className="text-mafia-gold" size={32} /> },
    { id: "03", title: t.seznamka.steps[2].title, desc: t.seznamka.steps[2].desc, icon: <Target className="text-mafia-gold" size={32} /> },
  ];

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return;
    if (!checkRateLimit()) { setFormStatus("ratelimit"); return; }

    const age = Number(form.age);
    if (!form.name.trim() || !form.email.trim() || !form.idealMan.trim()) {
      setErrorMsg("Vyplňte prosím všechna povinná pole."); setFormStatus("error"); return;
    }
    if (isNaN(age) || age < 18 || age > 80) {
      setErrorMsg("Věk musí být mezi 18 a 80 lety."); setFormStatus("error"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Zadejte platnou e-mailovou adresu."); setFormStatus("error"); return;
    }
    if (!form.consent) {
      setErrorMsg("Je nutný souhlas s podmínkami."); setFormStatus("error"); return;
    }

    setFormStatus("loading");
    setErrorMsg("");
    try {
      const s = (v: string, max = 500) => v.trim().slice(0, max).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      const payload = {
        name: s(form.name, 80),
        age,
        email: s(form.email, 120),
        phone: s(form.phone, 30),
        idealMan: s(form.idealMan, 500),
        characters: form.characters,
        ageRange: [form.ageMin, form.ageMax],
        dealbreaker: s(form.dealbreaker, 500),
      };

      const res = await fetch('/api/seznamka', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit");

      setRateLimit();
      setFormStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Něco se pokazilo. Zkuste to prosím znovu.");
      setFormStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-[150] bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeVariant !== "selection") {
                setActiveVariant("selection");
                setConfirmedSteps([]);
              } else {
                window.location.href = "/";
              }
            }}
            className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[160]"
          >
            <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
              <ChevronLeft size={20} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold">
              {activeVariant === "selection"
                ? (lang === "cs" ? "ZPĚT DO SALONU" : "BACK TO SALON")
                : (lang === "cs" ? "ZPĚT NA VÝBĚR" : "BACK TO SELECTION")}
            </span>
          </button>
          <div className="flex flex-col items-end">
            <span className="font-heading font-black text-2xl italic tracking-tighter text-white">MMBARBER</span>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">Network_Protocol_v3.5.0</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-mafia-gold rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-mafia-gold/20 rounded-full animate-pulse delay-700" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="text-5xl md:text-8xl font-heading font-black text-smoke-white uppercase tracking-[0.2em] mb-8">
            {t.header.seznamka}
          </h1>
          <div className="w-24 h-1 bg-mafia-gold mx-auto mb-8 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]" />
          <p className="flavor-text max-w-2xl mx-auto text-smoke-white/60 font-sans text-lg md:text-xl leading-relaxed italic mb-12 whitespace-pre-line">
            {t.seznamka.description}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-12 relative max-w-6xl mx-auto min-h-[600px]">

        {/* ── SELECTION SCREEN ── */}
        {activeVariant === "selection" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* CARD A – Spustit protokol */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveVariant("A")}
              className="group relative bg-mafia-dark/20 border-2 border-white/5 p-8 md:p-10 hover:border-mafia-gold/40 transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full">
                    <Users className="text-white/40" size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase">Status: Passive</span>
                </div>
                <div className="text-[10px] font-mono text-mafia-gold/40 tracking-[0.5em] uppercase mb-3">PROTOKOL A</div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-smoke-white/60 group-hover:text-mafia-gold uppercase mb-4 tracking-widest transition-colors">
                  {t.seznamka.variantA.title}
                </h3>
                <p className="text-smoke-white/40 group-hover:text-smoke-white/60 mb-8 font-sans leading-relaxed text-sm">
                  {t.seznamka.variantA.desc}
                </p>
                <div className="flex justify-start">
                  <div className="px-8 py-3 border border-white/10 text-white/40 font-heading font-black uppercase tracking-widest text-xs group-hover:border-mafia-gold group-hover:text-mafia-gold transition-all">
                    {lang === "cs" ? "SPUSTIT PROTOKOL" : "START PROTOCOL"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD B – Brigáda (LOCKED) */}
            <div className="relative bg-mafia-dark/20 border-2 border-white/5 p-8 md:p-10 overflow-hidden opacity-50 cursor-not-allowed select-none">
              {/* Lock overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[2px]">
                <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
                  <Lock size={28} className="text-white/40" />
                </div>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.5em]">
                  {lang === "cs" ? "UZAVŘENO" : "CLOSED"}
                </span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-full">
                    <Scissors className="text-white/20" size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-white/10 tracking-[0.3em] uppercase">Status: Locked</span>
                </div>
                <div className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase mb-3">PROTOKOL B</div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-smoke-white/30 uppercase mb-4 tracking-widest">
                  {t.seznamka.variantB.title}
                </h3>
                <p className="text-smoke-white/20 mb-8 font-sans leading-relaxed text-sm">
                  {t.seznamka.variantB.desc}
                </p>
                <div className="flex justify-start">
                  <div className="px-8 py-3 border border-white/5 text-white/20 font-heading font-black uppercase tracking-widest text-xs">
                    {lang === "cs" ? "SPUSTIT NÁBOR" : "START RECRUITMENT"}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD C – Seznamka formulář (NEW) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveVariant("C")}
              className="group relative bg-mafia-dark/40 border-2 border-mafia-gold p-8 md:p-10 hover:bg-mafia-gold/5 transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.1)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-mafia-gold/10 -rotate-45 translate-x-12 -translate-y-12" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-mafia-gold/10 border border-mafia-gold/20 rounded-full">
                    <Heart className="text-mafia-gold" size={24} />
                  </div>
                  <span className="font-mono text-[10px] text-mafia-gold/50 tracking-[0.3em] uppercase">Status: Active</span>
                </div>
                <div className="text-[10px] font-mono text-mafia-gold/60 tracking-[0.5em] uppercase mb-3">PROTOKOL C</div>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-mafia-gold uppercase mb-4 tracking-widest italic">
                  {lang === "cs" ? "MATCHMAKING" : "MATCHMAKING"}
                </h3>
                <p className="text-smoke-white/70 mb-8 font-sans leading-relaxed text-sm">
                  {lang === "cs"
                    ? "Řekni nám, jaký muž tě okouzlí. Diskrétně, bez zbytečností."
                    : "Tell us what kind of man captivates you. Discreet, no fluff."}
                </p>
                <div className="flex justify-start">
                  <div className="px-8 py-3 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-widest text-xs group-hover:bg-smoke-white transition-colors">
                    {lang === "cs" ? "OTEVŘÍT PROTOKOL" : "OPEN PROTOCOL"}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── VARIANT A – Protocol steps ── */}
        {activeVariant === "A" && (
          <motion.div key="protocol-room-a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-mafia-gold uppercase tracking-[0.2em] mb-4">
                {t.seznamka.variantA.title}
              </h2>
              <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">
                Postupujte podle pokynů / Action Required
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-mafia-gold/10 -translate-y-1/2 z-0" />
              {steps.map((step, index) => {
                const isConfirmed = confirmedSteps.includes(step.id);
                const canInteract = confirmedSteps.length >= index;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative z-10 bg-mafia-dark/40 border-2 p-8 group transition-all duration-500 overflow-hidden ${
                      isConfirmed ? "border-mafia-gold" : canInteract ? "border-mafia-gold/30 hover:border-mafia-gold" : "border-neutral-900 grayscale opacity-40"
                    }`}
                  >
                    {isConfirmed && (
                      <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-4 right-4 text-mafia-gold z-30">
                        <CheckCircle2 size={32} />
                      </motion.div>
                    )}
                    <div className="absolute top-4 right-4 text-3xl font-heading font-black text-white/5 group-hover:text-mafia-gold/10 transition-colors">{step.id}</div>
                    <div className={`mb-6 w-16 h-16 bg-mafia-black border flex items-center justify-center transition-all duration-500 ${
                      isConfirmed ? "border-mafia-gold shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]" : "border-mafia-gold/10 group-hover:scale-110 group-hover:border-mafia-gold/50"
                    }`}>
                      {step.icon}
                    </div>
                    <h3 className={`text-xl font-heading font-bold uppercase mb-4 tracking-wider transition-colors duration-500 ${isConfirmed ? "text-smoke-white" : "text-mafia-gold group-hover:text-smoke-white"}`}>
                      {step.title}
                    </h3>
                    <p className="text-smoke-white/60 font-sans text-sm leading-relaxed mb-8 h-12">{step.desc}</p>
                    {!isConfirmed && canInteract && (
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleConfirm(step.id)}
                        className="w-full bg-mafia-gold/20 border border-mafia-gold/40 hover:bg-mafia-gold hover:text-mafia-black py-2 px-4 font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                      >
                        {t.seznamka.acknowledge}
                      </motion.button>
                    )}
                    {isConfirmed && (
                      <div className="flex items-center gap-2 text-mafia-gold/60">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-mono uppercase tracking-widest">{t.seznamka.confirmedLabel}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <AnimatePresence>
              {allConfirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-20 p-12 bg-mafia-dark border-2 border-mafia-gold shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(var(--user-accent-color-rgb),0.1)_0%,transparent_70%)]" />
                  <h3 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase mb-6 tracking-widest">
                    {t.seznamka.successTitle}
                  </h3>
                  <p className="max-w-xl mx-auto text-smoke-white font-sans text-lg md:text-xl leading-relaxed mb-10 italic">
                    {t.seznamka.successText}
                  </p>
                  <Link
                    href="/"
                    className="group relative overflow-hidden bg-mafia-gold border border-mafia-gold px-12 py-5 inline-block transition-all duration-500 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]"
                  >
                    <div className="absolute inset-0 block bg-smoke-white -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 z-0" />
                    <span className="relative z-10 text-mafia-black font-heading font-black uppercase tracking-[0.3em] text-lg">
                      {t.seznamka.finishBtn}
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── VARIANT C – Matchmaking Form ── */}
        {activeVariant === "C" && (
          <motion.div key="matchmaking-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="text-mafia-gold animate-pulse" size={22} />
                <span className="font-mono text-[10px] text-mafia-gold/60 uppercase tracking-[0.5em]">Matchmaking Protocol C</span>
                <Heart className="text-mafia-gold animate-pulse" size={22} />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-4">
                {lang === "cs" ? "TVŮJ IDEÁLNÍ MUŽ" : "YOUR IDEAL MAN"}
              </h2>
              <p className="text-smoke-white/50 font-sans text-sm">
                {lang === "cs"
                  ? "Řekni nám o svém ideálu. Diskrétně a bezpečně."
                  : "Tell us about your ideal. Discreet and secure."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {formStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 px-8 bg-mafia-dark/60 border-2 border-mafia-gold shadow-[0_0_40px_rgba(197,160,89,0.15)]"
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-mafia-gold/10 border-2 border-mafia-gold rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 className="text-mafia-gold" size={40} />
                  </motion.div>
                  <h3 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-widest mb-4">
                    {lang === "cs" ? "Zpráva odeslána" : "Message Sent"}
                  </h3>
                  <p className="text-smoke-white/70 font-sans leading-relaxed max-w-md mx-auto">
                    {lang === "cs"
                      ? "Tvůj profil byl bezpečně uložen. Brzy se ozveme."
                      : "Your profile has been securely saved. We'll be in touch soon."}
                  </p>
                </motion.div>
              ) : formStatus === "ratelimit" ? (
                <motion.div key="ratelimit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-16 px-8 bg-mafia-dark/40 border border-white/10">
                  <AlertCircle className="text-mafia-gold mx-auto mb-4" size={40} />
                  <p className="text-smoke-white/70 font-sans">
                    {lang === "cs"
                      ? "Formulář jste již dnes odeslali. Zkuste to znovu zítra."
                      : "You already submitted today. Try again tomorrow."}
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-8" noValidate>
                  {/* Honeypot */}
                  <input ref={honeypotRef} type="text" name="website" tabIndex={-1} aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} autoComplete="off" />

                  {/* 01 – Základní info */}
                  <div className="border border-mafia-gold/20 bg-mafia-dark/30 p-8 space-y-6">
                    <h3 className="text-xs font-mono text-mafia-gold/60 uppercase tracking-[0.4em] border-b border-mafia-gold/10 pb-3">
                      01 / Základní informace
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                          Jméno / přezdívka <span className="text-mafia-gold">*</span>
                        </label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          maxLength={80} placeholder="Tvoje jméno nebo přezdívka"
                          className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                          Věk <span className="text-mafia-gold">*</span>
                        </label>
                        <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                          min={18} max={80} placeholder="18+"
                          className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                          E-mail <span className="text-mafia-gold">*</span>
                        </label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          maxLength={120} placeholder="tvuj@email.cz"
                          className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                          Telefon <span className="text-white/20">(volitelné)</span>
                        </label>
                        <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          maxLength={30} placeholder="+420 ..."
                          className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* 02 – Ideální muž */}
                  <div className="border border-mafia-gold/20 bg-mafia-dark/30 p-8 space-y-6">
                    <h3 className="text-xs font-mono text-mafia-gold/60 uppercase tracking-[0.4em] border-b border-mafia-gold/10 pb-3">
                      02 / Tvůj ideální muž
                    </h3>
                    <div>
                      <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                        Popiš, jaký muž tě přitahuje <span className="text-mafia-gold">*</span>
                      </label>
                      <textarea value={form.idealMan} onChange={e => setForm(f => ({ ...f, idealMan: e.target.value }))}
                        maxLength={500} rows={4} placeholder="Co tě na muži okamžitě zaujme? Jak vypadá tvůj ideál – povaha, styl, energie..."
                        className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors resize-none" />
                      <div className="text-right text-[9px] font-mono text-white/20 mt-1">{form.idealMan.length}/500</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-4">
                        Charakter – co ti na muži imponuje
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {CHARACTER_OPTIONS.map(c => {
                          const active = form.characters.includes(c);
                          return (
                            <button key={c} type="button" onClick={() => toggleCharacter(c)}
                              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
                                active ? "bg-mafia-gold text-mafia-black border-mafia-gold" : "bg-transparent text-smoke-white/40 border-white/10 hover:border-mafia-gold/40 hover:text-smoke-white/70"
                              }`}>
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-4">
                        Preferované věkové rozmezí partnera:{" "}
                        <span className="text-mafia-gold">{form.ageMin}–{form.ageMax} let</span>
                      </label>
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="text-[9px] font-mono text-white/30 mb-1">OD</div>
                          <input type="range" min={18} max={70} value={form.ageMin}
                            onChange={e => { const v = Number(e.target.value); setForm(f => ({ ...f, ageMin: Math.min(v, f.ageMax - 1) })); }}
                            className="w-full accent-[#c5a059] cursor-pointer" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[9px] font-mono text-white/30 mb-1">DO</div>
                          <input type="range" min={19} max={75} value={form.ageMax}
                            onChange={e => { const v = Number(e.target.value); setForm(f => ({ ...f, ageMax: Math.max(v, f.ageMin + 1) })); }}
                            className="w-full accent-[#c5a059] cursor-pointer" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                        Co ti na muži vadí nejvíc <span className="text-white/20">(volitelné)</span>
                      </label>
                      <textarea value={form.dealbreaker} onChange={e => setForm(f => ({ ...f, dealbreaker: e.target.value }))}
                        maxLength={500} rows={3} placeholder="Absolutní stopka – co tě okamžitě odradí..."
                        className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors resize-none" />
                      <div className="text-right text-[9px] font-mono text-white/20 mt-1">{form.dealbreaker.length}/500</div>
                    </div>
                  </div>

                  {/* Souhlas + odeslat */}
                  <div className="space-y-6">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div onClick={() => setForm(f => ({ ...f, consent: !f.consent }))}
                        className={`mt-0.5 w-5 h-5 border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          form.consent ? "border-mafia-gold bg-mafia-gold" : "border-white/20 group-hover:border-mafia-gold/40"
                        }`}>
                        {form.consent && <CheckCircle2 size={12} className="text-mafia-black" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] font-mono text-smoke-white/40 leading-relaxed">
                        Souhlasím se zpracováním osobních údajů za účelem matchmakingu.
                        Služba je určena osobám starším 18 let. <span className="text-mafia-gold">*</span>
                      </span>
                    </label>

                    <AnimatePresence>
                      {formStatus === "error" && errorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-mono">
                          <AlertCircle size={16} /> {errorMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button type="submit" disabled={formStatus === "loading"}
                      whileHover={{ scale: formStatus === "loading" ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-[0.4em] text-sm hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                      {formStatus === "loading" ? (
                        <><Loader2 size={18} className="animate-spin" /> {lang === "cs" ? "Odesílám..." : "Sending..."}</>
                      ) : (
                        <><Send size={18} /> {lang === "cs" ? "Odeslat profil" : "Send Profile"}</>
                      )}
                    </motion.button>

                    <p className="text-center text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      🔒 Šifrovaný přenos · Diskrétní zpracování · Žádné sdílení s třetími stranami
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </section>

      {/* Legal Section */}
      <section className="py-24 px-4 md:px-12 border-t border-white/5 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <motion.div className="border border-mafia-gold/20 bg-mafia-dark/40 overflow-hidden">
            <button onClick={() => setIsLegalExpanded(!isLegalExpanded)}
              className="w-full p-6 flex items-center justify-between group transition-colors hover:bg-mafia-gold/5">
              <div className="flex items-center gap-4">
                <div className={`p-2 border transition-all duration-500 ${isLegalExpanded ? "border-mafia-gold bg-mafia-gold/10" : "border-white/10 text-white/20"}`}>
                  <ShieldCheck size={20} className={isLegalExpanded ? "text-mafia-gold" : ""} />
                </div>
                <div className="text-left">
                  <h4 className={`text-sm font-heading font-black uppercase tracking-[0.3em] transition-colors ${isLegalExpanded ? "text-mafia-gold" : "text-smoke-white/40 group-hover:text-smoke-white/60"}`}>
                    {lang === "cs" ? "PRÁVNÍ PROTOKOL & MISE PROJEKTU" : "LEGAL PROTOCOL & PROJECT MISSION"}
                  </h4>
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest mt-1">
                    {isLegalExpanded ? "Access Granted // Full Disclosure" : "Click to decrypt legal documentation"}
                  </p>
                </div>
              </div>
              <motion.div animate={{ rotate: isLegalExpanded ? 180 : 0 }} className="text-mafia-gold/30 group-hover:text-mafia-gold transition-colors">
                <ChevronDown size={24} />
              </motion.div>
            </button>
            <AnimatePresence>
              {isLegalExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}>
                  <div className="p-8 md:p-12 border-t border-white/5 space-y-12">
                    <div className="space-y-4">
                      <h4 className="text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.3em]">Mise & Propojení</h4>
                      <p className="text-[11px] md:text-xs font-sans leading-relaxed text-smoke-white/80">
                        První seznamka propojená s lokálními službami. Do projektu jsou vítáni všichni partneři poskytující služby, které mohou být propojeny se seznamkou.
                      </p>
                      <p className="text-[11px] md:text-xs font-sans leading-relaxed text-smoke-white/80">
                        V budoucnu plánujeme integrovat seznamovací aplikaci propojenou s našimi partnery – barbershopy, kadeřnictví, kosmetikou, wellness a dalšími službami.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">PODMÍNKY A OCHRANA KONCEPTU</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div><span className="text-mafia-gold/80 block mb-1">1. Úvodní ustanovení</span>Tento projekt propojuje seznamku s různými službami poskytovanými partnery. Veškeré části projektu jsou chráněny autorským právem podle zákona č. 121/2000 Sb.</div>
                          <div><span className="text-mafia-gold/80 block mb-1">2. Duševní vlastnictví</span>Veškeré texty, fotografie, logo a originální obsah webu jsou chráněny autorským právem.</div>
                          <div><span className="text-mafia-gold/80 block mb-1">3. Souhlas účastníků</span>Každá osoba zapojená do projektu byla předem informována a výslovně souhlasila se zařazením do systému.</div>
                          <div><span className="text-mafia-gold/80 block mb-1">4. Ochrana soukromí</span>Projekt nezveřejňuje žádná skutečná jména ani fotografie bez výslovného souhlasu.</div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">GDPR & OCHRANA ÚDAJŮ</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div><span className="text-mafia-gold/80">Správce:</span> Tomáš Mička, Bedřicha Buchlovana 882, UH.</div>
                          <div><span className="text-mafia-gold/80">Účel:</span> Propojení osob v rámci projektu a využití partnerských služeb.</div>
                          <div><span className="text-mafia-gold/80">Práva:</span> Máte právo na přístup, opravu, výmaz či omezení zpracování vašich údajů.</div>
                          <div><span className="text-mafia-gold/80">Kontakt:</span> mickatomas@seznam.cz</div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 text-center">
                      <p className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.5em] mb-4">© 2025 Tomáš Mička. Všechna práva vyhrazena.</p>
                      <p className="text-[9px] font-sans text-smoke-white/20 max-w-2xl mx-auto leading-relaxed">Veškeré texty, fotografie, logo a originální obsah webu jsou chráněny autorským právem.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />

      <BottomTerminalReveal thresholdMultiplier={100}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                <DatingSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}
