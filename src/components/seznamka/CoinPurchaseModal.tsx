import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Diamond, ArrowRight, Sparkles } from 'lucide-react';

export const CoinPurchaseModal = ({
  isOpen,
  onClose,
  lang,
  onBuyCoins,
  onSubscribe,
  onEditProfile,
  fragmentsCount
}: {
  isOpen: boolean; 
  onClose: () => void;
  lang: string;
  onBuyCoins: (amount: number) => void;
  onSubscribe: (plan: string) => void;
  onEditProfile?: (type?: string) => void;
  fragmentsCount?: number;
}) => {
  const [amount, setAmount] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      if (response.ok && data?.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data?.error || 'Unknown error');
        setErrorMsg(data?.error || (lang === 'cs' ? 'Chyba při vytvoření platby.' : 'Checkout error.'));
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || (lang === 'cs' ? 'Chyba při vytvoření platby.' : 'Checkout error.'));
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-black/95 border border-mafia-gold/30 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-mafia-gold/20 rounded-full flex items-center justify-center border border-mafia-gold/50 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
              <span className="text-3xl font-black text-mafia-gold font-heading tracking-tighter">M</span>
            </div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex flex-col items-center justify-center border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Diamond size={20} className="text-blue-400 mb-1" />
              <span className="text-sm font-black text-blue-400">{fragmentsCount || 0}/10</span>
            </div>
          </div>
          <h2 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-widest text-center mb-2">
            {lang === 'cs' ? 'Koupit MMCOIN' : 'Buy MMCOIN'}
          </h2>
          <p className="text-white/60 text-xs font-mono text-center leading-relaxed">
            {lang === 'cs' ? 'Odemkni pokročilé vyhledávací algoritmy a najdi ten pravý match rychleji.' : 'Unlock advanced matching algorithms and find your true match faster.'}
          </p>
        </div>

        <div className="space-y-4">
          {/* Custom Coin Amount */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Počet MMCOINů' : 'Amount of MMCOINs'}</span>
              <span className="text-mafia-gold font-bold text-lg">{amount * 20} Kč</span>
            </div>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <div className="w-full flex items-center bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="px-6 py-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors border-r border-white/10"
                >-</button>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 min-w-[50px] bg-transparent text-center text-white font-bold focus:outline-none"
                  min="1"
                />
                <button
                  onClick={() => setAmount(amount + 1)}
                  className="px-6 py-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors border-l border-white/10"
                >+</button>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="px-6 py-3 bg-mafia-gold text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (lang === 'cs' ? 'Koupit' : 'Buy')}
              </button>
            </div>
          </div>

          {/* Convert Fragments to Coins */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-blue-500/10 blur-2xl">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Diamond size={14} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Složit Fragmenty' : 'Merge Fragments'}</h3>
                  <p className="text-[10px] text-white/50 font-mono uppercase">{lang === 'cs' ? 'Najdi skryté fragmenty v aplikaci' : 'Find hidden fragments in the app'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/40 rounded-lg p-3 border border-white/5 mb-3">
                <span className="text-white/60 text-xs font-mono">10 {lang === 'cs' ? 'Fragmentů' : 'Fragments'}</span>
                <span className="text-white/40"><ArrowRight size={14} /></span>
                <span className="text-mafia-gold font-bold text-xs uppercase tracking-wider">1 MMCOIN</span>
              </div>
              <button
                onClick={() => { 
                  onClose();
                  if (onEditProfile) onEditProfile(); 
                }}
                className="w-full py-3 bg-transparent border-2 border-blue-500/50 text-blue-400 font-bold uppercase tracking-widest rounded-lg hover:bg-blue-500/10 transition-colors"
              >
                {lang === 'cs' ? 'Více informací' : 'More info'}
              </button>
            </div>
          </div>

          {/* Monthly */}
          <button
            onClick={() => { onSubscribe('monthly'); onClose(); }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">📅</div>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Měsíčně' : 'Monthly'}</span>
                <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
              </div>
            </div>
            <span className="text-mafia-gold font-bold text-lg">200 Kč</span>
          </button>

          {/* Quarterly */}
          <button
            onClick={() => { onSubscribe('quarterly'); onClose(); }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">⭐</div>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Čtvrtletně' : 'Quarterly'}</span>
                <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
              </div>
            </div>
            <span className="text-mafia-gold font-bold text-lg">600 Kč</span>
          </button>

          {/* Half-yearly */}
          <button
            onClick={() => { onSubscribe('halfyearly'); onClose(); }}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">⏳</div>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Pololetně' : 'Half-yearly'}</span>
                <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
              </div>
            </div>
            <span className="text-mafia-gold font-bold text-lg">1200 Kč</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
