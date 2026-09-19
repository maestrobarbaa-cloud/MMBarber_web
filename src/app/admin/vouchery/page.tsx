"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowLeft,
  Ticket,
  CheckCircle,
  Trash2,
  Mail,
  Phone,
  Clock,
  CreditCard,
  Gift,
  Settings,
  Save
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface VoucherRequest {
  id: string;
  date: string;
  status: "new" | "done";
  name: string;
  email: string;
  phone: string;
  amount: string;
  delivery: "electronic" | "physical";
  message: string;
}

export default function AdminVouchersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requests, setRequests] = useState<VoucherRequest[]>([]);
  const [giftPrice, setGiftPrice] = useState("150");
  const [presetAmounts, setPresetAmounts] = useState("100, 250, 500, 1000, 1500, 2000");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") !== "true") {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      loadRequests();
      loadSettings();
    }
  }, [router]);

  const loadSettings = async () => {
    try {
      const resGift = await fetch('/api/settings?key=voucher_gift_price');
      if (resGift.ok) {
        const data = await resGift.json();
        if (data.value) setGiftPrice(data.value);
      }
      const resPresets = await fetch('/api/settings?key=voucher_preset_amounts');
      if (resPresets.ok) {
        const data = await resPresets.json();
        if (data.value) setPresetAmounts(data.value);
      }
    } catch (e) {}
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: {
            voucher_gift_price: giftPrice,
            voucher_preset_amounts: presetAmounts
          }
        })
      });
      alert("Nastavení uloženo.");
    } catch (e) {
      alert("Chyba při ukládání.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const loadRequests = () => {
    const saved = localStorage.getItem("mmbarber_voucher_requests");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Sort newest first
        parsed.sort((a: VoucherRequest, b: VoucherRequest) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRequests(parsed);
      } catch (e) {
        console.error("Failed to parse voucher requests");
      }
    }
  };

  const updateRequestStatus = (id: string, newStatus: "new" | "done") => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRequests(updated);
    localStorage.setItem("mmbarber_voucher_requests", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const deleteRequest = (id: string) => {
    if (window.confirm("Opravdu smazat tento požadavek? Akce je nevratná.")) {
      const updated = requests.filter(r => r.id !== id);
      setRequests(updated);
      localStorage.setItem("mmbarber_voucher_requests", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleApprove = (req: VoucherRequest) => {
    if (req.delivery === 'electronic') {
      const subject = encodeURIComponent("Váš dárkový poukaz MMBarber");
      const body = encodeURIComponent(`Dobrý den,\n\npotvrzujeme přijetí platby za váš dárkový poukaz v hodnotě ${req.amount} Kč.\n\nV příloze tohoto e-mailu naleznete váš poukaz.\n\nTěšíme se na vaši návštěvu,\nMMBarber`);
      window.location.href = `mailto:${req.email}?subject=${subject}&body=${body}`;
    }
    updateRequestStatus(req.id, "done");
  };

  if (!isAuthenticated) return null;

  const newCount = requests.filter(r => r.status === "new").length;

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-8 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="text-mafia-gold" size={24} />
              <h1 className="text-3xl md:text-4xl font-heading font-black uppercase italic tracking-tighter">
                SPRÁVA <span className="text-mafia-gold">VOUCHERŮ</span>
              </h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">MMBARBER_VOUCHER_CONTROL_V1</p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/admin" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> ZPĚT DO CENTRÁLY
            </Link>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center text-center">
             <span className="text-mafia-red font-heading font-black text-4xl mb-2">{newCount}</span>
             <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Nové požadavky</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 flex flex-col items-center justify-center text-center">
             <span className="text-mafia-gold font-heading font-black text-4xl mb-2">{requests.length}</span>
             <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Celkem žádostí</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 flex items-center justify-center text-center opacity-50">
             <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] leading-relaxed">
               Zpracované žádosti označte jako vyřízené pro vymazání notifikace.
             </span>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-16 bg-white/[0.02] border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-mafia-gold" size={20} />
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-widest italic">Nastavení voucherů</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Cena dárkového balení (Kč)</label>
              <input 
                type="number" 
                value={giftPrice}
                onChange={(e) => setGiftPrice(e.target.value)}
                className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Předvolené částky (oddělené čárkou)</label>
              <input 
                type="text" 
                value={presetAmounts}
                onChange={(e) => setPresetAmounts(e.target.value)}
                className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none"
                placeholder="500, 1000, 1500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="flex items-center gap-2 px-8 py-3 bg-mafia-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              <Save size={14} /> {isSavingSettings ? "Ukládám..." : "Uložit nastavení"}
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/[0.02]">
              <Ticket size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Žádné požadavky na vouchery</p>
            </div>
          ) : (
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div 
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`border p-6 md:p-8 relative overflow-hidden transition-colors ${
                    req.status === 'new' 
                      ? 'bg-mafia-gold/5 border-mafia-gold/30' 
                      : 'bg-white/5 border-white/10 opacity-70'
                  }`}
                >
                  {req.status === 'new' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-mafia-gold/20 blur-[30px] rounded-full"></div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                        {req.status === 'new' && (
                          <span className="px-3 py-1 bg-mafia-red text-white font-black text-[9px] uppercase tracking-widest font-mono">NOVÉ</span>
                        )}
                        <span className="flex items-center gap-2 text-[10px] font-mono text-white/40 tracking-widest">
                          <Clock size={12} /> {new Date(req.date).toLocaleString('cs-CZ')}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-heading font-black text-white uppercase italic tracking-widest mb-1">
                          {req.name}
                        </h2>
                        <span className="text-mafia-gold font-mono text-sm tracking-widest">HODNOTA: {req.amount} Kč</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm text-smoke-white/80">
                          <Mail size={16} className="text-mafia-gold/50" /> {req.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-smoke-white/80">
                          <Phone size={16} className="text-mafia-gold/50" /> {req.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-smoke-white/80">
                          {req.delivery === 'electronic' ? (
                            <><CreditCard size={16} className="text-mafia-gold/50" /> Převod / Elektronicky</>
                          ) : (
                            <><Gift size={16} className="text-mafia-gold/50" /> Hotově na salonu</>
                          )}
                        </div>
                      </div>

                      {req.message && (
                        <div className="bg-black/50 border border-white/5 p-4 text-sm text-smoke-white/60 italic">
                          "{req.message}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col justify-end gap-3 md:min-w-[180px]">
                      {req.status === 'new' ? (
                        <button 
                          onClick={() => handleApprove(req)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-mafia-gold text-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors text-center"
                        >
                          <CheckCircle size={14} className="shrink-0" /> 
                          {req.delivery === 'electronic' ? "SCHVÁLIT PLATBU A ODESLAT" : "PŘIPRAVENO K VYZVEDNUTÍ"}
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateRequestStatus(req.id, "new")}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest hover:border-white transition-colors"
                        >
                          ZPĚT NA NOVÉ
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteRequest(req.id)}
                        className="flex-none flex items-center justify-center gap-2 px-6 py-4 bg-mafia-red/10 border border-mafia-red/30 text-mafia-red font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-red hover:text-white transition-colors"
                      >
                        <Trash2 size={14} /> SMAZAT
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  );
}
