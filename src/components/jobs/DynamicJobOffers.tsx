"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import type { PersonalityType } from './PersonalityTest';

interface DynamicJobOffersProps {
  personality: PersonalityType;
  onReset: () => void;
}

export function DynamicJobOffers({ personality, onReset }: DynamicJobOffersProps) {
  const [showContact, setShowContact] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizError, setQuizError] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const content = {
    humorous: {
      headline: 'Hledáme borce, borkyče a ty co poznají krávu!',
      body: 'Hele, zrodilo se mi v hlavě něco velkýho a na tohle už moje dvě ruce prostě nestačí. Na Slovácku lidi občas koukají s otevřenou pusou na to, co děláme (a hlavně když kráva dělá buuu), ale my chceme jít ještě dál. Nabízím IČO nebo vedlejší živnost. Žádná nuda, spousta srandy, ale hlavně chuť něco pořádně rozjet a pomoct víc lidem. Jdeš do toho s úsměvem?',
      callToAction: 'Jdu makat (a bučet)'
    },
    serious: {
      headline: 'Hledáme muže a ženy cti',
      body: 'Respekt. Loajalita. Oddanost řemeslu. Nejsme jen holičství, jsme rodina. Hledáme parťáky na IČO (vedlejší činnost), kteří chápou, že slovo platí a břitva se drží s naprostou precizností. Slovácko má své tradice, ale my zde budujeme odkaz, který přetrvá. Vyžadujeme chirurgickou přesnost, diskrétnost a stoprocentní výkon. Tohle není práce pro každého. Je to poslání.',
      callToAction: 'Složit přísahu'
    },
    corporate: {
      headline: 'Hledáme Chief Synergy Visionary Rockstara',
      body: 'Optimalizujeme náš mindset a raketově škálujeme byznys model s dopadem až do stratosféry! Nůžky tu nelétají jen po vlasech, létají rovnou do vesmíru! Nabízíme super agilní prostředí zalité duhou a sluncem, úžasný, fantastický kolektiv a benefitní balíček plný synergií. Hledáme B2B partnery na IČO (tzv. freelance), kteří chtějí deliverovat 110% results, maximalizovat náš funnel a "helpnout" nám disruptovat lokální komunitu.',
      callToAction: 'Onboardovat se'
    },
    realistic: {
      headline: 'Práce pro ty, co nemelou pantem',
      body: 'Nebudeme si tu nic nalhávat, korporátní kecy i klauniády jdou mimo mě. Potřebuju prostě někoho na IČO nebo vedlejšák, kdo umí vzít za práci a odvede dobré řemeslo. Mám hromadu plánů a málo času. Žádné teambuildingy s objímáním stromů nečekejte. Odvedete solidní výkon, vyděláte si a jdeme domů s čistou hlavou. Stojíte nohama pevně na zemi? Pak si plácneme.',
      callToAction: 'Podat si ruku'
    },
    creative: {
      headline: 'Pro ty, jejichž plátnem je hlava',
      body: 'Konvence jsou vězením pro naši mysl! Hledáme svobodné duše a vizionáře na IČO, kteří nevidí jen vlasy a vousy, ale sochařskou hmotu. Běžné Slovácko je pro nás pouhou šedou kulisou, my chceme explozi tvarů a neotřelých vizí. Jestli při stříhání slyšíš symfonii a tvá mysl létá v jiných dimenzích, jsi náš člověk. Pojďme společně vytvořit něco, co lidem vyrazí dech.',
      callToAction: 'Následovat múzu'
    },
    hustler: {
      headline: 'Grindset 24/7. Žádné výmluvy.',
      body: 'Spíš jen když opravdu musíš, protože makáš na svém impériu? Výborně. Vymyslel jsem projekt s obřím potenciálem a potřebuju ostré vlky, co do toho šlápnou naplno. IČO nebo vedlejšák, to je fuk – hlavně když to sype a rosteme. Kašleme na místní pomalou mentalitu, tady se jede na brutální výkon a reálný dopad. Čas jsou peníze. Jestli máš drive, naskoč k nám do vlaku.',
      callToAction: 'Jdu do grindu'
    }
  };

  const selectedContent = content[personality];

  const handleActionClick = () => {
    if (personality === 'humorous') {
      setQuizActive(true);
    } else {
      setShowContact(true);
    }
  };

  const handleQuizAnswer = (isCow: boolean) => {
    if (isCow) {
      setQuizSuccess(true);
      setQuizError(false);
    } else {
      setQuizError(true);
      setTimeout(() => setQuizError(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto py-12 px-4">
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onReset}
        className="self-start flex items-center gap-2 text-white/50 hover:text-mafia-gold font-mono text-xs uppercase tracking-widest mb-12 transition-colors"
      >
        <ArrowLeft size={16} />
        Zpět na test
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/60 border border-mafia-gold/20 p-8 md:p-12 rounded-2xl relative overflow-hidden w-full shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.1)] min-h-[400px] flex flex-col justify-center"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mafia-gold to-transparent" />
        
        <AnimatePresence mode="wait">
          {!quizActive && !quizSuccess && !showContact ? (
            <motion.div
              key="offer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-mafia-gold/10 border border-mafia-gold/30 mb-8 mx-auto">
                <Briefcase className="text-mafia-gold w-8 h-8" />
              </div>

              <h2 className="text-2xl md:text-4xl font-heading font-black text-white text-center uppercase tracking-widest mb-6">
                {selectedContent.headline}
              </h2>
              
              <p className="text-white/80 font-mono text-sm md:text-base leading-relaxed text-center mb-10 max-w-2xl mx-auto">
                {selectedContent.body}
              </p>

              <div className="flex justify-center flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleActionClick}
                  className="px-8 py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 group"
                >
                  {selectedContent.callToAction}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : quizActive && !quizSuccess ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center text-center"
            >
              <h2 className="text-3xl font-heading font-black text-white uppercase tracking-widest mb-4">
                Vstupní test
              </h2>
              <p className="text-white/70 font-mono mb-8 uppercase tracking-widest">
                Dokaž, že jsi ten pravý. Klikni na obrázek kravičky!
              </p>

              <div className="flex justify-center gap-6 mb-8 text-6xl cursor-pointer">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleQuizAnswer(false)}>🐶</motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleQuizAnswer(false)}>🐱</motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleQuizAnswer(true)}>🐮</motion.div>
              </div>

              {quizError && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-mafia-red font-mono font-bold flex items-center gap-2"
                >
                  <XCircle size={18} />
                  Kdepak, tohle dělá haf nebo mňau! Zkus to znovu.
                </motion.p>
              )}
            </motion.div>
          ) : (quizSuccess || showContact) ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-8 mx-auto">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>

              <h2 className="text-3xl font-heading font-black text-white uppercase tracking-widest mb-6">
                {quizSuccess ? 'Výborně! Poznáš krávu!' : 'Jsme rádi, že se chceš přidat'}
              </h2>
              
              <p className="text-white/80 font-mono text-sm md:text-base leading-relaxed text-center mb-6 max-w-xl mx-auto">
                {quizSuccess 
                  ? 'Zjevně máš všechny potřebné kvalifikace pro práci u nás. Bučíme na stejné vlně.'
                  : 'Vypadá to, že by nám to mohlo klapat.'}
                <br /><br />
                Osobní setkání je ale víc než tisíc slov. Dostav se za námi přímo na pobočku:
              </p>

              <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
                <p className="font-heading font-black text-mafia-gold text-xl uppercase tracking-widest mb-2">MMBARBER</p>
                <p className="font-mono text-white/70">Sadová 1383<br/>Uherské Hradiště</p>
              </div>

              <p className="text-white/50 font-mono text-xs uppercase tracking-widest">
                Těšíme se na tebe!
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
