"use client";

import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Zap, 
  Phone, 
  ShieldCheck, 
  Home, 
  Building2, 
  School, 
  Factory,
  CheckCircle2,
  HardHat,
  Construction,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Footer } from "@/components/Footer";

export default function RomanJakubcakPage() {
  const { lang } = useTranslation();

  const services = [
    { title: lang === 'cs' ? "Bytová elektroinstalace" : "Residential Electrical", icon: <Home className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Rodinné domy (Novostavby / Rekonstrukce)" : "Houses (New Build / Renovations)", icon: <Construction className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Veřejné budovy (Školy / Školky)" : "Public Buildings (Schools)", icon: <School className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Komerční prostory (Kanceláře)" : "Commercial (Offices)", icon: <Building2 className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Průmyslová elektroinstalace (Haly)" : "Industrial Electrical (Halls)", icon: <Factory className="w-6 h-6" /> },
    { title: lang === 'cs' ? "Revize & Hledání závad" : "Revisions & Troubleshooting", icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  const techDetails = [
    lang === 'cs' ? "Kompletní elektro práce od A do Z" : "Complete electrical work from A to Z",
    lang === 'cs' ? "Vrtání krabiček & frézování drážek" : "Box drilling & groove milling",
    lang === 'cs' ? "Sádrování & pokládka kabeláže" : "Plastering & wiring layout",
    lang === 'cs' ? "Datové rozvody & hlavní přívody" : "Data networks & main supplies",
    lang === 'cs' ? "Senzory, relátka, trafa & vrátníky" : "Sensors, relays, transformers & intercoms",
    lang === 'cs' ? "Kompletace rozvaděčů (Silnoproud i Data)" : "Switchboard assembly (Power & Data)",
    lang === 'cs' ? "Diagnostika a hledání poruch" : "Electronics diagnostics & fault finding",
  ];

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white overflow-hidden selection:bg-mafia-gold selection:text-mafia-black">
      {/* Background Grid Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.1)_0%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        
        {/* Animated 'Wires' */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-mafia-gold/20 via-mafia-gold/5 to-transparent opacity-20" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-mafia-gold/10 via-mafia-gold/5 to-transparent opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/rodina" 
            className="group inline-flex items-center gap-3 text-mafia-gold/60 hover:text-mafia-gold transition-colors font-mono text-[10px] uppercase tracking-[0.4em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {lang === 'cs' ? "Zpět k rodině" : "Back to family"}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column - Profile & Story */}
          <div className="flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-mafia-gold/30 bg-mafia-gold/5 rounded-full mb-6">
                <Zap size={14} className="text-mafia-gold animate-pulse" />
                <span className="text-mafia-gold text-[10px] font-mono tracking-[0.3em] uppercase">
                  {lang === 'cs' ? "Prověřený Partner" : "Authorized Partner"}
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-heading font-black text-smoke-white uppercase tracking-tighter mb-4 leading-none">
                Roman <br/><span className="text-mafia-gold">Jakubčák</span>
              </h1>
              
              <p className="text-mafia-gold font-mono text-xs uppercase tracking-[0.5em] mb-8">
                {lang === 'cs' ? "Paragraf 7" : "Master Electrician // Paragraf 7"}
              </p>

              <div className="w-24 h-1 bg-mafia-gold mb-12 shadow-[0_0_20px_rgba(197,160,89,0.5)]" />
              
              <div className="space-y-6 text-smoke-white/70 font-sans text-lg md:text-xl leading-relaxed italic border-l-2 border-mafia-gold/20 pl-8">
                <p>
                  {lang === 'cs' 
                    ? "Dělám to od 19 let. Pro mě elektřina není jen o drátech, je to o tlukotu srdce každé stavby. Když nastupuju, vím přesně kam co patří, aby vše fungovalo na první dobrou." 
                    : "I've been doing this since I was 19. For me, electricity isn't just about wires, it's the heartbeat of every building. When I step in, I know exactly where everything belongs."}
                </p>
                <p>
                  {lang === 'cs'
                    ? "Mám Paragraf 7 podle nejnovější vyhlášky. To znamená, že bezpečnost a profesionalita jsou u mě na prvním místě. Žádné improvizace, jen čistá práce."
                    : "I hold Paragraph 7 according to the latest regulations. This means safety and professionalism are my top priority. No improvising, just clean execution."}
                </p>
              </div>
            </motion.div>

            {/* CTA Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 relative"
            >
              {/* Dynamic Glow Aura */}
              <div className="absolute -inset-4 bg-mafia-gold/5 blur-3xl rounded-full animate-pulse pointer-events-none" />
              
              <a 
                href="tel:+420732169799"
                className="group relative flex flex-col items-center justify-center border-2 border-mafia-gold bg-mafia-gold/10 p-8 md:p-12 w-full overflow-hidden transition-all hover:bg-mafia-gold"
              >
                {/* Visual Signal Lines */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity">
                   <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-scan" />
                   <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent animate-scan-reverse" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mafia-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-mafia-gold"></span>
                    </span>
                    <span className="text-mafia-gold group-hover:text-mafia-black font-mono text-[10px] uppercase tracking-[0.4em] font-black transition-colors">
                      {lang === 'cs' ? "PŘÍMÁ LINKA AKTIVNÍ" : "DIRECT LINE ACTIVE"}
                    </span>
                  </div>

                  <span className="text-smoke-white/60 group-hover:text-mafia-black/70 font-heading text-lg uppercase tracking-[0.2em] font-black transition-colors">
                    {lang === 'cs' ? "NENECH TO ZKRATOVAT. VYŘEŠÍME TO HNED." : "DON'T LET IT SHORT OUT. SOLVED NOW."}
                  </span>

                  <div className="flex items-center gap-6 mt-4">
                     <div className="p-4 rounded-full border border-mafia-gold group-hover:bg-mafia-black group-hover:border-mafia-black transition-all duration-500">
                        <Phone size={32} className="text-mafia-gold group-hover:text-white group-hover:rotate-12 transition-all" />
                     </div>
                     <span className="text-4xl md:text-6xl font-heading font-black text-mafia-gold group-hover:text-mafia-black whitespace-nowrap tracking-tighter transition-colors">
                        732 169 799
                     </span>
                  </div>

                  <p className="mt-6 text-[9px] font-mono uppercase tracking-[0.5em] text-mafia-gold/40 group-hover:text-mafia-black/40 font-bold transition-colors">
                    {lang === 'cs' ? "KLIKNI A ZAVOLEJ RODINĚ" : "CLICK TO CALL THE FAMILY"}
                  </p>
                </div>
              </a>

              <style jsx>{`
                @keyframes scan {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes scan-reverse {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-scan {
                  animation: scan 3s linear infinite;
                }
                .animate-scan-reverse {
                  animation: scan-reverse 3s linear infinite;
                }
              `}</style>
            </motion.div>
          </div>

          {/* Right Column - Skills & Services */}
          <div className="flex flex-col gap-12">
            {/* Expertise Grid */}
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {services.map((s, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-white/[0.02] border border-white/5 p-6 hover:border-mafia-gold/40 transition-all group"
                >
                   <div className="text-mafia-gold mb-4 group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
                   <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-smoke-white/80 group-hover:text-mafia-gold transition-colors">{s.title}</h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Technical Dossier (Bullet points) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-mafia-gold/5 border border-mafia-gold/20 p-8 md:p-10 relative"
            >
              <div className="absolute -top-4 -right-4 bg-mafia-gold text-mafia-black px-4 py-1 text-[10px] font-black uppercase tracking-widest skew-x-[-12deg]">
                 {lang === 'cs' ? "Rozsah prací" : "Technical Dossier"}
              </div>
              
              <h4 className="text-2xl font-heading font-black text-mafia-gold uppercase mb-8 tracking-widest">
                {lang === 'cs' ? "Specifikace" : "Operation Scope"}
              </h4>

              <ul className="space-y-4">
                {techDetails.map((detail, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <CheckCircle2 size={18} className="text-mafia-gold shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="text-smoke-white/80 font-sans text-base md:text-lg leading-tight uppercase tracking-wide">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-mafia-gold/10">
                 <div className="flex items-center gap-4">
                    <HardHat size={20} className="text-mafia-gold/40" />
                    <p className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.2em] italic">
                      {lang === 'cs' ? "Pracuji s profesionálním nářadím a certifikovaným materiálem." : "I work with professional tools and certified materials."}
                    </p>
                 </div>
              </div>
            </motion.div>

            {/* Badge / Verification */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="flex items-center justify-center p-8 border border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair"
            >
               <div className="relative">
                 <div className="absolute inset-0 border border-mafia-gold animate-ping opacity-20 rounded-full" />
                 <ShieldCheck size={48} className="text-mafia-gold" />
               </div>
               <div className="ml-6 flex flex-col">
                 <span className="text-mafia-gold font-mono text-[9px] uppercase tracking-[0.4em]">
                   {lang === 'cs' ? "Prověřeno MMBarberem" : "Verified by MMBarber"}
                 </span>
                 <span className="text-lg font-heading font-black text-white leading-none">
                   {lang === 'cs' ? "CERTIFIKOVANÝ SPECIALISTA" : "EL-CERTIFIED PRO"}
                 </span>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
