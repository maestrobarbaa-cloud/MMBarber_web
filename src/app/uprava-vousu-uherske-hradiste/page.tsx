"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function UpravaVousuUHPage() {
  return (
    <SEOPageLayout 
      url="/uprava-vousu-uherske-hradiste"
      title="ÚPRAVA VOUSŮ UHERSKÉ HRADIŠTĚ"
      subtitle="Královská péče o vaše vousy. Od kontur břitvou po kompletní tvarování plnovousu v MM BARBER."
      keywords={["uprava vousu uherske hradiste", "holeni britvou uh", "barber vousy hradiste", "pece o vousy slovacko", "hot towel shave hradiste"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Vousy jsou podpisem muže. V našem <strong>barberu v Uherském Hradišti</strong> jim věnujeme péči, kterou si zaslouží. Tradiční <strong>holení břitvou</strong> s napařováním horkým ručníkem (hot towel) je u nás standardem, nikoliv nadstandardem. Pracujeme s prémiovými oleji a balzámy, které hydratují pokožku i samotný vous.
          </p>
          <div className="bg-white/5 p-8 rounded-none border border-mafia-gold/20 my-10 relative">
             <div className="absolute top-0 left-0 w-2 h-full bg-mafia-gold"></div>
             <h4 className="text-xl font-heading font-black mb-4 uppercase">Náš vousatý rituál:</h4>
             <ol className="space-y-3 list-decimal list-inside text-sm opacity-80">
               <li>Konzultace tvaru podle typu obličeje</li>
               <li>Napařování horkým ručníkem pro změkčení vousu</li>
               <li>Precizní oholení kontur břitvou</li>
               <li>Střih a tvarování plnovousu nebo strniště</li>
               <li>Závěrečná výživa olejem a balzámem</li>
             </ol>
          </div>
          <p>
            Správná <strong>úprava vousů v UH</strong> vyžaduje nejen pevnou ruku, ale i cit pro detail. Ať už pěstujete monumentální plnovous nebo udržujete ostré strniště, v MM BARBER Mařatice najdete to nejlepší pro svůj look. Rezervujte si svůj čas a zažijte rituál, který z vás udělá džentlmena.
          </p>
        </div>
      }
    />
  );
}
