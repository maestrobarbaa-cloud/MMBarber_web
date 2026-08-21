"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionOtrokovicePage() {
  return (
    <SEOPageLayout 
      url="/barbershop-otrokovice"
      title="BARBERSHOP OTROKOVICE – STYL, KTERÝ STOJÍ ZA CESTU"
      subtitle="Exkluzivní pánské holičství pro náročné. Z Otrokovic k nám dojedete za 20 minut."
      keywords={["barbershop otrokovice", "holičství otrokovice", "kadeřnictví pro muže otrokovice", "barber otrokovice"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Pokud jste z <strong>Otrokovic</strong> a nespokojíte se s průměrem, doporučujeme navštívit MM BARBER v Uherském Hradišti. Naše zaměření na detaily, perfektní skin fade a klasické techniky holení jsou důvodem, proč k nám pravidelně jezdí klienti z celého kraje.
          </p>
          <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20 my-10">
             <h4 className="text-mafia-gold font-bold mb-4 uppercase">Důvody pro návštěvu z Otrokovic:</h4>
             <ul className="space-y-4 text-sm opacity-80 italic">
                <li>• **Nejvyšší kvalita střihu**: Nejsme továrna na vlasy. Na každý střih máme dostatek času (45-60 min).</li>
                <li>• **Tradiční Hot Towel Shave**: Dopřejte si rituál holení s horkým ručníkem a břitvou.</li>
                <li>• **Pohodové parkování**: Místo u nás vždy najdete a zdarma.</li>
             </ul>
          </div>
          <p>
            V <strong>Otrokovicích</strong> možná najdete rychlé ostříhání, ale my nabízíme zážitek a preciznost, ze které se stane váš oblíbený rituál. Rezervujte si svůj termín online a přesvědčte se sami.
          </p>
        </div>
      }
    />
  );
}
