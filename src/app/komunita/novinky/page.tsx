"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle,
  Newspaper, Lightbulb, Star, HelpCircle, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";

const RATE_LIMIT_KEY = "mmbarber_novinky_last_submit";
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hodina

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

const CATEGORIES = [
  { id: "NOVINKA",  label: "Novinka",  desc: "Zajímavost z oboru, trend nebo tip na produkt",  icon: <Newspaper  size={18} />, color: "text-blue-400   border-blue-400/30   bg-blue-400/5"   },
  { id: "TIP",      label: "Tip",      desc: "Doporučení na styl, péči nebo inspirace",         icon: <Lightbulb  size={18} />, color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
  { id: "POCHVALA", label: "Pochvala", desc: "Pozitivní zpětná vazba – co se ti líbí",          icon: <Star       size={18} />, color: "text-mafia-gold border-mafia-gold/30 bg-mafia-gold/5" },
  { id: "DOTAZ",    label: "Dotaz",    desc: "Chceš se na něco zeptat svého barbera?",           icon: <HelpCircle size={18} />, color: "text-purple-400 border-purple-400/30 bg-purple-400/5" },
  { id: "VZKAZ",    label: "Vzkaz",    desc: "Obecná zpráva, cokoliv co chceš sdělit",           icon: <MessageCircle size={18} />, color: "text-white/50  border-white/20       bg-white/5"      },
];

export default function NovinkyPage() {
  const { lang } = useTranslation();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "ratelimit">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nickname: "",
    category: "VZKAZ",
    message: "",
  });

  const selectedCat = CATEGORIES.find(c => c.id === form.category)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot
    if (honeypotRef.current?.value) return;

    // Rate limit
    if (!checkRateLimit()) { setStatus("ratelimit"); return; }

    // Validace
    if (!form.nickname.trim() || !form.message.trim()) {
      setErrorMsg("Vyplňte jméno a zprávu.");
      setStatus("error");
      return;
    }
    if (form.message.trim().length < 5) {
      setErrorMsg("Zpráva je příliš krátká.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const s = (v: string, max = 1000) =>
        v.trim().slice(0, max).replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const payload = {
        nickname: s(form.nickname, 60),
        category: form.category,
        message: s(form.message, 1000),
      };

      const res = await fetch('/api/novinky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit");

      setRateLimit();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Chyba při odesílání. Zkus to znovu.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">

      {/* Success overlay */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full bg-mafia-gold/20 border border-mafia-gold/40 flex items-center justify-center mb-8">
                <CheckCircle2 className="text-mafia-gold" size={56} />
              </div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-heading font-black italic uppercase tracking-tighter mb-4"
              >
                VZKAZ <span className="text-mafia-gold">ODESLÁN</span>
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-mafia-gold/60 font-mono text-xs uppercase tracking-[0.4em] max-w-sm leading-relaxed mb-12"
              >
                Tvůj barber byl informován. Brzy se ozve.
              </motion.p>
              <Link
                href="/komunita"
                className="px-10 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all"
              >
                ZPĚT DO KOMUNITY
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/komunita"
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          ZPĚT
        </Link>
        <span className="text-[8px] font-mono text-mafia-gold/30 tracking-[0.5em] uppercase">BARBER_INBOX_v1.0</span>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-40">

        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <MessageCircle className="text-mafia-gold" size={20} />
              <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">DIRECT_CHANNEL</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter italic mb-6">
              INFORMUJ <span className="text-mafia-gold">BARBERA</span>
            </h1>
            <p className="text-lg text-smoke-white/50 font-sans italic max-w-xl">
              Máš tip, novinku nebo jen chceš něco sdělit? Přímo a diskrétně do inboxu barbera.
            </p>
          </motion.div>
        </header>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === "ratelimit" ? (
            <motion.div key="ratelimit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 px-8 bg-mafia-dark/40 border border-white/10">
              <AlertCircle className="text-mafia-gold mx-auto mb-4" size={40} />
              <p className="text-smoke-white/70 font-sans">
                Zprávu jsi nedávno odeslal. Zkus to za chvíli znovu.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} className="space-y-8" noValidate>

              {/* Honeypot */}
              <input ref={honeypotRef} type="text" name="website" tabIndex={-1} aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} autoComplete="off" />

              {/* 01 – Kdo píše */}
              <div className="border border-mafia-gold/20 bg-mafia-dark/30 p-8 space-y-4">
                <h3 className="text-xs font-mono text-mafia-gold/60 uppercase tracking-[0.4em] border-b border-mafia-gold/10 pb-3">
                  01 / Kdo píše
                </h3>
                <div>
                  <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                    Jméno nebo přezdívka <span className="text-mafia-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    maxLength={60}
                    placeholder="Tvoje jméno / přezdívka"
                    className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 02 – Kategorie */}
              <div className="border border-mafia-gold/20 bg-mafia-dark/30 p-8 space-y-4">
                <h3 className="text-xs font-mono text-mafia-gold/60 uppercase tracking-[0.4em] border-b border-mafia-gold/10 pb-3">
                  02 / Typ zprávy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES.map(cat => {
                    const active = form.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                        className={`flex items-start gap-3 p-4 border text-left transition-all duration-300 ${
                          active ? cat.color + " border-opacity-100" : "border-white/10 hover:border-white/20 bg-transparent"
                        }`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${active ? "" : "text-white/30"}`}>{cat.icon}</div>
                        <div>
                          <div className={`font-mono text-xs uppercase tracking-widest font-bold ${active ? "" : "text-white/40"}`}>
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-white/30 font-sans mt-1 leading-snug">{cat.desc}</div>
                        </div>
                        {active && (
                          <CheckCircle2 size={14} className="ml-auto flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 03 – Zpráva */}
              <div className="border border-mafia-gold/20 bg-mafia-dark/30 p-8 space-y-4">
                <h3 className="text-xs font-mono text-mafia-gold/60 uppercase tracking-[0.4em] border-b border-mafia-gold/10 pb-3">
                  03 / Zpráva
                </h3>
                <div>
                  <label className="block text-[10px] font-mono text-smoke-white/40 uppercase tracking-widest mb-2">
                    Co chceš barberovi říct? <span className="text-mafia-gold">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    maxLength={1000}
                    rows={6}
                    placeholder={
                      form.category === "NOVINKA"  ? "Např. Viděl jsem nový trend ve fade technice..." :
                      form.category === "TIP"      ? "Např. Zkus tuhle pomádu, je super na..." :
                      form.category === "POCHVALA" ? "Např. Minule jsi mi udělal nejlepší střih co jsem..." :
                      form.category === "DOTAZ"    ? "Např. Jaký šampón doporučuješ pro..." :
                                                     "Cokoliv chceš sdělit svému barberovi..."
                    }
                    className="w-full bg-black/40 border border-white/10 focus:border-mafia-gold px-4 py-3 text-sm text-smoke-white font-sans placeholder:text-white/20 focus:outline-none transition-colors resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-[10px] font-mono ${selectedCat.color.split(" ")[0]}`}>
                      {selectedCat.icon} {selectedCat.label}
                    </span>
                    <span className="text-[9px] font-mono text-white/20">{form.message.length}/1000</span>
                  </div>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {status === "error" && errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-mono">
                    <AlertCircle size={16} /> {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-[0.4em] text-sm hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> Odesílám...</>
                ) : (
                  <><Send size={18} /> Odeslat barberovi</>
                )}
              </motion.button>

              <p className="text-center text-[9px] font-mono text-white/20 uppercase tracking-widest">
                🔒 Zpráva dorazí přímo do soukromého inboxu · Diskrétní
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
