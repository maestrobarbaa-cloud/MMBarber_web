"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, HelpCircle, Search, Database, Lock } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function VoucherSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "PROTOKOL DÁRKOVÝCH SYSTÉMŮ",
      subtitle: "STRUKTUROVANÁ DATA A ČASTÉ DOTAZY",
      faq: [
        {
          q: "Proč zvolit dárkový voucher MM BARBER?",
          a: "Naše vouchery nejsou jen papír. Jsou to vstupenky do světa preciznosti. Každý voucher je dárkově balen v prémiové obálce s ručně dělanou pečetí, což z něj činí vizuálně i hmatově výjimečný dar."
        },
        {
          q: "Je možné voucher uplatnit i na produkty?",
          a: "Primárně jsou vouchery určeny na naše služby (střih, holení, péče). Po individuální dohodě v salonu je však lze využít i na nákup prémiové pánské kosmetiky z naší nabídky."
        },
        {
          q: "Co se stane, pokud platnost voucheru vyprší?",
          a: "Standardní platnost je 12 měsíců. Tato doba je dostatečná pro naplánování návštěvy. Po vypršení systém kód automaticky deaktivuje. Doporučujeme rezervaci termínu alespoň 14 dní před koncem platnosti."
        },
        {
          q: "Může voucher využít i jiná osoba než ta, pro kterou byl koupen?",
          a: "Ano, naše vouchery jsou přenosné. Pokud ho nemůžete využít sami, můžete ho darovat dál. Důležité je pouze předložení fyzického voucheru nebo unikátního kódu při placení."
        }
      ],
      keywords: "Dárkový poukaz Uherské Hradiště, luxusní dárek pro muže, voucher na holení, MM BARBER dárkové balení, vánoční dárek Slovácko, barbershop zážitek, pánská kosmetika dárek."
    },
    en: {
      title: "GIFT SYSTEM PROTOCOL",
      subtitle: "STRUCTURED DATA & FAQ",
      faq: [
        {
          q: "Why choose an MM BARBER gift voucher?",
          a: "Our vouchers aren't just paper. They are tickets to a world of precision. Each voucher is gift-wrapped in a premium envelope with a handmade seal, making it a visually and tactilely exceptional gift."
        },
        {
          q: "Can the voucher be used for products?",
          a: "Vouchers are primarily intended for our services (haircut, shaving, care). However, after individual agreement in the salon, they can also be used to purchase premium men's cosmetics from our range."
        },
        {
          q: "What happens if the voucher expires?",
          a: "Standard validity is 12 months. This time is sufficient for planning a visit. After expiration, the system automatically deactivates the code. We recommend booking an appointment at least 14 days before expiration."
        },
        {
          q: "Can the voucher be used by someone other than the purchaser?",
          a: "Yes, our vouchers are transferable. If you can't use it yourself, you can give it to someone else. The only thing that matters is presenting the physical voucher or unique code at checkout."
        }
      ],
      keywords: "Gift voucher Uherské Hradiště, luxury gift for men, shaving voucher, MM BARBER gift packaging, Christmas gift Slovácko, barbershop experience, men's cosmetics gift."
    }
  };

  const content = lang === 'en' ? data.en : data.cs;

  return (
    <div className="w-full bg-[#030303] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.02)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4 italic">
            {content.title}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-mafia-gold/30"></div>
            <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.6em]">{content.subtitle}</p>
            <div className="h-px w-12 bg-mafia-gold/30"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {content.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.01] border border-white/5 hover:border-mafia-gold/20 transition-all group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center text-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all shrink-0">
                  <HelpCircle size={18} />
                </div>
                <h3 className="text-white font-heading font-bold text-xl uppercase tracking-widest italic leading-tight">
                  {item.q}
                </h3>
              </div>
              <p className="text-smoke-white/50 text-sm leading-relaxed font-sans pl-14">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-10 border-2 border-dashed border-mafia-gold/10 bg-black/60 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <Search size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">INDEXED_DATA_NODES</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} • {content.keywords} • {content.keywords}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-6 flex items-center gap-3 opacity-20">
        <Database size={12} className="text-mafia-gold" />
        <span className="font-mono text-[8px] text-white uppercase tracking-widest italic">MM_VOUCHER_SEO_SECURED</span>
      </div>
    </div>
  );
}
