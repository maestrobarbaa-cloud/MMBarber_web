"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Scissors, Clock, Globe, X, ChevronRight, Target, Star, Heart, Lock, Camera, Building2, Ticket, Scale, Info, Users } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import Image from "./OptimizedImage";
import { useRouter } from "next/navigation";
import { playSound } from "../utils/audio";


type Currency = "CZK" | "EUR" | "USD" | "PLN" | "UAH";

const EXCHANGE_RATES: Record<Currency, number> = {
  CZK: 1,
  EUR: 26,
  USD: 22,
  PLN: 6,
  UAH: 0.42,
};

const LANG_CURRENCY: Record<string, Currency> = {
  cs: "CZK", en: "CZK",
};

export function Services() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>(() => LANG_CURRENCY[lang] ?? "CZK");

  useEffect(() => {
    if (lang === 'cs') {
      setCurrency("CZK");
    }
  }, [lang]);
  const [showMembers, setShowMembers] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);
  const [supportPassword, setSupportPassword] = useState("");
  const [isSupportUnlocked, setIsSupportUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const playCardSound = () => {
    playSound("/sounds/card.mp3", 0.9);
  };
  const closeLabel = lang === "cs" ? "Zavřít" : "Close";

  return (
    <section id="services" className="relative w-full pt-12 pb-24 xl:py-36 px-4 md:px-12 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="xl:hidden flex justify-center mb-16 px-4">
          <button 
            onClick={() => {
              router.push('/rodina');
              trackEvent("cta_main_rodina");
            }}
            className="w-full max-w-sm py-5 bg-mafia-gold text-mafia-black font-heading font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(197,160,89,0.3)] border-2 border-mafia-gold hover:bg-mafia-black hover:text-mafia-gold transition-all duration-300"
          >
            <Users size={24} />
            {lang === 'cs' ? "Rodina MMBarberu" : "MMBarber Family"}
          </button>
        </div>
        
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white mb-4 tracking-[0.3em] uppercase">
            {t.header.services}
          </h2>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
        </div>

        <div className="grid grid-cols-2 lg:flex lg:flex-row items-center justify-center gap-3 lg:gap-16 max-w-4xl mx-auto mb-12">
          <MenuCard 
            variant="simple"
            title={t.services.title}
            icon={<Target className="text-mafia-gold group-hover:brightness-125 transition-all duration-500" size={32} />}
            onClick={() => {
              router.push('/cenik');
              trackEvent("open_pricing_menu");
            }}
            onHover={playCardSound}
          />
          <MenuCard 
            variant="simple"
            title={t.header.seznamka}
            icon={<Heart size={32} className="text-mafia-gold group-hover:brightness-125 transition-all duration-500" />}
            onClick={() => {
              router.push('/seznamka');
              trackEvent("nav_seznamka_click");
            }}
            onHover={playCardSound}
          />
        </div>

        <div className="text-center mt-40 mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-heading font-black text-smoke-white mb-4 tracking-[0.3em] uppercase">
            {t.others.title}
          </h2>
          <div className="section-underline w-16 md:w-24 h-1 bg-gradient-to-r from-mafia-gold/20 via-mafia-gold to-mafia-gold/20 mx-auto mb-4 md:mb-6 shadow-[0_0_20px_var(--color-mafia-gold-glow)]" style={{ background: 'linear-gradient(to right, transparent, var(--user-accent-color), transparent)', boxShadow: '0 0 20px var(--user-glow-color)' }}></div>
        </div>

        <div className="hidden xl:flex relative h-[550px] max-w-full mx-auto items-end justify-center overflow-visible pb-8">
          {[
            { 
              id: 'vouchers',
              title: lang === 'cs' ? 'DÁRKOVÉ VOUCHERY' : 'GIFT VOUCHERS',
              icon: <Ticket size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'DÁRKOVÉ BALENÍ S PEČETÍ / PLATNOST 1 ROK' : 'PREMIUM PACKAGING WITH SEAL / 1 YEAR VALIDITY',
              onClick: () => { setShowVouchers(true); trackEvent("open_vouchers_modal"); }
            },
            { 
              id: 'gallery',
              title: lang === 'cs' ? 'GALERIE' : 'GALLERY',
              icon: <Camera size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'NAHLÉDNĚTE DO SVĚTA MMBARBER' : 'STEP INTO THE WORLD OF MMBARBER',
              onClick: () => { router.push('/galerie'); trackEvent("open_gallery_page"); }
            },
            { 
              id: 'support',
              title: t.others.support.title,
              icon: <Heart size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'PODPOŘTE NÁŠ SALON' : 'SUPPORT OUR SALON',
              onClick: () => { setShowSupport(true); trackEvent("open_support"); }
            },
            { 
              id: 'members',
              title: t.rodina.title,
              icon: <Scissors size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'POZNEJTE NÁŠ TÝM' : 'MEET OUR TEAM',
              onClick: () => { router.push('/rodina'); trackEvent("open_family_page"); }
            },
            { 
              id: 'housing',
              title: t.sidliste.title,
              icon: <Building2 size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'LOKÁLNÍ KOMUNITA A PŘÍBĚHY' : 'LOCAL COMMUNITY AND STORIES',
              onClick: () => { router.push('/sidliste'); trackEvent("open_housing_estate_page"); }
            },
            { 
              id: 'hidden',
              title: t.others.hiddenPlaces.title,
              icon: <Globe size={48} className="text-mafia-gold" />,
              description: lang === 'cs' ? 'TAJEMNÉ KOUTY NAŠEHO MĚSTA' : 'DISCOVER HIDDEN URBEX SPOTS',
              onClick: () => { router.push('/skryta-mista'); trackEvent("open_hidden_places_page"); }
            },
            { 
              id: 'system',
              title: t.others.systemVisit.title,
              icon: <Info size={48} className="text-mafia-gold" />,
              description: t.others.systemVisit.description,
              onClick: () => { router.push('/system-a-navsteva'); trackEvent("open_system_visit_page"); }
            }
          ].map((card, idx, arr) => (
            <MenuCard 
              key={card.id}
              title={card.title}
              icon={card.icon}
              description={card.description}
              onClick={card.onClick}
              index={idx}
              total={arr.length}
              onHover={() => {
                if (window.innerWidth >= 1024) {
                   setHoveredIndex(idx);
                   playCardSound();
                }
              }}
              onHoverEnd={() => setHoveredIndex(null)}
              active={hoveredIndex === idx}
              isAnyHovered={hoveredIndex !== null}
            />
          ))}
        </div>

        {/* MOBILE GRID VIEW - Now using the same size and design as Services cards */}
        <div className="flex xl:hidden flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 mb-10 w-full px-2">
          {[
            { 
              id: 'vouchers',
              title: lang === 'cs' ? 'VOUCHERY' : 'VOUCHERS',
              icon: <Ticket size={32} className="text-mafia-gold" />,
              onClick: () => { setShowVouchers(true); trackEvent("open_vouchers_modal"); }
            },
            { 
              id: 'gallery',
              title: lang === 'cs' ? 'GALERIE' : 'GALLERY',
              icon: <Camera size={32} className="text-mafia-gold" />,
              onClick: () => { router.push('/galerie'); trackEvent("open_gallery_page"); }
            },
            { 
              id: 'support',
              title: lang === 'cs' ? 'PODPORA' : 'SUPPORT',
              icon: <Heart size={32} className="text-mafia-gold" />,
              onClick: () => { setShowSupport(true); trackEvent("open_support"); }
            },
            { 
              id: 'members',
              title: t.rodina.list === 'Seznam' ? 'RODINA' : 'FAMILY',
              icon: <Scissors size={32} className="text-mafia-gold" />,
              onClick: () => { router.push('/rodina'); trackEvent("open_family_page"); }
            },
            { 
              id: 'housing',
              title: t.sidliste.title,
              icon: <Building2 size={32} className="text-mafia-gold" />,
              onClick: () => { router.push('/sidliste'); trackEvent("open_housing_estate_page"); }
            },
            { 
              id: 'hidden',
              title: lang === 'cs' ? 'SKRYTÁ' : 'HIDDEN',
              icon: <Globe size={32} className="text-mafia-gold" />,
              onClick: () => { router.push('/skryta-mista'); trackEvent("open_hidden_places_page"); }
            },
            { 
              id: 'system',
              title: lang === 'cs' ? 'SYSTÉM A NÁVŠTĚVA' : 'SYSTEM & VISIT',
              icon: <Info size={32} className="text-mafia-gold" />,
              onClick: () => { router.push('/system-a-navsteva'); trackEvent("open_system_visit_page"); }
            }
          ].map((card) => (
             <div key={card.id} className="w-[calc(50%-0.375rem)] md:w-[220px] lg:w-[250px] flex-shrink-0">
               <MenuCard 
                 variant="simple"
                 title={card.title}
                 icon={card.icon}
                 onClick={card.onClick}
               />
             </div>
          ))}
        </div>
      </div>

      <AnimatePresence>        {showVouchers && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVouchers(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-4xl bg-mafia-dark/40 border border-mafia-gold/30 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20 max-h-[90vh]"
            >
              <div className="sticky top-0 z-20 bg-mafia-black/90 backdrop-blur-md border-b border-mafia-gold/10 p-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest">
                  {lang === 'cs' ? "DÁRKOVÉ VOUCHERY" : "GIFT VOUCHERS"}
                </h3>
                <button onClick={() => setShowVouchers(false)} className="text-mafia-gold hover:text-mafia-red transition-colors ml-auto">
                   <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                   <div className="space-y-6">
                      <div className="inline-block px-4 py-1 border border-mafia-gold/30 bg-mafia-gold/5 text-mafia-gold text-[10px] font-mono uppercase tracking-[0.3em]">
                         {lang === 'cs' ? "EXKLUZIVNÍ NABÍDKA" : "EXCLUSIVE OFFER"}
                      </div>
                      <h4 className="text-4xl md:text-5xl font-heading font-black text-white italic uppercase tracking-tighter leading-tight">
                         {lang === 'cs' ? "VOUCHER DLE TVÝCH PRAVIDEL" : "VOUCHER BY YOUR RULES"}
                      </h4>
                      <p className="text-smoke-white/60 text-lg leading-relaxed font-sans">
                         {lang === 'cs' 
                           ? "Voucher u nás funguje jako osobní kredit. Můžeš si ho nabít v jakékoliv hodnotě a postupně ho čerpat na jakékoliv naše služby. Ideální dárek pro ty, kteří si potrpí na kvalitu."
                           : "The voucher works as a personal credit. You can charge it with any amount and gradually use it for any of our services. The perfect gift for those who value quality."}
                      </p>
                      
                      <ul className="space-y-4 pt-4">
                        {[
                          { cs: "Nabití v libovolné hodnotě", en: "Charge any amount" },
                          { cs: "Postupné čerpání kreditu", en: "Gradual credit withdrawal" },
                          { cs: "Platnost 12 měsíců", en: "Validity 12 months" },
                          { cs: "Použitelné na všechny služby", en: "Valid for all services" },
                          { cs: "Dárkové balení v obálce s pečetí", en: "Gift wrapped in an envelope with a seal" }
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-smoke-white/80 font-mono text-xs uppercase tracking-wider">
                             <div className="w-1.5 h-1.5 bg-mafia-gold rotate-45"></div>
                             {lang === 'cs' ? item.cs : item.en}
                          </li>
                        ))}
                      </ul>
                   </div>

                   <div className="relative group">
                      <div className="absolute -inset-4 bg-mafia-gold/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <div className="relative aspect-[1.586/1] w-full border border-mafia-gold/20 bg-mafia-black p-8 flex flex-col justify-between shadow-2xl overflow-hidden group-hover:border-mafia-gold/50 transition-colors">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-mafia-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                         
                         <div className="flex justify-between items-start">
                           <Image src="/logo.png" alt="Logo" width={50} height={50} className="w-12 h-12 grayscale opacity-50 brightness-200" />
                           <div className="text-right">
                             <div className="text-mafia-gold font-mono text-[8px] uppercase tracking-widest opacity-50">MMBARBER OFFICIAL</div>
                             <div className="text-white font-heading font-bold text-xl uppercase italic group-hover:text-mafia-gold transition-colors tracking-widest">
                               {lang === 'cs' ? 'DÁRKOVÝ POUKAZ' : 'GIFT VOUCHER'}
                             </div>
                           </div>
                         </div>

                         <div className="space-y-1">
                            <div className="text-mafia-gold/40 font-mono text-[7px] uppercase tracking-[0.4em]">{lang === 'cs' ? 'SPECIFIKACE' : 'SPECIFICATION'}</div>
                            <div className="text-smoke-white font-mono text-sm tracking-[0.2em]">{lang === 'cs' ? 'LIBOVOLNÁ HODNOTA' : 'ANY AMOUNT'}</div>
                         </div>
                         <div className="text-right">
                            <div className="text-mafia-gold/40 font-mono text-[7px] uppercase tracking-[0.4em]">{lang === 'cs' ? 'BALENÍ' : 'PACKAGING'}</div>
                            <div className="text-smoke-white font-mono text-[10px] tracking-widest uppercase italic">{lang === 'cs' ? 'DÁRKOVÁ OBÁLKA' : 'GIFT ENVELOPE'}</div>
                         </div>

                         <div className="flex justify-between items-end border-t border-white/5 pt-4">
                            <div className="space-y-1">
                               <div className="text-mafia-gold/40 font-mono text-[7px] uppercase tracking-[0.4em]">{lang === 'cs' ? 'PLATNOST' : 'VALIDITY'}</div>
                               <div className="text-mafia-red font-mono text-[10px] tracking-widest uppercase">{lang === 'cs' ? '12 MĚSÍCŮ' : '12 MONTHS'}</div>
                            </div>
                            <Ticket className="text-mafia-gold opacity-10" size={64} />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="pt-12 border-t border-white/5">
                   <div className="flex items-center gap-3 mb-8">
                      <Scale className="text-mafia-gold/50" size={24} />
                      <h5 className="text-white font-heading font-black text-xl uppercase tracking-widest italic">
                        {lang === 'cs' ? "POZOR NA PRAVIDLA HRY" : "KNOW THE RULES"}
                      </h5>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="space-y-3 bg-white/[0.02] p-6 border border-white/5 hover:border-mafia-gold/20 transition-colors">
                         <div className="flex items-center gap-2 text-mafia-gold font-bold text-xs uppercase tracking-widest mb-4">
                            <Info size={14} />
                            {lang === 'cs' ? "Uplatnění" : "Usage"}
                         </div>
                         <p className="text-smoke-white/50 text-[11px] font-sans leading-relaxed">
                            {lang === 'cs' 
                              ? "Voucher lze uplatnit na veškeré služby poskytované v MMBarber. Částka za každou realizovanou službu je odečtena z celkového nabitého kreditu až do jeho úplného vyčerpání."
                              : "The voucher can be applied to all services provided at MMBarber. The amount for each realized service is deducted from the total charged credit until it is fully exhausted."}
                         </p>
                      </div>

                      <div className="space-y-3 bg-white/[0.02] p-6 border border-white/5 hover:border-mafia-gold/20 transition-colors">
                         <div className="flex items-center gap-2 text-mafia-gold font-bold text-xs uppercase tracking-widest mb-4">
                            <Clock size={14} />
                            {lang === 'cs' ? "Platnost" : "Validity"}
                         </div>
                         <p className="text-smoke-white/50 text-[11px] font-sans leading-relaxed">
                            {lang === 'cs' 
                              ? "Voucher je platný po dobu 12 měsíců (1 rok) ode dne zakoupení. Po uplynutí této doby nevyčerpaný kredit propadá bez nároku na náhradu, v souladu s § 1908 občanského zákoníku č. 89/2012 Sb."
                              : "The voucher is valid for 12 months (1 year) from the date of purchase. After this period, any unused credit expires without the right to compensation, in accordance with Section 1908 of the Civil Code No. 89/2012 Coll."}
                         </p>
                      </div>

                      <div className="space-y-3 bg-white/[0.02] p-6 border border-white/5 hover:border-mafia-gold/20 transition-colors">
                         <div className="flex items-center gap-2 text-mafia-gold font-bold text-xs uppercase tracking-widest mb-4">
                            <Scale size={14} />
                            {lang === 'cs' ? "Právní náležitosti" : "Legal"}
                         </div>
                         <p className="text-smoke-white/50 text-[11px] font-sans leading-relaxed">
                            {lang === 'cs' 
                              ? "Dárkový poukaz není směnitelný za hotovost a nelze jej vrátit. Při čerpání služby v nižší hodnotě, než je zůstatek na poukazu, se rozdíl nevrací, ale zůstává jako kredit pro příště."
                              : "The gift voucher is not exchangeable for cash and cannot be returned. If a service of lower value than the voucher balance is used, the difference is not refunded but remains as credit for the next visit."}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
                   <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] max-w-md">
                      {lang === 'cs' 
                        ? "VŠECHNY CENY JSOU VČETNĚ DPH. PROVOZOVATEL SI VYHRAZUJE PRÁVO NA ZMĚNU PODMÍNEK. MM_LAW_SEC_01"
                        : "ALL PRICES INCLUDE VAT. THE PROVIDER RESERVES THE RIGHT TO CHANGE TERMS. MM_LAW_SEC_01"}
                   </div>
                   <button 
                     onClick={() => setShowVouchers(false)}
                     className="px-12 py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300 shadow-xl"
                   >
                     {lang === 'cs' ? "ROZUMÍM" : "UNDERSTOOD"}
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showMembers && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMembers(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-mafia-dark/40 border border-mafia-gold/30 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20 max-h-[95vh]"
            >
              <div className="sticky top-0 z-20 bg-mafia-black/90 backdrop-blur-md border-b border-mafia-gold/10 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest">{t.others.members.title}</h3>
                <button onClick={() => setShowMembers(false)} className="text-mafia-gold hover:text-mafia-red transition-colors"><X size={24} /></button>
              </div>

              <div className="p-6 md:p-10">
                 <div className="text-center mb-12">
                    <div className="inline-block p-6 rounded-full border-2 border-mafia-gold/20 mb-6 bg-mafia-gold/5 overflow-hidden">
                       <Image src="/logo.png" alt="Membership" width={80} height={80} className="w-20 h-20 object-contain" />
                    </div>
                    <p className="text-smoke-white font-heading font-black uppercase tracking-widest leading-relaxed max-w-xl mx-auto mb-6 text-xl md:text-2xl">
                       {t.others.members.employeeWall.brandVision}
                    </p>
                    <p className="text-mafia-gold/60 text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] max-w-md mx-auto">
                       {t.others.members.employeeWall.invitation}
                    </p>
                 </div>

                 <div className="pt-10 border-t border-mafia-gold/20">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
                       <h4 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em]">{t.others.members.employeeWall.title}</h4>
                       <span className="bg-mafia-red text-smoke-white px-4 py-1 text-xs font-black uppercase tracking-[0.3em] skew-x-[-12deg]">{t.others.members.employeeWall.year}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                       {t.others.members.employeeWall.months.map((month: string, idx: number) => {
                          const currentMonthIdx = new Date().getMonth();
                          const isReleased = idx <= currentMonthIdx;
                          
                          return (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`relative p-5 border transition-all duration-500 overflow-hidden group/month ${isReleased ? 'border-mafia-gold/20 bg-mafia-black/40 hover:border-mafia-gold/50' : 'border-white/5 bg-white/[0.01] opacity-30 grayscale'}`}
                            >
                               <div className="flex justify-between items-start mb-4">
                                  <span className="text-[10px] font-black tracking-[0.2em] text-mafia-red/70">{month}</span>
                                  {isReleased && <div className="flex gap-0.5">
                                     {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="fill-mafia-gold text-mafia-gold" />)}
                                  </div>}
                               </div>

                               <div className="flex flex-col items-center py-2">
                                  <div className={`w-20 h-20 overflow-hidden border transition-all duration-500 ${isReleased ? 'border-mafia-gold/30 bg-mafia-gold/5 group-hover/month:scale-110 group-hover/month:border-mafia-gold' : 'border-white/10'}`}>
                                     {isReleased ? (
                                        <Image src="/obr/tomasmicka.png" alt="Tomáš" width={80} height={80} className="w-full h-full object-cover" />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                                          <Clock size={24} className="text-white/20" />
                                        </div>
                                     )}
                                  </div>
                                  <p className={`mt-3 text-[10px] font-black uppercase tracking-widest ${isReleased ? 'text-smoke-white/80' : 'text-smoke-white/20'}`}>
                                     {isReleased ? t.others.members.employeeWall.employeeName : '...'}
                                  </p>
                               </div>

                               {!isReleased && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                     <span className="rotate-[-20deg] text-[10px] font-black text-mafia-gold/40 border border-mafia-gold/20 px-2 py-1 uppercase tracking-[0.3em]">LOCKED</span>
                                  </div>
                                )}
                            </motion.div>
                          );
                       })}
                    </div>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => {
                     setShowMembers(false);
                     router.push('/');
                   }}
                   className="mt-16 w-full py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-mafia-red hover:text-smoke-white transition-all duration-500 shadow-[0_10px_30px_rgba(197,160,89,0.3)]"
                 >
                    {t.others.hiddenPlaces.cta}
                 </motion.button>
              </div>
            </motion.div>
          </div>
        )}
        {showSupport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSupport(false);
                setSupportPassword("");
                setIsSupportUnlocked(false);
                setPasswordError(false);
              }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-6xl bg-mafia-dark/40 border border-mafia-gold/30 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20 max-h-[95vh]"
            >
              <div className="sticky top-0 z-20 bg-mafia-black/90 backdrop-blur-md border-b border-mafia-gold/10 p-6 flex items-center justify-between">
                <h3 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest">{t.others.support.title}</h3>
                <button onClick={() => {
                  setShowSupport(false);
                  setSupportPassword("");
                  setIsSupportUnlocked(false);
                  setPasswordError(false);
                }} className="text-mafia-gold hover:text-mafia-red transition-colors"><X size={24} /></button>
              </div>

              <div className="p-6 md:p-12 space-y-12">
                {!isSupportUnlocked ? (
                  <div className="max-w-md mx-auto text-center py-12">
                    <Lock className="text-mafia-gold mx-auto mb-6 opacity-50" size={64} />
                    <h4 className="text-mafia-gold font-heading font-bold text-xl uppercase tracking-widest mb-4">
                      {t.others.support.passwordLabel}
                    </h4>
                    <p className="text-smoke-white/60 text-sm italic mb-8">
                      {t.others.support.passwordHint}
                    </p>
                    <div className="space-y-4">
                      {/* Hidden username field for accessibility/password managers */}
                      <input type="text" name="username" value="support-user" readOnly className="hidden" aria-hidden="true" />
                      <input 
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={supportPassword}
                        onChange={(e) => {
                          setSupportPassword(e.target.value);
                          if (e.target.value.toLowerCase() === "grafika") {
                            setIsSupportUnlocked(true);
                            setPasswordError(false);
                          } else if (e.target.value.length >= 7) {
                            setPasswordError(true);
                          }
                        }}
                        className={`w-full bg-mafia-black/60 border ${passwordError ? 'border-mafia-red/50' : 'border-mafia-gold/30'} p-4 text-center font-mono text-mafia-gold tracking-widest focus:outline-none focus:border-mafia-gold transition-all duration-300`}
                      />
                      {passwordError && (
                        <p className="text-mafia-red text-xs uppercase tracking-widest animate-pulse">{t.others.support.denied}</p>
                      )}
                      <button 
                         onClick={() => {
                            if (supportPassword.toLowerCase() === "grafika") {
                               setIsSupportUnlocked(true);
                               setPasswordError(false);
                            } else {
                               setPasswordError(true);
                            }
                         }}
                         className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-widest hover:bg-white transition-colors duration-300"
                      >
                         {t.others.support.unlock}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-mafia-gold/30 to-transparent mb-10"></div>
                        <p className="text-mafia-gold font-heading font-black text-3xl uppercase tracking-widest leading-relaxed">
                          {t.others.support.reward}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {/* PC Wallpaper */}
                        <div className="group/wallpaper relative">
                          <span className="text-[11px] font-black text-mafia-gold uppercase tracking-[0.4em] mb-6 block text-center drop-shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]">{t.others.support.pcLabel}</span>
                          <div className="relative aspect-[16/9] border-2 border-mafia-gold/20 p-2 bg-mafia-dark/40 group-hover/wallpaper:border-mafia-gold/60 transition-all duration-500 overflow-hidden shadow-2xl">
                              <div className="absolute inset-0 border border-white/5 pointer-events-none z-10"></div>
                              <Image 
                                src="/obr/support_pc.png" 
                                alt="PC Support Bonus" 
                                width={1920}
                                height={1080}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={100}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover/wallpaper:grayscale-0 group-hover/wallpaper:scale-105 transition-all duration-700 ease-out" 
                              />
                              
                              {/* Corner Accents */}
                              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-mafia-gold opacity-30 group-hover/wallpaper:opacity-100 transition-opacity z-20"></div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-mafia-gold opacity-30 group-hover/wallpaper:opacity-100 transition-opacity z-20"></div>
                          </div>
                          <a 
                              href="/obr/support_pc.png" 
                              download="MMBARBER_PC_BONUS.png"
                              className="mt-8 flex items-center justify-center gap-3 w-full py-5 bg-transparent border-2 border-mafia-gold text-mafia-gold font-black uppercase tracking-[0.4em] hover:bg-mafia-gold hover:text-mafia-black transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                            >
                              <Star size={18} />
                              {t.others.support.downloadBtn}
                          </a>
                        </div>

                        {/* Mobile Wallpaper */}
                        <div className="group/wallpaper relative">
                          <span className="text-[11px] font-black text-mafia-gold uppercase tracking-[0.4em] mb-6 block text-center drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]">{t.others.support.phoneLabel}</span>
                          <div className="relative aspect-[9/16] max-w-[320px] mx-auto border-2 border-mafia-gold/20 p-2 bg-mafia-dark/40 group-hover/wallpaper:border-mafia-gold/60 transition-all duration-500 overflow-hidden shadow-2xl">
                              <div className="absolute inset-0 border border-white/5 pointer-events-none z-10"></div>
                              <Image 
                                src="/obr/support_mobile.png" 
                                alt="Mobile Support Bonus" 
                                width={1080}
                                height={1920}
                                sizes="(max-width: 768px) 100vw, 300px"
                                quality={100}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover/wallpaper:grayscale-0 group-hover/wallpaper:scale-105 transition-all duration-700 ease-out" 
                              />
                              
                              {/* Corner Accents */}
                              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-mafia-gold opacity-30 group-hover/wallpaper:opacity-100 transition-opacity z-20"></div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-mafia-gold opacity-30 group-hover/wallpaper:opacity-100 transition-opacity z-20"></div>
                          </div>
                          <a 
                              href="/obr/support_mobile.png" 
                              download="MMBARBER_MOBILE_BONUS.png"
                              className="mt-8 flex items-center justify-center gap-3 w-full py-5 bg-transparent border-2 border-mafia-gold text-mafia-gold font-black uppercase tracking-[0.4em] hover:bg-mafia-gold hover:text-mafia-black transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                            >
                              <Star size={18} />
                              {t.others.support.downloadBtn}
                          </a>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <p className="text-smoke-white/20 font-mono text-[8px] uppercase tracking-[0.5em] text-center border-t border-white/5 pt-8 w-full">RODINA PŘEVŠÍM / MMBARBER OFFICIAL REWARD</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </section>
  );
}

