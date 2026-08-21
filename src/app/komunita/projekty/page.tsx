"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  ExternalLink,
  Target,
  Gamepad2,
  Lock
} from "lucide-react";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";

export default function ProjectsPage() {
  const { t, lang } = useTranslation();

  const activeProjects = [
    {
      id: 'minecraft_server',
      title: 'MINECRAFT SERVER',
      status: 'ONLINE',
      tag: 'GAMING',
      desc: lang === 'cs' ? 'Oficiální MMBarber Minecraft server. Místo pro relax a budování v naší komunitě.' : 'Official MMBarber Minecraft server. A place to relax and build within our community.',
      date: 'ACTIVE NOW',
      icon: <Gamepad2 className="text-mafia-gold" size={48} />,
      link: '#', // Will be added later
      details: [
        { label: 'IP', value: 'play.mmbarber.cz' },
        { label: 'VERSION', value: '1.20.1+' },
        { label: 'SLOTS', value: '100' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT NA KOMUNITU" : "BACK TO COMMUNITY"}
        </Link>
        <div className="text-right">
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase">SYSTEM_PROJECTS_v2</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-24 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <Target className="text-mafia-gold" size={20} />
            <span className="text-mafia-gold font-mono text-xs tracking-[0.6em] uppercase">MISSE_LOG</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-heading font-black uppercase tracking-tighter italic mb-8">
            KOMUNITNÍ <span className="text-mafia-gold">PROJEKTY</span>
          </h1>
          <p className="text-xl text-smoke-white/60 max-w-2xl font-sans italic mx-auto md:mx-0">
            Aktuální iniciativy, které propojují naši smečku mimo křeslo holičství.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {activeProjects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-mafia-dark/40 border border-white/5 p-8 md:p-16 relative overflow-hidden hover:border-mafia-gold/30 transition-all duration-700"
            >
              <div className="absolute top-0 right-0 p-12">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs font-mono font-black text-green-500 tracking-widest">{project.status}</span>
                 </div>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 border border-mafia-gold/20 bg-mafia-gold/5 flex items-center justify-center group-hover:border-mafia-gold/50 transition-all duration-700">
                   {project.icon}
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                     <span className="px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/30 text-mafia-gold text-[9px] font-mono tracking-widest uppercase">{project.tag}</span>
                     <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/30 text-[9px] font-mono tracking-widest uppercase">{project.date}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 tracking-tighter italic uppercase">{project.title}</h2>
                  <p className="text-smoke-white/60 mb-12 font-sans italic text-lg max-w-2xl">{project.desc}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     {project.details.map((detail, idx) => (
                       <div key={idx} className="p-4 bg-white/[0.02] border border-white/5">
                          <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">{detail.label}</div>
                          <div className="text-sm font-mono text-mafia-gold font-bold tracking-widest uppercase">{detail.value}</div>
                       </div>
                     ))}
                  </div>

                  <button className="w-full md:w-auto px-12 py-5 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-4">
                     PŘIPOJIT SE <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-mafia-gold/5 to-transparent pointer-events-none"></div>
            </motion.div>
          ))}

          {/* Locked Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[1, 2].map((_, i) => (
               <div key={i} className="border-2 border-dashed border-white/5 p-12 flex flex-col items-center justify-center text-center group">
                  <Lock className="text-white/5 mb-6 group-hover:text-white/10 transition-colors" size={32} />
                  <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.6em]">MISSION_LOCKED</span>
               </div>
             ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
