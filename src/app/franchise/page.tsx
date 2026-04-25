"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Building2, TrendingUp, Handshake, Mail, Instagram, CheckCircle2, LayoutGrid, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

export default function FranchisePage() {
  const { t } = useTranslation();
  const f = t.franchisePage;


  const sections = [
    {
      title: f.sections.about.title,
      content: (
        <div className="space-y-6">
          <p className="text-mafia-gold font-mono text-[10px] tracking-[0.4em] uppercase">{f.sections.about.label}</p>
          <p className="text-xl md:text-2xl font-heading font-black text-smoke-white uppercase leading-relaxed">
            {f.sections.about.desc}
          </p>
          <div className="flex items-center gap-4 py-4">
            <div className="h-px w-12 bg-mafia-gold"></div>
            <p className="text-mafia-gold italic font-heading text-xl uppercase tracking-widest font-black">
              {f.sections.about.motto}
            </p>
          </div>
        </div>
      )
    },
    {
      title: f.sections.benefits.title,
      icon: <LayoutGrid className="text-mafia-gold" size={24} />,
      items: f.sections.benefits.items
    },
    {
      title: f.sections.who.title,
      icon: <Users className="text-mafia-gold" size={24} />,
      content: (
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-heading font-black text-smoke-white uppercase">
            {f.sections.who.desc}
          </p>
          <p className="text-sm font-mono text-white/60 tracking-wider leading-loose">
            {f.sections.who.motto}
          </p>
        </div>
      )
    },
    {
      title: f.sections.how.title,
      icon: <TrendingUp className="text-mafia-gold" size={24} />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {f.sections.how.steps.map((text: string, idx: number) => (
            <div key={idx} className="relative p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <span className="absolute top-2 right-4 text-4xl font-heading font-black text-mafia-gold/10">0{idx + 1}</span>
              <p className="text-smoke-white font-heading font-bold uppercase tracking-widest">{text}</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <Link href="/" className="group flex items-center gap-3 text-mafia-gold/60 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.3em] mb-12">
            <ChevronLeft size={14} /> {f.back}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-mafia-gold/20 pb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-heading font-black text-smoke-white uppercase tracking-tighter mb-4 italic">
                {f.title}<br />{f.subtitle}
              </h1>
              <p className="text-mafia-gold font-heading text-lg md:text-xl uppercase tracking-widest font-black max-w-xl">
                {f.heroDesc}
              </p>
            </div>
            <div className="hidden md:block">
               <Image src="/logo.png" alt="MM" width={100} height={70} className="opacity-20 grayscale" />
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-32">
          {sections.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-12">
                <div className="w-8 h-px bg-mafia-gold/40"></div>
                <h2 className="text-sm font-mono text-mafia-gold uppercase tracking-[0.5em] font-bold">
                  {section.title}
                </h2>
              </div>
              
              {section.items ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/[0.01] hover:bg-mafia-gold/5 hover:border-mafia-gold/20 transition-all duration-500 group">
                      <CheckCircle2 size={16} className="text-mafia-gold opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="text-smoke-white font-heading text-sm uppercase tracking-widest font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                section.content
              )}
            </motion.section>
          ))}

          {/* Contact Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 border-2 border-mafia-gold bg-mafia-gold/5 backdrop-blur-xl text-center relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-mafia-gold/10 blur-3xl rounded-full" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-black text-smoke-white uppercase mb-8 italic">{f.contact.title}</h2>
            <p className="text-mafia-gold font-heading text-xl uppercase tracking-widest mb-12 font-black">
              {f.contact.desc}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="mailto:info@mmbarber.cz" className="w-full md:w-auto px-12 py-5 bg-mafia-gold text-mafia-black font-heading font-black text-xs uppercase tracking-[0.3em] hover:bg-smoke-white transition-all duration-500 flex items-center justify-center gap-3">
                <Mail size={18} /> {f.contact.email}
              </a>
              <a href="https://instagram.com/mmbarber" target="_blank" rel="noreferrer" className="w-full md:w-auto px-12 py-5 border-2 border-mafia-gold text-mafia-gold font-heading font-black text-xs uppercase tracking-[0.3em] hover:bg-mafia-gold hover:text-mafia-black transition-all duration-500 flex items-center justify-center gap-3">
                <Instagram size={18} /> {f.contact.instagram}
              </a>
            </div>
          </motion.section>
        </div>

        {/* Footer info */}
        <div className="mt-40 text-center space-y-4 opacity-40 hover:opacity-100 transition-opacity duration-1000">
           <div className="h-px w-20 bg-mafia-gold mx-auto mb-8"></div>
           <p className="text-3xl font-heading font-black text-smoke-white tracking-tighter">MMBARBER</p>
           <p className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.6em]">{f.footer}</p>
        </div>
      </div>

      {/* HIDDEN SEO LAYER - THEME AWARE & INTERNATIONAL */}
      <div 
        className="absolute bottom-0 left-0 w-full p-4 pointer-events-none select-none opacity-[0.01] flex flex-col gap-2"
        style={{ fontSize: '1px', color: 'var(--color-mafia-gold)' }}
      >
        <div className="flex flex-wrap gap-2">
          <h2>MMBARBER FRANCHISE - Business Opportunity in Men's Grooming</h2>
          <p>
            Looking for a profitable barbershop franchise? MMBARBER offers a unique business model 
            combining heritage style with modern grooming efficiency. Our franchise program 
            is designed for entrepreneurs who value quality and community. 
            Invest in a brand with a strong track record and global ambitions.
          </p>
          <p>
            Keywords: international barbershop franchise, men's lifestyle business, 
            premium grooming investment, start a barber business Europe, 
            MMBarber partnership, profitable grooming concept, 
            barbershop brand licensing, professional barber support.
          </p>
          <p>
            Klíčová slova: franchisa barbershop, podnikání v barberu, 
            investice do kadeřnictví, MMBarber franchise koncept, 
            vlastní holičství pod značkou, podpora podnikání, 
            úspěšný byznys model, pánský grooming franchisa.
          </p>
        </div>
      </div>
    </main>
  );
}
