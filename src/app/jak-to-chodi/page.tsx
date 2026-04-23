"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { playSound } from "@/utils/audio";

export default function NewspaperPage() {
  const [isBurning, setIsBurning] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleClose = () => {
    const isSoundEnabled = typeof window !== 'undefined' && localStorage.getItem("mmbarber_sound_enabled") === "true";
    
    if (isSoundEnabled) {
      const sirka = new Audio("/sounds/sirka.mp3");
      sirka.volume = 0.5;
      sirka.onended = () => {
        playSound("/sounds/fire.mp3", 0.8);
        setIsBurning(true);
        // Increase timeout for a more dramatic burning effect before redirect
        setTimeout(() => {
          router.push("/");
        }, 2800);
      };
      sirka.play().catch(() => {
        // Fallback if play is blocked by browser
        setIsBurning(true);
        setTimeout(() => router.push("/"), 1500);
      });
    } else {
      // Fallback if sounds are disabled
      setIsBurning(true);
      setTimeout(() => router.push("/"), 1500);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-2 md:p-8">
      
      <AnimatePresence>
        {isBurning && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3.5, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeIn" }}
            className="absolute z-50 w-[100vw] h-[100vw] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, #0a0a0a 40%, rgba(255,80,0,0.8) 55%, rgba(197,160,89,0.9) 70%, transparent 100%)",
              boxShadow: "0 0 150px 80px rgba(255,50,0,0.8) inset, 0 0 250px 100px rgba(197,160,89,0.5)"
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={isBurning ? { 
            scale: 0.85, 
            opacity: 0, 
            filter: "sepia(1) hue-rotate(-20deg) saturate(4) brightness(0.1) contrast(3)"
        } : { 
            opacity: 1, 
            y: 0,
            filter: "sepia(0.6) hue-rotate(-5deg) saturate(1.2) brightness(0.95)"
        }}
        transition={{ duration: isBurning ? 1.5 : 0.8, ease: "easeInOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="absolute inset-0 bg-[#E8dfcc] shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-90 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(80,50,20,0.4)] pointer-events-none"></div>

        <div className="relative z-20 px-6 py-12 md:px-16 md:py-16 text-[#2C241B] max-h-[90vh] overflow-y-auto hide-scrollbar selection:bg-[#2C241B] selection:text-[#EFE8D8]">
          
          <div className="border-b-[5px] border-[#2C241B] border-double pb-4 mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter mix-blend-color-burn">
              {t.newspaper?.masthead ?? "Denní Rozkaz"}
            </h1>
            <div className="flex justify-between items-center mt-2 border-t border-b border-[#2C241B] py-1.5 text-xs md:text-sm font-mono tracking-widest uppercase opacity-90 font-bold">
              <span>{t.newspaper?.circulation ?? "NÁKLAD: PŘÍSNĚ TAJNÉ"}</span>
              <span>MMBARBER SOCIETY</span>
              <span>{t.newspaper?.price ?? "CENA: LOAJALITA"}</span>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-[#2C241B] opacity-40 hover:opacity-100 transition-all z-50 hover:rotate-90 hover:scale-110 duration-300"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <article className="max-w-3xl mx-auto mt-4">
            <h2 className="text-3xl md:text-5xl font-heading font-black uppercase leading-tight mb-8 text-center text-[#1a1510]">
              {t.newspaper?.headline ?? "Jak to u nás (ne)funguje"}
            </h2>
            
            <p className="text-center font-mono text-sm uppercase tracking-widest mb-12 opacity-80 border-b border-[#2C241B]/30 pb-6 italic">
              {t.newspaper?.subheadline ?? "Tady nejde jen o střih. Očekávej něco jiného."}
            </p>

            <div className="columns-1 md:columns-2 gap-10 font-sans text-base md:text-lg leading-relaxed text-justify opacity-95 prose-p:mb-6">
              
              <p>
                <span className="float-left text-6xl md:text-7xl leading-none font-heading font-black pr-2 pt-2 mix-blend-color-burn">
                  {(t.newspaper?.p1 ?? "U nás to nefunguje...").charAt(0)}
                </span>
                {(t.newspaper?.p1 ?? "U nás to nefunguje jako někde jinde. Přijdeš, posadíš se do křesla a my se postaráme o zbytek. Během toho pokecáme, probereme, co chceš – nebo co ani nevíš, že chceš. A když budeš mít chuť, klidně zůstaň. Sedni si, dej řeč s ostatníma. Tady se nikdo nehoní pryč.").slice(1)}
              </p>

              <p>
                {t.newspaper?.p2 ?? "A nebo? Jdeš jen kolem? Klidně se zastav, sedni si na pokec, človíčku. Dveře jsou otevřené. Dáváme ti volnost. Tvůj styl, tvoje pravidla. Máš vlastní představu? Jedeme podle tebe. Nemáš? Navrhneme, co ti sedne. Tady se netvoří jen účesy, tady se tvoří atmosféra."}
              </p>

              <p>
                {t.newspaper?.p3 ?? "A ještě jedna věc – prostor je u nás dost soukromý na to, aby ses necítil jak ve vitríně. Klid, pohoda, žádný zbytečný oči navíc. Tady máš svůj kout na vypnutí od okolního hluku."}
              </p>
              
              <p className="font-bold border-l-4 border-[#2C241B] pl-4 italic">
                {t.newspaper?.p4 ?? "Náš časový tarif je především vhodný pro klienty, kteří vědí, co chtějí. Pokud si nejste jistí, řiďte se jednoduše tím, na co běžně chodíte ke svému barberovi – my už si s tím poradíme."}
              </p>

              <p className="font-heading font-black text-xl md:text-2xl text-center italic mt-12 md:mt-16 md:col-span-1 opacity-90 mix-blend-color-burn">
                {t.newspaper?.motto ?? "Jak se říká… náš zákazník, náš pán."}
              </p>
            </div>
          </article>

          <div className="mt-20 text-center border-t-2 border-[#2C241B] border-dashed pt-10 relative">
            <button 
              onClick={handleClose}
              className="inline-flex items-center gap-3 border-4 border-[#2C241B] px-8 py-4 font-heading font-black uppercase tracking-widest hover:bg-[#2C241B] hover:text-[#EFE8D8] transition-all duration-300 group hover:scale-105 active:scale-95"
            >
              <Flame className="group-hover:animate-pulse text-amber-600 group-hover:text-amber-500" size={24} />
              {t.newspaper?.burnBtn ?? "Spálit po přečtení"}
            </button>
            <p className="font-mono text-[10px] md:text-xs mt-6 opacity-60 uppercase tracking-[0.2em] font-bold">
              {t.newspaper?.burnNote ?? "Zničí veškeré důkazy o tvé přítomnosti"}
            </p>
          </div>

        </div>
      </motion.div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