const MenuCard = React.memo(function MenuCard({ 
  title, 
  icon, 
  onClick, 
  className, 
  description, 
  price,
  index = 0, 
  total = 1,
  variant = 'fanned',
  active = false,
  onHover = () => {},
  onHoverEnd = () => {},
  isAnyHovered = false
}: { 
  title: string, 
  icon: React.ReactNode, 
  price?: string,
  onClick?: () => void, 
  className?: string, 
  description?: string, 
  index?: number, 
  total?: number,
  variant?: 'simple' | 'fanned',
  active?: boolean,
  onHover?: () => void,
  onHoverEnd?: () => void,
  isAnyHovered?: boolean
}) {
  const { lang } = useTranslation();
  const [localHover, setLocalHover] = useState(false);
  const openLabel = lang === "cs" ? "Otevřít" : "Open";
  
  const middle = (total - 1) / 2;
  const rotation = variant === 'fanned' ? (index - middle) * 10 : 0;
  const xOffset = variant === 'fanned' ? (index - middle) * 85 : 0;

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1280);
    handleResize();
    window.addEventListener('resize', handleResize);

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);
    
    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    };
  }, []);

  const [isScanning, setIsScanning] = useState(false);
  const isFlipped = (!isMobile || isMobileEffectsEnabled) && (localHover || active);

  const handleCardClick = () => {
    if (isMobile && isMobileEffectsEnabled) {
       setIsScanning(true);
       setTimeout(() => setIsScanning(false), 1000);
       
       if (variant === 'simple') {
          // On mobile with effects enabled, trigger a brief local hover for the 3D flip effect before clicking
          setLocalHover(true);
          setTimeout(() => {
            setLocalHover(false);
            if (onClick) onClick();
          }, 600);
       } else {
          if (onClick) onClick();
       }
    } else {
       if (onClick) onClick();
    }
  };

  return (
    <div 
      onMouseEnter={() => { if (!isMobile) { setLocalHover(true); onHover(); } }}
      onMouseLeave={() => { if (!isMobile) { setLocalHover(false); onHoverEnd(); } }}
      onClick={handleCardClick}
      className={`menu-card ${variant === 'fanned' ? 'absolute' : 'relative flex-shrink-0'} cursor-pointer transition-all duration-300 transform-gpu overflow-visible`}
      style={{
        willChange: 'transform, opacity',
        ...(variant === 'fanned' ? { 
          left: 'calc(50% - 112px)',
          transform: `translateX(${xOffset}px) rotate(${rotation}deg)`,
          transformOrigin: "50% 150%",
          zIndex: active ? 1000 : (localHover ? 1100 : index + 100),
          height: '384px',
          width: '256px',
          perspective: "2000px"
        } : { zIndex: 100, perspective: "2000px", height: isMobile ? (className?.includes('aspect-square') ? 'auto' : '220px') : '384px', width: isMobile ? '100%' : '256px' })
      }}
    >
      <motion.div 
        animate={{ 
          y: variant === 'fanned' ? (active ? -180 : (localHover ? -20 : (isAnyHovered ? 20 : 0))) : 0, 
          rotateY: isFlipped ? 180 : 0,
          scale: isScanning ? 1.02 : (active ? 1.2 : (localHover ? 1.05 : 1)),
          boxShadow: isScanning ? '0 0 40px var(--user-glow-color)' : undefined
        }}
        transition={{ 
          type: "spring", 
          stiffness: isScanning ? 400 : 150, 
          damping: 25,
          mass: 1.2
        }}
        className={`relative h-full w-full ${className || ""} antialiased transform-gpu`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT SIDE */}
        <div 
          className={`absolute inset-0 bg-[#0c0c0c] border border-mafia-gold/30 rounded-lg flex flex-col items-center justify-center p-8 text-center overflow-hidden transition-all duration-500 ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'} ${isMobile && isMobileEffectsEnabled ? 'shadow-[0_0_20px_rgba(197,160,89,0.3)] border-mafia-gold/50' : 'shadow-2xl'}`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(1px)" 
          }}
        >
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8 justify-center w-full">
            <div className={`p-4 md:p-6 border rounded-sm transition-all duration-500 ${isMobile && isMobileEffectsEnabled ? 'border-mafia-gold/50 bg-mafia-black/60 shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'border-mafia-gold/20 bg-mafia-black/40'}`}>
               <div className="scale-110 md:scale-125 origin-center text-mafia-gold/50">
                 {icon}
               </div>
            </div>
            
            <h3 className={`text-xl md:text-2xl font-heading font-black uppercase tracking-[0.2em] leading-tight transition-colors duration-500 ${isMobile && isMobileEffectsEnabled ? 'text-mafia-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-mafia-gold/60'}`}>
              {title}
            </h3>
          </div>

          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/10"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/10"></div>

          {/* Graphical Scan Effect on Click */}
          <AnimatePresence>
            {isScanning && (
              <>
                <motion.div 
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-mafia-gold/30 to-transparent z-40 pointer-events-none"
                />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 border-4 border-mafia-gold z-50 pointer-events-none shadow-[0_0_40px_var(--color-mafia-gold)]"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* BACK SIDE */}
        <div 
          className={`absolute inset-0 bg-[#0c0c0c] border shadow-2xl rounded-lg flex flex-col items-center justify-between p-6 text-center ${variant === 'fanned' ? 'border-mafia-gold/30' : 'border-mafia-gold'} ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)" 
          }}
        >
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/60 transition-colors z-30" style={{ borderColor: 'var(--user-accent-color)' }}></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/60 transition-colors z-30" style={{ borderColor: 'var(--user-accent-color)' }}></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/60 transition-colors z-30" style={{ borderColor: 'var(--user-accent-color)' }}></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/60 transition-colors z-30" style={{ borderColor: 'var(--user-accent-color)' }}></div>

          <div className="relative z-20 flex flex-col items-center justify-between h-full w-full transform-gpu pt-4">
            <div className="flex flex-col items-center gap-4 flex-1 justify-center w-full px-2">
              <div className="p-4 border border-mafia-gold/30 bg-mafia-black/60 shadow-xl rounded-sm" style={{ borderColor: 'var(--user-accent-color)' }}>
                 <div className="scale-100 origin-center text-mafia-gold" style={{ color: 'var(--user-accent-color)' }}>
                   {icon}
                 </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest leading-tight" style={{ color: 'var(--user-accent-color)' }}>
                  {title}
                </h3>
                {price && (
                  <div className="inline-block mt-1 px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/20 text-mafia-gold font-mono text-[9px] uppercase font-bold tracking-widest">
                    {price}
                  </div>
                )}
              </div>

              {description && (
                <p className="text-[10px] text-smoke-white font-mono font-bold uppercase tracking-widest mt-2 px-2 leading-relaxed opacity-80">
                  {description}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col items-center mt-auto pb-2 relative z-50">
              <div className="h-px bg-mafia-gold/30 mb-4 w-full" style={{ backgroundColor: 'var(--user-accent-color)' }}></div>
              <motion.button 
                onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
                animate={{
                   backgroundColor: isFlipped ? "var(--user-accent-color)" : "rgba(0,0,0,0)",
                   color: isFlipped ? "#000" : "var(--user-accent-color)",
                   borderColor: "var(--user-accent-color)"
                }}
                transition={{
                   delay: 0.4,
                   duration: 0.5,
                   type: "spring",
                   stiffness: 100
                }}
                className={`flex items-center justify-center gap-2 py-2 px-8 border transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  {openLabel}
                </span>
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black to-transparent opacity-100"></div>
        </div>
      </motion.div>
    </div>
  );
});

