"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, HelpCircle, ChevronDown, Search, Info } from "lucide-react";
import Link from "next/link";

const FAQ_DATA = [
  {
    q: "Kde v Uherském Hradišti nejlépe zaparkuji u barbershopu?",
    a: "MM BARBER se nachází v Mařaticích, kde je parkování naprosto bezproblémové. Přímo před naším podnikem nebo v bezprostřední blízkosti najdete dostatek parkovacích míst zdarma, což je velká výhoda oproti centru UH."
  },
  {
    q: "Jaký je rozdíl mezi pánským kadeřnictvím a barbershopem v UH?",
    a: "Tradiční kadeřnictví se zaměřuje spíše na střih vlasů. Barbershop jako MM BARBER nabízí komplexní pánský servis včetně úpravy vousů břitvou, napařování horkým ručníkem a specifických technik jako skin fade, vše v atmosféře pánského klubu."
  },
  {
    q: "Musím se k barberovi objednávat dopředu?",
    a: "Doporučujeme rezervaci v našem online systému is.mmbarber.cz. Díky tomu máte jistotu konkrétního času a naši plnou pozornost. Pokud jdete kolem a máme volno, rádi vás vezmeme, ale v Uherském Hradišti bývají termíny rychle obsazené."
  },
  {
    q: "Co je to skin fade a dělají ho v MM BARBER?",
    a: "Skin fade je moderní technika střihu, kde vlasy postupně přecházejí z úplné nuly (kůže) do delších délek. V MM BARBER je to jedna z našich nejoblíbenějších a nejpreciznějších disciplín."
  },
  {
    q: "Jak pečovat o vousy mezi návštěvami barbershopu?",
    a: "Základem je hydratace. Doporučujeme používat kvalitní oleje na vousy pro pokožku a balzámy pro tvar. V naší sekci Systém a návštěva najdete detailní sezónní tipy pro péči o vousy i vlasy."
  },
  {
    q: "Nabízíte dárkové poukazy pro muže?",
    a: "Ano, dárkový poukaz do MM BARBER je oblíbeným dárkem v celém Uherském Hradišti. Lze jej zakoupit přímo u nás v Mařaticích a obdarovaný si pak sám vybere termín své proměny."
  },
  {
    q: "Kolik času zabere kompletní úprava vlasů a vousů?",
    a: "Standardní časový blok pro komplexní servis je cca 60 minut. V MM BARBER klademe důraz na kvalitu, nikoliv na kvantitu, takže každému klientovi věnujeme maximum soustředění."
  },
  {
    q: "Bolí holení břitvou?",
    a: "Vůbec ne. Díky technice napařování horkým ručníkem (hot towel) se vousy i pokožka změkčí a břitva po tváři jen lehce klouže. Je to velmi relaxační zážitek."
  },
  {
    q: "Je MM BARBER vhodný i pro děti?",
    a: "Ano, stříháme i mladé džentlmeny. V Uherském Hradišti jsme vyhledávaní rodiči, kteří chtějí pro své syny moderní a precizní střih v přátelské atmosféře."
  },
  {
    q: "Kde najdu ceník služeb?",
    a: "Kompletní ceník je dostupný přímo v našem rezervačním systému. Ceny jsou transparentní a odpovídají kvalitě použitých materiálů a času, který vám věnujeme."
  }
];

