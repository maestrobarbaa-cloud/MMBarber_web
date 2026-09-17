"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Send, ChevronRight, User, Mail, Phone, Briefcase, MessageSquare } from "lucide-react";
import { submitCooperationAction } from "@/app/actions/cooperation";
import Link from "next/link";

export default function SpolupracePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    field: "",
    message: ""
  });
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.field || !formData.message) {
      setStatus("ERROR");
      setErrorMsg("Vyplň prosím všechna povinná pole.");
      return;
    }

    setStatus("LOADING");
    setErrorMsg("");

    const res = await submitCooperationAction(formData);
    
    if (res.success) {
      setStatus("SUCCESS");
      setFormData({ name: "", email: "", phone: "", field: "", message: "" });
    } else {
      setStatus("ERROR");
      setErrorMsg(res.error || "Došlo k chybě při odesílání.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white pt-32 pb-20 px-6 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-mafia-gold/60 hover:text-mafia-gold transition-colors font-mono text-sm uppercase tracking-widest mb-12 group">
          <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
          Zpět do centrály
        </Link>

        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Handshake className="text-mafia-gold" size={48} />
            <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter">
              SPOLU<span className="text-mafia-gold">PRÁCE</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 font-sans max-w-2xl leading-relaxed"
          >
            Máš nápad na společný projekt? Jsi profík ve svém oboru a vidíš prostor pro synergii s MMBARBER? 
            Zanech nám svůj kontakt a my se ti ozveme.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-mafia-dark/40 border border-mafia-gold/20 p-8 md:p-12 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Dekorativní rohy */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-mafia-gold opacity-50" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-mafia-gold opacity-50" />

          {status === "SUCCESS" ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-mafia-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-mafia-gold/30">
                <Handshake className="text-mafia-gold" size={40} />
              </div>
              <h3 className="text-3xl font-heading font-black text-white uppercase tracking-widest mb-4">Žádost odeslána</h3>
              <p className="text-white/60 font-sans text-lg">
                Díky za tvůj zájem. Naši koordinátoři tvůj návrh prostudují a brzy se ti ozvou.
              </p>
              <button 
                onClick={() => setStatus("IDLE")}
                className="mt-12 px-8 py-4 border border-mafia-gold text-mafia-gold font-mono uppercase tracking-[0.2em] hover:bg-mafia-gold hover:text-black transition-all"
              >
                Poslat další návrh
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <User size={12} /> Jméno a Příjmení *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 px-4 py-4 text-white font-sans focus:outline-none focus:border-mafia-gold transition-colors"
                    placeholder="Např. Jan Novák"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Mail size={12} /> E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 px-4 py-4 text-white font-sans focus:outline-none focus:border-mafia-gold transition-colors"
                    placeholder="tvuj@email.cz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Phone size={12} /> Telefonní číslo
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 px-4 py-4 text-white font-sans focus:outline-none focus:border-mafia-gold transition-colors"
                    placeholder="+420 123 456 789"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Briefcase size={12} /> Tvůj obor *
                  </label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="w-full bg-black/60 border border-white/10 px-4 py-4 text-white font-sans focus:outline-none focus:border-mafia-gold transition-colors"
                    placeholder="Marketing, Dodavatel, Design..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={12} /> Návrh spolupráce *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-black/60 border border-white/10 px-4 py-4 text-white font-sans focus:outline-none focus:border-mafia-gold transition-colors resize-none"
                  placeholder="Popiš nám, v čem vidíš přínos naší společné cesty..."
                  required
                />
              </div>

              {status === "ERROR" && (
                <div className="text-mafia-red text-sm font-mono tracking-widest uppercase border border-mafia-red/30 bg-mafia-red/10 p-4">
                  [CHYBA]: {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "LOADING"}
                className="w-full py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "LOADING" ? (
                  "Odesílám..."
                ) : (
                  <>
                    Odeslat návrh
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
