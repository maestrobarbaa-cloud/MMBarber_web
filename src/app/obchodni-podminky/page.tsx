import Link from "next/link";
import { ScrollText, ShieldCheck, CreditCard, Clock, AlertTriangle, Gift, Info } from "lucide-react";

export const metadata = {
  title: "Obchodní podmínky | MMBARBER",
  description: "Vše, co potřebujete vědět o poskytování našich služeb.",
};

export default function ObchodniPodminky() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-mafia-black text-smoke-white">

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <ScrollText size={48} className="text-mafia-gold mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold mb-4 tracking-widest uppercase">
            Smlouva s Rodinou
          </h1>
          <div className="w-24 h-1 bg-mafia-red mx-auto mb-6"></div>
          <p className="font-sans text-smoke-white/60 tracking-widest uppercase text-sm">Obchodní podmínky poskytování služeb</p>
        </div>

        <div className="bg-mafia-dark/30 border border-mafia-gold/20 p-8 md:p-12 font-sans text-smoke-white/80 leading-relaxed space-y-12">

          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-mafia-gold/10">
            <div className="md:col-span-1">
              <h2 className="text-xl font-heading font-bold text-mafia-gold uppercase mb-4 flex items-center gap-2">
                <ShieldCheck size={20} /> 1. Identifikace
              </h2>
            </div>
            <div className="md:col-span-2 space-y-2 text-sm md:text-base">
              <p className="font-bold text-smoke-white text-lg">MMBARBER</p>
              <p>Tomáš Mička</p>
              <p>IČO: 10862994</p>
              <p>Sadová 1383, 686 05 Uherské Hradiště 5</p>
              <p className="pt-2 text-mafia-gold font-mono tracking-wider">TEL: +420 577 544 073</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">2. Úvodní ustanovení</h2>
            <p>
              Tyto obchodní podmínky upravují práva a povinnosti mezi poskytovatelem a zákazníkem (dále jen „klient“) při poskytování služeb péče o vlasy a vousy.
            </p>
            <p>
              Právní vztahy se řídí zejména zákonem č. 89/2012 Sb., občanský zákoník.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">3. Objednávky a uzavření smlouvy</h2>
            <p>
              K uzavření smlouvy o poskytnutí služby dochází potvrzením rezervace termínu (osobně, telefonicky nebo online).
            </p>
            <ul className="list-disc pl-5 space-y-2 italic opacity-90 text-sm">
              <li>Klient je povinen uvádět pravdivé údaje.</li>
              <li>Poskytovatel si vyhrazuje právo objednávku odmítnout.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <CreditCard size={24} className="text-mafia-gold" /> 4. Cena služeb a platební podmínky
            </h2>
            <p>
              Ceny jsou uvedeny v aktuálním ceníku v provozovně nebo online. Cena je konečná (není-li uvedeno jinak).
            </p>
            <p className="bg-mafia-red/10 border-l-2 border-mafia-red p-4 italic">
              Platba probíhá po poskytnutí služby v hotovosti nebo bezhotovostně (pokud je umožněno).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Clock size={24} className="text-mafia-gold" /> 5. Storno podmínky
            </h2>
            <div className="space-y-3">
              <p>Klient je oprávněn rezervaci zrušit nejpozději <span className="text-mafia-red font-bold">2 hodiny</span> před sjednaným termínem.</p>
              <p>Při pozdějším zrušení nebo nedostavení se je poskytovatel oprávněn požadovat storno poplatek až do výše 100 % ceny objednané služby.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm opacity-80">
                <li>Poskytovatel může požadovat úhradu storno poplatku před další rezervací.</li>
                <li>V případě opakovaného porušení si poskytovatel vyhrazuje právo odmítnout další služby.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <AlertTriangle size={24} className="text-mafia-red" /> 6. Pozdní příchod klienta
            </h2>
            <p>Klient je povinen dostavit se na sjednaný termín včas. Při zpoždění delším než <span className="font-bold">15 minut</span> může být služba:</p>
            <ul className="list-disc pl-8 space-y-1 font-bold text-mafia-gold">
              <li>zkrácena,</li>
              <li>nebo zrušena bez nároku na náhradní termín.</li>
            </ul>
            <p className="text-sm opacity-70">V takovém případě může být účtována plná cena služby.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">7. Práva z vadného plnění (reklamace)</h2>
            <p>Poskytovatel odpovídá za to, že služba je provedena řádně a bez vad.</p>
            <p>Klient je povinen uplatnit reklamaci bez zbytečného odkladu, nejpozději ihned po poskytnutí služby. Pozdější reklamace nemusí být uznány, pokud vadu nebylo možné zjistit ihned.</p>
            <p className="text-sm border border-mafia-gold/10 p-4">
              Reklamace bude vyřízena bez zbytečného odkladu, nejpozději do 5 dnů. V případě uznané reklamace má klient právo na bezplatnou nápravu služby nebo přiměřenou slevu.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">8. Zdravotní stav klienta</h2>
            <p>
              Klient je povinen informovat poskytovatele o zdravotních omezeních (např. alergie, kožní onemocnění).
            </p>
            <p className="text-mafia-red/80 italic text-sm">
              Poskytovatel nenese odpovědnost za škody vzniklé v důsledku zatajení těchto skutečností.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Gift size={24} className="text-mafia-gold" /> 9. Dárkové poukazy
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <p>Poukaz lze vystavit jako hodnotový (na konkrétní částku), která může být čerpána jednorázově nebo postupně.</p>
                <p><span className="text-mafia-gold">Platnost poukazu:</span> 12 měsíců ode dne zakoupení. Po uplynutí doby poukaz bez náhrady zaniká.</p>
                <p>Poukaz nelze směnit za hotovost ani jinou formu finančního plnění.</p>
              </div>
              <div className="space-y-3 bg-mafia-black/40 p-4 border border-mafia-gold/5">
                <p>Na rezervace z poukazu se vztahují storno podmínky. Při pozdním zrušení může být hodnota odečtena.</p>
                <p>Pokud cena služby převyšuje hodnotu poukazu, klient rozdíl doplatí. Zbývající částka zůstává k dalšímu využití.</p>
                <p className="font-bold opacity-60">Poukaz je přenosný.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Info size={24} className="text-mafia-gold" /> 10. Ochrana osobních údajů (GDPR)
            </h2>
            <p>Poskytovatel zpracovává osobní údaje klientů v rozsahu: <span className="text-mafia-gold">jméno, telefon, e-mail</span>. Účelem je správa rezervací a komunikace.</p>
            <p>Právním základem je plnění smlouvy dle čl. 6 odst. 1 písm. b) GDPR. Údaje nejsou poskytovány třetím stranám.</p>
            <p className="text-sm italic">Klient má právo na přístup, opravu a výmaz údajů.</p>
          </section>

        </div>

        <div className="mt-12 text-center flex flex-col gap-4 items-center">
          <Link href="/" className="text-mafia-gold/60 hover:text-mafia-gold font-sans uppercase tracking-widest text-sm border-b border-mafia-gold/30 hover:border-mafia-gold transition-colors pb-1">
            Zpět na ústředí
          </Link>
          <p className="text-smoke-white/20 text-xs font-sans mt-8 uppercase tracking-widest">
            MMBARBER &copy; {new Date().getFullYear()} – The Code is the Law
          </p>
        </div>

      </div>
    </div>
  );
}

