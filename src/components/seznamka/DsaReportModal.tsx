'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DsaReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedProfileId: string;
  reportedProfileName: string;
  lang: 'cs' | 'en';
}

const REPORT_CATEGORIES = [
  { id: 'illegal_content', labelCs: 'Nezákonný obsah', labelEn: 'Illegal Content' },
  { id: 'harassment', labelCs: 'Sexuální obtěžování / Nátlak', labelEn: 'Sexual Harassment / Coercion' },
  { id: 'scam', labelCs: 'Podvod / Falešný profil', labelEn: 'Scam / Fake Profile' },
  { id: 'hate_speech', labelCs: 'Nenávistné projevy / Agresivita', labelEn: 'Hate Speech / Aggression' },
  { id: 'intimate_images', labelCs: 'Šíření intimních materiálů bez souhlasu', labelEn: 'Non-consensual Intimate Images' },
  { id: 'underage', labelCs: 'Nezletilá osoba na seznamce', labelEn: 'Underage User' },
];

export function DsaReportModal({ isOpen, onClose, reportedProfileId, reportedProfileName, lang }: DsaReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setStatus('loading');
    
    // Zde by v produkci proběhlo API volání na vytvoření reportu
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setTimeout(() => {
          setStatus('idle');
          setSelectedCategory(null);
          setDescription('');
        }, 300);
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-mafia-dark w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-red-900/50 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-red-950/20">
              <div className="flex items-center gap-3 text-red-500">
                <ShieldAlert className="w-6 h-6" />
                <h2 className="text-xl font-heading font-black uppercase tracking-widest">
                  {lang === 'cs' ? 'Nahlásit profil' : 'Report Profile'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-heading font-black uppercase tracking-widest text-green-500 mb-3">
                    {lang === 'cs' ? 'Hlášení přijato' : 'Report Received'}
                  </h3>
                  <p className="text-white/70 font-mono text-sm leading-relaxed max-w-sm">
                    {lang === 'cs' 
                      ? 'Děkujeme za nahlášení. Vaše hlášení jsme zaevidovali (dle směrnice DSA) a naši moderátoři jej brzy prověří.' 
                      : 'Thank you for your report. It has been recorded (per DSA guidelines) and our moderators will review it shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex gap-3">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-white/80 text-xs font-mono uppercase tracking-wider leading-relaxed">
                      {lang === 'cs' 
                        ? `Nahlášení profilu "${reportedProfileName}". Zneužití tohoto systému může vést k blokaci vašeho účtu.` 
                        : `Reporting profile "${reportedProfileName}". Abuse of this system may result in your account being banned.`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-heading font-black text-mafia-gold uppercase tracking-widest mb-3">
                      {lang === 'cs' ? 'Důvod nahlášení' : 'Reason for report'}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {REPORT_CATEGORIES.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`text-left px-4 py-3 border rounded-xl text-sm transition-all ${
                            selectedCategory === category.id 
                              ? 'bg-red-900/30 border-red-500 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                              : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          {lang === 'cs' ? category.labelCs : category.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-heading font-black text-mafia-gold uppercase tracking-widest mb-3">
                      {lang === 'cs' ? 'Detaily (nepovinné)' : 'Details (optional)'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={lang === 'cs' ? 'Popište podrobněji, co se stalo...' : 'Describe what happened in more detail...'}
                      rows={3}
                      className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-shadow resize-none font-mono text-sm"
                    />
                  </div>

                  {/* DSA Evidence Upload Placeholder */}
                  <div className="border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                    <Upload size={20} className="text-white/40" />
                    <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                      {lang === 'cs' ? 'Nahrát důkaz (Screenshot)' : 'Upload evidence (Screenshot)'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || !selectedCategory}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-heading font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      lang === 'cs' ? 'Odesílám...' : 'Submitting...'
                    ) : (
                      lang === 'cs' ? 'Odeslat hlášení (DSA)' : 'Submit Report (DSA)'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
