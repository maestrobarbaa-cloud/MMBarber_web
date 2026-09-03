import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coins, Zap, Clock, ArrowRight, Flame } from 'lucide-react';
import { ProfileData } from './ProfileTypes';
import { DynamicEventEngine } from '@/lib/algorithms/DynamicEventEngine';

interface PointsExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPoints: number;
  formData: ProfileData;
  setFormData: (data: ProfileData) => void;
  lang: 'cs' | 'en' | 'zh';
}

export const PointsExchangeModal = ({ isOpen, onClose, totalPoints, formData, setFormData, lang }: PointsExchangeModalProps) => {
  if (!isOpen) return null;

  const currentCoins = formData.mmCoins || 0;
  const autoConvert = formData.autoConvertPoints || false;
  const eventStatus = DynamicEventEngine.getEventStatus();

  const handleConvert = () => {
    // Basic frontend mockup for converting points
    // In a real backend, this would call an API, deduct the available points pool, and add coins.
    alert(lang === 'cs' ? 'Funkce směnárny bude napojena na backend.' : 'Exchange function will be connected to backend.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-mafia-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-mafia-gold/10 to-transparent pointer-events-none" />
            <h2 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-widest flex items-center gap-2 relative z-10">
              <Sparkles size={20} />
              {lang === 'cs' ? 'Směnárna Bodů' : 'Points Exchange'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
              <X size={20} className="text-white/60" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Balances */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">{lang === 'cs' ? 'Získané Body' : 'Earned Points'}</span>
                <span className="text-3xl font-heading font-black text-white">{totalPoints} <span className="text-sm">🪙</span></span>
              </div>
              <div className="bg-mafia-gold/10 border border-mafia-gold/30 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                <span className="text-mafia-gold/70 font-mono text-xs uppercase tracking-widest mb-1">{lang === 'cs' ? 'Tvoje Coiny' : 'Your Coins'}</span>
                <span className="text-3xl font-heading font-black text-mafia-gold">{currentCoins} <Coins size={20} className="inline-block ml-1 -mt-1" /></span>
              </div>
            </div>

            {/* Event Notification Banner */}
            {eventStatus.phase !== 'NORMAL' && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-lg relative overflow-hidden ${
                eventStatus.phase === 'HOLIDAY' ? 'bg-gradient-to-r from-red-900/40 to-mafia-gold/20 border-mafia-gold/50' : 
                eventStatus.phase === 'PEAK' ? 'bg-black/60 border-orange-500/30' : 
                'bg-blue-900/20 border-blue-400/30'
              }`}>
                <div className="relative z-10 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    eventStatus.phase === 'HOLIDAY' ? 'bg-mafia-gold/20 text-mafia-gold' : 
                    eventStatus.phase === 'PEAK' ? 'bg-orange-500/20 text-orange-400' : 
                    'bg-blue-400/20 text-blue-400'
                  }`}>
                    {eventStatus.phase === 'HOLIDAY' ? <Sparkles size={20} /> : eventStatus.phase === 'PEAK' ? <Flame size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                    <h4 className={`font-heading font-bold text-sm uppercase tracking-widest ${
                      eventStatus.phase === 'HOLIDAY' ? 'text-mafia-gold' : 
                      eventStatus.phase === 'PEAK' ? 'text-orange-400' : 
                      'text-blue-400'
                    }`}>{eventStatus.eventName}</h4>
                    <p className="text-xs text-white/60 font-sans mt-0.5">{lang === 'cs' ? eventStatus.description.cs : eventStatus.description.en}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Section */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-6 mb-8 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-mafia-gold/5 blur-2xl">
                <Coins size={100} />
              </div>
              
              <h3 className="text-lg font-heading font-bold text-white mb-2">{lang === 'cs' ? 'Převodník' : 'Converter'}</h3>
              <div className="flex items-center justify-center gap-4 text-mafia-gold font-mono text-lg font-bold mb-6 relative z-10">
                <span>100 🪙</span>
                <ArrowRight size={20} className="text-white/40" />
                <span>1 <Coins size={18} className="inline-block" /></span>
              </div>
              
              <div className="flex flex-col gap-4 max-w-sm mx-auto relative z-10">
                <button 
                  type="button"
                  onClick={handleConvert}
                  className="w-full py-3 bg-mafia-gold text-black font-mono font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors"
                >
                  {lang === 'cs' ? 'Převést 100 bodů na 1 Coin' : 'Convert 100 pts to 1 Coin'}
                </button>
                
                <label className="flex items-center justify-center gap-3 cursor-pointer group mt-2">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${autoConvert ? 'bg-mafia-gold' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoConvert ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="font-mono text-xs text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">
                    {lang === 'cs' ? 'Automatický převod' : 'Auto-convert'}
                  </span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={autoConvert} 
                    onChange={(e) => setFormData({ ...formData, autoConvertPoints: e.target.checked })} 
                  />
                </label>
              </div>
            </div>

            {/* Educational Section: Chat Unlocking */}
            <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4 text-center">
              {lang === 'cs' ? 'Na co potřebuji coiny?' : 'Why do I need coins?'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white/60"><Clock size={20} /></div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">{lang === 'cs' ? 'Standardní Match' : 'Standard Match'}</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-sans mb-3">
                  {lang === 'cs' 
                    ? `Když si s někým dáte vzájemný "Like", chat se vám oběma automaticky odemkne přesně za ${eventStatus.delayDays} dní. Tato čekací doba slouží k budování napětí a odfiltrování spamu.`
                    : `When you get a mutual like, the chat will automatically unlock in exactly ${eventStatus.delayDays} days. This waiting period builds tension.`}
                </p>
                <div className="text-[10px] font-mono text-white/40 uppercase bg-black/40 inline-block px-2 py-1 rounded">
                  {lang === 'cs' ? 'Cena: ZDARMA (Čekání)' : 'Cost: FREE (Waiting)'}
                </div>
              </div>

              <div className="bg-mafia-gold/10 border border-mafia-gold/30 p-5 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-mafia-gold"><Zap size={40} /></div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="p-2 bg-mafia-gold/20 rounded-lg text-mafia-gold"><Zap size={20} /></div>
                  <h4 className="font-bold text-mafia-gold text-sm uppercase tracking-wider">{lang === 'cs' ? 'Okamžitý Chat' : 'Instant Chat'}</h4>
                </div>
                <p className="text-xs text-mafia-gold/70 leading-relaxed font-sans mb-3 relative z-10">
                  {lang === 'cs'
                    ? `Nechceš čekat ${eventStatus.delayDays} dní? Použij Coiny a odemkni si chat se svým Matchem okamžitě.`
                    : `Don't want to wait ${eventStatus.delayDays} days? Use Coins to instantly unlock the chat with your Match.`}
                </p>
                <div className="text-[10px] font-mono font-bold uppercase bg-black/40 inline-flex items-center gap-2 px-2 py-1 rounded border border-mafia-gold/20 relative z-10">
                  {eventStatus.currentChatUnlockCost < eventStatus.baseChatUnlockCost && (
                    <span className="line-through text-white/30 decoration-red-500">{eventStatus.baseChatUnlockCost}</span>
                  )}
                  {eventStatus.currentChatUnlockCost > eventStatus.baseChatUnlockCost && (
                    <span className="text-orange-400">🔥 {eventStatus.currentChatUnlockCost}</span>
                  )}
                  {eventStatus.currentChatUnlockCost <= eventStatus.baseChatUnlockCost && (
                    <span className="text-mafia-gold">{eventStatus.currentChatUnlockCost}</span>
                  )}
                  <Coins size={10} className="text-mafia-gold" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
