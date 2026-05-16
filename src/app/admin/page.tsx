"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock,
  Users,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  LogOut,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const { lang } = useTranslation();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "MAFIA_PROTOCOL_737";

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("mmbarber_admin_auth", "true");
    } else {
      alert("ACCESS DENIED: INVALID CLEARANCE");
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mmbarber_admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_80%)] opacity-30"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md bg-mafia-dark/80 border border-mafia-gold/30 p-12 backdrop-blur-3xl shadow-2xl"
        >
          <div className="flex flex-col items-center mb-12">
            <Lock className="text-mafia-gold mb-6" size={48} />
            <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">ADMIN_ACCESS</h1>
            <p className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.4em] mt-2">RESTRICTED_AREA</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER CLEARANCE CODE..."
              className="w-full bg-black/40 border border-mafia-gold/20 px-6 py-4 text-center text-white font-mono tracking-widest focus:outline-none focus:border-mafia-gold transition-all"
              autoFocus
            />
            <button className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.2)]">
              AUTHORIZE
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const adminModules = [
    {
      id: 'chat',
      title: 'MODERACE CHATU',
      subtitle: 'COMMUNITY_WATCH',
      desc: 'Sledování zpráv, identifikace IP adres a správa přístupů.',
      icon: <Users className="text-mafia-gold" size={40} />,
      link: '/admin/komunita/chat',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.1)'
    },
    {
      id: 'historky',
      title: 'SPRÁVA HISTOREK',
      subtitle: 'CONTENT_MODERATION',
      desc: 'Schvalování a úprava komunitních příspěvků a zážitků.',
      icon: <BookOpen className="text-mafia-gold" size={40} />,
      link: '/admin/komunita/historky',
      color: 'rgba(255, 255, 255, 0.05)'
    },
    {
      id: 'sin-slavy',
      title: 'SÍŇ SLÁVY',
      subtitle: 'RECORDS_MANAGEMENT',
      desc: 'Správa jmen podporovatelů a čištění seznamu legend.',
      icon: <Trophy className="text-mafia-gold" size={40} />,
      link: '/admin/komunita/sin-slavy',
      color: 'rgba(var(--color-mafia-gold-rgb), 0.15)'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-smoke-white p-6 md:p-12 selection:bg-mafia-gold selection:text-mafia-black">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 pb-8 border-b border-white/5">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-mafia-gold" size={24} />
                  <h1 className="text-4xl font-heading font-black uppercase italic tracking-tighter">ADMIN <span className="text-mafia-gold">CENTRÁLA</span></h1>
               </div>
               <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">MMBARBER_MANAGEMENT_TERMINAL_V2.0</p>
            </div>
            
            <div className="flex gap-4">
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-mafia-red hover:text-white transition-all group"
               >
                  <LogOut size={16} className="group-hover:rotate-12 transition-transform" /> ODHLÁSIT SE
               </button>
               <Link href="/komunita" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  <ArrowLeft size={16} /> ODCHOD
               </Link>
            </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {adminModules.map((module) => (
             <Link href={module.link} key={module.id}>
               <motion.div 
                 whileHover={{ scale: 1.02, y: -5 }}
                 className="group relative p-12 h-full border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-mafia-gold/40 transition-all duration-500 overflow-hidden"
               >
                   <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${module.color}, transparent 70%)` }}
                   ></div>
                   
                   <div className="relative z-10">
                       <div className="mb-10 group-hover:scale-110 transition-transform duration-500">
                           {module.icon}
                       </div>
                       <h3 className="text-[10px] font-mono text-mafia-gold/60 uppercase tracking-[0.5em] mb-4">{module.subtitle}</h3>
                       <h2 className="text-3xl font-heading font-black text-white uppercase mb-6 tracking-tighter italic">{module.title}</h2>
                       <p className="text-smoke-white/40 text-sm leading-relaxed uppercase font-mono tracking-wider mb-10">{module.desc}</p>
                       
                       <div className="flex items-center gap-2 text-mafia-gold font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          VSTOUPIT DO SEKCE <ChevronRight size={14} />
                       </div>
                   </div>
               </motion.div>
             </Link>
           ))}
        </main>

        <footer className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
           <div className="flex items-center gap-2">
              <ShieldAlert size={14} />
              <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Veškeré akce jsou logovány pro účely bezpečnosti systému.</span>
           </div>
           <span className="text-[9px] font-mono uppercase">SECURITY_LEVEL: ALPHA_7</span>
        </footer>
      </div>
    </div>
  );
}
