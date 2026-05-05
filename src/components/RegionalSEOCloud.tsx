"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Globe, MapPin, Signal, Radio, Shield } from "lucide-react";

export function RegionalSEOCloud() {
  const { t } = useTranslation();

  const regions = [
    { name: "UH_CENTRAL", cities: ["Uherské Hradiště", "Mařatice", "Kunovice", "Staré Město", "Jarošov", "Sady", "Vésky"] },
    { name: "UH_BROD_VECTOR", cities: ["Uherský Brod", "Hluk", "Nivnice", "Vlčnov", "Bojkovice", "Slavičín"] },
    { name: "ZLÍN_CLUSTER", cities: ["Zlín", "Otrokovice", "Napajedla", "Vizovice", "Slušovice", "Fryšták"] },
    { name: "SLOVÁCKO_SOUTH", cities: ["Hodonín", "Břeclav", "Veselí nad Moravou", "Kyjov", "Strážnice", "Rohatec"] },
    { name: "MORAVIA_EAST", cities: ["Kroměříž", "Holešov", "Luhačovice", "Brumov-Bylnice", "Valašské Klobouky"] }
  ];

  const getTargetUrl = (city: string) => {
    const c = city.toLowerCase();
    if (c.includes("mařatice")) return "/panske-holictvi-maratice";
    if (c.includes("hradiště")) return "/barbershop-uherske-hradiste";
    if (c.includes("slovácko") || c.includes("veselí")) return "/region-slovacko";
    if (c.includes("zlín") || c.includes("napajedla")) return "/pansky-strih-uherske-hradiste";
    if (c.includes("brod") || c.includes("hluk")) return "/uprava-vousu-uherske-hradiste";
    return "/barbershop-uherske-hradiste";
  };

  return (
    <div className="w-full bg-mafia-black/80 border-t border-mafia-gold/10 py-32 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Technical Header */}
        <div className="flex items-center gap-6 mb-16 opacity-30">
          <Globe size={20} className="text-mafia-gold animate-pulse" />
          <div className="h-px flex-grow bg-gradient-to-r from-mafia-gold/50 to-transparent"></div>
          <span className="font-mono text-[10px] uppercase tracking-[1em] text-mafia-gold">REGIONAL_AUTHORITY_SIGNAL_EXPANSION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {regions.map((region, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-mafia-gold/60" />
                <h3 className="text-mafia-gold/80 font-mono text-xs uppercase tracking-widest">{region.name}</h3>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {region.cities.map((city, cIdx) => (
                  <Link 
                    key={cIdx} 
                    href={getTargetUrl(city)}
                    className="text-smoke-white/40 font-sans text-sm hover:text-mafia-gold transition-colors cursor-pointer"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hidden SEO Keyword Payload */}
        <div className="mt-32 opacity-[0.02] select-none pointer-events-none text-[8px] font-sans leading-relaxed text-mafia-gold columns-2 md:columns-4 lg:columns-6 gap-8">
          <p>
            Barbershop Uherské Hradiště, pánský střih Mařatice, holičství Slovácko, nejlepší barber Zlínský kraj. 
            Skin fade Uherské Hradiště, úprava vousů břitvou Kunovice, pánské kadeřnictví Staré Město. 
            MM BARBER Uherský Brod, holič Hluk, fade střih Napajedla. Tradiční holičství Luhačovice, 
            moderní střihy pro muže Zlín, pánský servis Kroměříž. 
            Rezervace barber UH, online objednání holič Hradiště, ceník barbershop Slovácko. 
            Péče o vousy Hodonín, stříhání vlasů Kyjov, barber shop Veselí nad Moravou.
            Slovácké slavnosti vína střih, LFŠ Uherské Hradiště kadeřník, 1.FC Slovácko barber.
            Dárkové poukazy barber UH, kosmetika pro muže Reuzel Hradiště, Uppercut Deluxe barber Morava.
            Akademie stříhání UH, kurzy pro barbery Zlín, rekvalifikace holič Moravský region.
            Vodo Topo Jahoda partnerství, Kofipack logistika, Malina Photo vizuální identita.
            Barbershop Uherské Hradiště recenze, zkušenosti barber Mařatice, hodnocení holičství Slovácko.
            Pánský klub UH, noir atmosféra barbershop, exkluzivní péče pro muže v Hradišti.
            Otevírací doba barber UH, Sadová 1383 Mařatice, parkování u barbershopu Hradiště.
          </p>
          <p className="mt-4">
            {t.seo.servicesFullText}
          </p>
          <p className="mt-4">
            {t.seo.partnerServicesFullText}
          </p>
        </div>

        {/* System Status */}
        <div className="mt-20 flex items-center justify-between opacity-10 border-t border-mafia-gold/10 pt-8">
          <div className="flex items-center gap-4">
            <Signal size={12} />
            <span className="font-mono text-[8px] uppercase tracking-widest">BROADCAST_ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <Radio size={12} />
            <span className="font-mono text-[8px] uppercase tracking-widest">FREQUENCY: 50KM_RADIUS_COVERAGE</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield size={12} />
            <span className="font-mono text-[8px] uppercase tracking-widest">ENCRYPTION: AES_256_ACTIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
