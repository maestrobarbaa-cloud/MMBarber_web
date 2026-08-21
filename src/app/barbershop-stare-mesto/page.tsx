"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionStareMestoPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-stare-mesto"
      title="BARBERSHOP STARÉ MĚSTO – TOP STŘIH KOUSEK OD VÁS"
      subtitle="Prémiový pánský střih a holení jen pár minut od Starého Města. Zapomeňte na kompromisy."
      keywords={["barbershop staré město", "holičství staré město", "pánský střih staré město", "barber staré město"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Hledáte <strong>kvalitní barbershop ve Starém Městě</strong> nebo v těsné blízkosti? MM BARBER v Uherském Hradišti (Mařatice) je vzdálený jen 10 minut jízdy autem a nabízí úroveň služeb, za kterou se vyplatí těch pár kilometrů přejet. Naše unikátní prostory s nezaměnitelnou noir atmosférou z vás udělají nového muže.
          </p>
          <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20 my-10">
             <h4 className="text-mafia-gold font-bold mb-4 uppercase">Proč přijet ze Starého Města k nám?</h4>
             <ul className="space-y-4 text-sm opacity-80 italic">
                <li>• **Dostupnost a parkování**: Jsme mimo ucpané centrum, s vlastním parkováním přímo u dveří.</li>
                <li>• **Moderní techniky**: Ať už chcete perfektní skin fade, úpravu vousů s horkým ručníkem nebo moderní french crop, zvládáme vše s maximální přesností.</li>
                <li>• **Nápoj na uvítanou**: Dobrá káva, vychlazené pivo nebo rum jsou u nás standardem, nikoliv luxusem.</li>
             </ul>
          </div>
          <p>
            Neztrácejte čas hledáním kompromisů. Pokud bydlíte ve <strong>Starém Městě</strong> a okolí, připojte se k naší klientele, která se pravidelně vrací za kvalitou, tradicí a skvělým zážitkem.
          </p>
        </div>
      }
    />
  );
}
