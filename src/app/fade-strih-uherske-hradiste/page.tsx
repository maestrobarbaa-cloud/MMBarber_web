"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";
import React from "react";

export default function FadeStrihUHPage() {
  return (
    <>
      <SEOPageLayout 
        url="/fade-strih-uherske-hradiste"
        title="FADE STŘIH UHERSKÉ HRADIŠTĚ"
        subtitle="Skin fade, mid fade a taper fade od mistrů řemesla. Ultimátní přesnost bez kompromisů."
        keywords={["fade střih uherské hradiště", "skin fade", "barber fade", "pánský střih fade uh", "taper fade hradiště"]}
        content={
          <div className="space-y-8 text-smoke-white/80 leading-relaxed">
            <p>
              Pokud je něco aktuálním králem pánských účesů, pak je to bezpochyby <strong>fade</strong>. 
              V MMBARBER Uherské Hradiště se specializujeme na dokonalé, plynulé přechody, které 
              vyžadují maximální soustředění a pevnou ruku. Nejsme obyčejné kadeřnictví, jsme barbershop 
              stavící na detailech.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
                 <h4 className="text-mafia-gold font-bold mb-2">Skin Fade</h4>
                 <p className="text-sm italic">Hladký přechod od absolutní kůže. Holeno do ztracena břitvou nebo shaverem.</p>
              </div>
              <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
                 <h4 className="text-mafia-gold font-bold mb-2">Taper Fade</h4>
                 <p className="text-sm italic">Přirozenější varianta. Fade se aplikuje primárně v oblasti spánků a krku.</p>
              </div>
            </div>
            <p>
              V našem salonu v Mařaticích používáme špičkové americké strojky Wahl a Andis, které 
              zaručují čistý a bezchybný "blend" (přechod). Spojte svůj fade střih s úpravou kontur 
              vousů břitvou a získáte vzhled, který nezůstane bez povšimnutí.
            </p>
          </div>
        }
      />
    </>
  );
}
