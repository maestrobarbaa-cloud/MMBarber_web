import React from 'react';
import { motion } from 'framer-motion';
import { ProfileData } from './ProfileTypes';
import { Brain, Target, Zap, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface B2BProfileAnalysisProps {
  profile: ProfileData;
  lang: 'cs' | 'en';
}

export const B2BProfileAnalysis = ({ profile, lang }: B2BProfileAnalysisProps) => {
  // Převod syrových dat na agregované metriky (0-100) pro B2B pohled
  const analyzeProfile = (p: ProfileData) => {
    let workEthicScore = 50;
    if (p.workEthic === 'workoholik') workEthicScore = 95;
    if (p.workEthic === 'hardworker') workEthicScore = 85;
    if (p.workEthic === 'balance') workEthicScore = 70;
    if (p.workEthic === 'money_only') workEthicScore = 40;

    let intellectScore = 50;
    if (p.educationLevel === 'vs_magistr' || p.educationLevel === 'phd') intellectScore = 90;
    else if (p.educationLevel === 'vs_bakalar') intellectScore = 80;
    else if (p.educationLevel === 'ss' || p.educationLevel === 'vos') intellectScore = 65;
    
    if (p.educationGrades === 'vyborny') intellectScore += 10;
    if (p.educationFinalExam === 'vyznamenani') intellectScore += 10;

    let loyaltyScore = 60; // Výchozí
    if (p.familyLegacy === 'yes_big' || p.familyLegacy === 'yes_small') loyaltyScore += 15;
    if (p.legacyContinue === 'yes_continue') loyaltyScore += 15;
    if (p.employmentPreference === 'employee') loyaltyScore += 10;
    if (p.careerProgression?.includes('steady_growth')) loyaltyScore += 10;
    if (p.careerProgression?.includes('fast_climb')) loyaltyScore -= 10; // Rychlý růst může znamenat fluktuaci

    let ambitionScore = 50;
    if (p.careerProgression?.includes('from_scratch')) ambitionScore += 20;
    if (p.careerProgression?.includes('fast_climb')) ambitionScore += 25;
    if (p.employmentPreference === 'entrepreneur' || p.employmentPreference === 'freelancer') ambitionScore += 20;
    
    let digitalScore = 50;
    if (p.socialMediaRole === 'creator') digitalScore = 95;
    else if (p.socialMediaRole === 'balance') digitalScore = 75;
    else if (p.socialMediaRole === 'none') digitalScore = 40; // Může to znamenat odtržení od trhu
    else if (p.socialMediaRole === 'consumer') digitalScore = 30; // Vysoká ovlivnitelnost

    // Čas strávený na sítích: extrémní hodnoty uškodí, ledaže je tvůrce
    if (p.socialMediaTime !== undefined) {
      if (p.socialMediaTime > 80 && p.socialMediaRole !== 'creator') digitalScore -= 20; 
      if (p.socialMediaTime < 20 && p.socialMediaRole === 'creator') digitalScore -= 10;
    }

    return {
      workEthic: Math.min(100, Math.max(0, workEthicScore)),
      intellect: Math.min(100, Math.max(0, intellectScore)),
      loyalty: Math.min(100, Math.max(0, loyaltyScore)),
      ambition: Math.min(100, Math.max(0, ambitionScore)),
      digital: Math.min(100, Math.max(0, digitalScore)),
    };
  };

  const scores = analyzeProfile(profile);
  const averageScore = Math.round((scores.workEthic + scores.intellect + scores.loyalty + scores.ambition + scores.digital) / 5);

  // Silné a slabé stránky
  const traits = [
    { key: 'workEthic', label: lang === 'cs' ? 'Pracovní nasazení' : 'Work Ethic', score: scores.workEthic },
    { key: 'intellect', label: lang === 'cs' ? 'Odbornost & Intelekt' : 'Intellect & Expertise', score: scores.intellect },
    { key: 'loyalty', label: lang === 'cs' ? 'Loajalita & Stabilita' : 'Loyalty & Stability', score: scores.loyalty },
    { key: 'ambition', label: lang === 'cs' ? 'Tah na branku' : 'Ambition', score: scores.ambition },
    { key: 'digital', label: lang === 'cs' ? 'Digitální Vliv & Samostatnost' : 'Digital Influence', score: scores.digital },
  ];

  const strengths = traits.filter(t => t.score >= 75).sort((a, b) => b.score - a.score);
  const weaknesses = traits.filter(t => t.score <= 50).sort((a, b) => a.score - b.score);

  return (
    <div className="bg-black/80 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 text-green-500/5 rotate-12">
        <Target size={200} />
      </div>

      <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Brain className="text-green-500" />
            {lang === 'cs' ? 'Osobnostní Profil Kandidáta' : 'Candidate Personality Profile'}
          </h3>
          <p className="text-xs text-white/50 font-mono mt-2">
            {lang === 'cs' ? 'Důvěrná analýza (skrytá surová data)' : 'Confidential analysis (raw data hidden)'}
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black font-heading text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            {averageScore}
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
            {lang === 'cs' ? 'Index Shody' : 'Match Index'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Radar / Bars */}
        <div className="space-y-5">
          {traits.map((trait) => (
            <div key={trait.key}>
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
                <span className="text-white/80">{trait.label}</span>
                <span className="text-green-400">{trait.score}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${trait.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${trait.score > 70 ? 'bg-green-500' : trait.score > 40 ? 'bg-mafia-gold' : 'bg-red-500'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <h4 className="text-green-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <CheckCircle2 size={14} /> {lang === 'cs' ? 'Klíčové Přednosti' : 'Key Strengths'}
            </h4>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map(s => (
                  <li key={s.key} className="text-sm text-white/80 flex items-start gap-2">
                    <ChevronRight size={16} className="text-green-500 shrink-0 mt-0.5" />
                    <span>Excelentní <strong>{s.label.toLowerCase()}</strong> predikováno na základě profilu.</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">Žádné extrémně výrazné přednosti.</p>
            )}
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <h4 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <AlertCircle size={14} /> {lang === 'cs' ? 'Rizikové Oblasti' : 'Risk Areas'}
            </h4>
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map(w => (
                  <li key={w.key} className="text-sm text-white/80 flex items-start gap-2">
                    <ChevronRight size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Slabší <strong>{w.label.toLowerCase()}</strong> (vyžaduje vedení/dohled).</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">Žádná kritická rizika nenalezena.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
