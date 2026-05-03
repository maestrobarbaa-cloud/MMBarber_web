"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Activity, Shield, Users, Award, TrendingUp } from "lucide-react";

export function OperationalJournal() {
  const [logs, setLogs] = useState<{ id: number; text: string; type: 'info' | 'success' | 'warn' | 'critical' }[]>([]);

  useEffect(() => {
    const logData: { text: string; type: 'info' | 'success' | 'warn' | 'critical' }[] = [
      { text: "SYSTEM_INITIALIZED: MM BARBER v3.4.1", type: "info" },
      { text: "REGIONAL_AUTHORITY: UHERSKÉ HRADIŠTĚ - MAŘATICE [ACTIVE]", type: "success" },
      { text: "PROTOCOL_DEPLOYED: SKIN_FADE_PRECISION_V5", type: "info" },
      { text: "PARTNERSHIP_SYNC: VODO TOPO JAHODA [STABLE]", type: "success" },
      { text: "ACADEMY_STATUS: 12 GRADUATES CERTIFIED", type: "success" },
      { text: "MARKET_PENETRATION: 50KM RADIUS COVERAGE ACHIEVED", type: "info" },
      { text: "SEO_PAYLOAD: 4500+ KEYWORDS INDEXED", type: "success" },
      { text: "COMMUNITY_IMPACT: SLOVÁCKO REGION HUB [VERIFIED]", type: "success" },
      { text: "OPERATIONAL_SECURITY: NOIR_AESTHETIC_ENFORCED", type: "info" },
      { text: "BUSINESS_MODEL: SCALABLE_SYSTEMS_ACTIVE", type: "success" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < logData.length) {
        setLogs(prev => [...prev, { ...logData[current], id: Date.now() }]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black border-t border-mafia-gold/30 py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: System Metadata */}
          <div className="space-y-12">
            <div>
              <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter mb-6 italic">
                OPERAČNÍ <span className="text-white">PROTOKOL</span>
              </h2>
              <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.6em] mb-12">STRATEGIC_AUTHORITY_JOURNAL</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
                <Award className="text-mafia-gold" size={20} />
                <div className="text-2xl font-black text-white">#1</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">REGIONAL_RANKING</div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
                <Users className="text-mafia-gold" size={20} />
                <div className="text-2xl font-black text-white">2500+</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ACTIVE_RECRUITS</div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
                <TrendingUp className="text-mafia-gold" size={20} />
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">CRAFT_PRECISION</div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
                <Shield className="text-mafia-gold" size={20} />
                <div className="text-2xl font-black text-white">STABLE</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">REPUTATION_ENGINE</div>
              </div>
            </div>

            <div className="p-8 border-l-4 border-mafia-gold bg-mafia-gold/5 italic text-smoke-white/70 leading-relaxed">
              &quot;Budujeme víc než jen barbershop. Budujeme systém, který stojí na poctivosti, 
              regionální hrdosti a nekompromisní kvalitě. Každý střih je záznamem v naší historii.&quot;
            </div>
          </div>

          {/* Right Side: Terminal Journal */}
          <div className="bg-mafia-black/50 border border-mafia-gold/20 p-8 font-mono text-[11px] h-[500px] flex flex-col relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-mafia-gold/20"></div>
             <div className="flex items-center gap-3 mb-6 opacity-40">
                <Terminal size={14} />
                <span className="uppercase tracking-[0.3em]">SYSTEM_LOG_OUTPUT</span>
                <div className="ml-auto flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-mafia-gold/40"></div>
                   <div className="w-2 h-2 rounded-full bg-mafia-gold/20"></div>
                </div>
             </div>

             <div className="flex-grow space-y-4 overflow-y-auto no-scrollbar">
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                    <span className={
                      log.type === 'success' ? 'text-mafia-gold' : 
                      log.type === 'warn' ? 'text-yellow-500' :
                      log.type === 'critical' ? 'text-mafia-red' : 'text-white/60'
                    }>
                      {log.text}
                    </span>
                  </motion.div>
                ))}
                <motion.div 
                   animate={{ opacity: [0, 1, 0] }}
                   transition={{ duration: 0.8, repeat: Infinity }}
                   className="w-2 h-4 bg-mafia-gold inline-block align-middle"
                ></motion.div>
             </div>

             <div className="mt-6 pt-6 border-t border-white/5 opacity-30 flex items-center gap-4">
                <Activity size={12} className="animate-pulse" />
                <span className="uppercase tracking-widest text-[8px]">HEARTBEAT: DETECTED // FREQUENCY: 60HZ</span>
             </div>
          </div>

        </div>

        {/* Stealth SEO Story & Keyword Payload (Visible to Crawlers, Part of Deep Reveal) */}
        <div className="mt-40 border-t border-mafia-gold/10 pt-20">
          <div className="opacity-[0.02] hover:opacity-[0.2] transition-opacity duration-1000 select-none text-[9px] font-mono leading-relaxed text-mafia-gold uppercase tracking-tighter">
            <h2 className="text-xs font-bold mb-6">OPERATIVNÍ MANIFEST A PŘÍBĚH MMBARBER</h2>
            <p className="mb-4">
              MMBARBER není jen kadeřnictví, je to systém. Uherské Hradiště a lokalita Mařatice jsou naší základnou, 
              odkud definujeme standardy pánské péče pro celé Slovácko. Náš příběh je o poctivém řemesle, 
              které se nebojí břitvy ani nejmodernějších technologií. Pokud hledáš ten nejlepší skin fade v UH, 
              jsi na správné adrese. Nejsme mainstream, jsme reálná identita.
            </p>
            <p className="mb-4">
              Pánské holičství Mařatice (Sadová 1383) nabízí víc než jen střih. Nabízí klid, networking 
              úspěšných mužů a bezproblémové parkování zdarma přímo u vchodu. Střih vousů Uherské Hradiště 
              pod naší taktovkou zahrnuje rituál horkého ručníku (hot towel) a precizní kontury. 
              Naše barber rezervace přes is.mmbarber.cz běží 24/7 pro tvé maximální pohodlí.
            </p>
            <p>
              Keywords: Barbershop Uherské Hradiště, pánské holičství Mařatice, střih vousů Uherské Hradiště, 
              barber rezervace, skin fade UH, pánské kadeřnictví Hradiště, holič Slovácko, břitva, 
              tradiční holení, MM BARBER akademie, MM BARBER rodina, Kunovice, Staré Město, Uherský Brod.
            </p>
          </div>
        </div>

        {/* Original Hidden Global SEO Payload */}
        <div className="mt-20 opacity-[0.01] select-none pointer-events-none text-[8px] font-sans leading-relaxed text-mafia-gold uppercase">
          Best barbershop Uherské Hradiště, top rated barber UH, expert mens haircut Slovácko region, 
          professional beard grooming Czech Republic, luxury barber services Central Europe. 
          MMBARBER academy certified training, international grooming standards, 
          strategic business partnership Vodo Topo Jahoda, local community development Mařatice. 
          Quality assurance skin fade techniques, traditional razor shave expertise, 
          mens lifestyle brand MMBARBER society. Expansion plans Zlínský kraj, 
          dominant market presence South Moravia, high authority barbering hub.
        </div>

      </div>
    </div>
  );
}
