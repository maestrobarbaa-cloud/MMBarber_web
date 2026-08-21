"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionNapajedlaPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-napajedla"
      title="BARBERSHOP NAPAJEDLA – POCTIVÉ HOLIČSKÉ ŘEMESLO"
      subtitle="Z Napajedel k nám jezdí muži, kteří vyžadují nekompromisní kvalitu a stylové prostředí."
      keywords={["barbershop napajedla", "pánské kadeřnictví napajedla", "holičství napajedla", "barber napajedla"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Pro muže z <strong>Napajedel</strong> a okolí je tu MM BARBER – prémiové pánské holičství sídlící v Mařaticích (Uherské Hradiště). Krátká cesta autem vás přivede do prostředí, kde ožívá staré poctivé řemeslo v moderním kabátu.
          </p>
          <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20 my-10">
             <h4 className="text-mafia-gold font-bold mb-4 uppercase">Na co se můžete těšit?</h4>
             <ul className="space-y-4 text-sm opacity-80 italic">
                <li>• **Naprosté soukromí**: Naše prostory jsou navrženy pro diskrétnost a maximální relax.</li>
                <li>• **Mistrovský Fade a vousy**: Zakládáme si na dokonalých přechodech a čistých liniích břitvou.</li>
                <li>• **Odborné poradenství**: Poradíme vám se střihem i výběrem správné kosmetiky pro váš typ vlasů.</li>
             </ul>
          </div>
          <p>
            Ať už potřebujete perfektní byznysový střih nebo chcete zcela změnit styl, pro klienty z <strong>Napajedel</strong> jsme tou nejlepší volbou v regionu. Vyzkoušejte rozdíl, který dělá skutečný barbershop.
          </p>
        </div>
      }
    />
  );
}
