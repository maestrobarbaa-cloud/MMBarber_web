"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, AlertTriangle } from "lucide-react";
import { playSound } from "@/utils/audio";
import { useBarbers } from "@/contexts/BarberContext";

const CITIES = ["Brno", "Praha", "Zlín", "Olomouc", "Bratislava", "Vídeň", "Ostrava", "Hodonín", "Kroměříž", "Staré Město"];

export function CorporateTricks() {
  const { barbers } = useBarbers();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [showExitModal, setShowExitModal] = useState(false);

  // 1. Social Proof (Booking.com style Toast)
  useEffect(() => {
    // Generate a random booking toast every 1 to 3 minutes
    const triggerToast = () => {
      const activeBarbers = barbers && barbers.length > 0 ? barbers : [{ name: "Tomáš" }, { name: "Nella" }];
      const barber = activeBarbers[Math.floor(Math.random() * activeBarbers.length)].name;
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      
      const messages = [
        `Někdo z města ${city} si právě zarezervoval místo u barbera ${barber}.`,
        `Někdo z města ${city} právě vyžádal audienci.`,
        `Poslední volný termín na tento týden u barbera ${barber} právě zmizel.`
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];

      setToast({ message: msg, visible: true });
      playSound("/sounds/notification.mp3", 0.5); // Ensure you have this sound or fallback to default

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 5000); // hide after 5 seconds

      // Schedule next toast
      const nextDelay = Math.random() * (180000 - 60000) + 60000; // 1-3 mins
      setTimeout(triggerToast, nextDelay);
    };

    const initialDelay = Math.random() * (45000 - 15000) + 15000; // 15-45 secs for first
    const timer = setTimeout(triggerToast, initialDelay);

    return () => clearTimeout(timer);
  }, [barbers]);

  // 2. Exit Intent (Mouse leaves window at the top)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        // User moved mouse to the top to close/switch tab
        const today = new Date().toDateString();
        const seen = localStorage.getItem("mmbarber_exit_intent_seen");

        if (seen !== today) {
          setShowExitModal(true);
          playSound("/sounds/digital_start.mp3", 0.7);
          localStorage.setItem("mmbarber_exit_intent_seen", today);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: 50 }}
            className="fixed bottom-6 left-6 z-[9999] bg-[#0a0a0a] border border-mafia-gold/30 p-4 shadow-[0_0_20px_rgba(197,160,89,0.2)] max-w-sm rounded"
          >
            <div className="flex items-start gap-3">
              <Users className="text-mafia-gold mt-1 shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-heading font-bold text-smoke-white uppercase mb-1">Žhavá Aktivita</h4>
                <p className="text-xs text-smoke-white/70 font-sans">{toast.message}</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-mafia-gold/0 via-mafia-gold to-mafia-gold/0"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#050505] border border-mafia-red max-w-xl w-full p-8 relative shadow-[0_0_50px_rgba(138,7,7,0.3)]"
            >
              <button 
                onClick={() => setShowExitModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-mafia-red transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="text-mafia-red mb-6" size={48} />
                <h2 className="text-3xl font-heading font-black text-white uppercase tracking-[0.2em] mb-4">
                  Kam si myslíš, že jdeš?
                </h2>
                <p className="text-smoke-white/80 font-sans mb-8">
                  Opustit náš revír bez toho, aniž bys požádal o audienci u křesla, je projev naprosté neúcty k Rodině. Víme o tobě.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => {
                      setShowExitModal(false);
                      document.getElementById("operativi")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 py-4 bg-mafia-red text-white hover:bg-mafia-dark font-black uppercase tracking-widest text-sm transition-colors border border-mafia-red"
                  >
                    Omlouvám se, jdu se objednat
                  </button>
                  <button 
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-4 bg-transparent text-white/50 hover:text-white border border-white/20 font-black uppercase tracking-widest text-sm transition-colors"
                  >
                    Riskovat a odejít
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
