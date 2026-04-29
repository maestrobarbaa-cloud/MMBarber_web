"use client";

import { motion } from "framer-motion";
import { MapPin, ChevronLeft, Navigation, Car, Clock } from "lucide-react";
import Link from "next/link";

const CITIES = [
  { name: "Zlín", dist: "25 min", color: "from-mafia-gold/20 to-transparent" },
  { name: "Uherský Brod", dist: "15 min", color: "from-white/10 to-transparent" },
  { name: "Veselí n. M.", dist: "15 min", color: "from-white/10 to-transparent" },
  { name: "Hodonín", dist: "35 min", color: "from-mafia-gold/20 to-transparent" },
  { name: "Kyjov", dist: "30 min", color: "from-white/10 to-transparent" },
  { name: "Luhačovice", dist: "30 min", color: "from-white/10 to-transparent" },
  { name: "Napajedla", dist: "15 min", color: "from-mafia-gold/20 to-transparent" },
  { name: "Otrokovice", dist: "20 min", color: "from-white/10 to-transparent" }
];

const VILLAGES = [
  "Staré Město", "Kunovice", "Jarošov", "Buchlovice", "Hluk", "Uherský Ostroh", 
  "Ostrožská Nová Ves", "Babice", "Huštěnovice", "Spytihněv", "Topolná", 
  "Bílovice", "Kněžpole", "Mistřice", "Nedachlebice", "Březolupy", "Zlámanec",
  "Svárov", "Částkov", "Kelníky", "Velký Ořechov", "Doubravy", "Hřivínův Újezd",
  "Biskupice", "Ludkovice", "Pozlovice", "Dolní Lhota", "Sehradice", "Slavičín"
];

export default function RegionSlovackoPage() {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Zpět na centrálu
        </Link>

        <header className="mb-24">
          <div className="flex items-center gap-4 mb-8">
             <MapPin size={32} className="text-mafia-gold" />
             <h1 className="text-5xl md:text-8xl font-heading font-black uppercase tracking-tighter">
               REGION <span className="text-mafia-gold italic">SLOVÁCKO</span>
             </h1>
          </div>
          <p className="text-xl font-sans italic text-smoke-white/60 max-w-3xl leading-relaxed">
            MM BARBER v Mařaticích je centrálním bodem pro muže z celého Slovácka i přilehlého Zlínska. 
            Nezáleží na tom, jestli jedete z centra Zlína nebo z malé vísky u Buchlova – u nás máte své místo a svůj klid.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
           {CITIES.map((city, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className={`p-8 bg-gradient-to-br ${city.color} border border-white/5 group hover:border-mafia-gold/30 transition-all`}
             >
                <h3 className="text-lg font-heading font-black uppercase mb-2">{city.name}</h3>
                <div className="flex items-center gap-2 text-mafia-gold/60 text-[10px] font-mono">
                   <Clock size={10} />
                   <span>DOSTUPNOST: {city.dist}</span>
                </div>
             </motion.div>
           ))}
        </div>

        <section className="mb-32">
           <div className="flex items-center gap-4 mb-12">
              <Navigation size={24} className="text-mafia-gold" />
              <h2 className="text-2xl font-heading font-black uppercase tracking-widest">Spádové oblasti & Obce</h2>
           </div>
           <div className="flex flex-wrap gap-x-8 gap-y-4 opacity-40 hover:opacity-100 transition-opacity">
              {VILLAGES.map((v, i) => (
                <span key={i} className="text-xs font-mono uppercase tracking-widest hover:text-mafia-gold cursor-default transition-colors">
                  {v}
                </span>
              ))}
           </div>
           <p className="mt-12 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] max-w-2xl leading-relaxed">
              Poskytujeme služby pánského holičství a úpravy vousů pro klienty z výše uvedených lokalit. 
              Většina našich stálých zákazníků využívá výhodné polohy v Uherském Hradišti – Mařaticích 
              s bezplatným parkováním a online rezervací, která šetří čas lidem z celého kraje.
           </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/[0.02] border border-white/5 p-12">
           <div>
              <Car size={40} className="text-mafia-gold mb-6" />
              <h3 className="text-2xl font-heading font-black uppercase mb-4">Proč vážit cestu?</h3>
              <ul className="space-y-4 text-sm text-smoke-white/60 italic">
                 <li>• Žádné hledání parkování v centrech velkých měst (Zlín, Hodonín).</li>
                 <li>• Klidná rezidenční čtvrť Mařatice – soukromí zaručeno.</li>
                 <li>• Možnost platit QR kódem nebo hotovostí.</li>
                 <li>• Atmosféra soukromého klubu, kterou v "kadeřnictví na náměstí" nezažijete.</li>
              </ul>
           </div>
           <div className="flex flex-col justify-center items-center md:items-end">
              <p className="text-right text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] mb-6">Naplánujte si svou misi dnes.</p>
              <Link 
                href="https://is.mmbarber.cz/" 
                target="_blank"
                className="bg-mafia-gold text-mafia-black px-10 py-4 font-heading font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)]"
              >
                REZERVOVAT TERMÍN
              </Link>
           </div>
        </div>
      </div>

      <div className="fixed right-6 bottom-6 flex flex-col gap-2 items-end z-0 opacity-5 pointer-events-none">
         <span className="text-[8px] font-mono uppercase tracking-[0.5em]">REGIONAL_HUBS: ZLIN_BROD_VESELI_HODONIN_KYJOV</span>
         <span className="text-[8px] font-mono uppercase tracking-[0.5em]">VILLAGE_SYNC: STARAK_KUNOSE_BUCHLOV_HLUK</span>
      </div>
    </main>
  );
}
