"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Flame, Crown, Eye, Zap, Crosshair, Star, Shield, Lock, CheckCircle2, MessageSquare, Hand, Brain, Coffee, ArrowUpCircle } from 'lucide-react';
import { playSound } from '@/utils/audio';

export interface SkillNode {
  id: string;
  title: { cs: string; en: string };
  desc: { cs: string; en: string };
  icon: React.ElementType;
  requiredFragments: number;
  position: { x: number; y: number }; // Relative positions (0-100)
  dependencies?: string[];
  statBoost?: string;
  maxLevel: number;
  loreLevels: { cs: string; en: string }[];
}

// Helper to generate future placeholder texts for higher levels
const generateFutureLore = (levelIndex: number) => ({
  cs: `[TENTO ZÁZNAM ČEKÁ NA DEŠIFROVÁNÍ V RÁMCI BUDOUCÍ AKTUALIZACE. POŽADOVÁNA ÚROVEŇ OPRÁVNĚNÍ: OMEGA-${levelIndex + 2}]`,
  en: `[THIS RECORD IS AWAITING DECRYPTION IN A FUTURE UPDATE. CLEARANCE LEVEL REQUIRED: OMEGA-${levelIndex + 2}]`
});

export const TOMAS_SKILLS: SkillNode[] = [
  // TIER 1 - Základy (0-1 fragment)
  {
    id: "root_basics",
    title: { cs: "Základy Řemesla", en: "Basics of the Craft" },
    desc: { cs: "Úplný počátek. Ostré nůžky a pevná ruka.", en: "The absolute beginning. Sharp scissors and a steady hand." },
    icon: Scissors,
    requiredFragments: 0,
    maxLevel: 5,
    loreLevels: [
      { cs: "V počátcích se Tomáš učil rozpoznat, jak nůžky zní, když procházejí vlasy. Byl to víc trénink uší než rukou.", en: "In the beginning, Tomas learned to recognize how scissors sound when passing through hair. It was more ear training than hand training." },
      { cs: "Ostrá čepel se stala prodloužením jeho vlastních prstů. Už ani nepotřebuje hřeben k určení délky vlasu.", en: "The sharp blade became an extension of his own fingers. He no longer needs a comb to determine hair length." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 50, y: 90 },
  },
  
  // TIER 2 - Praxe (2 fragmenty)
  {
    id: "fade_master",
    title: { cs: "Přesný Fade", en: "Precision Fade" },
    desc: { cs: "Stíny přecházející plynule do ztracena.", en: "Shadows fading seamlessly into nothingness." },
    icon: Crosshair,
    requiredFragments: 2,
    maxLevel: 5,
    loreLevels: [
      { cs: "Dokáže udělat jemný přechod pomocí hmatu, téměř poslepu.", en: "Can make a gentle transition using touch, almost blindfolded." },
      { cs: "Fade tak přesný, že vypadá jako optický klam vytvořený stínem samotné reality.", en: "A fade so precise it looks like an optical illusion created by the shadow of reality itself." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 30, y: 75 },
    dependencies: ["root_basics"],
  },
  {
    id: "razor_edge",
    title: { cs: "Klasická Břitva", en: "Classic Razor" },
    desc: { cs: "Tradiční holení bez kompromisů.", en: "Traditional shaving without compromises." },
    icon: Flame,
    requiredFragments: 2,
    maxLevel: 5,
    loreLevels: [
      { cs: "Pocit studené oceli na krku budí u zákazníků respekt i absolutní důvěru.", en: "The feeling of cold steel on the neck inspires respect and absolute trust in customers." },
      { cs: "Nezáleží na úhlu tváře. Zlatá břitva klouže po kůži bezchybně, beze stopy zarudnutí.", en: "The angle of the face doesn't matter. The golden razor glides over the skin flawlessly, leaving no trace of redness." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 70, y: 75 },
    dependencies: ["root_basics"],
  },
  {
    id: "hot_towel",
    title: { cs: "Horký Ručník", en: "Hot Towel" },
    desc: { cs: "Relaxační rituál, který otevírá póry.", en: "A relaxing ritual that opens pores." },
    icon: Hand,
    requiredFragments: 2,
    maxLevel: 5,
    loreLevels: [
      { cs: "Správná teplota je klíčem k uvolnění i té nejpřísnější tváře z podsvětí.", en: "The right temperature is the key to relaxing even the sternest face from the underworld." },
      { cs: "Zábal z horkého ručníku teď funguje jako anestetikum. Zákazník ztrácí pojem o čase.", en: "The hot towel wrap now acts as an anesthetic. The customer loses track of time." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 85, y: 80 },
    dependencies: ["root_basics"],
  },
  {
    id: "small_talk",
    title: { cs: "Small Talk", en: "Small Talk" },
    desc: { cs: "Základní konverzace o počasí a fotbale.", en: "Basic conversation about weather and football." },
    icon: MessageSquare,
    requiredFragments: 2,
    maxLevel: 5,
    loreLevels: [
      { cs: "Tomáš si pamatuje každé slovo a dokáže konverzaci udržet i s někým, kdo nemá náladu mluvit.", en: "Tomas remembers every word and can keep a conversation going even with someone who doesn't feel like talking." },
      { cs: "Získává informace. Obyčejný rozhovor o sportu se stává zdrojem cenných informací o dění ve městě.", en: "Extracting intel. A casual talk about sports becomes a source of valuable intel about city affairs." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 15, y: 80 },
    dependencies: ["root_basics"],
  },

  // TIER 3 - Pokročilé (4-5 fragmentů)
  {
    id: "eye_detail",
    title: { cs: "Oko Detailu", en: "Eye for Detail" },
    desc: { cs: "Vidí nedokonalosti, které ostatní přehlíží.", en: "Sees imperfections that others miss." },
    icon: Eye,
    requiredFragments: 4,
    maxLevel: 5,
    loreLevels: [
      { cs: "Dokáže podle asymetrie obočí poznat, že zákazník skrývá tajemství nebo stres.", en: "He can tell by eyebrow asymmetry that the customer is hiding a secret or stress." },
      { cs: "Téměř nadlidská zraková percepce. Každý vlas je viděn jako samostatná entita na bojišti.", en: "Almost superhuman visual perception. Every hair is seen as a separate entity on the battlefield." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 20, y: 55 },
    dependencies: ["fade_master"],
    statBoost: "+15 Vnímavost"
  },
  {
    id: "speed_demon",
    title: { cs: "Bleskové Ruce", en: "Lightning Hands" },
    desc: { cs: "Rychlost, která neubírá na kvalitě.", en: "Speed that doesn't compromise quality." },
    icon: Zap,
    requiredFragments: 5,
    maxLevel: 5,
    loreLevels: [
      { cs: "Zrychluje tempo práce na úkor odpočinku, ale kvalita zůstává na 100%.", en: "Increases work pace at the expense of rest, but quality remains at 100%." },
      { cs: "Klient mrkne a polovina účesu je hotová. Legenda praví, že může ostříhat muže v letu.", en: "The client blinks and half the haircut is done. Legend says he can cut a man mid-flight." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 50, y: 60 },
    dependencies: ["fade_master", "razor_edge"],
  },
  {
    id: "iron_will",
    title: { cs: "Ocelová Vůle", en: "Iron Will" },
    desc: { cs: "Nezlomný přístup k řemeslu i životu.", en: "Unbreakable approach to craft and life." },
    icon: Shield,
    requiredFragments: 4,
    maxLevel: 5,
    loreLevels: [
      { cs: "Ignoruje bolest z hodin strávených na nohou. Soustředí se pouze na dokonalost.", en: "Ignores the pain from hours spent on his feet. Focuses solely on perfection." },
      { cs: "Totální mentální štít. Pokusy o manipulaci se od něj odráží. Plná imunita proti pochybnostem.", en: "Total mental shield. Attempts at manipulation bounce right off. Full immunity to doubt." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 80, y: 55 },
    dependencies: ["razor_edge"],
    statBoost: "+20 Výdrž"
  },
  {
    id: "psychologist",
    title: { cs: "Křeslový Psycholog", en: "Armchair Therapist" },
    desc: { cs: "Zákazníci ti svěřují svá nejhlubší tajemství.", en: "Customers entrust you with their deepest secrets." },
    icon: Brain,
    requiredFragments: 5,
    maxLevel: 5,
    loreLevels: [
      { cs: "Slyšel už přiznání k nevěře i krádeži. Mlčí jako hrob, pamatuje si všechno.", en: "He has heard confessions of infidelity and theft. Silent as a grave, remembers everything." },
      { cs: "Umí vyřešit zákazníkův životní problém během 30 minut střihu pomocí čtyř dobře mířených otázek.", en: "Can solve a customer's life crisis during a 30-minute cut using four well-placed questions." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 10, y: 65 },
    dependencies: ["small_talk"],
    statBoost: "+10 Empatie"
  },
  {
    id: "coffee_master",
    title: { cs: "Kávový Rituál", en: "Coffee Ritual" },
    desc: { cs: "Perfektní espresso, které probudí i mrtvého.", en: "Perfect espresso that wakes the dead." },
    icon: Coffee,
    requiredFragments: 4,
    maxLevel: 5,
    loreLevels: [
      { cs: "Znalost skrytých pražíren dává kávě mafiánský podtón moci a dominance.", en: "Knowledge of hidden roasteries gives the coffee a mafia undertone of power and dominance." },
      { cs: "Tato káva je návyková. Někteří zákazníci chodí na úpravu vlasů i když už nemají vlasy.", en: "This coffee is addictive. Some customers come for a haircut even when they have no hair left." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 90, y: 65 },
    dependencies: ["hot_towel"],
  },

  // TIER 4 - Mistrovství (7-8 fragmentů)
  {
    id: "mafia_charisma",
    title: { cs: "Charisma Mafiána", en: "Mafia Charisma" },
    desc: { cs: "Zákazníci se vrací kvůli respektu, ne jen kvůli vlasům.", en: "Customers return for respect, not just hair." },
    icon: Star,
    requiredFragments: 7,
    maxLevel: 5,
    loreLevels: [
      { cs: "Stačí pohled a celá místnost ztichne. Jeho přítomnost mění atmosféru.", en: "A mere glance and the room goes quiet. His presence changes the atmosphere." },
      { cs: "Slova už nejsou potřeba. Aura absolutní moci a elegance z něj činí nekorunovaného bosse ulice.", en: "Words are no longer needed. The aura of absolute power and elegance makes him the uncrowned boss of the street." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 30, y: 35 },
    dependencies: ["eye_detail", "speed_demon", "psychologist"],
    statBoost: "+50 Respekt"
  },
  {
    id: "master_mentor",
    title: { cs: "Role Mentora", en: "Mentor Role" },
    desc: { cs: "Předávání tvrdých lekcí dalším generacím.", en: "Passing hard lessons to the next generation." },
    icon: Crown,
    requiredFragments: 7,
    maxLevel: 5,
    loreLevels: [
      { cs: "Vytváří síť loajálních stoupenců. Jeho učni by pro něj zemřeli.", en: "Creates a network of loyal followers. His apprentices would die for him." },
      { cs: "Stává se institucí. MMBarber už není jen holičství, je to škola života s vlastními pravidly.", en: "He becomes an institution. MMBarber is no longer just a barbershop, it's a school of life with its own rules." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 70, y: 35 },
    dependencies: ["speed_demon", "iron_will", "coffee_master"],
  },

  // TIER 5 - Ultimátní (10 fragmentů)
  {
    id: "ceo_reality",
    title: { cs: "CEO Reality", en: "CEO of Reality" },
    desc: { cs: "Absolutní kontrola nad salonem a vlastním osudem.", en: "Absolute control over the salon and his own destiny." },
    icon: Crown,
    requiredFragments: 10,
    maxLevel: 5,
    loreLevels: [
      { cs: "Vládne nad městem pomocí nití osudu. Lidé k němu chodí s prosbami o svolení, ne jen o střih.", en: "He rules the city via the threads of fate. People come asking for permission, not just haircuts." },
      { cs: "Dosáhl stavu absolutního bosse. Realita samotná se ohýbá podle toho, jak kmitají jeho nůžky.", en: "Reached the state of absolute Boss. Reality itself bends to the rhythm of his scissors." },
      generateFutureLore(2),
      generateFutureLore(3),
    ],
    position: { x: 50, y: 15 },
    dependencies: ["mafia_charisma", "master_mentor"],
    statBoost: "+100 Autorita"
  }
];

export function TomasSkillTree({ 
  totalCollected, 
  lang 
}: { 
  totalCollected: number;
  lang: string;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tomas_skill_levels');
    if (saved) {
      try {
        setSkillLevels(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse skill levels");
      }
    }
    setIsLoaded(true);
  }, []);

  const saveLevel = (nodeId: string, newLevel: number) => {
    const updated = { ...skillLevels, [nodeId]: newLevel };
    setSkillLevels(updated);
    localStorage.setItem('tomas_skill_levels', JSON.stringify(updated));
    playSound("/sounds/reload.mp3", 0.5);
  };
  
  // Výpočet odemčených nodů
  const unlockedNodes = new Set<string>();
  const checkUnlock = (nodeId: string): boolean => {
    if (unlockedNodes.has(nodeId)) return true;
    const node = TOMAS_SKILLS.find(n => n.id === nodeId);
    if (!node) return false;
    if (totalCollected < node.requiredFragments) return false;
    if (node.dependencies && node.dependencies.length > 0) {
       for (const depId of node.dependencies) {
           if (!checkUnlock(depId)) return false;
       }
    }
    unlockedNodes.add(nodeId);
    return true;
  };
  
  let added = true;
  while (added) {
     added = false;
     TOMAS_SKILLS.forEach(node => {
        if (!unlockedNodes.has(node.id) && checkUnlock(node.id)) {
           added = true;
        }
     });
  }

  // Výpočet dovednostních bodů (SP) - dáme mnohem víc SP, protože Max Level je nyní 5
  // Např. 5 SP za každý fragment
  const totalSP = totalCollected * 5;
  
  let spentSP = 0;
  let currentTotalUnlockedLevels = 0;
  const maxPossibleLevels = TOMAS_SKILLS.reduce((sum, node) => sum + node.maxLevel, 0);

  if (isLoaded) {
    TOMAS_SKILLS.forEach(node => {
       const lvl = skillLevels[node.id] || 0;
       
       // Base unlock is LVL 1, counts towards Total Levels if unlocked.
       if (unlockedNodes.has(node.id)) {
           const actualLevel = Math.max(1, lvl);
           currentTotalUnlockedLevels += actualLevel;
           if (actualLevel > 1) {
              spentSP += (actualLevel - 1);
           }
       }
    });
  }

  const availableSP = totalSP - spentSP;
  const completionPercentage = Math.round((currentTotalUnlockedLevels / maxPossibleLevels) * 100);

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNodeId(node.id);
    if (unlockedNodes.has(node.id)) {
      playSound("/sounds/reload.mp3", 0.3);
    } else {
      playSound("/sounds/click.mp3", 0.2);
    }
  };

  const handleUpgrade = (nodeId: string, currentLevel: number) => {
    if (availableSP > 0) {
       saveLevel(nodeId, currentLevel + 1);
    }
  };

  const selectedNode = selectedNodeId ? TOMAS_SKILLS.find(n => n.id === selectedNodeId) : null;
  const isSelectedUnlocked = selectedNode ? unlockedNodes.has(selectedNode.id) : false;
  const currentSelectedLevel = selectedNode ? (skillLevels[selectedNode.id] || 1) : 1;

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="w-full xl:min-w-[1000px] flex flex-col md:flex-row h-[800px] lg:h-[900px] overflow-visible relative">
      
      {/* Vlastní plocha stromu */}
      <div className="flex-grow relative h-full transition-all duration-500 overflow-hidden">
        
        {/* Ambient AC-style Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{
           backgroundImage: "radial-gradient(circle at center, rgba(197,160,89,0.25) 0%, transparent 70%)",
        }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(197,160,89,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-6 lg:p-10 flex flex-col lg:flex-row justify-between items-start z-20 pointer-events-none gap-4">
           <div className="flex flex-col">
              <div className="text-mafia-gold font-heading uppercase tracking-widest text-2xl lg:text-4xl drop-shadow-[0_0_15px_rgba(197,160,89,0.8)]">
                 {lang === 'cs' ? 'STROM DOVEDNOSTÍ' : 'SKILL TREE'}
              </div>
              <div className="text-white/40 font-mono text-[10px] lg:text-xs uppercase tracking-[0.3em] mt-2">
                 {lang === 'cs' ? 'Tomášův postup' : "Tomáš's progression"}
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-2">
             {/* Total Completion Bar - "Maximální Odemčení" */}
             <div className="w-full lg:w-64 bg-black/60 p-2 rounded-sm border border-white/10 flex flex-col gap-1 backdrop-blur-md">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                      {lang === 'cs' ? 'MAXIMÁLNÍ ODEMČENÍ' : 'MAXIMUM UNLOCK'}
                   </span>
                   <span className="text-[10px] font-mono text-mafia-gold font-bold">
                      {completionPercentage}%
                   </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-mafia-gold transition-all duration-1000 shadow-[0_0_10px_rgba(197,160,89,0.8)]"
                      style={{ width: `${completionPercentage}%` }}
                   />
                </div>
                <div className="text-[8px] font-mono text-right text-white/30 uppercase mt-0.5">
                   {currentTotalUnlockedLevels} / {maxPossibleLevels} LVL
                </div>
             </div>
           </div>
        </div>

        {/* Connection Lines Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ filter: "drop-shadow(0 0 6px rgba(197,160,89,0.6))" }}>
           {TOMAS_SKILLS.map(node => {
              if (!node.dependencies) return null;
              return node.dependencies.map(depId => {
                 const depNode = TOMAS_SKILLS.find(n => n.id === depId);
                 if (!depNode) return null;
                 
                 const isLineUnlocked = unlockedNodes.has(node.id);
                 const isLinePartiallyUnlocked = unlockedNodes.has(depId) && !isLineUnlocked;
                 
                 let strokeColor = "rgba(255,255,255,0.05)";
                 if (isLineUnlocked) strokeColor = "rgba(197,160,89,0.8)";
                 else if (isLinePartiallyUnlocked) strokeColor = "rgba(197,160,89,0.4)";

                 return (
                    <line 
                       key={`${node.id}-${depId}`}
                       x1={`${depNode.position.x}%`} 
                       y1={`${depNode.position.y}%`} 
                       x2={`${node.position.x}%`} 
                       y2={`${node.position.y}%`} 
                       stroke={strokeColor} 
                       strokeWidth={isLineUnlocked ? "4" : "2"}
                       strokeDasharray={isLineUnlocked ? "none" : "5,5"}
                       className="transition-all duration-500"
                    />
                 );
              });
           })}
        </svg>

        {/* Nodes */}
        <div className="absolute inset-0 z-20">
           {TOMAS_SKILLS.map((node) => {
              const isUnlocked = unlockedNodes.has(node.id);
              const isSelected = selectedNodeId === node.id;
              const isReachable = node.requiredFragments <= totalCollected;
              const missingDeps = node.dependencies?.filter(dep => !unlockedNodes.has(dep));
              const isBlockedByDeps = missingDeps && missingDeps.length > 0;
              const currentLevel = isUnlocked ? (skillLevels[node.id] || 1) : 0;
              const isMaxed = currentLevel >= node.maxLevel;

              const isAvailableButLocked = isReachable && !isUnlocked && !isBlockedByDeps;
              const isCompletelyLocked = !isUnlocked && (!isReachable || isBlockedByDeps);

              let nodeClass = "";
              let glowEffect = "";
              if (isUnlocked) {
                 nodeClass = `bg-black border-mafia-gold ${currentLevel > 1 ? 'text-white' : 'text-mafia-gold'}`;
                 // Zvýšený glow pro max level
                 const glowStrength = isMaxed ? '0_0_40px' : '0_0_25px';
                 glowEffect = `shadow-[${glowStrength}_rgba(197,160,89,0.8)] inset-shadow-[0_0_10px_rgba(197,160,89,0.5)]`;
              } else if (isAvailableButLocked) {
                 nodeClass = "bg-black text-white/80 border-mafia-gold/50 border-dashed animate-pulse hover:border-mafia-gold hover:bg-mafia-gold/10";
                 glowEffect = "shadow-[0_0_10px_rgba(197,160,89,0.3)]";
              } else {
                 nodeClass = "bg-black text-white/20 border-white/10 hover:border-white/30";
              }

              return (
                 <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className="absolute group flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-all duration-500"
                    style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
                 >
                    <div className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${nodeClass} ${glowEffect} ${isSelected ? 'ring-4 ring-mafia-gold/40 scale-110' : 'hover:scale-105'} ${isMaxed ? 'bg-mafia-gold/20' : ''}`}>
                       {isCompletelyLocked ? <Lock size={24} className="opacity-30" /> : <node.icon size={isUnlocked ? 32 : 28} className={isUnlocked ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.9)]" : ""} />}
                       
                       {/* Level indicator (jen pokud je odemčeno, nebo se dá odemknout) */}
                       {(isUnlocked || isAvailableButLocked) && (
                         <div className={`absolute -top-6 md:-top-7 bg-black border px-2 py-0.5 rounded text-[9px] md:text-[10px] font-mono font-bold ${isMaxed ? 'border-yellow-400 text-yellow-400' : isUnlocked ? 'border-mafia-gold text-mafia-gold' : 'border-white/30 text-white/50'}`}>
                           LVL {isUnlocked ? currentLevel : 1}
                         </div>
                       )}
                    </div>
                    {/* Název schopnosti pod uzlem */}
                    <div className="mt-3 md:mt-4 lg:mt-5 text-center font-heading uppercase tracking-widest text-[9px] md:text-[10px] text-white/60 group-hover:text-mafia-gold transition-colors text-shadow-sm max-w-[120px]">
                       {lang === 'cs' ? node.title.cs : node.title.en}
                    </div>
                 </div>
              );
           })}
        </div>

        {/* Upgrade Button Bottom Center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm z-40 px-4">
           {selectedNode && isSelectedUnlocked ? (
              currentSelectedLevel < selectedNode.maxLevel ? (
                 <button 
                    onClick={() => handleUpgrade(selectedNode.id, currentSelectedLevel)}
                    disabled={availableSP < 1}
                    className={`w-full py-4 px-6 flex items-center justify-between rounded-sm uppercase tracking-[0.2em] font-black text-xs transition-all ${
                       availableSP >= 1 
                       ? 'bg-mafia-gold text-black hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(197,160,89,0.4)]' 
                       : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                    }`}
                 >
                    <span className="flex items-center gap-2">
                       <ArrowUpCircle size={16} />
                       {lang === 'cs' ? 'Vylepšit Dovednost' : 'Upgrade Skill'}
                    </span>
                    <span className="font-mono bg-black/20 px-2 py-1 rounded">
                       -1 SP
                    </span>
                 </button>
              ) : (
                 <div className="w-full py-4 text-center border border-yellow-400/50 bg-yellow-400/10 text-yellow-400 font-mono text-xs uppercase tracking-widest rounded-sm shadow-[inset_0_0_15px_rgba(250,204,21,0.2)] backdrop-blur-md">
                    {lang === 'cs' ? 'Maximální úroveň dosažena' : 'Maximum level reached'}
                 </div>
              )
           ) : selectedNode && !isSelectedUnlocked ? (
              <div className="bg-black/80 backdrop-blur-md p-4 rounded-md border border-white/10 w-full shadow-lg">
                 <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest border-b border-white/5 pb-2">
                       <span className="text-white/40">{lang === 'cs' ? 'K odemčení:' : 'To unlock:'}</span>
                       <span className={`font-bold ${totalCollected >= selectedNode.requiredFragments ? 'text-mafia-gold' : 'text-red-500'}`}>
                          {totalCollected} / {selectedNode.requiredFragments} {lang === 'cs' ? 'OTISKŮ' : 'FRAGMENTS'}
                       </span>
                    </div>
                    {selectedNode.dependencies && selectedNode.dependencies.length > 0 && (
                       <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                          <span className="text-white/40">{lang === 'cs' ? 'Předchozí:' : 'Previous:'}</span>
                          <span className={`font-bold ${selectedNode.dependencies.every(d => unlockedNodes.has(d)) ? 'text-mafia-gold' : 'text-red-500'}`}>
                             {selectedNode.dependencies.every(d => unlockedNodes.has(d)) ? (lang === 'cs' ? 'ODEMČENO' : 'UNLOCKED') : (lang === 'cs' ? 'UZAMČENO' : 'LOCKED')}
                          </span>
                       </div>
                    )}
                 </div>
              </div>
           ) : null}
        </div>
      </div>

      {/* Postranní lišta (Sidebar) */}
      <AnimatePresence>
         {selectedNode && (
            <motion.div
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "100%", maxWidth: "450px", opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="h-full bg-black/95 backdrop-blur-xl border-t-2 md:border-t-0 md:border-l-2 border-mafia-gold/60 z-40 flex-shrink-0 relative overflow-hidden"
            >
               <div className="w-full md:w-[450px] h-full p-6 lg:p-10 overflow-y-auto absolute top-0 left-0 flex flex-col scrollbar-thin scrollbar-thumb-mafia-gold/20">
                 
                 <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="absolute top-4 right-4 lg:top-6 lg:right-6 text-white/40 hover:text-mafia-gold transition-colors font-mono text-sm border border-transparent hover:border-mafia-gold/30 px-2 py-1 rounded"
                 >
                    [ZAVŘÍT]
                 </button>

                 {/* Ikona a Header */}
                 <div className="flex gap-4 items-center mt-6 lg:mt-8 mb-6">
                   <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg border-2 flex items-center justify-center shrink-0 ${isSelectedUnlocked ? 'bg-mafia-gold/10 border-mafia-gold text-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.5)]' : 'bg-white/5 border-white/20 text-white/30'}`}>
                      <selectedNode.icon size={36} className={isSelectedUnlocked ? "drop-shadow-[0_0_15px_rgba(197,160,89,0.9)]" : ""} />
                   </div>
                   <div className="flex flex-col">
                     <div className={`font-mono font-bold text-xs uppercase tracking-widest mb-1 ${currentSelectedLevel >= selectedNode.maxLevel ? 'text-yellow-400' : 'text-white/40'}`}>
                        LVL {isSelectedUnlocked ? currentSelectedLevel : 1} {currentSelectedLevel >= selectedNode.maxLevel && '(MAX)'}
                     </div>
                     <h3 className={`text-xl lg:text-3xl font-heading font-black uppercase tracking-widest leading-tight ${isSelectedUnlocked ? 'text-mafia-gold text-shadow-md' : 'text-white/60'}`}>
                        {lang === 'cs' ? selectedNode.title.cs : selectedNode.title.en}
                     </h3>
                   </div>
                 </div>
                 
                 <div className="w-full h-[2px] bg-gradient-to-r from-mafia-gold/60 via-mafia-gold/20 to-transparent mb-6"></div>

                 {/* Lore Section */}
                 <div className="flex-grow flex flex-col space-y-6">
                    {/* ZÁKLADNÍ POPIS (LVL 1) */}
                    <div className="flex flex-col">
                       <span className="text-[9px] font-mono text-mafia-gold/60 uppercase tracking-[0.2em] mb-1">
                          {lang === 'cs' ? 'Základní znalost' : 'Basic Knowledge'} (LVL 1)
                       </span>
                       <p className={`text-sm lg:text-base font-sans leading-relaxed ${isSelectedUnlocked ? 'text-smoke-white' : 'text-white/40'}`}>
                          {lang === 'cs' ? selectedNode.desc.cs : selectedNode.desc.en}
                       </p>
                    </div>

                    {/* ODEMČENÉ LORE (LVL 2 a vyšší) */}
                    {isSelectedUnlocked && selectedNode.loreLevels.map((lore, index) => {
                       const requiredLevel = index + 2;
                       const isLoreUnlocked = currentSelectedLevel >= requiredLevel;
                       // Poslední 2 úrovně jsou v našem poli vygenerované updaty pro budoucnost
                       const isFutureLore = lore.cs.includes('BUDOUCÍ AKTUALIZACE');

                       return (
                          <motion.div 
                             key={`lore-${requiredLevel}`}
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className={`flex flex-col border-l-2 pl-4 transition-all duration-500 ${isLoreUnlocked ? (isFutureLore ? 'border-red-500/50 bg-red-900/10' : 'border-mafia-gold/80 bg-mafia-gold/5') : 'border-white/10 opacity-40'} py-2`}
                          >
                             <span className={`text-[9px] font-mono uppercase tracking-[0.2em] mb-1 flex items-center gap-2 ${isLoreUnlocked ? (isFutureLore ? 'text-red-400' : 'text-mafia-gold') : 'text-white/40'}`}>
                                {isLoreUnlocked ? <CheckCircle2 size={10} /> : <Lock size={10} />}
                                {lang === 'cs' ? 'Tajný archiv' : 'Secret Archive'} (LVL {requiredLevel})
                             </span>
                             {isLoreUnlocked ? (
                                <p className={`text-sm lg:text-base font-sans leading-relaxed italic ${isFutureLore ? 'text-red-400/80 font-mono text-[10px]' : 'text-smoke-white/90'}`}>
                                   "{lang === 'cs' ? lore.cs : lore.en}"
                                </p>
                             ) : (
                                <div className="text-xs font-mono text-white/30 uppercase tracking-widest blur-[2px] select-none py-1">
                                   DATA ŠIFROVÁNA. VYLEPŠETE UZEL K ODEMČENÍ.
                                </div>
                             )}
                          </motion.div>
                       );
                    })}

                    {selectedNode.statBoost && isSelectedUnlocked && (
                       <div className="inline-flex items-center self-start gap-3 bg-mafia-gold/15 px-5 py-3 border border-mafia-gold/40 rounded-sm text-sm font-mono font-bold text-mafia-gold tracking-widest uppercase mt-4 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                          <Star size={16} /> {selectedNode.statBoost} 
                          {currentSelectedLevel > 1 && <span className="text-yellow-400"> (x{currentSelectedLevel})</span>}
                       </div>
                    )}
                 </div>
                 

               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
