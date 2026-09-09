"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const PHASE3_QUESTIONS = [
  {
    id: 1,
    type: 'open',
    question: 'Proč si myslíte, že se většina nezávislých holičů nikdy nevypracuje na absolutní špičku a zůstane jen průměrná? (Popište 2 hlavní důvody).'
  },
  {
    id: 2,
    type: 'open',
    question: 'Vzpomeňte si na situaci z poslední doby, kdy jste udělali něco pracovně opravdu špatně a někdo na to upozornil. Jak jste se v tu vteřinu cítili a co přesně jste odpověděli?'
  },
  {
    id: 3,
    type: 'choice_with_explanation',
    question: 'Co je pro vás osobně horší?',
    options: [
      'Odvedl jsem skvělou práci, ale zákazník/kolega si toho vůbec nevšiml a nepochválil mě.',
      'Odvedl jsem průměrnou práci a zákazník mi řekl, že to minule bylo lepší.'
    ]
  },
  {
    id: 4,
    type: 'open',
    question: 'Kdybyste měl/a definovat vaši absolutně nejsilnější vlastnost, pro kterou vás lidé obdivují, která by to byla? Má tato vlastnost i nějakou stinnou stránku?'
  },
  {
    id: 5,
    type: 'open',
    question: 'Zákazník na poslední chvíli zruší termín, u kterého už máte právo vyžadovat 100% storno poplatek. Začne se vymlouvat na nemoc a prosit, ať to tentokrát necháte být. Vy ale ty peníze potřebujete. Jak přesně s ním budete komunikovat, abyste dosáhli svého, ale neztratili ho jako klienta? (Napište doslovně).'
  },
  {
    id: 6,
    type: 'choice_with_explanation',
    question: 'Když se v týmu na něčem shodujete (např. úklid) a vy máte názor, o kterém jste 100% přesvědčen/a, že je nejlepší, ale většina týmu s vámi nesouhlasí. Co uděláte?',
    options: [
      'A) Přizpůsobím se většině, abych nenarušil/a vztahy.',
      'B) Budu se snažit ostatní tak dlouho přesvědčovat, dokud nepochopí, že můj návrh je logičtější.',
      'C) Udělám to podle nich, ale když se ukáže, že měli chybu, připomenu jim to.',
      'D) Něco jiného (rozepište)'
    ]
  },
  {
    id: 7,
    type: 'open',
    question: 'Cítili jste někdy v práci, že jste nespravedlivě obětí špatného systému, špatného šéfa nebo intrik kolegů? Jak jste se zachovali?'
  },
  {
    id: 8,
    type: 'open',
    question: 'Je sobota, máte plno. Už druhý zákazník po sobě přišel pozdě, narušil vám časový plán a ještě je nepříjemný. Cítíte, že vám stoupá tlak a začínáte být vzteklý/á. Jak to dáváte najevo? (Křičíte, zmlknete, zrychlíte, jste ironický/á...?)'
  },
  {
    id: 9,
    type: 'open',
    question: 'Děláte složitý střih a v půlce zjistíte, že jste to vzali o centimetr výš, než zákazník chtěl. Není to zkažené, ale není to přesně zadání. Zákazník si ničeho nevšiml. Co uděláte?'
  },
  {
    id: 10,
    type: 'open',
    question: 'Jak reagujete, když zjistíte, že někdo, koho považujete za mnohem méně zkušeného (např. mladý učeň), udělal něco viditelně lépe než vy?'
  },
  {
    id: 11,
    type: 'choice_with_explanation',
    question: 'Kdy se v práci cítíte nejvíce "nabitý/á" energií?',
    options: [
      'A) Když je plno, frmol, hraje hudba a všichni se baví nahlas.',
      'B) Když mám čas soustředit se na detail a nikdo na mě nemluví.',
      'C) Když vidím, že mám nejvyšší tržbu ze všech.',
      'D) Když mi zákazník poděkuje a řekne, že se mi svěřil se svým problémem.'
    ]
  },
  {
    id: 12,
    type: 'choice_with_explanation',
    question: 'I jako OSVČ budete mít "majitele" podniku. Jaký styl by vás donutil odejít?',
    options: [
      'A) Když se do ničeho neplete a nechá nás, ať si vše řešíme sami.',
      'B) Když vyžaduje absolutní pořádek a mikromanaguje detaily.',
      'C) Když nedává zpětnou vazbu a pochvalu za dobrou práci.'
    ]
  },
  {
    id: 13,
    type: 'open',
    question: 'Přijdete do práce a zjistíte, že z technických důvodů nemůžete pracovat na svém křesle, ale musíte vzít provizorní horší místo vzadu. Vaše první myšlenka/slova?'
  }
];

export function RecruitmentPhase3({ email }: { email: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'PENDING'|'DONE'>('PENDING');

  const currentQ = PHASE3_QUESTIONS[step];

  const handleNext = () => {
    if (step < PHASE3_QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      submitPhase3();
    }
  };

  const submitPhase3 = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/recruitment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 3, answers, contact: { email } })
      });
      const data = await response.json();
      setResult('DONE');
    } catch (e) {
      console.error(e);
      setResult('DONE');
    }
    setSubmitting(false);
  };

  if (result === 'DONE') {
    return (
      <div className="w-full flex flex-col items-center text-center p-4">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-heading font-black text-white uppercase mb-4">Profil Dokončen!</h2>
        <p className="text-white/70 mb-8 max-w-lg">
          Děkujeme za tvou upřímnost. Tvůj osobnostní a pracovní profil byl úspěšně zpracován.
          Toto bylo poslední kolo dotazníků. Nyní si výsledky projdeme a brzy se ti ozveme s dalšími kroky!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 max-w-2xl mx-auto">
          <div className="text-mafia-gold font-mono text-xs uppercase tracking-widest">
            Osobnostní profil (Fáze 3) - Otázka {step + 1} / {PHASE3_QUESTIONS.length}
          </div>
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
              disabled={submitting || (currentQ.type === 'open' && !answers[currentQ.id]?.text) || (currentQ.type === 'choice_with_explanation' && (!answers[currentQ.id]?.choice || !answers[currentQ.id]?.explanation))}
              className="flex items-center gap-2 px-8 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              {submitting ? 'Odesílám...' : (step === PHASE3_QUESTIONS.length - 1 ? 'Odeslat profil' : 'Další otázka')}
              {!submitting && step < PHASE3_QUESTIONS.length - 1 && <ArrowRight size={18} />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
