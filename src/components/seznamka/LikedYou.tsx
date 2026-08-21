import React from "react";
import { Eye, Heart, X, ShieldAlert, Zap, History, Crown, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ProfileData } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";

interface LikedYouProps {
  currentUser?: ProfileData;
  admirers?: ProfileData[];
  onAccept?: (profile: ProfileData) => void;
  onDecline?: (profile: ProfileData) => void;
}

export function LikedYou({ currentUser, admirers = [], onAccept, onDecline }: LikedYouProps) {
  const { lang } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'admirers' | 'vip' | 'past'>('admirers');

  if (admirers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Eye size={48} className="text-mafia-gold/30 mb-6" />
        <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
          {lang === 'cs' ? 'Zatím tě nikdo nesleduje' : 'No one is watching you yet'}
        </h3>
        <p className="text-smoke-white/50 max-w-md text-sm font-mono uppercase tracking-widest leading-relaxed">
          {lang === 'cs' 
            ? 'Až tě někdo lajkne ze sítě, objeví se ti zde jako tajný ctitel.' 
            : 'When someone likes you from the pond, they will appear here as a secret admirer.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start py-8 w-full">
      {/* Tabs / Categories Switcher */}
      <div className="flex items-center gap-4 overflow-x-auto pt-4 pb-4 mb-8 w-full max-w-3xl px-4 custom-scrollbar justify-start md:justify-center">
        <button
          onClick={() => setActiveTab('admirers')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'admirers'
              ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'admirers' ? 'bg-red-500/20' : 'bg-white/5'}`}>
            <Heart size={24} className={activeTab === 'admirers' ? 'animate-pulse' : ''} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'Nové lajky' : 'New Likes'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vip')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'vip'
              ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.3)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'vip' ? 'bg-mafia-gold/20' : 'bg-white/5'}`}>
            <Crown size={24} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'VIP Profily' : 'VIP Profiles'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'past'
              ? 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'past' ? 'bg-purple-500/20' : 'bg-white/5'}`}>
            <History size={24} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'Dávná spojení' : 'Past Connects'}
          </span>
        </button>
      </div>

      {activeTab === 'admirers' && (
        <>
          <div className="text-center mb-8 flex flex-col items-center">
            <ShieldAlert size={32} className="text-red-500 mb-4 animate-pulse" />
            <h3 className="text-3xl font-heading font-black text-red-500 uppercase tracking-[0.2em] mb-2">
              {lang === 'cs' ? 'Máš ctitele' : 'You have admirers'}
            </h3>
            <p className="text-smoke-white/60 max-w-md text-xs font-mono uppercase tracking-widest leading-relaxed">
              {lang === 'cs' 
                ? 'Tito lidé o tebe projevili zájem. Rozhodni se rychle, než zmizí ze tvého radaru.' 
                : 'These people showed interest in you. Decide quickly before they disappear from your radar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        <AnimatePresence>
          {admirers.map((profile, i) => (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-mafia-gold/30 bg-black/60 group"
            >
              {/* Image Container with slight red tint overlay for secrecy */}
              <div className="w-full h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply z-10 pointer-events-none transition-all group-hover:bg-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
                
                {/* Hacking isSuperLike from a custom property for now since we don't have it in frontend type yet */}
                {(() => {
                  const isSuperLike = (profile as any).isSuperLike === true;
                  const canSee = currentUser?.salonVerified || isSuperLike;
                  
                  return (
                    <>
                      <img 
                        src={profile.photos?.[0]} 
                        alt={canSee ? profile.name : "Tajný ctitel"} 
                        className={`w-full h-full object-cover transition-all duration-700 ${canSee ? 'group-hover:scale-110' : 'blur-xl scale-110 grayscale brightness-50'}`} 
                      />
                      
                      {isSuperLike && (
                        <div className="absolute top-3 right-3 z-20 bg-blue-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                          <Heart size={16} fill="currentColor" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-end gap-2">
                          <h4 className="text-2xl font-heading font-black text-white uppercase tracking-widest leading-none drop-shadow-md">
                            {canSee ? profile.name : "????"}
                          </h4>
                          {canSee && (
                            <span className="text-lg font-heading text-mafia-gold font-light leading-none">
                              {profile.age}
                            </span>
                          )}
                        </div>
                        {canSee && profile.city && (
                          <p className="text-white/70 font-mono text-[10px] uppercase tracking-widest mt-1">
                            {profile.city}
                          </p>
                        )}
                        {!canSee && (
                          <p className="text-mafia-gold font-mono text-[10px] uppercase tracking-widest mt-2 flex items-center gap-1">
                            <ShieldAlert size={12} /> Vyžaduje VIP
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-mafia-gold/20">
                <button
                  onClick={() => onDecline && onDecline(profile)}
                  className="flex-1 py-4 flex items-center justify-center gap-2 border-r border-mafia-gold/20 text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                  <span className="font-heading font-bold text-xs uppercase tracking-widest">
                    {lang === 'cs' ? 'Ignorovat' : 'Ignore'}
                  </span>
                </button>
                <button
                  onClick={() => onAccept && onAccept(profile)}
                  className="flex-1 py-4 flex items-center justify-center gap-2 text-mafia-gold hover:bg-mafia-gold hover:text-black transition-all"
                >
                  <Heart size={20} />
                  <span className="font-heading font-black text-xs uppercase tracking-widest">
                    {lang === 'cs' ? 'Oplatit Like' : 'Like Back'}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </>
      )}

      {activeTab === 'vip' && (
        <div className="flex flex-col items-center justify-center py-10 w-full max-w-3xl px-4">
          <div className="text-center mb-8 flex flex-col items-center">
            <Crown size={32} className="text-mafia-gold mb-4" />
            <h3 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
              {lang === 'cs' ? 'Promované Profily' : 'Promoted Profiles'}
            </h3>
            <p className="text-smoke-white/60 max-w-md text-xs font-mono uppercase tracking-widest leading-relaxed">
              {lang === 'cs' 
                ? 'Lidé, kteří chtějí být vidět a jsou připraveni vyrazit. Nepropásni ty nejzajímavější úlovky.' 
                : 'People who want to be seen and are ready to go out. Do not miss the best catches.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* VIP Placeholder Card 1 */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-mafia-gold bg-black/80 group">
              <div className="absolute top-0 right-0 p-1 bg-mafia-gold text-black z-20 rounded-bl-xl shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest px-2">Zlatý VIP</span>
              </div>
              <div className="w-full h-64 relative">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="VIP" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest">Ema, 25</h4>
                  <p className="text-white/80 font-mono text-xs flex items-center gap-1 mt-1"><Star size={12} className="text-mafia-gold" /> Doporučeno algoritmem</p>
                </div>
              </div>
            </div>

            {/* VIP Placeholder Card 2 */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-mafia-gold/50 bg-black/80 group">
              <div className="absolute top-0 right-0 p-1 bg-mafia-gold/80 text-black z-20 rounded-bl-xl shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest px-2">Promovaný</span>
              </div>
              <div className="w-full h-64 relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="VIP" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-2xl font-heading font-black text-white uppercase tracking-widest">Tomáš, 31</h4>
                  <p className="text-white/80 font-mono text-xs flex items-center gap-1 mt-1"><Star size={12} className="text-mafia-gold/50" /> Aktivní dnes večer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'past' && (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
          <History size={48} className="text-purple-500/30 mb-6" />
          <h3 className="text-2xl font-heading font-black text-purple-500 uppercase tracking-[0.2em] mb-2">
            {lang === 'cs' ? 'Dávná spojení' : 'Past Connections'}
          </h3>
          <p className="text-smoke-white/50 max-w-md text-sm font-mono uppercase tracking-widest leading-relaxed">
            {lang === 'cs' 
              ? 'Tady najdeš lidi, se kterými jsi měl/a v minulosti match nebo nějaké propojení.' 
              : 'Here you will find people you matched or connected with in the past.'}
          </p>
        </div>
      )}
    </div>
  );
}
