"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Lightbulb, Bug, Send } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedback";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function UserFeedbackWidget() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'IDEA' | 'BUG'>('IDEA');
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState("");

  // Zaregistrujeme globální event pro otevření modálu (aby šel otevřít z mobilní lišty)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("mmbarber-open-feedback", handleOpen);
    return () => window.removeEventListener("mmbarber-open-feedback", handleOpen);
  }, []);

  // Skrytí widgetu pokud jsme v admin sekci
  if (pathname?.startsWith("/admin")) return null;

  if (isAdmin) return null; // Admin to nepotřebuje

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('LOADING');
    setErrorMsg("");

    try {
      if (type === 'IDEA') {
        const res = await fetch('/api/zlepseni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: session?.user?.name || "Anonymní z widgetu",
            userId: session?.user?.email || "anonymous",
            content: message,
            points: ["Zadáno přes rychlý widget"],
            userPriority: 5,
            status: 'PENDING'
          })
        });
        
        if (res.ok) {
          setStatus('SUCCESS');
          setTimeout(() => {
            setIsOpen(false);
            setStatus('IDLE');
            setMessage("");
          }, 2000);
        } else {
          setStatus('ERROR');
          setErrorMsg("Došlo k chybě při odesílání.");
        }
      } else {
        const res = await submitFeedbackAction({ type, message });
        if (res.success) {
          setStatus('SUCCESS');
          setTimeout(() => {
            setIsOpen(false);
            setStatus('IDLE');
            setMessage("");
          }, 2000);
        } else {
          setStatus('ERROR');
          setErrorMsg(res.error || "Došlo k chybě.");
        }
      }
    } catch (err) {
      setStatus('ERROR');
      setErrorMsg("Něco se pokazilo.");
    }
  };

  return (
    <>
      {/* Desktop Widget Kolečko (Skryté na mobilu) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-48 left-6 md:bottom-56 md:left-10 z-40 p-3 md:p-4 rounded-full bg-black/80 border border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.3)] text-mafia-gold backdrop-blur-sm group overflow-hidden items-center justify-center"
        title="Nápady a hlášení chyb"
      >
        <div className="absolute inset-0 bg-mafia-gold/20 animate-pulse opacity-50 rounded-full pointer-events-none" />
        <MessageSquare size={28} className="relative z-10 group-hover:text-white transition-colors" />
      </motion.button>

      {/* Modál */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0c0c0c] border-2 border-mafia-gold shadow-[0_0_50px_rgba(197,160,89,0.3)] rounded-lg flex flex-col p-6 z-10"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest mb-6">
                Napište nám
              </h2>

              {status === 'SUCCESS' ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                  </div>
                  <h3 className="text-xl font-heading text-white mb-2">Děkujeme!</h3>
                  <p className="text-white/60">Zpráva byla úspěšně odeslána.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('IDEA')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded transition-colors ${type === 'IDEA' ? 'bg-mafia-gold/10 border-mafia-gold text-mafia-gold' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                    >
                      <Lightbulb size={24} />
                      <span className="text-xs uppercase tracking-widest font-bold">Vize a zlepšení</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('BUG')}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded transition-colors ${type === 'BUG' ? 'bg-mafia-gold/10 border-mafia-gold text-mafia-gold' : 'border-white/10 text-white/50 hover:border-white/30'}`}
                    >
                      <Bug size={24} />
                      <span className="text-xs uppercase tracking-widest font-bold">Nahlásit problém</span>
                    </button>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={type === 'IDEA' ? "Mám nápad na vylepšení..." : "Něco nefunguje správně..."}
                      className="w-full h-32 bg-black border border-white/20 rounded p-4 text-white focus:outline-none focus:border-mafia-gold transition-colors resize-none"
                      required
                    />
                  </div>

                  {status === 'ERROR' && (
                    <div className="text-red-500 text-sm mt-1">{errorMsg}</div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'LOADING' || !message.trim()}
                    className="w-full mt-4 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                  >
                    {status === 'LOADING' ? 'Odesílání...' : 'Odeslat'}
                    {!status && <Send size={18} />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
