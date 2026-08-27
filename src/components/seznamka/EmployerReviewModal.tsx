import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, TrendingUp, Users, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface EmployerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

export const EmployerReviewModal = ({ isOpen, onClose, targetUserId, targetUserName }: EmployerReviewModalProps) => {
  const { lang } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    workEthicRating: 5,
    teamDynamics: 'neutral',
    drivePercentage: 50,
    textReview: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Něco se pokazilo');
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ workEthicRating: 5, teamDynamics: 'neutral', drivePercentage: 50, textReview: '' });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
          className="bg-mafia-dark border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-black uppercase text-mafia-gold flex items-center gap-2">
              <Briefcase size={20} />
              Hodnocení pro {targetUserName}
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Hodnocení odesláno</h3>
              <p className="text-white/60 text-sm">Děkujeme za vaši referenci. Pomůže ostatním firmám.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Tah na branku (Drive) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wider">
                  <Target size={16} className="text-mafia-gold" />
                  Tah na branku (Drive) - {formData.drivePercentage}%
                </label>
                <p className="text-xs text-white/50 mb-3">Jak silnou má vnitřní motivaci a chuť dosahovat cílů?</p>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={formData.drivePercentage}
                  onChange={(e) => setFormData({...formData, drivePercentage: Number(e.target.value)})}
                  className="w-full accent-mafia-gold"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1 uppercase font-mono">
                  <span>Žádná motivace</span>
                  <span>Extrémní dravost</span>
                </div>
              </div>

              {/* Pracovní morálka */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wider">
                  <TrendingUp size={16} className="text-blue-400" />
                  Pracovní Morálka - {formData.workEthicRating} / 10
                </label>
                <p className="text-xs text-white/50 mb-3">Spolehlivost, plnění termínů a kvalita odvedené práce.</p>
                <input 
                  type="range" min="1" max="10" step="1"
                  value={formData.workEthicRating}
                  onChange={(e) => setFormData({...formData, workEthicRating: Number(e.target.value)})}
                  className="w-full accent-blue-400"
                />
              </div>

              {/* Vliv na kolektiv */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 uppercase tracking-wider">
                  <Users size={16} className="text-green-400" />
                  Vliv na kolektiv
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button type="button" 
                    onClick={() => setFormData({...formData, teamDynamics: 'consolidator'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      formData.teamDynamics === 'consolidator' ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5'
                    }`}>
                    Ucelovač týmu
                  </button>
                  <button type="button" 
                    onClick={() => setFormData({...formData, teamDynamics: 'neutral'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      formData.teamDynamics === 'neutral' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5'
                    }`}>
                    Neutrální
                  </button>
                  <button type="button" 
                    onClick={() => setFormData({...formData, teamDynamics: 'disruptor'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                      formData.teamDynamics === 'disruptor' ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5'
                    }`}>
                    Rozbíječ kolektivu
                  </button>
                </div>
              </div>

              {/* Slovní hodnocení */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Slovní hodnocení (Volitelné)</label>
                <textarea 
                  rows={4}
                  value={formData.textReview}
                  onChange={(e) => setFormData({...formData, textReview: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-mafia-gold outline-none resize-none"
                  placeholder="Jak se s člověkem reálně pracovalo? (Bude zobrazeno pod vaším firemním jménem)"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-widest rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Odesílám...' : 'Odeslat hodnocení'}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
