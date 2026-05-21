"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldAlert, 
  CheckCircle,
  Users,
  Layout,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the keys we'll manage
const VISIBILITY_KEYS = [
  { key: 'visibility_barber_tomas', label: 'Barber: Tomáš', category: 'barbers', icon: <Users size={16} /> },
  { key: 'visibility_barber_nella', label: 'Barber: Nella', category: 'barbers', icon: <Users size={16} /> },
  { key: 'visibility_services', label: 'Sekce: Služby / Ceník', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_partners', label: 'Sekce: Partneři', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_reviews', label: 'Sekce: Google Recenze', category: 'sections', icon: <MessageSquare size={16} /> },
  { key: 'visibility_contact', label: 'Sekce: Kontakt', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_intelligence', label: 'Sekce: Terminál (Intelligence)', category: 'sections', icon: <Layout size={16} /> },
];

export default function AdminVisibilityPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      fetchSettings();
    }
  }, [router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const initialSettings: Record<string, boolean> = {};
        
        // Populate settings from DB, default to true if not found
        VISIBILITY_KEYS.forEach(item => {
          const val = data.values[item.key];
          initialSettings[item.key] = val === null || val === undefined ? true : val === 'true';
        });
        
        setSettings(initialSettings);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      // Save each setting one by one (or we could modify API to accept batch, but for ~7 items this is fine)
      const promises = Object.entries(settings).map(([key, value]) => 
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: value ? 'true' : 'false' })
        })
      );
      
      await Promise.all(promises);
      
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Nepodařilo se uložit nastavení.");
    }
  };

  if (!isAuthenticated || loading) return null;

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-mafia-gold" size={24} />
              <h1 className="text-3xl md:text-4xl font-heading font-black uppercase italic tracking-tighter">
                GLOBÁLNÍ <span className="text-mafia-gold">VIDITELNOST</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">MMBARBER_VISIBILITY_CONTROL</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {savedMessage && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-green-500 flex items-center gap-2 font-mono text-xs uppercase tracking-widest mr-4">
                <CheckCircle size={14} /> Uloženo
              </motion.div>
            )}
            <button 
              onClick={handleSave}
              className="flex items-center gap-3 px-8 py-4 bg-mafia-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
            >
              <Save size={16} /> ULOŽIT ZMĚNY
            </button>
            <Link href="/admin" className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> ZPĚT
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="bg-[#050505] border border-white/10 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(197,160,89,0.05)_0%,transparent_50%)] pointer-events-none"></div>
          
          <div className="mb-10 p-4 border border-mafia-gold/20 bg-mafia-gold/5 flex gap-4 items-start">
            <ShieldAlert className="text-mafia-gold shrink-0 mt-1" size={20} />
            <p className="font-mono text-xs text-smoke-white/60 leading-relaxed uppercase tracking-wider">
              Zde můžeš globálně zapínat a vypínat celé bloky webu. Vypnutá karta nebo sekce se okamžitě přestane zobrazovat všem návštěvníkům webu.
            </p>
          </div>

          <div className="space-y-12 relative z-10">
            
            {/* Barbeři */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-2">
                <Users size={14} /> OPERATIVCI (KARTY BARBERŮ)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VISIBILITY_KEYS.filter(k => k.category === 'barbers').map(item => (
                  <button 
                    key={item.key}
                    onClick={() => toggleSetting(item.key)}
                    className={`p-6 border transition-all flex items-center justify-between text-left ${
                      settings[item.key] ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 bg-black/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${settings[item.key] ? 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 'bg-white/20'}`}></div>
                      <div>
                        <div className="font-heading font-black tracking-widest uppercase mb-1">{item.label}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {settings[item.key] ? 'VIDITELNÝ' : 'SKRYTÝ'}
                        </div>
                      </div>
                    </div>
                    {settings[item.key] ? <Eye size={20} className="text-mafia-gold" /> : <EyeOff size={20} className="text-white/40" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ostatní sekce */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-2 border-t border-white/5 pt-10">
                <Layout size={14} /> HLAVNÍ SEKCE WEBU
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VISIBILITY_KEYS.filter(k => k.category === 'sections').map(item => (
                  <button 
                    key={item.key}
                    onClick={() => toggleSetting(item.key)}
                    className={`p-6 border transition-all flex items-center justify-between text-left ${
                      settings[item.key] ? 'border-mafia-gold bg-mafia-gold/10' : 'border-white/10 bg-black/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${settings[item.key] ? 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 'bg-white/20'}`}></div>
                      <div>
                        <div className="font-heading font-black tracking-widest uppercase mb-1">{item.label}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {settings[item.key] ? 'VIDITELNÉ' : 'SKRYTÉ'}
                        </div>
                      </div>
                    </div>
                    {settings[item.key] ? <Eye size={20} className="text-mafia-gold" /> : <EyeOff size={20} className="text-white/40" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
