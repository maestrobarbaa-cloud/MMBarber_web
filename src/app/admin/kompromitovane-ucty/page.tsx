"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Trash2, CheckCircle2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  email: string;
  status: string;
  ipAddress: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export default function AdminCompromisedAccounts() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchReports = async () => {
      try {
        const res = await fetch('/api/admin/compromised');
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Opravdu smazat tento záznam? Účet zůstane beze změny.")) return;
    try {
      await fetch(`/api/admin/compromised?id=${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (error) { console.error(error); }
  };

  const handleResolveAdmin = async (id: string) => {
    if (!confirm("Tímto smažete uživatelský účet spojený s tímto e-mailem, i když uživatel neklikl na ověřovací odkaz. Pokračovat?")) return;
    try {
      const res = await fetch(`/api/admin/compromised`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete_user' })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'RESOLVED_BY_ADMIN' } : r));
      } else {
        alert("Chyba při mazání účtu.");
      }
    } catch (error) { console.error(error); }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleString("cs-CZ", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

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
    <div className="min-h-screen bg-mafia-black text-smoke-white p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-mafia-gold/20">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="w-10 h-10 border border-mafia-gold/30 flex items-center justify-center text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] flex items-center gap-3">
                <ShieldAlert size={28} className="text-mafia-red" />
                Zcizené Účty
              </h1>
              <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">
                Bezpečnostní hlášení
              </p>
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-mafia-gold py-12 uppercase tracking-widest">Načítám hlášení...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 border border-white/5 bg-white/5">
            <CheckCircle2 size={40} className="mx-auto text-green-500 mb-4 opacity-50" />
            <p className="text-white/40 uppercase tracking-widest">Žádná nová hlášení</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-black/40 border border-mafia-gold/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-mafia-gold/50 transition-colors">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      report.status === 'PENDING' ? 'bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/30' :
                      report.status === 'VERIFIED' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-white text-lg font-bold">{report.email}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-white/50">
                    <div>Nahlášeno: <span className="text-white/80">{formatDate(report.createdAt)}</span></div>
                    <div>Vyřešeno: <span className="text-white/80">{formatDate(report.resolvedAt)}</span></div>
                    <div>IP: <span className="text-white/80">{report.ipAddress || 'N/A'}</span></div>
                    <div>ID: <span className="text-white/30 text-xs">{report.id}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report.status === 'PENDING' && (
                    <button 
                      onClick={() => handleResolveAdmin(report.id)}
                      className="px-4 py-2 bg-mafia-red/20 text-mafia-red hover:bg-mafia-red hover:text-white border border-mafia-red/30 transition-colors uppercase text-xs tracking-widest flex items-center gap-2 font-bold"
                    >
                      <Trash2 size={14} /> Vynutit Smazání
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 border border-white/10 text-white/40 hover:text-mafia-red hover:border-mafia-red/30 transition-colors"
                    title="Smazat hlášení (odstraní jen záznam z historie)"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
