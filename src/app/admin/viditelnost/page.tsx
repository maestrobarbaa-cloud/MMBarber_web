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
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the keys we'll manage
const VISIBILITY_KEYS = [
  { key: 'widget_chat_enabled', label: 'Globální: Support Chat', category: 'widgets', icon: <MessageSquare size={16} /> },
  { key: 'widget_feedback_enabled', label: 'Globální: Nápady a Hlášení chyb', category: 'widgets', icon: <MessageSquare size={16} /> },
  { key: 'widget_activity_enabled', label: 'Globální: Žhavá aktivita', category: 'widgets', icon: <Layout size={16} /> },
  { key: 'visibility_intro_rezervace', label: 'Hlavní menu: Rezervace', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_intro_galerie', label: 'Hlavní menu: Galerie', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_intro_vice', label: 'Hlavní menu: Více o podniku', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_intro_komunita', label: 'Hlavní menu: Rodina MM Barber', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_intro_kontakt', label: 'Hlavní menu: Kontakt', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_seznamka', label: 'Hlavní menu: Seznamka', category: 'intro', icon: <Layout size={16} /> },
  { key: 'visibility_card_services', label: 'Karta: Ceník a Služby', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_seznamka', label: 'Karta: Seznamka', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_vouchery', label: 'Karta: Vouchery', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_galerie', label: 'Karta: Galerie', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_rodina', label: 'Karta: Rodina', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_zajimavosti', label: 'Karta: Zajímavosti', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_skryta_mista', label: 'Karta: Skrytá místa', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_system', label: 'Karta: Systém a Návštěva', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_pece', label: 'Karta: Péče o sebe', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_card_komunita', label: 'Karta: Komunita', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_services', label: 'Celá sekce: Služby / Ceník', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_partners', label: 'Celá sekce: Partneři', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_reviews', label: 'Celá sekce: Google Recenze', category: 'sections', icon: <MessageSquare size={16} /> },
  { key: 'visibility_contact', label: 'Celá sekce: Kontakt', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_intelligence', label: 'Celá sekce: Terminál (Intelligence)', category: 'sections', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_grafika', label: 'Komunita: Grafika', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_nabor', label: 'Komunita: Nábor', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_chat', label: 'Komunita: Chat', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_historky', label: 'Komunita: Historky z křesla', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_hodnoceni', label: 'Komunita: Hodnocení', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_novinky', label: 'Komunita: Novinky', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_projekty', label: 'Komunita: Projekty', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_sin_slavy', label: 'Komunita: Síň slávy', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_komunita_zlepseni', label: 'Komunita: Zlepšení', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_akademie', label: 'Sekce: Akademie', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_vip_club', label: 'Sekce: VIP Club', category: 'community', icon: <Layout size={16} /> },
  { key: 'visibility_kariera', label: 'Sekce: Kariéra', category: 'community', icon: <Layout size={16} /> },
];

export default function AdminVisibilityPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
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
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const initialSettings: Record<string, string> = {};
        
        VISIBILITY_KEYS.forEach(item => {
          const val = data.values[item.key];
          if (val === 'false') initialSettings[item.key] = 'hidden';
          else if (val === 'dev') initialSettings[item.key] = 'dev';
          else if (val === 'locked') initialSettings[item.key] = 'locked';
          else if (val === 'hidden') initialSettings[item.key] = 'hidden';
          else initialSettings[item.key] = 'visible';
        });
        
        setSettings(initialSettings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cycleSetting = (key: string) => {
    setSettings(prev => {
      const current = prev[key];
      let next = 'visible';
      if (current === 'visible') next = 'locked';
      else if (current === 'locked') next = 'hidden';
      else if (current === 'hidden') next = 'dev';
      else next = 'visible';
      return { ...prev, [key]: next };
    });
  };

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: settings })
      });
      
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Nepodařilo se uložit nastavení.");
    }
  };

  if (!isAuthenticated || loading) return null;

  const renderStatusBadge = (key: string) => {
    const val = settings[key];
    if (val === 'visible') {
      return (
        <button onClick={() => cycleSetting(key)} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-mono text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-colors">
          <Eye size={12} /> Viditelné
        </button>
      );
    }
    if (val === 'hidden') {
      return (
        <button onClick={() => cycleSetting(key)} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors">
          <EyeOff size={12} /> Skryté
        </button>
      );
    }
    if (val === 'locked') {
      return (
        <button onClick={() => cycleSetting(key)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white/60 border border-white/20 rounded font-mono text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors">
          <ShieldAlert size={12} /> Zamčené
        </button>
      );
    }
    return (
      <button onClick={() => cycleSetting(key)} className="flex items-center gap-2 px-3 py-1.5 bg-mafia-gold/10 text-mafia-gold border border-mafia-gold/20 rounded font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-gold/20 transition-colors">
        <AlertTriangle size={12} /> Ve vývoji
      </button>
    );
  };

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
              Zde můžeš globálně nastavovat viditelnost prvků. Lze volit mezi těmito stavy: <strong>VIDITELNÉ</strong>, <strong>ZAMČENÉ</strong> (karta zůstane, ale je neaktivní s ikonou zámku), <strong>SKRYTÉ</strong> (úplně zmizí) a <strong>VE VÝVOJI</strong>.
            </p>
          </div>

          <div className="space-y-12 relative z-10">
            
            {/* Widgets Category */}
            <div className="bg-black/40 border border-mafia-gold/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(199,156,61,0.05)] hover:shadow-[0_0_30px_rgba(199,156,61,0.1)] transition-shadow">
              <div className="bg-mafia-gold/10 p-4 border-b border-mafia-gold/20 flex items-center gap-3">
                <Layout className="text-mafia-gold" size={20} />
                <h2 className="font-heading font-black tracking-widest text-mafia-gold uppercase">Plovoucí Widgety</h2>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {VISIBILITY_KEYS.filter(k => k.category === 'widgets').map(item => (
                  <div key={item.key} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3 text-white/80 group-hover:text-white">
                      {item.icon}
                      <span className="text-sm font-bold tracking-wide">{item.label}</span>
                    </div>
                    {renderStatusBadge(item.key)}
                  </div>
                ))}
              </div>
            </div>

            {/* Hlavní Menu Karta */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-2">
                <Layout size={14} /> KARTY V HLAVNÍM MENU
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {VISIBILITY_KEYS.filter(k => k.category === 'intro').map(item => (
                  <button 
                    key={item.key}
                    onClick={() => cycleSetting(item.key)}
                    className={`p-6 border transition-all flex items-center justify-between text-left ${
                      settings[item.key] === 'visible' ? 'border-mafia-gold bg-mafia-gold/10' : 
                      settings[item.key] === 'dev' ? 'border-blue-500 bg-blue-500/10' : 
                      settings[item.key] === 'locked' ? 'border-red-500 bg-red-500/10' :
                      'border-white/10 bg-black/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        settings[item.key] === 'visible' ? 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 
                        settings[item.key] === 'dev' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 
                        settings[item.key] === 'locked' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                        'bg-white/20'
                      }`}></div>
                      <div>
                        <div className="font-heading font-black tracking-widest uppercase mb-1">{item.label}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {settings[item.key] === 'visible' ? 'VIDITELNÉ' : 
                           settings[item.key] === 'dev' ? 'VE VÝVOJI' : 
                           settings[item.key] === 'locked' ? 'ZAMČENÉ' : 'SKRYTÉ'}
                        </div>
                      </div>
                    </div>
                    {settings[item.key] === 'visible' ? <Eye size={20} className="text-mafia-gold" /> : 
                     settings[item.key] === 'dev' ? <Save size={20} className="text-blue-500" /> : 
                     settings[item.key] === 'locked' ? <ShieldAlert size={20} className="text-red-500" /> :
                     <EyeOff size={20} className="text-white/40" />}
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
                    onClick={() => cycleSetting(item.key)}
                    className={`p-6 border transition-all flex items-center justify-between text-left ${
                      settings[item.key] === 'visible' ? 'border-mafia-gold bg-mafia-gold/10' : 
                      settings[item.key] === 'dev' ? 'border-blue-500 bg-blue-500/10' : 
                      settings[item.key] === 'locked' ? 'border-red-500 bg-red-500/10' :
                      'border-white/10 bg-black/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        settings[item.key] === 'visible' ? 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 
                        settings[item.key] === 'dev' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 
                        settings[item.key] === 'locked' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                        'bg-white/20'
                      }`}></div>
                      <div>
                        <div className="font-heading font-black tracking-widest uppercase mb-1">{item.label}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {settings[item.key] === 'visible' ? 'VIDITELNÉ' : 
                           settings[item.key] === 'dev' ? 'VE VÝVOJI' : 
                           settings[item.key] === 'locked' ? 'ZAMČENÉ' : 'SKRYTÉ'}
                        </div>
                      </div>
                    </div>
                    {settings[item.key] === 'visible' ? <Eye size={20} className="text-mafia-gold" /> : 
                     settings[item.key] === 'dev' ? <Save size={20} className="text-blue-500" /> : 
                     settings[item.key] === 'locked' ? <ShieldAlert size={20} className="text-red-500" /> :
                     <EyeOff size={20} className="text-white/40" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Komunita Karta */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-2 border-t border-white/5 pt-10">
                <Layout size={14} /> KOMUNITA A OSTATNÍ (KARTY)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {VISIBILITY_KEYS.filter(k => k.category === 'community').map(item => (
                  <button 
                    key={item.key}
                    onClick={() => cycleSetting(item.key)}
                    className={`p-6 border transition-all flex items-center justify-between text-left ${
                      settings[item.key] === 'visible' ? 'border-mafia-gold bg-mafia-gold/10' : 
                      settings[item.key] === 'dev' ? 'border-blue-500 bg-blue-500/10' : 
                      settings[item.key] === 'locked' ? 'border-red-500 bg-red-500/10' :
                      'border-white/10 bg-black/40 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        settings[item.key] === 'visible' ? 'bg-mafia-gold shadow-[0_0_10px_rgba(197,160,89,0.8)]' : 
                        settings[item.key] === 'dev' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 
                        settings[item.key] === 'locked' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                        'bg-white/20'
                      }`}></div>
                      <div>
                        <div className="font-heading font-black tracking-widest uppercase mb-1">{item.label}</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                          {settings[item.key] === 'visible' ? 'VIDITELNÉ' : 
                           settings[item.key] === 'dev' ? 'VE VÝVOJI' : 
                           settings[item.key] === 'locked' ? 'ZAMČENÉ' : 'SKRYTÉ'}
                        </div>
                      </div>
                    </div>
                    {settings[item.key] === 'visible' ? <Eye size={20} className="text-mafia-gold" /> : 
                     settings[item.key] === 'dev' ? <Save size={20} className="text-blue-500" /> : 
                     settings[item.key] === 'locked' ? <ShieldAlert size={20} className="text-red-500" /> :
                     <EyeOff size={20} className="text-white/40" />}
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
