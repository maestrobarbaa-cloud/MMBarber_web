"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PHASE1_QUESTIONS = [
  {
    id: 1,
    type: 'open',
    question: 'Co byla podle vás vaše největší profesní chyba za poslední rok a jak jste ji vyřešil/a?'
  },
  {
    id: 2,
    type: 'open',
    question: 'Zákazník se na konci stříhání podívá do zrcadla, usměje se, zaplatí, ale za dvě hodiny vám na Instagram napíše agresivní zprávu, že je to katastrofa a chce peníze zpět. Jak zareagujete? Napište přesné znění odpovědi.'
  },
  {
    id: 3,
    type: 'choice_with_explanation',
    question: 'Pokud se vám měsíc nedaří a máte málo zákazníků, čí je to podle vás chyba?',
    options: [
      'A) Je špatný měsíc (krize, lidi šetří).',
      'B) Holičství nedělá dobrý marketing.',
      'C) Je to moje chyba a musím přidat.',
      'D) Je to kombinace všeho výše uvedeného.'
    ]
  },
  {
    id: 4,
    type: 'open',
    question: 'Pracujete jako OSVČ a onemocníte na 10 dní. Znamená to nula peněz a spoustu zrušených klientů. Popište krok za krokem, co přesně uděláte hned ten den, kdy zjistíte, že nemůžete do práce.'
  },
  {
    id: 5,
    type: 'scale',
    question: 'Jak moc potřebujete, aby vám šéf přesně říkal, co máte daný den dělat? (1 = vůbec, jsem svůj pán, 10 = potřebuji přesné úkoly a kontrolu)'
  },
  {
    id: 6,
    type: 'open',
    question: 'Přijdete ráno do práce jako první a zjistíte, že kolega večer před vámi zapomněl zapnout pračku a vy nemáte čisté ručníky pro prvního klienta. Co uděláte?'
  },
  {
    id: 7,
    type: 'open',
    question: 'Co na práci holiče upřímně nesnášíte? (Odpověď „nic, všechno miluju“ nebereme).'
  },
  {
    id: 8,
    type: 'choice_with_explanation',
    question: 'Jste spíše týmový hráč (hrajete za značku a kolegy), nebo vlk samotář (zajímá vás jen vaše křeslo a vaši klienti)?',
    options: ['Týmový hráč', 'Vlk samotář']
  },
  {
    id: 9,
    type: 'open',
    question: 'Křeslo si pronajímáte a k tomu si musíte platit sociální a zdravotní pojištění. Máte rezervu na měsíce, kdy přijde slabší sezóna (např. únor)? Jak k penězům přistupujete?'
  },
  {
    id: 10,
    type: 'open',
    question: 'Jste lepší holič než 80 % ostatních lidí v oboru? Podle čeho to soudíte?'
  },
  {
    id: 11,
    type: 'open',
    question: 'Popište situaci, kdy vám někdo z nadřízených nebo kolegů dal tvrdou, možná i nepříjemnou zpětnou vazbu. Jaká byla vaše první reakce a co jste s tím nakonec udělal/a?'
  },
  {
    id: 12,
    type: 'open',
    question: 'Máte 4 hodiny "okno" – zrušili se vám klienti. Sedíte na telefonu a scrolujete TikTok, nebo uděláte něco jiného? Buďte upřímní, co konkrétně byste dělali?'
  },
  {
    id: 13,
    type: 'open',
    question: 'V čem jako holič aktuálně nejvíce zaostáváte? (Technika, komunikace, sociální sítě, organizace...?)'
  },
  {
    id: 14,
    type: 'open',
    question: 'Kolega z vedlejšího křesla si opakovaně půjčuje váš strojek a vrací ho nevyčištěný. Jak přesně to vyřešíte? (Uveďte konkrétní větu, kterou mu řeknete).'
  },
  {
    id: 15,
    type: 'open',
    question: 'Proč jste se vůbec rozhodl/a jít na OSVČ a nebýt zaměstnanec na HPP s jistým platem a dovolenou?'
  }
];

