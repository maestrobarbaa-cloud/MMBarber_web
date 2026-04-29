"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionLuhacovicePage() {
  return (
    <SEOPageLayout 
      url="/barbershop-luhacovice"
      title="BARBERSHOP LUHAČOVICE – STYL PRO LÁZEŇSKÉ ŠVIHÁKY"
      subtitle="Z Luhačovic do Uherského Hradiště za precizností, která podtrhne vaši osobnost. MM BARBER Mařatice."
      keywords={["barbershop luhacovice", "kadeřnictvi luhacovice", "barber luhacovice", "panske strihy luhacovice", "mmbarber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            V <strong>Luhačovicích</strong> víte, co znamená kvalita a péče. MM BARBER v Uherském Hradišti přenáší tento standard do světa pánského groomingu. Cesta z lázeňského města k nám trvá 30 minut a nabízí vám únik do světa, kde vládne břitva, klid a noir styl.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
             <div className="p-6 bg-mafia-gold/10 border-l-2 border-mafia-gold">
                <h4 className="font-bold text-mafia-gold uppercase mb-2">Moderní Grooming</h4>
                <p className="text-xs italic">Skin fade, taper fade nebo klasické nůžky. Pro klienty z Luhačovic držíme nejvyšší technický standard.</p>
             </div>
             <div className="p-6 bg-mafia-gold/10 border-l-2 border-mafia-gold">
                <h4 className="font-bold text-mafia-gold uppercase mb-2">Tradiční rituály</h4>
                <p className="text-xs italic">Horký ručník, napařování vousů a holení břitvou. To pravé pro ty, kteří si potrpí na detaily.</p>
             </div>
          </div>
          <p>
            Nehledejte <strong>barbershop v Luhačovicích</strong> jen podle vzdálenosti. Hledejte podle výsledků. MM BARBER v Mařaticích je místem, kde se tvoří digitální identity i reálný styl. Zastavte se u nás a poznejte rozdíl.
          </p>
        </div>
      }
    />
  );
}
