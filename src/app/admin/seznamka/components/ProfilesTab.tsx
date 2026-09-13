"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trash2, Edit, Plus, RefreshCw } from "lucide-react";

export function ProfilesTab() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState<"all" | "Muž" | "Žena">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '', email: '', age: 25, gender: 'Muž', seeking: 'Vážný vztah',
    city: 'Praha', height: 180, smoking: 'Ne', drinking: 'Příležitostně',
    interests: 'Zábava', bio: ''
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seznamka/profiles');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Opravdu smazat profil a uživatele trvale z databáze?")) return;
    try {
      const res = await fetch(`/api/admin/seznamka/profiles?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfiles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (profile: any = null) => {
    if (profile) {
      setEditProfile(profile);
      setFormData({
        name: profile.name,
        email: profile.user?.email || '',
        age: parseInt(profile.age) || 25,
        gender: profile.gender,
        seeking: profile.seeking,
        city: profile.city || '',
        height: parseInt(profile.height) || 180,
        smoking: profile.smoking,
        drinking: profile.drinking,
        interests: profile.interests,
        bio: profile.bio || ''
      });
    } else {
      setEditProfile(null);
      setFormData({
        name: '', email: '', age: 25, gender: 'Muž', seeking: 'Vážný vztah',
        city: 'Praha', height: 180, smoking: 'Ne', drinking: 'Příležitostně',
        interests: 'Zábava', bio: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editProfile) {
        res = await fetch('/api/admin/seznamka/profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editProfile.id, ...formData })
        });
      } else {
        res = await fetch('/api/admin/seznamka/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProfiles();
      } else {
        alert("Chyba při ukládání");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = profiles.filter(p => {
    if (filterGender === "all") return true;
    return p.gender.toLowerCase() === filterGender.toLowerCase();
  });

  return (
    <div>
      <div className="flex justify-between mb-8">
        <div className="flex gap-3">
          {(["all", "Muž", "Žena"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterGender(f)}
              className={`px-5 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                filterGender === f
                  ? "bg-mafia-gold text-mafia-black border-mafia-gold"
                  : "border-white/10 text-white/40 hover:border-mafia-gold/40"
              }`}
            >
              {f === "all" ? "Všichni" : f}
            </button>
          ))}
          <button onClick={fetchProfiles} className="px-3 border border-white/10 text-white/40 hover:text-white hover:border-white/30">
             <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2 bg-mafia-gold text-mafia-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all"
        >
          <Plus size={14} /> Vytvořit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(profile => (
          <div key={profile.id} className="border border-white/10 bg-white/5 p-5 relative overflow-hidden flex flex-col">
            {profile.user?.isShadowBanned && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            )}
            <div className="flex items-center gap-3 mb-3">
               <User className="text-mafia-gold" size={24} />
               <div>
                  <h3 className="font-bold text-lg leading-tight">{profile.name} <span className="text-white/40 font-normal text-sm">{profile.age}</span></h3>
                  <p className="text-white/40 text-xs font-mono">{profile.user?.email || "Bez emailu"}</p>
               </div>
            </div>
            <div className="text-sm space-y-1 mb-6 flex-1 text-white/70">
                <p>Město: <span className="text-white">{profile.city || '?'}</span></p>
                <p>Gender: <span className="text-white">{profile.gender}</span></p>
                <p>Hledá: <span className="text-white">{profile.seeking}</span></p>
            </div>
            
            <div className="flex items-center gap-2 mt-auto border-t border-white/10 pt-4">
                <button 
                  onClick={() => handleOpenModal(profile)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Edit size={12} /> Upravit
                </button>
                <button 
                  onClick={() => handleDelete(profile.userId)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 size={12} /> Smazat
                </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center overflow-y-auto p-4">
            <div className="bg-zinc-900 border border-white/10 p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">{editProfile ? 'Upravit Profil' : 'Vytvořit Nový Profil'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-mono text-white/50">Jméno</label>
                            <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-white/50">Email {!editProfile && '(generováno pokud prázdné)'}</label>
                            <input disabled={!!editProfile} value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white disabled:opacity-50" />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-white/50">Věk</label>
                            <input required type="number" value={formData.age} onChange={e=>setFormData({...formData, age: parseInt(e.target.value)})} className="w-full bg-black border border-white/20 p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-white/50">Pohlaví</label>
                            <select value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white">
                                <option value="Muž">Muž</option>
                                <option value="Žena">Žena</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-mono text-white/50">Město</label>
                            <input value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-white/50">Hledá</label>
                            <input value={formData.seeking} onChange={e=>setFormData({...formData, seeking: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-mono text-white/50">Bio</label>
                        <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white h-24" />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <button type="submit" className="px-6 py-2 bg-mafia-gold text-black font-bold uppercase text-sm">{editProfile ? 'Uložit' : 'Vytvořit'}</button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-white/20 hover:bg-white/10 uppercase text-sm">Zrušit</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
