"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionVeseliPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-veseli-nad-moravou"
      title="BARBERSHOP VESELÍ NAD MORAVOU – MM BARBER"
      subtitle="Z Veselí do Uherského Hradiště za stylem, který jinde nenajdete. Objevte špičkový grooming v srdci Slovácka."
      keywords={["barbershop veseli nad moravou", "kadeřnictvi veseli", "barber veseli", "uprava vousu veseli", "mmbarber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Klienti z <strong>Veselí nad Moravou</strong> k nám jezdí za unikátním spojením tradice a moderních střihů. Uherské Hradiště je přirozeným centrem regionu a MM BARBER v Mařaticích je jeho nejlepším pánským holičstvím. Proč byste měli vážit cestu k nám?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
             <div className="p-4 border border-white/10 text-center">
                <span className="text-mafia-gold font-bold block mb-2">15 KM</span>
                <span className="text-[10px] uppercase opacity-40">Vzdálenost z Veselí</span>
             </div>
             <div className="p-4 border border-white/10 text-center">
                <span className="text-mafia-gold font-bold block mb-2">HOTOVOST/QR</span>
                <span className="text-[10px] uppercase opacity-40">Flexibilní platba</span>
             </div>
             <div className="p-4 border border-white/10 text-center">
                <span className="text-mafia-gold font-bold block mb-2">9-18/12</span>
                <span className="text-[10px] uppercase opacity-40">Provozní doba</span>
             </div>
          </div>
          <p>
            V <strong>barbershopu ve Veselí nad Moravou</strong> možná dostanete standard, ale v MM BARBER dostanete zážitek. Od napařování vousů horkým ručníkem po precizní skin fade, který vydrží déle. Naše centrála je snadno dostupná po obchvatu a parkování je u nás naprosto bezproblémové. Těšíme se na vás v Mařaticích.
          </p>
        </div>
      }
    />
  );
}
