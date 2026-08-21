"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, X, Users, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/audio";
import { Footer } from "@/components/Footer";
import { BottomTerminalReveal } from "@/components/BottomTerminalReveal";
import { PricingSEOArchive } from "@/components/PricingSEOArchive";
import { useBarbers } from "@/contexts/BarberContext";
import { BookingModal } from "@/components/BookingModal";

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

const CZECH_HOLIDAYS = [
  "01-01", "05-01", "05-08", "07-05", "07-06", "09-28", "10-28", "11-17", "12-24", "12-25", "12-26"
];

const isHoliday = (date: Date) => {
  const md = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  if (CZECH_HOLIDAYS.includes(md)) return true;
  if (date.getFullYear() === 2026) {
    if (date.getMonth() === 3 && (date.getDate() === 3 || date.getDate() === 6)) return true;
  }
  return false;
};

const getPricingDetails = (date: Date) => {
  let multiplier = 1.0;
  const reasons: string[] = [];
  const m = date.getMonth();
  const d = date.getDate();
  const dow = date.getDay();
  const h = date.getHours();

  if (m === 0 && d === 1) {
    multiplier = 1.7;
    reasons.push("surchargeNewYear");
  } else if (m === 11 && d === 24 && h < 12) {
    multiplier = 1.5;
    reasons.push("surchargeChristmas");
  } else if (isHoliday(date)) {
    multiplier = 2.0;
    reasons.push("surchargeHoliday");
  } else if (dow === 0) {
    multiplier = 1.3;
    reasons.push("surchargeSun");
  } else if (dow === 6) {
    multiplier = 1.1;
    reasons.push("surchargeSat");
  } else {
    reasons.push("surchargeNone");
  }

  const closing = (dow === 0 || dow === 6) ? 12 : 18;
  if (h >= closing) {
    multiplier += 0.2;
    reasons.push("surchargeAfterHours");
  }
  return { multiplier, reasons };
};

