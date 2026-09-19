"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, Trash2, Edit2, Target, Gamepad2, X, CheckCircle, Code, Folder, Music, Video, MonitorPlay, Briefcase } from "lucide-react";

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

export default function AdminProjectsPage() {
  const { lang } = useTranslation();
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
    details: "[]"
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
    if (!confirm("Opravdu smazat tento projekt?")) return;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading uppercase text-mafia-gold">Správa Komunitních Projektů</h1>
          <p className="text-sm text-gray-400">Zde můžeš přidávat, upravovat a mazat Minecraft servery a další projekty.</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-mafia-gold text-black font-bold uppercase hover:bg-white transition-colors flex items-center gap-2">
          <Plus size={18} /> Přidat Projekt
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-mono animate-pulse">Načítání projektů...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-mafia-dark/50 border border-white/10 p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  {getIcon(project.icon, { size: 24, className: "text-mafia-gold" })}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(project)} className="p-2 bg-white/5 hover:bg-white/20 text-white rounded"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded"><Trash2 size={16}/></button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold font-heading uppercase mb-2">{project.title}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.desc}</p>
              
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="px-2 py-1 bg-white/5 text-white/50">{project.tag}</span>
                <span className={`px-2 py-1 flex items-center gap-2 ${project.status === 'ONLINE' ? 'text-green-500 bg-green-500/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                  {project.status === 'ONLINE' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-mafia-dark border border-mafia-gold w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24}/></button>
            <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase mb-6">{editingId ? "Upravit Projekt" : "Nový Projekt"}</h2>
            
            <div className="space-y-4 font-mono text-sm">
              <div>
                <label className="block text-white/50 mb-1">Název Projektu</label>
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
                  <label className="block text-white/50 mb-1">Kategorie (Tag)</label>
                  <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white" placeholder="např. GAMING" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 mb-1">Odkaz / Link</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-white/50 mb-1">Zvolit Ikonu</label>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white">
                    <option value="Gamepad2">🎮 Herní ovladač (Minecraft)</option>
                    <option value="Code">💻 Kód / Programování</option>
                    <option value="Folder">📁 Složka / Projekt</option>
                    <option value="Music">🎵 Hudba / Rádio</option>
                    <option value="Video">🎥 Video / Střih</option>
                    <option value="MonitorPlay">🖥️ Monitor / Esport</option>
                    <option value="Briefcase">💼 Práce / Byznys</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/50 mb-1">Popis (Čeština)</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white h-20" />
              </div>

              <div>
                <label className="block text-white/50 mb-1">Detaily k serveru (JSON formát)</label>
                <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-black border border-white/10 p-2 text-white h-20 text-xs" placeholder='[{"label":"IP", "value":"play.mmbarber.cz"}]' />
                <p className="text-xs text-white/30 mt-1">Vzor: <code>[{"{"}"label":"IP","value":"1.2.3.4"{"}"}]</code></p>
              </div>
              
              <button onClick={handleSave} className="w-full py-3 bg-mafia-gold text-black font-black uppercase tracking-widest mt-6 hover:bg-white transition-colors">
                Uložit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
