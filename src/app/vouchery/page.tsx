"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ticket, Scale, Info, Clock, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { VoucherSEOArchive } from "@/components/VoucherSEOArchive";

export default function VouchersPage() {
  const { lang } = useTranslation();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-mafia-gold selection:text-black overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[150] bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[160]">
            <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
              <ArrowLeft size={20} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold">
              {lang === 'cs' ? "ZPĚT DO SALONU" : "BACK TO SALON"}
            </span>
          </Link>
          <div className="flex flex-col items-end">
            <span className="font-heading font-black text-2xl italic tracking-tighter text-white">MMBARBER</span>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">Voucher_System_v3.4.4</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 border border-mafia-gold/30 bg-mafia-gold/5 text-mafia-gold text-xs font-mono uppercase tracking-[0.5em]">
              <Zap size={14} className="animate-pulse" />
              {lang === 'cs' ? "EXKLUZIVNÍ NABÍDKA" : "EXCLUSIVE OFFER"}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
              {lang === 'cs' ? "VOUCHER DLE TVÝCH" : "VOUCHER BY YOUR"} <br />
              <span className="text-mafia-gold">{lang === 'cs' ? "PRAVIDEL" : "RULES"}</span>
            </h1>

            <p className="text-smoke-white/80 text-xl md:text-2xl leading-relaxed font-sans font-light max-w-2xl">
              {lang === 'cs' 
                ? "Voucher u nás funguje jako osobní kredit. Můžeš si ho nabít v jakékoliv hodnotě a postupně ho čerpat na jakékoliv naše služby. Ideální dárek pro ty, kteří si potrpí na kvalitu."
                : "The voucher works as a personal credit. You can charge it with any amount and gradually use it for any of our services. The perfect gift for those who value quality."}
            </p>

            <ul className="space-y-6 pt-6">
              {[
                { cs: "Nabití v libovolné hodnotě", en: "Charge any amount" },
                { cs: "Postupné čerpání kreditu", en: "Gradual credit withdrawal" },
                { cs: "Platnost 12 měsíců", en: "Validity 12 months" },
                { cs: "Použitelné na všechny služby", en: "Valid for all services" },
                { cs: "Dárkové balení v obálce s pečetí", en: "Gift wrapped in an envelope with a seal" }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-5 text-smoke-white font-mono text-base md:text-lg uppercase tracking-widest group"
                >
                  <div className="w-2.5 h-2.5 bg-mafia-gold rotate-45 shadow-[0_0_15px_rgba(197,160,89,0.8)] group-hover:scale-125 transition-transform duration-300"></div>
                  {lang === 'cs' ? item.cs : item.en}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-mafia-gold/10 blur-[100px] rounded-full opacity-50 animate-pulse"></div>
            <div className="relative aspect-[1.586/1] w-full border-2 border-mafia-gold/30 bg-mafia-black p-10 md:p-16 flex flex-col justify-between shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden hover:border-mafia-gold/60 transition-all duration-700 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-mafia-gold/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-start">
                <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-20 h-20 grayscale opacity-70 brightness-200" />
                <div className="text-right">
                  <div className="text-mafia-gold font-mono text-[12px] uppercase tracking-[0.5em] opacity-60 mb-2">MMBARBER OFFICIAL</div>
                  <div className="text-white font-heading font-bold text-3xl md:text-5xl uppercase italic tracking-widest">
                    {lang === 'cs' ? 'DÁRKOVÝ POUKAZ' : 'GIFT VOUCHER'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-mafia-gold/60 font-mono text-[10px] uppercase tracking-[0.6em]">{lang === 'cs' ? 'SPECIFIKACE' : 'SPECIFICATION'}</div>
                <div className="text-smoke-white font-mono text-2xl md:text-3xl tracking-[0.3em] font-black">{lang === 'cs' ? 'LIBOVOLNÁ HODNOTA' : 'ANY AMOUNT'}</div>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-10">
                <div className="space-y-3">
                  <div className="text-mafia-gold/60 font-mono text-[10px] uppercase tracking-[0.6em]">{lang === 'cs' ? 'PLATNOST' : 'VALIDITY'}</div>
                  <div className="text-mafia-red font-mono text-xl md:text-2xl tracking-widest uppercase font-black">{lang === 'cs' ? '12 MĚSÍCŮ' : '12 MONTHS'}</div>
                </div>
                <Ticket className="text-mafia-gold opacity-10 group-hover:opacity-20 transition-opacity duration-700" size={120} />
              </div>
              
              {/* Card Texture Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="bg-[#050505] py-32 px-6 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-20 justify-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-mafia-gold/30"></div>
            <div className="flex items-center gap-4 px-8 py-3 border border-mafia-gold/20 bg-mafia-gold/5">
              <ShieldCheck size={28} className="text-mafia-gold" />
              <h2 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-widest italic">
                {lang === 'cs' ? "PRAVIDLA HRY" : "GAME RULES"}
              </h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-mafia-gold/30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Info size={32} className="text-mafia-gold" />,
                title: lang === 'cs' ? "Uplatnění" : "Usage",
                desc: lang === 'cs' 
                  ? "Voucher lze uplatnit na veškeré služby poskytované v MMBarber. Částka za každou realizovanou službu je odečtena z celkového nabitého kreditu až do jeho úplného vyčerpání."
                  : "The voucher can be applied to all services provided at MMBarber. The amount for each realized service is deducted from the total charged credit until it is fully exhausted."
              },
              {
                icon: <Clock size={32} className="text-mafia-gold" />,
                title: lang === 'cs' ? "Platnost" : "Validity",
                desc: lang === 'cs' 
                  ? "Voucher je platný po dobu 12 měsíců (1 rok) ode dne zakoupení. Po uplynutí této doby nevyčerpaný kredit propadá bez nároku na náhradu, v souladu s § 1908 občanského zákoníku č. 89/2012 Sb."
                  : "The voucher is valid for 12 months (1 year) from the date of purchase. After this period, any unused credit expires without the right to compensation, in accordance with Section 1908 of the Civil Code No. 89/2012 Coll."
              },
              {
                icon: <Scale size={32} className="text-mafia-gold" />,
                title: lang === 'cs' ? "Právní náležitosti" : "Legal",
                desc: lang === 'cs' 
                  ? "Dárkový poukaz není směnitelný za hotovost a nelze jej vrátit. Při čerpání služby v nižší hodnotě, než je zůstatek na poukazu, se rozdíl nevrací, ale zůstává jako kredit pro příště."
                  : "The gift voucher is not exchangeable for cash and cannot be returned. If a service of lower value than the voucher balance is used, the difference is not refunded but remains as credit for the next visit."
              }
            ].map((box, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group p-10 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/40 transition-all duration-500 relative"
              >
                <div className="w-16 h-16 border border-mafia-gold/20 flex items-center justify-center mb-8 group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
                  {box.icon}
                </div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest mb-6 italic group-hover:text-mafia-gold transition-colors">
                  {box.title}
                </h3>
                <p className="text-smoke-white/60 text-lg leading-relaxed font-sans font-light">
                  {box.desc}
                </p>
                {/* Decorative index */}
                <span className="absolute top-6 right-8 font-mono text-[40px] text-white/5 font-black group-hover:text-mafia-gold/10 transition-colors">
                  0{i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-mafia-gold/5 blur-[120px] opacity-20"></div>
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase italic tracking-tighter">
            {lang === 'cs' ? "DARUJ ZÁŽITEK, NE JEN STŘIH" : "GIVE AN EXPERIENCE, NOT JUST A CUT"}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/"
              className="px-16 py-6 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.5em] text-lg hover:bg-white transition-all duration-500 shadow-[0_20px_50px_rgba(197,160,89,0.3)] w-full md:w-auto relative z-10"
            >
              {lang === 'cs' ? "ZPĚT DO SALONU" : "BACK TO SALON"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <BottomTerminalReveal thresholdMultiplier={1.5}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <VoucherSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>
    </main>
  );
}
