"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Battery, Weight, Target, Crosshair, X, Scissors, Info, Gauge, Shield, ShieldCheck, ZapOff, Activity, Cog, Sparkles, Wind, Droplet, Layers, Plus, Edit2, Trash2, Save, Trash } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { motion, AnimatePresence } from 'framer-motion';

// Namapování stringů na skutečné ikony (protože z DB přijde string)
const ICON_MAP: Record<string, any> = {
  Scissors, Zap, Shield, Sparkles, Activity, Weight, Cog, ShieldCheck, Gauge, Battery, ZapOff, Layers, Wind, Droplet, Crosshair, Target
};

const TIERS = {
  "Legendární": { color: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/10", shadow: "shadow-purple-400/20" },
  "Špičkový": { color: "text-cyan-400", border: "border-cyan-400/30", bg: "bg-cyan-400/10", shadow: "shadow-cyan-400/20" },
  "Dobrý": { color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10", shadow: "shadow-emerald-400/20" },
  "Zlatý střed": { color: "text-green-500", border: "border-green-500/30", bg: "bg-green-500/10", shadow: "shadow-green-500/20" },
  "Příležitostný": { color: "text-yellow-600", border: "border-yellow-600/30", bg: "bg-yellow-600/10", shadow: "shadow-yellow-600/20" },
  "Zklamání": { color: "text-orange-500", border: "border-orange-500/30", bg: "bg-orange-500/10", shadow: "shadow-orange-500/20" },
  "Špatný": { color: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10", shadow: "shadow-red-500/20" },
  "Trápení": { color: "text-red-700", border: "border-red-700/30", bg: "bg-red-700/10", shadow: "shadow-red-700/20" },
  "Odpad": { color: "text-red-900", border: "border-red-900/30", bg: "bg-red-900/10", shadow: "shadow-red-900/20" },
};

type ToolCategory = 'Clipper' | 'Trimmer' | 'Shaver' | 'Nůžky' | 'Hřeben' | 'Jiné';

const DEFAULT_STATS: Record<string, ToolStat[]> = {
  'Shaver': [
    { label: "Planžeta", value: 50, icon: "Layers" },
    { label: "Výkon", value: 50, icon: "Zap" },
    { label: "Váha", value: 50, icon: "Weight" },
    { label: "Zpracování", value: 50, icon: "Shield" },
    { label: "Baterie a výdrž", value: 50, icon: "Battery" },
    { label: "Nabíjení", value: 50, icon: "ZapOff" }
  ],
  'Clipper': [
    { label: "Hlavice a nože", value: 50, icon: "Scissors" },
    { label: "Motor", value: 50, icon: "Zap" },
    { label: "Zpracování", value: 50, icon: "Shield" },
    { label: "Design", value: 50, icon: "Sparkles" },
    { label: "Praktičnost", value: 50, icon: "Activity" },
    { label: "Váha", value: 50, icon: "Weight" },
    { label: "Logika vnitřku", value: 50, icon: "Cog" }
  ],
  'Trimmer': [
    { label: "Hlavice a nože", value: 50, icon: "Scissors" },
    { label: "Motor", value: 50, icon: "Zap" },
    { label: "Zpracování", value: 50, icon: "Shield" },
    { label: "Design", value: 50, icon: "Sparkles" },
    { label: "Praktičnost", value: 50, icon: "Activity" },
    { label: "Váha", value: 50, icon: "Weight" },
    { label: "Logika vnitřku", value: 50, icon: "Cog" }
  ],
  'Nůžky': [
    { label: "Ostrost", value: 50, icon: "Scissors" },
    { label: "Materiál", value: 50, icon: "Shield" },
    { label: "Ergonomie", value: 50, icon: "Activity" },
    { label: "Váha", value: 50, icon: "Weight" }
  ],
  'Hřeben': [
    { label: "Pružnost", value: 50, icon: "Wind" },
    { label: "Materiál", value: 50, icon: "Shield" },
    { label: "Skluz", value: 50, icon: "Droplet" }
  ],
  'Jiné': [
    { label: "Kvalita", value: 50, icon: "Shield" },
    { label: "Praktičnost", value: 50, icon: "Activity" }
  ]
};

interface ToolStat {
  id?: string;
  label: string;
  value: number;
  icon: string;
}

interface BarberTool {
  id: string;
  name: string;
  brand: string;
  category: ToolCategory;
  shortDescription: string;
  description: string;
  stats: ToolStat[];
  imagePlaceholder: string;
  imageUrl?: string | null;
}

const calculateAverageScore = (stats: ToolStat[]) => {
  if (stats.length === 0) return 0;
  const sum = stats.reduce((acc, curr) => acc + curr.value, 0);
  return Math.round(sum / stats.length);
};

const getTierForScore = (score: number): keyof typeof TIERS => {
  if (score >= 90) return "Legendární";
  if (score >= 80) return "Špičkový";
  if (score >= 70) return "Dobrý";
  if (score >= 60) return "Zlatý střed";
  if (score >= 50) return "Příležitostný";
  if (score >= 40) return "Zklamání";
  if (score >= 30) return "Špatný";
  if (score >= 20) return "Trápení";
  return "Odpad";
};

export default function ArsenalClient() {
  const { isBloodMode, isNoirMode } = useUI();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'Vše'>('Vše');
  
  const [tools, setTools] = useState<BarberTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Zobrazení detailů a editace
  const [selectedTool, setSelectedTool] = useState<BarberTool | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BarberTool>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("mmbarber_admin_auth") === "true");
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/arzenal');
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const method = editForm.id ? "PUT" : "POST";
      const url = editForm.id ? `/api/arzenal/${editForm.id}` : "/api/arzenal";

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        setIsEditing(false);
        fetchTools();
      } else {
        alert("Chyba při ukládání");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/arzenal/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setEditForm({ ...editForm, imageUrl: data.url });
      } else {
        alert("Chyba při nahrávání obrázku");
      }
    } catch (error) {
      console.error(error);
    }
    setUploadingImage(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Opravdu smazat?")) return;
    try {
      await fetch(`/api/arzenal/${id}`, { method: 'DELETE' });
      fetchTools();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTools = activeCategory === 'Vše' 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  const themeColor = isBloodMode ? 'text-red-600' : isNoirMode ? 'text-white' : 'text-mafia-gold';
  const themeBg = isBloodMode ? 'bg-red-600' : isNoirMode ? 'bg-white' : 'bg-mafia-gold';
  const themeBorder = isBloodMode ? 'border-red-600/30' : isNoirMode ? 'border-white/30' : 'border-mafia-gold/30';

  const StatBar = ({ label, value, iconName, highlight = false }: { label: string, value: number, iconName: string, highlight?: boolean }) => {
    const Icon = ICON_MAP[iconName] || Target;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Icon size={14} className={highlight ? themeColor : "text-white/50"} />
            <span className="text-white/80">{label}</span>
          </div>
          <span className={highlight ? themeColor : "text-white/60"}>{value}/100</span>
        </div>
        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className={`h-full ${highlight ? themeBg : 'bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isNoirMode ? 'bg-black' : isBloodMode ? 'bg-[#0a0000]' : 'bg-[#0a0a0a]'} text-smoke-white pt-24 pb-20 relative overflow-hidden font-sans`}>
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${isBloodMode ? 'bg-red-600/30' : isNoirMode ? 'bg-white/10' : 'bg-mafia-gold/20'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ${isBloodMode ? 'bg-red-900/30' : isNoirMode ? 'bg-zinc-800/20' : 'bg-amber-900/20'}`}></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <Link href="/" className={`inline-flex items-center gap-2 ${themeColor} hover:text-white transition-colors mb-8 font-mono text-sm uppercase tracking-widest`}>
            <ArrowLeft size={16} /> Zpět na ústředí
          </Link>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Crosshair className={`w-12 h-12 ${themeColor}`} />
                <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase">Arzenál</h1>
              </div>
              <p className="text-white/60 font-mono text-sm max-w-2xl border-l-2 border-white/20 pl-6 leading-relaxed">
                Tajná databáze našeho barber vybavení. Hodnotíme stroje, se kterými denně pracujeme v poli.
              </p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => {
                  setEditForm({ name: '', brand: '', category: 'Clipper', shortDescription: '', description: '', imagePlaceholder: 'IMG', stats: DEFAULT_STATS['Clipper'] });
                  setIsEditing(true);
                }}
                className={`px-6 py-3 bg-white/5 hover:${themeBg} border ${themeBorder} rounded-lg flex items-center gap-2 font-mono uppercase text-sm transition-all`}
              >
                <Plus size={16} /> Přidat položku
              </button>
            )}
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-12">
          {(['Vše', 'Clipper', 'Trimmer', 'Shaver', 'Nůžky', 'Hřeben'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 text-xs md:text-sm font-mono uppercase tracking-widest transition-all duration-300 rounded-sm backdrop-blur-sm border
                ${activeCategory === cat 
                ? `${themeBorder} ${isBloodMode ? 'bg-red-600/10 text-red-500' : isNoirMode ? 'bg-white/10 text-white' : 'bg-mafia-gold/10 text-mafia-gold'} shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                : 'border-white/5 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/30 font-mono">Načítám databázi...</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredTools.map((tool) => {
                const avgScore = calculateAverageScore(tool.stats);
                const tierKey = getTierForScore(avgScore);
                const tierInfo = TIERS[tierKey];
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    key={tool.id} 
                    onClick={() => setSelectedTool(tool)}
                    className={`bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-lg cursor-pointer hover:${themeBorder} transition-all duration-500 group flex flex-col relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t ${isBloodMode ? 'from-red-600/10' : isNoirMode ? 'from-white/5' : 'from-mafia-gold/10'} to-transparent`} />

                    {isAdmin && (
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditForm(tool); setIsEditing(true); }}
                          className="p-1.5 bg-black/60 border border-white/20 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(tool.id, e)}
                          className="p-1.5 bg-black/60 border border-red-500/20 rounded hover:bg-red-500/50 text-red-500/50 hover:text-white transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}

                    <div className={`absolute top-4 right-4 ${tierInfo.bg} ${tierInfo.border} border px-2 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10 ${tierInfo.shadow} shadow-lg`}>
                      <span className={tierInfo.color}>{tierKey} ({avgScore})</span>
                    </div>

                    <div className="mb-4 pt-4 relative z-10">
                      <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{tool.brand}</span>
                      <h3 className="text-2xl font-heading font-bold mt-1 text-white group-hover:text-white/90 transition-colors leading-tight">{tool.name}</h3>
                      <span className="inline-block mt-3 px-2 py-1 bg-white/5 text-[10px] font-mono text-white/60 border border-white/10 rounded-sm tracking-wider uppercase">
                        {tool.category}
                      </span>
                    </div>

                    <div className={`w-full h-48 bg-gradient-to-br from-white/5 to-black/80 border border-white/5 rounded-lg flex items-center justify-center mb-6 relative group-hover:border-white/20 transition-all duration-500 overflow-hidden z-10`}>
                      {tool.imageUrl ? (
                        <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-contain p-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transform group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <span className={`font-heading font-black text-5xl opacity-20 tracking-tighter ${isBloodMode ? 'text-red-500' : isNoirMode ? 'text-white' : 'text-mafia-gold'} transform group-hover:scale-110 transition-transform duration-700`}>
                          {tool.imagePlaceholder}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/60 mb-4 flex-grow leading-relaxed font-light z-10">
                      {tool.shortDescription}
                    </p>

                    <div className={`mt-auto pt-4 border-t border-white/5 flex items-center justify-between z-10 text-xs font-mono uppercase tracking-widest ${themeColor} opacity-70 group-hover:opacity-100 transition-opacity`}>
                      <span>Zobrazit specifikace</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredTools.length === 0 && !loading && (
          <div className="text-center py-32 border border-white/5 bg-black/20 rounded-lg backdrop-blur-sm">
            <Crosshair className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-heading text-white/40 uppercase tracking-widest">Sekce je prázdná</h3>
          </div>
        )}

        <div className="mt-20 border-t border-white/10 pt-12 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-widest text-white mb-2">Hodnotící škála</h2>
            <p className="text-white/50 font-mono text-sm max-w-2xl mx-auto">Vysvětlení našeho bodového hodnocení (0-100) a co to v praxi znamená pro nástroj ve vašich rukou.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { score: "0-19", label: "Odpad", color: "text-red-900", desc: "Absolutně nepoužitelné" },
              { score: "20-29", label: "Trápení", color: "text-red-700", desc: "Velmi špatný nástroj" },
              { score: "30-39", label: "Špatný", color: "text-red-500", desc: "Výrazný podprůměr" },
              { score: "40-49", label: "Zklamání", color: "text-orange-500", desc: "Nijaký, nenadchne" },
              { score: "50-59", label: "Příležitostný", color: "text-yellow-600", desc: "Použitelný do zálohy" },
              { score: "60-69", label: "Zlatý střed", color: "text-green-500", desc: "Ucházející standard" },
              { score: "70-79", label: "Dobrý", color: "text-emerald-400", desc: "Spolehlivý pracant" },
              { score: "80-89", label: "Špičkový", color: "text-cyan-400", desc: "Výborný nástroj" },
              { score: "90-100", label: "Legendární", color: "text-purple-400", desc: "Naprostá dokonalost" },
            ].map((tier, i) => (
              <div key={i} className="bg-black/30 border border-white/5 p-4 rounded-sm flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group">
                <span className="font-mono text-[10px] text-white/30 group-hover:text-white/50 transition-colors mb-2">{tier.score}</span>
                <span className={`font-heading font-bold uppercase tracking-wider text-sm mb-1 ${tier.color}`}>{tier.label}</span>
                <span className="text-[10px] text-white/40">{tier.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="bg-[#111] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 md:p-10 shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
              <X />
            </button>
            <h2 className="text-3xl font-heading font-black text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
              {editForm.id ? "Úprava Vybavení" : "Nové Vybavení"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Název</label>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-heading focus:border-mafia-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Značka</label>
                  <input value={editForm.brand} onChange={e => setEditForm({...editForm, brand: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-heading focus:border-mafia-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Kategorie</label>
                  <select value={editForm.category} onChange={e => {
                    const newCategory = e.target.value as ToolCategory;
                    setEditForm({
                      ...editForm, 
                      category: newCategory,
                      ...(!editForm.id ? { stats: DEFAULT_STATS[newCategory] } : {})
                    });
                  }} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-mono focus:border-mafia-gold outline-none">
                    <option value="Clipper">Clipper</option>
                    <option value="Trimmer">Trimmer</option>
                    <option value="Shaver">Shaver</option>
                    <option value="Nůžky">Nůžky</option>
                    <option value="Hřeben">Hřeben</option>
                    <option value="Jiné">Jiné</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Text Fotky (Záloha, pokud není obrázek)</label>
                  <input value={editForm.imagePlaceholder} onChange={e => setEditForm({...editForm, imagePlaceholder: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-heading focus:border-mafia-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Reálná Fotka</label>
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded font-mono text-xs uppercase cursor-pointer transition-colors text-white whitespace-nowrap">
                      {uploadingImage ? "Nahrávám..." : "Vybrat ze zařízení"}
                    </label>
                    {editForm.imageUrl && (
                      <img src={editForm.imageUrl} alt="Náhled" className="h-12 w-12 object-contain bg-black/50 rounded border border-white/10" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Krátký Popis (do karty)</label>
                  <textarea value={editForm.shortDescription} onChange={e => setEditForm({...editForm, shortDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-sans h-24 focus:border-mafia-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs font-mono text-white/50 uppercase block mb-1">Detailní Popis (do modalu)</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white rounded font-sans h-32 focus:border-mafia-gold outline-none" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-widest">Statistiky a Hodnocení</h3>
                <button 
                  onClick={() => setEditForm({...editForm, stats: [...(editForm.stats || []), { label: 'Nová vlastnost', value: 50, icon: 'Zap' }]})}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-mono text-xs uppercase flex items-center gap-2 transition-colors"
                >
                  <Plus size={14} /> Přidat
                </button>
              </div>
              
              <div className="space-y-3">
                {editForm.stats?.map((stat, i) => (
                  <div key={i} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-black/40 p-3 border border-white/5 rounded">
                    <input 
                      value={stat.label} 
                      onChange={e => {
                        const newStats = [...editForm.stats!];
                        newStats[i].label = e.target.value;
                        setEditForm({...editForm, stats: newStats});
                      }} 
                      placeholder="Např. Výkon" 
                      className="flex-1 bg-black/50 border border-white/10 p-2 text-sm text-white rounded focus:border-mafia-gold outline-none" 
                    />
                    <input 
                      type="number"
                      min="0" max="100"
                      value={stat.value} 
                      onChange={e => {
                        const newStats = [...editForm.stats!];
                        newStats[i].value = Number(e.target.value);
                        setEditForm({...editForm, stats: newStats});
                      }} 
                      className="w-20 bg-black/50 border border-white/10 p-2 text-sm text-white rounded text-center focus:border-mafia-gold outline-none" 
                    />
                    <button 
                      onClick={() => {
                        const newStats = editForm.stats!.filter((_, idx) => idx !== i);
                        setEditForm({...editForm, stats: newStats});
                      }}
                      className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
                {(!editForm.stats || editForm.stats.length === 0) && (
                  <p className="text-white/30 text-sm font-mono text-center py-4">Zatím nebyly přidány žádné statistiky.</p>
                )}
              </div>
            </div>

            <button 
              onClick={handleSave}
              className={`w-full py-4 bg-mafia-gold hover:bg-white text-black font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all rounded shadow-[0_0_20px_rgba(255,215,0,0.2)]`}
            >
              <Save size={20} /> Uložit Změny
            </button>
          </div>
        </div>
      )}

      {/* Modal pro Detaily */}
      <AnimatePresence>
        {selectedTool && !isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTool(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#111] border border-white/10 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10"
            >
              <button 
                onClick={() => setSelectedTool(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 border border-white/10 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 bg-black p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b ${isBloodMode ? 'from-red-900/20' : isNoirMode ? 'from-white/10' : 'from-mafia-gold/20'} to-transparent`} />
                
                <div className="text-center relative z-10 mb-8">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{selectedTool.brand}</span>
                  <h2 className="text-3xl md:text-4xl font-heading font-black mt-2 text-white leading-tight">{selectedTool.name}</h2>
                  
                  <div className={`mt-4 inline-block px-3 py-1 ${TIERS[getTierForScore(calculateAverageScore(selectedTool.stats))].bg} ${TIERS[getTierForScore(calculateAverageScore(selectedTool.stats))].border} border rounded-sm text-xs font-black uppercase tracking-widest ${TIERS[getTierForScore(calculateAverageScore(selectedTool.stats))].color}`}>
                    {getTierForScore(calculateAverageScore(selectedTool.stats))} ({calculateAverageScore(selectedTool.stats)})
                  </div>
                </div>

                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border border-white/10 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent relative z-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] p-6`}>
                  {selectedTool.imageUrl ? (
                    <img src={selectedTool.imageUrl} alt={selectedTool.name} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
                  ) : (
                    <span className={`font-heading font-black text-6xl md:text-7xl opacity-30 ${themeColor}`}>
                      {selectedTool.imagePlaceholder}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-10 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#111] to-black">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className={themeColor} size={20} />
                    <h3 className="text-xl font-heading font-bold uppercase tracking-wider text-white">Hodnocení</h3>
                  </div>
                  <p className="text-white/70 font-light leading-relaxed">
                    {selectedTool.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className={themeColor} size={20} />
                    <h3 className="text-xl font-heading font-bold uppercase tracking-wider text-white">Specifikace ({selectedTool.category})</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {selectedTool.stats.map((stat, idx) => (
                      <StatBar 
                        key={idx} 
                        label={stat.label} 
                        value={stat.value} 
                        iconName={stat.icon} 
                        highlight={stat.value >= 90} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