export default function CenikPage() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const { barbers } = useBarbers();
  const [currency, setCurrency] = useState<Currency>(() => LANG_CURRENCY[lang] ?? "CZK");
  const [simulatedDate, setSimulatedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(10, 0); // Default to standard time to avoid "always on" surcharge
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const pricing = useMemo(() => getPricingDetails(simulatedDate), [simulatedDate]);

  useEffect(() => {
    if (lang === 'cs') {
      setCurrency("CZK");
    }
  }, [lang]);

  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("tomas");
  const isRecruitMode = selectedBarberId === "volne";
  const selectedBarberObj = barbers.find(b => b.id === selectedBarberId) || barbers[0];
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedIndependents, setSelectedIndependents] = useState<string[]>([]);
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const isSelected = prev.includes(id);
      if (!isSelected && selectedSpecials.length > 0) {
        setSelectedSpecials([]);
      }
      if (isSelected) {
        return prev.filter(x => x !== id);
      } else {
        let nxt = [...prev, id];
        if (id === "add3") nxt = nxt.filter(x => x !== "add4");
        if (id === "add4") nxt = nxt.filter(x => x !== "add3");
        return nxt;
      }
    });
  };

  const toggleIndependent = (id: string) => {
    setSelectedIndependents(prev => {
      const isSelected = prev.includes(id);
      if (!isSelected && selectedSpecials.length > 0) {
        setSelectedSpecials([]);
      }
      return isSelected ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const toggleSpecial = (id: string) => {
    setSelectedSpecials(prev => {
      const isSelecting = !prev.includes(id);
      if (isSelecting) {
        setSelectedMain(null);
        setSelectedStyle(null);
        setSelectedAddons([]);
        setSelectedIndependents([]);
        return [id];
      }
      return [];
    });
  };

  const totalValue = useMemo(() => {
    let regularTotal = 0;
    let specialTotal = 0;
    
    if (selectedMain !== null && t.services.items[selectedMain]) {
      regularTotal += t.services.items[selectedMain].priceValue;
    }
    selectedAddons.forEach(id => {
      const svc = (t.services.addons as { id: string, priceValue: number }[]).find(s => s.id === id);
      if (svc) regularTotal += svc.priceValue;
    });
    selectedIndependents.forEach(id => {
      const svc = t.services.independent.find((s: { id: string, priceValue: number }) => s.id === id);
      if (svc) regularTotal += svc.priceValue;
    });
    selectedSpecials.forEach(id => {
      const svc = t.services.special.find((s: { id: string, priceValue: number }) => s.id === id);
      if (svc) specialTotal += svc.priceValue;
    });

    if (isRecruitMode) return 0;
    return (regularTotal + specialTotal) * pricing.multiplier;
  }, [selectedMain, selectedAddons, selectedIndependents, selectedSpecials, t.services, pricing.multiplier]);

  const estimatedTime = useMemo(() => {
    if (selectedMain !== null && t.services.items[selectedMain]) {
      return t.services.items[selectedMain].time;
    }
    return "0 min";
  }, [selectedMain, t.services.items]);

  const getIndependentTimeMinutes = () => {
    let total = 0;
    selectedIndependents.forEach(id => {
      const svc = (t.services.independent as { id: string, time?: number }[]).find(s => s.id === id);
      if (svc && svc.time) total += svc.time;
    });
    return total;
  };

  const getTotalTimeMinutes = () => {
    let total = 0;
    if (selectedMain !== null && t.services.items[selectedMain]) {
      const ts = t.services.items[selectedMain].time;
      if (ts.includes("m")) total += parseInt(ts);
      else if (ts.includes("h")) total += Math.round(parseFloat(ts.replace(",", ".")) * 60);
    }
    total += getIndependentTimeMinutes();
    
    selectedSpecials.forEach(id => {
      const svc = t.services.special.find((s: { id: string, time?: string }) => s.id === id);
      if (svc && svc.time) {
        if (svc.time.includes("m")) total += parseInt(svc.time);
        else if (svc.time.includes("h")) total += Math.round(parseFloat(svc.time.replace(",", ".")) * 60);
      }
    });
    
    return total;
  };

  const formatMinutes = (mins: number) => {
    if (mins === 0) return "0 min";
    if (mins < 60) return `${mins} min`;
    const h = mins / 60;
    return `${h.toString().replace(".", ",")} h`;
  };

  const formatPrice = (value: number, curr: Currency) => {
    if (curr === "CZK") return `${Math.round(value)} Kč`;
    const converted = value / EXCHANGE_RATES[curr];
    const rounded = Math.round(converted);
    if (curr === "EUR") return `€${rounded}`;
    if (curr === "USD") return `$${rounded}`;
    if (curr === "PLN") return `${rounded} zł`;
    if (curr === "UAH") return `₴${Math.round(value / EXCHANGE_RATES["UAH"])}`;
    return `${rounded}`;
  };



  const formatDualPrice = (value: number) => {
    const localCurr = LANG_CURRENCY[lang] ?? "CZK";
    if (localCurr === "CZK") return formatPrice(value, currency);
    if (currency === localCurr || currency === "CZK") {
      return `${Math.round(value)} Kč / ${formatPrice(value, localCurr)}`;
    }
    return formatPrice(value, currency);
  };

  const closeLabel = lang === "cs" ? "Zpět" : "Back";

  return (
    <div className="min-h-screen bg-mafia-black text-white relative">
      <div className="pt-28 pb-16 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl mx-auto bg-mafia-dark/40 border border-mafia-gold/30 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] overflow-hidden flex flex-col"
        >
        <div className="sticky top-0 z-20 bg-mafia-black/90 backdrop-blur-md border-b border-mafia-gold/10 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest">{t.services.title}</h1>
            <span className="bg-mafia-red/20 border border-mafia-red text-mafia-red text-[10px] font-mono font-bold uppercase px-2 py-1 tracking-widest rounded-sm animate-pulse">Ve vývoji</span>
          </div>
          
          {lang === 'en' && (
            <div className="flex items-center gap-2 bg-mafia-black/40 border border-mafia-gold/20 p-1">
              {(["CZK", "EUR", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    trackEvent("change_currency", { currency: c });
                  }}
                  className={`px-3 py-1 text-[10px] font-black tracking-widest transition-all ${
                    currency === c 
                      ? "bg-mafia-gold text-mafia-black" 
                      : "text-mafia-gold/50 hover:text-mafia-gold hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => router.push('/')} className="text-mafia-gold hover:text-mafia-red transition-colors ml-auto">
            <X size={24} />
          </button>
        </div>

        {/* Pricing Modes Selector */}
        <div className="bg-mafia-gold/5 border-b border-mafia-gold/20 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-[0.4em]">{t.services.dynamicPricingTitle}</span>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-widest">{t.services.currentSurcharge}:</span>
                 <span className="text-sm font-black text-mafia-gold uppercase">
                   {pricing.multiplier > 1 ? `+${Math.round((pricing.multiplier - 1) * 100)}%` : t.services.surchargeNone}
                 </span>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { 
                  id: 'workday', 
                  label: t.services.pricingModes.workday, 
                  date: (() => { 
                    const d = new Date(); 
                    d.setHours(10, 0, 0, 0); 
                    while (d.getDay() === 0 || d.getDay() === 6 || isHoliday(d)) {
                      d.setDate(d.getDate() + 1);
                    }
                    return d; 
                  })(),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'saturday', 
                  label: t.services.pricingModes.saturday, 
                  date: (() => { 
                    const d = new Date(); 
                    d.setHours(10, 0, 0, 0);
                    while (d.getDay() !== 6 || isHoliday(d)) {
                      d.setDate(d.getDate() + 1);
                    }
                    return d; 
                  })(),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'sunday', 
                  label: t.services.pricingModes.sunday, 
                  date: (() => { 
                    const d = new Date(); 
                    d.setHours(10, 0, 0, 0);
                    while (d.getDay() !== 0 || isHoliday(d)) {
                      d.setDate(d.getDate() + 1);
                    }
                    return d; 
                  })(),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'holiday', 
                  label: t.services.pricingModes.holiday, 
                  date: new Date(new Date().getFullYear(), 4, 1, 10, 0),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'night', 
                  label: t.services.pricingModes.night, 
                  date: (() => { 
                    const d = new Date(); 
                    d.setHours(18, 1, 0, 0); 
                    while (d.getDay() === 0 || d.getDay() === 6 || isHoliday(d)) {
                      d.setDate(d.getDate() + 1);
                    }
                    return d; 
                  })(),
                  icon: <Clock size={14} />
                }
              ].map((mode) => {
                const modePricing = getPricingDetails(mode.date);
                const isActive = pricing.reasons.some(r => modePricing.reasons.includes(r)) || 
                                (mode.id === 'workday' && pricing.multiplier === 1);

                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSimulatedDate(mode.date);
                      playSound("/sounds/click.mp3", 0.3);
                    }}
                    className={`relative flex flex-col items-center justify-center p-3 border transition-all duration-300 gap-1 ${
                      isActive 
                        ? "border-mafia-gold bg-mafia-gold/20 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.2)]" 
                        : "border-mafia-gold/20 bg-mafia-black/40 hover:border-mafia-gold/50"
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-mafia-gold' : 'text-smoke-white/40'}`}>
                      {mode.label}
                    </span>
                    <span className={`text-[9px] font-mono ${isActive ? 'text-mafia-gold/60' : 'text-white/20'}`}>
                      {modePricing.multiplier > 1 ? `+${Math.round((modePricing.multiplier - 1) * 100)}%` : 'Standard'}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-mode-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-mafia-gold rotate-45"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20">
          <div className="max-w-xl mb-8 flex items-center gap-4 border-b border-mafia-gold/10 pb-4">
            <div>
               <h4 className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-[0.4em] mb-2">VYBERTE SI SVÉHO MISTRA</h4>
                 <div className="flex gap-2 flex-wrap">
                 {barbers.filter(b => !b.missionFailed).map((barber) => (
                   <button 
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`px-6 py-2 border text-xs font-black tracking-widest uppercase transition-all duration-300 ${selectedBarberId === barber.id ? 'bg-mafia-gold text-mafia-black border-mafia-gold' : 'border-mafia-gold/20 text-mafia-gold/60 hover:border-mafia-gold/50'}`}
                   >
                     {barber.name}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {isRecruitMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-mafia-gold/10 border border-mafia-gold/30 p-6 mb-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={80} className="text-mafia-gold" />
              </div>
              <h3 className="text-2xl font-heading font-black text-mafia-gold mb-2 tracking-widest">{t.services.recruit.title}</h3>
              <p className="text-smoke-white font-sans max-w-2xl leading-relaxed text-sm">
                {t.services.recruit.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-mafia-gold font-mono text-[10px] uppercase tracking-[0.3em]">
                <Sparkles size={14} />
                <span>START YOUR CAREER AT MMBARBER</span>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedSpecials.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="border-b border-mafia-gold/20 pb-2 mb-2">
                <h4 className="text-xl font-heading font-black text-mafia-gold uppercase">{t.services.mainTitle}</h4>
                <p className="text-[10px] font-mono text-mafia-gold/50 uppercase tracking-widest mt-1 italic leading-relaxed">
                  {t.services.timeTariffNote}
                </p>
              </div>
              {t.services.items.map((svc: { time: string, desc: string, priceValue: number }, i: number) => {
                const isSelected = selectedMain === i;
                return (
                  <div 
                    key={i}
                    onClick={() => {
                      const isNowSelected = selectedMain === i;
                      if (!isNowSelected) {
                        setSelectedMain(i);
                        setSelectedSpecials([]);
                        // One big package logic for 1h service (index 6)
                        if (i === 6) {
                          setSelectedAddons([]);
                          setSelectedIndependents([]);
                        }
                      } else {
                        setSelectedMain(null);
                      }
                    }}
                    className={`group cursor-pointer flex flex-col p-4 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-mafia-gold/30 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex items-center gap-3">
                        <Clock className={isSelected ? 'text-mafia-gold' : 'text-mafia-red'} size={24} />
                        <span className={`text-4xl font-heading font-black tracking-widest uppercase leading-none transition-colors duration-300 ${isSelected ? 'text-mafia-gold drop-shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'text-smoke-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`}>
                          {svc.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-smoke-white/60 text-sm font-sans line-clamp-3 min-h-[44px] mb-4">{svc.desc}</p>
                    <div className="text-lg font-bold font-sans text-mafia-gold text-right border-t border-white/5 pt-2">
                        {isRecruitMode ? "0 Kč" : (lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedSpecials.length > 0 || selectedMain === 6 ? 'opacity-30 pointer-events-none' : ''}`}>
              <h4 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2 border-b border-mafia-gold/20 pb-2">{t.services.addonsTitle}</h4>
              {t.services.addons.map((svc: { id: string, name: string, desc: string, priceValue: number }) => {
                const isSelected = selectedAddons.includes(svc.id);
                return (
                  <div 
                    key={svc.id}
                    onClick={() => toggleAddon(svc.id)}
                    className={`group cursor-pointer flex flex-col p-4 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-mafia-gold/30 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-heading font-bold text-smoke-white uppercase tracking-wider">{svc.name}</h4>
                      <div className={`w-4 h-4 border ${isSelected ? 'border-mafia-gold bg-mafia-gold' : 'border-white/20'}`}></div>
                    </div>
                    <p className="text-smoke-white/40 text-xs font-sans mb-3 line-clamp-2">{svc.desc}</p>
                    <div className="text-lg font-bold font-sans text-mafia-gold text-right border-t border-white/5 pt-2">
                      {isRecruitMode ? "0 Kč" : (lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedSpecials.length > 0 || selectedMain === 6 ? 'opacity-30 pointer-events-none' : ''}`}>
              <h4 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2 border-b border-mafia-gold/20 pb-2">{t.services.independentTitle}</h4>
              {t.services.independent.map((svc: { id: string, name: string, desc: string, priceValue: number }) => {
                const isSelected = selectedIndependents.includes(svc.id);
                return (
                  <div 
                    key={svc.id}
                    onClick={() => toggleIndependent(svc.id)}
                    className={`group cursor-pointer flex flex-col p-4 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-mafia-gold/30 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-heading font-bold text-smoke-white uppercase tracking-wider">{svc.name}</h4>
                      <div className={`w-4 h-4 border ${isSelected ? 'border-mafia-gold bg-mafia-gold' : 'border-white/20'}`}></div>
                    </div>
                    <p className="text-smoke-white/40 text-xs font-sans mb-3 line-clamp-2">{svc.desc}</p>
                    <div className="text-lg font-bold font-sans text-mafia-gold text-right border-t border-white/5 pt-2">
                      {isRecruitMode ? "0 Kč" : (lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedMain === 6 ? 'opacity-30 pointer-events-none' : ''}`}>
              <h4 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2 border-b border-mafia-gold/20 pb-2">{t.services.specialTitle}</h4>
              <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest mb-2 italic">
                {lang === 'cs' ? '* Pouze po předchozí domluvě. Fixní cena.' : '* Prior agreement only. Fixed price.'}
              </p>
              {t.services.special.map((svc: { id: string, name: string, desc: string, priceValue: number, time: string }) => {
                const isSelected = selectedSpecials.includes(svc.id);
                return (
                  <div 
                    key={svc.id}
                    onClick={() => toggleSpecial(svc.id)}
                    className={`group cursor-pointer flex flex-col p-4 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/10 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : 'bg-white/[0.02] border-white/[0.05] hover:border-mafia-gold/30 hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-heading font-bold text-smoke-white uppercase tracking-wider">{svc.name}</h4>
                      <div className={`w-4 h-4 border ${isSelected ? 'border-mafia-gold bg-mafia-gold' : 'border-white/20'}`}></div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                        <Clock className="text-mafia-red" size={12} />
                        <span className="text-[10px] font-mono uppercase text-mafia-red/70">{svc.time}</span>
                    </div>
                    <p className="text-smoke-white/40 text-xs font-sans mb-3 line-clamp-2">{svc.desc}</p>
                    <div className="text-lg font-bold font-sans text-mafia-gold text-right border-t border-white/5 pt-2">
                      {isRecruitMode ? "0 Kč" : (lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedMain === 6 ? 'opacity-30 pointer-events-none' : ''}`}>
              <h4 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2 border-b border-mafia-gold/20 pb-2">
                {t.services.masterTimes.title}
              </h4>
              <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest mb-2 italic leading-relaxed">
                {t.services.masterTimes.note}
              </p>
              
              <div className="space-y-6 mt-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-mafia-gold/10">
                {/* VÝTRATY / FADES */}
                <div className="space-y-2">
                  <h5 className="text-[9px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] border-l-2 border-mafia-gold/20 pl-2 mb-3">
                    {t.services.masterTimes.fadeLabel}
                  </h5>
                  {t.services.masterTimes.items.filter((item: any) => item.type === 'fade').map((item: any) => {
                    const isSelected = selectedStyle === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          const newSelected = isSelected ? null : item.id;
                          setSelectedStyle(newSelected);
                          if (!isSelected) {
                            const id = item.id;
                            if (id === "style_skinfade") setSelectedMain(1); // 8m -> 10m slot
                            else if (id === "style_fadenoshaver" || id === "style_ornaments") setSelectedMain(0); // 5m slot
                            else if (id === "style_lowmidhigh") setSelectedMain(2); // 15m slot
                            else if (id === "style_topshort") setSelectedMain(1); // 10m slot
                            else if (id === "style_classicshort" || id === "style_beardtop") setSelectedMain(4); // 30m slot
                            else if (id === "style_beardfull") setSelectedMain(5); // 45m slot
                            else if (id === "style_longpompa" || id === "style_premium") setSelectedMain(6); // 1h slot
                            setSelectedSpecials([]);
                          }
                        }}
                        className={`group cursor-pointer flex flex-col gap-1 p-3 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/20 shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.1)]' : 'border-mafia-gold/10 bg-white/[0.01] hover:border-mafia-gold/30 hover:bg-white/[0.03]'}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors ${isSelected ? 'text-mafia-gold' : 'text-smoke-white/40 group-hover:text-smoke-white/60'}`}>
                            {item.label}
                          </span>
                          <div className={`w-1.5 h-1.5 rotate-45 transition-all duration-300 ${isSelected ? 'bg-mafia-gold scale-100' : 'bg-white/5 scale-0'}`} />
                        </div>
                        <span className={`text-lg font-heading font-black ${isSelected ? 'text-mafia-gold' : 'text-mafia-gold/60'}`}>{item.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* STŘIHY / CUTS */}
                <div className="space-y-2">
                  <h5 className="text-[9px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] border-l-2 border-mafia-gold/20 pl-2 mb-3">
                    {t.services.masterTimes.cutLabel}
                  </h5>
                  {t.services.masterTimes.items.filter((item: any) => item.type === 'cut').map((item: any) => {
                    const isSelected = selectedStyle === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          const newSelected = isSelected ? null : item.id;
                          setSelectedStyle(newSelected);
                          if (!isSelected) {
                            const id = item.id;
                            if (id === "style_skinfade") setSelectedMain(1); // 8m -> 10m slot
                            else if (id === "style_fadenoshaver" || id === "style_ornaments") setSelectedMain(0); // 5m slot
                            else if (id === "style_lowmidhigh") setSelectedMain(2); // 15m slot
                            else if (id === "style_topshort") setSelectedMain(1); // 10m slot
                            else if (id === "style_classicshort" || id === "style_beardtop") setSelectedMain(4); // 30m slot
                            else if (id === "style_beardfull") setSelectedMain(5); // 45m slot
                            else if (id === "style_longpompa" || id === "style_premium") setSelectedMain(6); // 1h slot
                            setSelectedSpecials([]);
                          }
                        }}
                        className={`group cursor-pointer flex flex-col gap-1 p-3 border transition-all duration-300 ${isSelected ? 'border-mafia-gold bg-mafia-gold/20 shadow-[0_0_10px_rgba(var(--color-mafia-gold-rgb),0.1)]' : 'border-mafia-gold/10 bg-white/[0.01] hover:border-mafia-gold/30 hover:bg-white/[0.03]'}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors ${isSelected ? 'text-mafia-gold' : 'text-smoke-white/40 group-hover:text-smoke-white/60'}`}>
                            {item.label}
                          </span>
                          <div className={`w-1.5 h-1.5 rotate-45 transition-all duration-300 ${isSelected ? 'bg-mafia-gold scale-100' : 'bg-white/5 scale-0'}`} />
                        </div>
                        <span className={`text-lg font-heading font-black ${isSelected ? 'text-mafia-gold' : 'text-mafia-gold/60'}`}>{item.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-auto pt-6 opacity-30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px bg-mafia-gold/30 flex-1"></div>
                  <span className="text-[8px] font-mono uppercase tracking-[0.4em]">STYLE_SELECTOR</span>
                  <div className="h-px bg-mafia-gold/30 flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 p-6 md:p-8 border-t border-mafia-gold/20 flex flex-col items-stretch gap-6 bg-mafia-black/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              <div>
                <span className="text-smoke-white/50 text-[10px] uppercase tracking-widest font-mono mb-1 flex items-center gap-2">
                  {t.services.totalLabel}
                </span>
                <div className="text-3xl md:text-4xl font-heading font-black text-mafia-gold">
                  {pricing.multiplier > 1 ? (
                    <>
                      {formatPrice(totalValue, currency)}
                      {lang === 'cs' && currency !== 'CZK' && (
                        <span className="text-xs ml-2 opacity-40 font-sans">
                          / {formatPrice(totalValue, 'CZK')}
                        </span>
                      )}
                    </>
                  ) : formatDualPrice(totalValue)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-8 items-center border-l border-white/10 pl-8">
                <div>
                  <span className="text-mafia-red/70 text-[10px] uppercase tracking-widest font-mono mb-1">{t.services.timeLabel}</span>
                  <div className="flex items-center gap-2 text-xl font-bold font-sans text-mafia-red">{estimatedTime}</div>
                </div>

                {getIndependentTimeMinutes() > 0 && (
                  <div>
                    <span className="text-mafia-red/70 text-[10px] uppercase tracking-widest font-mono mb-1">{t.services.independentTimeLabel}</span>
                    <div className="flex items-center gap-2 text-xl font-bold font-sans text-mafia-red">{formatMinutes(getIndependentTimeMinutes())}</div>
                  </div>
                )}

                {(selectedMain !== null || getIndependentTimeMinutes() > 0 || selectedSpecials.length > 0) && (
                  <div className="bg-mafia-red/5 px-4 py-2 border-r border-l border-mafia-red/20">
                    <span className="text-mafia-gold text-[10px] uppercase tracking-widest font-black font-mono mb-1">{t.services.totalTimeLabel}</span>
                    <div className="flex items-center gap-2 text-2xl font-black font-heading text-mafia-gold">{formatMinutes(getTotalTimeMinutes())}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-wrap gap-4 items-center">
                <motion.a
                  href={isRecruitMode ? "/rodina" : (selectedBarberObj?.bookingSystemType === 'internal' ? undefined : (selectedBarberObj?.bookingLink || "https://mm.inthechair.com/micka"))}
                  target={isRecruitMode || selectedBarberObj?.bookingSystemType === 'internal' ? "_self" : "_blank"}
                  onClick={(e) => {
                    playSound("/sounds/razor.mp3", 0.5);
                    trackEvent(isRecruitMode ? "cenik_recruit_click" : "cenik_booking_click_masters");
                    if (!isRecruitMode && selectedBarberObj?.bookingSystemType === 'internal') {
                      e.preventDefault();
                      setIsBookingModalOpen(true);
                    }
                  }}
                  className="group relative overflow-hidden bg-mafia-gold border border-mafia-gold px-8 py-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]"
                >
                  <div className="absolute inset-0 block bg-white -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                  <span className="relative z-10 text-mafia-black font-sans uppercase tracking-[0.2em] font-black group-hover:text-mafia-black transition-colors">
                    {isRecruitMode ? t.services.recruit.cta : t.hero.bookBtn}
                  </span>
                </motion.a>
                <button 
                  onClick={() => router.push('/')}
                  className="group relative overflow-hidden bg-mafia-dark border border-mafia-gold px-8 py-3 transition-all duration-300 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]"
                >
                  <span className="relative z-10 text-mafia-gold font-sans uppercase tracking-[0.2em] font-black group-hover:text-mafia-black transition-colors">{closeLabel}</span>
                </button>
              </div>
              
              <div className="flex flex-col items-end gap-1 mt-1 text-right">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-mafia-gold animate-pulse"></span>
                  <p className="text-[10px] font-sans text-mafia-gold uppercase tracking-wider font-black">
                    {t.services.paymentMethods}
                  </p>
                </div>
                {lang === 'en' && (
                  <p className="text-[9px] font-mono text-mafia-gold/40 tracking-wider uppercase">
                    WE PROUDLY ACCEPT EUR, USD, AND REVOLUT PAYMENTS.
                  </p>
                )}
                <p className="text-[10px] font-sans text-smoke-white/60 tracking-wide italic">
                  {t.services.bookingNote}
                </p>
              </div>
            </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

      <BottomTerminalReveal thresholdMultiplier={100}>
        {(level) => (
          <>
            {level >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <PricingSEOArchive />
              </motion.div>
            )}
          </>
        )}
      </BottomTerminalReveal>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        barber={selectedBarberObj || null}
        serviceName={selectedMain !== null ? t.services.items[selectedMain]?.desc || 'Vybraná služba' : 'Vybrané služby'}
        durationMin={getTotalTimeMinutes()}
        price={totalValue}
      />
    </div>
  );
}
