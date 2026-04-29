"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionBrodPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-uhersky-brod"
      title="BARBERSHOP UHERSKÝ BROD A OKOLÍ"
      subtitle="Pouhých 15 minut cesty z Brodu za špičkovým pánským střihem. MM BARBER Mařatice je logickou volbou pro muže z celého okresu."
      keywords={["barbershop uhersky brod", "panske kadeřnictvi brod", "holeni britvou brod", "fade brod", "barber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Pro muže z <strong>Uherského Brodu</strong> je MM BARBER v Mařaticích prakticky za rohem. Pokud hledáte úroveň servisu, kterou v místních kadeřnictvích postrádáte, zkuste změnu. Naše centrála v Hradišti je navržena pro ty, kteří nechtějí dělat kompromisy mezi cenou a kvalitou.
          </p>
          <div className="p-8 border-l-4 border-mafia-gold bg-white/5 my-10">
             <h4 className="text-xl font-heading font-black mb-4 uppercase">Výhody pro klienty z Brodu:</h4>
             <ul className="space-y-4 text-sm opacity-80">
                <li>• **Rychlá dostupnost**: 15 minut jízdy po hlavní tepně.</li>
                <li>• **Flexibilní termíny**: Náš online systém is.mmbarber.cz vám ukáže volno v reálném čase.</li>
                <li>• **Profi kosmetika**: Používáme produkty, které v Brodu běžně neseženete.</li>
             </ul>
          </div>
          <p>
            Dopřejte si zážitek, který v <strong>Uherském Brodě</strong> nenajdete. Mafiánský noir styl, ostré břitvy a atmosféra, která vás nabije. Mnoho našich klientů z Brodu spojuje návštěvu u nás s nákupem nebo fotbalem na Slovácku. Staňte se součástí naší rodiny.
          </p>
        </div>
      }
    />
  );
}
