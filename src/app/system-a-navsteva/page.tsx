"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  X, 
  Info, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  ShieldCheck,
  Scissors,
  Zap,
  Target,
  Layers
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

const FloatingParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.x}%`, y: `${p.y}%` }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [`${p.y}%`, `${p.y - 20}%`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute rounded-full bg-mafia-gold/30 blur-[1px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

const SectionCard = ({ section, idx }: { section: any, idx: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: idx * 0.1, duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative bg-mafia-dark/20 backdrop-blur-md border border-white/5 hover:border-mafia-gold/40 transition-all duration-700 p-6 md:p-10 flex flex-col gap-6 overflow-hidden"
    >
      {/* Cinematic Scanner Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mafia-gold/5 to-transparent -translate-y-[100%] group-hover:translate-y-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none"></div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold/20 group-hover:border-mafia-gold/60 transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold/20 group-hover:border-mafia-gold/60 transition-colors"></div>

      {/* Decorative ID */}
      <div className="absolute top-4 right-6 font-mono text-[10px] text-mafia-gold/20 group-hover:text-mafia-gold/40 transition-colors uppercase tracking-[0.3em]">
        REF_S0{idx + 1}
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 border border-mafia-gold/10 flex items-center justify-center bg-black/40 group-hover:border-mafia-gold group-hover:scale-110 transition-all duration-500 mb-8">
           <div className="text-mafia-gold/40 group-hover:text-mafia-gold transition-colors">
              {section.icon}
           </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-widest text-white mb-6 group-hover:text-mafia-gold transition-colors duration-500">
          {section.title}
        </h2>

        <div className="space-y-4 text-smoke-white/60 font-sans leading-relaxed text-sm md:text-base group-hover:text-smoke-white/80 transition-colors duration-500">
          {section.content}
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-mafia-gold/5 rounded-full blur-[60px] group-hover:bg-mafia-gold/10 transition-all"></div>
    </motion.div>
  );
};

export default function SystemVisitPage() {
  const router = useRouter();
  const { lang } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    router.push("/#operativi");
  };

  const sections = [
    {
      icon: <Scissors size={28} />,
      title: lang === 'cs' ? "Čisté vs. „nošené“ vlasy" : "Clean vs. „worn“ hair",
      content: lang === 'cs' ? (
        <>
          <p>Ideální stav je přijít s <span className="text-white font-bold">čistými, přirozenými</span> vlasy – ideálně umytými v den návštěvy.</p>
          <p>Díky tomu vidíme skutečný objem, směr růstu a můžeme vytvořit střih, který bude fungovat i doma.</p>
          <div className="mt-4 p-4 bg-mafia-gold/5 border-l-2 border-mafia-gold/40">
             <p className="italic text-xs opacity-70">Pokud přijdete s lehce „nošenými“ vlasy, nevadí – umíme s tím pracovat a v určitých případech to pomůže při prvotním tvarování.</p>
          </div>
        </>
      ) : (
        <>
          <p>Ideal state is to come with <span className="text-white font-bold">clean, natural</span> hair – ideally washed on the day of visit.</p>
          <p>This allows us to see real volume, growth direction and create a cut that works at home.</p>
          <div className="mt-4 p-4 bg-mafia-gold/5 border-l-2 border-mafia-gold/40">
             <p className="italic text-xs opacity-70">If you come with slightly „worn“ hair, it&apos;s okay – we can work with it and in some cases, it helps with initial shaping.</p>
          </div>
        </>
      )
    },
    {
      icon: <Target size={28} />,
      title: lang === 'cs' ? "Náš přístup" : "Our approach",
      content: lang === 'cs' ? (
        <div className="space-y-6 mt-2">
          <p className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.4em]">Bez dogmat. Maximální výsledek.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Aktuální stav jako výchozí bod</span>
            </li>
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Kombinace suché i mokré techniky</span>
            </li>
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Finální kontrola pro běžný život</span>
            </li>
          </ul>
        </div>
      ) : (
        <div className="space-y-6 mt-2">
          <p className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.4em]">No dogmas. Maximum outcome.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Current state as starting point</span>
            </li>
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Combination of dry and wet techniques</span>
            </li>
            <li className="flex items-center gap-4 group/item">
              <div className="w-2 h-2 bg-mafia-gold rotate-45 group-hover/item:scale-150 transition-transform"></div>
              <span className="text-xs uppercase tracking-wider font-bold">Final check for everyday life</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: <MessageSquare size={28} />,
      title: lang === 'cs' ? "Komunikace" : "Communication",
      content: lang === 'cs' ? (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Řekněte, co chcete</p>
          </div>
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Ukažte inspiraci</p>
          </div>
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Nechte si poradit</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-2">
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Say what you want</p>
          </div>
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Show inspiration</p>
          </div>
          <div className="bg-mafia-black/40 border border-white/5 p-4 group-hover:border-mafia-gold/20 transition-colors">
            <p className="text-xs font-bold uppercase tracking-widest text-center">Get advised</p>
          </div>
        </div>
      )
    },
    {
      icon: <Calendar size={28} />,
      title: lang === 'cs' ? "Intervaly" : "Intervals",
      content: lang === 'cs' ? (
        <div className="space-y-8 mt-4">
          <div className="flex justify-between items-end border-b border-mafia-gold/10 pb-2">
            <span className="font-mono text-[10px] uppercase opacity-40">Krátké střihy</span>
            <span className="text-xl font-heading font-black text-mafia-gold">2–3 TÝDNY</span>
          </div>
          <div className="flex justify-between items-end border-b border-mafia-gold/10 pb-2">
            <span className="font-mono text-[10px] uppercase opacity-40">Delší styly</span>
            <span className="text-xl font-heading font-black text-mafia-gold">3–5 TÝDNŮ</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8 mt-4">
          <div className="flex justify-between items-end border-b border-mafia-gold/10 pb-2">
            <span className="font-mono text-[10px] uppercase opacity-40">Short cuts</span>
            <span className="text-xl font-heading font-black text-mafia-gold">2–3 WEEKS</span>
          </div>
          <div className="flex justify-between items-end border-b border-mafia-gold/10 pb-2">
            <span className="font-mono text-[10px] uppercase opacity-40">Longer styles</span>
            <span className="text-xl font-heading font-black text-mafia-gold">3–5 WEEKS</span>
          </div>
        </div>
      )
    },
    {
      icon: <Clock size={28} />,
      title: lang === 'cs' ? "Časový Blok" : "Time Block",
      content: lang === 'cs' ? (
        <div className="space-y-4">
          <p className="text-sm">Rezervujete si konkrétní <span className="text-white underline decoration-mafia-gold/40 underline-offset-4">časový blok</span>.</p>
          <p className="text-xs text-smoke-white/40 leading-relaxed italic">Kvalita má vždy přednost před kvantitou. Co se v daném čase stihne, to se stihne s maximálním soustředěním.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">You book a specific <span className="text-white underline decoration-mafia-gold/40 underline-offset-4">time block</span>.</p>
          <p className="text-xs text-smoke-white/40 leading-relaxed italic">Quality always takes priority over quantity. What we manage in that time, we do with maximum focus.</p>
        </div>
      )
    },
    {
      icon: <ShieldCheck size={28} />,
      title: lang === 'cs' ? "Férový Servis" : "Fair Service",
      content: lang === 'cs' ? (
        <div className="grid grid-cols-1 gap-2">
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 01</span>
              <p className="text-[11px] font-bold uppercase">Vy určujete přání</p>
           </div>
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 02</span>
              <p className="text-[11px] font-bold uppercase">My přizpůsobíme práci</p>
           </div>
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 03</span>
              <p className="text-[11px] font-bold uppercase">Férová cena za výsledek</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 01</span>
              <p className="text-[11px] font-bold uppercase">You set the wishes</p>
           </div>
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 02</span>
              <p className="text-[11px] font-bold uppercase">We adapt the work</p>
           </div>
           <div className="bg-mafia-gold/5 border border-mafia-gold/10 p-4 text-center group-hover:bg-mafia-gold/10 transition-colors">
              <span className="block text-[8px] font-mono uppercase tracking-[0.3em] mb-1 opacity-40">STANDARD 03</span>
              <p className="text-[11px] font-bold uppercase">Fair price for outcome</p>
           </div>
        </div>
      )
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white relative overflow-x-hidden">
      {/* CINEMATIC OVERLAYS */}
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>
      <FloatingParticles />
      
      {/* Background Gradient Orbs */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-mafia-gold/5 blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] rounded-full bg-mafia-gold/3 blur-[100px] animate-pulse-slow"></div>
      </div>

      <motion.div style={{ opacity, scale }}>
        {/* HEADER SECTION */}
        <header className="relative z-10 w-full pt-16 pb-32 px-6 md:px-12 text-center overflow-hidden">
          <div className="max-w-5xl mx-auto relative px-4">
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={handleClose}
              className="absolute top-0 right-0 md:-right-8 p-4 bg-white/5 rounded-full border border-white/10 hover:border-mafia-gold transition-all duration-500 z-50 group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <X size={24} className="group-hover:text-mafia-gold" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="relative inline-block mb-12">
                 <Image src="/logo.png" alt="MM" width={100} height={80} className="w-24 mx-auto opacity-60 brightness-150 grayscale" />
                 <motion.div 
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                   className="absolute inset-0 bg-mafia-gold/20 blur-xl rounded-full"
                 />
              </div>
              
              <h1 className="text-4xl md:text-8xl font-heading font-black uppercase tracking-[0.05em] mb-4 leading-none">
                 <span className="block overflow-hidden">
                    <motion.span 
                      initial={{ y: "100%" }} 
                      animate={{ y: 0 }} 
                      transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
                      className="block"
                    >
                      {lang === 'cs' ? "JAK SE PŘIPRAVIT" : "HOW TO PREPARE"}
                    </motion.span>
                 </span>
                 <span className="block overflow-hidden py-2">
                    <motion.span 
                      initial={{ y: "100%" }} 
                      animate={{ y: 0 }} 
                      transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
                      className="block text-mafia-gold italic font-black"
                    >
                      {lang === 'cs' ? "NA NÁVŠTĚVU" : "FOR THE VISIT"}
                    </motion.span>
                 </span>
              </h1>

              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: 120 }} 
                transition={{ delay: 0.6, duration: 1 }}
                className="h-1 bg-mafia-gold mx-auto mb-12 shadow-[0_0_15px_rgba(197,160,89,0.5)]"
              />
              
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.8, duration: 1 }}
                className="text-lg md:text-2xl text-smoke-white/60 font-sans max-w-3xl mx-auto leading-relaxed font-light italic"
              >
                {lang === 'cs' 
                  ? "Dnešní svět pánského střihu stojí na dvou pilířích – klasickém holičství a moderním barbershopu. Każdý má svá pravidla. U nás se tyhle dva světy propojují."
                  : "Modern men's style stands on two pillars – classic barbering and modern barbershop. Each has its rules. Here, we bridge those two worlds."}
              </motion.p>
            </motion.div>
          </div>
        </header>

        {/* CONTENT GRID */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
           {/* Section Headers Decor */}
           <div className="flex items-center gap-4 mb-20 opacity-30">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent"></div>
              <Layers size={20} className="text-mafia-gold animate-pulse" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent"></div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sections.map((section, idx) => (
              <SectionCard key={idx} section={section} idx={idx} />
            ))}
          </div>

          {/* FINAL RESULT / CTA SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5, ease: [0.215, 0.61, 0.355, 1] }}
            className="mt-40 p-12 md:p-24 bg-mafia-dark/30 border-y border-mafia-gold/20 relative text-center overflow-hidden"
          >
             {/* Scanner line going through the whole CTA */}
             <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-mafia-gold/20 z-0 pointer-events-none"
             />

             <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="mb-10 inline-block bg-mafia-gold/10 px-6 py-2 border border-mafia-gold/30"
                >
                   <span className="text-mafia-gold font-mono text-xs uppercase tracking-[0.5em] font-black italic">
                      SYSTEM_CONCLUSION
                   </span>
                </motion.div>

                <h3 className="text-4xl md:text-8xl font-heading font-black uppercase italic tracking-tighter mb-12 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                   {lang === 'cs' ? "VÝSLEDEK" : "THE RESULT"}
                </h3>
                
                <p className="text-xl md:text-4xl font-sans font-light italic text-smoke-white/80 leading-relaxed max-w-3xl mx-auto mb-20 md:mb-32">
                   {lang === 'cs' 
                     ? "Spojujeme preciznost barbershopu s jistotou klasického holičství. Bez pózy. Jen práce, která dává smysl."
                     : "We combine precision and traditional certainty. No poses. Only work that makes sense."}
                </p>

                <div className="flex flex-col items-center gap-12">
                   <div className="flex flex-col items-center">
                      <div className="h-20 w-px bg-gradient-to-t from-mafia-gold to-transparent mb-6 opacity-40"></div>
                      <p className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.8em] font-black text-center mb-8">
                        {lang === 'cs' ? "OPERACE PŘIPRAVENA" : "OPERATION READY"}
                      </p>
                   </div>

                   <motion.button
                     whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(197, 160, 89, 0.4)" }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleClose}
                     className="group relative overflow-hidden bg-mafia-gold text-mafia-black px-12 md:px-20 py-6 md:py-8 font-heading font-black uppercase tracking-[0.3em] text-sm md:text-base transition-all"
                   >
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out"></div>
                      <div className="relative z-10 flex items-center gap-6">
                         <Zap size={24} className="group-hover:animate-pulse" />
                         {lang === 'cs' ? "ROZUMÍM A JDU K REZERVACI" : "UNDERSTOOD, PROCEED TO BOOKING"}
                         <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                      </div>
                   </motion.button>
                </div>
             </div>
          </motion.div>
        </main>

        <footer className="relative z-10 w-full py-20 px-6 text-center">
           <div className="max-w-xs mx-auto h-px bg-mafia-gold/20 mb-8"></div>
           <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-smoke-white/30">
              MMBARBER SOCIETY • PROTOKOL_NÁVŠTĚVY_V3.0 • {new Date().getFullYear()}
           </p>
        </footer>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
