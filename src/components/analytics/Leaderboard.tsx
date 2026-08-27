'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type UserStat = {
  id: string;
  totalTimeSec: number;
  totalPoints: number;
  pointsThisWeek: number;
  pointsThisMonth: number;
  pointsThisYear: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
};

export function Leaderboard() {
  const [filter, setFilter] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const [data, setData] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/leaderboard?filter=${filter}`)
      .then((res) => res.json())
      .then((stats) => {
        setData(Array.isArray(stats) ? stats : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load leaderboard', err);
        setLoading(false);
      });
  }, [filter]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getSortValue = (stat: UserStat) => {
    if (filter === 'week') return stat.pointsThisWeek;
    if (filter === 'month') return stat.pointsThisMonth;
    if (filter === 'year') return stat.pointsThisYear;
    return stat.totalPoints;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Vývojářský Žebříček Aktivity
          </h2>
          <p className="text-slate-400 text-sm mt-1">Sledujte, kdo tráví na platformě nejvíce času a přispívá.</p>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-xl">
          {(['week', 'month', 'year', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {f === 'week' && 'Tento Týden'}
              {f === 'month' && 'Tento Měsíc'}
              {f === 'year' && 'Tento Rok'}
              {f === 'all' && 'Celá Doba'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-sm">
              <th className="pb-4 font-semibold w-16 text-center">Rank</th>
              <th className="pb-4 font-semibold">Uživatel</th>
              <th className="pb-4 font-semibold text-right">Zásluhy (Body)</th>
              <th className="pb-4 font-semibold text-right w-32">Strávený čas</th>
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  Načítání žebříčku...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  Zatím žádná aktivita.
                </td>
              </tr>
            ) : (
              data.map((stat, idx) => (
                <tr 
                  key={stat.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                >
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                      ${idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                        idx === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' : 
                        idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' : 
                        'bg-slate-800 text-slate-500'}`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                        {stat.user.image ? (
                          <Image src={stat.user.image} alt="avatar" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 uppercase font-bold">
                            {stat.user.name?.[0] || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{stat.user.name || 'Neznámý'}</div>
                        <div className="text-xs text-slate-500">{stat.user.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-mono text-emerald-400 font-medium">
                    {getSortValue(stat).toLocaleString()}
                  </td>
                  <td className="py-4 text-right text-slate-400 text-sm">
                    {formatTime(stat.totalTimeSec)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
