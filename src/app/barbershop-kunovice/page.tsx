"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionKunovicePage() {
  return (
    <SEOPageLayout 
      url="/barbershop-kunovice"
      title="BARBERSHOP KUNOVICE – NEJVYŠŠÍ STANDARD STŘIHU"
      subtitle="Z Kunovic do Hradiště pro dokonalý fade a perfektní úpravu vousů. Jen kousek cesty k nekompromisní kvalitě."
      keywords={["barbershop kunovice", "kadeřnictví kunovice", "pánské holičství kunovice", "barber kunovice"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Hledáte špičkový <strong>barbershop v Kunovicích</strong> nebo v jejich bezprostředním okolí? MM BARBER (Uherské Hradiště – Mařatice) je pouhých 5 minut jízdy od Kunovic a nabízí zcela jinou ligu v péči o pánský vzhled.
          </p>
          <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20 my-10">
             <h4 className="text-mafia-gold font-bold mb-4 uppercase">Vaše výhody, když přijedete z Kunovic:</h4>
             <ul className="space-y-4 text-sm opacity-80 italic">
                <li>• **Žádné čekání v zácpě**: Výborná dostupnost a bezproblémové parkování zdarma.</li>
                <li>• **Špičkové dovednosti**: Zaměřujeme se na dokonalé přechody (fade) a symetrické kontury vousů.</li>
                <li>• **Privátní zóna**: Prostředí, kde si u drinku a skvělé hudby odpočinete od každodenního shonu.</li>
             </ul>
          </div>
          <p>
            Víme, že muži z <strong>Kunovic</strong> ocení poctivé řemeslo a přátelský, ale přesto profesionální přístup. Stačí si online zarezervovat termín a my se postaráme o to, abyste odcházeli maximálně spokojeni se svým novým stylem.
          </p>
        </div>
      }
    />
  );
}
