"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionHodoninPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-hodonin"
      title="BARBERSHOP HODONÍN – EXKLUZIVNÍ PÁNSKÝ STŘIH"
      subtitle="Z Hodonína do Uherského Hradiště za stylem, který vybočuje z řady. MM BARBER je volbou pro náročné muže z Hodonínska."
      keywords={["barbershop hodonin", "kadeřnictvi hodonin", "panske strihy hodonin", "barber hodonin", "mmbarber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Hledáte špičkový <strong>barbershop v Hodoníně</strong>, ale chcete něco víc než jen běžný střih? MM BARBER v Mařaticích je vzdálený jen 35 minut jízdy, ale nabízí zážitek, který v Hodoníně nenajdete. Naše noir atmosféra a preciznost jsou důvodem, proč k nám jezdí klienti z celého jihu Moravy.
          </p>
          <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20 my-10">
             <h4 className="text-mafia-gold font-bold mb-4 uppercase">Proč jet z Hodonína k nám?</h4>
             <ul className="space-y-4 text-sm opacity-80 italic">
                <li>• **Absolutní soukromí**: Naše centrála není na hlavní třídě, nikdo vás nevidí skrz výlohu.</li>
                <li>• **Parkování v ceně**: Žádné modré zóny, žádné placení. Parkujete u nás zdarma.</li>
                <li>• **Kvalita bez kompromisů**: Tomáš a jeho tým ladí každý detail až k naprosté dokonalosti.</li>
             </ul>
          </div>
          <p>
            Pokud jste z <strong>Hodonína</strong> a vážíte si svého stylu, MM BARBER je logická volba. Spojte cestu do Hradiště s byznysem nebo relaxem a odjíždějte jako nový člověk. Váš styl je vaše vizitka, svěřte ji do rukou mistrů.
          </p>
        </div>
      }
    />
  );
}
