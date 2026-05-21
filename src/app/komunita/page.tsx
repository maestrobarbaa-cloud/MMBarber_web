"use client";

import React from "react";
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
  Bell
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";

export default function CommunityPage() {
  const { t, lang } = useTranslation();
  const [isChatEnabled, setIsChatEnabled] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/settings?key=chat_enabled')
      .then(res => res.json())
      .then(data => setIsChatEnabled(data.value === null || data.value === 'true'))
      .catch(console.error);
  }, []);

  let communitySections = [
    {
      id: 'projekty',
      title: t.others.community.projekty.title,
      subtitle: t.others.community.projekty.subtitle,
      desc: t.others.community.projekty.desc,
      icon: <Zap className="text-mafia-gold" size={48} />,
      link: '/komunita/projekty',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.1)'
    },
    {
      id: 'chat',
      title: t.others.community.chat.title,
      subtitle: t.others.community.chat.subtitle,
      desc: t.others.community.chat.desc,
      icon: <Users className="text-mafia-gold" size={48} />,
      link: '/komunita/chat',
      color: 'rgba(139, 0, 0, 0.1)'
    },
    {
      id: 'historky',
      title: t.others.community.historky.title,
      subtitle: t.others.community.historky.subtitle,
      desc: t.others.community.historky.desc,
      icon: <BookOpen className="text-mafia-gold" size={48} />,
      link: '/komunita/historky',
      color: 'rgba(255, 255, 255, 0.05)'
    },
    {
      id: 'sin-slavy',
      title: lang === 'cs' ? 'SÍŇ SLÁVY' : 'HALL OF FAME',
      subtitle: 'SUPPORTERS_LIST',
      desc: lang === 'cs' ? 'Zapiš se do historie MMBarber rodiny. Seznam všech, kteří s nadmi tvoří tuhle komunitu.' : 'Write yourself into MMBarber history. A list of everyone building this community with us.',
      icon: <Trophy className="text-mafia-gold" size={48} />,
      link: '/komunita/sin-slavy',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.2)'
    },
    {
      id: 'zlepseni',
      title: lang === 'cs' ? 'VIZE & ZLEPŠENÍ' : 'VISIONS & UPGRADES',
      subtitle: 'FUTURE_PROTOCOL',
      desc: lang === 'cs' ? 'Máš nápad jak posunout MMBarber dál? Navrhni zlepšení, prioritizuj a sleduj realizaci.' : 'Have an idea to push MMBarber further? Suggest improvements, prioritize and track implementation.',
      icon: <Zap className="text-mafia-gold" size={48} />,
      link: '/komunita/zlepseni',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.3)'
    },
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
      id: 'novinky',
      title: lang === 'cs' ? 'INFORMUJ BARBERA' : 'INFORM BARBER',
      subtitle: 'DIRECT_CHANNEL',
      desc: lang === 'cs' ? 'Máš tip, novinku nebo pochvalu? Pošli zprávu přímo do inboxu svého barbera.' : 'Have a tip, news or praise? Send a message directly to your barber.',
      icon: <Bell className="text-mafia-gold" size={48} />,
      link: '/komunita/novinky',
      color: 'rgba(197, 160, 89, 0.15)'
    }
  ];

  if (!isChatEnabled) {
    communitySections = communitySections.filter(s => s.id !== 'chat');
  }

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
          {t.sidliste.return}
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
