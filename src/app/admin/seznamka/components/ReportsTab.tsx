"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, UserX, RefreshCcw } from "lucide-react";

export function ReportsTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seznamka/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (action: 'reset' | 'ban' | 'unban', profileId: string, userId: string) => {
    const actionText = action === 'reset' ? 'resetovat reporty' : action === 'ban' ? 'zabanovat uživatele' : 'odbanovat uživatele';
    if (!confirm(`Opravdu chcete ${actionText}?`)) return;

    try {
      const res = await fetch('/api/admin/seznamka/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, profileId, userId })
      });
      if (res.ok) {
        fetchReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-mafia-gold">
        <ShieldAlert /> Ohrožené a nahlášené profily
      </h2>
      
      {loading ? (
        <p className="text-white/40">Načítání...</p>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-white/40 font-mono">
           Žádné nahlášené profily
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map(profile => (
            <div key={profile.id} className="border border-red-900/50 bg-red-900/10 p-5 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{profile.name} <span className="text-white/40 text-sm">({profile.age})</span></h3>
                    <p className="text-white/50 text-xs font-mono mb-2">{profile.user?.email}</p>
                    <div className="flex gap-4 text-sm mt-4">
                        <div className="bg-black/50 px-3 py-1 border border-white/10 rounded">
                            Trust Score: <span className={profile.trustScore < 50 ? 'text-red-500' : 'text-yellow-500'}>{profile.trustScore}</span>
                        </div>
                        <div className="bg-black/50 px-3 py-1 border border-white/10 rounded">
                            Reporty: <span className="text-red-500 font-bold">{profile.reportsCount}</span>
                        </div>
                        {profile.user?.isShadowBanned && (
                             <div className="bg-red-900 px-3 py-1 border border-red-500 rounded text-white font-bold">
                                ZABANOVÁN
                             </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <button 
                        onClick={() => handleAction('reset', profile.id, profile.userId)}
                        className="flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        <RefreshCcw size={14} /> Resetovat Skóre
                    </button>
                    {!profile.user?.isShadowBanned ? (
                        <button 
                            onClick={() => handleAction('ban', profile.id, profile.userId)}
                            className="flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-900 transition-colors"
                        >
                            <UserX size={14} /> Zabanovat
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleAction('unban', profile.id, profile.userId)}
                            className="flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-green-900/40 text-green-400 hover:bg-green-900/60 border border-green-900 transition-colors"
                        >
                            <UserX size={14} /> Zrušit Ban
                        </button>
                    )}
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
