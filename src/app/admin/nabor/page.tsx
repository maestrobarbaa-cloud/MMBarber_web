"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, BarChart, CheckCircle2, ShieldAlert, Activity, Eye, Save } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function NaborAdminPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form state for manual evaluation
  const [scores, setScores] = useState({ osobnost: 50, prace: 50, osvc: 50, tym: 50, zakaznik: 50, sebereflexe: 50 });
  const [summaryProfile, setSummaryProfile] = useState('');
  const [temperament, setTemperament] = useState('');
  const [strengths, setStrengths] = useState('');
  const [risks, setRisks] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    setLoading(true);
    fetch('/api/admin/recruitment')
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setLoading(false);
      });
  };

  const handleSelectCandidate = (c: any) => {
    setSelectedCandidate(c);
    if (c.aiPersonalityReport) {
      try {
        const report = JSON.parse(c.aiPersonalityReport);
        setScores(report.scores || { osobnost: 50, prace: 50, osvc: 50, tym: 50, zakaznik: 50, sebereflexe: 50 });
        setSummaryProfile(report.summaryProfile || '');
        setTemperament(report.temperament || '');
        setStrengths(report.strengths ? report.strengths.join('\n') : '');
        setRisks(report.risks ? report.risks.map((r:any) => r.title + ' - ' + r.reasoning).join('\n') : '');
      } catch(e) {}
    } else {
      // Reset form
      setScores({ osobnost: 50, prace: 50, osvc: 50, tym: 50, zakaznik: 50, sebereflexe: 50 });
      setSummaryProfile('');
      setTemperament('');
      setStrengths('');
      setRisks('');
    }
  };

  const handleSaveEvaluation = async () => {
    const reportToSave = {
      scores,
      summaryProfile,
      temperament,
      strengths: strengths.split('\n').filter(s => s.trim() !== ''),
      risks: risks.split('\n').filter(r => r.trim() !== '').map(r => ({ title: 'Riziko', reasoning: r }))
    };

    try {
      await fetch('/api/admin/recruitment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCandidate.id, aiPersonalityReport: reportToSave })
      });
      alert('Hodnocení uloženo!');
      fetchCandidates();
      setSelectedCandidate({ ...selectedCandidate, aiPersonalityReport: JSON.stringify(reportToSave), phase3Status: 'PASSED' });
    } catch(e) {
      alert('Chyba při ukládání');
    }
  };

  if (loading) return <div className="p-10 text-white font-mono">Načítám kandidáty...</div>;

  if (selectedCandidate) {
    const radarData = [
      { subject: 'Osobnost', A: scores.osobnost, fullMark: 100 },
      { subject: 'Práce', A: scores.prace, fullMark: 100 },
      { subject: 'OSVČ', A: scores.osvc, fullMark: 100 },
      { subject: 'Tým', A: scores.tym, fullMark: 100 },
      { subject: 'Zákazník', A: scores.zakaznik, fullMark: 100 },
      { subject: 'Sebereflexe', A: scores.sebereflexe, fullMark: 100 },
    ];

    let phase3AnswersParsed: Record<string, any> = {};
    try {
      phase3AnswersParsed = JSON.parse(selectedCandidate.phase3Answers || '{}');
    } catch(e) {}

    return (
      <div className="min-h-screen bg-black text-white p-6 font-mono">
        <button onClick={() => setSelectedCandidate(null)} className="flex items-center gap-2 text-mafia-gold hover:text-white mb-8 uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Zpět na seznam
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEOVÝ SLOUPEC: Odpovědi kandidáta */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-heading font-black text-white uppercase mb-4">{selectedCandidate.name}</h2>
            <p className="text-white/70 mb-6 border-b border-white/10 pb-4">
              ID: {selectedCandidate.applicantId} <br/> Email: {selectedCandidate.email}
            </p>

            <h3 className="font-heading font-black text-mafia-gold uppercase mb-4">Odpovědi z Fáze 3:</h3>
            <div className="space-y-6">
              {Object.keys(phase3AnswersParsed).length > 0 ? (
                Object.entries(phase3AnswersParsed).map(([qId, ans]: [string, any]) => (
                  <div key={qId} className="bg-black/50 p-4 border border-white/5 rounded">
                    <div className="text-xs text-white/40 mb-2">Otázka #{qId}</div>
                    {ans.text && <p className="text-white/90 italic">"{ans.text}"</p>}
                    {ans.choice && <p className="text-white/90 font-bold mb-2">Volba: {ans.choice}</p>}
                    {ans.explanation && <p className="text-white/70 italic">Vysvětlení: "{ans.explanation}"</p>}
                  </div>
                ))
              ) : (
                <p className="text-white/50">Zatím nevyplnil Fázi 3.</p>
              )}
            </div>
          </div>

          {/* PRAVÝ SLOUPEC: Manuální Hodnocení */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl overflow-y-auto max-h-[80vh]">
             <h3 className="font-heading font-black text-xl uppercase mb-6 flex items-center gap-2">
                <BarChart size={24} className="text-mafia-gold"/> Tvoje Manuální Hodnocení
             </h3>

             <div className="space-y-4 mb-8">
               {Object.keys(scores).map(key => (
                 <div key={key}>
                   <div className="flex justify-between text-xs uppercase text-white/70 mb-1">
                     <span>{key}</span>
                     <span>{scores[key as keyof typeof scores]} / 100</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={scores[key as keyof typeof scores]}
                     onChange={(e) => setScores({...scores, [key]: parseInt(e.target.value)})}
                     className="w-full accent-mafia-gold h-2 bg-black rounded-lg appearance-none cursor-pointer"
                   />
                 </div>
               ))}
             </div>

             <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" stroke="#aaa" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#555" />
                    <Radar name="Skóre" dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase text-white/50 mb-2">Jaký člověk to je (Shrnutí)</label>
                  <textarea rows={3} value={summaryProfile} onChange={e => setSummaryProfile(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase text-white/50 mb-2">Temperament</label>
                  <textarea rows={2} value={temperament} onChange={e => setTemperament(e.target.value)} className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase text-green-500 mb-2">Silné Stránky (každá na nový řádek)</label>
                  <textarea rows={3} value={strengths} onChange={e => setStrengths(e.target.value)} className="w-full bg-green-900/10 border border-green-500/30 p-3 text-white focus:border-green-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase text-red-500 mb-2">Rizika (každé na nový řádek)</label>
                  <textarea rows={3} value={risks} onChange={e => setRisks(e.target.value)} className="w-full bg-red-900/10 border border-red-500/30 p-3 text-white focus:border-red-500 outline-none"></textarea>
                </div>
              </div>

              <button 
                onClick={handleSaveEvaluation}
                className="mt-8 w-full flex items-center justify-center gap-2 px-8 py-4 bg-mafia-gold text-black font-black uppercase tracking-widest hover:bg-white transition-colors"
              >
                <Save size={18} /> Uložit Profil Uchazeče
              </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-black uppercase tracking-widest flex items-center gap-3">
          <User className="text-mafia-gold" size={32} />
          Přijímací Kola
        </h1>
        <Link href="/admin" className="text-white/50 hover:text-white uppercase text-xs tracking-widest">
          Zpět do Adminu
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">ID / Jméno</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Email</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50">Status F3</th>
              <th className="p-4 text-xs font-bold uppercase tracking-widest text-white/50 text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-white/40">{c.applicantId}</div>
                </td>
                <td className="p-4 text-sm text-white/70">{c.email}</td>
                <td className="p-4">
                  <span className={`text-xs uppercase bg-white/10 px-2 py-1 rounded ${c.phase3Status === 'PASSED' ? 'text-green-400' : 'text-mafia-gold'}`}>
                    {c.phase3Status === 'PASSED' ? 'Hodnoceno' : (c.phase3Status === 'PENDING_REVIEW' ? 'Čeká na tebe' : c.phase3Status)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleSelectCandidate(c)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mafia-gold/10 text-mafia-gold hover:bg-mafia-gold hover:text-black transition-colors text-xs uppercase tracking-widest font-bold rounded"
                  >
                    <Eye size={16} /> Otevřít a Hodnotit
                  </button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/30 uppercase tracking-widest">
                  Žádní uchazeči
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
