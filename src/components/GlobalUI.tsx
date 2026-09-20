"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { TableOfContents } from "@/components/TableOfContents";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { CustomCursor } from "@/components/CustomCursor";
import { BugReporter } from "@/components/BugReporter";
import { HistoricalEvents } from "@/components/HistoricalEvents";
import { ProgressWidget } from "@/components/ProgressWidget";
import { AdminWidget } from "@/components/AdminWidget";
import { Atmosphere } from "@/components/Atmosphere";
import { FilmGrain } from "@/components/FilmGrain";
import { ClientWrapper } from "@/components/ClientWrapper";

export function GlobalUI() {
  const pathname = usePathname();

  // Na herních / 3D stránkách schováme všechny rušivé elementy
  if (pathname === '/mc' || pathname?.startsWith('/hry')) {
    return (
      <>
        {/* Potřebujeme ClientWrapper pro init, ale schováme UI */}
        <ClientWrapper />
      </>
    );
  }

  return (
    <>
      <Atmosphere />
      <FilmGrain />
      <Header />
      <ClientWrapper />
      
      {/* Global Web Frame - PC/Desktop Only (Theme Aware Border & Glow) */}
      <div className="fixed inset-0 pointer-events-none z-[9999] border-[1px] border-mafia-gold/20 noir-mode:border-mafia-silver/20 theme-blood:border-mafia-red/20 shadow-[inset_0_0_15px_rgba(var(--color-mafia-gold-rgb),0.05)] noir-mode:shadow-[inset_0_0_15px_rgba(192,192,192,0.05)] theme-blood:shadow-[inset_0_0_15px_rgba(139,0,0,0.05)] hidden md:block">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-red/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-red/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-red/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/30 noir-mode:border-mafia-silver/30 theme-blood:border-mafia-red/30" />
      </div>

      <TableOfContents />
      <ScrollIndicator />
      <CustomCursor />
      <BugReporter />
      <HistoricalEvents />
      <ProgressWidget />
      <AdminWidget />
    </>
  );
}
