"use client";

import { useEffect, useState } from "react";
import { CinematicIntro } from "@/components/Intro";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminIntroEditorPage() {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") !== "true") {
      window.location.href = "/admin";
      return;
    }
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;

  return (
    <>
      <CinematicIntro forceShow={true} />
      {/* Floating back button on top of everything */}
      <div className="fixed top-6 right-6 z-[9999999]">
        <Link href="/admin" className="flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-md border border-mafia-gold text-mafia-gold font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)]">
          <ArrowLeft size={14} /> Zpět do Adminu
        </Link>
      </div>
    </>
  );
}
