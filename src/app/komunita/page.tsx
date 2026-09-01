"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  Users,
  ShieldCheck,
  Zap,
  BookOpen,
  Instagram,
  Facebook,
  Trophy,
  Camera,
  Bell,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import Image from "@/components/OptimizedImage";
import { Footer } from "@/components/Footer";

export default function CommunityPage() {
  const { t, lang } = useTranslation();
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const parsed: Record<string, boolean> = {};
          if (data.values) {
            Object.entries(data.values).forEach(([key, val]) => {
              parsed[key] = val === 'true';
            });
          }
          setVisibility(parsed);
        }
      } catch (e) {}
    };
    fetchVisibility();
  }, []);

  const communitySectionsBase = [
    {
      id: 'grafika',
      title: lang === 'cs' ? 'GRAFIKA' : 'GRAPHICS',
      subtitle: 'BRAND_ASSETS',
      desc: lang === 'cs' ? 'Stáhni si exkluzivní MMBarber grafiku, tapety a brandové materiály pro tvůj setup.' : 'Download exclusive MMBarber graphics, wallpapers and brand assets for your setup.',
      icon: <Camera className="text-mafia-gold" size={48} />,
      link: '/grafika',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'nabor',
      title: lang === 'cs' ? 'NÁBOR' : 'RECRUITMENT',
      subtitle: 'KARIÉRA',
      desc: lang === 'cs' ? 'Nábor ambiciózních mladých lidí. Bude se konat řízení, zájemci ať se dostaví na stříhání.' : 'Recruitment for ambitious young people. Come for a haircut to apply.',
      icon: <Users className="text-mafia-gold" size={48} />,
      link: '/komunita/nabor',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'chat',
      title: lang === 'cs' ? 'CHAT' : 'CHAT',
      subtitle: 'DISKUSE',
      desc: lang === 'cs' ? 'Zapoj se do živé diskuse s ostatními členy komunity. Sdílej tipy, zeptej se na radu.' : 'Join live discussions with other community members. Share tips, ask for advice.',
      icon: <MessageSquare className="text-mafia-gold" size={48} />,
      link: '/komunita/chat',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'historky',
      title: lang === 'cs' ? 'HISTORKY Z KŘESLA' : 'BARBER STORIES',
      subtitle: 'PŘÍBĚHY',
      desc: lang === 'cs' ? 'Zajímavé příběhy, nečekaná setkání a zákulisí z našeho barbershopu.' : 'Interesting stories, unexpected meetings and behind the scenes from our barbershop.',
      icon: <BookOpen className="text-mafia-gold" size={48} />,
      link: '/komunita/historky',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'hodnoceni',
      title: lang === 'cs' ? 'HODNOCENÍ' : 'REVIEWS',
      subtitle: 'FEEDBACK',
      desc: lang === 'cs' ? 'Přečti si, co o nás říkají ostatní, nebo zanech své vlastní hodnocení.' : 'Read what others say about us, or leave your own review.',
      icon: <ShieldCheck className="text-mafia-gold" size={48} />,
      link: '/komunita/hodnoceni',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'novinky',
      title: lang === 'cs' ? 'NOVINKY' : 'NEWS',
      subtitle: 'AKTUALITY',
      desc: lang === 'cs' ? 'Zůstaň v obraze. Nejnovější akce, nové služby a důležitá oznámení.' : 'Stay updated. Latest events, new services and important announcements.',
      icon: <Bell className="text-mafia-gold" size={48} />,
      link: '/komunita/novinky',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'projekty',
      title: lang === 'cs' ? 'PROJEKTY' : 'PROJECTS',
      subtitle: 'SPOLUPRÁCE',
      desc: lang === 'cs' ? 'Nahlédni pod pokličku našich speciálních projektů a spoluprací.' : 'Take a peek under the hood of our special projects and collaborations.',
      icon: <Zap className="text-mafia-gold" size={48} />,
      link: '/komunita/projekty',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'sin-slavy',
      title: lang === 'cs' ? 'SÍŇ SLÁVY' : 'HALL OF FAME',
      subtitle: 'LEGENDY',
      desc: lang === 'cs' ? 'Oslavujeme naše nejvěrnější klienty a legendární účesy.' : 'Celebrating our most loyal clients and legendary haircuts.',
      icon: <Trophy className="text-mafia-gold" size={48} />,
      link: '/komunita/sin-slavy',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    },
    {
      id: 'zlepseni',
      title: lang === 'cs' ? 'ZLEPŠENÍ' : 'IMPROVEMENTS',
      subtitle: 'NÁPADY',
      desc: lang === 'cs' ? 'Máš nápad, jak MMBarber vylepšit? Sem s ním.' : 'Have an idea how to improve MMBarber? Share it here.',
      icon: <Lightbulb className="text-mafia-gold" size={48} />,
      link: '/komunita/zlepseni',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.25)'
    }
  ];

  const communitySections = communitySectionsBase.filter(section => {
    const key = `visibility_komunita_${section.id.replace('-', '_')}`;
    return visibility[key] !== false; // if undefined or true, it's visible
  });

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.15)_0%,transparent_70%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {t?.sidliste?.return || 'ZPĚT NA ZÁKLADNU'}
        </Link>
        <div className="flex flex-col items-end">
            <div className="w-12 h-12 border border-mafia-gold/20 flex items-center justify-center overflow-hidden p-1">
                <Image src="/logo.png" alt="MM" width={40} height={40} className="w-full h-full object-contain opacity-80" />
            </div>
            <span className="text-[8px] font-mono text-mafia-gold/50 tracking-[0.5em] uppercase mt-2">COMMUNITY_ID_ROOT</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-40">
        
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-mafia-gold font-mono text-[10px] uppercase tracking-[0.8em] mb-12 flex items-center gap-4">
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
               {lang === 'cs' ? "MMBARBER_ECOSYSTEM" : "MMBARBER_ECOSYSTEM"}
               <div className="h-[1px] w-12 bg-mafia-gold/30"></div>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-heading font-black uppercase tracking-tighter italic leading-none mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
              {t.others.community.title.slice(0, -3)}<span className="text-mafia-gold">{t.others.community.title.slice(-3)}</span>
            </h1>
            
            <p className="text-2xl md:text-5xl font-heading text-smoke-white leading-tight uppercase tracking-tight mb-16 max-w-4xl">
              {t.others.community.subtitle}
            </p>

            <div className="w-24 h-px bg-mafia-gold/40 mb-32"></div>

            {/* Main Action Hubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-48">
               {communitySections.map((section, i) => (
                 <Link href={section.link} key={section.id}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="group relative p-12 h-full border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-mafia-gold/40 transition-all duration-700 overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div 
                           className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                           style={{ background: `radial-gradient(circle at center, ${section.color}, transparent 70%)` }}
                        ></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700">
                                {section.icon}
                            </div>
                            <h3 className="text-sm font-mono text-mafia-gold/60 uppercase tracking-[0.5em] mb-4">{section.subtitle}</h3>
                            <h2 className="text-4xl font-heading font-black text-white uppercase mb-8 tracking-tighter italic group-hover:text-mafia-gold transition-colors">{section.title}</h2>
                            <p className="text-smoke-white/40 text-sm leading-relaxed uppercase font-mono tracking-wider max-w-xs">{section.desc}</p>
                            
                            <div className="mt-12 w-12 h-[2px] bg-white/10 group-hover:w-full group-hover:bg-mafia-gold transition-all duration-700"></div>
                        </div>
                    </motion.div>
                 </Link>
               ))}
            </div>

          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
