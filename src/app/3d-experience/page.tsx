"use client";

import dynamic from "next/dynamic";

// Three.js nefunguje na serveru (SSR) — lazy load pouze na klientu.
// TS Language Server někdy chybně hlásí "Cannot find module" u dynamic imports
// v client components — za runtime to funguje správně (Turbopack kompiluje bez chyb).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — false positive, soubor existuje a Turbopack ho kompiluje
const BarberScene = dynamic(() => import("./BarberScene"), {
  ssr: false,
  loading: () => (
    <div className="experience-loading">
      <div className="experience-loading__inner">
        <div className="experience-loading__spinner" />
        <p className="experience-loading__text">Načítám 3D scénu…</p>
      </div>
    </div>
  ),
});

export default function ExperiencePage() {
  return (
    <main className="experience-page">
      <BarberScene />
    </main>
  );
}
