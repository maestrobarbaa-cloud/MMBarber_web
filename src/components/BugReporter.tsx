'use client';

import React, { useState } from 'react';
import { Bug, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BugReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setStatus('loading');
    try {
      // Sběr telemetrie
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
      const screenSize = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '';

      const res = await fetch('/api/bug-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, url, userAgent, screenSize }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-2.5 rounded-full bg-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2 group animate-pulse hover:animate-none border border-red-400"
        title="Nahlásit chybu"
      >
        <Bug className="w-5 h-5 group-hover:animate-bounce" />
        <span className="font-bold uppercase tracking-wider text-sm">Našli jste chybu v betě?</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
                  <Bug className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Nahlásit chybu</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Děkujeme za nahlášení!</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">Vaše hlášení jsme úspěšně přijali a brzy se na něj podíváme.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Našli jste v aplikaci nějakou chybu nebo problém? Napište nám, co nefunguje, a my se to pokusíme co nejdříve opravit.
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Co se stalo? (Stručný popis)
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Např. Nejde nahrát fotka"
                        required
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Detaily a postup
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Popište, jak přesně chyba nastala a co jste předtím udělali..."
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white transition-shadow resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="text-red-500 text-sm mt-2">
                        Došlo k chybě při odesílání hlášení. Zkuste to prosím znovu.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full mt-6 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Odesílám...
                        </>
                      ) : (
                        'Odeslat hlášení'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
