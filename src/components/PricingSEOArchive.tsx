"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, Tag, Info, Sparkles, Flame, Check } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function PricingSEOArchive() {
  const { lang } = useTranslation();

  const services = [
    { time: "5 m", name: lang === 'cs' ? "Rychlá úprava" : "Quick Refresh", price: "100 Kč", desc: lang === 'cs' ? "Kontury, detaily nebo jen bleskový refresh." : "Contours, details or just a lightning refresh." },
    { time: "10 m", name: lang === 'cs' ? "Expres servis" : "Express Service", price: "180 Kč", desc: lang === 'cs' ? "Zaholení krku, úprava bez strojku." : "Neck shave, trim without clippers." },
    { time: "15 m", name: lang === 'cs' ? "Quick Fade" : "Quick Fade", price: "250 Kč", desc: lang === 'cs' ? "Buzzcut, jednoduchý střih strojkem nebo rychlé srovnání stran." : "Buzzcut, simple clipper cut or quick side alignment." },
    { time: "20 m", name: lang === 'cs' ? "Základní střih" : "Basic Cut", price: "320 Kč", desc: lang === 'cs' ? "Dětské střihy nebo jednodušší úpravy." : "Kids' cuts or simpler trims." },
    { time: "30 m", name: lang === 'cs' ? "Klasika" : "Classic", price: "450 Kč", desc: lang === 'cs' ? "Precizní střih nůžkami i strojkem." : "Precise scissors and clipper cut." },
    { time: "45 m", name: lang === 'cs' ? "Kompletní péče" : "Complete Care", price: "650 Kč", desc: lang === 'cs' ? "Mytí, střih, zaholení břitvou." : "Wash, cut, razor shave." },
    { time: "1 h", name: lang === 'cs' ? "Premium kombo" : "Premium Combo", price: "1 000 Kč", desc: lang === 'cs' ? "Vlasy, vousy, mytí a totální relaxace." : "Hair, beard, wash and total relaxation." }
  ];

  const specials = [
    { name: lang === 'cs' ? "Večerní střih (45 min)" : "Evening cut (45 min)", price: "1 300 Kč", desc: lang === 'cs' ? "Individuální termín 18:00 - 20:00." : "Individual slot 18:00 - 20:00." },
    { name: lang === 'cs' ? "Večerní Full Service (1 h)" : "Evening Full Service (1 h)", price: "2 500 Kč", desc: lang === 'cs' ? "Luxusní péče po skončení běžné doby." : "Luxury care after standard hours." }
  ];

  return (
    <div className="w-full bg-[#030303] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-mafia-gold/5 border border-mafia-gold/20 text-mafia-gold font-mono text-[9px] uppercase tracking-[0.40em]">
            <Tag size={10} className="text-mafia-gold fill-mafia-gold/30 animate-pulse" />
            <span>{lang === 'cs' ? 'DŮVĚRNÝ CENOVÝ PROTOKOL' : 'CONFIDENTIAL PRICING PROTOCOL'}</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-heading font-black text-smoke-white uppercase tracking-tighter italic">
            {lang === 'cs' ? 'Kompletní přehled služeb a regionální ceník' : 'Complete Services Overview and Regional Pricing'}
          </h2>
          <p className="text-mafia-gold/60 font-mono text-[10px] md:text-xs uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
            {lang === 'cs' 
              ? 'Transparentní ceny postavené na reálném čase stráveném v křesle. Žádné skryté poplatky, poctivá práce a špičková kosmetika pro muže v Uherském Hradišti.'
              : 'Transparent prices built on the actual time spent in the chair. No hidden fees, honest work, and premium cosmetics for men in Uherské Hradiště.'}
          </p>
        </div>

        {/* Semantic Services Table for SEO crawlers */}
        <div className="border border-white/5 bg-black/60 rounded-sm overflow-hidden p-6 md:p-10 space-y-8">
          <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-widest border-b border-white/10 pb-4">
            {lang === 'cs' ? 'Časové tarify a balíčky' : 'Time Tariffs and Packages'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <div key={i} className="flex items-start justify-between p-4 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-mafia-red px-2 py-0.5 border border-mafia-red/20 uppercase font-black tracking-widest">{svc.time}</span>
                    <h4 className="font-heading font-bold text-white uppercase tracking-wider text-sm">{svc.name}</h4>
                  </div>
                  <p className="text-xs text-white/50 font-sans leading-relaxed">{svc.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-mafia-gold font-heading font-black text-lg">{svc.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specials & Evening Pricing */}
        <div className="border border-white/5 bg-[#020202] rounded-sm overflow-hidden p-6 md:p-10 space-y-6">
          <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest border-b border-mafia-gold/20 pb-4">
            {lang === 'cs' ? 'Večerní a speciální tarify' : 'Evening & Special Tariffs'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specials.map((spec, i) => (
              <div key={i} className="flex items-start justify-between p-4 border border-mafia-gold/10 bg-black/40 hover:border-mafia-gold/30 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-white uppercase tracking-wider text-sm">{spec.name}</h4>
                  <p className="text-xs text-white/50 font-sans leading-relaxed">{spec.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-mafia-gold font-heading font-black text-lg">{spec.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rich SEO Article Section */}
        <article className="border border-white/5 p-8 md:p-12 bg-black/60 rounded-sm font-sans space-y-6 text-sm text-white/70 leading-relaxed">
          <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest">
            {lang === 'cs' ? 'Jak fungují ceny v našem pánském holičství v Uherském Hradišti?' : 'How does pricing work in our men\'s barbershop in Uherské Hradiště?'}
          </h3>
          <p>
            {lang === 'cs' ? (
              <>
                Hledáte-li <strong>nejlevnější pánský střih v Uherském Hradišti</strong>, pravděpodobně narazíte na řadu běžných salonů. 
                V <strong>MMBARBER (čtvrť Mařatice)</strong> však věříme v absolutní transparentnost. Naše ceny jsou nastaveny férově podle 
                času, který vašemu stylu věnujeme. Ceník začíná na <strong>100 Kč</strong> za rychlou pětiminutovou úpravu kontur a detailů, 
                pokračuje přes expresní a základní střihy pro dospělé i děti, až po kompletní péči o vlasy a vousy s Hot Towel rituálem za <strong>650 Kč</strong>. 
                Náš nejoblíbenější hodinový relaxační balíček <strong>Premium Kombo</strong> pořídíte za <strong>1 000 Kč</strong>. 
                Díky tomu platíte přesně za to, co potřebujete – poctivou práci špičkového barbera, prémiovou péči a stoprocentní soustředění bez spěchu.
              </>
            ) : (
              <>
                If you are looking for the <strong>most affordable men\'s haircut in Uherské Hradiště</strong>, you might find many typical salons. 
                At <strong>MMBarber (located in Mařatice)</strong>, we believe in absolute transparency. Our prices are set fairly based on the 
                exact time dedicated to your look. The price list starts at <strong>100 CZK</strong> for a quick 5-minute contour adjustment, 
                goes through express and basic trims for adults and children, up to complete care for both hair and beard with a Hot Towel ritual for <strong>650 CZK</strong>. 
                Our highly popular 1-hour relaxing package, <strong>Premium Combo</strong>, is available for <strong>1,000 CZK</strong>. 
                This guarantees you pay strictly for what you receive – honest work of a master barber, premium grooming, and full focus without rushing.
              </>
            )}
          </p>

          <p>
            {lang === 'cs' ? (
              <>
                Naše služby vyhledávají klienti nejen z <strong>Uherského Hradiště, Kunovic a Starého Města</strong>, ale dojíždějí k nám 
                singles i podnikatelé ze <strong>Zlína, Hodonína, Uherského Brodu a Veselí nad Moravou</strong>. Pro ty, kteří mají 
                extrémně nabitý program, nabízíme také exkluzivní večerní střihy od 18:00 do 20:00 (za ceny od 1 300 Kč po 2 500 Kč), 
                které lze rezervovat po předchozí individuální domluvě. Ceník je plně optimalizován pro region Slovácka, abychom přinášeli 
                prvotřídní světovou kvalitu za dostupné ceny pro každého muže, který chce vypadat skvěle a reprezentovat svou osobnost.
              </>
            ) : (
              <>
                Our services are sought after by clients not only from <strong>Uherské Hradiště, Kunovice, and Staré Město</strong>, but also from 
                <strong>Zlín, Hodonín, Uherský Brod, and Veselí nad Moravou</strong>. For those with extremely busy schedules, we also offer 
                exclusive evening cuts from 18:00 to 20:00 (ranging from 1,300 CZK to 2,500 CZK), which can be booked by prior individual arrangement. 
                Our price list is fully optimized for the Slovácko region, delivering world-class premium quality at highly competitive rates 
                for every man who wants to look his absolute best.
              </>
            )}
          </p>
        </article>

        {/* Structured FAQ with Schema Org Markup */}
        <div itemScope itemType="https://schema.org/FAQPage" className="border border-white/5 p-8 md:p-12 bg-[#020202] rounded-sm space-y-8">
          <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-wider text-center flex items-center justify-center gap-3">
            <Info className="text-mafia-gold animate-bounce" size={20} />
            <span>{lang === 'cs' ? 'Časté dotazy k našim cenám a objednávání' : 'FAQ About Our Prices and Booking'}</span>
          </h3>

          <div className="space-y-6 divide-y divide-white/5">
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-4">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Kolik stojí rychlá patnáctiminutová úprava vlasů (Quick Fade)?' : 'How much does a quick 15-minute haircut (Quick Fade) cost?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Naše patnáctiminutová služba Quick Fade stojí přesně 250 Kč. Je ideální pro rychlý buzzcut, srovnání stran nebo jednoduchou úpravu strojkem bez zbytečného zdržování.'
                    : 'Our 15-minute Quick Fade service costs exactly 250 CZK. It is perfect for a quick buzzcut, side alignment, or a simple clipper trim without any delays.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Jaké platební metody v salonu MMBARBER akceptujete?' : 'What payment methods do you accept at MMBarber?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Přijímáme hotovost a pohodlné okamžité QR platby přes vaše mobilní bankovnictví. Tradiční platební terminál v salonu nemáme, ale QR kód vygenerujeme přímo u křesla během několika sekund.'
                    : 'We accept cash and convenient instant QR code payments via your mobile banking. We do not have a traditional card terminal, but we generate the QR code directly at the chair within seconds.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Funguje u vás dynamická cenotvorba?' : 'Do you use dynamic pricing?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Ano, v rezervačním systému máme integrovanou férovou dynamickou cenotvorbu. O víkendech a státních svátcích nebo ve večerních hodinách po 18:00 se k základní ceně připočítává drobný příplatek za provoz (od +10 % do +100 % u svátků). Všechny sazby vidíte přehledně předem v našem rezervačním rozhraní.'
                    : 'Yes, we have integrated a fair dynamic pricing system into our booking portal. On weekends, public holidays, or during evening hours after 18:00, a small operational surcharge is added (ranging from +10% to +100% on holidays). You see all rates clearly in advance in our reservation interface.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Keywords Block */}
        <div className="p-10 border border-mafia-gold/20 bg-black/80 flex flex-col items-center text-center rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] font-black">PRICING_INTELLIGENCE_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {lang === 'cs'
              ? 'Ceník barbershop Uherské Hradiště, pánské stříhání cena UH, levný pánský střih Slovácko, kolik stojí skin fade, úprava vousů ceny Mařatice, dárkové poukazy holičství, Hot Towel holení Hradiště, pánský kadeřník Zlín, barber Kunovice ceník, MM_PRICING_SECURE_PROTOCOL.'
              : 'Price list barbershop Uherské Hradiště, men\'s haircut price UH, cheap men\'s cut Slovácko, skin fade cost, beard trim prices Mařatice, gift vouchers barbershop, Hot Towel shaving Hradiště, men\'s hairdresser Zlín, barber Kunovice price list, MM_PRICING_SECURE_PROTOCOL.'}
          </p>
        </div>

        {/* Footer Brand Accent */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="h-px w-24 bg-mafia-gold/20" />
          <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] text-center leading-relaxed">
            MMBARBER © 2026 // PRICING DATABASE SYSTEM // UH UHERSKÉ HRADIŠTĚ
          </p>
        </div>
      </div>
    </div>
  );
}
