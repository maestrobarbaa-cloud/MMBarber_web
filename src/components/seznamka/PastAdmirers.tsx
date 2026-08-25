import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ProfileData } from './ProfileCard';
import Image from 'next/image';

interface PastAdmirersModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastAdmirers: ProfileData[];
  onRateUser: (profileId: string, rating: number, isCritical: boolean, traits: string[]) => void;
  lang: 'cs' | 'en';
}

export function PastAdmirersModal({ isOpen, onClose, pastAdmirers, onRateUser, lang }: PastAdmirersModalProps) {
const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  if (!isOpen) return null;

const handleRateSubmit = (profileId: string) => {
    onRateUser(profileId, rating, isCritical, selectedTraits);
    setSelectedProfileId(null);
    setRating(5);
    setIsCritical(false);
    setSelectedTraits([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-black/90 border border-mafia-gold/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(197,160,89,0.15)] max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
          <ShieldCheck size={28} />
          {lang === 'cs' ? 'Dávní ctitelé' : 'Past Admirers'}
        </h2>
        <p className="text-white/60 font-mono text-sm leading-relaxed mb-6 border-b border-white/10 pb-6">
          {lang === 'cs' 
            ? 'Zde vidíte uživatele, které jste odložili pro pozdější hodnocení. Vaše hodnocení přímo ovlivní jejich skóre důvěryhodnosti pro ostatní.' 
            : 'Here you see users you saved for later rating. Your rating will directly affect their trust score for others.'}
        </p>

        {pastAdmirers.length === 0 ? (
          <div className="text-center py-12 border border-white/5 rounded-xl bg-white/5">
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
              {lang === 'cs' ? 'Seznam je prázdný' : 'List is empty'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastAdmirers.map(profile => (
              <div key={profile.id} className="bg-white/5 border border-white/10 rounded-xl p-4 transition-colors hover:border-mafia-gold/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative border border-white/10 shrink-0">
                    {profile.photos?.[0] ? (
                      <Image src={profile.photos[0]} alt={profile.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-heading font-black text-xl truncate">{profile.name}, {profile.age}</h3>
                    <p className="text-white/50 font-mono text-xs truncate">{profile.city || profile.bio}</p>
                  </div>
                  
                  {selectedProfileId !== profile.id && (
                    <button 
                      onClick={() => setSelectedProfileId(profile.id || "")}
                      className="px-4 py-2 bg-mafia-gold/20 hover:bg-mafia-gold/40 text-mafia-gold border border-mafia-gold/50 rounded font-mono text-xs uppercase tracking-widest transition-colors shrink-0"
                    >
                      {lang === 'cs' ? 'Hodnotit' : 'Rate'}
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {selectedProfileId === profile.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-white/10 space-y-6">
                        <div>
                          <label className="block text-white/70 font-mono text-xs uppercase tracking-widest mb-3">
                            {lang === 'cs' ? 'Celkové hodnocení' : 'Overall rating'}
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`p-1 transition-colors ${rating >= star ? 'text-mafia-gold' : 'text-white/20 hover:text-white/40'}`}
                              >
                                <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>


                        {/* Hodnocení vlastností */}
                        <div className="space-y-4">
                          <label className="block text-white/70 font-mono text-xs uppercase tracking-widest">
                            {lang === 'cs' ? 'Skutečná osobnost (jak jste ji vnímali)' : 'True personality (as you perceived it)'}
                          </label>
                          
                          <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4">
                            {/* Přístup k životu */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Přístup k životu' : 'Approach to life'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'optimist', label: lang === 'cs' ? 'Optimista' : 'Optimist' },
                                  { id: 'pessimist', label: lang === 'cs' ? 'Pesimista' : 'Pessimist' },
                                  { id: 'realist', label: lang === 'cs' ? 'Realista' : 'Realist' },
                                  { id: 'dreamer', label: lang === 'cs' ? 'Snílek' : 'Dreamer' },
                                  { id: 'toxic_positive', label: lang === 'cs' ? 'Toxicky pozitivní' : 'Toxic positive' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Komunikace */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Komunikace a Konflikty' : 'Communication & Conflicts'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'communicative', label: lang === 'cs' ? 'Komunikativní' : 'Communicative' },
                                  { id: 'closed', label: lang === 'cs' ? 'Uzavřený' : 'Closed off' },
                                  { id: 'passive_aggressive', label: lang === 'cs' ? 'Pasivně agresivní' : 'Passive aggressive' },
                                  { id: 'explosive', label: lang === 'cs' ? 'Výbušný' : 'Explosive' },
                                  { id: 'manipulative', label: lang === 'cs' ? 'Manipulátor' : 'Manipulative' },
                                  { id: 'listener', label: lang === 'cs' ? 'Naslouchající' : 'Good listener' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Peníze a zázemí */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Peníze a Zázemí' : 'Money & Background'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'generous', label: lang === 'cs' ? 'Štědrý' : 'Generous' },
                                  { id: 'saver', label: lang === 'cs' ? 'Šetřílek' : 'Saver' },
                                  { id: 'gold_digger', label: lang === 'cs' ? 'Zlatokop/ka' : 'Gold digger' },
                                  { id: 'independent', label: lang === 'cs' ? 'Finančně nezávislý' : 'Financially independent' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Charakter */}
                            <div>
                              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">
                                {lang === 'cs' ? 'Charakter a Spolehlivost' : 'Character & Reliability'}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'responsible', label: lang === 'cs' ? 'Zodpovědný' : 'Responsible' },
                                  { id: 'unreliable', label: lang === 'cs' ? 'Nespolehlivý' : 'Unreliable' },
                                  { id: 'liar', label: lang === 'cs' ? 'Lhář' : 'Liar' },
                                  { id: 'loyal', label: lang === 'cs' ? 'Věrný' : 'Loyal' },
                                  { id: 'empathetic', label: lang === 'cs' ? 'Empatický' : 'Empathetic' },
                                  { id: 'selfish', label: lang === 'cs' ? 'Sobec' : 'Selfish' },
                                ].map(trait => (
                                  <button
                                    key={trait.id}
                                    onClick={() => toggleTrait(trait.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors border ${selectedTraits.includes(trait.id) ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30'}`}
                                  >
                                    {trait.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="flex items-start gap-3 p-4 border border-red-900/50 bg-red-950/20 rounded-xl cursor-pointer transition-colors hover:border-red-500/50">
                            <input 
                              type="checkbox" 
                              checked={isCritical}
                              onChange={(e) => setIsCritical(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-red-500/30 text-red-500 focus:ring-red-500/50 bg-black"
                            />
                            <div>
                              <div className="flex items-center gap-2 text-red-500 font-mono text-sm uppercase font-bold tracking-widest mb-1">
                                <AlertTriangle size={16} />
                                {lang === 'cs' ? 'Závažné varování' : 'Critical warning'}
                              </div>
                              <p className="text-red-400/70 text-xs">
                                {lang === 'cs' 
                                  ? 'Zaškrtněte pouze v případě závažného porušení (podvod, agresivní chování, fake profil). Toto varování uvidí všichni ostatní uživatelé.'
                                  : 'Check only in case of serious violation. This warning will be visible to everyone.'}
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <button 
                            onClick={() => setSelectedProfileId(null)}
                            className="px-4 py-2 text-white/50 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
                          >
                            {lang === 'cs' ? 'Zrušit' : 'Cancel'}
                          </button>
                          <button 
                            onClick={() => handleRateSubmit(profile.id || "")}
                            className="px-6 py-2 bg-mafia-gold text-black hover:bg-mafia-gold/90 font-mono text-xs uppercase font-bold tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                          >
                            {lang === 'cs' ? 'Odeslat hodnocení' : 'Submit rating'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
