import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export interface QuizQuestion {
  id: string;
  text: Record<'cs' | 'en', string>;
  options: {
    label: Record<'cs' | 'en', string>;
    value: string; // The scoring value (e.g. 'E', 'I', 'words_of_affirmation', etc.)
  }[];
}

export interface QuizDef {
  id: string;
  title: Record<'cs' | 'en', string>;
  description: Record<'cs' | 'en', string>;
  questions: QuizQuestion[];
  evaluate: (answers: string[]) => string;
}

interface PsychologyQuizProps {
  quiz: QuizDef;
  onClose: () => void;
  onComplete: (result: string) => void;
}

export function PsychologyQuiz({ quiz, onClose, onComplete }: PsychologyQuizProps) {
  const { lang } = useTranslation();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleSelectOption = (value: string) => {
    const newAnswers = [...answers, value];
    
    if (currentQIndex < quiz.questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Quiz finished
      const calculatedResult = quiz.evaluate(newAnswers);
      setResult(calculatedResult);
    }
  };

  const handleFinish = () => {
    if (result) {
      onComplete(result);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-mafia-dark border border-mafia-gold/30 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-mafia-gold" />
            <h3 className="text-lg font-heading font-black text-mafia-gold uppercase tracking-widest">
              {quiz.title[lang as 'cs' | 'en']}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!result ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                    <span>{lang === 'cs' ? 'Otázka' : 'Question'} {currentQIndex + 1} / {quiz.questions.length}</span>
                    <span>{Math.round(((currentQIndex) / quiz.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-mafia-gold"
                      initial={{ width: `${((currentQIndex) / quiz.questions.length) * 100}%` }}
                      animate={{ width: `${((currentQIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h4 className="text-xl font-bold text-white mb-8 text-center leading-relaxed">
                  {quiz.questions[currentQIndex].text[lang as 'cs' | 'en']}
                </h4>

                <div className="space-y-3 mt-auto">
                  {quiz.questions[currentQIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.value)}
                      className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-mafia-gold/10 hover:border-mafia-gold/50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-mafia-gold/0 via-mafia-gold/10 to-mafia-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative z-10 text-sm font-sans text-white/90 group-hover:text-mafia-gold transition-colors">
                        {opt.label[lang as 'cs' | 'en']}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-2">
                {lang === 'cs' ? 'Tvůj výsledek' : 'Your Result'}
              </h4>
              <p className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.1em] mb-4">
                {result}
              </p>
              <p className="text-white/60 text-sm font-sans mb-8">
                {lang === 'cs' 
                  ? 'Tento výsledek byl uložen do tvého profilu. Algoritmus tě díky tomu lépe propojí s ideálním partnerem.' 
                  : 'This result has been saved to your profile. The algorithm will connect you better.'}
              </p>
              <button
                onClick={handleFinish}
                className="px-8 py-3 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-colors rounded-full"
              >
                {lang === 'cs' ? 'Pokračovat' : 'Continue'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------
// QUIZ DEFINITIONS
// ----------------------------------------------------

export const MBTI_QUIZ: QuizDef = {
  id: 'mbti',
  title: { cs: 'MBTI Typologie', en: 'MBTI Typology' },
  description: { cs: 'Zjistěte svůj osobnostní typ ze 16 variant.', en: 'Find your personality type from 16 variants.' },
  questions: [
    {
      id: 'ei',
      text: { cs: 'Když máš za sebou náročný týden, jak nejraději dobiješ baterky?', en: 'After a hard week, how do you recharge?' },
      options: [
        { value: 'E', label: { cs: 'Vyrazím s přáteli ven na drink nebo akci.', en: 'Go out with friends for a drink or party.' } },
        { value: 'I', label: { cs: 'Zalezu si doma s knihou nebo u filmu.', en: 'Stay home with a book or movie.' } }
      ]
    },
    {
      id: 'sn',
      text: { cs: 'Při řešení problémů se spoléháš spíše na...', en: 'When solving problems you rely on...' },
      options: [
        { value: 'S', label: { cs: 'Fakta, detaily a minulé zkušenosti.', en: 'Facts, details and past experiences.' } },
        { value: 'N', label: { cs: 'Instinkt, vize do budoucna a celkový obraz.', en: 'Instinct, future visions and big picture.' } }
      ]
    },
    {
      id: 'tf',
      text: { cs: 'Když musíš udělat těžké rozhodnutí, co převáží?', en: 'When making a hard decision, what wins?' },
      options: [
        { value: 'T', label: { cs: 'Logika, objektivita a rozum.', en: 'Logic, objectivity and reason.' } },
        { value: 'F', label: { cs: 'Emoce, empatie a vliv na ostatní.', en: 'Emotions, empathy and impact on others.' } }
      ]
    },
    {
      id: 'jp',
      text: { cs: 'Jak přistupuješ k plánování dovolené?', en: 'How do you approach planning a vacation?' },
      options: [
        { value: 'J', label: { cs: 'Mám přesný itinerář a vím, co se bude dít.', en: 'I have an exact itinerary and know what will happen.' } },
        { value: 'P', label: { cs: 'Koupím letenku a zbytek řeším spontánně na místě.', en: 'Buy a ticket and improvise.' } }
      ]
    }
  ],
  evaluate: (answers) => answers.join('') // e.g. "ENTP"
};

export const LOVE_LANGUAGE_QUIZ: QuizDef = {
  id: 'lovelang',
  title: { cs: 'Jazyk Lásky', en: 'Love Language' },
  description: { cs: 'Jak vyjadřujete a přijímáte lásku?', en: 'How do you express and receive love?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Co tě od partnera nejvíce potěší?', en: 'What pleases you most from a partner?' },
      options: [
        { value: 'Slova ujištění', label: { cs: 'Když mi řekne, jak moc mě miluje a cení si mě.', en: 'When they tell me how much they love and appreciate me.' } },
        { value: 'Pozornost', label: { cs: 'Když odloží telefon a naplno se mi věnuje.', en: 'When they put away the phone and fully focus on me.' } },
        { value: 'Dárky', label: { cs: 'Když mi přinese nějakou drobnost jen tak.', en: 'When they bring me a little gift just because.' } },
        { value: 'Skutky', label: { cs: 'Když za mě udělá nějakou domácí práci, abych si odpočinul/a.', en: 'When they do a chore so I can rest.' } },
        { value: 'Fyzický kontakt', label: { cs: 'Když mě jen tak obejme nebo se držíme za ruce.', en: 'When they hug me or hold hands.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0] // Simple 1-question quiz for now
};

export const ATTACHMENT_STYLE_QUIZ: QuizDef = {
  id: 'attachment',
  title: { cs: 'Typ citové vazby', en: 'Attachment Style' },
  description: { cs: 'Jak se chováte ve vztazích?', en: 'How do you behave in relationships?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Když tvůj partner najednou přestane odepisovat na několik hodin...', en: 'When your partner suddenly stops texting for hours...' },
      options: [
        { value: 'Bezpečná', label: { cs: 'Nijak to neřeším, asi má zrovna moc práce.', en: 'I do not care, probably busy.' } },
        { value: 'Úzkostná', label: { cs: 'Začnu panikařit a přemýšlím, co jsem udělal/a špatně.', en: 'I panic and overthink what I did wrong.' } },
        { value: 'Vyhýbavá', label: { cs: 'Je mi to jedno, vlastně jsem rád/a za chvíli klidu.', en: 'I do not care, actually glad for some peace.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const CHRONOTYPE_QUIZ: QuizDef = {
  id: 'chronotype',
  title: { cs: 'Chronotyp', en: 'Chronotype' },
  description: { cs: 'Kdy máte během dne nejvíc energie?', en: 'When do you have the most energy?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Kdyby sis mohl/a vybrat jakoukoliv pracovní dobu, byla by to...', en: 'If you could choose any working hours...' },
      options: [
        { value: 'Ranní skřivan', label: { cs: 'Začít brzo ráno a mít odpoledne volno.', en: 'Start early morning and have afternoon free.' } },
        { value: 'Noční sova', label: { cs: 'Spát dopoledne a pracovat dlouho do noci.', en: 'Sleep in morning and work late night.' } },
        { value: 'Medvěd', label: { cs: 'Klasická 9 do 5, kopírovat slunce.', en: 'Classic 9 to 5, follow the sun.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const TEMPERAMENT_QUIZ: QuizDef = {
  id: 'temperament',
  title: { cs: 'Temperament', en: 'Temperament' },
  description: { cs: 'Jste sangvinik, cholerik, flegmatik nebo melancholik?', en: 'Are you sanguine, choleric, phlegmatic, or melancholic?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Když se ve skupině lidí objeví nečekaný problém...', en: 'When an unexpected problem arises in a group...' },
      options: [
        { value: 'Cholerik', label: { cs: 'Hned převezmu velení a začnu to řešit.', en: 'I take charge and start solving it.' } },
        { value: 'Sangvinik', label: { cs: 'Snažím se uvolnit napětí vtipem a povzbudit ostatní.', en: 'I try to ease tension with humor and encourage others.' } },
        { value: 'Flegmatik', label: { cs: 'Zachovám klid, nic nehrotím a počkám, co se vyvrbí.', en: 'I stay calm, do not overreact and wait.' } },
        { value: 'Melancholik', label: { cs: 'Zastavím se a začnu do hloubky analyzovat, proč to vzniklo.', en: 'I stop and deeply analyze why it happened.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const ENNEAGRAM_QUIZ: QuizDef = {
  id: 'enneagram',
  title: { cs: 'Enneagram', en: 'Enneagram' },
  description: { cs: 'Základní psychologický typ od 1 do 9.', en: 'Basic psychological type from 1 to 9.' },
  questions: [
    {
      id: '1',
      text: { cs: 'Co tě nejvíce pohání v životě?', en: 'What drives you the most in life?' },
      options: [
        { value: 'Typ 1 (Perfekcionista)', label: { cs: 'Touha dělat věci správně a být dobrým člověkem.', en: 'Desire to do things right and be a good person.' } },
        { value: 'Typ 3 (Dosahovač)', label: { cs: 'Touha být úspěšný a něco dokázat.', en: 'Desire to be successful and achieve things.' } },
        { value: 'Typ 7 (Epikurejec)', label: { cs: 'Touha zažívat nové věci, dobrodružství a zábavu.', en: 'Desire to experience new things and have fun.' } },
        { value: 'Typ 9 (Mírotvůrce)', label: { cs: 'Touha po klidu, harmonii a vyhýbání se konfliktům.', en: 'Desire for peace, harmony and avoiding conflict.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const CONFLICT_STYLE_QUIZ: QuizDef = {
  id: 'conflictStyle',
  title: { cs: 'Řešení konfliktů', en: 'Conflict Style' },
  description: { cs: 'Jak nejčastěji řešíte hádky a problémy ve vztahu?', en: 'How do you handle arguments and problems in a relationship?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Když dojde na ostronou hádku s partnerem...', en: 'When there is a heated argument with your partner...' },
      options: [
        { value: 'Vyhýbavý (Avoidant)', label: { cs: 'Raději odejdu a nechám to vychladnout. Nemám rád/a křik.', en: 'I prefer to walk away and let it cool down. I hate yelling.' } },
        { value: 'Soutěživý (Competitive)', label: { cs: 'Musím si prosadit svou a dokázat, že mám pravdu.', en: 'I need to stand my ground and prove I am right.' } },
        { value: 'Přizpůsobivý (Accommodating)', label: { cs: 'Raději ustoupím, aby byl klid.', en: 'I rather give in to keep the peace.' } },
        { value: 'Kompromisní (Compromising)', label: { cs: 'Snažím se najít střední cestu, kde oba trochu slevíme.', en: 'I try to find a middle ground where we both compromise.' } },
        { value: 'Spolupracující (Collaborative)', label: { cs: 'Beru to jako my dva proti problému, bavíme se o tom, dokud nenajdeme win-win řešení.', en: 'I see it as us vs. the problem, we talk until we find a win-win.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const APOLOGY_LANGUAGE_QUIZ: QuizDef = {
  id: 'apologyLanguage',
  title: { cs: 'Jazyk omluvy', en: 'Apology Language' },
  description: { cs: 'Jak potřebujete slyšet omluvu, aby pro vás byla upřímná?', en: 'How do you need to hear an apology to feel it is sincere?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Když ti někdo ublíží a chce se omluvit, co pro tebe znamená nejvíc?', en: 'When someone hurts you and wants to apologize, what means the most to you?' },
      options: [
        { value: 'Vyjádření lítosti', label: { cs: 'Obyčejné a upřímné "Omlouvám se, mrzí mě, že jsem ti ublížil".', en: 'A simple and sincere "I am sorry, it hurts me that I hurt you".' } },
        { value: 'Přijetí zodpovědnosti', label: { cs: 'Když partner řekne "Udělal jsem chybu, neměl jsem to dělat".', en: 'When partner says "I made a mistake, I should not have done that".' } },
        { value: 'Nabídka nápravy', label: { cs: 'Když hned navrhne, jak to napraví nebo vykompenzuje.', en: 'When they immediately suggest how to fix it or make it up to me.' } },
        { value: 'Upřímné pokání', label: { cs: 'Když vidím snahu změnit chování, aby se to už neopakovalo.', en: 'When I see an effort to change behavior so it does not happen again.' } },
        { value: 'Žádost o odpuštění', label: { cs: 'Když se mě přímo zeptá "Odpustíš mi?".', en: 'When they directly ask me "Will you forgive me?".' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const BRAIN_HEMISPHERE_QUIZ: QuizDef = {
  id: 'brainHemisphere',
  title: { cs: 'Dominantní hemisféra', en: 'Brain Hemisphere' },
  description: { cs: 'Jste spíše logický analytik nebo kreativní snílek?', en: 'Are you more of a logical analyst or a creative dreamer?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Při řešení nového a neznámého úkolu...', en: 'When solving a new and unknown task...' },
      options: [
        { value: 'Levá hemisféra (Logika)', label: { cs: 'Postupuji krok za krokem, dělám si seznamy a spoléhám na fakta.', en: 'I go step by step, make lists and rely on facts.' } },
        { value: 'Pravá hemisféra (Kreativita)', label: { cs: 'Použiji intuici, zkouším to pocitově a hledám neotřelá řešení.', en: 'I use intuition, try it by feel and look for unconventional solutions.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const INTIMACY_DYNAMIC_QUIZ: QuizDef = {
  id: 'intimacyDynamic',
  title: { cs: 'Intimní dynamika', en: 'Intimacy Dynamic' },
  description: { cs: 'Něco peprnějšího: Jaký je váš archetyp za zavřenými dveřmi?', en: 'Something spicier: What is your archetype behind closed doors?' },
  questions: [
    {
      id: '1',
      text: { cs: 'V intimitě se cítíte nejpřirozeněji, když...', en: 'In intimacy you feel most natural when...' },
      options: [
        { value: 'Dominantní', label: { cs: 'Přebírám kontrolu a vedu partnera/partnerku.', en: 'I take control and lead my partner.' } },
        { value: 'Submisivní', label: { cs: 'Rád/a se odevzdám a nechám se vést.', en: 'I like to surrender and be led.' } },
        { value: 'Přepínač (Switch)', label: { cs: 'Baví mě obojí, střídám role podle nálady.', en: 'I enjoy both, switching roles based on mood.' } },
        { value: 'Pečující (Giver)', label: { cs: 'Mým hlavním cílem je absolutní potěšení druhého.', en: 'My main goal is the absolute pleasure of the other.' } },
        { value: 'Průzkumník', label: { cs: 'Miluji experimenty, zkoušení nových hraček a hranic.', en: 'I love experiments, trying new toys and boundaries.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const LOVE_STYLE_QUIZ: QuizDef = {
  id: 'loveStyle',
  title: { cs: 'Styl lásky (Leeho teorie)', en: 'Love Style (Lee)' },
  description: { cs: 'Jaký je váš základní styl milování?', en: 'What is your basic style of loving?' },
  questions: [
    {
      id: '1',
      text: { cs: 'Jak definujete opravdovou lásku?', en: 'How do you define true love?' },
      options: [
        { value: 'Eros (Romantická)', label: { cs: 'Vášeň, fyzická přitažlivost a chemie na první pohled.', en: 'Passion, physical attraction and chemistry at first sight.' } },
        { value: 'Storge (Přátelská)', label: { cs: 'Láska roste pomalu z hlubokého přátelství a důvěry.', en: 'Love grows slowly from deep friendship and trust.' } },
        { value: 'Ludus (Hravá)', label: { cs: 'Láska je vzrušující hra, lov a flirtování bez závazků.', en: 'Love is an exciting game, hunting and flirting without commitments.' } },
        { value: 'Pragma (Logická)', label: { cs: 'Rozumový výběr. Hledám praktickou a stabilní kompatibilitu.', en: 'Rational choice. I seek practical and stable compatibility.' } },
        { value: 'Agape (Obětavá)', label: { cs: 'Nezištná a bezpodmínečná podpora partnera nad vlastní zájmy.', en: 'Selfless and unconditional support of partner over my own interests.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const DARK_TRIAD_QUIZ: QuizDef = {
  id: 'darkTriad',
  title: { cs: 'Temná triáda (Tajemno)', en: 'Dark Triad' },
  description: { cs: 'Máte v sobě nějaké ty "bad boy / bad girl" rysy?', en: 'Do you have some of those "bad boy / bad girl" traits?' },
  questions: [
    {
      id: '1',
      text: { cs: 'V náročných sociálních situacích nebo konfliktech...', en: 'In demanding social situations or conflicts...' },
      options: [
        { value: 'Nezávislý rebel', label: { cs: 'Jdu si tvrdě za svým a pravidla mě moc nezajímají.', en: 'I go hard for what I want and rules do not bother me much.' } },
        { value: 'Charismatický stratég', label: { cs: 'Vím, jak s lidmi manipulovat (v dobrém), abych dosáhl/a svého.', en: 'I know how to manipulate people (in a good way) to get what I want.' } },
        { value: 'Středobod vesmíru', label: { cs: 'Potřebuji obdiv, pozornost a vím, že mám navrch.', en: 'I need admiration, attention and I know I have the upper hand.' } },
        { value: 'Běžný smrtelník', label: { cs: 'Jsem spíše empatický/á, žádné temné rysy u mě nehledejte.', en: 'I am rather empathetic, do not look for any dark traits in me.' } }
      ]
    }
  ],
  evaluate: (answers) => answers[0]
};

export const SPONTANEITY_QUIZ: QuizDef = {
  id: 'spontaneity',
  title: { cs: 'Spontánnost vs. Plánování', en: 'Spontaneity vs. Planning' },
  description: { cs: 'Zjistíme, jak moc potřebuješ mít věci pod kontrolou.', en: 'Let us see how much control you need.' },
  questions: [
    {
      id: 'q1',
      text: { cs: 'Máte jet na víkend pryč. Co uděláš?', en: 'Weekend getaway. What do you do?' },
      options: [
        { label: { cs: 'Mám přesný itinerář na každou hodinu.', en: 'I have a strict itinerary.' }, value: 'Planner' },
        { label: { cs: 'Zarezervuji hotel, zbytek se uvidí.', en: 'Book a hotel, wing the rest.' }, value: 'Balanced' },
        { label: { cs: 'Sednu do auta a prostě někam jedu.', en: 'Just start driving.' }, value: 'Spontaneous' }
      ]
    },
    {
      id: 'q2',
      text: { cs: 'Když se změní plány na poslední chvíli...', en: 'When plans change last minute...' },
      options: [
        { label: { cs: 'Rozhodí mě to, nemám to rád/a.', en: 'It throws me off, I hate it.' }, value: 'Planner' },
        { label: { cs: 'Trochu mě to štve, ale přizpůsobím se.', en: 'A bit annoying, but I adapt.' }, value: 'Balanced' },
        { label: { cs: 'Super, mám rád/a nečekané věci!', en: 'Awesome, I love unexpected things!' }, value: 'Spontaneous' }
      ]
    }
  ],
  evaluate: (answers) => {
    const counts = { Planner: 0, Balanced: 0, Spontaneous: 0 };
    answers.forEach(a => counts[a as keyof typeof counts]++);
    if (counts.Planner > counts.Spontaneous) return 'Plánovač (Planner)';
    if (counts.Spontaneous > counts.Planner) return 'Spontánní (Spontaneous)';
    return 'Něco mezi (Balanced)';
  }
};

export const INFIDELITY_BOUNDARY_QUIZ: QuizDef = {
  id: 'infidelityBoundary',
  title: { cs: 'Hranice Nevěry', en: 'Infidelity Boundaries' },
  description: { cs: 'Kde přesně máš nastavenou hranici, přes kterou nejede vlak?', en: 'Where exactly do you draw the line?' },
  questions: [
    {
      id: 'q1',
      text: { cs: 'Je flirtování s někým na baru už nevěra?', en: 'Is flirting at a bar cheating?' },
      options: [
        { label: { cs: 'Ano, absolutně.', en: 'Yes, absolutely.' }, value: 'Strict' },
        { label: { cs: 'Záleží na míře a úmyslu.', en: 'Depends on the intent.' }, value: 'Moderate' },
        { label: { cs: 'Ne, je to jen neškodná zábava.', en: 'No, just harmless fun.' }, value: 'Relaxed' }
      ]
    },
    {
      id: 'q2',
      text: { cs: 'A co tajné psaní s ex-partnerem?', en: 'What about secret texting with an ex?' },
      options: [
        { label: { cs: 'Okamžitý konec vztahu.', en: 'Immediate dealbreaker.' }, value: 'Strict' },
        { label: { cs: 'Pokud to přede mnou tají, je to problém (Emoční nevěra).', en: 'If hidden, it is emotional cheating.' }, value: 'Moderate' },
        { label: { cs: 'Psaní je jen psaní, neřeším to.', en: 'Texting is just texting.' }, value: 'Relaxed' }
      ]
    }
  ],
  evaluate: (answers) => {
    const counts = { Strict: 0, Moderate: 0, Relaxed: 0 };
    answers.forEach(a => counts[a as keyof typeof counts]++);
    if (counts.Strict >= 1) return 'Velmi přísné (Strict)';
    if (counts.Relaxed >= 2) return 'Uvolněné (Relaxed)';
    return 'Střední - Důraz na emoční věrnost (Moderate)';
  }
};
