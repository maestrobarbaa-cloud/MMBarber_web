import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { ProfileData } from "./ProfileTypes";
import { CustomSelect } from "./CustomSelect";
import { PreferenceSelector, TraitSelector, InfoTooltip } from "./SetupHelpers";

interface StepProps {
  formData: ProfileData;
  setFormData: (data: ProfileData) => void;
  lang: 'cs' | 'en';
}

export const Step2Physical = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Fyzická přitažlivost a Návyky</h4>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
         <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
           Tvoje výška (cm)
           <InfoTooltip text="Fyzické proporce jsou pro někoho důležité. Zadej reálnou výšku." />
         </label>
         <input type="text" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" />
      </div>
      <div>
         <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
           Tvar postavy (Silueta)
           <InfoTooltip text="Jak bys popsal(a) svůj typ postavy? Hruška, Jablko, V-shape..." />
         </label>
         <CustomSelect 
            value={formData.bodyShape || ""} 
            onChange={(v) => setFormData({...formData, bodyShape: v as string})} 
            options={[
              {value:'fit', label:'Fit / Vysportovaná'},
              {value:'slim', label:'Štíhlá (Slim)'},
              {value:'chubby', label:'Baculka / Silnější'},
              {value:'hourglass', label:'Ž: Přesýpací hodiny (Hourglass)'}, 
              {value:'pear', label:'Ž: Hruška (Pear)'}, 
              {value:'apple', label:'Ž: Jablko (Apple)'}, 
              {value:'petite', label:'Ž: Drobná (Petite)'},
              {value:'vshape', label:'M: Široká ramena (V-shape / Dorito)'},
              {value:'dadbod', label:'M: Taťkovská (Dad Bod)'},
              {value:'lean', label:'M: Hubený/Vyšvihaný (Lean)'},
              {value:'muscle', label:'M: Svalnatý (Muscle)'},
              {value:'bear', label:'M: Medvěd (Bear)'},
              {value:'average', label:'Normální / Běžná'}
            ]} 
            placeholder="Vyber tvar..." 
          />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Preference u partnera</h4>
      <div className="space-y-6">
        <TraitSelector label="Důležitost fyzické přitažlivosti" tooltipText="Záleží ti hodně na vzhledu, nebo spíš na povaze?" value={formData.physicalAttraction?.importance} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, importance: v as any}})} />
        <TraitSelector label="Jak moc musí dbát na vzhled" tooltipText="Hledáš někoho, kdo tráví hodiny před zrcadlem, nebo ti to je jedno?" value={formData.physicalAttraction?.careForLooks} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, careForLooks: v as any}})} />
        <TraitSelector label="Důležitost sexuálního života" tooltipText="Matchujeme lidi s podobným apetitem a prioritami." value={formData.physicalAttraction?.sexImportance} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, sexImportance: v as any}})} />
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Na co se má algoritmus zaměřit?</label>
           <CustomSelect value={formData.physicalAttraction?.attractionPreference || ""} onChange={(v) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, attractionPreference: v as any}})} options={[{value:'physical', label:'Hlavně fyzická přitažlivost'}, {value:'psychological', label:'Hlavně psychická přitažlivost (sapiosexuál)'}, {value:'both', label:'Obojí je stejně důležité'}]} placeholder="Vyber..." />
        </div>
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Úchylky / Specifické preference (Volitelné)</label>
           <input type="text" value={formData.physicalAttraction?.kinks || ''} onChange={(e) => setFormData({...formData, physicalAttraction: {...formData.physicalAttraction, kinks: e.target.value}})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Např. BDSM, foot fetish, dominantní partner..." />
        </div>
        
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
             Preferovaný tvar postavy (Silueta)
             <InfoTooltip text="Algoritmus se bude snažit najít ty, kteří se blíží tvému ideálu." />
           </label>
           <CustomSelect 
             isMulti={true} 
             value={formData.prefBodyShape || []} 
             onChange={(v) => setFormData({...formData, prefBodyShape: v})} 
             options={[
              {value:'fit', label:'Fit / Vysportovaná'},
              {value:'slim', label:'Štíhlá (Slim)'},
              {value:'chubby', label:'Baculka / Silnější'},
              {value:'hourglass', label:'Ž: Přesýpací hodiny (Hourglass)'}, 
              {value:'pear', label:'Ž: Hruška (Pear)'}, 
              {value:'apple', label:'Ž: Jablko (Apple)'}, 
              {value:'petite', label:'Ž: Drobná (Petite)'},
              {value:'vshape', label:'M: Široká ramena (V-shape / Dorito)'},
              {value:'dadbod', label:'M: Taťkovská (Dad Bod)'},
              {value:'lean', label:'M: Hubený/Vyšvihaný (Lean)'},
              {value:'muscle', label:'M: Svalnatý (Muscle)'},
              {value:'bear', label:'M: Medvěd (Bear)'},
              {value:'average', label:'Normální / Běžná'},
              {value:'any', label:'Nezáleží'}
             ]} 
             placeholder="Vyber..." 
           />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Min. Věk</label>
             <input type="number" min="18" max="99" value={formData.prefAgeMin || ''} onChange={(e) => setFormData({...formData, prefAgeMin: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Od" />
           </div>
           <div>
             <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Max. Věk</label>
             <input type="number" min="18" max="99" value={formData.prefAgeMax || ''} onChange={(e) => setFormData({...formData, prefAgeMax: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" placeholder="Do" />
           </div>
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl space-y-6 transition-all">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Životní návyky</h4>
      <PreferenceSelector tooltipText="Nekuřáci si často s kuřáky nerozumí. Zadej svou preferenci." label="Kouření u partnera" value={formData.prefSmoking as any} onChange={(v) => setFormData({...formData, prefSmoking: v as any})} options={[{value:'no', label:'Nekuřák'}, {value:'yes', label:'Kuřák'}, {value:'vape', label:'Vape/Iqos'}, {value:'any', label:'Nezáleží / Neřeším'}]} />
      <PreferenceSelector tooltipText="Párty život nebo klid na gauči? Alkohol může být pro někoho dealbreaker." label="Pití alkoholu u partnera" value={formData.prefDrinking as any} onChange={(v) => setFormData({...formData, prefDrinking: v as any})} options={[{value:'no', label:'Abstinent'}, {value:'social', label:'Příležitostně'}, {value:'regular', label:'Často'}, {value:'any', label:'Nezáleží / Neřeším'}]} />
    </div>
  </motion.div>
);

export const Step3Character = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Povaha a Charakter</h4>
    </div>
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl mb-8 transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Moje povaha (Jaký/á jsem)</h4>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Vyber, co tě nejlépe vystihuje
          <InfoTooltip text="Flegmatik: Nenechá se snadno rozhodit. Empatický: Dokáže se vcítit do druhých. Ambiciózní: Jde tvrdě za svými cíli. Romantik: Má rád gesta, překvapení a city." />
        </label>
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

      <div className="mt-6">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Povaha, kterou hledám u partnera
          <InfoTooltip text="Jaké povahové rysy ti u partnera nejvíce imponují? Algoritmus tě přednostně spojí s lidmi, kteří se takto popsali." />
        </label>
        <CustomSelect isMulti={true} value={formData.partnerTraits || []} onChange={(val) => setFormData({ ...formData, partnerTraits: val })} placeholder="Hledám partnera, který je..." options={[
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
      
      <div className="mt-6">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Životní Motto
          <InfoTooltip text="Krátká věta, která tě vystihuje. Ukáže se hned pod tvojí fotkou." />
        </label>
        <input 
          type="text" 
          value={formData.motto || ''} 
          onChange={(e) => setFormData({...formData, motto: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" 
          placeholder="Např. Žij a nechej žít..." 
          maxLength={60}
        />
      </div>

      <div className="mt-6">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Zásadovost (Přístup k životu)
          <InfoTooltip text="Jsi člověk pevných zásad, nebo bereš život s absolutním nadhledem?" />
        </label>
        <CustomSelect 
          value={formData.principles || ""} 
          onChange={(v) => setFormData({...formData, principles: v as string})} 
          options={[
            {value:'strict', label:'Jsem silně zásadový člověk (Pravidla jsou důležitá)'}, 
            {value:'balanced', label:'Mám své hodnoty, ale jsem flexibilní'}, 
            {value:'free', label:'Beru život jak jde (Nic mi nevadí, jsem free)'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
      <div className="mt-6">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Národnost / Etnikum (Volitelné)
          <InfoTooltip text="Můžeš uvést svou národnost (např. Češka, Slovák, 50% Čech / 50% Ital), pokud je to pro tebe důležité." />
        </label>
        <input 
          type="text" 
          value={formData.nationality || ''} 
          onChange={(e) => setFormData({...formData, nationality: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" 
          placeholder="Např. 100% Čech, napůl Slovenka..." 
        />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl transition-all">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Preference u partnera</h4>
      
      <div className="mb-6">
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Celkový Vibe (Koho vlastně hledám?)
          <InfoTooltip text="Někdo chce hodného kluka/holku, někdo bad boye/girl. Neboj se být upřímný/á." />
        </label>
        <CustomSelect 
          value={formData.partnerVibe || ""} 
          onChange={(v) => setFormData({...formData, partnerVibe: v as string})} 
          options={[
            {value:'nice', label:'Hodný, slušný a spolehlivý člověk ("Nice Guy/Girl")'}, 
            {value:'bad', label:'Zlý kluk / holka ("Bad Boy / Bad Girl") - chci jiskru'}, 
            {value:'boss', label:'Nezávislý boss / frajer(ka), co ví co chce'},
            {value:'weirdo', label:'Někdo trochu divný a svůj ("Weirdo / Nerd")'},
            {value:'any', label:'Hlavně ať přeskočí jiskra (Nezáleží na typu)'}
          ]} 
          placeholder="Vyber vibe..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TraitSelector label="Upřímnost" tooltipText="Základ dobrého vztahu pro většinu, ale každý to má jinak." value={formData.characterTraits?.honesty} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, honesty: val as any } })} />
        <TraitSelector label="Věrnost" tooltipText="Někdo preferuje otevřené vztahy, algoritmus to zohlední." value={formData.characterTraits?.loyalty} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, loyalty: val as any } })} />
        <TraitSelector label="Smysl pro humor" tooltipText="Sdílený humor je klíč ke šťastnému soužití." value={formData.characterTraits?.humor} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, humor: val as any } })} />
        <TraitSelector label="Spolehlivost" tooltipText="Potřebuješ se na druhého spolehnout na 100%?" value={formData.characterTraits?.reliability} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, reliability: val as any } })} />
        <TraitSelector label="Empatie" tooltipText="Schopnost druhého vnímat tvé emoce." value={formData.characterTraits?.empathy} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, empathy: val as any } })} />
        <TraitSelector label="Ambice" tooltipText="Ambiciózní partneři většinou hledají stejně smýšlející." value={formData.characterTraits?.ambition} onChange={(val) => setFormData({ ...formData, characterTraits: { ...formData.characterTraits, ambition: val as any } })} />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Sociální baterie</label>
        <CustomSelect value={formData.socialBattery || ""} onChange={(val) => setFormData({ ...formData, socialBattery: val })} placeholder="Vyber..." options={[{ value: "Extrovert", label: "Extrovert" }, { value: "Introvert", label: "Introvert" }, { value: "Ambivert", label: "Ambivert" }]} />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Osobnostní dynamika</label>
        <CustomSelect value={formData.personalityDynamics || ""} onChange={(val) => setFormData({ ...formData, personalityDynamics: val })} placeholder="Vyber..." options={[{ value: "Dominantní", label: "Dominantní" }, { value: "Submisivní", label: "Submisivní" }, { value: "Switch", label: "Přepínač (Switch)" }, { value: "Egalitarian", label: "Rovnocenný" }]} />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Sebevědomí
          <InfoTooltip text="Jak vnímáš svou pozici na seznamovacím trhu? Pomáhá nám to lépe nastavit algoritmus." />
        </label>
        <CustomSelect 
          value={formData.egoScore !== undefined ? formData.egoScore.toString() : "50"} 
          onChange={(val) => setFormData({ ...formData, egoScore: parseInt(val) })} 
          placeholder="Jak to vnímáš?" 
          options={[
            { value: "85", label: "Můžu si vybírat" }, 
            { value: "50", label: "Průměrný úspěch" }, 
            { value: "20", label: "Je to těžký boj" }
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
    {/* NEURODIVERZITA A SPECIFIKA */}
    <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-yellow-400 uppercase tracking-widest text-sm mb-4">
        Neurodiverzita a Specifika (Volitelné)
      </h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Dnešní psychologie a odborná literatura (např. Gábor Maté, Russell Barkley) ukazuje, že neurodiverzita je běžná. Pokud chceš, můžeš sdílet, s čím žiješ, aby ti algoritmus pomohl najít pochopení.
      </p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Diagnózy / Specifika</label>
        <CustomSelect 
          isMulti={true} 
          value={formData.disorders || []} 
          onChange={(v) => setFormData({...formData, disorders: v})} 
          options={[
            {value:'adhd', label:'ADHD (Porucha pozornosti s hyperaktivitou)'}, 
            {value:'add', label:'ADD (Porucha pozornosti)'}, 
            {value:'asd', label:'Porucha autistického spektra (PAS / Asperger)'}, 
            {value:'hsp', label:'Vysoká citlivost (HSP)'},
            {value:'dys', label:'Dyslexie / Dysgrafie / atd.'},
            {value:'anxiety', label:'Úzkostné poruchy'},
            {value:'depression', label:'Sklony k depresím'},
            {value:'bipolar', label:'Bipolární porucha'}
          ]} 
          placeholder="Vyber (jen pokud chceš sdílet)..." 
        />
      </div>
    </div>

    {/* RODINNÁ HISTORIE */}
    <div className="p-6 bg-gradient-to-br from-amber-900/20 to-transparent border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-amber-500 uppercase tracking-widest text-sm mb-4">Rodinná historie a Předci (Volitelné)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Máš v rodokmenu někoho zajímavého? Modrá krev, slavný vynálezce, nebo umělec? Můžeš se o to podělit.
      </p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Slavní nebo významní předci</label>
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
    </div>
    {/* TYPY CITOVÉ VAZBY */}
    <div className="p-6 bg-gradient-to-br from-teal-900/20 to-transparent border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-teal-400 uppercase tracking-widest text-sm mb-4">Typ citové vazby (Attachment Style)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Znáš svůj styl citové vazby z psychologie? Pomůže nám to předejít toxickým vzorcům.
      </p>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Můj styl citové vazby</label>
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

export const Step4Lifestyle = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Životní styl a Bydlení</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Ideální víkend</label>
        <CustomSelect isMulti={true} value={formData.sharedLife?.idealWeekend || []} onChange={(v) => setFormData({...formData, sharedLife: {...formData.sharedLife, idealWeekend: v}})} options={[{value:'home', label:'Doma ve dvou'}, {value:'trip', label:'Výlet do přírody'}, {value:'party', label:'Párty / Město'}, {value:'friends', label:'S přáteli / Rodinou'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Ideální dovolená</label>
        <CustomSelect isMulti={true} value={formData.sharedLife?.idealHoliday || []} onChange={(v) => setFormData({...formData, sharedLife: {...formData.sharedLife, idealHoliday: v}})} options={[{value:'beach', label:'Pláž a odpočinek'}, {value:'explore', label:'Poznávání měst'}, {value:'mountains', label:'Hory a sport'}, {value:'roadtrip', label:'Roadtrip / Dobrodružství'}]} placeholder="Vyber..." />
      </div>
    </div>

    {/* GRADES / EDUCATION */}
    <div className="p-6 bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-blue-400 uppercase tracking-widest text-sm mb-4">Školní léta a Prospěch (Ambice)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Tohle o lidech prozradí víc, než se zdá. Jaký jsi byl student? Nejde o titul, ale o tvůj přístup k povinnostem.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Základní škola</label>
          <CustomSelect 
            value={formData.grades?.elementary || ""} 
            onChange={(v) => setFormData({...formData, grades: {...(formData.grades || {}), elementary: v as string}})} 
            options={[
              {value:'1', label:'Samé jedničky (Bifloš / Premiant)'}, 
              {value:'2', label:'Dvojkař (Dobrý průměr)'}, 
              {value:'3', label:'Trojkař a horší (Škola mě nebavila)'},
              {value:'4', label:'Propadal(a) jsem / Odřené uši'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Střední škola</label>
          <CustomSelect 
            value={formData.grades?.highSchool || ""} 
            onChange={(v) => setFormData({...formData, grades: {...(formData.grades || {}), highSchool: v as string}})} 
            options={[
              {value:'1', label:'Samé jedničky (Bifloš / Premiant)'}, 
              {value:'2', label:'Dvojkař (Dobrý průměr)'}, 
              {value:'3', label:'Trojkař a horší (Škola mě nebavila)'},
              {value:'4', label:'Propadal(a) jsem / Odřené uši'},
              {value:'none', label:'Nechodil(a) / Nedokončeno'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Vysoká škola</label>
          <CustomSelect 
            value={formData.grades?.university || ""} 
            onChange={(v) => setFormData({...formData, grades: {...(formData.grades || {}), university: v as string}})} 
            options={[
              {value:'1', label:'Červený diplom / Excelentní'}, 
              {value:'2', label:'Zlatý střed (Dvojkař)'}, 
              {value:'3', label:'Prolézal(a) jsem / Ztráta času'},
              {value:'none', label:'Nestudoval(a) jsem VŠ'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/5 to-transparent border border-mafia-gold/20 rounded-xl mt-8">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Moje Rituály (Zvyky)</h4>
      <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Vyber věci, které děláš pravidelně</label>
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

    {/* Zájmy pro Vouchery a Matchování */}
    <div className="p-6 bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-green-400 uppercase tracking-widest text-sm mb-4">Oblíbené věci (Tipy na rande)</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">
        Vyplň své preference. Algoritmus pak tobě a tvému Matchi dokáže vygenerovat slevové vouchery do partnerských podniků přesně podle vašeho vkusu!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Oblíbené Jídlo</label>
          <CustomSelect 
            isMulti={true}
            value={formData.favoriteFood || []} 
            onChange={(v) => setFormData({...formData, favoriteFood: v})} 
            options={[
              {value:'italian', label:'🍕 Italská kuchyně'}, 
              {value:'asian', label:'🥢 Asijská / Sushi'}, 
              {value:'burgers', label:'🍔 Burgery / Fastfood'},
              {value:'czech', label:'🍺 Klasická česká'},
              {value:'vegan', label:'🥗 Veganská / Zdravá'},
              {value:'steak', label:'🥩 Steaky a maso'}
            ]} 
            placeholder="Vyber (můžeš více)..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Oblíbené Pití</label>
          <CustomSelect 
            isMulti={true}
            value={formData.favoriteDrink || []} 
            onChange={(v) => setFormData({...formData, favoriteDrink: v})} 
            options={[
              {value:'wine', label:'🍷 Víno'}, 
              {value:'beer', label:'🍺 Pivo'}, 
              {value:'cocktails', label:'🍹 Míchané drinky'},
              {value:'coffee', label:'☕ Káva'},
              {value:'tea', label:'🍵 Čaj'},
              {value:'water', label:'💧 Jen voda / Nealko'}
            ]} 
            placeholder="Vyber (můžeš více)..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Sporty a Aktivity</label>
          <CustomSelect 
            isMulti={true}
            value={formData.sports || []} 
            onChange={(v) => setFormData({...formData, sports: v})} 
            options={[
              {value:'gym', label:'💪 Fitko / Posilování'}, 
              {value:'cycling', label:'🚴 Cyklistika'}, 
              {value:'skate', label:'🛹 Skateboarding / BMX'},
              {value:'running', label:'🏃 Běh'},
              {value:'yoga', label:'🧘 Jóga / Pilates'},
              {value:'team', label:'⚽ Týmové sporty (Fotbal, Hokej)'}
            ]} 
            placeholder="Vyber (můžeš více)..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Hudební vkus</label>
          <CustomSelect 
            isMulti={true}
            value={formData.musicGenres || []} 
            onChange={(v) => setFormData({...formData, musicGenres: v})} 
            options={[
              {value:'rock', label:'🎸 Rock'}, 
              {value:'punk', label:'🛹 Punk / Emo'}, 
              {value:'pop', label:'🎤 Pop'},
              {value:'rap', label:'🧢 Rap / HipHop'},
              {value:'edm', label:'🎧 Elektronika / EDM'},
              {value:'metal', label:'🤘 Metal'},
              {value:'classical', label:'🎻 Klasika / Jazz'}
            ]} 
            placeholder="Vyber (můžeš více)..." 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Koníčky a Zájmy (Detail)</label>
          <CustomSelect 
            isMulti={true}
            value={formData.hobbiesDetailed || []} 
            onChange={(v) => setFormData({...formData, hobbiesDetailed: v})} 
            options={[
              {value:'traveling', label:'✈️ Cestování a Výlety'}, 
              {value:'cooking', label:'🍳 Vaření a Gastronomie'}, 
              {value:'cars', label:'🏎️ Auta / Tuning / Rally'},
              {value:'car_repair', label:'🔧 Oprava aut / Mechanika'},
              {value:'barbering', label:'✂️ Stříhání / Barbering / Beauty'},
              {value:'modeling_craft', label:'🚁 Modelářství'},
              {value:'pets', label:'🐕 Zvířata / Pejskařství'},
              {value:'photography', label:'📸 Focení'},
              {value:'diy', label:'🔨 Kutilství / DIY'}
            ]} 
            placeholder="Vyber hlavní koníčky (můžeš více)..." 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Květiny / Drobnosti (Ideální pro překvapení)</label>
          <CustomSelect 
            isMulti={true}
            value={formData.favoriteFlowers || []} 
            onChange={(v) => setFormData({...formData, favoriteFlowers: v})} 
            options={[
              {value:'roses', label:'🌹 Růže'}, 
              {value:'sunflowers', label:'🌻 Slunečnice'}, 
              {value:'lilies', label:'🌸 Lilie / Orchideje'},
              {value:'tulips', label:'🌷 Tulipány'},
              {value:'chocolate', label:'🍫 Raději čokoládu'},
              {value:'none', label:'🚫 Květiny nevyžaduji'}
            ]} 
            placeholder="Vyber (můžeš více)..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-indigo-400 uppercase tracking-widest text-sm mb-4">Herní doupě (Volitelné)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Co hraješ za hry?</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Herní Nickname (IGN)</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Kde chci žít?</label>
          <CustomSelect value={formData.housing?.locationPref || ""} onChange={(v) => setFormData({...formData, housing: {...formData.housing, locationPref: v}})} options={[{value:'city', label:'Velké město'}, {value:'suburb', label:'Okraj města'}, {value:'village', label:'Vesnice / Samota'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Ochota se stěhovat za partnerem?</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Vztah k sítím (Screen Time)</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Zlozvyky a Guilty Pleasures</label>
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

export const Step5CommLove = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Komunikace a Řešení konfliktů</h4>
    </div>
    
    <div className="space-y-6">
      <TraitSelector label="Důležitost každodenního psaní" value={formData.communication?.dailyTexting} onChange={(v) => setFormData({...formData, communication: {...formData.communication, dailyTexting: v as any}})} />
      <TraitSelector label="Otevřenost o pocitech" value={formData.communication?.openFeelings} onChange={(v) => setFormData({...formData, communication: {...formData.communication, openFeelings: v as any}})} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Jak často jsi na telefonu?</label>
          <CustomSelect value={formData.communication?.contactFreq || ""} onChange={(v) => setFormData({...formData, communication: {...formData.communication, contactFreq: v}})} options={[{value:'constant', label:'Píšu hned a pořád'}, {value:'regular', label:'Pravidelně během dne'}, {value:'slow', label:'Odepisuji klidně až za pár hodin / dní'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">Volání vs. Psaní</label>
          <CustomSelect value={formData.communication?.callsVsTexts || ""} onChange={(v) => setFormData({...formData, communication: {...formData.communication, callsVsTexts: v}})} options={[{value:'calls', label:'Radši hned volám'}, {value:'texts', label:'Radši píšu (volání mě stresuje)'}, {value:'both', label:'Obojí je fajn'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-red-900/30 to-red-950/20 border border-red-500/30 hover:border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.1)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-red-500 uppercase tracking-widest text-sm mb-4">Když se pohádáme...</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Já většinou:</label>
          <CustomSelect 
            value={formData.conflicts?.myReaction || ""} 
            onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, myReaction: v}})} 
            options={[
              {value:'talk_it_out', label:'Vyříkejme si to narovinu a hned'}, 
              {value:'leave', label:'Odejdu a nebudu to řešit (vyhýbám se)'},
              {value:'space', label:'Potřebuji čas a klid na rozmyšlenou'}, 
              {value:'compromise', label:'Vždy hledám kompromis a dohodu'}, 
              {value:'emotional', label:'Jsem hodně emotivní (vybuchnu)'},
              {value:'silent', label:'Tichá domácnost (přestanu mluvit)'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Od partnera potřebuji:</label>
          <CustomSelect 
            isMulti={true} 
            value={formData.conflicts?.iNeedFromPartner || []} 
            onChange={(v) => setFormData({...formData, conflicts: {...formData.conflicts, iNeedFromPartner: v}})} 
            options={[
              {value:'space', label:'Prostor'}, 
              {value:'communication', label:'Otevřenou komunikaci'}, 
              {value:'apology', label:'Omluvu a uznání chyby'}, 
              {value:'hugs', label:'Fyzickou blízkost a pohlazení'},
              {value:'solution', label:'Racionální řešení problému'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>


    {/* JAZYKY LÁSKY A DEALBREAKERS */}
    <div className="p-6 bg-gradient-to-br from-fuchsia-900/20 to-transparent border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-fuchsia-400 uppercase tracking-widest text-sm mb-4">Jazyky lásky a Dealbreakers</h4>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Pět jazyků lásky (Co je pro tebe nejdůležitější?)</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 text-red-400">Ultimátní Dealbreakers (Přes co vlak nejede)</label>
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
        
        <div className="pt-4 border-t border-white/10">
          <label className="flex items-start gap-4 cursor-pointer">
            <div className="pt-1">
              <input 
                type="checkbox" 
                checked={formData.careAboutPartnerPast || false} 
                onChange={(e) => setFormData({...formData, careAboutPartnerPast: e.target.checked})} 
                className="w-5 h-5 accent-fuchsia-500" 
              />
            </div>
            <div>
              <span className="block text-sm font-bold text-fuchsia-400 uppercase tracking-widest mb-1">
                Zajímá mě reputace a minulost partnera
              </span>
              <span className="block text-xs font-mono text-white/60">
                Zaškrtni, pokud je pro tebe důležité vědět, jakou má partner pověst nebo jakou má za sebou minulost (počet partnerů, drby atd.).
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>

    {/* VZKAZ A VÁŽNÝ ZÁMĚR */}
    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 hover:border-mafia-gold/50 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Vzkaz pro protějšek a Záměr</h4>
      
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Co bych chtěl/a vzkázat svému protějšku?
          <InfoTooltip text="Napiš sem pár slov, co od něj/ní očekáváš nebo co by měl/a vědět hned na začátek." />
        </label>
        <textarea 
          value={formData.messageToMatch || ''} 
          onChange={(e) => setFormData({...formData, messageToMatch: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold resize-none h-24" 
          placeholder="Např. Hledám někoho, s kým můžu procestovat svět, ale i mlčet doma u Netflixu..." 
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <label className="flex items-start gap-4 cursor-pointer">
          <div className="pt-1">
            <input 
              type="checkbox" 
              checked={formData.seriousIntent || false} 
              onChange={(e) => setFormData({...formData, seriousIntent: e.target.checked})} 
              className="w-5 h-5 accent-mafia-gold" 
            />
          </div>
          <div>
            <span className="block text-sm font-bold text-mafia-gold uppercase tracking-widest mb-1">
              Myslím to vážně (Vážný vztah / Svatba)
            </span>
            <span className="block text-xs font-mono text-white/60">
              Pokud zaškrtneš, algoritmus tě upřednostní pro lidi, kteří také hledají vážný závazek a dlouhodobý vztah.
            </span>
          </div>
        </label>
      </div>
    </div>
  </motion.div>
);


export const Step6FutureKids = ({ formData, setFormData, lang }: StepProps) => {
  const [showKinkGuide, setShowKinkGuide] = React.useState(false);
  const hasKinks = formData.nsfwCategories && formData.nsfwCategories.length > 0;

  return (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Budoucnost, Rodina a Vztahy</h4>
    </div>

    <div className="p-6 bg-gradient-to-br from-mafia-gold/10 to-transparent border border-mafia-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.05)] rounded-xl space-y-6">
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Postoj k rodině</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Máš děti?</label>
           <CustomSelect value={formData.hasKids || "no"} onChange={(v) => setFormData({...formData, hasKids: v as any})} options={[{value:'no', label:'Ne'}, {value:'yes', label:'Ano'}]} placeholder="Vyber..." />
        </div>
        <div>
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Postoj k dětem (Ty)</label>
           <CustomSelect value={formData.prefKids?.value || ""} onChange={(v) => setFormData({...formData, prefKids: {...(formData.prefKids || {importance: 'medium'}), value: v}})} options={[{value:'want', label:'Chci děti'}, {value:'dont_want', label:'Nechci děti'}, {value:'have_and_want_more', label:'Mám a chci další'}, {value:'have_and_dont_want_more', label:'Mám, další nechci'}, {value:'not_sure', label:'Zatím nevím'}]} placeholder="Vyber..." />
        </div>
        <div className="md:col-span-2">
           <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Postoj k dětem (U partnera)</label>
           <CustomSelect value={formData.kidsDetailed?.partnerWithKids || "any"} onChange={(v) => setFormData({...formData, kidsDetailed: {...(formData.kidsDetailed || {}), partnerWithKids: v}})} options={[{value:'no_kids', label:'Nechci, aby partner měl děti z dřívějška'}, {value:'dont_mind', label:'Nevadí mi, pokud má děti'}, {value:'any', label:'Nezáleží mi na tom'}]} placeholder="Vyber..." />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.02)] rounded-xl mt-8 space-y-6 transition-all">
      <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4">Cíle ve vztahu</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-mono text-white/60 uppercase tracking-widest">Očekávaný vztah</label>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
             <button 
               type="button"
               onClick={() => setFormData({...formData, lookingFor: ['marriage', 'serious']})}
               className="px-3 py-1.5 bg-black/40 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-[10px] font-mono text-white hover:text-mafia-gold rounded-md uppercase tracking-widest transition-colors"
             >
               💍 Jen vážně
             </button>
             <button 
               type="button"
               onClick={() => setFormData({...formData, lookingFor: ['fun', 'fwb', 'ons', 'clubbing']})}
               className="px-3 py-1.5 bg-black/40 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-[10px] font-mono text-white hover:text-mafia-gold rounded-md uppercase tracking-widest transition-colors"
             >
               🥂 Jdu se bavit
             </button>
             <button 
               type="button"
               onClick={() => setFormData({...formData, lookingFor: ['marriage', 'serious', 'fun', 'fwb', 'ons', 'plus_one', 'clubbing']})}
               className="px-3 py-1.5 bg-black/40 hover:bg-mafia-gold/20 border border-white/10 hover:border-mafia-gold/50 text-[10px] font-mono text-white hover:text-mafia-gold rounded-md uppercase tracking-widest transition-colors"
             >
               ✨ Otevřen(a) všemu
             </button>
             <button 
               type="button"
               onClick={() => setFormData({...formData, lookingFor: ['idk']})}
               className="px-3 py-1.5 bg-black/40 hover:bg-slate-500/20 border border-white/10 hover:border-slate-500/50 text-[10px] font-mono text-white hover:text-slate-400 rounded-md uppercase tracking-widest transition-colors"
             >
               🤷 Nevím, co chci
             </button>
          </div>

          <CustomSelect 
            isMulti={true}
            value={formData.lookingFor || []} 
            onChange={(v) => setFormData({...formData, lookingFor: v})} 
            options={[
              {value:'marriage', label:'Vážný vztah a svatba'}, 
              {value:'serious', label:'Vážný vztah'}, 
              {value:'fun', label:'Nezávazně (Flirt)'},
              {value:'fwb', label:'Kamarádi s výhodami (FWB)'},
              {value:'ons', label:'Na jednu noc (ONS)'},
              {value:'plus_one', label:'Doprovod na akci / +1'},
              {value:'clubbing', label:'Parťák do klubu / na párty'},
              {value:'idk', label:'Nevím, co chci (Zatím objevuji)'}
            ]} 
            placeholder="Vyber (můžeš zakliknout více)..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Přístup k randění (Exkluzivita)
            <InfoTooltip text="Jak aktuálně randíš? Jsi věrný jedné osobě hned od začátku, nebo poznáváš více lidí naráz?" />
          </label>
          <CustomSelect 
            value={formData.datingStyle || "exclusive"} 
            onChange={(v) => setFormData({...formData, datingStyle: v as any})} 
            options={[
              {value:'exclusive', label:'Exkluzivně (Zajímá mě jen jedna osoba)'}, 
              {value:'multiple', label:'Randím s více lidmi zároveň'},
              {value:'polyamory', label:'Polyamorie (Hledám/mám více partnerů)'}
            ]} 
            placeholder="Vyber svůj přístup..." 
          />
        </div>
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] rounded-xl mt-8 space-y-6">
      <h4 className="font-heading font-black text-red-400 uppercase tracking-widest text-sm mb-4">Minulost a Body Count</h4>
      <p className="text-white/50 text-[10px] font-mono leading-relaxed mb-4">Počet minulých partnerů může být pro někoho důležitý, pro jiného red flag. Tato informace je defaultně skrytá. Odkryje se POUZE TEHDY, pokud ty i tvůj protějšek máte oba nastaveno "Vzájemné odhalení" a dojde k Matchi.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Počet minulých partnerů (Body Count)</label>
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
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>Speciální kategorie (Volitelné)</span>
          {hasKinks && (
            <button 
              onClick={() => setShowKinkGuide(true)} 
              className="text-[10px] bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 hover:bg-purple-500/40 transition-colors uppercase tracking-widest font-black"
            >
              Průvodce
            </button>
          )}
        </label>
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
            {value:'sugar', label:'Hledám sponzoring / Sugar dating'},
            {value:'lgbtq', label:'LGBTQ+ Komunita'},
            {value:'companion', label:'Společnice / Společník'},
            {value:'stripper', label:'Striptér / Striptérka'},
            {value:'crossdressing', label:'Crossdressing / Sissy'},
            {value:'onlyfans', label:'OnlyFans / Tvůrce obsahu'}
          ]} 
          placeholder="Vyber (pokud něco z toho hledáš)..." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-purple-500/20">
        <div className="md:col-span-2">
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">
            Intimní styl (Jak si užíváš sex)
          </label>
          <CustomSelect 
            value={formData.intimacyStyle || ""} 
            onChange={(v) => setFormData({...formData, intimacyStyle: v as string})} 
            options={[
              {value:'gentle', label:'Něžný, pomalý a romantický'}, 
              {value:'passionate', label:'Vášnivý a tvrdý'}, 
              {value:'dominant', label:'Rád(a) dominuji'},
              {value:'submissive', label:'Jsem submisivní'},
              {value:'experimental', label:'Rád(a) experimentuji'},
              {value:'vanilla', label:'Klasika (Vanilla)'}
            ]} 
            placeholder="Diskrétní volba..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Fyzická vybavenost (Moje)
            <InfoTooltip text="Absolutně diskrétní parametr. Slouží jen k propojení s partnerem/partnerkou, pro koho je to důležité." />
          </label>
          <CustomSelect 
            value={formData.physicalSize || ""} 
            onChange={(v) => setFormData({...formData, physicalSize: v as string})} 
            options={[
              {value:'smaller', label:'Kratší / Menší proporce'}, 
              {value:'average', label:'Průměr / Zlatý střed'}, 
              {value:'above_average', label:'Nadprůměr'},
              {value:'large', label:'Velký / Velké proporce'},
              {value:'hidden', label:'Nechci uvádět'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Fyzická preference (U partnera)
          </label>
          <CustomSelect 
            value={formData.physicalPreference || ""} 
            onChange={(v) => setFormData({...formData, physicalPreference: v as string})} 
            options={[
              {value:'smaller', label:'Kratší / Menší proporce'}, 
              {value:'average', label:'Průměr / Zlatý střed'}, 
              {value:'above_average', label:'Nadprůměr'},
              {value:'large', label:'Velký / Velké proporce'},
              {value:'any', label:'Nezáleží na tom'}
            ]} 
            placeholder="Vyber..." 
          />
        </div>
      </div>
    </div>
  </motion.div>
  );
};

export const Step7ValuesMoney = ({ formData, setFormData, lang }: StepProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
    <div className="text-center mb-6">
      <h4 className="text-mafia-gold font-heading font-black uppercase tracking-widest text-lg">Hodnoty a Finance</h4>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Náboženství a Víra</label>
        <CustomSelect value={formData.values?.religion || ""} onChange={(v) => setFormData({...formData, values: {...formData.values, religion: v}})} options={[{value:'atheist', label:'Ateista'}, {value:'spiritual', label:'Spiritualista'}, {value:'christian', label:'Křesťan'}, {value:'other', label:'Jiné'}]} placeholder="Vyber..." />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-mafia-gold/20">
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
          Příjem / Zázemí
          <InfoTooltip text="Pro někoho peníze neznamenají nic, jiný hledá stabilitu." />
        </label>
        <CustomSelect 
          value={formData.incomeLevel || ""} 
          onChange={(v) => setFormData({...formData, incomeLevel: v as string})} 
          options={[
            {value:'student', label:'🎓 Jsem student'}, 
            {value:'low', label:'🌱 Skromný (Vyžiju)'}, 
            {value:'average', label:'⚖️ Zlatý střed (Normál)'}, 
            {value:'high', label:'💼 Zajištěný / Nadprůměr'},
            {value:'rich', label:'👑 Finančně nezávislý'}
          ]} 
          placeholder="Vyber (Volitelné)..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">
          Moje Kariéra / Firma
        </label>
        <input 
          type="text" 
          value={formData.company || ''} 
          onChange={(e) => setFormData({...formData, company: e.target.value})} 
          className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-mafia-gold" 
          placeholder="Např. Kadeřník, OSVČ, Lékař..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">
          Vztah k mé práci
        </label>
        <CustomSelect 
          value={formData.jobSatisfaction || ""} 
          onChange={(v) => setFormData({...formData, jobSatisfaction: v as string})} 
          options={[
            {value:'love_it', label:'Miluju to (Moje práce je mým koníčkem)'}, 
            {value:'good', label:'Baví mě to, ale je to jen práce'}, 
            {value:'just_money', label:'Chodím tam jen vydělat peníze'},
            {value:'change', label:'Hledám změnu / Nebaví mě to'}
          ]} 
          placeholder="Vyber..." 
        />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Hodnoty</label>
        <CustomSelect value={formData.values?.traditionalVsModern || ""} onChange={(v) => setFormData({...formData, values: {...formData.values, traditionalVsModern: v}})} options={[{value:'traditional', label:'Tradiční'}, {value:'modern', label:'Moderní / Liberální'}]} placeholder="Vyber..." />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Kariéra vs. Život</label>
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
      <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4">Peníze a Rozdělení rolí</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Můj přístup k penězům</label>
          <CustomSelect value={formData.moneyDetailed?.myAttitude || ""} onChange={(v) => setFormData({...formData, moneyDetailed: {...formData.moneyDetailed, myAttitude: v}})} options={[{value:'saver', label:'Spořivý'}, {value:'balanced', label:'Vyvážený'}, {value:'experiences', label:'Utrácím za zážitky'}, {value:'luxury', label:'Rád si dopřávám luxus'}]} placeholder="Vyber..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Představa financování (i při rodině)</label>
          <CustomSelect 
            value={formData.moneyDetailed?.sharedAccount || ""} 
            onChange={(v) => setFormData({...formData, moneyDetailed: {...formData.moneyDetailed, sharedAccount: v}})} 
            options={[
              {value:'50_50', label:'Vše striktně 50/50'}, 
              {value:'traditional', label:'Tradiční (Muž víc živí, žena pečuje / je na mateřské)'}, 
              {value:'flexible', label:'Záleží kdo vydělá víc (klidně muž na rodičovské)'},
              {value:'separate', label:'Každý sám za sebe'}
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Počet minulých partnerů (Body Count)</label>
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
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3">Tvé tajné přání / Fantazie</label>
          <input type="text" value={formData.secretDesires || ''} onChange={(e) => setFormData({...formData, secretDesires: e.target.value})} className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:border-purple-400 rounded-md" placeholder="Např. chci letět na měsíc..." />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/60 uppercase tracking-widest mb-3 flex items-center">
            Odhalit po Matchi?
          </label>
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
