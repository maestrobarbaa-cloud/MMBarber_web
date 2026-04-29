"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { Camera, Map, History, Compass } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MojeCesta() {
  const { t } = useTranslation();
  
  const timelineEvents: { year: string; title: string; desc: string; side: string; icon?: React.ElementType }[] = t.journey.timeline;
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add film grain animation
    if (grainRef.current) {
      gsap.to(grainRef.current, {
        backgroundPosition: "100px 100px",
        duration: 0.1,
        repeat: -1,
        ease: "none"
      });
    }

    // Header transition fix
    gsap.fromTo("main", { opacity: 0 }, { opacity: 1, duration: 1.5 });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-smoke-white selection:bg-mafia-gold selection:text-mafia-black overflow-hidden relative">
      
      {/* Film Grain Layer */}
      <div 
        ref={grainRef}
        className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      ></div>

      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-mafia-gold origin-left z-[100]" style={{ scaleX }} />

      <main className="pt-32 pb-24 px-4">
        
        {/* Hero Section */}
        <section className="container mx-auto text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <div className="h-px w-8 md:w-16 bg-mafia-gold"></div>
            <span className="text-mafia-gold font-mono uppercase tracking-[0.5em] text-[10px] md:text-xs">{t.journey.subtitle}</span>
            <div className="h-px w-8 md:w-16 bg-mafia-gold"></div>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-heading font-black text-smoke-white uppercase tracking-tight mb-8">
            {t.journey.title[0]} <span className="text-transparent bg-clip-text bg-gradient-to-b from-mafia-gold to-mafia-dark italic">{t.journey.title[1]}</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-smoke-white/60 font-sans text-lg md:text-xl italic leading-relaxed">
            {t.journey.description}
          </p>

          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[300px] bg-mafia-gold/5 blur-[120px] -z-10 rounded-full"></div>
        </section>

        {/* Pirate Map Timeline */}
        <section className="container mx-auto relative px-4 md:px-0">
          
          {/* Vertical Path (The Map Line) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 md:w-1.5 hidden md:block border-l-2 border-dashed border-mafia-gold/20"></div>

          <div className="space-y-24 md:space-y-48">
            {timelineEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: event.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${event.side === "right" ? "md:flex-row-reverse" : ""}`}
              >
                {/* Content Side */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`flex flex-col ${event.side === "right" ? "md:items-end md:text-right" : ""}`}>
                    <span className="text-6xl md:text-8xl font-black text-mafia-gold/10 font-mono mb-[-20px] md:mb-[-40px] block">
                      {event.year}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-heading font-bold text-mafia-gold mb-4 uppercase tracking-wider">
                      {event.title}
                    </h3>
                    <p className="text-smoke-white/60 font-sans text-sm md:text-base max-w-md leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </div>

                {/* Marker Center */}
                <div className="relative z-10 shrink-0 mb-8 md:mb-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-mafia-black border-4 border-mafia-gold flex items-center justify-center text-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.3)] group hover:scale-110 transition-transform cursor-pointer">
                    {idx === 0 ? <Compass className="w-6 h-6" /> : idx === 1 ? <Map className="w-6 h-6" /> : idx === 2 ? <History className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                    
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border border-mafia-gold animate-ping opacity-20"></div>
                  </div>
                </div>

                {/* Photo Placeholder Side */}
                <div className="flex-1 w-full md:w-auto">
                  <div className="aspect-[4/3] md:aspect-video bg-mafia-dark border border-mafia-gold/20 relative group overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                    <Image 
                      src={`https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800`} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                      alt="Operations"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mafia-gold/50">
                      <Camera size={12} /> {t.journey.archiveShot} #{idx + 1}
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Final "X marks the spot" */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-48 flex flex-col items-center"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-mafia-gold/20 flex items-center justify-center relative rotate-45 mb-12 group hover:border-mafia-gold transition-colors cursor-pointer">
              <span className="text-4xl md:text-5xl font-black text-mafia-gold -rotate-45">X</span>
              <div className="absolute -inset-8 bg-mafia-gold/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h4 className="text-xl md:text-2xl font-heading font-black text-smoke-white uppercase tracking-[0.3em] mb-4">
              {t.journey.footerTitle}
            </h4>
            <Link 
              href="/#operativi" 
              className="font-mono text-mafia-gold/50 hover:text-mafia-gold transition-colors uppercase tracking-[0.2em] text-xs underline decoration-mafia-gold/20"
            >
              {t.journey.footerCta} →
            </Link>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
