"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

import { 
  ArrowLeft, 
  ExternalLink,
  Target,
  Gamepad2,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Code,
  Folder,
  Music,
  Video,
  MonitorPlay,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

// Helper for dynamic icon rendering
const getIcon = (name: string, props: any) => {
  const icons: Record<string, any> = {
    Gamepad2: <Gamepad2 {...props} />,
    Code: <Code {...props} />,
    Folder: <Folder {...props} />,
    Music: <Music {...props} />,
    Video: <Video {...props} />,
    MonitorPlay: <MonitorPlay {...props} />,
    Briefcase: <Briefcase {...props} />,
  };
  return icons[name] || <Target {...props} />;
};

export default function ProjectsPage() {
  const { lang } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("mmbarber_admin_auth") === "true");
  }, []);

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    status: "PREPARING",
    tag: "GENERAL",
    desc: "",
    descEn: "",
    dateLabel: "",
    icon: "Folder",
    link: "",
    details: "[]" // JSON string
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/community/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/community/projects/${editingId}` : "/api/community/projects";
      const method = editingId ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsModalOpen(false);
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat projekt?")) return;
    try {
      await fetch(`/api/community/projects/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const openEdit = (project: any) => {
    setFormData({
      title: project.title,
      status: project.status,
      tag: project.tag,
      desc: project.desc,
      descEn: project.descEn || "",
      dateLabel: project.dateLabel || "",
      icon: project.icon || "Folder",
      link: project.link || "",
      details: project.details || "[]",
    });
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setFormData({
      title: "",
      status: "PREPARING",
      tag: "GENERAL",
      desc: "",
      descEn: "",
      dateLabel: "COMING SOON",
      icon: "Gamepad2",
      link: "",
      details: '[{"label":"INFO","value":"Details soon"}]'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT NA KOMUNITU" : "BACK TO COMMUNITY"}
        </Link>
        <div className="text-right">
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">SYSTEM_PROJECTS_v2</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <Target className="text-mafia-gold" size={20} />
              <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">MISSE_LOG</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter italic mb-8">
              KOMUNITNÍ <span className="text-mafia-gold">PROJEKTY</span>
            </h1>
            <p className="text-xl text-smoke-white/60 max-w-2xl font-sans italic mx-auto md:mx-0">
              {lang === 'cs' ? "Aktuální iniciativy, které propojují naši smečku mimo křeslo holičství." : "Current initiatives connecting our crew outside the barbershop chair."}
            </p>
          </div>

          {isAdmin && (
            <button onClick={openNew} className="px-6 py-4 bg-mafia-gold/10 border border-mafia-gold text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors font-mono text-xs tracking-widest flex items-center gap-2">
              <Plus size={16} /> {lang === 'cs' ? "PŘIDAT PROJEKT" : "ADD PROJECT"}
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center text-mafia-gold font-mono tracking-widest py-20 animate-pulse">LOADING...</div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {projects.map((project) => {
               let parsedDetails = [];
               try { parsedDetails = JSON.parse(project.details || '[]'); } catch(e) {}
               
               const description = lang === 'en' && project.descEn ? project.descEn : project.desc;
               const isOnline = project.status === 'ONLINE';

               return (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-mafia-dark/40 border border-white/5 p-8 md:p-16 relative overflow-hidden hover:border-mafia-gold/30 transition-all duration-700"
                >
                  {isAdmin && (
                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                      <button onClick={() => openEdit(project)} className="p-2 bg-white/10 hover:bg-white/20 text-white"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500"><Trash2 size={16}/></button>
                    </div>
                  )}

                  <div className="absolute top-0 right-0 p-12">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}`}></div>
                        <span className={`text-xs font-mono font-black tracking-widest ${isOnline ? 'text-green-500' : 'text-yellow-500'}`}>{project.status}</span>
                     </div>
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center mt-8 lg:mt-0">
                    <div className="w-32 h-32 md:w-48 md:h-48 border border-mafia-gold/20 bg-mafia-gold/5 flex items-center justify-center group-hover:border-mafia-gold/50 transition-all duration-700">
                       {getIcon(project.icon, { className: "text-mafia-gold", size: 48 })}
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                         <span className="px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/30 text-mafia-gold text-[9px] font-mono tracking-widest uppercase">{project.tag}</span>
                         {project.dateLabel && <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/30 text-[9px] font-mono tracking-widest uppercase">{project.dateLabel}</span>}
                      </div>
                      
                      <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 tracking-tighter italic uppercase">{project.title}</h2>
                      <p className="text-smoke-white/60 mb-12 font-sans italic text-lg max-w-2xl">{description}</p>
                      
                      {parsedDetails.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                           {parsedDetails.map((detail: any, idx: number) => (
                             <div key={idx} className="p-4 bg-white/[0.02] border border-white/5">
                                <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">{detail.label}</div>
                                <div className="text-sm font-mono text-mafia-gold font-bold tracking-widest uppercase">{detail.value}</div>
                             </div>
                           ))}
                        </div>
                      )}

                      {project.link && project.link !== '#' && (
                        <Link href={project.link} target="_blank" className="w-full md:w-auto inline-flex px-12 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-2xl items-center justify-center gap-4">
                           {lang === 'cs' ? "PŘIPOJIT SE" : "JOIN"} <ExternalLink size={18} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-mafia-gold/5 to-transparent pointer-events-none"></div>
                </motion.div>
               );
            })}

            {/* Locked Slots */}
            {projects.length < 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[1, 2].slice(0, 3 - projects.length).map((_, i) => (
                   <div key={i} className="border-2 border-dashed border-white/5 p-12 flex flex-col items-center justify-center text-center group">
                      <Lock className="text-white/5 mb-6 group-hover:text-white/10 transition-colors" size={32} />
                      <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.6em]">MISSION_LOCKED</span>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-mafia-dark border border-mafia-gold w-full max-w-3xl p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase mb-6">{editingId ? "Upravit Projekt" : "Nový Projekt"}</h2>
            
            <div className="space-y-4 font-mono text-sm">
              <div>
                <label className="block text-white/50 mb-1">Název</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white">
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="MAINTENANCE">MAINTENANCE (Údržba)</option>
                    <option value="PREPARING">PREPARING (Připravuje se)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 mb-1">Tag (kategorie)</label>
                  <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white" placeholder="GAMING" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 mb-1">Odkaz</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-white/50 mb-1">Ikona (Lucide)</label>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white">
                    <option value="Gamepad2">Gamepad</option>
                    <option value="Code">Kódování</option>
                    <option value="Folder">Složka</option>
                    <option value="Music">Hudba</option>
                    <option value="Video">Video</option>
                    <option value="MonitorPlay">Monitor</option>
                    <option value="Briefcase">Práce</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/50 mb-1">Popis (CZ)</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white h-24" />
              </div>
              <div>
                <label className="block text-white/50 mb-1">Popis (EN)</label>
                <textarea value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white h-24" />
              </div>
              <div>
                <label className="block text-white/50 mb-1">{'Detaily (JSON Array - `[{"label":"IP","value":"1.1.1.1"}]`)'}</label>
                <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white h-24 font-mono text-xs" />
              </div>
              
              <button onClick={handleSave} className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-widest mt-4">
                Uložit Projekt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
