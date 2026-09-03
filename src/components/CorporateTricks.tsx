"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, AlertTriangle } from "lucide-react";
import { playSound } from "@/utils/audio";
import { useBarbers } from "@/contexts/BarberContext";

const LOCAL_CITIES = [
  "Uherského Hradiště", "Starého Města", "Kunovic", "Uherského Brodu", "Zlína",
  "Napajedel", "Otrokovic", "Veselí nad Moravou", "Hluku", "Vlčnova",
  "Ostrožské Nové Vsi", "Buchlovic", "Polešovic", "Babic",
  "Uherského Ostrohu", "Bojkovic", "Brumova-Bylnice", "Valašských Klobouk", "Slavičína", 
  "Luhačovic", "Kyjova", "Strážnice", "Bánova", "Bílovic", "Březolup", "Tupes", 
  "Zlechova", "Nedakonic", "Jalubí", "Huštěnovic", "Traplic", "Velehradu", "Modré", 
  "Kudlovic", "Spytihněvi", "Březnice", "Malenovic", "Nivnice", "Strání", "Korytné", 
  "Boršic", "Prakšic", "Pašovic", "Hradčovic", "Slavkova", "Osvětiman", "Nedachlebic", 
  "Mistřic", "Kněžpole", "Jarošova", "Mařatic", "Popovic", "Břestku", "Salaše", "Sušic"
];

export function CorporateTricks() {
  const { barbers } = useBarbers();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [showExitModal, setShowExitModal] = useState(false);

  // 1. Social Proof (Booking.com style Toast)
  useEffect(() => {
    // Generate a random booking toast every few minutes
    const triggerToast = () => {
      const validBarbers = barbers?.filter(b => !b.missionFailed) || [];
      const activeBarbers = validBarbers.length > 0 ? validBarbers : [{ name: "Tomáš" }];
      const barber = activeBarbers[Math.floor(Math.random() * activeBarbers.length)].name;
      
      // Pokusíme se načíst reálné město uživatele, pokud ho systém dříve zjistil podle IP
      const realCity = localStorage.getItem("mmbarber_geo_city");
      
      let city = LOCAL_CITIES[Math.floor(Math.random() * LOCAL_CITIES.length)];
      const rand = Math.random();
      
      // 30% šance, že použijeme reálné město uživatele pro maximální FOMO efekt
      if (realCity && rand > 0.70) {
        city = realCity;
      } else if (rand > 0.98) {
        city = "Prahy";
      } else if (rand > 0.95) {
        city = "Brna";
      }

      const numPeople = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
      let messages = [];

      if (numPeople > 1) {
        messages = [
          `Právě teď si ${numPeople} lidé z okolí ${city} prohlíží profil barbera ${barber}.`,
          `Rezervační systém hlásí zvýšený zájem: ${numPeople} klienti z lokality ${city} hledají termín.`,
          `Vidíme aktivitu: ${numPeople} lidé ze směru od ${city} právě otevřeli rezervační systém.`,
          `Náš algoritmus detekoval ${numPeople} uživatele z ${city}, kteří právě tvoří rezervaci.`
        ];
      } else {
        messages = [
          `Někdo z okolí ${city} si právě prohlíží profil barbera ${barber}.`,
          `Návštěvník z lokality ${city} zrovna zkoumá naše služby.`,
          `Někdo ze směru od ${city} právě otevřel rezervační kalendář.`,
          `Další zájemce z okolí ${city} zvažuje audienci u barbera ${barber}.`,
          `Zaznamenán pohyb v kalendáři od klienta z ${city}.`
        ];
      }
      
      const msg = messages[Math.floor(Math.random() * messages.length)];

      setToast({ message: msg, visible: true });
      playSound("/sounds/notification.mp3", 0.3);

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 8000);

      const nextDelay = Math.random() * (480000 - 120000) + 120000; 
      setTimeout(triggerToast, nextDelay);
    };

    const initialDelay = Math.random() * (90000 - 45000) + 45000;
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
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden md:block fixed bottom-8 right-8 z-[9999] bg-[#050505] border-l-4 border-mafia-gold/80 p-6 shadow-[0_0_40px_rgba(var(--color-mafia-gold-rgb),0.25)] max-w-md rounded-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-mafia-gold/10 rounded-full shrink-0">
                <Users className="text-mafia-gold" size={28} />
              </div>
              <div>
                <h4 className="text-lg font-heading font-black text-white uppercase mb-1 tracking-wider drop-shadow-md">Žhavá Aktivita</h4>
                <p className="text-sm text-smoke-white/80 font-sans leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-mafia-gold/50 via-transparent to-transparent"></div>
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
