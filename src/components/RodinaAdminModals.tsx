
import { useState, useEffect } from 'react';
import { Division, Member } from '@/app/rodina/page';
import { X, Save } from 'lucide-react';

export function RodinaAdminModals({
  divisions,
  setDivisions,
  members,
  setMembers
}: {
  divisions: Division[];
  setDivisions: React.Dispatch<React.SetStateAction<Division[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}) {
  const [editingDivision, setEditingDivision] = useState<Partial<Division> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<Member> | null>(null);

  useEffect(() => {
    const handleEditDiv = (e: any) => {
      setEditingDivision(e.detail || { id: '', name: '', nameEn: '', icon: 'Star' });
    };
    const handleEditMem = (e: any) => {
      setEditingMember(e.detail || { name: '', div: 'auto', role: '', roleEn: '', img: '/logo.png', link: '' });
    };

    window.addEventListener('mmbarber_edit_division', handleEditDiv);
    window.addEventListener('mmbarber_edit_member', handleEditMem);
    return () => {
      window.removeEventListener('mmbarber_edit_division', handleEditDiv);
      window.removeEventListener('mmbarber_edit_member', handleEditMem);
    };
  }, []);

  const saveDivision = () => {
    if (!editingDivision?.id || !editingDivision?.name) return alert('ID a Název jsou povinné');
    setDivisions(prev => {
      const exists = prev.find(d => d.id === editingDivision.id);
      if (exists) return prev.map(d => d.id === editingDivision.id ? (editingDivision as Division) : d);
      return [...prev, editingDivision as Division];
    });
    setEditingDivision(null);
  };

  const saveMember = () => {
    if (!editingMember?.name || !editingMember?.div) return alert('Jméno a Divize jsou povinné');
    setMembers(prev => {
      const exists = prev.find(m => m.name === editingMember.name);
      if (exists) return prev.map(m => m.name === editingMember.name ? (editingMember as Member) : m);
      return [...prev, editingMember as Member];
    });
    setEditingMember(null);
  };

  if (!editingDivision && !editingMember) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111] border border-mafia-gold/30 p-6 md:p-8 w-full max-w-md relative">
        <button onClick={() => { setEditingDivision(null); setEditingMember(null); }} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X size={20} />
        </button>
        
        {editingDivision && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2">
              {editingDivision.id ? 'Upravit Divizi' : 'Přidat Divizi'}
            </h3>
            
            <input type="text" placeholder="ID (např. auto)" value={editingDivision.id || ''} onChange={e => setEditingDivision({...editingDivision, id: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" disabled={!!divisions.find(d => d.id === editingDivision.id)} />
            <input type="text" placeholder="Název CZ" value={editingDivision.name || ''} onChange={e => setEditingDivision({...editingDivision, name: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            <input type="text" placeholder="Název EN" value={editingDivision.nameEn || ''} onChange={e => setEditingDivision({...editingDivision, nameEn: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            
            <select value={editingDivision.icon || 'Star'} onChange={e => setEditingDivision({...editingDivision, icon: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white">
              <option value="Star">Hvězda (Star)</option>
              <option value="Droplets">Kvapky (Droplets)</option>
              <option value="Zap">Blesk (Zap)</option>
              <option value="Building2">Budovy (Building)</option>
              <option value="UtensilsCrossed">Gastro (Utensils)</option>
              <option value="Camera">Foťák (Camera)</option>
              <option value="Music">Hudba (Music)</option>
              <option value="Hammer">Kladivo (Hammer)</option>
              <option value="Package">Krabice (Package)</option>
              <option value="HeartHandshake">Podpora (HeartHandshake)</option>
              <option value="Calculator">Kalkulačka (Calculator)</option>
              <option value="Bike">Kolo (Bike)</option>
              <option value="Monitor">IT (Monitor)</option>
              <option value="Users">Lidé (Users)</option>
              <option value="Home">Dům (Home)</option>
            </select>

            <button onClick={saveDivision} className="mt-4 bg-mafia-gold text-black px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2">
              <Save size={16} /> ULOŽIT
            </button>
          </div>
        )}

        {editingMember && (
          <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl font-heading font-black text-mafia-gold uppercase mb-2">
              {editingMember.name ? 'Upravit Člena' : 'Přidat Člena'}
            </h3>
            
            <input type="text" placeholder="Jméno (unikátní)" value={editingMember.name || ''} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" disabled={!!members.find(m => m.name === editingMember.name)} />
            
            <select value={editingMember.div || ''} onChange={e => setEditingMember({...editingMember, div: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white">
              <option value="" disabled>Vyberte divizi</option>
              {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <input type="text" placeholder="Role CZ" value={editingMember.role || ''} onChange={e => setEditingMember({...editingMember, role: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            <input type="text" placeholder="Role EN" value={editingMember.roleEn || ''} onChange={e => setEditingMember({...editingMember, roleEn: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            
            <input type="text" placeholder="Cesta k fotce (např. /logo.png)" value={editingMember.img || ''} onChange={e => setEditingMember({...editingMember, img: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            <input type="text" placeholder="Odkaz (web nebo tel:)" value={editingMember.link || ''} onChange={e => setEditingMember({...editingMember, link: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            <input type="text" placeholder="Telefon (volitelně)" value={editingMember.phone || ''} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            <input type="text" placeholder="IČO (volitelně)" value={editingMember.ico || ''} onChange={e => setEditingMember({...editingMember, ico: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white" />
            
            <textarea placeholder="Speciální Hover Text CZ" value={editingMember.specialHover || ''} onChange={e => setEditingMember({...editingMember, specialHover: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white min-h-[80px]" />
            <textarea placeholder="Speciální Hover Text EN" value={editingMember.specialHoverEn || ''} onChange={e => setEditingMember({...editingMember, specialHoverEn: e.target.value})} className="bg-black/50 border border-white/10 p-3 text-sm text-white min-h-[80px]" />
            
            <button onClick={saveMember} className="mt-4 bg-mafia-gold text-black px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2">
              <Save size={16} /> ULOŽIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

