"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";
import { DailyIntelligence } from "./DailyIntelligence";

export function FooterSecrets() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center gap-8 pb-16">
      <div className="w-full max-w-4xl opacity-[0.02] blur-[2px] hover:opacity-100 hover:blur-none transition-all duration-1000 mb-8 px-6">
        <DailyIntelligence />
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-4xl px-6">
        {[
          { href: "/zapisnik", label: "Archiv_01" },
          { href: "/fade-gallery", label: "Gallery_01" },
          { href: "/operativni-denik", label: "Diary_01" },
          { href: "/faq", label: "FAQ_01" },
          { href: "/barbershop-uherske-hradiste", label: "Region_UH" },
          { href: "/pansky-strih-uherske-hradiste", label: "Service_Cut" },
          { href: "/akademie", label: "Academy_01" },
          { href: "/lokalni-sit", label: "Local_Network" },
          { href: "/barbershop-zlin", label: "Zlin_Connect" },
          { href: "/barbershop-uhersky-brod", label: "Brod_Connect" },
          { href: "/barbershop-veseli-nad-moravou", label: "Veseli_Connect" },
          { href: "/barbershop-hodonin", label: "Hodonin_Connect" },
          { href: "/barbershop-kyjov", label: "Kyjov_Connect" },
          { href: "/barbershop-luhacovice", label: "Luhacovice_Connect" },
          { href: "/region-slovacko", label: "Slovacko_Hub" },
          { href: "/global-standards", label: "Global_Hub" },
          { href: "https://www.firmy.cz/detail/13801488-mmbarber-uherske-hradiste-maratice.html", label: "Firmy_Seznam_Sync", external: true },
          { href: "/uprava-vousu-uherske-hradiste", label: "Service_Beard" }
        ].map((link, i) => (
          link.external ? (
            <a 
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener"
              className="text-[8px] font-mono text-white/5 opacity-[0.02] blur-[2px] hover:opacity-100 hover:blur-none transition-all duration-1000 uppercase tracking-[0.5em] select-none"
            >
              {link.label}
            </a>
          ) : (
            <Link 
              key={i}
              href={link.href} 
              className="text-[8px] font-mono text-white/5 opacity-[0.02] blur-[2px] hover:opacity-100 hover:blur-none transition-all duration-1000 uppercase tracking-[0.5em] select-none"
              aria-hidden="true"
            >
              {link.label}
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
