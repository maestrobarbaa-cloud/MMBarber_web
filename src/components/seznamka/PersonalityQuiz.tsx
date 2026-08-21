import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Brain } from 'lucide-react';

interface PersonalityQuizProps {
  onClose: () => void;
  onComplete: (results: {
    mbti?: string;
    temperament?: string;
    mindset?: string;
    intelligence?: string;
    socialBattery?: string;
  }) => void;
  lang: string;
}

const QUESTIONS = [
  {
    id: 1,
    question: "Když tě někdo pozve na obří párty plnou cizích lidí, ty:",
    options: [
      { text: "Hned běžím! Miluju poznávání nových lidí.", traits: { socialBattery: "Extrovert", temperament: "Sangvinik" } },
      { text: "Jdu, ale držím se spíš u svých přátel.", traits: { socialBattery: "Ambivert", temperament: "Flegmatik" } },
      { text: "Zůstanu doma s knihou nebo seriálem.", traits: { socialBattery: "Introvert", temperament: "Melancholik" } },
    ]
  },
  {
    id: 2,
    question: "Sklenice je podle tebe...",
    options: [
      { text: "Poloplná! Všechno dobře dopadne.", traits: { mindset: "Optimista" } },
      { text: "Poloprázdná. Raději se připravím na nejhorší.", traits: { mindset: "Pesimista" } },
      { text: "Prostě obsahuje přesně 50% kapacity.", traits: { mindset: "Realista", mbti: "INTJ" } },
    ]
  },
  {
    id: 3,
    question: "V čem vynikáš ze všeho nejvíc? (Vyber to nejbližší)",
    options: [
      { text: "Slova. Umím se skvěle vyjadřovat a psát.", traits: { intelligence: "Jazyková", mbti: "ENFJ" } },
      { text: "Čísla a logika. Rád řeším hádanky a systémy.", traits: { intelligence: "Logicko-matematická", mbti: "INTP" } },
      { text: "Oko pro detail. Všude vidím umění, barvy a tvary.", traits: { intelligence: "Prostorová", mbti: "ISFP" } },
      { text: "Sport a pohyb. Nedokážu dlouho sedět na místě.", traits: { intelligence: "Tělesně-kinestetická", mbti: "ESTP" } },
    ]
  },
  {
    id: 4,
    question: "Nebo možná vynikáš spíše v...",
    options: [
      { text: "Rytmu. V hlavě mi neustále hraje hudba.", traits: { intelligence: "Hudební" } },
      { text: "Porozumění lidem. Hned poznám, co cítí ostatní.", traits: { intelligence: "Interpersonální", mbti: "ENFP", temperament: "Sangvinik" } },
      { text: "Sebepoznání. Vím přesně, kdo jsem a co chci.", traits: { intelligence: "Intrapersonální", mbti: "INFJ", temperament: "Cholerik" } },
      { text: "Hlubokých úvahách o smyslu života a vesmíru.", traits: { intelligence: "Existenciální", mbti: "INFP" } },
      { text: "Spojení s přírodou, zvířaty a rostlinami.", traits: { intelligence: "Přírodovědná", mbti: "ISFJ" } }
    ]
  }
];

export function PersonalityQuiz({ onClose, onComplete, lang }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState<any>({});

  const handleAnswer = (traits: any) => {
    setResults({ ...results, ...traits });
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete
      onComplete({ ...results, ...traits });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <div className="bg-mafia-dark border border-mafia-gold/30 w-full max-w-lg overflow-hidden flex flex-col shadow-[0_0_40px_rgba(197,160,89,0.15)] relative rounded-xl">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
          <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <Brain size={16} />
            {lang === 'cs' ? 'Test Osobnosti' : 'Personality Quiz'}
          </h4>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-heading font-bold text-white text-center">
                {QUESTIONS[currentQuestion].question}
              </h3>
              
              <div className="space-y-3 mt-8">
                {QUESTIONS[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.traits)}
                    className="w-full p-4 bg-black/50 border border-white/10 hover:border-mafia-gold hover:bg-mafia-gold/10 transition-all text-left text-sm font-sans rounded-md group flex items-center justify-between"
                  >
                    <span className="text-white/90">{option.text}</span>
                    <ArrowRight size={16} className="text-mafia-gold opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-8">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === currentQuestion ? 'bg-mafia-gold' : i < currentQuestion ? 'bg-mafia-gold/40' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
