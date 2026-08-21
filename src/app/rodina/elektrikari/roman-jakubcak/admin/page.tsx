"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Save, Loader2, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RomanAdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Test password by making a dry-run fetch or just verifying via the update route?
      // Better: we can fetch prices without auth, but we only show the form if they pass local check (just UX)
      if (password === "roman123") {
        setIsAuthenticated(true);
        fetchPrices();
      } else {
        setMessage({ text: "Nesprávné heslo", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Chyba přihlášení", type: "error" });
    }
    setLoading(false);
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch("/api/electrician-prices");
      if (res.ok) {
        const data = await res.json();
        if (data.prices) {
          setPrices(data.prices);
        }
      }
    } catch (err) {
      console.error("Failed to fetch prices:", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/electrician-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, prices }),
      });

      if (res.ok) {
        setMessage({ text: "Ceny úspěšně uloženy!", type: "success" });
      } else {
        setMessage({ text: "Nepodařilo se uložit ceny (špatné heslo?)", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Chyba při ukládání", type: "error" });
    }
    setLoading(false);
  };

  const handlePriceChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    setPrices(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative">
          <Link href="/rodina/elektrikari/roman-jakubcak" className="absolute top-6 left-6 text-slate-500 hover:text-cyan-400 transition-colors" title="Zpět na profil">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Lock className="text-cyan-400" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-100 text-center mb-2 uppercase tracking-widest">Admin Panel</h1>
          <p className="text-slate-400 text-center text-sm mb-8">Zadejte heslo pro úpravu cen kalkulačky</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vaše heslo..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-center font-mono tracking-widest"
              />
            </div>
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {message.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest py-3 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Vstoupit"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Grouping prices for better UI
  const groups = [
    {
      title: "Typy Objektů a Projektů (Základní cena)",
      keys: [
        { key: "byt", label: "Byt" },
        { key: "dum", label: "Dům" },
        { key: "komerce", label: "Komerce" },
        { key: "hala", label: "Hala" },
        { key: "dum_mult", label: "Dům Násobič pracnosti" },
        { key: "komerce_mult", label: "Komerce Násobič pracnosti" },
        { key: "hala_mult", label: "Hala Násobič pracnosti" },
        { key: "remodel", label: "Rekonstrukce (příplatek)" },
        { key: "service", label: "Servis/Oprava (příplatek)" },
      ]
    },
    {
      title: "Rozvaděče a Infrastruktura",
      keys: [
        { key: "subpanel", label: "Podružný rozvaděč" },
        { key: "panel100A", label: "Hlavní rozvaděč 100A" },
        { key: "panel200A", label: "Hlavní rozvaděč 200A" },
        { key: "panel400A", label: "Hlavní rozvaděč 400A" },
        { key: "smartPanel", label: "Smart Home Jádro (Loxone/KNX)" },
        { key: "dataRack", label: "Datový Rack (IT Sítě)" },
        { key: "solarPrep", label: "Příprava pro FVE" },
        { key: "bessPrep", label: "Příprava pro BESS" },
      ]
    },
    {
      title: "Hrubé práce (za 1m)",
      keys: [
        { key: "milling", label: "Frézování drážek (Kč/m)" },
        { key: "wirePulling", label: "Tahání kabeláže (Kč/m)" },
        { key: "ledStrips", label: "LED profily vč. pásku (Kč/m)" },
      ]
    },
    {
      title: "Prvky a koncová zařízení (za 1 ks)",
      keys: [
        { key: "sockets", label: "Běžné zásuvky/vypínače 230V" },
        { key: "smartSockets", label: "Smart/Touch prvky" },
        { key: "dataSockets", label: "Datové zásuvky RJ45" },
        { key: "lights", label: "Vývody pro běžná světla" },
        { key: "recessed", label: "Bodová světla (SDK)" },
        { key: "outdoorLight", label: "Venkovní světla" },
        { key: "cctv", label: "Kamera (PoE CCTV)" },
        { key: "security", label: "Zabezpečení (čidlo)" },
        { key: "detectors", label: "Požární/CO2 detektor" },
      ]
    },
    {
      title: "Dedikované okruhy",
      keys: [
        { key: "hvac", label: "Klimatizace/Tepelné čerp." },
        { key: "ev", label: "EV Nabíječka" },
        { key: "induction", label: "Indukční deska" },
      ]
    },
    {
      title: "Služby a ostatní",
      keys: [
        { key: "surgeProtection", label: "Přepěťová ochrana T1+2+3" },
        { key: "thermo", label: "Termovizní diagnostika" },
        { key: "projectDocs", label: "Projektová dokumentace" },
        { key: "plasteringBase", label: "Začištění za 1 ks prvku" },
        { key: "plasteringMilling", label: "Začištění za 1 m drážky" },
        { key: "cleanup", label: "Stavební úklid" },
        { key: "revision", label: "Revizní zpráva" },
        { key: "hours", label: "Hodinová sazba (vícepráce)" },
        { key: "expressMult", label: "Násobič za expres/víkend" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans pb-32">
      <div className="max-w-7xl mx-auto">
        <Link href="/rodina/elektrikari/roman-jakubcak" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-8 transition-colors font-mono text-sm uppercase tracking-widest">
          <ArrowLeft size={16} /> Zpět na domovskou stránku
        </Link>
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
              <Zap className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-100 uppercase tracking-widest mb-1">Editor Cen</h1>
              <p className="text-slate-400 text-base md:text-lg">Roman Jakubčák - Kalkulačka</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Uložit změny
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-8 border ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-12">
          {groups.map((group, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-8 uppercase tracking-widest border-b border-cyan-500/20 pb-6">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {group.keys.map((item) => (
                  <div key={item.key} className="flex flex-col gap-3">
                    <label className="text-sm md:text-base text-slate-400 font-mono">{item.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step={item.key.includes("mult") ? "0.1" : "1"}
                        value={prices[item.key] ?? 0}
                        onChange={(e) => handlePriceChange(item.key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 px-6 py-4 text-lg md:text-xl rounded-xl focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                      />
                      {item.key.includes("mult") ? null : (
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm md:text-base text-slate-500 pointer-events-none font-bold">Kč</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Fixed Save Bar for Mobile */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex justify-center md:hidden">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Uložit změny
          </button>
        </div>

      </div>
    </div>
  );
}
