import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { Target, Heart, Search, Share2, Sparkles, X, Users, Compass, ChevronRight, MapPin, Globe } from 'lucide-react';

interface OnboardingGuideProps {
  onClose: () => void;
}

export function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const { lang } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Target className="w-16 h-16 text-mafia-gold mx-auto" />,
      title: lang === 'cs' ? 'MM Barber Protokol' : 'MM Barber Protocol',
      desc: lang === 'cs' 
        ? 'Zapomeň na běžné seznamky plné botů, fake profilů a ztráty času. Naše Síť vznikla kolem salonu, ale je otevřená všem – pro lidi z blízkého okolí i z velkých dálek. Hrajeme na upřímnost, slušnost a bezpečí. Toxické chování se trestá.'
        : 'Forget ordinary dating apps. Our Network started around the salon, but is open to everyone – from the local area to far away. We value honesty, respect, and safety. Toxic behavior is punished.'
    },
    {
      icon: <Search className="w-16 h-16 text-indigo-400 mx-auto" />,
      title: lang === 'cs' ? 'Konec Ghostingu' : 'End of Ghosting',
      desc: lang === 'cs'
        ? 'Štvou tě lidi, co jen sbírají matche pro zvednutí ega a nikdy neodepíšou? Náš algoritmus nemilosrdně měří "Reply Rate". Kdo sbírá kontakty a nekomunikuje, propadá se na dno Sítě a ztratí dosah.'
        : 'Tired of people collecting matches just for ego boosts without replying? Our algorithm tracks "Reply Rate". Those who collect matches but don\'t communicate sink to the bottom of the Network.'
    },
    {
      icon: <Compass className="w-16 h-16 text-orange-400 mx-auto" />,
      title: lang === 'cs' ? 'Hluboká Kompatibilita' : 'Deep Compatibility',
      desc: lang === 'cs'
        ? 'Nekloužeme po povrchu. Náš algoritmus "Vibe Match" vyhodnocuje životní styl, finanční zvyky, osobnostní dynamiku i to, jestli se shodnete na společném večeru. Propojíme tě jen s lidmi na stejné vlně.'
        : 'We don\'t do superficial. Our "Vibe Match" algorithm evaluates lifestyle, financial habits, personality dynamics, and shared values. We connect you only with people on the same wavelength.'
    },
    {
      icon: <Users className="w-16 h-16 text-green-400 mx-auto" />,
      title: lang === 'cs' ? 'Double Date & Skupiny' : 'Double Dates & Groups',
      desc: lang === 'cs'
        ? 'Nemusíš do toho jít sám! Vytvoř profil pro sebe a kámoše (Double Date) nebo partu. Systém inteligentně spáruje stejně velké skupiny. Hledáš parťáka na gym nebo byznys? I to tu najdeš.'
        : 'You don\'t have to go alone! Create a profile with a friend (Double Date) or a group. The system pairs equal-sized groups. Looking for a gym buddy or business partner? You\'ll find that too.'
    },
    {
      icon: <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />,
      title: lang === 'cs' ? 'Hlas a Icebreakery' : 'Voice & Icebreakers',
      desc: lang === 'cs'
        ? 'Ukaž svou osobnost dřív, než vůbec začnete psát. Nahraj "Voice Prompt" a nech lidi slyšet tvou intonaci a humor. Pomocí Icebreakerů navíc ulehčíš první krok – konec trapného ticha.'
        : 'Show your personality before the chat even starts. Record a "Voice Prompt" and let people hear your humor. Icebreakers make the first step easy – no more awkward silence.'
    },
    {
      icon: <Heart className="w-16 h-16 text-red-500 mx-auto" />,
      title: lang === 'cs' ? 'Trust Score & Naprosté Bezpečí' : 'Trust Score & Ultimate Safety',
      desc: lang === 'cs'
        ? 'Tvoje bezpečí je absolutní priorita. Chat automaticky rozmazává nevyžádané fotky (NSFW). Profily navíc získávají "Trust Score" (Důvěru) od ostatních uživatelů. Hned poznáš, kdo je ověřený a seriózní.'
        : 'Your safety is our absolute priority. Chats automatically blur unsolicited NSFW photos. Profiles also earn a "Trust Score" from other users. You\'ll instantly know who is verified and serious.'
    },
    {
      icon: <MapPin className="w-16 h-16 text-slate-300 mx-auto" />,
      title: lang === 'cs' ? 'Safe Spots & Fyzické Ověření' : 'Safe Spots & Physical Verification',
      desc: lang === 'cs'
        ? 'Bojíš se, s kým se vlastně sejdeš? Domluv si rande přímo ve zprávách v jednom z našich partnerských podniků (Safe Spots). Pokud tam dorazíte a uděláte Check-in, získáte Platinový štít. 100% jistota reálného profilu.'
        : 'Afraid of who you might meet? Schedule a date directly in chat at one of our partner locations (Safe Spots). If you show up and Check-in, you get a Platinum Shield. 100% guarantee of a real profile.'
    },
    {
      icon: <Globe className="w-16 h-16 text-emerald-400 mx-auto" />,
      title: lang === 'cs' ? 'Otevřený Ekosystém' : 'Open Ecosystem',
      desc: lang === 'cs'
        ? 'Síť nepatří jen nám. Máš oblíbenou kavárnu nebo salon? Mohou si tuto seznamku jednoduše vložit na své vlastní stránky. Lidé pak sbírají důvěru pod jejich hlavičkou, ale všichni se potkávají v jednom velkém rybníku!'
        : 'The Network isn\'t just ours. Have a favorite cafe or salon? They can easily embed this dating app on their own website. People build trust under their brand, but everyone meets in one big pond!'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-black border border-mafia-gold/30 shadow-[0_0_50px_rgba(197,160,89,0.15)] rounded-2xl overflow-hidden z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/10 rounded-full text-white/50 hover:text-white hover:border-mafia-gold hover:bg-mafia-gold/10 transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-sm font-mono text-mafia-gold uppercase tracking-[0.3em] mb-2">
              {lang === 'cs' ? 'Průvodce Sítí' : 'Network Guide'}
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-mafia-gold to-transparent mx-auto" />
          </div>

          <div className="min-h-[250px] flex flex-col justify-center items-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  {steps[step].icon}
                </div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider mb-4">
                  {steps[step].title}
                </h3>
                <p className="text-white/70 font-sans leading-relaxed max-w-lg mx-auto text-sm md:text-base">
                  {steps[step].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-mafia-gold' : 'bg-white/20'}`} 
                />
              ))}
            </div>

            <div className="flex gap-4 w-full justify-center">
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-8 py-3 bg-white/5 border border-mafia-gold/50 text-mafia-gold hover:bg-mafia-gold hover:text-black font-heading font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2"
                >
                  {lang === 'cs' ? 'Další' : 'Next'} <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-10 py-4 bg-mafia-gold text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] font-heading font-black uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  {lang === 'cs' ? 'Jdu do toho!' : 'Let\'s Go!'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
