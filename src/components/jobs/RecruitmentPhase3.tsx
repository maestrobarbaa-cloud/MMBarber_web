"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

// score: 0 = špatná odpověď, 1 = průměrná, 2 = výborná
const PHASE3_QUESTIONS = [
  {
    id: 1,
    type: 'choice',
    question: 'Proč si myslíte, že se většina nezávislých holičů nikdy nevypracuje na absolutní špičku?',
    options: [
      { label: 'Mají smůlu – špatná lokalita nebo zákazníci.', score: 0 },
      { label: 'Chybí jim systematická práce na sobě a sebevzdělávání.', score: 2 },
      { label: 'Nejsou dostatečně talentovaní.', score: 0 },
      { label: 'Nemají správné nástroje a vybavení.', score: 0 },
    ]
  },
  {
    id: 2,
    type: 'choice',
    question: 'Udělali jste nedávno pracovně něco opravdu špatně a někdo na to upozornil. Jak jste zareagoval/a?',
    options: [
      { label: 'Popíral/a jsem to – nebylo to tak špatné, jak říkali.', score: 0 },
      { label: 'Omluvil/a jsem se, ale vnitřně jsem se cítil/a nespravedlivě obviněn/a.', score: 1 },
      { label: 'Přiznal/a jsem chybu, omluvil/a se a hned jsem začal/a přemýšlet, jak to neopakovat.', score: 2 },
      { label: 'Ztichl/a jsem a čekal/a, až to přejde.', score: 0 },
    ]
  },
  {
    id: 3,
    type: 'choice',
    question: 'Co je pro vás osobně horší?',
    options: [
      { label: 'Odvedl jsem skvělou práci, ale zákazník si toho vůbec nevšiml a nepochválil mě.', score: 1 },
      { label: 'Odvedl jsem průměrnou práci a zákazník mi řekl, že to minule bylo lepší.', score: 2 },
    ]
  },
  {
    id: 4,
    type: 'choice',
    question: 'Vaše absolutně nejsilnější vlastnost, pro kterou vás lidé obdivují – a má stinnou stránku?',
    options: [
      { label: 'Perfekcionismus – dělám vše na 100 %, ale tím zpomaluji a stresuju ostatní.', score: 2 },
      { label: 'Přímočarost – říkám věci na rovinu, ale někdy bývám příliš drsný/á.', score: 2 },
      { label: 'Empatie – rozumím lidem, ale nechám se jimi pohltit.', score: 1 },
      { label: 'Nemám žádnou slabinu, jsem vyvážený/á ve všem.', score: 0 },
    ]
  },
  {
    id: 5,
    type: 'choice',
    question: 'Zákazník na poslední chvíli zruší termín s plným stornem a vymlouvá se na nemoc. Peníze potřebujete. Jak reagujete?',
    options: [
      { label: 'Storno odpustím, abych ho neztratil/a jako klienta.', score: 0 },
      { label: 'Storno vymáhám bez diskuse – pravidla jsou pravidla.', score: 1 },
      { label: 'S empatií trvám na storno poplatku, ale nabídnu mu náhradní termín zdarma.', score: 2 },
      { label: 'Vymáhám storno a zákazníka přestanu přijímat.', score: 0 },
    ]
  },
  {
    id: 6,
    type: 'choice',
    question: 'Máte nejlepší nápad v týmu, ale většina nesouhlasí. Co uděláte?',
    options: [
      { label: 'Přizpůsobím se většině, abych nenarušil/a vztahy.', score: 1 },
      { label: 'Budu ostatní přesvědčovat tak dlouho, dokud nepochopí, že mám pravdu.', score: 0 },
      { label: 'Udělám to podle nich, ale když selžou, připomenu jim to.', score: 0 },
      { label: 'Jasně sdělím svůj pohled, nechám hlasovat a respektuji výsledek.', score: 2 },
    ]
  },
  {
    id: 7,
    type: 'choice',
    question: 'Cítili jste se někdy v práci jako oběť špatného systému nebo špatného šéfa? Jak jste zareagoval/a?',
    options: [
      { label: 'Ano – stěžoval/a jsem si kolegům a čekal/a, že se věci změní samy.', score: 0 },
      { label: 'Ano – ale sám/sama jsem hledal/a způsob, jak situaci změnit nebo odejít.', score: 2 },
      { label: 'Trochu ano – frustroval/a jsem se, ale nakonec jsem to překousl/a.', score: 1 },
      { label: 'Ne, nikdy jsem takovou situaci nezažil/a.', score: 0 },
    ]
  },
  {
    id: 8,
    type: 'choice',
    question: 'Je sobota, plno, druhý zákazník po sobě přišel pozdě a je nepříjemný. Jak dáváte najevo stres?',
    options: [
      { label: 'Zmlknu a pracuji mechanicky, bez komunikace.', score: 0 },
      { label: 'Jsem ironický/á nebo sarkastický/á.', score: 0 },
      { label: 'Interně se uklidním (dech, pauza) a zákazníkovi to nedám znát.', score: 2 },
      { label: 'Přímo zákazníkovi řeknu, že přišel pozdě a to komplikuje situaci.', score: 1 },
    ]
  },
  {
    id: 9,
    type: 'choice',
    question: 'Děláte složitý střih a zjistíte, že jste vzali o centimetr výš, než zákazník chtěl. On si nevšiml. Co uděláte?',
    options: [
      { label: 'Mlčím – je to drobnost a zákazník je spokojený.', score: 0 },
      { label: 'Zamaskuji to stylingem a doufám, že si toho nevšimne.', score: 0 },
      { label: 'Přiznám to zákazníkovi, vysvětlím situaci a nabídnu řešení.', score: 2 },
      { label: 'Zákazníkovi to řeknu jen v případě, že se sám zeptá.', score: 1 },
    ]
  },
  {
    id: 10,
    type: 'choice',
    question: 'Zjistíte, že mladý učeň udělal něco viditelně lépe než vy. Jak reagujete?',
    options: [
      { label: 'Zlehčím to – má štěstí začátečníka, to není o dovednostech.', score: 0 },
      { label: 'Vnitřně mě to štve, ale navenek nic neukázuju.', score: 0 },
      { label: 'Upřímně ho pochválím a poprosím ho, ať mi ukáže, jak to udělal.', score: 2 },
      { label: 'Pochválím ho, ale motivuje mě to zlepšit se.', score: 1 },
    ]
  },
  {
    id: 11,
    type: 'choice',
    question: 'Kdy se v práci cítíte nejvíce „nabitý/á" energií?',
    options: [
      { label: 'Když je plno, frmol, hraje hudba a všichni se baví nahlas.', score: 1 },
      { label: 'Když mám čas soustředit se na detail a nikdo na mě nemluví.', score: 1 },
      { label: 'Když vidím, že mám nejvyšší tržbu ze všech.', score: 1 },
      { label: 'Když mi zákazník poděkuje a svěří se se svým problémem.', score: 2 },
    ]
  },
  {
    id: 12,
    type: 'choice',
    question: 'I jako OSVČ budete mít „majitele" podniku. Jaký styl vedení by vás donutil odejít?',
    options: [
      { label: 'Když se do ničeho neplete a nechá nás, ať si vše řešíme sami.', score: 1 },
      { label: 'Když vyžaduje absolutní pořádek a mikromanaguje každý detail.', score: 2 },
      { label: 'Když nedává zpětnou vazbu a pochvalu za dobrou práci.', score: 1 },
    ]
  },
  {
    id: 13,
    type: 'choice',
    question: 'Přijdete do práce a zjistíte, že musíte vzít provizorní horší místo vzadu. Vaše první reakce?',
    options: [
      { label: 'Odmítnu a počkám, než bude moje křeslo volné.', score: 0 },
      { label: 'Přijmu to s viditelnou nelibostí a dám to kolegům najevo.', score: 0 },
      { label: 'Přijmu to klidně – je to dočasné a zákazníci jsou na prvním místě.', score: 2 },
      { label: 'Přijmu to, ale příště zajistím, aby se to nezopakovalo.', score: 1 },
    ]
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
      if (data.applicantId) {
        localStorage.setItem('mmbarber_applicant_id', data.applicantId);
      }
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
          {/* Progress bar */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-mafia-gold"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / PHASE3_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="text-mafia-gold font-mono text-xs uppercase tracking-widest">
            Osobnostní profil (Fáze 3) - Otázka {step + 1} / {PHASE3_QUESTIONS.length}
          </div>
          <h3 className="text-xl md:text-2xl text-white font-heading font-black uppercase tracking-wide leading-snug">{currentQ.question}</h3>

          {currentQ.type === 'choice' && (
            <div className="flex flex-col gap-3 mt-2">
              {(currentQ as any).options?.map((opt: { label: string; score: number }, i: number) => {
                const isSelected = answers[currentQ.id]?.choice === opt.label;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setAnswers({...answers, [currentQ.id]: { choice: opt.label, score: opt.score }})}
                    className={`p-4 text-left border font-mono transition-all duration-200 rounded-lg ${
                      isSelected
                        ? 'bg-mafia-gold/20 border-mafia-gold text-mafia-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'bg-black/50 border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span className={`mt-0.5 w-5 h-5 min-w-[1.25rem] rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-mafia-gold bg-mafia-gold' : 'border-white/30'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-black" />}
                      </span>
                      {opt.label}
                    </span>
                  </motion.button>
                );
              })}
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
              disabled={submitting || (currentQ.type === 'choice' && !answers[currentQ.id]?.choice)}
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