const MONTHLY_FAQS = [
  { month: 0, q: "Jak chránit vlasy před mrazem v UH?", a: "V lednu doporučujeme hutnější balzámy a oleje. Mráz v Mařaticích dokáže pokožku nepříjemně vysušit." },
  { month: 1, q: "Valentýnská příprava: Kdy se objednat?", a: "Únor je plný termínů, doporučujeme rezervaci alespoň 14 dní dopředu, abyste na svátek zamilovaných vypadali ostře." },
  { month: 2, q: "Jarní očista pokožky hlavy", a: "V březnu doporučujeme peeling pod vousy a lehčí šampony pro odstranění zbytků zimní péče." },
  { month: 3, q: "Velikonoční otevírací doba v MM BARBER", a: "Sledujte náš rezervační systém, kde jsou vždy aktuální sváteční termíny pro naše klienty ze Slovácka." },
  { month: 4, q: "Příprava na svatební sezónu v UH", a: "Květen je časem svateb. Nabízíme kompletní servis pro ženichy včetně úpravy kontur břitvou." },
  { month: 5, q: "Letní ochrana před UV zářením", a: "V červnu naskladňujeme produkty s UV filtrem, aby vaše barva i vlasy pod hradišťským sluncem netrpěly." },
  { month: 6, q: "Osvěžení po návštěvě aquaparku", a: "Červenec je o smývání chlóru. Poradíme vám, jakou kosmetiku zvolit pro regeneraci po koupání." },
  { month: 7, q: "Styling pro Slovácké slavnosti vína", a: "V srpnu ladíme formu na největší slavnosti v regionu. Buďte nejlépe upraveným mužem v davu." },
  { month: 8, q: "Zářijový návrat do práce ve stylu", a: "Po prázdninách je čas na radikální změnu nebo osvěžení vašeho fade střihu." },
  { month: 9, q: "Říjnové pěstování plnovousu", a: "Chladnější dny přejí delším vousům. Pomůžeme vám s jejich symetrií a tvarem." },
  { month: 10, q: "Movember: Jak nechat narůst knír?", a: "V listopadu radíme, jak na první kroky s knírem a jakou zvolit údržbu." },
  { month: 11, q: "Vánoční provoz a dárky na poslední chvíli", a: "Prosinec je o poukazech a dárkových sadách profesionální kosmetiky, které u nás v UH seženete." }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [currentMonthFAQ, setCurrentMonthFAQ] = useState<any>(null);

  useEffect(() => {
    const month = new Date().getMonth();
    setCurrentMonthFAQ(MONTHLY_FAQS.find(f => f.month === month));
  }, []);

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,15,1)_0%,rgba(0,0,0,1)_100%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Zpět na centrálu
        </Link>

        <header className="mb-20 text-center">
          <div className="inline-block p-3 bg-mafia-gold/10 border border-mafia-gold/20 mb-6">
            <HelpCircle size={32} className="text-mafia-gold" />
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tight mb-6">
            ČASTO KLADENÉ <span className="text-mafia-gold italic">DOTAZY</span>
          </h1>
          <p className="text-smoke-white/40 font-mono text-xs uppercase tracking-[0.4em]">Knowledge Base V3.3 | Uherské Hradiště</p>
        </header>

        {/* Monthly Highlight FAQ */}
        <AnimatePresence mode="wait">
          {currentMonthFAQ && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12 p-8 bg-mafia-gold/5 border border-mafia-gold/30 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Info size={40} className="text-mafia-gold" />
              </div>
              <h3 className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.5em] mb-4 font-black italic">Aktuální téma měsíce</h3>
              <h4 className="text-xl font-heading font-bold text-white mb-4 uppercase">{currentMonthFAQ.q}</h4>
              <p className="text-sm text-smoke-white/70 italic leading-relaxed">{currentMonthFAQ.a}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 mb-24">
          {FAQ_DATA.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-white/5 bg-mafia-dark/20 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.02] transition-colors group"
              >
                <span className="font-heading font-bold uppercase tracking-widest text-sm md:text-base group-hover:text-mafia-gold transition-colors">
                  {faq.q}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-mafia-gold transition-transform duration-500 ${openIdx === idx ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="p-6 pt-0 border-t border-white/5 text-smoke-white/60 text-sm md:text-base leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 border-t border-white/5">
           <div className="p-8 border border-mafia-gold/10 hover:border-mafia-gold/40 transition-colors">
              <h3 className="text-mafia-gold font-heading font-black uppercase mb-4 tracking-widest text-sm">Další SEO zdroje</h3>
              <ul className="space-y-3 text-[10px] font-mono uppercase tracking-widest opacity-40">
                <li><Link href="/zapisnik" className="hover:text-mafia-gold transition-colors">Měsíční Kronika</Link></li>
                <li><Link href="/fade-gallery" className="hover:text-mafia-gold transition-colors">Fade Databáze</Link></li>
                <li><Link href="/barbershop-uherske-hradiste" className="hover:text-mafia-gold transition-colors">Lokalita UH</Link></li>
              </ul>
           </div>
           <div className="flex flex-col justify-center items-center md:items-end">
              <p className="text-[10px] font-mono text-smoke-white/20 uppercase tracking-[0.4em] mb-4 text-right">
                Nenašli jste odpověď? Kontaktujte nás přímo nebo navštivte náš private club v Mařaticích.
              </p>
              <Link 
                href="/#kontakt" 
                className="text-mafia-gold font-heading font-black uppercase tracking-[0.2em] text-sm underline decoration-mafia-gold/20 hover:decoration-mafia-gold transition-all"
              >
                KONTAKTNÍ ÚDAJE →
              </Link>
           </div>
        </div>
      </div>

      <div className="fixed right-6 top-1/2 -rotate-90 origin-right text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        FAQ_DATABASE_SYNC_SEO_ACTIVE
      </div>
    </main>
  );
}
