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
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 bg-gradient-to-r from-mafia-gold to-yellow-400 text-transparent bg-clip-text uppercase tracking-widest">
              <Activity className="text-mafia-gold" /> Statistiky Systému
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
              {/* Celkem Profilů */}
              <div className="bg-black/60 backdrop-blur-xl border border-mafia-gold/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(197,160,89,0.05)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500 group">
                  <div className="flex items-center gap-3 text-white/50 mb-4 font-mono text-xs uppercase tracking-widest">
                      <div className="bg-mafia-gold/10 p-2 rounded-full text-mafia-gold group-hover:scale-110 transition-transform">
                          <Users size={16} />
                      </div>
                      Celkem Profilů
                  </div>
                  <div className="text-5xl font-black text-white font-mono">{data.totalProfiles}</div>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/40 mt-4 border-t border-white/5 pt-4">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Muži: {data.maleCount}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Ženy: {data.femaleCount}</span>
                  </div>
              </div>
              
              {/* Aktivní Shody */}
              <div className="bg-black/60 backdrop-blur-xl border border-mafia-gold/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(197,160,89,0.05)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500 group">
                  <div className="flex items-center gap-3 text-white/50 mb-4 font-mono text-xs uppercase tracking-widest">
                      <div className="bg-mafia-gold/10 p-2 rounded-full text-mafia-gold group-hover:scale-110 transition-transform">
                          <HeartHandshake size={16} />
                      </div>
                      Aktivní Shody
                  </div>
                  <div className="text-5xl font-black text-mafia-gold font-mono">{data.totalMatches}</div>
              </div>
              
              {/* Celkem Zpráv */}
              <div className="bg-black/60 backdrop-blur-xl border border-mafia-gold/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(197,160,89,0.05)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(197,160,89,0.15)] transition-all duration-500 group">
                  <div className="flex items-center gap-3 text-white/50 mb-4 font-mono text-xs uppercase tracking-widest">
                      <div className="bg-blue-500/10 p-2 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                          <MousePointerClick size={16} />
                      </div>
                      Celkem Zpráv
                  </div>
                  <div className="text-5xl font-black text-white font-mono">{data.totalMessages}</div>
              </div>

              {/* Nahlášení */}
              <div className="bg-black/60 backdrop-blur-xl border border-red-500/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.05)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] transition-all duration-500 group">
                  <div className="flex items-center gap-3 text-red-400/70 mb-4 font-mono text-xs uppercase tracking-widest">
                      <div className="bg-red-500/10 p-2 rounded-full text-red-500 group-hover:scale-110 transition-transform">
                          <Activity size={16} />
                      </div>
                      Nahlášení
                  </div>
                  <div className="text-5xl font-black text-red-500 font-mono drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{data.totalReports}</div>
              </div>

              {/* Celkem Swipů */}
              <div className="bg-black/60 backdrop-blur-xl border border-mafia-gold/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(197,160,89,0.05)] col-span-2 group">
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 text-white/50 font-mono text-xs uppercase tracking-widest">
                          <div className="bg-mafia-gold/10 p-2 rounded-full text-mafia-gold group-hover:rotate-12 transition-transform">
                              <MousePointerClick size={16} />
                          </div>
                          Engagement (Swipy)
                      </div>
                      <div className="text-4xl font-black text-white font-mono">{data.totalSwipes}</div>
                  </div>
                  
                  {data.totalSwipes > 0 && (
                      <div className="mt-4">
                          <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
                              <span className="text-green-400 flex items-center gap-1"><HeartHandshake size={12}/> {data.likesCount} Lajků</span>
                              <span className="text-mafia-gold">Win Rate: {((data.likesCount / data.totalSwipes) * 100).toFixed(1)}%</span>
                              <span className="text-red-400 flex items-center gap-1">{data.passesCount} Odmítnutí</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full h-3 bg-red-500/20 rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full relative"
                                style={{ width: `${(data.likesCount / data.totalSwipes) * 100}%` }}
                              >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
        </div>

        {/* Fragment Location */}
        <div>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
              <div className="bg-purple-500/10 p-2 rounded-full text-purple-400">
                  <MapPin size={18} />
              </div>
              Lokace Fragmentu
          </h2>
          <div className="bg-black/60 backdrop-blur-xl border border-purple-500/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
              {data.activeSpawn ? (
                  <div className="relative z-10">
                      <div className="text-xs font-mono uppercase tracking-widest text-purple-400/70 mb-2">Aktivní spawn bod:</div>
                      <div className="text-3xl font-black font-mono text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">{data.activeSpawn.locationId}</div>
                      <div className="text-xs font-mono text-white/40 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> 
                          Expiruje: {new Date(data.activeSpawn.expiresAt).toLocaleString('cs-CZ')}
                      </div>
                  </div>
              ) : (
                  <div className="text-white/40 italic font-mono text-sm relative z-10">Žádný aktivní fragment pro dnešek.</div>
              )}
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories Pie Chart */}
            <div>
            <h2 className="text-lg font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
                <div className="bg-blue-500/10 p-2 rounded-full text-blue-400">
                    <PieChartIcon size={18} />
                </div>
                Hledá
            </h2>
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl h-[300px] hover:border-white/20 transition-colors">
                {data.categories && data.categories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.categories}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                innerRadius={40}
                                stroke="rgba(255,255,255,0.05)"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.categories.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-white/40 font-mono text-sm">Zatím žádná data</div>
                )}
            </div>
            </div>

            {/* Age Groups Chart */}
            <div>
            <h2 className="text-lg font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
                <div className="bg-green-500/10 p-2 rounded-full text-green-400">
                    <PieChartIcon size={18} />
                </div>
                Věkové Rozložení
            </h2>
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl h-[300px] hover:border-white/20 transition-colors">
                {data.ageGroups && data.ageGroups.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.ageGroups}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                innerRadius={40}
                                stroke="rgba(255,255,255,0.05)"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.ageGroups.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-white/40 font-mono text-sm">Zatím žádná data</div>
                )}
            </div>
            </div>
        </div>

        {/* Top Cities */}
        <div>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-widest">
              <div className="bg-rose-500/10 p-2 rounded-full text-rose-400">
                  <Activity size={18} />
              </div>
              Top Města
          </h2>
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
              {data.topCities && data.topCities.length > 0 ? (
                  <div className="space-y-4">
                      {data.topCities.map((city: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                              <span className="text-white font-bold">{city.name}</span>
                              <div className="flex items-center gap-3">
                                  <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                                      <div className="h-full bg-mafia-gold rounded-full" style={{ width: `${(city.value / data.topCities[0].value) * 100}%` }}></div>
                                  </div>
                                  <span className="text-mafia-gold font-mono font-black">{city.value} profilů</span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-white/40 italic font-mono text-sm">Zatím žádná data o městech.</div>
              )}
          </div>
        </div>
      </div>

      {/* Nastavení */}
      <div>
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-widest">
            <div className="bg-white/10 p-2 rounded-full text-white">
                <Settings size={20} />
            </div>
            Globální Proměnné
        </h2>

        <div className="space-y-6 bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl sticky top-8">
            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-3">Denní limit přejetí (Swipes)</label>
                <input 
                    type="number" 
                    value={settings.seznamka_daily_swipes_limit} 
                    onChange={e => setSettings({...settings, seznamka_daily_swipes_limit: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 p-4 text-white font-mono rounded-xl focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold outline-none transition-all"
                />
                <p className="text-xs text-white/40 mt-2 font-mono">Kolik profilů může uživatel ohodnotit za den zdarma.</p>
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-3">Cena za manuální propojení (v úlomcích/mincích)</label>
                <input 
                    type="number" 
                    value={settings.seznamka_match_cost} 
                    onChange={e => setSettings({...settings, seznamka_match_cost: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 p-4 text-white font-mono rounded-xl focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/70 mb-3">Povolit Waitlist / Relaxed Search</label>
                <select 
                    value={settings.seznamka_relaxed_search_enabled} 
                    onChange={e => setSettings({...settings, seznamka_relaxed_search_enabled: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 p-4 text-white font-mono rounded-xl focus:border-mafia-gold focus:ring-1 focus:ring-mafia-gold outline-none transition-all cursor-pointer"
                >
                    <option value="true">Zapnuto (Povolit čekárnu)</option>
                    <option value="false">Vypnuto (Striktní vyhledávání)</option>
                </select>
            </div>

            <button 
                onClick={handleSaveSettings}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-mafia-gold to-yellow-500 text-black font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] rounded-xl transition-all duration-300 mt-8"
            >
                <Save size={20} /> Uložit Nastavení
            </button>
        </div>
      </div>
    </div>
  );
}
