"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { trackEvent } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/audio";

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
    multiplier += 0.3;
    reasons.push("surchargeAfterHours");
  }
  return { multiplier, reasons };
};

export default function CenikPage() {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>(() => LANG_CURRENCY[lang] ?? "CZK");
  const [simulatedDate, setSimulatedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const pricing = useMemo(() => getPricingDetails(simulatedDate), [simulatedDate]);

  useEffect(() => {
    if (lang === 'cs') {
      setCurrency("CZK");
    }
  }, [lang]);

  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedIndependents, setSelectedIndependents] = useState<string[]>([]);
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([]);

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

    return (regularTotal * pricing.multiplier) + specialTotal;
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
    <div className="min-h-screen w-full bg-mafia-black pt-24 pb-8 px-4 md:px-8 flex flex-col justify-between">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto flex-1 bg-mafia-dark/40 border border-mafia-gold/30 shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] overflow-hidden flex flex-col"
      >
        <div className="sticky top-0 z-20 bg-mafia-black/90 backdrop-blur-md border-b border-mafia-gold/10 p-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-heading font-bold text-mafia-gold uppercase tracking-widest">{t.services.title}</h1>
          
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
                  date: (() => { const d = new Date(); d.setDate(d.getDate() + (1 - d.getDay() + 7) % 7); d.setHours(10, 0); return d; })(),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'saturday', 
                  label: t.services.pricingModes.saturday, 
                  date: (() => { const d = new Date(); d.setDate(d.getDate() + (6 - d.getDay() + 7) % 7); d.setHours(10, 0); return d; })(),
                  icon: <Clock size={14} />
                },
                { 
                  id: 'sunday', 
                  label: t.services.pricingModes.sunday, 
                  date: (() => { const d = new Date(); d.setDate(d.getDate() + (0 - d.getDay() + 7) % 7); d.setHours(10, 0); return d; })(),
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
                  date: (() => { const d = new Date(); d.setHours(20, 0); return d; })(),
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
                        ? "border-mafia-gold bg-mafia-gold/20 shadow-[0_0_15px_rgba(197,160,89,0.2)]" 
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
            
            <div className="mt-4 flex items-center justify-center gap-4">
                <div className="h-px bg-mafia-gold/10 flex-1"></div>
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="text-[9px] font-mono text-mafia-gold/40 hover:text-mafia-gold transition-colors uppercase tracking-[0.3em] flex items-center gap-2"
                >
                  <Clock size={10} />
                  {lang === 'cs' ? 'VLASTNÍ ČAS' : 'CUSTOM TIME'}
                </button>
                <div className="h-px bg-mafia-gold/10 flex-1"></div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isDatePickerOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-mafia-black/80 border-b border-mafia-gold/10 overflow-hidden"
            >
              <div className="p-6 flex flex-wrap gap-4 justify-center">
                <input 
                  type="datetime-local" 
                  className="bg-transparent border border-mafia-gold/30 text-mafia-gold px-4 py-2 text-xs font-mono outline-none focus:border-mafia-gold"
                  onChange={(e) => {
                    if (e.target.value) setSimulatedDate(new Date(e.target.value));
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-mafia-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        {lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedSpecials.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
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
                      {lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedSpecials.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
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
                      {lang === "cs" ? formatPrice(svc.priceValue * pricing.multiplier, currency) : formatDualPrice(svc.priceValue * pricing.multiplier)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`flex flex-col gap-4 transition-opacity duration-500 ${selectedMain !== null || selectedAddons.length > 0 || selectedIndependents.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
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
                      {lang === "cs" ? formatPrice(svc.priceValue, currency) : formatDualPrice(svc.priceValue)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 p-6 md:p-8 border-t border-mafia-gold/20 flex flex-col items-stretch gap-6 bg-mafia-black/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              <div>
                <span className="text-smoke-white/50 text-[10px] uppercase tracking-widest font-mono mb-1">{t.services.totalLabel}</span>
                <div className="text-3xl md:text-4xl font-heading font-black text-mafia-gold">{formatDualPrice(totalValue)}</div>
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
            
            <div className="flex flex-col gap-3">
              <motion.a
                href="https://mm.inthechair.com/micka"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  playSound("/sounds/razor.mp3", 0.5);
                  trackEvent("cenik_booking_click_tomas");
                }}
                className="group relative overflow-hidden bg-mafia-gold border border-mafia-gold px-8 py-3 transition-all duration-300 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] md:ml-auto"
              >
                <div className="absolute inset-0 block bg-white -translate-x-[102%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                <span className="relative z-10 text-mafia-black font-sans uppercase tracking-[0.2em] font-black group-hover:text-mafia-black transition-colors">
                  {t.hero.bookBtn}
                </span>
              </motion.a>
              <button 
                onClick={() => router.push('/')}
                className="group relative overflow-hidden bg-mafia-dark border border-mafia-gold px-8 py-3 transition-all duration-300 hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)] md:ml-auto"
              >
                <span className="relative z-10 text-mafia-gold font-sans uppercase tracking-[0.2em] font-black group-hover:text-mafia-black transition-colors">{closeLabel}</span>
              </button>
              {lang === 'en' && (
                <p className="text-[9px] font-mono text-mafia-gold/40 text-right mt-2 tracking-wider">
                  WE PROUDLY ACCEPT EUR, USD, AND REVOLUT PAYMENTS.
                </p>
              )}
              <p className="text-[10px] font-sans text-mafia-gold/60 text-right mt-1 tracking-wide italic">
                {t.services.bookingNote}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
