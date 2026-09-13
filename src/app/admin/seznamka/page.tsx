"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Layers, MessageSquare, ShieldAlert, BarChart3 } from "lucide-react";
import Link from "next/link";
import { InboxTab } from "./components/InboxTab";
import { ProfilesTab } from "./components/ProfilesTab";
import { ReportsTab } from "./components/ReportsTab";
import { StatsTab } from "./components/StatsTab";

export default function AdminSeznamkaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "profiles" | "reports" | "stats">("inbox");

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-mafia-gold font-mono uppercase tracking-widest mb-4">Přístup odepřen</p>
          <Link href="/admin" className="text-white/40 font-mono text-sm underline">← Přihlásit se</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-mafia-gold" size={22} />
              <h1 className="text-3xl font-heading font-black uppercase italic tracking-tighter">
                ŘÍDÍCÍ PANEL <span className="text-mafia-gold">SEZNAMKY</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
              Správa uživatelů, reporty a globální nastavení
            </p>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={14} /> ZPĚT DO ADMINU
          </Link>
        </header>

        {/* Hlavní navigace (Taby) */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
            <button 
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'inbox' ? 'text-mafia-gold border-b-2 border-mafia-gold' : 'text-white/40 hover:text-white'}`}
            >
                <MessageSquare size={16} /> Inbox Zpráv
            </button>
            <button 
                onClick={() => setActiveTab("profiles")}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'profiles' ? 'text-mafia-gold border-b-2 border-mafia-gold' : 'text-white/40 hover:text-white'}`}
            >
                <Layers size={16} /> Správa Profilů
            </button>
            <button 
                onClick={() => setActiveTab("reports")}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'reports' ? 'text-mafia-gold border-b-2 border-mafia-gold' : 'text-white/40 hover:text-white'}`}
            >
                <ShieldAlert size={16} /> Nahlášení
            </button>
            <button 
                onClick={() => setActiveTab("stats")}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'stats' ? 'text-mafia-gold border-b-2 border-mafia-gold' : 'text-white/40 hover:text-white'}`}
            >
                <BarChart3 size={16} /> Nastavení & Statistiky
            </button>
        </div>

        {/* Obsah Tabu */}
        <div className="min-h-[50vh]">
            {activeTab === "inbox" && <InboxTab />}
            {activeTab === "profiles" && <ProfilesTab />}
            {activeTab === "reports" && <ReportsTab />}
            {activeTab === "stats" && <StatsTab />}
        </div>
        
      </div>
    </div>
  );
}
