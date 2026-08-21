'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch('/api/verify-salon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setStatus('success');
        setTimeout(() => router.push('/seznamka'), 3000);
      } else {
        setStatus('error');
      }
    })
    .catch(() => setStatus('error'));
  }, [token, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/60 border border-mafia-gold/30 p-8 rounded-2xl max-w-sm w-full text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-mafia-gold mb-4" size={48} />
            <h2 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-widest">Ověřování Pečeti...</h2>
            <p className="text-white/50 text-xs font-mono mt-2">Nekomunikuj. Systém načítá data.</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-mafia-gold mb-4" size={64} />
            <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest">VIP Zlatá Pečeť</h2>
            <p className="text-white/70 text-sm font-mono mt-4">Tvá identita byla fyzicky ověřena v MM Barber. Vítej v elitním klubu.</p>
            <p className="text-white/40 text-[10px] font-mono mt-6">Přesměrovávám do Rybníčku...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-heading font-black text-red-500 uppercase tracking-widest">Selhání</h2>
            <p className="text-white/70 text-sm font-mono mt-4">Kód je neplatný nebo expiroval. Zkus to znovu na prodejně.</p>
            <button onClick={() => router.push('/seznamka')} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded uppercase text-xs font-mono tracking-widest transition-colors">
              Zpět na seznamku
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-mafia-gold" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}