export function RecruitmentPhase1() {
  const [introDone, setIntroDone] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'PENDING'|'PASSED'|'FAILED'>('PENDING');
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  const currentQ = PHASE1_QUESTIONS[step];

  const handleNext = () => {
    if (step < PHASE1_QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      submitPhase1();
    }
  };

  const submitPhase1 = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/recruitment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 1, answers, contact: contactInfo })
      });
      const data = await response.json();
      if (data.status === 'PASSED' || data.status === 'BORDERLINE') {
        setResult('PASSED');
      } else {
        setResult('FAILED');
      }
    } catch (e) {
      console.error(e);
      // Fallback prozatím
      setResult('PASSED');
    }
    setSubmitting(false);
  };

  if (result === 'PASSED') {
    return (
      <div className="w-full flex flex-col items-center text-center p-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-heading font-black text-white uppercase mb-4">Skvělá práce!</h2>
        <p className="text-white/70 mb-8 max-w-lg">Zatím se nám líbí, jak přemýšlíš. Postupuješ do 2. kola, které se zaměřuje už konkrétně na náš podnik.</p>
        <button onClick={() => window.location.href='/kariera/faze2'} className="px-8 py-4 bg-mafia-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
          Pokračovat do Fáze 2
        </button>
      </div>
    );
  }

  if (result === 'FAILED') {
    return (
      <div className="w-full flex flex-col items-center text-center p-4">
        <h2 className="text-3xl font-heading font-black text-white uppercase mb-4">Děkujeme za tvůj čas</h2>
        <p className="text-white/70 mb-8 max-w-lg">Vážíme si tvého zájmu, ale náš systém vyhodnotil, že v tuto chvíli nebudeme ve výběrovém řízení pokračovat. Hledáme trochu jiný profil.</p>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <AnimatePresence mode="wait">
        {!introDone ? (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-black uppercase text-white mb-2 tracking-widest">Vstupní pohovor: Fáze 1</h2>
            <p className="text-white/70 font-mono mb-6 text-sm leading-relaxed">
              Tohle není běžný HR test. Odpovídej upřímně, jak bys to řešil/a v reálu. Není zde správná ani špatná odpověď, jde nám o to, jak přemýšlíš. Nejprve na tebe ale potřebujeme kontakt.
            </p>
            
            <input type="text" placeholder="Jméno a příjmení" className="p-4 bg-black/50 border border-white/20 text-white font-mono focus:border-mafia-gold outline-none w-full transition-colors"
              value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} />
            <input type="email" placeholder="E-mail" className="p-4 bg-black/50 border border-white/20 text-white font-mono focus:border-mafia-gold outline-none w-full transition-colors"
              value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} />
            <input type="tel" placeholder="Telefon (nepovinné)" className="p-4 bg-black/50 border border-white/20 text-white font-mono focus:border-mafia-gold outline-none w-full transition-colors"
              value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} />
            
            <button 
              disabled={!contactInfo.name || !contactInfo.email}
              onClick={() => setIntroDone(true)} 
              className="mt-6 px-8 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              Začít dotazník
            </button>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 max-w-2xl mx-auto">
            <div className="text-mafia-gold font-mono text-xs uppercase tracking-widest">Otázka {step + 1} / {PHASE1_QUESTIONS.length}</div>
            <h3 className="text-xl md:text-2xl text-white font-heading font-black uppercase tracking-wide leading-snug">{currentQ.question}</h3>

            {currentQ.type === 'open' && (
              <textarea 
                rows={5}
                className="w-full bg-black/50 border border-white/20 p-5 text-white font-mono focus:border-mafia-gold outline-none resize-none mt-4 transition-colors"
                placeholder="Tvoje upřímná odpověď..."
                value={answers[currentQ.id]?.text || ''}
                onChange={e => setAnswers({...answers, [currentQ.id]: { text: e.target.value }})}
              />
            )}

            {currentQ.type === 'scale' && (
              <div className="flex justify-between gap-1 md:gap-2 mt-6">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button 
                    key={n}
                    onClick={() => setAnswers({...answers, [currentQ.id]: { value: n }})}
                    className={`flex-1 py-3 md:py-4 border font-mono transition-colors ${answers[currentQ.id]?.value === n ? 'bg-mafia-gold text-black border-mafia-gold font-bold' : 'bg-black/50 border-white/20 text-white/50 hover:border-white/50 hover:text-white'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'choice_with_explanation' && (
              <div className="flex flex-col gap-3 mt-4">
                {currentQ.options?.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setAnswers({...answers, [currentQ.id]: { ...answers[currentQ.id], choice: opt }})}
                    className={`p-4 text-left border font-mono transition-colors ${answers[currentQ.id]?.choice === opt ? 'bg-mafia-gold/20 border-mafia-gold text-mafia-gold' : 'bg-black/50 border-white/20 text-white/70 hover:border-white/50'}`}
                  >
                    {opt}
                  </button>
                ))}
                <AnimatePresence>
                  {answers[currentQ.id]?.choice && (
                    <motion.textarea 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      rows={3}
                      className="w-full mt-4 bg-black/50 border border-mafia-gold/50 p-5 text-white font-mono focus:border-mafia-gold outline-none resize-none transition-colors"
                      placeholder="Proč jsi vybral/a tuto možnost? (Prosím rozveď)"
                      value={answers[currentQ.id]?.explanation || ''}
                      onChange={e => setAnswers({...answers, [currentQ.id]: { ...answers[currentQ.id], explanation: e.target.value }})}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex justify-between items-center mt-10">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="flex items-center gap-2 text-white/30 font-mono uppercase text-xs tracking-widest hover:text-white transition-colors disabled:opacity-0"
              >
                <ArrowLeft size={16} /> Zpět
              </button>

              <button 
                onClick={handleNext}
                disabled={submitting || (currentQ.type === 'open' && !answers[currentQ.id]?.text) || (currentQ.type === 'scale' && !answers[currentQ.id]?.value) || (currentQ.type === 'choice_with_explanation' && (!answers[currentQ.id]?.choice || !answers[currentQ.id]?.explanation))}
                className="flex items-center gap-2 px-8 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                {submitting ? 'Vyhodnocuji...' : (step === PHASE1_QUESTIONS.length - 1 ? 'Dokončit a vyhodnotit' : 'Další otázka')}
                {!submitting && step < PHASE1_QUESTIONS.length - 1 && <ArrowRight size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
