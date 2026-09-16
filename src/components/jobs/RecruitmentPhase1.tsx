"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

// score: 0 = špatná odpověď, 1 = průměrná, 2 = výborná
const PHASE1_QUESTIONS = [
  {
    id: 1,
    type: 'choice',
    question: 'Co byla podle vás vaše největší profesní chyba za poslední rok a jak jste ji vyřešil/a?',
    options: [
      { label: 'Udělal/a jsem chybu a čekal/a, jestli si toho zákazník všimne sám.', score: 0 },
      { label: 'Chybu jsem si uvědomil/a, ale neřekl/a jsem nic a snažil/a se to zamaskovat.', score: 0 },
      { label: 'Chybu jsem přiznal/a zákazníkovi, omluvil/a se a nabídl/a bezplatnou opravu.', score: 2 },
      { label: 'Chybu jsem si uvědomil/a až zpětně, ale příště jsem to udělal/a jinak.', score: 1 },
    ]
  },
  {
    id: 2,
    type: 'choice',
    question: 'Zákazník se na konci stříhání usměje, zaplatí, ale za dvě hodiny napíše agresivní zprávu, že je to katastrofa a chce peníze zpět. Jak zareagujete?',
    options: [
      { label: 'Zprávu ignoruji nebo nahlásím jako spam.', score: 0 },
      { label: 'Napíšu, že to tak nevypadalo a odmítnu vrácení peněz.', score: 0 },
      { label: 'Omluvím se, pozvu ho znovu a nabídnu bezplatnou úpravu – bez vrácení peněz.', score: 2 },
      { label: 'Vrátím peníze a blokuji ho – nechci problémy.', score: 1 },
    ]
  },
  {
    id: 3,
    type: 'choice',
    question: 'Pokud se vám měsíc nedaří a máte málo zákazníků, čí je to podle vás chyba?',
    options: [
      { label: 'Je špatný měsíc – krize, lidi šetří.', score: 0 },
      { label: 'Holičství nedělá dobrý marketing.', score: 0 },
      { label: 'Je to moje chyba a musím přidat.', score: 2 },
      { label: 'Je to kombinace všeho výše uvedeného.', score: 1 },
    ]
  },
  {
    id: 4,
    type: 'choice',
    question: 'Pracujete jako OSVČ a onemocníte na 10 dní (nula peněz, zrušení klienti). Co uděláte HNED ten den?',
    options: [
      { label: 'Počkám, jestli se to zlepší, a teprve pak řeším klienty.', score: 0 },
      { label: 'Dám story na Instagram, ať si klienti sami napíší.', score: 0 },
      { label: 'Hned ráno kontaktuji všechny klienty, nabídnu náhradní termíny a aktivuji finanční zálohu.', score: 2 },
      { label: 'Zruším vše přes systém a pošlu hromadnou SMS.', score: 1 },
    ]
  },
  {
    id: 5,
    type: 'scale',
    question: 'Jak moc potřebujete, aby vám šéf přesně říkal, co máte daný den dělat? (1 = vůbec, jsem svůj pán / 10 = potřebuji přesné úkoly a kontrolu)'
  },
  {
    id: 6,
    type: 'choice',
    question: 'Přijdete ráno jako první a zjistíte, že kolega zapomněl zapnout pračku – nemáte čisté ručníky pro prvního klienta. Co uděláte?',
    options: [
      { label: 'Zavolám šéfovi a řeknu, že nemohu pracovat.', score: 0 },
      { label: 'Počkám, až přijde kolega, a nechám to na něm.', score: 0 },
      { label: 'Spustím pračku, provizorně použiji papírové ručníky/vlastní a zákazníkovi vysvětlím situaci.', score: 2 },
      { label: 'Zákazníkovi posunu čas a spustím pračku.', score: 1 },
    ]
  },
  {
    id: 7,
    type: 'choice',
    question: 'Co na práci holiče upřímně nesnášíte?',
    options: [
      { label: 'Vůbec nic – vše miluju. (Fajn, ale nebereme to vážně.)', score: 0 },
      { label: 'Zákazníci, kteří nevědí, co chtějí, a pak jsou nespokojení.', score: 1 },
      { label: 'Administrativa, účty, pojistné – ta byrokracie mě stojí energii.', score: 2 },
      { label: 'Musím stát celý den a to fyzicky bolí.', score: 1 },
    ]
  },
  {
    id: 8,
    type: 'choice',
    question: 'Jste spíše týmový hráč (hrajete za značku a kolegy), nebo vlk samotář (zajímá vás jen vaše křeslo a vaši klienti)?',
    options: [
      { label: 'Čistý vlk samotář – zajímám se jen o své křeslo a klienty.', score: 0 },
      { label: 'Týmový hráč – přikládám ruku k dílu pro celou značku i kolegy.', score: 2 },
      { label: 'Záleží na situaci – umím obojí.', score: 1 },
    ]
  },
  {
    id: 9,
    type: 'choice',
    question: 'Jako OSVČ musíte platit sociální a zdravotní pojištění. Máte rezervu na slabší měsíce?',
    options: [
      { label: 'Ne, žiji z měsíce na měsíc a doufám, že bude dobře.', score: 0 },
      { label: 'Rodina mi pomůže v nouzi – ale nic formálního nemám.', score: 0 },
      { label: 'Mám rezervu alespoň na 2–3 měsíce a pravidelně spořím.', score: 2 },
      { label: 'Nemám rezervu, ale mám jiný stabilní příjem vedle.', score: 1 },
    ]
  },
  {
    id: 10,
    type: 'choice',
    question: 'Jste lepší holič než 80 % ostatních v oboru? Podle čeho to soudíte?',
    options: [
      { label: 'Ano, samozřejmě! Vždy patřím k těm nejlepším.', score: 0 },
      { label: 'Ne, pořád se učím a nejsem si jistý/á.', score: 1 },
      { label: 'Myslím, že ano – dokazují mi to opakující se klienti a jejich doporučení.', score: 2 },
      { label: 'Nevím, nemám jak to srovnat s ostatními.', score: 0 },
    ]
  },
  {
    id: 11,
    type: 'choice',
    question: 'Někdo z nadřízených nebo kolegů vám dal tvrdou, možná nepříjemnou zpětnou vazbu. Jaká byla vaše první reakce?',
    options: [
      { label: 'Naštval/a jsem se a bránil/a se – měli chybu, ne já.', score: 0 },
      { label: 'Bylo mi to jedno – kritika nic neznamená.', score: 0 },
      { label: 'Bolelo to, ale poděkoval/a jsem a nad tím přemýšlel/a.', score: 2 },
      { label: 'Přijal/a jsem to klidně na povrchu, ale vnitřně jsem se cítil/a špatně.', score: 1 },
    ]
  },
  {
    id: 12,
    type: 'choice',
    question: 'Máte 4 hodiny „okno" – zrušili se vám klienti. Co budete dělat?',
    options: [
      { label: 'Sedím na telefonu a scroluju TikTok nebo Reels.', score: 0 },
      { label: 'Jdu domů odpočívat – zasloužím si klid.', score: 0 },
      { label: 'Aktivně oslovím klienty s nabídkou termínu, vyčistím nástroje nebo se něco naučím.', score: 2 },
      { label: 'Zajdu na kávu s kolegou nebo si prohlídnu sociální sítě konkurence.', score: 1 },
    ]
  },
  {
    id: 13,
    type: 'choice',
    question: 'V čem jako holič aktuálně nejvíce zaostáváte?',
    options: [
      { label: 'V ničem – jsem komplexní profesionál.', score: 0 },
      { label: 'V technice – některé střihy mi nejdou na 100 %.', score: 2 },
      { label: 'V komunikaci se zákazníky a prodeji.', score: 2 },
      { label: 'Na sociálních sítích – nemám čas ani chuť řešit obsah.', score: 1 },
    ]
  },
  {
    id: 14,
    type: 'choice',
    question: 'Kolega z vedlejšího křesla si opakovaně půjčuje váš strojek a vrací ho nevyčištěný. Jak to vyřešíte?',
    options: [
      { label: 'Mlčím a jen se zlobím uvnitř.', score: 0 },
      { label: 'Stěžuji si šéfovi, ať to za mě vyřeší.', score: 0 },
      { label: 'Řeknu mu přímo: „Kamaráde, prosím tě, vrať strojek vyčištěný – to je základ."', score: 2 },
      { label: 'Strojek prostě přestanu půjčovat bez jakéhokoli vysvětlení.', score: 1 },
    ]
  },
  {
    id: 15,
    type: 'choice',
    question: 'Proč jste se rozhodl/a jít na OSVČ a nebýt zaměstnanec na HPP s jistým platem?',
    options: [
      { label: 'Nevybrali mě na HPP, tak jsem šel/šla na OSVČ.', score: 0 },
      { label: 'Chci svobodu – pracuji kdy a jak chci, bez šéfa nad hlavou.', score: 1 },
      { label: 'Chci vydělávat přímo úměrně svému výkonu a budovat si vlastní klientelu.', score: 2 },
      { label: 'Kamarád/ka mi to poradil/a, bylo to pohodlnější.', score: 0 },
    ]
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
      
      if (data.applicantId) {
        localStorage.setItem('mmbarber_applicant_id', data.applicantId);
      }

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
            {/* Progress bar */}
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-mafia-gold"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / PHASE1_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="text-mafia-gold font-mono text-xs uppercase tracking-widest">Otázka {step + 1} / {PHASE1_QUESTIONS.length}</div>
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

            {currentQ.type === 'scale' && (
              <div className="mt-4">
                <div className="flex justify-between gap-1 md:gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setAnswers({...answers, [currentQ.id]: { value: n, score: n <= 3 ? 2 : n <= 6 ? 1 : 0 }})}
                      className={`flex-1 py-3 md:py-4 border font-mono transition-colors rounded ${
                        answers[currentQ.id]?.value === n
                          ? 'bg-mafia-gold text-black border-mafia-gold font-bold'
                          : 'bg-black/50 border-white/20 text-white/50 hover:border-white/50 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-white/30 font-mono text-xs">
                  <span>Svůj pán</span>
                  <span>Potřebuji vedení</span>
                </div>
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
                disabled={submitting || (currentQ.type === 'scale' && !answers[currentQ.id]?.value) || (currentQ.type === 'choice' && !answers[currentQ.id]?.choice)}
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
