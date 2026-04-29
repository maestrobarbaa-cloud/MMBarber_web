"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function PanskyStrihUHPage() {
  return (
    <SEOPageLayout 
      url="/pansky-strih-uherske-hradiste"
      title="PÁNSKÝ STŘIH UHERSKÉ HRADIŠTĚ"
      subtitle="Od klasických střihů po moderní fade. MM BARBER definuje trendy pánského kadeřnictví na Slovácku."
      keywords={["pansky strih uherske hradiste", "panske kadeřnictvi uh", "skin fade hradiste", "moderni ucesy pro muze", "fade haircut slovacko"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Dobrý <strong>pánský střih</strong> v Uherském Hradišti poznáte podle toho, jak vypadá po prvním umytí. V MM BARBER se soustředíme na technickou preciznost. Naše práce vychází z geometrie obličeje a přirozeného směru růstu vlasů. Nejsme továrna na účesy, jsme ateliér stylu.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 list-none">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-mafia-gold rotate-45"></span>
              <span>Skin Fade & Taper Fade</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-mafia-gold rotate-45"></span>
              <span>Klasické nůžkové střihy</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-mafia-gold rotate-45"></span>
              <span>Moderní texturované účesy</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-mafia-gold rotate-45"></span>
              <span>Grooming rituály s mytím</span>
            </li>
          </ul>
          <p>
            Využíváme profesionální kosmetiku bez sulfátů a parabenů, která pečuje o zdraví vašich vlasů. Naši klienti oceňují individuální konzultaci a doporučení domácí péče. <strong>MM BARBER Uherské Hradiště</strong> je zárukou, že z křesla vstanete jako nová verze sebe sama.
          </p>
        </div>
      }
    />
  );
}
