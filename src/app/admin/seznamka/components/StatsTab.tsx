"use client";

import { useState, useEffect } from "react";
import { Activity, Settings, Save, Users, HeartHandshake, MousePointerClick, PieChart as PieChartIcon, MapPin } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#D4AF37', '#8B0000', '#C0C0C0', '#4A5568', '#2D3748', '#1A202C'];

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
      <div className="space-y-8">
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

        {/* Fragment Location */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-mafia-gold">
              <MapPin /> Lokace Fragmentu
          </h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
              {data.activeSpawn ? (
                  <div>
                      <div className="text-sm text-white/50 mb-1">Aktivní spawn:</div>
                      <div className="text-lg font-mono text-white mb-2">{data.activeSpawn.locationId}</div>
                      <div className="text-xs text-white/30">Expiruje: {new Date(data.activeSpawn.expiresAt).toLocaleString('cs-CZ')}</div>
                  </div>
              ) : (
                  <div className="text-white/40 italic">Žádný aktivní fragment pro dnešek.</div>
              )}
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-mafia-gold">
              <PieChartIcon /> Oblíbené kategorie (Hledá)
          </h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-lg h-[300px]">
              {data.categories && data.categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={data.categories}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                              {data.categories.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#1A202C', borderColor: '#333' }}
                              itemStyle={{ color: '#fff' }}
                          />
                      </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="flex h-full items-center justify-center text-white/40">Zatím žádná data</div>
              )}
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
