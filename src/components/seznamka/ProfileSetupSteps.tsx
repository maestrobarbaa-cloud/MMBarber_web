import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Eye, HeartPulse, Brain, Activity, Coffee, ShieldCheck , Target } from "lucide-react";
import { ProfileData } from "./ProfileTypes";
import { CustomSelect } from "./CustomSelect";
import { AccordionSection } from "./AccordionSection";
import { PreferenceSelector, TraitSelector, InfoTooltip } from "./SetupHelpers";

interface StepProps {
  formData: ProfileData;
  setFormData: (data: ProfileData) => void;
  lang: 'cs' | 'en';
}

export const PointsBadge = ({ points }: { points: number }) => (
  <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/30 shadow-[0_0_10px_rgba(197,160,89,0.2)]" title={`Za vyplnění získáš +${points} coinů`}>
    +{points} 🪙
  </span>
);

export const Step2Physical = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Vzhled a Tělo</h4>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
         <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
           Tvoje výška (cm)
           <InfoTooltip text="Fyzické proporce jsou pro někoho důležité. Zadej reálnou výšku." />
         </label>
         <input type="number" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" />
      </div>
      <div>
         <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
           Tvoje váha (kg)
           <InfoTooltip text="Pro výpočet BMI." />
         </label>
         <div className="flex gap-4 items-center">
           <input type="number" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" />
           {formData.height && formData.weight && (
             <div className="text-xs font-mono px-3 py-2 bg-mafia-gold/20 text-mafia-gold rounded whitespace-nowrap">
               BMI: {(Number(formData.weight) / ((Number(formData.height)/100) ** 2)).toFixed(1)}
             </div>
           )}
         </div>
      </div>
      <div>
         <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvoje postava <PointsBadge points={5} /></label>
         <CustomSelect value={formData.myBodyType || ""} onChange={(v) => setFormData({...formData, myBodyType: v})} options={[{value:'slender', label:'Štíhlá'}, {value:'athletic', label:'Sportovní'}, {value:'average', label:'Normální'}, {value:'curvy', label:'Plnější/Robustnější'}]} placeholder="Vyber..." />
      </div>
    </div>

    

    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Preference u partnera</h4>
      <div className="space-y-6">
        <TraitSelector label="Důležitost fyzické přitažlivosti" tooltipText="Záleží ti hodně na vzhledu, nebo spíš na povaze?" value={formData.physicalAttraction?.importance} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, importance: v as any}})} />
        <TraitSelector label="Jak moc musí dbát na vzhled" tooltipText="Hledáš někoho, kdo tráví hodiny před zrcadlem, nebo ti to je jedno?" value={formData.physicalAttraction?.careForLooks} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, careForLooks: v as any}})} />
        <TraitSelector label="Důležitost sexuálního života" tooltipText="Matchujeme lidi s podobným apetitem a prioritami." value={formData.physicalAttraction?.sexImportance} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, sexImportance: v as any}})} />
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Na co se má algoritmus zaměřit? <PointsBadge points={5} /></label>
           <CustomSelect value={formData.physicalAttraction?.attractionPreference || ""} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, attractionPreference: v as any}})} options={[{value:'physical', label:'Hlavně fyzická přitažlivost'}, {value:'psychological', label:'Hlavně psychická přitažlivost (sapiosexuál)'}, {value:'both', label:'Obojí je stejně důležité'}]} placeholder="Vyber..." />
        </div>
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Úchylky / Specifické preference (Volitelné) <PointsBadge points={5} /></label>
           <input type="text" value={formData.physicalAttraction?.kinks || ''} onChange={(e) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, kinks: e.target.value}})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Např. BDSM, foot fetish, dominantní partner..." />
        </div>
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Preferovaná postava partnera <PointsBadge points={5} /></label>
           <CustomSelect isMulti={true} value={formData.physicalAttraction?.prefBodyType || []} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, prefBodyType: v}})} options={[{value:'slender', label:'Štíhlá'}, {value:'athletic', label:'Sportovní'}, {value:'average', label:'Normální'}, {value:'curvy', label:'Plnější/Robustnější'}, {value:'any', label:'Nezáleží'}]} placeholder="Vyber..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Min. Věk <PointsBadge points={5} /></label>
             <input type="number" min="18" max="99" value={formData.prefAgeMin || ''} onChange={(e) => setFormData({...formData, prefAgeMin: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Od" />
           </div>
           <div>
             <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Max. Věk <PointsBadge points={5} /></label>
             <input type="number" min="18" max="99" value={formData.prefAgeMax || ''} onChange={(e) => setFormData({...formData, prefAgeMax: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Do" />
           </div>
        </div>
      </div>
    </div>

    
  </motion.div>
);

const TemperamentSection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizStep, setQuizStep] = React.useState(0);
  const [scores, setScores] = React.useState({ sangvinik: 0, cholerik: 0, flegmatik: 0, melancholik: 0 });

  const questions = [
    { q: "Jak reaguješ na náhlou změnu plánu?", options: [
      { label: "Nadšeně, změny mě baví", type: "sangvinik" },
      { label: "Naštve mě to, hned hledám rychlé řešení", type: "cholerik" },
      { label: "Je mi to jedno, nějak se přizpůsobím", type: "flegmatik" },
      { label: "Rozhodí mě to a zkazí mi to náladu", type: "melancholik" }
    ]},
    { q: "Ve společnosti nových lidí...", options: [
      { label: "Jsem středem pozornosti, bavím se", type: "sangvinik" },
      { label: "Ujímám se slova a organizuji konverzaci", type: "cholerik" },
      { label: "Spíše poslouchám a usmívám se", type: "flegmatik" },
      { label: "Držím se stranou, raději pozoruji", type: "melancholik" }
    ]},
    { q: "Tvůj přístup k problémům?", options: [
      { label: "Beru je s humorem, nějak to dopadne", type: "sangvinik" },
      { label: "Rovnou do nich jdu a řeším je hned", type: "cholerik" },
      { label: "Vyčkávám, často se vyřeší samy", type: "flegmatik" },
      { label: "Hluboce je analyzuji a dělám si starosti", type: "melancholik" }
    ]}
  ];

  const handleAnswer = (type: string) => {
    const newScores = { ...scores, [type]: scores[type as keyof typeof scores] + 1 };
    setScores(newScores);
    if (quizStep < questions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      const highest = Object.keys(newScores).reduce((a, b) => newScores[a as keyof typeof newScores] > newScores[b as keyof typeof newScores] ? a : b);
      setFormData({...formData, temperament: highest});
      setShowQuiz(false);
      setQuizStep(0);
      setScores({ sangvinik: 0, cholerik: 0, flegmatik: 0, melancholik: 0 });
    }
  };

  return (
    <div className="mt-6 border-t border-mafia-gold/20 pt-6">
      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvůj temperament <PointsBadge points={5} /></label>
      
      {!showQuiz ? (
        <div className="space-y-4">
          <CustomSelect 
            value={formData.temperament || ""} 
            onChange={(v) => setFormData({...formData, temperament: v})} 
            options={[
              {value: 'sangvinik', label: 'Sangvinik (Optimistický, společenský, impulzivní)'},
              {value: 'cholerik', label: 'Cholerik (Vůdčí, energický, výbušný)'},
              {value: 'flegmatik', label: 'Flegmatik (Klidný, vyrovnaný, pomalý)'},
              {value: 'melancholik', label: 'Melancholik (Citlivý, přemýšlivý, pesimistický)'}
            ]} 
            placeholder="Vyber svůj temperament..." 
          />
          <button type="button" onClick={() => setShowQuiz(true)} className="text-xs font-mono text-mafia-gold hover:text-white underline">
            Nevíš jistě? Udělej si rychlý test (3 otázky)
          </button>
        </div>
      ) : (
        <div className="p-4 bg-black/40 border border-mafia-gold/30 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-heading font-black text-mafia-gold text-sm">Test Temperamentu ({quizStep + 1}/{questions.length})</h5>
            <button type="button" onClick={() => setShowQuiz(false)} className="text-white/40 hover:text-white"><X size={16}/></button>
          </div>
          <p className="text-white text-sm mb-4">{questions[quizStep].q}</p>
          <div className="space-y-2">
            {questions[quizStep].options.map((opt, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={() => handleAnswer(opt.type)}
                className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold rounded-lg text-sm text-white transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ComplexPersonalitySection = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [quizStep, setQuizStep] = React.useState(0);
  const [score, setScore] = React.useState(0);

  const questions = [
    { q: "Když tě čeká rozhodnutí...", options: [
      { label: "Analyzuji to ze všech stran a tvořím v hlavě tisíc scénářů.", points: 3 },
      { label: "Zvažuji pro a proti, ale pak se prostě rozhodnu.", points: 1 },
      { label: "Jedu spíš podle instinktu, moc nad tím nebádám.", points: 0 }
    ]},
    { q: "Máš někdy naprosto protichůdné pocity? (Např. miluješ lidi, ale zároveň je nesnášíš)", options: [
      { label: "Ano, to je u mě naprosto běžné, jsem extrém.", points: 3 },
      { label: "Občas se to stane, ale umím si to srovnat.", points: 1 },
      { label: "Ne, vím přesně co chci a jak se cítím.", points: 0 }
    ]},
    { q: "Co ti nejčastěji říkají tvoji blízcí?", options: [
      { label: "Že jsem příliš složitý/á a moc všechno 'hrotím'.", points: 3 },
      { label: "Že jsem přemýšlivý/á a mám to v hlavě srovnané.", points: 1 },
      { label: "Že jsem v pohodě, přímočarý/á a nekomplikovaný/á.", points: 0 }
    ]}
  ];

  const handleAnswer = (pts: number) => {
    const newScore = score + pts;
    setScore(newScore);
    if (quizStep < questions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      let result = 'simple';
      if (newScore >= 7) result = 'highly_complex';
      else if (newScore >= 4) result = 'complex';
      
      setFormData({...formData, personalityComplexity: result});
      setShowQuiz(false);
      setQuizStep(0);
      setScore(0);
    }
  };

  return (
    <div className="mt-6 border-t border-mafia-gold/20 pt-6">
      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Složitost osobnosti <PointsBadge points={5} /></label>
      
      {!showQuiz ? (
        <div className="space-y-4">
          <CustomSelect 
            value={formData.personalityComplexity || ""} 
            onChange={(v) => setFormData({...formData, personalityComplexity: v})} 
            options={[
              {value: 'highly_complex', label: 'Velmi složitá (Overthinking, tisíc myšlenek, protichůdné emoce)'},
              {value: 'complex', label: 'Složitá (Rád/a analyzuji, hodně o věcech přemýšlím)'},
              {value: 'chaotic', label: 'Chaotická (Jsem nevyzpytatelný/á a náladový/á)'},
              {value: 'mysterious', label: 'Záhadná (Těžko čitelná pro ostatní, neotevírám se snadno)'},
              {value: 'simple', label: 'Přímočará (Nekomplikuji si život, co na srdci to na jazyku)'},
              {value: 'transparent', label: 'Otevřená kniha (Naprosto průhledná, nic neskrývám)'}
            ]} 
            placeholder="Jsi složitá osobnost?" 
          />
          <button type="button" onClick={() => setShowQuiz(true)} className="text-xs font-mono text-mafia-gold hover:text-white underline">
            Otestovat míru mé složitosti (3 otázky)
          </button>
        </div>
      ) : (
        <div className="p-4 bg-black/40 border border-mafia-gold/30 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-heading font-black text-mafia-gold text-sm">Test Složitosti ({quizStep + 1}/{questions.length})</h5>
            <button type="button" onClick={() => setShowQuiz(false)} className="text-white/40 hover:text-white"><X size={16}/></button>
          </div>
          <p className="text-white text-sm mb-4">{questions[quizStep].q}</p>
          <div className="space-y-2">
            {questions[quizStep].options.map((opt, i) => (
              <button 
                key={i} 
                type="button" 
                onClick={() => handleAnswer(opt.points)}
                className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold rounded-lg text-sm text-white transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Step3Character = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Povaha a Charakter</h4>
    </div>
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl mb-8 transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Moje povaha (Jaký/á jsem)</h4>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vyber, co tě nejlépe vystihuje <PointsBadge points={5} /></label>
        <CustomSelect isMulti={true} value={formData.myTraits || []} onChange={(val) => setFormData({ ...formData, myTraits: val })} placeholder="Vyber vlastnosti..." options={[
          { value: "honest", label: "Upřímný/á" },
          { value: "loyal", label: "Věrný/á" },
          { value: "funny", label: "Vtipný/á (Smysl pro humor)" },
          { value: "reliable", label: "Spolehlivý/á" },
          { value: "empathetic", label: "Empatický/á" },
          { value: "ambitious", label: "Ambiciózní" },
          { value: "calm", label: "Klidný/á (Flegmatik)" },
          { value: "social", label: "Společenský/á" },
          { value: "romantic", label: "Romantický/á" },
          { value: "independent", label: "Samostatný/á" },
          { value: "tolerant", label: "Tolerantní" },
          { value: "family", label: "Rodinně založený/á" },
          { value: "adventurous", label: "Dobrodružný/á" }
        ]} />
      </div>

    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl transition-all">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Preference u partnera</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TraitSelector label="Upřímnost" tooltipText="Základ dobrého vztahu pro většinu, ale každý to má jinak." value={formData.characterTraits?.honesty} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, honesty: val as any } })} />
        <TraitSelector label="Věrnost" tooltipText="Někdo preferuje otevřené vztahy, algoritmus to zohlední." value={formData.characterTraits?.loyalty} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, loyalty: val as any } })} />
        <TraitSelector label="Smysl pro humor" tooltipText="Sdílený humor je klíč ke šťastnému soužití." value={formData.characterTraits?.humor} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, humor: val as any } })} />
        <TraitSelector label="Spolehlivost" tooltipText="Potřebuješ se na druhého spolehnout na 100%?" value={formData.characterTraits?.reliability} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, reliability: val as any } })} />
        <TraitSelector label="Empatie" tooltipText="Schopnost druhého vnímat tvé emoce." value={formData.characterTraits?.empathy} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, empathy: val as any } })} />
        <TraitSelector label="Ambice" tooltipText="Ambiciózní partneři většinou hledají stejně smýšlející." value={formData.characterTraits?.ambition} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, ambition: val as any } })} />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Sociální baterie <PointsBadge points={5} /></label>
        <CustomSelect value={formData.socialBattery || ""} onChange={(val) => setFormData({ ...formData, socialBattery: val })} placeholder="Vyber..." options={[{ value: "Extrovert", label: "Extrovert" }, { value: "Introvert", label: "Introvert" }, { value: "Ambivert", label: "Ambivert" }]} />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Osobnostní dynamika <PointsBadge points={5} /></label>
        <CustomSelect value={formData.personalityDynamics || ""} onChange={(val) => setFormData({ ...formData, personalityDynamics: val })} placeholder="Vyber..." options={[{ value: "Dominantní", label: "Dominantní" }, { value: "Submisivní", label: "Submisivní" }, { value: "Switch", label: "Přepínač (Switch)" }, { value: "Egalitarian", label: "Rovnocenný" }]} />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Mírnost povahy (Konflikty) <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.peacefulness || ""} 
          onChange={(val) => setFormData({ ...formData, peacefulness: val })} 
          placeholder="Vyber..." 
          options={[
            { value: "pacifist", label: "Absolutní pacifista (vyhýbám se konfliktům)" },
            { value: "calm", label: "Klidný vyjednavač (řeším věci s chladnou hlavou)" },
            { value: "assertive", label: "Asertivní (nenechám si nic líbit, ale nekřičím)" },
            { value: "explosive", label: "Výbušný (rychle vzplanu, rychle vychladnu)" },
            { value: "fighter", label: "Bojovník (jdu do střetu hned)" }
          ]} 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvůj přístup k dnešní době <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.mindsetContext || ""} 
          onChange={(val) => setFormData({ ...formData, mindsetContext: val })} 
          placeholder="Vyber..." 
          options={[
            { value: "toxic_positivity", label: "Vždy pozitivní, ignoruju negativa" },
            { value: "realistic_optimist", label: "Realistický optimista (hledám řešení)" },
            { value: "neutral", label: "Zlatá střední cesta (žiju přítomností)" },
            { value: "prepared_pessimist", label: "Očekávám nejhorší (abych nebyl zklamaný)" },
            { value: "doomer", label: "Doomer (svět se řítí do záhuby)" }
          ]} 
        />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-950/20 border border-blue-500/30 hover:border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] rounded-xl mt-8 space-y-4 transition-all">
      <h4 className="font-heading font-black text-blue-400 uppercase tracking-widest text-sm mb-2">
        💬 Lamač ledů (Icebreaker)
      </h4>
      <p className="text-white/60 font-mono text-[10px] uppercase mb-4">Ulehči lidem první krok. Vyber si výzvu, na kterou ti mají odpovědět.</p>
      <CustomSelect 
        value={formData.icebreaker || ""} 
        onChange={(val) => setFormData({ ...formData, icebreaker: val })} 
        placeholder="Zvol si svůj Icebreaker..." 
        options={[
          { value: "Jaké bylo tvoje absolutně nejhorší rande?", label: "Jaké bylo tvoje nejhorší rande?" },
          { value: "Polož mi otázku pěkně na tělo.", label: "Polož mi otázku na tělo." },
          { value: "Řekni mi svůj nejtrapnější zážitek.", label: "Tvůj nejtrapnější zážitek?" },
          { value: "Jaký je tvůj nejhloupější zlozvyk?", label: "Jaký je tvůj zlozvyk?" },
          { value: "Pizzu s ananasem: Ano, nebo Zločin?", label: "Pizza s ananasem?" }
        ]} 
      />
    </div>

    {/* Voice Prompts UI */}
    <div className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-950/20 border border-purple-500/30 hover:border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.1)] rounded-xl mt-8 space-y-4 transition-all">
      <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
        🎤 Hlasová odpověď (Voice Prompt)
      </h4>
      <p className="text-white/60 font-mono text-[10px] uppercase mb-4">Ukaž svou osobnost skrze hlas! Lidé slyší tvoji intonaci a humor ještě před prvním randem.</p>
      
      {!formData.voicePrompt ? (
        <div className="flex flex-col gap-3">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest">Zvol si otázku k odpovědi:</label>
          <CustomSelect 
            value="" 
            onChange={(val) => setFormData({ ...formData, voicePrompt: { question: val as string, url: 'mock_audio.mp3' } })} 
            placeholder="Vyber otázku pro hlasovku..." 
            options={[
              { value: "V čem jsi absolutní nerd?", label: "V čem jsi absolutní nerd?" },
              { value: "Řekni mi svůj nejlepší vtip (nebo ten nejhorší).", label: "Nejlepší vtip" },
              { value: "Na co jsi ve svém životě nejvíc pyšný/á?", label: "Na co jsi pyšný/á" },
              { value: "Zazpívej kousek svojí guilty pleasure písničky.", label: "Guilty pleasure song (Zpěv)" }
            ]} 
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 bg-black/40 p-4 rounded-lg border border-purple-500/30">
          <span className="text-purple-300 font-bold text-sm">Otázka: {formData.voicePrompt.question}</span>
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-mono text-xs uppercase tracking-widest">✅ Nahráno úspěšně</span>
            <button onClick={() => setFormData({ ...formData, voicePrompt: undefined })} className="text-red-400 hover:text-red-300 text-[10px] font-mono uppercase tracking-widest">
              Smazat nahrávku
            </button>
          </div>
        </div>
      )}
    </div>
    

    {/* RODINNÁ HISTORIE */}
    <div className="p-6 bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-amber-500 uppercase tracking-widest text-sm mb-4">Rodinná historie a Předci (Volitelné)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Máš v rodokmenu někoho zajímavého? Modrá krev, slavný vynálezce, nebo umělec? Můžeš se o to podělit.
      </p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Slavní nebo významní předci <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.famousAncestors || ""} 
          onChange={(v) => setFormData({...formData, famousAncestors: v as string})} 
          options={[
            {value:'none', label:'Ne, nebo o nich nevím'}, 
            {value:'one', label:'Ano, máme v rodině významného předka'}, 
            {value:'many', label:'Ano, je jich mnoho (zajímavý rodokmen)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Politické přesvědčení <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.values?.politics || ""} 
          onChange={(v) => setFormData({...formData, values: {...formData.values, politics: v}})} 
          options={[{value:'liberal', label:'Liberální'}, {value:'conservative', label:'Konzervativní'}, {value:'moderate', label:'Střed / Umírněné'}, {value:'apolitical', label:'Apolitický (Nezajímám se)'}]} 
          placeholder="Vyber..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Postoj k financím <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.values?.finance || ""} 
          onChange={(v) => setFormData({...formData, values: {...formData.values, finance: v}})} 
          options={[{value:'saver', label:'Šetřivý/á (Myslím na budoucnost)'}, {value:'spender', label:'Užívám si života teď a tady'}, {value:'investor', label:'Investor (Peníze musí dělat peníze)'}, {value:'balanced', label:'Zlatá střední cesta'}]} 
          placeholder="Vyber..." 
        />
      </div>
      <div className="md:col-span-2 mt-4">
        <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Budoucnost a Společný provoz</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Financování domácnosti <PointsBadge points={5} /></label>
            <CustomSelect 
              value={(formData as any).householdFinance || ""} 
              onChange={(v) => setFormData({...formData, householdFinance: v} as any)} 
              options={[
                {value:'50_50', label:'Všechno striktně na půl (50/50)'}, 
                {value:'proportional', label:'Kdo víc vydělá, ten víc platí (Poměrově)'}, 
                {value:'shared_account', label:'Společný účet (Moje peníze jsou tvoje peníze)'}, 
                {value:'traditional', label:'Tradiční model (Jeden hlavní živitel, většinou muž)'},
                {value:'independent', label:'Nezávislé účty (Každý si platí své)'}
              ]} 
              placeholder="Jak si to představuješ?" 
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Představa o důchodu <PointsBadge points={5} /></label>
            <CustomSelect 
              value={(formData as any).retirementVision || ""} 
              onChange={(v) => setFormData({...formData, retirementVision: v} as any)} 
              options={[
                {value:'early_retire', label:'Chci jít do důchodu co nejdřív a užívat si (FIRE)'}, 
                {value:'workaholic', label:'Budu pracovat dokud to půjde, práce mě baví'}, 
                {value:'passive_travel', label:'Pasivní příjem a cestování po světě'}, 
                {value:'cabin_nature', label:'Klidný a skromný život na chatě v přírodě'}
              ]} 
              placeholder="Jak vidíš stáří?" 
            />
          </div>
        </div>
      </div>
    </div>
    {/* PSYCHOLOGICKÉ TESTY */}
    <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-indigo-400 uppercase tracking-widest text-sm mb-4">Životní postoje a Testy</h4>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Životní spokojenost <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.lifeSatisfaction || ""} 
          onChange={(v) => setFormData({...formData, lifeSatisfaction: v as string})} 
          options={[
            {value:'happy_with_little', label:'Jsem spokojený s málem, nepotřebuji moc k radosti'}, 
            {value:'ambitious_always_more', label:'Mám se dobře, ale chci od života vždy víc'}, 
            {value:'currently_struggling', label:'Teď se trochu plácám, ale snažím se'},
            {value:'unhappy', label:'Jsem nespokojený se svým současným stavem'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Přístup k radám a pomoci <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.listenToAdvice || ""} 
          onChange={(v) => setFormData({...formData, listenToAdvice: v as string})} 
          options={[
            {value:'takes_advice', label:'Nechám si poradit od zkušenějších (jsem vděčný za pohled zvenčí)'}, 
            {value:'stubborn_mistakes', label:'Vymýšlím blbosti a pak na to doplácím (ale poučím se)'}, 
            {value:'my_way_only', label:'Jedu si tvrdě podle svého za všech okolností'},
            {value:'overthinker', label:'Zeptám se všech, ale nakonec jsem nerozhodný'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Inovace vs. Tradice <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.trendsVsTested || ""} 
          onChange={(v) => setFormData({...formData, trendsVsTested: v as string})} 
          options={[
            {value:'trend_setter', label:'Miluju nové trendy a inovace, zkouším vše první'}, 
            {value:'follower', label:'Naskočím, až když vidím, že to funguje ostatním'}, 
            {value:'traditionalist', label:'Zůstávám u osvědčených věcí, které fungovaly vždy'},
            {value:'skeptic', label:'Ke všemu modernímu a novému jsem silně skeptický'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vlastní názor vs. Naivita <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.naiveVsOpinionated || ""} 
          onChange={(v) => setFormData({...formData, naiveVsOpinionated: v as string})} 
          options={[
            {value:'naive_trusting', label:'Jsem občas dost naivní a věřím lidem i nesmyslům'}, 
            {value:'open_minded', label:'Mám otevřenou mysl, ale ověřuji si fakta'}, 
            {value:'strong_opinions', label:'Mám pevný názor a málokdo mě přesvědčí o opaku'},
            {value:'conspiracy', label:'Všechno je jinak a oficiálním zdrojům nevěřím (Alternativní pravda)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
    </div>
    {/* TYPY CITOVÉ VAZBY */}
    <div className="p-6 bg-gradient-to-br from-teal-900/20 to-transparent border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-teal-400 uppercase tracking-widest text-sm mb-4">Typ citové vazby (Attachment Style)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Znáš svůj styl citové vazby z psychologie? Pomůže nám to předejít toxickým vzorcům.
      </p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Můj styl citové vazby <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.attachmentStyle || ""} 
          onChange={(v) => setFormData({...formData, attachmentStyle: v as string})} 
          options={[
            {value:'secure', label:'Bezpečný (Secure)'}, 
            {value:'anxious', label:'Úzkostný (Anxious)'}, 
            {value:'avoidant', label:'Vyhýbavý (Avoidant)'},
            {value:'disorganized', label:'Úzkostně-vyhýbavý (Disorganized)'},
            {value:'unknown', label:'Nevím / Neřeším'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
    </div>
  </motion.div>
);

export const StepAssets = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-blue-400 font-heading font-black uppercase tracking-widest text-lg">Majetek a Bydlení</h4>
      <p className="text-white/50 text-xs font-mono">
        {lang === 'cs' ? 'Ukaž, jaké máš zázemí a jaké jsou tvé hmotné hodnoty.' : 'Show your background and material assets.'}
      </p>
    </div>

    <div className="p-6 bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl mt-8">
      <h4 className="font-heading font-black text-blue-400 uppercase tracking-widest text-sm mb-4">Životní situace (Bydlení)</h4>
      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak aktuálně bydlíš? <PointsBadge points={5} /></label>
      <CustomSelect 
        value={formData.housingStatus || ""} 
        onChange={(v) => setFormData({...formData, housingStatus: v as any})} 
        options={[
          {value:'own_paid', label:'Ve vlastním (splaceno)'}, 
          {value:'own_mortgage', label:'Ve vlastním (s hypotékou)'}, 
          {value:'rent_alone', label:'V nájmu (sám/sama)'}, 
          {value:'rent_roommates', label:'V nájmu (se spolubydlícími)'},
          {value:'parents', label:'U rodičů'},
          {value:'nomad', label:'Digitální nomád / Cestuji'},
          {value:'other', label:'Jiná situace'}
        ]} 
        placeholder="Vyber svou životní situaci..." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Mobilita (Auto) <PointsBadge points={5} /></label>
          <CustomSelect 
            value={formData.car || ""} 
            onChange={(v) => setFormData({...formData, car: v as string})} 
            options={[
              {value:'own', label:'Mám vlastní auto'},
              {value:'company', label:'Služební auto'},
              {value:'shared', label:'Sdílené / Půjčuji si'},
              {value:'public', label:'MHD / Vlaky'},
              {value:'none', label:'Auto nepotřebuji'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vlastnictví a Aktiva (Volitelné) <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.assets || []} 
            onChange={(v) => setFormData({...formData, assets: v})} 
            options={[
              {value:'business', label:'Vlastní firma / Podnik'},
              {value:'real_estate', label:'Nemovitosti na pronájem'},
              {value:'crypto', label:'Krypto portfolia'},
              {value:'digital_products', label:'Digitální produkty / SaaS'},
              {value:'stocks', label:'Akcie / Investice'},
              {value:'art', label:'Umění / Sběratelství'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const StepTimeline = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-purple-400 font-heading font-black uppercase tracking-widest text-lg">Časová osa (Minulost, Přítomnost, Budoucnost)</h4>
      <p className="text-white/50 text-xs font-mono">
        {lang === 'cs' ? 'Vyber štítky, které nejlépe vystihují tvůj životní posun.' : 'Select tags that best describe your life journey.'}
      </p>
    </div>

    <div className="p-6 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)] rounded-xl mt-8">
      <div className="space-y-6">
        <div>
          <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-4">Minulost</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Zkušenosti a vztahy z minulosti <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.timeline?.past || []} 
            onChange={(v) => setFormData({...formData, timeline: {...formData.timeline, past: v}})} 
            options={[
              {value: 'learned', label: 'Poučil/a jsem se z chyb'},
              {value: 'knows_what_wants', label: 'Už přesně vím, koho NECHCI'},
              {value: 'regrets', label: 'Mám věci, kterých lituji'},
              {value: 'wants_back', label: 'Někdy bych se nejradši vrátil/a v čase'},
              {value: 'let_go', label: 'Minulost jsem uzavřel/a a jdu dál'},
              {value: 'nostalgic', label: 'Rád/a vzpomínám na to dobré'},
              {value: 'healing', label: 'Stále se léčím z minulých zranění'},
              {value: 'proud', label: 'Jsem hrdý/á na to, co jsem zvládl/a'},
              {value: 'wild_past', label: 'Mám za sebou divoké období'},
              {value: 'long_relationship', label: 'Jsem po dlouhém vztahu'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="mt-6 border-t border-purple-500/20 pt-6">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Reflexe vlastních chyb (Uvědomuješ si je?) <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={(formData as any).pastMistakesReflection || ""} 
            onChange={(v) => setFormData({...formData, pastMistakesReflection: v} as any)} 
            options={[
              {value: 'full_ownership', label: 'Ano, vím přesně, kde jsem chyboval/a, a poučil/a jsem se'},
              {value: 'shared_blame', label: 'Částečně to byla moje chyba, ale dílem i těch druhých'},
              {value: 'their_fault', label: 'Většinou to byla chyba mých bývalých partnerů'},
              {value: 'no_regrets', label: 'Chyby si nepřipouštím, vše se stalo, jak mělo'}
            ]} 
            placeholder="Jak vnímáš své přešlapy?" 
          />
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-4">Přítomnost</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak aktuálně žiješ a kam ses posunul/a <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.timeline?.present || []} 
            onChange={(v) => setFormData({...formData, timeline: {...formData.timeline, present: v}})} 
            options={[
              {value: 'moved_forward', label: 'Hodně jsem se osobnostně posunul/a'},
              {value: 'living_best', label: 'Žiju svůj nejlepší život'},
              {value: 'finding_path', label: 'Stále trochu hledám svůj směr'},
              {value: 'working_hard', label: 'Tvrdě na sobě pracuji'},
              {value: 'enjoying_moment', label: 'Užívám si přítomný okamžik'},
              {value: 'stable', label: 'Mám konečně klid a stabilitu'},
              {value: 'career_focus', label: 'Soustředím se teď hlavně na práci'},
              {value: 'self_love', label: 'Učím se mít rád/a sám/sama sebe'},
              {value: 'ready_for_love', label: 'Jsem plně připraven/a na nový vztah'},
              {value: 'taking_it_easy', label: 'Nikam nespěchám, nechávám věci plynout'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-4">Budoucnost</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jaké máš plány do budoucna <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.timeline?.future || []} 
            onChange={(v) => setFormData({...formData, timeline: {...formData.timeline, future: v}})} 
            options={[
              {value: 'going_up', label: 'Mířím vysoko a chci růst'},
              {value: 'family', label: 'Chci založit rodinu a usadit se'},
              {value: 'surviving', label: 'Zatím spíš tak proplouvám'},
              {value: 'adventure', label: 'Chci cestovat a objevovat'},
              {value: 'career', label: 'Soustředím se na kariéru/podnikání'},
              {value: 'peace', label: 'Hlavně klidný a spokojený život'},
              {value: 'financial_freedom', label: 'Chci dosáhnout finanční nezávislosti'},
              {value: 'moving_abroad', label: 'Plánuji se odstěhovat do zahraničí'},
              {value: 'building_home', label: 'Chci si vybudovat vlastní bydlení'},
              {value: 'no_plans', label: 'Žiju ze dne na den, neplánuji'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const StepPsychology = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Psychologie a Mysl</h4>
      <p className="text-white/60 text-sm mt-2">Pojďme trochu hlouběji do tvého způsobu myšlení a vnímání světa.</p>
    </div>
    
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl mb-8 transition-all">
    </div>
  </motion.div>
);

export const Step4Lifestyle = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Zvyky a Lifestyle</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Ideální víkend <PointsBadge points={5} /></label>
        <CustomSelect isMulti={true} value={formData.sharedLife?.idealWeekend || []} onChange={(v) => setFormData({...formData, sharedLife: {...formData.sharedLife, idealWeekend: v}})} options={[{value:'home', label:'Doma ve dvou'}, {value:'trip', label:'Výlet do přírody'}, {value:'party', label:'Párty / Město'}, {value:'friends', label:'S přáteli / Rodinou'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Ideální dovolená <PointsBadge points={5} /></label>
        <CustomSelect isMulti={true} value={formData.sharedLife?.idealHoliday || []} onChange={(v) => setFormData({...formData, sharedLife: {...formData.sharedLife, idealHoliday: v}})} options={[{value:'beach', label:'Pláž a odpočinek'}, {value:'explore', label:'Poznávání měst'}, {value:'mountains', label:'Hory a sport'}, {value:'roadtrip', label:'Roadtrip / Dobrodružství'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vizuální Estetika <PointsBadge points={5} /></label>
        <CustomSelect isMulti={true} value={(formData as any).aesthetics || []} onChange={(v) => setFormData({...formData, aesthetics: v} as any)} options={[{value:'mountains', label:'Hory a skály'}, {value:'forests', label:'Stromy a lesy'}, {value:'stars', label:'Hvězdná obloha'}, {value:'ocean', label:'Oceán a voda'}, {value:'city', label:'Noční město / Neony'}, {value:'minimalism', label:'Čistý minimalismus'}]} placeholder="Co tě uklidňuje..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Preferovaná společnost <PointsBadge points={5} /></label>
        <CustomSelect isMulti={true} value={(formData as any).preferredSociety || []} onChange={(v) => setFormData({...formData, preferredSociety: v} as any)} options={[{value:'intellectuals', label:'Intelektuálové (Hluboké debaty)'}, {value:'high_society', label:'Smetánka (Vyšší společnost a luxus)'}, {value:'creatives', label:'Umělci a kreativci'}, {value:'chill_beer', label:'Normální pohodáři u piva'}, {value:'hustlers', label:'Podnikatelé a Hustle komunita'}, {value:'loner', label:'Nejradši jsem sám(a)'}]} placeholder="S kým se rád obklopuješ?" />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-xl mt-8">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Domácnost a Samostatnost</h4>
      <p className="text-[10px] font-mono text-white/40 mb-6">Jak jsi na tom s běžným provozem v domácnosti? (Důležité pro společné bydlení)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Úklid a Pořádek <PointsBadge points={5} /></label>
          <CustomSelect value={(formData as any).cleaningHabits || ""} onChange={(v) => setFormData({...formData, cleaningHabits: v} as any)} options={[
            {value:'perfect', label:'Mám rád/a dokonalý pořádek (vše má své místo)'}, 
            {value:'normal', label:'Běžný provoz (uklizeno, ale nehrotím to)'}, 
            {value:'messy', label:'Jsem spíš bordelář / tvůrčí chaos'}, 
            {value:'maid', label:'Mám na to paní na úklid'}
          ]} placeholder="Jaký jsi typ?" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vaření <PointsBadge points={5} /></label>
          <CustomSelect value={(formData as any).cookingSkills || ""} onChange={(v) => setFormData({...formData, cookingSkills: v} as any)} options={[
            {value:'masterchef', label:'Uvařím cokoliv, vařím rád/a'}, 
            {value:'basics', label:'Zvládnu základy, hlady neumřu'}, 
            {value:'takeout', label:'Jím převážně venku nebo z krabiček'}, 
            {value:'partner', label:'Očekávám, že vaří partner'}
          ]} placeholder="Tvůj vztah k plotně?" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Domácí práce (Praní, Žehlení) <PointsBadge points={5} /></label>
          <CustomSelect value={(formData as any).householdChores || ""} onChange={(v) => setFormData({...formData, householdChores: v} as any)} options={[
            {value:'independent', label:'Naprosto samostatný/á (vyperu, vyžehlím)'}, 
            {value:'basic', label:'Běžná údržba (pračku zapnout umím)'}, 
            {value:'hopeless', label:'Jsem v tomhle trochu nepoužitelný/á'}, 
            {value:'fair_share', label:'Dělíme se rovným dílem'}
          ]} placeholder="Pereš a žehlíš?" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kutilství a Opravy <PointsBadge points={5} /></label>
          <CustomSelect value={(formData as any).diySkills || ""} onChange={(v) => setFormData({...formData, diySkills: v} as any)} options={[
            {value:'handyman', label:'Opravím úplně všechno (Hodinový manžel)'}, 
            {value:'ikea', label:'Složím nábytek z IKEA, vyměním žárovku'}, 
            {value:'clueless', label:'Nezatluču ani hřebík, volám odborníky'}
          ]} placeholder="Jsi kutil?" />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-lg rounded-xl mt-8">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Aktuální a Budoucí Bydlení</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kde a jak teď bydlíš? <PointsBadge points={5} /></label>
          <CustomSelect 
            value={(formData as any).currentHousing || ""} 
            onChange={(v) => setFormData({...formData, currentHousing: v} as any)} 
            options={[
              {value:'own', label:'Bydlím sám/sama ve vlastním'}, 
              {value:'rent', label:'Jsem v nájmu (sám/sama nebo s partnerem)'}, 
              {value:'parents', label:'Bydlím u rodičů / rodiny'}, 
              {value:'roommates', label:'Spolubydlení s přáteli'},
              {value:'homeless', label:'Nemám teď kde bydlet / Hledám'}
            ]} 
            placeholder="Současná situace..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Plány do budoucna <PointsBadge points={5} /></label>
          <CustomSelect 
            value={(formData as any).futureHousing || ""} 
            onChange={(v) => setFormData({...formData, futureHousing: v} as any)} 
            options={[
              {value:'move_in', label:'Čekám, ke komu se nastěhuju'}, 
              {value:'build_together', label:'Společně něco vybudujeme / Koupíme dům'}, 
              {value:'buy_apartment', label:'Koupíme společně byt'}, 
              {value:'partner_moves_in', label:'Chci zůstat tam kde jsem, partner se nastěhuje ke mně'},
              {value:'open', label:'Jsem otevřený/á všem možnostem'}
            ]} 
            placeholder="Jak to vidíš dál?" 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Postoj k bydlení (Nájem / Vlastní) <PointsBadge points={5} /></label>
          <CustomSelect 
            value={(formData as any).housingAttitude || ""} 
            onChange={(v) => setFormData({...formData, housingAttitude: v} as any)} 
            options={[
              {value:'own_only', label:'Nájem odmítám, chci jen vlastní'}, 
              {value:'too_expensive', label:'Vlastní je teď moc drahé, musíme to zvládnout spolu v nájmu'}, 
              {value:'does_not_matter', label:'Na bydlení mi nezáleží, hlavně že jsme spolu'}, 
              {value:'luxury', label:'Priorita je luxus a komfort, ať to stojí co to stojí'}
            ]} 
            placeholder="Tvůj pohled..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/5 to-transparent border border-mafia-gold/20 rounded-xl mt-8">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Moje Rituály (Zvyky)</h4>
      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vyber věci, které děláš pravidelně <PointsBadge points={5} /></label>
      <CustomSelect 
        isMulti={true} 
        value={formData.rituals || []} 
        onChange={(v) => setFormData({...formData, rituals: v})} 
        options={[
          {value:'pizza_friday', label:'🍕 Páteční pizza'}, 
          {value:'morning_run', label:'🏃 Ranní běh'}, 
          {value:'sunday_trip', label:'🚗 Nedělní výlet'}, 
          {value:'sauna', label:'🧖‍♀️ Saunování'},
          {value:'gym', label:'💪 Pravidelné fitko'},
          {value:'reading', label:'📚 Čtení před spaním'},
          {value:'meditation', label:'🧘 Meditace / Jóga'},
          {value:'pub', label:'🍻 Pravidelné pivo s přáteli'},
          {value:'coffee', label:'☕ Ranní káva v klidu'}
        ]} 
        placeholder="Vyber své rituály..." 
      />
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Sport a Aktivity</h4>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Aktivní sporty (Co dělám) <PointsBadge points={5} /></label>
        <CustomSelect 
          isMulti={true}
          value={formData.sportsPlayed || []} 
          onChange={(v) => setFormData({...formData, sportsPlayed: v})} 
          options={[
            {value: 'gym', label: 'Fitness / Gym'},
            {value: 'running', label: 'Běh'},
            {value: 'cycling', label: 'Cyklistika'},
            {value: 'swimming', label: 'Plavání'},
            {value: 'yoga', label: 'Jóga / Pilates'},
            {value: 'martial_arts', label: 'Bojové sporty'},
            {value: 'team_sports', label: 'Týmové sporty (fotbal, basket...)'},
            {value: 'extreme', label: 'Extrémní sporty'},
            {value: 'winter', label: 'Zimní sporty (lyže, snb)'},
            {value: 'none', label: 'Nesportuji'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Pasivní sporty (Na co rád/a koukám) <PointsBadge points={5} /></label>
        <CustomSelect 
          isMulti={true}
          value={formData.sportsWatching || []} 
          onChange={(v) => setFormData({...formData, sportsWatching: v})} 
          options={[
            {value: 'mma', label: 'MMA / Oktagon'},
            {value: 'football', label: 'Fotbal'},
            {value: 'hockey', label: 'Hokej'},
            {value: 'f1', label: 'F1 / Motorsport'},
            {value: 'tennis', label: 'Tenis'},
            {value: 'esports', label: 'E-Sports'},
            {value: 'none', label: 'Nesleduju sport'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-indigo-400 uppercase tracking-widest text-sm mb-4">Herní doupě (Volitelné)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Co hraješ za hry? <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true} 
            value={formData.gamingPrefs?.games || []} 
            onChange={(v) => setFormData({...formData, gamingPrefs: {...formData.gamingPrefs, games: v}})} 
            options={[
              {value:'lol', label:'League of Legends'}, 
              {value:'csgo', label:'CS:GO / Valorant'}, 
              {value:'wow', label:'WoW / MMO'}, 
              {value:'minecraft', label:'Minecraft'},
              {value:'cod', label:'Call of Duty / Warzone'},
              {value:'rpg', label:'Singleplayer RPGs'},
              {value:'sim', label:'Simulátory (Sims, Farm...)'},
              {value:'board', label:'Deskovky / DnD'},
              {value:'mobile', label:'Mobilní hry'}
            ]} 
            placeholder="Vyber hry..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Herní Nickname (IGN) <PointsBadge points={5} /></label>
          <input 
            type="text" 
            value={formData.gamingPrefs?.nickname || ''} 
            onChange={(e) => setFormData({...formData, gamingPrefs: {...formData.gamingPrefs, nickname: e.target.value}})} 
            className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-indigo-400 rounded-md" 
            placeholder="Např. Faker#EUNE" 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Bydlení</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kde chci žít? <PointsBadge points={5} /></label>
          <CustomSelect value={formData.housing?.locationPref || ""} onChange={(v) => setFormData({...formData, housing: {...formData.housing, locationPref: v}})} options={[{value:'city', label:'Velké město'}, {value:'suburb', label:'Okraj města'}, {value:'village', label:'Vesnice / Samota'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Ochota se stěhovat za partnerem? <PointsBadge points={5} /></label>
          <CustomSelect value={formData.housing?.moveForPartner || ""} onChange={(v) => setFormData({...formData, housing: {...formData.housing, moveForPartner: v}})} options={[{value:'yes', label:'Ano, klidně hned'}, {value:'maybe', label:'Záleží na situaci'}, {value:'no', label:'Ne, chci zůstat kde jsem'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)] rounded-xl mt-8 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-heading font-black text-green-400 uppercase tracking-widest text-sm mb-2">Skupinové rande (Volitelné)</h4>
          <p className="text-white/50 text-[10px] font-mono leading-relaxed">Pozvi kamarády přes jejich registrační e-mail a vytvořte skupinu. Aplikace vás bude spojovat s odpovídajícím počtem lidí na Double Date, Triple Date atd.</p>
        </div>
        <div className="bg-black/50 border border-green-500/30 p-2 rounded-lg text-right min-w-[140px] shrink-0">
          <span className="block text-[8px] text-green-400 uppercase font-mono tracking-widest mb-1">🔥 Aktuální trend</span>
          <span className="block text-[10px] text-white font-bold">78% Single Date</span>
          <span className="block text-[10px] text-white/70">22% Double/Triple Date</span>
        </div>
      </div>

      <div className="flex gap-2">
         <input type="email" id="inviteEmail" className="flex-1 bg-black/40 border border-white/10 py-2 px-3 text-white text-sm focus:border-green-400 rounded-md" placeholder="Zadej e-mail kamaráda..." />
         <button type="button" onClick={() => {
            const el = document.getElementById('inviteEmail') as HTMLInputElement;
            if(el && el.value) {
              const current = formData.linkedAccounts || [];
              setFormData({...formData, linkedAccounts: [...current, {email: el.value, status: 'pending'}]});
              el.value = '';
            }
         }} className="px-4 py-2 bg-green-900/50 hover:bg-green-700/50 text-green-400 border border-green-500/30 rounded-md text-xs font-mono uppercase tracking-widest transition-colors">Pozvat</button>
      </div>

      {formData.linkedAccounts && formData.linkedAccounts.length > 0 && (
        <div className="space-y-2 mt-4">
          <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Přizvaní členové</label>
          {formData.linkedAccounts.map((acc, idx) => (
             <div key={idx} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded border border-white/5">
                <span className="text-white/80 text-xs font-mono">{acc.email}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${acc.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                   {acc.status === 'accepted' ? 'Přijato' : 'Čeká'}
                </span>
             </div>
          ))}
        </div>
      )}
    </div>

    {/* VZTAH K SÍTÍM A ZLOZVYKY */}
    <div className="p-6 bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Digitální život a Guilty Pleasures</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vztah k sítím (Screen Time) <PointsBadge points={5} /></label>
          <CustomSelect 
            value={formData.digitalLife || ""} 
            onChange={(v) => setFormData({...formData, digitalLife: v as string})} 
            options={[
              {value:'chronically_online', label:'Jsem chronicky online (Doomscrolling)'}, 
              {value:'messaging_only', label:'Sítě mám jen na zprávy s přáteli'}, 
              {value:'detox', label:'Snažím se o digitální detox'},
              {value:'offline', label:'Žiju v realitě, mobil mám na volání'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Zlozvyky a Guilty Pleasures <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true} 
            value={formData.guiltyPleasures || []} 
            onChange={(v) => setFormData({...formData, guiltyPleasures: v})} 
            options={[
              {value:'interrupts', label:'Skáču lidem do řeči'}, 
              {value:'eating_in_bed', label:'Jím v posteli'}, 
              {value:'late', label:'Často chodím pozdě'},
              {value:'spending', label:'Zbytečně moc utrácím'},
              {value:'ghosting_friends', label:'Neodepisuju hned (ani přátelům)'},
              {value:'swearing', label:'Když se naštvu, mluvím sprostě'},
              {value:'judging_drivers', label:'Soudím lidi podle toho, jak řídí'}
            ]} 
            placeholder="Vyber (jen pro zasmání)..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const StepFamilyBackground = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-pink-400 font-heading font-black uppercase tracking-widest text-lg">Rodina a Minulost</h4>
      <p className="text-white/50 text-xs font-mono">
        {lang === 'cs' ? 'Z čeho jsi vzešel/vzešla a jaké je tvé zázemí.' : 'Your family background and roots.'}
      </p>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-lg rounded-xl mt-8">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Původ a Zázemí</h4>
      <div className="space-y-4">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest flex items-center">Z jakých poměrů pocházíš? <PointsBadge points={10} /></label>
        <CustomSelect 
          value={(formData as any).familyBackground || ""} 
          onChange={(v) => setFormData({...formData, familyBackground: v} as any)} 
          options={[
            {value: 'wealthy', label: 'Bohatá rodina / Zabezpečené zázemí'},
            {value: 'middle_class', label: 'Střední třída (nic nám nechybělo)'},
            {value: 'poor', label: 'Chudé poměry / Těžké začátky'},
            {value: 'lost_wealth', label: 'Měli jsme peníze, ale o vše jsme přišli (dluhy, chyby)'},
            {value: 'started_poor_now_wealthy', label: 'Z nuly nahoru (začali jsme v chudobě, teď jsme zabezpečení)'},
            {value: 'foster_care', label: 'Dětský domov / Pěstounská péče'}
          ]} 
          placeholder="Vyber své rodinné zázemí..." 
        />
      </div>
    </div>
  </motion.div>
);

export const StepParenting = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-pink-400 font-heading font-black uppercase tracking-widest text-lg">Děti a Výchova</h4>
      <p className="text-white/50 text-xs font-mono">
        {lang === 'cs' ? 'Tvé plány s rodinou a přístup k výchově dětí.' : 'Your plans for family and approach to parenting.'}
      </p>
    </div>

    <div className="p-6 bg-gradient-to-br from-pink-900/10 to-transparent border border-pink-500/20 shadow-[0_0_20px_rgba(244,114,182,0.05)] rounded-xl mt-8">
      <div className="space-y-6">
        <div>
          <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Představa o dětech</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kolik dětí, kdy a jak? <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.parenting?.vision || []} 
            onChange={(v) => setFormData({...formData, parenting: {...formData.parenting, vision: v}})} 
            options={[
              {value: 'want_kids', label: 'Určitě chci děti'},
              {value: 'dont_want_kids', label: 'Děti nechci'},
              {value: 'already_have', label: 'Už děti mám (a chci/nechci další)'},
              {value: 'adoption', label: 'Jsem otevřený/á adopci'},
              {value: 'large_family', label: 'Chci velkou rodinu (3+ dětí)'},
              {value: 'not_sure', label: 'Zatím si nejsem jistý/á'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Výchova (Upbringing)</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jaký styl výchovy je ti nejbližší? <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.parenting?.upbringing || []} 
            onChange={(v) => setFormData({...formData, parenting: {...formData.parenting, upbringing: v}})} 
            options={[
              {value: 'respectful', label: 'Respektující výchova (dohody, ne tresty)'},
              {value: 'authoritative', label: 'Laskavá ale pevná (jasná pravidla)'},
              {value: 'traditional', label: 'Tradiční výchova (disciplína a řád)'},
              {value: 'montessori', label: 'Montessori / Waldorf přístup'},
              {value: 'free', label: 'Volná výchova (děti objevují samy)'},
              {value: 'active', label: 'Velmi aktivní (kroužky, sport, neustálý rozvoj)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Vztah po dětech</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak by měl vypadat vztah partnerů s dětmi? <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.parenting?.relationshipPostKids || []} 
            onChange={(v) => setFormData({...formData, parenting: {...formData.parenting, relationshipPostKids: v}})} 
            options={[
              {value: 'couple_first', label: 'Partnerský vztah je stále na 1. místě (neopustit se)'},
              {value: 'kids_first', label: 'Děti jsou absolutní středobod vesmíru'},
              {value: 'teamwork', label: 'Jsme tým (rovnoměrné dělení povinností)'},
              {value: 'traditional_roles', label: 'Tradiční dělení rolí (matka pečuje, otec zajišťuje)'},
              {value: 'date_nights', label: 'Pravidelné Date Nights (hlídání dětí nutností)'},
              {value: 'village', label: 'Výchova "vesnicí" (častá pomoc prarodičů/chův)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Vrozené instinkty</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvůj přístup jako průvodce dítětě <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.parenting?.instinct || []} 
            onChange={(v) => setFormData({...formData, parenting: {...formData.parenting, instinct: v}})} 
            options={[
              {value: 'protector', label: 'Ochránce (Zajistím jim bezpečí před vším)'},
              {value: 'guide', label: 'Průvodce (Ukážu směr, ale nechám je padnout)'},
              {value: 'friend', label: 'Kamarád (Chci s nimi mít hlavně skvělý vztah)'},
              {value: 'mentor', label: 'Mentor (Připravím je tvrdě na reálný život)'},
              {value: 'anxious', label: 'Úzkostlivý (Mám neustále strach, že se něco stane)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-pink-400 uppercase tracking-widest text-sm mb-4">Vztah k Autoritám</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jaký je tvůj vztah ke starším lidem a pravidlům? <PointsBadge points={5} /></label>
          <CustomSelect 
            value={formData.parenting?.respectForElders || ""} 
            onChange={(v) => setFormData({...formData, parenting: {...formData.parenting, respectForElders: v}})} 
            options={[
              {value: 'traditional', label: 'Hluboká úcta ke starším a dodržování pravidel'},
              {value: 'mutual', label: 'Respekt si musí zasloužit každý bez ohledu na věk'},
              {value: 'rebel', label: 'Rebel (Rád bořím stará dogmata a pravidla)'},
              {value: 'indifferent', label: 'Moc to neřeším, jedu si podle sebe'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-indigo-900/10 to-transparent border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-xl mt-8">
      <div className="space-y-6">
        <div>
          <h4 className="font-heading font-black text-indigo-400 uppercase tracking-widest text-sm mb-4">Moje kořeny a zázemí</h4>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Z jakého prostředí pocházíš? <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.childhoodEnvironment || ""} 
            onChange={(v) => setFormData({...formData, childhoodEnvironment: v})} 
            options={[
              {value: 'harmonious', label: 'Harmonická a úplná rodina'},
              {value: 'divorced_okay', label: 'Rozvedení rodiče (ale v pohodě)'},
              {value: 'divorced_bad', label: 'Rozvedení rodiče (toxické/ošklivé)'},
              {value: 'strict', label: 'Velmi přísná výchova (tlak na výkon/poslušnost)'},
              {value: 'cold', label: 'Chladné prostředí (chyběla láska/pozornost)'},
              {value: 'orphanage', label: 'Dětský domov / Pěstounská péče'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Sourozenci <PointsBadge points={5} /></label>
          <CustomSelect 
            value={formData.siblings || ""} 
            onChange={(v) => setFormData({...formData, siblings: v})} 
            options={[
              {value: 'only_child', label: 'Jedináček'},
              {value: 'one_or_two', label: '1-2 sourozenci'},
              {value: 'large_family', label: 'Velká rodina (3 a více)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Staráš se o někoho? (Caregiving) <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.caregiving || ""} 
            onChange={(v) => setFormData({...formData, caregiving: v})} 
            options={[
              {value: 'none', label: 'Ne, starám se primárně o sebe'},
              {value: 'kids', label: 'Ano, o své děti'},
              {value: 'parents', label: 'Ano, o nemocné/stárnoucí rodiče či prarodiče'},
              {value: 'sibling', label: 'Ano, o sourozence'},
              {value: 'professional', label: 'Pomáhám profesionálně (sociální sféra, pečovatel)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <h4 className="font-heading font-black text-red-400 uppercase tracking-widest text-sm mb-4">Traumata a Těžké zkoušky</h4>
          <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Sdílení těžkých okamžiků pomáhá algoritmu pochopit tvou vnitřní sílu. Může tě to propojit s někým, kdo si prošel tím samým a pochopí tě beze slov.</p>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Čím sis v minulosti prošel/prošla? (Volitelné) <PointsBadge points={15} /></label>
          <CustomSelect 
            isMulti={true}
            value={formData.childhoodTraumas || []} 
            onChange={(v) => setFormData({...formData, childhoodTraumas: v})} 
            options={[
              {value: 'none', label: 'Ničím zásadním, měl/a jsem klidný život'},
              {value: 'bullying', label: 'Šikana v dětství / mládí'},
              {value: 'poverty', label: 'Velká chudoba / Finanční nouze rodiny'},
              {value: 'loss', label: 'Předčasná ztráta blízkého člověka'},
              {value: 'toxic_parents', label: 'Toxičtí/Narcističtí rodiče'},
              {value: 'illness', label: 'Vážná nemoc (vlastní nebo v rodině)'},
              {value: 'abuse', label: 'Fyzické nebo psychické zneužívání'},
              {value: 'emotional_exhaustion', label: 'Těžké emoční vyčerpání / Syndrom vyhoření'},
              {value: 'physical_exhaustion', label: 'Extrémní fyzické vyčerpání'},
              {value: 'depression', label: 'Klinická deprese / Těžké depresivní epizody'},
              {value: 'anxiety', label: 'Úzkostné poruchy / Panické ataky'},
              {value: 'ptsd', label: 'Posttraumatická stresová porucha (PTSD)'},
              {value: 'paranoia', label: 'Paranoia / Ztráta důvěry ve svět'},
              {value: 'eating_disorder', label: 'Poruchy příjmu potravy (Anorexie, Bulimie)'},
              {value: 'bipolar', label: 'Bipolární porucha'},
              {value: 'ocd', label: 'Obsedantně-kompulzivní porucha (OCD)'},
              {value: 'insomnia', label: 'Chronická nespavost / Spánková deprivace'},
              {value: 'social_phobia', label: 'Sociální fobie / Chorobný strach z lidí'},
              {value: 'addiction', label: 'Závislosti (a úspěšný boj s nimi)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const Step5CommLove = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Komunikace a Minulost</h4>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-lg rounded-xl mb-8">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Současný stav a Minulost</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Rodinný stav / Aktuální situace <PointsBadge points={5} /></label>
          <CustomSelect 
            value={(formData as any).relationshipStatus || ""} 
            onChange={(v) => setFormData({...formData, relationshipStatus: v} as any)} 
            options={[
              {value:'single_long', label:'Jsem už dlouho sám/sama (Single)'}, 
              {value:'fresh_breakup', label:'Čerstvě po rozchodu'}, 
              {value:'divorced', label:'Rozvedený/á'}, 
              {value:'widowed', label:'Vdovec / Vdova'},
              {value:'dating', label:'Single, ale občas s někým randím'}
            ]} 
            placeholder="Tvůj aktuální stav?" 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kdy proběhl poslední rozchod? <PointsBadge points={5} /></label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/20 rounded-md p-2 text-sm text-white focus:border-mafia-gold/50 outline-none" 
              placeholder="Měsíc a rok (např. 05/2024)"
              value={(formData as any).lastBreakupDate || ""}
              onChange={(e) => setFormData({...formData, lastBreakupDate: e.target.value} as any)}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Nejdelší vztah (Jak dlouho trval?) <PointsBadge points={5} /></label>
          <CustomSelect 
            value={(formData as any).longestRelationship || ""} 
            onChange={(v) => setFormData({...formData, longestRelationship: v} as any)} 
            options={[
              {value:'less_year', label:'Méně než rok'}, 
              {value:'1_3_years', label:'1 - 3 roky'}, 
              {value:'3_7_years', label:'3 - 7 let'}, 
              {value:'7_15_years', label:'7 - 15 let'},
              {value:'more_15_years', label:'Více než 15 let'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>
    <div className="space-y-6">
      <TraitSelector label="Důležitost každodenního psaní" value={formData.communication?.dailyTexting as any} onChange={(v) => setFormData({...formData, communication: {...formData.communication, dailyTexting: v as any}})} />
      <TraitSelector label="Otevřenost o pocitech" value={formData.communication?.openFeelings as any} onChange={(v) => setFormData({...formData, communication: {...formData.communication, openFeelings: v as any}})} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak často jsi na telefonu? <PointsBadge points={5} /></label>
          <CustomSelect value={formData.communication?.contactFreq || ""} onChange={(v) => setFormData({...formData, communication: {...formData.communication, contactFreq: v}})} options={[{value:'constant', label:'Píšu hned a pořád'}, {value:'regular', label:'Pravidelně během dne'}, {value:'slow', label:'Odepisuji klidně až za pár hodin / dní'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Volání vs. Psaní <PointsBadge points={5} /></label>
          <CustomSelect value={formData.communication?.callsVsTexts || ""} onChange={(v) => setFormData({...formData, communication: {...formData.communication, callsVsTexts: v}})} options={[{value:'calls', label:'Radši hned volám'}, {value:'texts', label:'Radši píšu (volání mě stresuje)'}, {value:'both', label:'Obojí je fajn'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-red-900/30 to-red-950/20 border border-red-500/30 hover:border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.1)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-red-500 uppercase tracking-widest text-sm mb-4">Když se pohádáme...</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Já většinou: <PointsBadge points={5} /></label>
          <CustomSelect value={formData.conflicts?.myReaction || ""} onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, myReaction: v}})} options={[{value:'immediate', label:'Chci problém okamžitě řešit'}, {value:'space', label:'Potřebuji čas a klid'}, {value:'compromise', label:'Hledám kompromis'}, {value:'emotional', label:'Jsem hodně emotivní'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Od partnera potřebuji: <PointsBadge points={5} /></label>
          <CustomSelect isMulti={true} value={formData.conflicts?.iNeedFromPartner || []} onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, iNeedFromPartner: v}})} options={[{value:'space', label:'Prostor'}, {value:'communication', label:'Komunikaci'}, {value:'apology', label:'Omluvu a uznání chyby'}, {value:'hugs', label:'Fyzickou blízkost'}]} placeholder="Vyber..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Umění se omluvit <PointsBadge points={5} /></label>
          <CustomSelect value={formData.conflicts?.apologyCapacity || ""} onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, apologyCapacity: v}})} options={[{value:'easy', label:'Umím uznat chybu hned'}, {value:'hard', label:'Je to pro mě hrozně těžké'}, {value:'never', label:'Zásadně se neomlouvám'}, {value:'doesnt_matter', label:'Neřeším, je mi to jedno'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvrdohlavost (Názory) <PointsBadge points={5} /></label>
          <CustomSelect value={formData.conflicts?.stubbornness || ""} onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, stubbornness: v}})} options={[{value:'stubborn', label:'Tvrdohlavý/á (Stojím si za svým za každou cenu)'}, {value:'open', label:'Otevřený/á diskuzi (Rád změním názor na základě faktů)'}, {value:'adaptive', label:'Přizpůsobím se (Nerada se hádám)'}, {value:'doesnt_matter', label:'Je mi to úplně jedno'}]} placeholder="Vyber..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Zastání partnera (Před ostatními) <PointsBadge points={5} /></label>
          <CustomSelect value={formData.conflicts?.partnerSupport || ""} onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, partnerSupport: v}})} options={[{value:'unconditional', label:'Stojím za ním vždycky (I když nemá pravdu, vyříkáme si to až v soukromí)'}, {value:'objective', label:'Jsem objektivní (Pokud plácá nesmysly, nepodpořím ho)'}, {value:'doesnt_matter', label:'Nevím / Je mi to jedno'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>


    {/* JAZYKY LÁSKY A DEALBREAKERS */}
    <div className="p-6 bg-gradient-to-br from-fuchsia-900/20 to-transparent border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-fuchsia-400 uppercase tracking-widest text-sm mb-4">Jazyky lásky a Dealbreakers</h4>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Pět jazyků lásky (Co je pro tebe nejdůležitější?) <PointsBadge points={5} /></label>
          <CustomSelect 
            isMulti={true} 
            value={formData.loveLanguages || []} 
            onChange={(v) => setFormData({...formData, loveLanguages: v})} 
            options={[
              {value:'words', label:'Slova ujištění (Chvála, vyznání)'}, 
              {value:'time', label:'Pozornost (Kvalitně strávený čas)'}, 
              {value:'gifts', label:'Přijímání dárků (Drobné pozornosti)'},
              {value:'acts', label:'Skutky služby (Pomoc s úkoly)'},
              {value:'touch', label:'Fyzický kontakt (Doteky, objímání)'}
            ]} 
            placeholder="Vyber max 2 hlavní..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center text-red-400">Ultimátní Dealbreakers (Přes co vlak nejede) <PointsBadge points={15} /></label>
          <CustomSelect 
            isMulti={true} 
            value={formData.dealbreakers || []} 
            onChange={(v) => setFormData({...formData, dealbreakers: v})} 
            options={[
              {value:'lying', label:'Lhaní a manipulace'}, 
              {value:'hygiene', label:'Špatná hygiena'}, 
              {value:'addiction', label:'Závislosti (Alkohol, Sítě, Hry)'},
              {value:'workaholic', label:'Workoholismus'},
              {value:'passive_agressive', label:'Pasivní agresivita'},
              {value:'no_apology', label:'Neschopnost se omluvit'}
            ]} 
            placeholder="Vyber své red flags..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const Step6FutureKids = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Budoucnost a Děti</h4>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Můj rodinný stav <PointsBadge points={5} /></label>
        <CustomSelect value={formData.familyStatus || ""} onChange={(v) => setFormData({...formData, familyStatus: v as any})} options={[{value:'single', label:'Svobodný/á'}, {value:'taken', label:'Zadaný/á (Ve vztahu)'}, {value:'married', label:'V manželství'}, {value:'divorced', label:'Rozvedený/á'}, {value:'widowed', label:'Vdovec / Vdova'}, {value:'complicated', label:'Je to složité'}]} placeholder="Vyber..." />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Moje děti a partnerství</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Mám děti? <PointsBadge points={5} /></label>
          <CustomSelect value={formData.hasKids || ""} onChange={(v) => setFormData({...formData, hasKids: v as any})} options={[{value:'no', label:'Nemám děti'}, {value:'yes', label:'Mám děti'}]} placeholder="Vyber..." />
        </div>
        
        {formData.hasKids === 'yes' && (
          <div>
            <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kolik mám dětí? <PointsBadge points={5} /></label>
            <input type="number" min="1" max="10" value={formData.kidsCount || ''} onChange={(e) => setFormData({...formData, kidsCount: parseInt(e.target.value) || 0})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold rounded-md" placeholder="Zadej počet..." />
          </div>
        )}
      </div>

      <PreferenceSelector tooltipText="Tohle je kritické. Pokud se neshodnete na dětech, dříve či později narazíte." label="Chceš děti (nebo další) do budoucna?" value={formData.prefKids as any} onChange={(v) => setFormData({...formData, prefKids: v as any})} options={[{value:'yes', label:'Rozhodně ano'}, {value:'maybe', label:'Možná / Zatím nevím'}, {value:'no', label:'Nechci (další) děti'}]} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vadí ti partner s dětmi? <PointsBadge points={5} /></label>
        <CustomSelect value={formData.kidsDetailed?.partnerWithKids || ""} onChange={(v) => setFormData({...formData, kidsDetailed: {...formData.kidsDetailed, partnerWithKids: v}})} options={[{value:'no', label:'Nevadí'}, {value:'yes', label:'Ano, chci bezdětného'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Očekávaný vztah <PointsBadge points={5} /></label>
        <CustomSelect value={formData.futurePrefs?.lookingFor || ""} onChange={(v) => setFormData({...formData, futurePrefs: {...formData.futurePrefs, lookingFor: v}})} options={[{value:'marriage', label:'Vážný vztah a svatba'}, {value:'serious', label:'Vážný vztah'}, {value:'fun', label:'Nezávazně'}]} placeholder="Vyber..." />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-red-400 uppercase tracking-widest text-sm mb-4">Minulost a Body Count</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Počet minulých partnerů může být pro někoho důležitý, pro jiného red flag. Tato informace je defaultně skrytá. Odkryje se POUZE TEHDY, pokud ty i tvůj protějšek máte oba nastaveno "Vzájemné odhalení" a dojde k Matchi.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Počet minulých partnerů (Body Count) <PointsBadge points={15} /></label>
          <input type="number" min="0" value={formData.pastPartnersCount !== undefined ? formData.pastPartnersCount : ''} onChange={(e) => setFormData({...formData, pastPartnersCount: parseInt(e.target.value) || 0})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-red-400 rounded-md" placeholder="Zadej číslo..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Odhalit po Matchi?
            <InfoTooltip text="Mutual = ukáže se v Match reportu jen v případě, že to druhý povolil také." />
          </label>
          <CustomSelect value={formData.pastPartnersReveal || "hidden"} onChange={(v) => setFormData({...formData, pastPartnersReveal: v as any})} options={[{value:'hidden', label:'Skryté (Nechci sdílet)'}, {value:'mutual', label:'Mutual (Sdílet při oboustranné shodě)'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-4">Experimenty a Speciální preference (18+)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Pokud hledáš něco specifičtějšího, zaškrtni to zde. Algoritmus tě pak propojí primárně s lidmi, kteří hledají to samé, a tvůj profil se nebude zobrazovat uživatelům hledajícím běžný vztah.</p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Speciální kategorie (Volitelné) <PointsBadge points={5} /></label>
        <CustomSelect 
          isMulti={true} 
          value={formData.nsfwCategories || []} 
          onChange={(v) => setFormData({...formData, nsfwCategories: v})} 
          options={[
            {value:'swingers', label:'Swinging / Výměna partnerů'}, 
            {value:'open_relationship', label:'Otevřený vztah'}, 
            {value:'threesome', label:'Trojka'}, 
            {value:'bdsm', label:'BDSM'},
            {value:'fetish', label:'Specifický fetiš'},
            {value:'fwb', label:'Friends with Benefits (FWB)'},
            {value:'sugar', label:'Hledám sponzoring / Sugar dating'}
          ]} 
          placeholder="Vyber (pokud něco z toho hledáš)..." 
        />
      </div>
    </div>
  </motion.div>
);

export const Step7ValuesMoney = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Hodnoty a Přesvědčení</h4>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-lg rounded-xl mb-8">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Pohled na svět</h4>
      <div className="space-y-4">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest flex items-center">Jak vnímáš současný svět a společnost? <PointsBadge points={10} /></label>
        <CustomSelect 
          value={(formData as any).worldview || ""} 
          onChange={(v) => setFormData({...formData, worldview: v} as any)} 
          options={[
            {value: 'optimist', label: 'Dobře, svět se vyvíjí správným směrem, bude líp'},
            {value: 'used_to_be_better', label: 'Bylo líp, teď to jde všechno z kopce'},
            {value: 'pessimist', label: 'Aktuálně špatně, řítíme se do záhuby'},
            {value: 'dont_care', label: 'Nezajímám se o to, žiju si svůj život'},
            {value: 'realist', label: 'Realisticky - každá doba má své problémy i krásy'},
            {value: 'conspiracy', label: 'Něco je špatně, nevěřím oficiálním informacím'},
            {value: 'spirit_shift', label: 'Procházíme velkou duchovní a společenskou transformací'}
          ]} 
          placeholder="Vyber svůj postoj..." 
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Náboženství a Víra <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.values?.religion || ""} 
          onChange={(v) => setFormData({...formData, values: {...formData.values, religion: v}})} 
          options={[
            {value:'none', label:'Žádné / Ateista'}, 
            {value:'higher_power', label:'Věřím ve vyšší moc (Spirituální)'}, 
            {value:'christian', label:'Křesťanství'}, 
            {value:'islam', label:'Islám'},
            {value:'buddhism', label:'Buddhismus'},
            {value:'other', label:'Jiné vyznání'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Okruh přátel <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.friendsCircle || ""} 
          onChange={(v) => setFormData({...formData, friendsCircle: v as string})} 
          options={[
            {value:'many_acquaintances_few_friends', label:'Mám spoustu známých a pár opravdových přátel'}, 
            {value:'small_tight_group', label:'Mám jen velmi malý, úzký okruh lidí, kterým věřím'}, 
            {value:'loner', label:'Jsem spíše samotář, moc přátel nemám a nehledám'},
            {value:'betrayed', label:'Většina přátel se ukázala jako falešná, jsem opatrný'},
            {value:'butterfly', label:'Jsem společenský motýl, všude někoho znám a baví mě to'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Vztahový přístup <PointsBadge points={5} /></label>
        <CustomSelect 
          value={(formData as any).relationshipGoal || ""} 
          onChange={(v) => setFormData({...formData, relationshipGoal: v} as any)} 
          options={[
            {value:'life_partner', label:'Najít partnera na celý život'}, 
            {value:'run_wild', label:'Za svobodna poběhat co se dá'}, 
            {value:'let_it_flow', label:'Nechávám to plynout, co přijde to přijde'},
            {value:'no_commitments', label:'Hledám jen zábavu bez závazků'}
          ]} 
          placeholder="Tvá priorita..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Věrnost a Exkluzivita <PointsBadge points={5} /></label>
        <CustomSelect 
          value={(formData as any).fidelityFocus || ""} 
          onChange={(v) => setFormData({...formData, fidelityFocus: v} as any)} 
          options={[
            {value:'strict_monogamy', label:'Striktní monogamie (Oči jen pro jednoho)'}, 
            {value:'open_relationship', label:'Otevřený vztah (Upřímnost a volnost)'}, 
            {value:'monogamish', label:'Monogamish (Občasné okořenění toleruji)'},
            {value:'polyamory', label:'Polyamorie (Více paralelních vztahů)'}
          ]} 
          placeholder="Jak to cítíš?" 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Loajalita v těžkých časech <PointsBadge points={5} /></label>
        <CustomSelect 
          value={(formData as any).loyaltyApproach || ""} 
          onChange={(v) => setFormData({...formData, loyaltyApproach: v} as any)} 
          options={[
            {value:'ride_or_die', label:'Ride or die (Stojím při něm ať se děje cokoliv)'}, 
            {value:'bounded', label:'Podpořím, ale chráním i své vlastní hranice'}, 
            {value:'independent', label:'Každý si své boje musí vybojovat primárně sám'},
            {value:'avoidant', label:'Tlak a problémy mě spíš odhánějí'}
          ]} 
          placeholder="Tvá reakce na krizi..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Hodnoty <PointsBadge points={5} /></label>
        <CustomSelect value={formData.values?.traditionalVsModern || ""} onChange={(v) => setFormData({...formData, values: {...formData.values, traditionalVsModern: v}})} options={[{value:'traditional', label:'Tradiční'}, {value:'modern', label:'Moderní / Liberální'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Kariéra vs. Život <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.workLifeBalance || ""} 
          onChange={(v) => setFormData({...formData, workLifeBalance: v as string})} 
          options={[
            {value:'hustle', label:'Hustle kultura (Kariéra na 1. místě)'}, 
            {value:'balance', label:'Work-Life Balance (Pracuji, abych žil)'}, 
            {value:'free', label:'Volnomyšlenkář (Hlavně zážitky)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Peníze</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Můj přístup k penězům <PointsBadge points={5} /></label>
          <CustomSelect value={formData.moneyDetailed?.myAttitude || ""} onChange={(v) => setFormData({...formData, moneyDetailed: {...formData.moneyDetailed, myAttitude: v}})} options={[{value:'saver', label:'Spořivý'}, {value:'balanced', label:'Vyvážený'}, {value:'experiences', label:'Utrácím za zážitky'}, {value:'luxury', label:'Rád si dopřávám luxus'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Finance ve vztahu <PointsBadge points={5} /></label>
          <CustomSelect value={formData.moneyDetailed?.sharedAccount || ""} onChange={(v) => setFormData({...formData, moneyDetailed: {...formData.moneyDetailed, sharedAccount: v}})} options={[{value:'shared', label:'Vše společné'}, {value:'split', label:'Společný účet + vlastní'}, {value:'separate', label:'Každý sám za sebe'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-indigo-900/10 to-transparent border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-indigo-400 uppercase tracking-widest text-sm mb-4">Moderní témata (Hot Topics)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Tato témata v současnosti nejvíce rozdělují (či naopak spojují) společnost. Firmy i potenciální partneři ocení upřímnost.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Postoj k AI a Technologiím <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.aiAttitude || ""} 
            onChange={(v) => setFormData({...formData, aiAttitude: v})} 
            options={[
              {value:'enthusiast', label:'Tech nadšenec (AI miluji a používám)'}, 
              {value:'user', label:'Uživatel (Je to užitečný nástroj)'}, 
              {value:'skeptic', label:'Skeptik (Mám z vývoje obavy)'}, 
              {value:'refuser', label:'Odmítač (Chci být spíše offline)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Duševní zdraví a Terapie <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.therapyAttitude || ""} 
            onChange={(v) => setFormData({...formData, therapyAttitude: v})} 
            options={[
              {value:'active', label:'Chodím na terapii/koučink (Fitko pro mozek)'}, 
              {value:'open', label:'Jsem otevřený/á (Dává mi to smysl)'}, 
              {value:'self_solved', label:'Řeším si věci sám/sama (Nepotřebuji to)'}, 
              {value:'against', label:'Jsem proti (Nevěřím tomu)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Strava a Ekologie <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.dietEco || ""} 
            onChange={(v) => setFormData({...formData, dietEco: v})} 
            options={[
              {value:'carnivore', label:'Masožravec (Maso je základ)'}, 
              {value:'omnivore', label:'Všežravec (Sním vše, neřeším)'}, 
              {value:'flexitarian', label:'Flexitarián (Omezuji maso z přesvědčení)'}, 
              {value:'vegan_vegetarian', label:'Vegetarián / Vegan'},
              {value:'bio_eco', label:'Bio / Udržitelnost (Velmi dbám na stopu)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Pracovní model <PointsBadge points={10} /></label>
          <CustomSelect 
            value={formData.workModel || ""} 
            onChange={(v) => setFormData({...formData, workModel: v})} 
            options={[
              {value:'nomad', label:'Digitální Nomád (Ze světa)'}, 
              {value:'remote', label:'Remote / Home Office (Jsem doma)'}, 
              {value:'hybrid', label:'Hybrid (Zlatá střední cesta)'}, 
              {value:'office_physical', label:'Kancelář / Fyzická práce'},
              {value:'hustler', label:'Hustler / Podnikatel (24/7)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Společenská Polarizace & Konflikt názorů <PointsBadge points={15} /></label>
          <CustomSelect 
            value={formData.polarization || ""} 
            onChange={(v) => setFormData({...formData, polarization: v})} 
            options={[
              {value:'bubble', label:'Bublina (Bavím se spíše se stejně smýšlejícími)'}, 
              {value:'debater', label:'Debatér (Rád diskutuji s oponenty)'}, 
              {value:'cancel_culture', label:'Cancel Culture (Toxické názory okamžitě mažu)'}, 
              {value:'phlegmatic', label:'Flegmatik (Tato dramata jdou mimo mě)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-red-400 uppercase tracking-widest text-sm mb-4">Minulost a Body Count</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Počet minulých partnerů může být pro někoho důležitý, pro jiného red flag. Tato informace je defaultně skrytá. Odkryje se POUZE TEHDY, pokud ty i tvůj protějšek máte oba nastaveno "Vzájemné odhalení" a dojde k Matchi.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Počet minulých partnerů (Body Count) <PointsBadge points={15} /></label>
          <input type="number" min="0" value={formData.pastPartnersCount !== undefined ? formData.pastPartnersCount : ''} onChange={(e) => setFormData({...formData, pastPartnersCount: parseInt(e.target.value) || 0})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-red-400 rounded-md" placeholder="Zadej číslo..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Odhalit po Matchi?
            <InfoTooltip text="Mutual = ukáže se v Match reportu jen v případě, že to druhý povolil také." />
          </label>
          <CustomSelect value={formData.pastPartnersReveal || "hidden"} onChange={(v) => setFormData({...formData, pastPartnersReveal: v as any})} options={[{value:'hidden', label:'Skryté (Nechci sdílet)'}, {value:'mutual', label:'Mutual (Sdílet při oboustranné shodě)'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    {/* SECRET DESIRES */}
    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-sm mb-4">Tajná Přání (Secret Desires)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Máš nějaký tajný sen, bucket list položku nebo byznys nápad, co chceš sdílet jen s někým, kdo to má stejně? Napiš to sem. Opět platí vzájemné odhalení po Matchi.</p>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvé tajné přání / Fantazie <PointsBadge points={5} /></label>
          <input type="text" value={formData.secretDesires || ''} onChange={(e) => setFormData({...formData, secretDesires: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-purple-400 rounded-md" placeholder="Např. chci letět na měsíc..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Odhalit po Matchi?
           <PointsBadge points={5} /></label>
          <CustomSelect value={formData.secretDesiresReveal || "hidden"} onChange={(v) => setFormData({...formData, secretDesiresReveal: v as any})} options={[{value:'hidden', label:'Skryté (Nechci sdílet)'}, {value:'mutual', label:'Mutual (Sdílet při oboustranné shodě)'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>
  </motion.div>
);

export const Step8Protocol = ({ formData, setFormData, lang }: StepProps) => {
  const [agreed, setAgreed] = useState([
    formData.protocolAgreed || false, 
    formData.protocolAgreed || false, 
    formData.protocolAgreed || false,
    formData.protocolAgreed || false,
    formData.protocolAgreed || false,
    formData.protocolAgreed || false
  ]);

  const handleCheck = (index: number, checked: boolean) => {
    const newAgreed = [...agreed];
    newAgreed[index] = checked;
    setAgreed(newAgreed);
    setFormData({ ...formData, protocolAgreed: newAgreed.every(a => a) });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="text-center mb-6">
        <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Závazek Protokolu</h4>
        <p className="text-white/50 text-xs font-mono uppercase tracking-widest mt-2">MM Barber Síť má jasná pravidla.</p>
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/30 hover:border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl space-y-6 transition-all">
        <p className="text-white/80 font-sans text-sm leading-relaxed text-center">
          Před vstupem do sítě musíš odsouhlasit náš kodex. 
          Kdo ho poruší, toho náš algoritmus přesune na dno.
        </p>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[0]}
              onChange={(e) => handleCheck(0, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Zavazuji se, že nebudu "Ghostit"</span>
              <span className="block text-[10px] font-mono text-white/50">Budu slušně odepisovat nebo komunikaci jasně ukončím. Nízký "Reply Rate" vede k penalizaci od algoritmu.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[1]}
              onChange={(e) => handleCheck(1, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Respektuji kvalitu a upřímnost</span>
              <span className="block text-[10px] font-mono text-white/50">Nebudu zatajovat podstatné věci. Síť je pro lidi, kteří vědí, co chtějí, ať už je to cokoliv.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[2]}
              onChange={(e) => handleCheck(2, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Chápu systém "Trust Score"</span>
              <span className="block text-[10px] font-mono text-white/50">Vím, že mě ostatní uživatelé budou hodnotit a že na mém chování v aplikaci záleží.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[3]}
              onChange={(e) => handleCheck(3, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Mluvím pravdu o své osobě</span>
              <span className="block text-[10px] font-mono text-white/50">Zavazuji se, že uvádím o sobě pravdu, nezatajuji důležité skutečnosti a nesnažím se působit jako někdo jiný.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[4]}
              onChange={(e) => handleCheck(4, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Hodnotím ostatní férově a pravdivě</span>
              <span className="block text-[10px] font-mono text-white/50">Nebudu nikoho hodnotit ukřivděně či mstivě. Svá hodnocení zakládám na pravdě, i co se týče historie. Za svým slovem si stojím.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              className="mt-1 w-4 h-4 rounded border-white/20 bg-black/50 checked:bg-mafia-gold checked:border-mafia-gold focus:ring-mafia-gold"
              checked={agreed[5]}
              onChange={(e) => handleCheck(5, e.target.checked)}
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white group-hover:text-mafia-gold transition-colors">Souhlasím s právní ochranou, GDPR a DSA</span>
              <span className="block text-[10px] font-mono text-white/50">Mé osobní údaje jsou zpracovávány dle nařízení GDPR. Souhlasím s podmínkami v souladu s Nařízením o digitálních službách (DSA) pro bezpečné a transparentní online prostředí.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-xl space-y-4 transition-all">
        <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Eye size={18} className="text-mafia-gold"/> Závěrečné nastavení soukromí</h4>
        <p className="text-white/60 text-[10px] font-mono leading-relaxed mb-4">Urči, jak bude tvůj profil napříč systémem viditelný. Máš nad svými daty naprostou kontrolu.</p>
        
        <div>
          <CustomSelect 
            value={formData.visibilityMode || "public"} 
            onChange={(v) => setFormData({...formData, visibilityMode: v as 'public' | 'serious_only' | 'b2b_only' | 'ghost'})} 
            options={[
              {value:'public', label:'Veřejný profil (Vidí mě všichni v seznamce i firmy)'}, 
              {value:'serious_only', label:'Pouze Vážný vztah (Vidí mě jen 90%+ shody)'},
              {value:'b2b_only', label:'Pouze B2B (Jsem skrytý pro vztahy, viditelný jen pro firmy/práci)'},
              {value:'ghost', label:'Hibernace / Ghost (Zcela neviditelný, data chráněna)'}
            ]} 
            placeholder="Vyber režim..." 
          />
        </div>
      </div>
    </motion.div>
  );
};

export const StepSchools = ({ formData, setFormData, lang }: StepProps) => {
  const addSchool = () => {
    const newSchool = { id: Math.random().toString(36).substr(2, 9), name: '', yearFrom: '', yearTo: '', field: '' };
    setFormData({ ...formData, schools: [...(formData.schools || []), newSchool] });
  };
  
  const removeSchool = (id: string) => {
    setFormData({ ...formData, schools: formData.schools?.filter(s => s.id !== id) });
  };
  
  const updateSchool = (id: string, field: string, value: string) => {
    setFormData({ ...formData, schools: formData.schools?.map(s => s.id === id ? { ...s, [field]: value } : s) });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="text-center mb-6">
        <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Tvoje Školy</h4>
        <p className="text-white/60 text-sm mt-2">Přidej své školy, ať tě tvoji spolužáci snadněji najdou.</p>
      </div>
      
      <div className="space-y-6">
        {(formData.schools || []).map((school, idx) => (
          <div key={school.id} className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl relative transition-all">
            <button type="button" onClick={() => removeSchool(school.id)} className="absolute top-2 right-2 text-white/40 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Název školy</label>
                <input type="text" value={school.name} onChange={(e) => updateSchool(school.id, 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-mafia-gold outline-none" placeholder="Např. VUT Brno" />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Od roku</label>
                <input type="text" value={school.yearFrom} onChange={(e) => updateSchool(school.id, 'yearFrom', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-mafia-gold outline-none" placeholder="Např. 2010" />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Do roku</label>
                <input type="text" value={school.yearTo} onChange={(e) => updateSchool(school.id, 'yearTo', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-mafia-gold outline-none" placeholder="Např. 2014" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-2">Obor / Fakulta (Volitelné)</label>
                <input type="text" value={school.field || ''} onChange={(e) => updateSchool(school.id, 'field', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-mafia-gold outline-none" placeholder="Např. Fakulta informačních technologií" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button type="button" onClick={addSchool} className="w-full py-4 border border-dashed border-mafia-gold/30 rounded-xl text-mafia-gold hover:bg-mafia-gold/10 hover:border-mafia-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.0)] hover:shadow-[0_0_20px_rgba(197,160,89,0.1)] transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-widest text-xs">
        <Plus size={16} /> Přidat další školu
      </button>
    </motion.div>
  );
};


export const StepHealth = ({ formData, setFormData, lang }: { formData: any, setFormData: any, lang: string }) => {
  const t = lang === 'cs' ? {
    title: 'Zdraví a Omezení',
    desc: 'Sdílej tolik, kolik je ti příjemné. Být upřímný ohledně zdravotních specifik pomáhá najít někoho, kdo má pochopení.',
    visionHearing: 'Zrak & Sluch',
    mobility: 'Fyzická mobilita',
    chronic: 'Chronická onemocnění a Zdraví',
    neurodivergent: 'Neurodiverzita',
    dietary: 'Životní styl a Omezení',
    options: {
      glasses: 'Brýle / Kontaktní čočky',
      blind: 'Zrakový handicap',
      hearing_aid: 'Naslouchátko',
      deaf: 'Sluchový handicap',
      wheelchair: 'Vozíčkář',
      crutches: 'Berle / Hůl',
      amputee: 'Amputace',
      hidden_mobility: 'Skrytý fyzický handicap',
      fully_mobile: 'Plně mobilní',
      asthma: 'Astma',
      diabetes: 'Diabetes',
      allergies: 'Silné alergie',
      migraines: 'Migrény',
      autoimmune: 'Autoimunitní onemocnění',
      epilepsy: 'Epilepsie',
      adhd: 'ADHD',
      autism: 'Autismus / Asperger',
      dyslexia: 'Dyslexie / Dysgrafie',
      ocd: 'OCD',
      celiac: 'Celiakie / Bezlepková dieta',
      health_vegan: 'Vegan ze zdravotních důvodů',
      frequent_rest: 'Potřebuji častý odpočinek',
      medication: 'Pravidelná medikace'
    }
  } : {
    title: 'Health & Conditions',
    desc: 'Share as much as you feel comfortable with. Being upfront helps find an understanding partner.',
    visionHearing: 'Vision & Hearing',
    mobility: 'Physical Mobility',
    chronic: 'Chronic Conditions & Health',
    neurodivergent: 'Neurodivergence',
    dietary: 'Lifestyle & Constraints',
    options: {
      glasses: 'Glasses / Contacts',
      blind: 'Visual Impairment',
      hearing_aid: 'Hearing Aid',
      deaf: 'Hearing Impairment',
      wheelchair: 'Wheelchair user',
      crutches: 'Crutches / Cane',
      amputee: 'Amputee',
      hidden_mobility: 'Hidden physical disability',
      fully_mobile: 'Fully mobile',
      asthma: 'Asthma',
      diabetes: 'Diabetes',
      allergies: 'Severe Allergies',
      migraines: 'Migraines',
      autoimmune: 'Autoimmune Disease',
      epilepsy: 'Epilepsy',
      adhd: 'ADHD',
      autism: 'Autism / Aspergers',
      dyslexia: 'Dyslexia',
      ocd: 'OCD',
      celiac: 'Celiac / Gluten-free',
      health_vegan: 'Vegan for health reasons',
      frequent_rest: 'Need frequent rest',
      medication: 'Regular medication'
    }
  };

  const updateField = (field: string, values: string[]) => {
    setFormData({
      ...formData,
      healthConditions: {
        ...(formData.healthConditions || {}),
        [field]: values
      }
    });
  };

  const getValues = (field: string) => {
    return formData.healthConditions?.[field] || [];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="font-heading font-black text-2xl text-white uppercase tracking-wider mb-2">{t.title}</h3>
        <p className="text-white/50 text-sm max-w-md mx-auto">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccordionSection title={t.visionHearing} icon={<Eye size={16} />} defaultOpen={true}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['glasses', 'blind', 'hearing_aid', 'deaf'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('visionHearing');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('visionHearing', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('visionHearing').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.mobility} icon={<Activity size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['fully_mobile', 'hidden_mobility', 'wheelchair', 'crutches', 'amputee'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('mobility');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('mobility', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('mobility').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.chronic} icon={<HeartPulse size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['asthma', 'diabetes', 'allergies', 'migraines', 'autoimmune', 'epilepsy'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('chronic');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('chronic', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('chronic').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.neurodivergent} icon={<Brain size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['adhd', 'autism', 'dyslexia', 'ocd'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('neurodivergent');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('neurodivergent', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('neurodivergent').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title={t.dietary} icon={<Coffee size={16} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-2 mt-4">
            {['celiac', 'health_vegan', 'frequent_rest', 'medication'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current = getValues('dietaryOrLifestyleConstraints');
                  const next = current.includes(opt) ? current.filter((c: string) => c !== opt) : [...current, opt];
                  updateField('dietaryOrLifestyleConstraints', next);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${getValues('dietaryOrLifestyleConstraints').includes(opt) ? 'bg-mafia-gold text-black font-bold' : 'bg-black/50 text-white/70 hover:bg-white/10'}`}
              >
                {t.options[opt as keyof typeof t.options]}
              </button>
            ))}
          </div>
        </AccordionSection>
      </div>

      <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl mt-8">
        <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Můj přístup ke zdraví</h4>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak řešíš své zdraví celkově? <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.healthManagement || ""} 
          onChange={(v) => setFormData({...formData, healthManagement: v})} 
          options={[
            {value:'proactive', label:'Proaktivní (Prevence, biohacking, hlídám se)'},
            {value:'normal', label:'Normální (Jdu k doktorovi, když mi něco je)'},
            {value:'ignore', label:'Spíš to ignoruju (Doktorům se vyhýbám obloukem)'},
            {value:'hypochondriac', label:'Hypochondr (Pořád se pozoruju)'},
            {value:'doesnt_matter', label:'Je mi to úplně jedno (Neřeším to)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

    </motion.div>
  );
};

export const StepIntimacy = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">{lang === 'cs' ? 'Hlubší poznání & Intimita' : 'Deeper connection & Intimacy'}</h4>
      <p className="text-[10px] font-mono text-white/50 mt-2">{lang === 'cs' ? 'Důležité pro sladění očekávání. Nech pole prázdná, pokud na to nechceš odpovídat.' : 'Important for aligning expectations. Leave blank if you prefer not to answer.'}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">{lang === 'cs' ? 'Dynamika' : 'Dynamics'} <PointsBadge points={15} /></label>
        <CustomSelect 
          value={formData.intimacyDynamic || ""} 
          onChange={(v) => setFormData({...formData, intimacyDynamic: v as string})} 
          options={[
            {value:'dominant', label:lang === 'cs' ? 'Dominantní' : 'Dominant'}, 
            {value:'submissive', label:lang === 'cs' ? 'Submisivní' : 'Submissive'}, 
            {value:'switch', label:lang === 'cs' ? 'Switch (Střídám to)' : 'Switch'},
            {value:'equal', label:lang === 'cs' ? 'Rovnocenná / Vanilla' : 'Equal / Vanilla'}
          ]} 
          placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">{lang === 'cs' ? 'Sdílení tajemství' : 'Secret Desires Reveal'} <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.secretDesiresReveal || ""} 
          onChange={(v) => setFormData({...formData, secretDesiresReveal: v as 'mutual' | 'hidden'})} 
          options={[
            {value:'hidden', label:lang === 'cs' ? 'Držím si to pro sebe' : 'Keep it hidden'}, 
            {value:'mutual', label:lang === 'cs' ? 'Zobrazit, pokud se shodneme (Mutual)' : 'Show on mutual match'}
          ]} 
          placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} 
        />
      </div>
    </div>

    <div className="space-y-6 mt-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          {lang === 'cs' ? 'Kinks & Fetish (Klíčová slova)' : 'Kinks & Fetish (Keywords)'}
         <PointsBadge points={5} /></label>
        <input 
          type="text" 
          value={(formData as any).kinks || ""} 
          onChange={(e) => setFormData({...formData, kinks: e.target.value} as any)} 
          placeholder={lang === 'cs' ? 'Co tě vzrušuje? (Např. Roleplay, BDSM...)' : 'What turns you on?'} 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-mafia-gold outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          {lang === 'cs' ? 'Tajná přání (Zobrazí se podle nastavení)' : 'Secret Desires (Visible based on settings)'}
         <PointsBadge points={5} /></label>
        <textarea 
          rows={3}
          value={formData.secretDesires || ""} 
          onChange={(e) => setFormData({...formData, secretDesires: e.target.value})} 
          placeholder={lang === 'cs' ? 'Je něco, co bys rád(a) zkusil(a)?' : 'Is there something you would like to try?'} 
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-mafia-gold outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Hranice nevěry <PointsBadge points={15} /></label>
        <CustomSelect 
          value={formData.infidelityBoundaries || ""} 
          onChange={(v) => setFormData({...formData, infidelityBoundaries: v as string})} 
          options={[
            {value:'micro_cheating', label:'Už psaní s někým jiným, lajkování fotek nebo mikro-nevěra je konec'}, 
            {value:'emotional', label:'Fyzický kontakt snesu spíš, než když se zamiluje jinde (Emocionální nevěra)'}, 
            {value:'physical', label:'Dokud není fyzický kontakt / sex, tak to tolik neřeším'},
            {value:'dont_ask_dont_tell', label:'Co oči nevidí, to srdce nebolí (Hlavně ať to nevím)'},
            {value:'open_minded', label:'Jsem hodně volnomyšlenkářský/á, nevěra pro mě skoro neexistuje'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div className="md:col-span-2 mt-4">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Náklonost na veřejnosti (PDA) <PointsBadge points={5} /></label>
        <CustomSelect 
          value={formData.publicAffection || ""} 
          onChange={(v) => setFormData({...formData, publicAffection: v as string})} 
          options={[
            {value:'none', label:'Na veřejnosti se nedotýkám, jsem profík (Žádné PDA)'}, 
            {value:'holding_hands', label:'Držení za ruce a decentní pusa je maximum'}, 
            {value:'cuddly', label:'Rád/a se tulím všude možně, neřeším okolí'},
            {value:'exhibitionist', label:'Líbí se mi riskovat, klidně i sex na veřejnosti'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
      <div className="md:col-span-2 mt-4 pt-6 border-t border-white/10">
        <h5 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Minulost a Věrnost</h5>
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Tvůj vztah k věrnosti (Osobní historie) <PointsBadge points={15} /></label>
        <CustomSelect 
          value={formData.loyaltyApproach || ""} 
          onChange={(v) => setFormData({...formData, loyaltyApproach: v as string})} 
          options={[
            {value:'never_cheated', label:'Jsem naprosto věrný/á, nikdy jsem nepodvedl/a'}, 
            {value:'cheated_learned', label:'V minulosti jsem chyboval/a (podvedl/a), ale poučil/a se'}, 
            {value:'monogamy_hard', label:'Být dlouhodobě jen s jedním člověkem je pro mě složité'},
            {value:'polyamory', label:'Preferuji otevřený vztah nebo polyamorii'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Počet sexuálních partnerů (Bodycount) <PointsBadge points={10} /></label>
        <div className="flex flex-col gap-2">
          <input 
            type="number" 
            min="0"
            value={formData.pastPartnersCount !== undefined ? formData.pastPartnersCount : ""} 
            onChange={(e) => setFormData({...formData, pastPartnersCount: e.target.value ? Number(e.target.value) : undefined})} 
            placeholder="Tvoje číslo (nepovinné)" 
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-mafia-gold outline-none"
          />
          <div className="mt-2">
            <CustomSelect 
              value={formData.pastPartnersReveal || ""} 
              onChange={(v) => setFormData({...formData, pastPartnersReveal: v as 'mutual' | 'hidden'})} 
              options={[
                {value:'hidden', label:'Udržet v tajnosti (skryto)'}, 
                {value:'mutual', label:'Zobrazit pouze při shodě (Mutual)'}
              ]} 
              placeholder="Kdo to uvidí?" 
            />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export const StepCareerEducation = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Kariéra a Vzdělání</h4>
      <p className="text-white/60 text-xs font-mono mt-2">Díky těmto údajům tě budeme moci propojit s nabídkami práce od elitních firem.</p>
    </div>

    {/* Vzdělání */}
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 rounded-xl space-y-6">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
        <Brain size={16} /> Vzdělání
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Nejvyšší dosažené vzdělání <PointsBadge points={10} />
          </label>
          <CustomSelect 
            value={formData.educationLevel || ""} 
            onChange={(v) => setFormData({...formData, educationLevel: v})} 
            options={[
              {value:'zakladni', label:'Základní'}, 
              {value:'sou', label:'Střední odborné (bez maturity)'}, 
              {value:'ss', label:'Střední s maturitou'}, 
              {value:'vos', label:'Vyšší odborné'},
              {value:'vs_bakalar', label:'Vysokoškolské (Bakalář)'},
              {value:'vs_magistr', label:'Vysokoškolské (Magistr/Inženýr)'},
              {value:'phd', label:'Doktorské (PhD.)'}
            ]} 
            placeholder="Vyber vzdělání..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Studijní / Kariérní obor <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={(formData as any).careerField || ""} 
            onChange={(v) => setFormData({...formData, careerField: v} as any)} 
            options={[
              {value:'tech', label:'Technické (IT, Inženýrství)'}, 
              {value:'econ', label:'Ekonomické (Byznys, Finance)'}, 
              {value:'social', label:'Sociální a Zdravotní (Péče, Lidé)'}, 
              {value:'creative', label:'Kreativní a Umělecké'},
              {value:'craft', label:'Řemeslo a Manuální práce'},
              {value:'humanities', label:'Humanitní (Právo, Jazyky, Historie)'},
              {value:'science', label:'Přírodní vědy (Matematika, Chemie)'}
            ]} 
            placeholder="Tvůj směr..." 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Nejoblíbenější předměty (Základka / Střední) <PointsBadge points={5} />
        </label>
        <CustomSelect 
          isMulti={true}
          value={(formData as any).favoriteSubjects || []} 
          onChange={(v) => setFormData({...formData, favoriteSubjects: v} as any)} 
          options={[
            {value:'history', label:'Dějepis'}, 
            {value:'geography', label:'Zeměpis'}, 
            {value:'it', label:'Informatika / IT'}, 
            {value:'math', label:'Matematika / Fyzika'},
            {value:'literature', label:'Literatura / Jazyky'},
            {value:'sports', label:'Tělocvik'},
            {value:'art', label:'Výtvarka / Hudebka'}
          ]} 
          placeholder="Co tě ve škole opravdu bavilo?" 
        />
      </div>
      
      {(() => {
        const subjects = (formData as any).favoriteSubjects as string[];
        if (!subjects || subjects.length === 0) return null;
        let archetype = { name: 'Moderní Tvůrce', desc: 'Máš svůj vlastní styl myšlení nezávislý na starých dogmatech.' };
        if (subjects.includes('history') && subjects.includes('literature')) archetype = { name: 'Řekové', desc: 'Filozofové a myslitelé s citem pro kulturu, umění a příběhy.' };
        else if (subjects.includes('history') && subjects.includes('geography')) archetype = { name: 'Římané', desc: 'Budovatelé říší se strategickým myšlením a touhou po expanzi.' };
        else if (subjects.includes('it') || subjects.includes('math')) archetype = { name: 'Sumerové', desc: 'Vynálezci a inovátoři, kteří budují základy budoucnosti pomocí logiky.' };
        else if (subjects.includes('geography')) archetype = { name: 'Féničané / Vikingové', desc: 'Objevitelé s neklidnou krví, touhou cestovat a poznávat.' };
        else if (subjects.includes('sports')) archetype = { name: 'Ssparťané', desc: 'Bojovníci, kteří si zakládají na disciplíně a akci.' };

        return (
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg mt-4">
            <h5 className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Tvůj historický archetyp</h5>
            <p className="text-mafia-gold font-bold">{archetype.name}</p>
            <p className="text-sm text-white/70 mt-1">{archetype.desc}</p>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Průměrný prospěch <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={formData.educationGrades || ""} 
            onChange={(v) => setFormData({...formData, educationGrades: v})} 
            options={[
              {value:'vyborny', label:'Výborný (do 1.5)'}, 
              {value:'chvalitebny', label:'Chvalitebný (do 2.0)'}, 
              {value:'dobry', label:'Dobrý (do 3.0)'}, 
              {value:'dostatecny', label:'Dostatečný (nad 3.0)'},
              {value:'neresim', label:'Na známkách nezáleží'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Závěrečné zkoušky / Maturita <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={formData.educationFinalExam || ""} 
            onChange={(v) => setFormData({...formData, educationFinalExam: v})} 
            options={[
              {value:'vyznamenani', label:'S vyznamenáním'}, 
              {value:'prospel', label:'Prospěl(a)'}, 
              {value:'prospel_dobre', label:'Prospěl(a) velmi dobře'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>

    {/* Pracovní Morálka */}
    <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl space-y-6">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
        <Activity size={16} /> Pracovní Morálka a Odkaz
      </h4>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Tvoje pracovní nasazení <PointsBadge points={10} />
        </label>
        <CustomSelect 
          value={formData.workEthic || ""} 
          onChange={(v) => setFormData({...formData, workEthic: v})} 
          options={[
            {value:'workoholik', label:'Workoholik - Práce je můj život'}, 
            {value:'hardworker', label:'Tvrdě pracuji, když je třeba'}, 
            {value:'balance', label:'Zdravý balanc - Práce není vše'}, 
            {value:'money_only', label:'Pracuji jen pro peníze, žiju jindy'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Budovatelé v rodině? <PointsBadge points={5} />
            <InfoTooltip text="Byl v tvé rodině někdo význačný, kdo budoval firmy nebo něco velkého?" />
          </label>
          <CustomSelect 
            value={formData.familyLegacy || ""} 
            onChange={(v) => setFormData({...formData, familyLegacy: v})} 
            options={[
              {value:'yes_big', label:'Ano, máme silný rodinný odkaz'}, 
              {value:'yes_small', label:'Ano, menší rodinný podnik'}, 
              {value:'no', label:'Ne, jsem první budovatel'}, 
              {value:'dont_care', label:'Neřeším to'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Pokračování v odkazu <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={formData.legacyContinue || ""} 
            onChange={(v) => setFormData({...formData, legacyContinue: v})} 
            options={[
              {value:'yes_continue', label:'Chci převzít a budovat dál'}, 
              {value:'own_path', label:'Chci jít vlastní cestou'}, 
              {value:'not_applicable', label:'Není co přebírat'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>

    {/* Profesní Profil a Psychologie */}
    <div className="p-6 bg-gradient-to-br from-mafia-gold/5 to-transparent border border-mafia-gold/20 rounded-xl space-y-6">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
        <Target size={16} /> {lang === 'cs' ? 'Profesní Profil a Psychologie' : 'Professional Profiling'}
      </h4>
      <p className="text-white/50 text-xs font-mono mb-4">{lang === 'cs' ? 'Moderní dotazníky inspirované zahraniční praxí (např. Gallup), které pomohou firmám lépe pochopit tvůj potenciál.' : 'Modern questionnaires inspired by global practices (e.g. Gallup) to help companies understand your potential.'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            {lang === 'cs' ? 'Hlavní Silné Stránky (Gallup Strengths)' : 'Core Strengths (Gallup)'} <PointsBadge points={15} />
          </label>
          <CustomSelect 
            isMulti={true}
            value={(formData as any).gallupStrengths || []} 
            onChange={(v) => setFormData({...formData, gallupStrengths: v} as any)} 
            options={[
              {value:'executing', label: lang === 'cs' ? 'Realizátor (Dotahuji věci do konce)' : 'Executing (Getting things done)'}, 
              {value:'influencing', label: lang === 'cs' ? 'Vliv (Umím přesvědčit a nadchnout)' : 'Influencing (Selling ideas)'}, 
              {value:'relationship', label: lang === 'cs' ? 'Budování vztahů (Spojuji tým)' : 'Relationship Building (Team glue)'}, 
              {value:'strategic', label: lang === 'cs' ? 'Strategické myšlení (Vidím souvislosti)' : 'Strategic Thinking (Seeing the big picture)'}
            ]} 
            placeholder={lang === 'cs' ? 'V čem jsi přirozeně dobrý/á?' : 'What are you naturally good at?'} 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            {lang === 'cs' ? 'Hlavní Motivátor' : 'Core Motivation'} <PointsBadge points={10} />
          </label>
          <CustomSelect 
            value={(formData as any).coreMotivation || ""} 
            onChange={(v) => setFormData({...formData, coreMotivation: v} as any)} 
            options={[
              {value:'money', label: lang === 'cs' ? 'Peníze a finanční nezávislost' : 'Money & Financial Independence'}, 
              {value:'impact', label: lang === 'cs' ? 'Dopad a smysl práce' : 'Impact & Meaning'}, 
              {value:'growth', label: lang === 'cs' ? 'Osobní růst a učení' : 'Personal Growth & Learning'}, 
              {value:'status', label: lang === 'cs' ? 'Status a uznání' : 'Status & Recognition'},
              {value:'flexibility', label: lang === 'cs' ? 'Svoboda a flexibilita' : 'Freedom & Flexibility'}
            ]} 
            placeholder={lang === 'cs' ? 'Co tě pohání vpřed?' : 'What drives you?'} 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            {lang === 'cs' ? 'Pracovní Prostředí' : 'Work Environment Pref'} <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={(formData as any).workEnvironmentPref || ""} 
            onChange={(v) => setFormData({...formData, workEnvironmentPref: v} as any)} 
            options={[
              {value:'remote', label: lang === 'cs' ? '100% Remote (Z domova / odkudkoliv)' : '100% Remote'}, 
              {value:'hybrid', label: lang === 'cs' ? 'Hybrid (Kombinace domova a kanceláře)' : 'Hybrid'}, 
              {value:'office', label: lang === 'cs' ? 'Kancelář (Rád/a jsem s lidmi fyzicky)' : 'Office / On-site'}
            ]} 
            placeholder={lang === 'cs' ? 'Kde se ti pracuje nejlépe?' : 'Where do you work best?'} 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            {lang === 'cs' ? 'Řešení konfliktů' : 'Conflict Resolution'} <PointsBadge points={10} />
          </label>
          <CustomSelect 
            value={(formData as any).workConflictStyle || ""} 
            onChange={(v) => setFormData({...formData, workConflictStyle: v} as any)} 
            options={[
              {value:'direct', label: lang === 'cs' ? 'Přímá konfrontace (vyříkat si to hned)' : 'Direct Confrontation'}, 
              {value:'diplomatic', label: lang === 'cs' ? 'Diplomaticky (hledat kompromis přes HR/manažera)' : 'Diplomatic Compromise'}, 
              {value:'avoidant', label: lang === 'cs' ? 'Vyhýbavě (nechci dělat vlny)' : 'Avoidant'}
            ]} 
            placeholder={lang === 'cs' ? 'Když nastane problém v týmu...' : 'When team conflict arises...'} 
          />
        </div>
      </div>
    </div>

    {/* Kariéra */}
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 rounded-xl space-y-6">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
        <Coffee size={16} /> Kariérní dráha
      </h4>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Jakou formu práce volíš? <PointsBadge points={10} />
        </label>
        <CustomSelect 
          value={formData.employmentPreference || ""} 
          onChange={(v) => setFormData({...formData, employmentPreference: v})} 
          options={[
            {value:'employee', label:'Zaměstnanec (Jistota a klid)'}, 
            {value:'freelancer', label:'OSVČ (Svoboda a nezávislost)'}, 
            {value:'entrepreneur', label:'Majitel firmy (Budování systémů)'}, 
            {value:'investor', label:'Investor (Peníze tvoří peníze)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Jak ses vypracoval(a)? (Možno vybrat více) <PointsBadge points={10} />
        </label>
        <CustomSelect 
          isMulti={true}
          value={formData.careerProgression || []} 
          onChange={(v) => setFormData({...formData, careerProgression: v})} 
          options={[
            {value:'from_scratch', label:'Začal(a) jsem od úplné nuly'}, 
            {value:'fast_climb', label:'Extrémně rychlý postup'}, 
            {value:'steady_growth', label:'Pomalý a stabilní růst'}, 
            {value:'career_change', label:'Kompletní změna oboru'},
            {value:'finding_path', label:'Zatím hledám svůj směr'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
    </div>

    {/* Propojení s B2B */}
    <div className="p-6 bg-black/60 border border-green-500/30 rounded-xl space-y-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500">
        <Activity size={100} />
      </div>
      <h4 className="font-heading font-black text-green-400 uppercase tracking-widest text-sm mb-4 flex items-center gap-2 relative z-10">
        Job Matching (B2B)
      </h4>
      <p className="text-xs text-white/60 font-mono mb-4 relative z-10">Tvé kontaktní údaje uvidí pouze prověřené partnerské firmy, které hledají talenty do svého týmu.</p>
      
      {!formData.b2bConsentAgreed ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center bg-black/40 border border-white/10 rounded-lg mt-4">
          <ShieldCheck size={48} className="text-green-500 mb-4 opacity-80" />
          <h5 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-2">Souhlas s poskytnutím údajů</h5>
          <p className="text-[10px] font-mono text-white/60 mb-6 max-w-md leading-relaxed">
            Beru na vědomí, že pokud vyplním své kontaktní údaje a projevím zájem o pracovní nabídky, mé údaje budou poskytnuty prověřeným B2B partnerům (firmám) v rámci platformy MM Barber za účelem headhuntingu a zasílání pracovních nabídek. Zpracování probíhá v souladu s nařízením GDPR a svá data mohu kdykoliv smazat či souhlas odvolat.
          </p>
          <button 
            type="button"
            onClick={() => setFormData({...formData, b2bConsentAgreed: true})}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold font-mono uppercase tracking-widest transition-colors rounded"
          >
            Beru na vědomí a souhlasím
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-4">
            <div>
              <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
                Pracovní Email <PointsBadge points={10} />
              </label>
              <input 
                type="email" 
                value={formData.contactEmail || ""} 
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} 
                className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-green-500" 
                placeholder="např. karel@gmail.com" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
                Telefonní číslo (Volitelné) <PointsBadge points={10} />
              </label>
              <input 
                type="tel" 
                value={formData.contactPhone || ""} 
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} 
                className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-green-500" 
                placeholder="+420..." 
              />
            </div>
          </div>

          <div className="flex items-center mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg relative z-10 cursor-pointer hover:bg-green-500/20 transition-colors" onClick={() => setFormData({...formData, openToJobOffers: !formData.openToJobOffers})}>
            <div className={`w-6 h-6 rounded border flex items-center justify-center mr-3 ${formData.openToJobOffers ? 'bg-green-500 border-green-500 text-black' : 'bg-transparent border-white/30 text-transparent'}`}>
              <Plus size={16} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-bold text-green-400 font-heading uppercase tracking-wider block">Chci dostávat nabídky na vhodnou práci</span>
              <span className="text-xs text-white/50 font-mono">Firmy z oboru mi mohou poslat nabídku nebo voucher na pohovor.</span>
            </div>
            <PointsBadge points={20} />
          </div>
        </>
      )}
    </div>

  </motion.div>
);

export const StepMedia = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Sociální Sítě a Média</h4>
      <p className="text-white/60 text-xs font-mono mt-2">Tvůj vztah k digitálnímu světu nám pomůže najít lépe kompatibilní shody a firmám ukáže tvou nezávislost.</p>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 rounded-xl space-y-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Tvá role na sítích <PointsBadge points={10} />
        </label>
        <CustomSelect 
          value={formData.socialMediaRole || ""} 
          onChange={(v) => setFormData({...formData, socialMediaRole: v})} 
          options={[
            {value:'consumer', label:'Konzument (Hodně přijímám obsah, scrolluju)'}, 
            {value:'balance', label:'Balanc (Sleduju i tvořím pro přátele)'}, 
            {value:'creator', label:'Tvůrce (Tvořím a lidi mě sledují)'},
            {value:'none', label:'Bez sítí (Jsem offline / Sítě mě nezajímají)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>

      <div className="pt-4">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>Čas strávený na sítích (Denně) <PointsBadge points={5} /></span>
          <span className="text-mafia-gold font-bold">
            {formData.socialMediaTime ? `${formData.socialMediaTime}%` : '50%'}
          </span>
        </label>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={formData.socialMediaTime || 50} 
          onChange={(e) => setFormData({...formData, socialMediaTime: parseInt(e.target.value)})} 
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-mafia-gold"
        />
        
        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2">
          <span>Téměř vůbec (0%)</span>
          <span>Průměr (50%)</span>
          <span>Extrém / Závislost (100%)</span>
        </div>
      </div>
    </div>

    {/* Hudba */}
    <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Hudební vkus</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Jaký styl preferuješ? <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={(formData as any).musicStyle || ""} 
            onChange={(v) => setFormData({...formData, musicStyle: v} as any)} 
            options={[
              {value:'old_school', label:'Staré osvědčené klasiky (80s, 90s)'}, 
              {value:'modern_hits', label:'Moderní hity (Top 50 Spotify)'}, 
              {value:'underground', label:'Underground a alternativní scéna'},
              {value:'everything', label:'Poslechnu si všechno (podle nálady)'},
              {value:'hardcore', label:'Tvrdá hudba (Metal, Techno)'}
            ]} 
            placeholder="Vyber svůj vibe..." 
          />
        </div>
        
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Jaké interprety posloucháš? <PointsBadge points={5} />
          </label>
          <CustomSelect 
            value={(formData as any).musicArtists || ""} 
            onChange={(v) => setFormData({...formData, musicArtists: v} as any)} 
            options={[
              {value:'megastars', label:'Globální stars (s miliony sledujících)'}, 
              {value:'local', label:'Lokální interpreti (CZ/SK scéna)'}, 
              {value:'indie', label:'Neznámí interpreti a Indie kapely'},
              {value:'instrumental', label:'Klasická / Instrumentální hudba (bez zpěvu)'}
            ]} 
            placeholder="Kdo ti hraje ve sluchátkách?" 
          />
        </div>
      </div>
    </div>
  </motion.div>
);
