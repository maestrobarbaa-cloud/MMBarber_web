"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export function RecruitmentNotification() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const applicantId = localStorage.getItem('mmbarber_applicant_id');
      const notified = localStorage.getItem('mmbarber_applicant_notified');

      if (!applicantId || notified === 'true') {
        return;
      }

      try {
        const res = await fetch(`/api/recruitment/status?applicantId=${applicantId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ACCEPTED' || data.status === 'REJECTED') {
            setStatus(data.status);
            setName(data.name);
            setShow(true);
          }
        }
      } catch (e) {
        console.error('Failed to check recruitment status', e);
      }
    };

    checkStatus();
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('mmbarber_applicant_notified', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-md w-full bg-black border-2 border-mafia-gold p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.2)]"
        >
          {status === 'ACCEPTED' ? (
            <>
              <CheckCircle2 className="w-16 h-16 text-mafia-gold mx-auto mb-6" />
              <h2 className="text-3xl font-heading font-black text-white uppercase tracking-widest mb-4">
                PŘIJAT
              </h2>
              <p className="text-white/80 font-mono mb-8">
                Gratulujeme{name ? `, ${name}` : ''}. Na základě vašich výsledků jste byl/a vybrán/a do dalšího kola. Dostavte se prosím k nám na pobočku pro osobní setkání.
              </p>
              <button 
                onClick={handleDismiss}
                className="w-full py-4 bg-mafia-gold text-black font-black uppercase tracking-widest hover:bg-white transition-colors"
              >
                Rozumím
              </button>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-black text-white uppercase tracking-widest mb-4">
                Žádost o pracovní pozici zamítnuta
              </h2>
              <p className="text-white/60 font-mono mb-8">
                Děkujeme za Váš zájem{name ? `, ${name}` : ''}. Naše kapacita a požadavky se aktuálně neshodují s Vaším profilem. Přejeme hodně štěstí v další kariéře.
              </p>
              <button 
                onClick={handleDismiss}
                className="w-full py-4 border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Zavřít
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
