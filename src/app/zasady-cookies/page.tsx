import Link from "next/link";
import { 
  Cookie, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  Megaphone, 
  Scale, 
  Clock, 
  User,
  Info
} from "lucide-react";

export const metadata = {
  title: "Zásady používání cookies | MMBARBER",
  description: "Informace o tom, jak používáme cookies pro zajištění nejlepšího zážitku v naší rodině.",
};

export default function ZasadyCookies() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-mafia-black text-smoke-white">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Cookie size={48} className="text-mafia-gold mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold mb-4 tracking-widest uppercase">
            Digitální Stopy
          </h1>
          <div className="w-24 h-1 bg-mafia-red mx-auto mb-6"></div>
          <p className="font-sans text-smoke-white/60 tracking-widest uppercase text-sm">Zásady používání cookies</p>
        </div>

        <div className="bg-mafia-dark/30 border border-mafia-gold/20 p-8 md:p-12 font-sans text-smoke-white/80 leading-relaxed space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Info size={24} className="text-mafia-gold" /> 1. Co jsou cookies
            </h2>
            <p>
              Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě webových stránek. Pomáhají zajistit správné fungování webu, zapamatování nastavení a zlepšování uživatelského zážitku.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Settings size={24} className="text-mafia-gold" /> 2. Jaké cookies používáme
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-mafia-black/40 p-5 border border-mafia-gold/10 space-y-3">
                <ShieldCheck size={32} className="text-mafia-gold opacity-60" />
                <h3 className="font-bold text-smoke-white uppercase text-sm tracking-widest">Nezbytné</h3>
                <p className="text-xs opacity-70">
                  Nutné pro správné fungování webu. Nelze je vypnout. Umožňují navigaci a základní funkce.
                </p>
              </div>

              <div className="bg-mafia-black/40 p-5 border border-mafia-gold/10 space-y-3">
                <BarChart3 size={32} className="text-mafia-gold opacity-60" />
                <h3 className="font-bold text-smoke-white uppercase text-sm tracking-widest">Analytické</h3>
                <p className="text-xs opacity-70">
                  Pomáhají nám porozumět používání webu (např. Google Analytics). Používáme jen s vaším souhlasem.
                </p>
              </div>

              <div className="bg-mafia-black/40 p-5 border border-mafia-gold/10 space-y-3">
                <Megaphone size={32} className="text-mafia-gold opacity-60" />
                <h3 className="font-bold text-smoke-white uppercase text-sm tracking-widest">Marketingové</h3>
                <p className="text-xs opacity-70">
                  Pro zobrazování relevantní reklamy (např. Meta Platforms). Používáme jen s vaším souhlasem.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Scale size={24} className="text-mafia-gold" /> 3. Právní základ
            </h2>
            <ul className="space-y-2 text-sm italic">
              <li className="flex gap-2">
                <span className="text-mafia-gold font-bold">Nezbytné cookies:</span> na základě oprávněného zájmu správce.
              </li>
              <li className="flex gap-2">
                <span className="text-mafia-gold font-bold">Ostatní cookies:</span> pouze na základě vašeho souhlasu.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Cookie size={24} className="text-mafia-gold" /> 4. Jak můžete cookies ovlivnit
            </h2>
            <p>Používání cookies můžete kdykoliv změnit nebo odvolat:</p>
            <ul className="list-disc pl-8 space-y-2 font-bold text-mafia-gold text-sm underline decoration-mafia-gold/30">
              <li>prostřednictvím cookie lišty na webu</li>
              <li>ve svém internetovém prohlížeči</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2 flex items-center gap-3">
              <Clock size={24} className="text-mafia-gold" /> 5. Doba uchování
            </h2>
            <p className="text-sm">
              Cookies jsou ukládány po dobu nezbytně nutnou, maximálně po dobu stanovenou jednotlivými poskytovateli (obvykle několik měsíců až <span className="text-mafia-red font-bold underline">2 roky</span>).
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-mafia-gold/10">
            <div className="md:col-span-1">
              <h2 className="text-xl font-heading font-bold text-mafia-gold uppercase mb-4 flex items-center gap-2">
                <User size={20} /> 6. Správce údajů
              </h2>
            </div>
            <div className="md:col-span-2 space-y-1 text-sm">
              <p className="font-bold text-smoke-white">MMBARBER – Tomáš Mička</p>
              <p>IČO: 10862994</p>
              <p>Sadová 1383, 686 05 Uherské Hradiště 5</p>
              <p className="pt-2 text-mafia-gold font-mono">TEL: +420 577 544 073</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-smoke-white uppercase border-b border-mafia-gold/20 pb-2">7. Závěrečná ustanovení</h2>
            <p className="text-sm opacity-70 italic">
              Tyto zásady mohou být průběžně aktualizovány. Aktuální verze je vždy dostupná na těchto webových stránkách.
            </p>
          </section>

        </div>

        <div className="mt-12 text-center flex flex-col gap-4 items-center">
          <Link href="/" className="text-mafia-gold/60 hover:text-mafia-gold font-sans uppercase tracking-widest text-sm border-b border-mafia-gold/30 hover:border-mafia-gold transition-colors pb-1">
            Zpět na ústředí
          </Link>
          <p className="text-smoke-white/20 text-[10px] font-sans mt-8 uppercase tracking-widest">
            Vaše data jsou v bezpečí – MMBARBER
          </p>
        </div>

      </div>
    </div>
  );
}
