import Link from "next/link";
import { 
  ShieldCheck, 
  User, 
  Database, 
  Target, 
  Scale, 
  Calendar, 
  Users, 
  Lock, 
  Cookie 
} from "lucide-react";

export const metadata = {
  title: "Ochrana osobních údajů | MMBARBER",
  description: "Zásady ochrany osobních údajů a nakládání s vašimi daty v rámci naší rodiny.",
};

export default function OchranaOsobnichUdaju() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-mafia-black text-smoke-white">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <ShieldCheck size={48} className="text-mafia-gold mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold mb-4 tracking-widest uppercase">
            Omerta & Soukromí
          </h1>
          <div className="w-24 h-1 bg-mafia-red mx-auto mb-6"></div>
          <p className="font-sans text-smoke-white/60 tracking-widest uppercase text-sm">Zásady ochrany osobních údajů</p>
        </div>

        <div className="bg-mafia-dark/30 border border-mafia-gold/20 p-8 md:p-12 font-sans text-smoke-white/80 leading-relaxed space-y-12">
          
          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-mafia-gold/10">
            <div className="md:col-span-1">
              <h2 className="text-xl font-heading font-bold text-mafia-gold uppercase mb-4 flex items-center gap-2">
                <User size={20} /> 1. Správce
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
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Database size={24} className="text-mafia-gold" /> 2. Jaké údaje zpracováváme
            </h2>
            <p>Zpracováváme zejména tyto osobní údaje:</p>
            <ul className="list-disc pl-8 space-y-1 text-mafia-gold font-bold">
              <li>jméno a příjmení</li>
              <li>telefonní číslo</li>
              <li>e-mailová adresa</li>
              <li>údaje o rezervacích služeb</li>
            </ul>
            <p className="text-sm italic opacity-70">Případně komunikace se zákazníkem (např. zprávy, poznámky k objednávkám).</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Target size={24} className="text-mafia-gold" /> 3. Účely zpracování
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-mafia-red"></div> Vyřízení objednávky a rezervace</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-mafia-red"></div> Komunikace se zákazníkem</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-mafia-red"></div> Plnění smlouvy</li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-mafia-red"></div> Vedení evidence zákazníků</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-mafia-red"></div> Plnění právních povinností</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Scale size={24} className="text-mafia-gold" /> 4. Právní základ
            </h2>
            <p className="text-sm italic border-l-2 border-mafia-gold pl-4 py-2 bg-mafia-gold/5">
              Zpracování probíhá na základě plnění smlouvy, plnění právních povinností, oprávněného zájmu správce nebo případného souhlasu (např. marketing). Vše v souladu s příslušnými články GDPR.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Calendar size={24} className="text-mafia-gold" /> 5. Doba uchování údajů
            </h2>
            <div className="space-y-3">
              <p>Osobní údaje uchováváme po dobu trvání smluvního vztahu a po dobu nezbytnou k plnění právních povinností (např. účetnictví).</p>
              <p className="text-mafia-red font-bold">Maximálně po dobu 3 let od poslední návštěvy, pokud neexistuje jiný právní důvod.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Users size={24} className="text-mafia-gold" /> 6. Komu mohou být údaje zpřístupněny
            </h2>
            <p>Osobní údaje mohou být zpřístupněny pouze těmto prověřeným kumpánům:</p>
            <ul className="list-disc pl-8 space-y-1 italic text-sm opacity-80">
              <li>poskytovatelům rezervačních systémů</li>
              <li>účetním a daňovým poradcům</li>
              <li>poskytovatelům IT služeb</li>
            </ul>
            <p className="text-xs border border-mafia-gold/10 p-3 mt-4">
              Tyto subjekty zpracovávají údaje pouze v nezbytném rozsahu k zajištění chodu naší organizace.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Lock size={24} className="text-mafia-gold" /> 7. Práva subjektu údajů
            </h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <p>• Právo na přístup ke svým údajům</p>
              <p>• Právo na opravu nepřesných údajů</p>
              <p>• Právo na výmaz („právo být zapomenut“)</p>
              <p>• Právo na omezení zpracování</p>
              <p>• Právo vznést námitku proti zpracování</p>
              <p>• Právo na přenositelnost údajů</p>
            </div>
            <p className="pt-4 text-xs opacity-60 italic">
              Zákazník má rovněž právo podat stížnost u Úřadu pro ochranu osobních údajů.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <ShieldCheck size={24} className="text-mafia-gold" /> 8. Zabezpečení údajů
            </h2>
            <p>
              Správce přijal vhodná technická a organizační opatření k zabezpečení osobních údajů proti zneužití, ztrátě nebo neoprávněnému přístupu. Naše bezpečnostní protokoly jsou přísné.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Cookie size={24} className="text-mafia-gold" /> 9. Cookies
            </h2>
            <p>
              Informace o používání cookies jsou uvedeny v samostatném dokumentu <span className="text-mafia-gold italic">„Zásady používání cookies“</span>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">10. Závěrečná ustanovení</h2>
            <p>
              Tyto zásady mohou být aktualizovány. Aktuální verze je vždy dostupná na našich webových stránkách.
            </p>
            <div className="pt-8 text-right italic text-sm opacity-60">
              <p>V Uherském Hradišti dne 1.4.2026</p>
              <p className="font-heading font-bold text-smoke-white text-lg mt-2">MMBARBER</p>
            </div>
          </section>

        </div>

        <div className="mt-12 text-center flex flex-col gap-4 items-center">
          <Link href="/" className="text-mafia-gold/60 hover:text-mafia-gold font-sans uppercase tracking-widest text-sm border-b border-mafia-gold/30 hover:border-mafia-gold transition-colors pb-1">
            Zpět na ústředí
          </Link>
          <p className="text-smoke-white/20 text-[10px] font-sans mt-8 uppercase tracking-widest">
            Soukromí je výsada, kterou v MMBARBER ctíme.
          </p>
        </div>

      </div>
    </div>
  );
}
