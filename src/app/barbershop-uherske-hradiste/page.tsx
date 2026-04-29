"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";

export default function BarbershopUHPage() {
  return (
    <SEOPageLayout 
      url="/barbershop-uherske-hradiste"
      title="BARBERSHOP UHERSKÉ HRADIŠTĚ"
      subtitle="Nejlepší pánský klub a holičství v srdci Slovácka. MM BARBER Mařatice je místem, kde se styl potkává s charakterem."
      keywords={["barbershop uherske hradiste", "holicstvi uh", "pansky klub hradiste", "tomas micka", "mmbarber maratice"]}
      content={
        <div className="space-y-8 text-smoke-white/80 leading-relaxed">
          <p>
            Hledáte špičkový <strong>barbershop v Uherském Hradišti</strong>? MM BARBER není jen obyčejné holičství. Je to prostor navržený pro muže, kteří vyžadují kvalitu bez kompromisů. Nacházíme se v klidné části Mařatic, s bezproblémovým parkováním přímo u vstupu, což nás činí ideální volbou pro klienty z Kunovic, Starého Města i centra UH.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
               <h4 className="text-mafia-gold font-bold mb-2">Exkluzivní prostředí</h4>
               <p className="text-sm italic">Design v mafiánském noir stylu, který vás přenese do jiné éry.</p>
            </div>
            <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
               <h4 className="text-mafia-gold font-bold mb-2">Profesionální přístup</h4>
               <p className="text-sm italic">Práce s břitvou, horké ručníky a ty nejlepší techniky střihu.</p>
            </div>
          </div>
          <p>
            Naše komunita roste každým dnem. Jsme hrdí na to, že MM BARBER je synonymem pro <strong>pánský střih v UH</strong>, který má úroveň. Ať už potřebujete skin fade, taper fade nebo úpravu dlouhých vousů, naši operativci jsou připraveni.
          </p>
        </div>
      }
    />
  );
}
