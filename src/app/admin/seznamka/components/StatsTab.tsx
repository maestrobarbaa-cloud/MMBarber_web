"use client";

import { useState, useEffect } from "react";
import { Activity, Settings, Save, Users, HeartHandshake, MousePointerClick } from "lucide-react";

export function StatsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ [key: string]: string }>({});

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seznamka/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json.stats);
        
        // Initialize settings with defaults if not present
        setSettings({
            seznamka_daily_swipes_limit: json.settings.seznamka_daily_swipes_limit || "15",
            seznamka_match_cost: json.settings.seznamka_match_cost || "1",
            seznamka_relaxed_search_enabled: json.settings.seznamka_relaxed_search_enabled || "true",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/seznamka/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Nastavení uloženo");
      }
    } catch (e) {
      console.error(e);
      alert("Chyba při ukládání");
    }
  };

  if (loading || !data) {
      return <div className="text-white/40">Načítání...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Statistiky */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-mafia-gold">
            <Activity /> Statistiky Systému
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Users size={16} /> Celkem Profilů
                </div>
                <div className="text-4xl font-bold text-white font-mono">{data.totalProfiles}</div>
                <div className="text-xs text-white/40 mt-2">
                    Muži: {data.maleCount} | Ženy: {data.femaleCount}
                </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <div className="flex items-center gap-2 text-white/50 mb-2">
                    <HeartHandshake size={16} /> Aktivní Shody
                </div>
                <div className="text-4xl font-bold text-mafia-gold font-mono">{data.totalMatches}</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-lg col-span-2">
                <div className="flex items-center gap-2 text-white/50 mb-2">
                    <MousePointerClick size={16} /> Celkem Swipů (Lajků/Odmítnutí)
                </div>
                <div className="text-4xl font-bold text-white font-mono">{data.totalSwipes}</div>
            </div>
        </div>
      </div>

      {/* Nastavení */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-mafia-gold">
            <Settings /> Globální Proměnné
        </h2>

        <div className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-lg">
            <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Denní limit přejetí (Swipes)</label>
                <input 
                    type="number" 
                    value={settings.seznamka_daily_swipes_limit} 
                    onChange={e => setSettings({...settings, seznamka_daily_swipes_limit: e.target.value})}
                    className="w-full bg-black border border-white/20 p-3 text-white font-mono"
                />
                <p className="text-xs text-white/40 mt-1">Kolik profilů může uživatel ohodnotit za den zdarma.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Cena za manuální propojení (v úlomcích/mincích)</label>
                <input 
                    type="number" 
                    value={settings.seznamka_match_cost} 
                    onChange={e => setSettings({...settings, seznamka_match_cost: e.target.value})}
                    className="w-full bg-black border border-white/20 p-3 text-white font-mono"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-white/70 mb-2">Povolit Waitlist / Relaxed Search</label>
                <select 
                    value={settings.seznamka_relaxed_search_enabled} 
                    onChange={e => setSettings({...settings, seznamka_relaxed_search_enabled: e.target.value})}
                    className="w-full bg-black border border-white/20 p-3 text-white font-mono"
                >
                    <option value="true">Zapnuto (Povolit čekárnu)</option>
                    <option value="false">Vypnuto (Striktní vyhledávání)</option>
                </select>
            </div>

            <button 
                onClick={handleSaveSettings}
                className="w-full flex items-center justify-center gap-2 py-3 bg-mafia-gold text-mafia-black font-bold uppercase tracking-widest hover:bg-white transition-colors mt-8"
            >
                <Save size={18} /> Uložit Nastavení
            </button>
        </div>
      </div>
    </div>
  );
}
