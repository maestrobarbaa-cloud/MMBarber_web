"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function RegionZlinPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-zlin"
      title="BARBERSHOP ZLÍN – VYPLATÍ SE CESTA?"
      subtitle="Proč klienti ze Zlína jezdí 25 minut do MM BARBER v Uherském Hradišti? Odpovědí je klid, parkování a absolutní soukromí."
      keywords={["barbershop zlin", "panske kadeřnictvi zlin", "nejlepsi barber zlin okolí", "skin fade zlin", "mmbarber hradiště"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Hledáte ten pravý <strong>barbershop ve Zlíně</strong>, ale v centru města vás trápí parkování a shon? Mnoho našich věrných klientů jezdí ze Zlína právě k nám do Mařatic. Cesta trvá necelou půlhodinu, ale ten rozdíl v atmosféře je propastný.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
             <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20">
                <h4 className="text-mafia-gold font-bold mb-4 uppercase">Parkování bez stresu</h4>
                <p className="text-sm italic">Ve Zlíně hledáte místo 15 minut. U nás v MM BARBER zaparkujete přímo před dveřmi zdarma. Váš čas patří vám, ne parkometru.</p>
             </div>
             <div className="bg-mafia-gold/5 p-8 border border-mafia-gold/20">
                <h4 className="text-mafia-gold font-bold mb-4 uppercase">Private Club Experience</h4>
                <p className="text-sm italic">Nejsme v obchodním centru. Jsme v klidné části, kde vás neruší davy. Pro muže ze Zlína jsme oázou klidu.</p>
             </div>
          </div>
          <p>
            Zlín je město designu, a proto zlínští muži oceňují náš **noir mafiánský styl** a technickou preciznost. Ať už jedete na otočku pro skin fade, nebo si chcete užít kompletní rituál s horkým ručníkem, MM BARBER je ta správná destinace. Spojte návštěvu u nás s výletem do Uherského Hradiště a uvidíte, že ta cesta dává smysl.
          </p>
        </div>
      }
    />
  );
}
