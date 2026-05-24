"use client";

import { SEOPageLayout } from "@/components/SEOPageLayout";
import React from "react";

export default function PanskyStrihUHPage() {
  return (
    <>
      <SEOPageLayout 
        url="/pansky-strih-uherske-hradiste"
        title="PÁNSKÝ STŘIH UHERSKÉ HRADIŠTĚ"
        subtitle="Specialisté na moderní skin fade a klasické pánské střihy. Váš vzhled je naše vizitka."
        keywords={["pánský střih uherské hradiště", "pánské kadeřnictví uh", "fade střih uherské hradiště", "skin fade", "nejlepší holič uh"]}
        content={
          <div className="space-y-8 text-smoke-white/80 leading-relaxed">
            <p>
              Dokonalý <strong>pánský střih</strong> není jen o zkrácení vlasů. Je to o proporcích, tvaru hlavy 
              a vašem osobním stylu. V MMBARBER Uherské Hradiště přistupujeme ke každému klientovi individuálně, 
              abychom vytvořili účes, který vám perfektně sedne a který si snadno upravíte i doma.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
                 <h4 className="text-mafia-gold font-bold mb-2">Moderní Fade Střih</h4>
                 <p className="text-sm italic">Plynulé přechody (skin fade, mid fade) provedené s milimetrovou přesností.</p>
              </div>
              <div className="bg-mafia-gold/5 p-6 border-l-2 border-mafia-gold">
                 <h4 className="text-mafia-gold font-bold mb-2">Klasika & Business</h4>
                 <p className="text-sm italic">Tradiční nůžkové střihy, pompadour a elegantní úpravy pro gentlemany.</p>
              </div>
            </div>
            <p>
              Zastavte se v Mařaticích. Zkombinujte svůj střih s profesionální úpravou vousů a zažijte 
              opravdovou péči o váš zevnějšek. Rezervujte si svůj termín jednoduše přes náš online systém.
            </p>
          </div>
        }
      />
      
    </>
  );
}
