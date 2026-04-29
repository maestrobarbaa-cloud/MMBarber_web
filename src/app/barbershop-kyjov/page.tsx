"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionKyjovPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-kyjov"
      title="BARBERSHOP KYJOV – PÁNSKÉ HOLIČSTVÍ S DUŠÍ"
      subtitle="Pouhých 30 minut z Kyjova za zážitkem, který definuje váš styl. MM BARBER v Mařaticích je centrálou pro muže z Kyjovska."
      keywords={["barbershop kyjov", "kadeřnictvi kyjov", "pansky strih kyjov", "barber kyjov", "mmbarber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            V <strong>Kyjově</strong> je tradice důležitá, a my v MM BARBER to víme. Proto kombinujeme klasické holičské řemeslo s moderními trendy, jako je skin fade a precizní úprava vousů břitvou. Cesta z Kyjova k nám trvá půl hodiny, ale ten pocit, když odcházíte z našeho křesla, je k nezaplacení.
          </p>
          <div className="p-10 border border-white/5 bg-white/[0.02] my-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl">KYJOV</div>
             <h4 className="text-xl font-heading font-black mb-6 uppercase text-mafia-gold">Komfort pro Kyjováky:</h4>
             <p className="text-sm italic mb-4">Mnoho našich klientů z Kyjova oceňuje náš online rezervační systém. Stačí pár kliknutí a víte přesně, kdy na vás budeme mít čas. Žádné čekání v řadě, žádná nejistota.</p>
             <p className="text-sm italic">Uherské Hradiště je navíc skvělým místem pro další aktivity – od sportu po kulturu. Udělejte si ze stříhání rituál, na který se budete těšit.</p>
          </div>
          <p>
            Hledáte-li <strong>nejlepší barbershop v okolí Kyjova</strong>, vaše cesta končí v Mařaticích. MM BARBER je místo, kde se nemluví zbytečně, ale výsledky mluví za vše. Těšíme se na vaši návštěvu.
          </p>
        </div>
      }
    />
  );
}
