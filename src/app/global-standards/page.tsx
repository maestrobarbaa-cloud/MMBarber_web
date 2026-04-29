"use client";

import { motion } from "framer-motion";
import { Globe, ChevronLeft, ShieldCheck, Star, Zap } from "lucide-react";
import Link from "next/link";

export default function GlobalStandardsPage() {
  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.05)_0%,rgba(0,0,0,1)_80%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-16"
        >
          <ChevronLeft size={14} />
          Back to Headquarters
        </Link>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <Globe size={32} className="text-mafia-gold animate-pulse" />
             <h1 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter">
               GLOBAL <span className="text-mafia-gold italic">STANDARDS</span>
             </h1>
          </div>
          <p className="text-xl font-sans italic text-smoke-white/60 max-w-2xl border-l-2 border-mafia-gold/20 pl-6">
            MM BARBER is not just a local shop. We follow the highest international standards of the grooming industry, 
            blending traditional craftsmanship with modern European techniques.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all">
             <ShieldCheck size={24} className="text-mafia-gold mb-6" />
             <h3 className="text-xl font-heading font-black uppercase mb-4">International Quality</h3>
             <p className="text-sm text-smoke-white/50 leading-relaxed italic">
               Whether you are visiting from London, Berlin, or New York, you will find the same level of precision 
               as in the world&apos;s leading barbershops. We use professional-grade tools and premium European grooming products.
             </p>
          </div>
          <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-mafia-gold/20 transition-all">
             <Star size={24} className="text-mafia-gold mb-6" />
             <h3 className="text-xl font-heading font-black uppercase mb-4">Tourist Friendly</h3>
             <p className="text-sm text-smoke-white/50 leading-relaxed italic">
               Visiting the Czech Republic? Our barbers are English-speaking and ready to provide a top-tier service. 
               Located in the heart of Moravia, we are a must-visit destination for grooming enthusiasts.
             </p>
          </div>
        </div>

        <section className="mb-24">
           <h2 className="text-2xl font-heading font-black uppercase tracking-widest mb-12 flex items-center gap-4">
             <Zap size={20} className="text-mafia-gold" />
             Why MM BARBER?
           </h2>
           <div className="space-y-6">
              <div className="flex gap-6 items-start">
                 <span className="text-mafia-gold font-mono text-xs mt-1">01/</span>
                 <div>
                    <h4 className="font-bold uppercase tracking-widest mb-2">Technical Excellence</h4>
                    <p className="text-sm opacity-60">Specializing in high-contrast skin fades and traditional razor beard grooming.</p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <span className="text-mafia-gold font-mono text-xs mt-1">02/</span>
                 <div>
                    <h4 className="font-bold uppercase tracking-widest mb-2">Noir Atmosphere</h4>
                    <p className="text-sm opacity-60">A unique, private club environment designed for the modern gentleman.</p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <span className="text-mafia-gold font-mono text-xs mt-1">03/</span>
                 <div>
                    <h4 className="font-bold uppercase tracking-widest mb-2">Central Location</h4>
                    <p className="text-sm opacity-60">Easily accessible from major cities like Prague, Brno, or Vienna.</p>
                 </div>
              </div>
           </div>
        </section>

        <div className="p-12 border border-mafia-gold/20 bg-mafia-gold/5 text-center">
           <h3 className="text-2xl font-heading font-black uppercase mb-6">Ready for your mission?</h3>
           <Link 
              href="https://is.mmbarber.cz/" 
              className="inline-block bg-mafia-gold text-mafia-black px-12 py-4 font-heading font-black uppercase tracking-widest hover:bg-white transition-all"
           >
              Book Your Appointment
           </Link>
        </div>
      </div>

      <div className="fixed right-6 top-1/2 -rotate-90 origin-right text-[8px] font-mono text-white/5 uppercase tracking-[1em] whitespace-nowrap pointer-events-none">
        GLOBAL_GROOMING_HUB_V3.3
      </div>
    </main>
  );
}
