"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string | null;
  totalAvailable: number;
  usedCount: number;
  isActive: boolean;
}

export default function VoucherManager() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<Partial<Voucher>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await fetch("/api/company/vouchers");
      if (res.ok) {
        const data = await res.json();
        setVouchers(data);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const url = currentVoucher.id 
      ? `/api/company/vouchers/${currentVoucher.id}`
      : "/api/company/vouchers";
      
    const method = currentVoucher.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentVoucher),
      });

      if (res.ok) {
        await fetchVouchers();
        setIsEditing(false);
        setCurrentVoucher({});
      }
    } catch (error) {
      console.error("Failed to save voucher", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete tento voucher smazat?")) return;
    
    try {
      const res = await fetch(`/api/company/vouchers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchVouchers();
      }
    } catch (error) {
      console.error("Failed to delete voucher", error);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Správa Voucherů</h2>
        <button
          onClick={() => { setCurrentVoucher({ isActive: true }); setIsEditing(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-mafia-gold text-black font-bold rounded hover:bg-yellow-600 transition-colors"
        >
          <Plus size={18} />
          Přidat Voucher
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="mb-8 p-4 bg-black/50 border border-zinc-700 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">
            {currentVoucher.id ? "Upravit Voucher" : "Nový Voucher"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Název voucheru *</label>
              <input
                required
                type="text"
                value={currentVoucher.title || ""}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                placeholder="Např. 1+1 Káva zdarma"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Hodnota / Sleva *</label>
              <input
                required
                type="text"
                value={currentVoucher.discount || ""}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, discount: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                placeholder="Např. 100 Kč, 20%, 1+1..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-1">Popis *</label>
              <textarea
                required
                value={currentVoucher.description || ""}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, description: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
                rows={3}
                placeholder="Popište na co lze voucher uplatnit a jaké jsou podmínky."
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Slevový kód (volitelné)</label>
              <input
                type="text"
                value={currentVoucher.code || ""}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, code: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono uppercase"
                placeholder="Např. RANDE2024"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Celkový počet (0 = neomezeně)</label>
              <input
                type="number"
                min="0"
                value={currentVoucher.totalAvailable || 0}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, totalAvailable: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="flex items-center gap-2 mt-4 md:col-span-2">
              <input
                type="checkbox"
                id="isActive"
                checked={currentVoucher.isActive !== false}
                onChange={(e) => setCurrentVoucher({ ...currentVoucher, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-mafia-gold focus:ring-mafia-gold"
              />
              <label htmlFor="isActive" className="text-sm text-white cursor-pointer">Aktivní (zobrazuje se uživatelům po matchi)</label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-mafia-gold text-black font-bold rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {saving ? "Ukládám..." : "Uložit voucher"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700"
            >
              Zrušit
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-zinc-400 text-center py-8">Načítám vouchery...</div>
      ) : vouchers.length === 0 ? (
        <div className="text-zinc-500 text-center py-8 border border-dashed border-zinc-700 rounded-lg">
          Zatím nemáte vytvořené žádné vouchery pro matches.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vouchers.map(voucher => (
            <div key={voucher.id} className={`p-4 rounded-lg border ${voucher.isActive ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-800 bg-zinc-900 opacity-70'} flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-white">{voucher.title}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => { setCurrentVoucher(voucher); setIsEditing(true); }} className="text-zinc-400 hover:text-white" title="Upravit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(voucher.id)} className="text-zinc-400 hover:text-red-500" title="Smazat">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-mafia-gold font-bold mb-2 text-xl">{voucher.discount}</div>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{voucher.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-700/50">
                <div className="text-xs text-zinc-500">
                  Využito: <span className="text-white font-mono">{voucher.usedCount}</span>
                  {voucher.totalAvailable > 0 && ` / ${voucher.totalAvailable}`}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {voucher.isActive ? (
                    <><CheckCircle2 size={14} className="text-green-500" /> <span className="text-green-500">Aktivní</span></>
                  ) : (
                    <><XCircle size={14} className="text-zinc-500" /> <span className="text-zinc-500">Neaktivní</span></>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
