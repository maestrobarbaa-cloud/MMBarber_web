"use client"
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, CheckCircle2, XCircle, Eye,
  ChevronDown, ChevronUp, Star, AlertTriangle,
  RefreshCw, Briefcase, TrendingUp, Shield, Clock
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend
} from "recharts";

/* ─── Otazky ─── */
const PHASE1_QUESTIONS: Record<number, string> = {
  1:"Největší profesní chyba za poslední rok?",2:"Agresivní zpráva od zákazníka – jak reagujete?",
  3:"Málo zákazníků – čí je to chyba?",4:"Onemocníte na 10 dní – co uděláte hned?",
  5:"Jak moc potřebujete vedení šéfa? (škála 1–10)",6:"Ráno bez čistých ručníků – co uděláte?",
  7:"Co na práci holiče nesnášíte?",8:"Týmový hráč, nebo vlk samotář?",
  9:"Máte rezervu na slabší měsíce?",10:"Jste lepší holič než 80 %?",
  11:"Tvrdá zpětná vazba – první reakce?",12:"4 hodiny volno – co děláte?",
  13:"V čem nejvíce zaostáváte?",14:"Kolega vrací nevyčištěný strojek – jak to vyřešíte?",
  15:"Proč jste šel/šla na OSVČ místo HPP?"
};
const PHASE3_QUESTIONS: Record<number, string> = {
  1:"Proč se většina holičů nedostane na špičku?",2:"Udělali jste chybu – jak jste reagoval/a?",
  3:"Co je horší – přehlédnutí nebo kritika?",4:"Nejsilnější vlastnost a její stinná stránka?",
  5:"Zákazník prosí o odpuštění storna – jak reagujete?",6:"Nejlepší nápad, ale tým nesouhlasí?",
  7:"Cítili jste se jako oběť špatného systému?",8:"Sobota, plno, pozdní zákazník – jak dáváte najevo stres?",
  9:"Při střihu vzali o cm výš – zákazník si nevšiml – co uděláte?",10:"Učeň udělal něco lépe – jak reagujete?",
  11:"Kdy se cítíte nejvíce nabitý/á energií?",12:"Jaký styl vedení by vás donutil odejít?",
  13:"Musíte vzít provizorní horší místo – vaše první reakce?"
};

/* ─── Kategorie otázek pro radar ─── */
const PHASE1_CATS: Record<number, string> = {
  1:"Sebereflexe",2:"Zákazník",3:"Zodpovědnost",4:"OSVČ",5:"Autonomie",
  6:"Řešení problémů",7:"Realismus",8:"Tým",9:"Finance",10:"Sebevědomí",
  11:"Zpětná vazba",12:"Proaktivita",13:"Seberozvoj",14:"Komunikace",15:"Motivace"
};
const PHASE3_CATS: Record<number, string> = {
  1:"Ambice",2:"Zpětná vazba",3:"Ego",4:"Sebepoznání",5:"Zákazník",
  6:"Tým",7:"Odolnost",8:"Emoce",9:"Integrita",10:"Pokora",
  11:"Motivace",12:"Vedení",13:"Flexibilita"
};

/* ─── Utility ─── */
function parseAnswers(json: string): Record<string, any> {
  try { return JSON.parse(json || "{}"); } catch { return {}; }
}

function calcScore(answers: Record<string, any>): { total: number; max: number; pct: number } {
  let total = 0, max = 0;
  Object.values(answers).forEach((a: any) => {
    if (typeof a?.score === "number") { total += a.score; max += 2; }
  });
  return { total, max, pct: max > 0 ? Math.round((total / max) * 100) : 0 };
}

function pctColor(pct: number) {
  if (pct >= 70) return "#22c55e";
  if (pct >= 45) return "#eab308";
  return "#ef4444";
}

/* ─── Malé badge komponenty ─── */
function ScoreBadge({ score }: { score: number }) {
  if (score === 2) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 shrink-0"><Star size={10}/>Výborná</span>;
  if (score === 1) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shrink-0">Průměrná</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 shrink-0"><AlertTriangle size={10}/>Slabá</span>;
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { label: string; cls: string }> = {
    ACCEPTED:{ label:"✓ Přijat/a", cls:"bg-green-500/20 text-green-400 border-green-500/40" },
    REJECTED:{ label:"✗ Odmítnut/a", cls:"bg-red-500/20 text-red-400 border-red-500/40" },
    COMPLETED:{ label:"Čeká na rozhodnutí", cls:"bg-mafia-gold/20 text-mafia-gold border-mafia-gold/40" },
    IN_PROGRESS:{ label:"V průběhu", cls:"bg-blue-500/20 text-blue-400 border-blue-500/40" },
  };
  const cfg = m[status] || { label: status, cls: "bg-white/10 text-white/40 border-white/20" };
  return <span className={`inline-block px-3 py-1 rounded text-xs font-bold border uppercase tracking-wider ${cfg.cls}`}>{cfg.label}</span>;
}

/* ─── Radar chart pro jednu fázi ─── */
function PhaseRadar({ answers, cats, color }: { answers: Record<string,any>; cats: Record<number,string>; color: string }) {
  const data = Object.entries(cats).map(([id, cat]) => {
    const a = answers[id];
    const score = typeof a?.score === "number" ? a.score : (typeof a?.value === "number" ? (a.value <= 3 ? 2 : a.value <= 6 ? 1 : 0) : 0);
    return { subject: cat, A: Math.round((score / 2) * 100), fullMark: 100 };
  });
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} />
        <Radar name="Skóre" dataKey="A" stroke={color} fill={color} fillOpacity={0.25} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ─── Bar chart na odpovědi jedné fáze ─── */
function PhaseBarChart({ answers, questions }: { answers: Record<string,any>; questions: Record<number,string> }) {
  const data = Object.entries(answers).map(([id, a]: [string, any]) => ({
    name: `#${id}`,
    skore: typeof a?.score === "number" ? a.score : (typeof a?.value === "number" ? (a.value <= 3 ? 2 : a.value <= 6 ? 1 : 0) : 0),
    max: 2,
    full: questions[parseInt(id)] || `Otázka ${id}`
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg p-3 max-w-xs text-xs">
        <p className="text-white/50 mb-1">{d.full}</p>
        <p className="text-mafia-gold font-bold">Skóre: {d.skore}/2</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
        <YAxis domain={[0,2]} ticks={[0,1,2]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="skore" radius={[4,4,0,0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.skore === 2 ? "#22c55e" : entry.skore === 1 ? "#eab308" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Sekce odpovědí (expandable) ─── */
function AnswersSection({ answers, questions }: { answers: Record<string,any>; questions: Record<number,string> }) {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(answers);
  if (entries.length === 0) return <p className="text-white/30 text-sm italic">Žádné odpovědi</p>;

  return (
    <div className="mt-4">
      <button onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-mafia-gold/60 hover:text-mafia-gold mb-3 transition-colors">
        {expanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
        {expanded ? "Skrýt odpovědi" : `Zobrazit ${entries.length} odpovědí`}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} className="space-y-2 overflow-hidden">
            {entries.map(([qId, ans]) => (
              <div key={qId} className="bg-black/40 border border-white/5 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-white/40">#{qId} — {questions[parseInt(qId)] || `Otázka ${qId}`}</span>
                  {typeof ans?.score === "number" && <ScoreBadge score={ans.score} />}
                </div>
                {ans?.choice && <p className="text-white/90 text-sm">→ {ans.choice}</p>}
                {ans?.value !== undefined && !ans?.choice && <p className="text-white/70 text-sm font-mono">Škála: {ans.value}/10</p>}
                {ans?.text && <p className="text-white/60 text-xs italic mt-1">"{ans.text}"</p>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Gauge (polokruh) ─── */
function GaugeArc({ pct, label, size = 120 }: { pct: number; label: string; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2, cy = size * 0.58;
  const startAngle = Math.PI, sweep = Math.PI * (pct / 100);
  const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(startAngle + sweep), y2 = cy + r * Math.sin(startAngle + sweep);
  const largeArc = sweep > Math.PI ? 1 : 0;
  const color = pctColor(pct);
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.65}>
        {/* track */}
        <path d={`M${cx - r},${cy} A${r},${r} 0 0,1 ${cx + r},${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.07} strokeLinecap="round"/>
        {/* fill */}
        {pct > 0 && (
          <path d={`M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2}`} fill="none" stroke={color} strokeWidth={size * 0.07} strokeLinecap="round"/>
        )}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={size * 0.2} fontWeight="900" fill={color} fontFamily="monospace">{pct}%</text>
      </svg>
      <span className="text-xs font-mono uppercase tracking-widest text-white/40 mt-1">{label}</span>
    </div>
  );
}

/* ─── Hlavní stránka ─── */
export default function NaborAdminPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const fetchCandidates = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/recruitment")
      .then(r => r.json())
      .then(d => { setCandidates(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleDecision = async (decision: "ACCEPTED" | "REJECTED") => {
    if (!selected) return;
    setDeciding(true);
    await fetch("/api/admin/recruitment/decision", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, decision, adminNote })
    });
    setSelected((p: any) => ({ ...p, status: decision }));
    fetchCandidates();
    setDeciding(false);
  };

  /* ════════ DETAIL VIEW ════════ */
  if (selected) {
    const a1 = parseAnswers(selected.phase1Answers);
    const a3 = parseAnswers(selected.phase3Answers);
    const s1 = calcScore(a1);
    const s3 = calcScore(a3);
    const overall = s1.max > 0 && s3.max > 0
      ? Math.round((s1.total + s3.total) / (s1.max + s3.max) * 100)
      : s1.pct || s3.pct;

    const isDecided = selected.status === "ACCEPTED" || selected.status === "REJECTED";

    /* Per-category strengths */
    const strengths: string[] = [], risks: string[] = [];
    [...Object.entries(PHASE1_CATS), ...Object.entries(PHASE3_CATS)].forEach(([id, cat]) => {
      const ph = parseInt(id) <= 15 ? a1 : a3;
      const a = ph[id];
      if (!a) return;
      const sc = typeof a?.score === "number" ? a.score : (typeof a?.value === "number" ? (a.value <= 3 ? 2 : a.value <= 6 ? 1 : 0) : -1);
      if (sc === 2) strengths.push(cat);
      if (sc === 0) risks.push(cat);
    });

    return (
      <div className="min-h-screen bg-[#080808] text-white">
        {/* TOP NAV */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-mafia-gold hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
            <ArrowLeft size={16}/> Seznam uchazečů
          </button>
          <span className="text-white/30 text-xs font-mono uppercase">{selected.email}</span>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* ── HERO KARTA ── */}
          <div className="relative bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_60%)]"/>
            <div className="relative flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-mafia-gold/20 border border-mafia-gold/40 flex items-center justify-center text-mafia-gold font-black text-xl">
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-heading font-black">{selected.name}</h1>
                    <p className="text-white/40 text-sm">{selected.phone || "—"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <StatusBadge status={selected.status}/>
                  <span className="text-white/20 text-xs font-mono">Přihlášen: {new Date(selected.createdAt).toLocaleDateString("cs-CZ")}</span>
                </div>
              </div>

              {/* Gauges */}
              <div className="flex gap-6 items-center">
                {s1.max > 0 && <GaugeArc pct={s1.pct} label="Fáze 1" />}
                {s3.max > 0 && <GaugeArc pct={s3.pct} label="Fáze 3" />}
                <GaugeArc pct={overall} label="Celkem" size={140} />
              </div>
            </div>

            {/* Strengths + Risks chips */}
            <div className="mt-6 flex flex-wrap gap-4">
              {strengths.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase text-green-400/70 mb-2 tracking-widest">Silné oblasti</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(strengths)].slice(0,8).map(s => (
                      <span key={s} className="px-2 py-1 text-xs rounded bg-green-500/10 text-green-400 border border-green-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {risks.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase text-red-400/70 mb-2 tracking-widest">Rizikové oblasti</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(risks)].slice(0,8).map(r => (
                      <span key={r} className="px-2 py-1 text-xs rounded bg-red-500/10 text-red-400 border border-red-500/20">{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── GRAFY ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Radar F1 */}
            {s1.max > 0 && (
              <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
                <h2 className="font-heading font-black uppercase text-sm text-mafia-gold/80 tracking-widest mb-1">Radar – Fáze 1</h2>
                <p className="text-white/30 text-xs mb-4">Vstupní pohovor ({s1.total}/{s1.max} · {s1.pct}%)</p>
                <PhaseRadar answers={a1} cats={PHASE1_CATS} color="#d4af37" />
              </div>
            )}

            {/* Radar F3 */}
            {s3.max > 0 && (
              <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
                <h2 className="font-heading font-black uppercase text-sm text-mafia-gold/80 tracking-widest mb-1">Radar – Fáze 3</h2>
                <p className="text-white/30 text-xs mb-4">Osobnostní profil ({s3.total}/{s3.max} · {s3.pct}%)</p>
                <PhaseRadar answers={a3} cats={PHASE3_CATS} color="#a78bfa" />
              </div>
            )}

            {/* Bar F1 */}
            {s1.max > 0 && (
              <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
                <h2 className="font-heading font-black uppercase text-sm text-white/50 tracking-widest mb-4">Odpovědi po otázkách – Fáze 1</h2>
                <PhaseBarChart answers={a1} questions={PHASE1_QUESTIONS} />
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-green-400"><span className="w-2 h-2 rounded bg-green-500 inline-block"/>Výborná (2)</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-400"><span className="w-2 h-2 rounded bg-yellow-500 inline-block"/>Průměrná (1)</span>
                  <span className="flex items-center gap-1 text-xs text-red-400"><span className="w-2 h-2 rounded bg-red-500 inline-block"/>Slabá (0)</span>
                </div>
              </div>
            )}

            {/* Bar F3 */}
            {s3.max > 0 && (
              <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
                <h2 className="font-heading font-black uppercase text-sm text-white/50 tracking-widest mb-4">Odpovědi po otázkách – Fáze 3</h2>
                <PhaseBarChart answers={a3} questions={PHASE3_QUESTIONS} />
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-green-400"><span className="w-2 h-2 rounded bg-green-500 inline-block"/>Výborná (2)</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-400"><span className="w-2 h-2 rounded bg-yellow-500 inline-block"/>Průměrná (1)</span>
                  <span className="flex items-center gap-1 text-xs text-red-400"><span className="w-2 h-2 rounded bg-red-500 inline-block"/>Slabá (0)</span>
                </div>
              </div>
            )}
          </div>

          {/* ── DETAILNÍ ODPOVĚDI ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
              <h2 className="font-heading font-black uppercase text-sm text-mafia-gold/80 tracking-widest mb-4 flex items-center gap-2">
                <Briefcase size={16}/> Fáze 1 – Odpovědi
                <span className={`ml-auto text-xs font-mono ${s1.pct >= 60 ? "text-green-400" : s1.pct >= 40 ? "text-yellow-400" : "text-red-400"}`}>{s1.pct}%</span>
              </h2>
              <AnswersSection answers={a1} questions={PHASE1_QUESTIONS} />
            </div>
            <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-6">
              <h2 className="font-heading font-black uppercase text-sm text-purple-400/80 tracking-widest mb-4 flex items-center gap-2">
                <User size={16}/> Fáze 3 – Odpovědi
                <span className={`ml-auto text-xs font-mono ${s3.pct >= 60 ? "text-green-400" : s3.pct >= 40 ? "text-yellow-400" : "text-red-400"}`}>{s3.pct}%</span>
              </h2>
              <AnswersSection answers={a3} questions={PHASE3_QUESTIONS} />
            </div>
          </div>

          {/* ── ROZHODNUTÍ ── */}
          <div className="bg-zinc-900/60 border border-white/8 rounded-2xl p-8">
            <h2 className="font-heading font-black uppercase tracking-widest text-white/60 text-sm mb-6 flex items-center gap-2">
              <Shield size={16}/> Rozhodnutí admina
            </h2>
            <textarea
              rows={3}
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              placeholder="Interní poznámka – proč ho přijímám / odmítám..."
              className="w-full bg-black/40 border border-white/10 p-4 text-white text-sm focus:border-mafia-gold outline-none rounded-xl resize-none mb-6"
            />
            {isDecided ? (
              <div className="flex flex-col items-center gap-3">
                <StatusBadge status={selected.status}/>
                <button onClick={() => setSelected((p: any) => ({ ...p, status: "COMPLETED" }))}
                  className="text-xs text-white/30 hover:text-white/60 underline transition-colors">
                  Změnit rozhodnutí
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => handleDecision("ACCEPTED")} disabled={deciding}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 text-lg shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={22}/> Přijmout uchazeče
                </button>
                <button onClick={() => handleDecision("REJECTED")} disabled={deciding}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 text-lg shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                  <XCircle size={22}/> Odmítnout uchazeče
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ════════ LIST VIEW ════════ */
  const pendingCount = candidates.filter(c => c.status === "COMPLETED" || c.status === "IN_PROGRESS").length;

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/8">
          <div>
            <h1 className="text-3xl font-heading font-black uppercase tracking-widest flex items-center gap-3">
              <Briefcase className="text-mafia-gold" size={32}/> Nábor
            </h1>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-1">
              {candidates.length} celkem &middot; <span className="text-mafia-gold">{pendingCount} čekajících</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchCandidates} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs uppercase tracking-widest rounded-lg">
              <RefreshCw size={14}/> Obnovit
            </button>
            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs uppercase tracking-widest rounded-lg">
              <ArrowLeft size={14}/> Admin
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-white/20 uppercase tracking-widest text-xs">
            <Clock className="animate-spin" size={18}/> Načítám...
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-32 text-white/15 uppercase tracking-widest">
            <Briefcase className="mx-auto mb-4 opacity-20" size={56}/>
            <p>Žádné přihlášky</p>
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((c, i) => {
              const a1 = parseAnswers(c.phase1Answers);
              const a3 = parseAnswers(c.phase3Answers);
              const s1 = calcScore(a1);
              const s3 = calcScore(a3);
              const overall = s1.max > 0 && s3.max > 0
                ? Math.round((s1.total + s3.total) / (s1.max + s3.max) * 100)
                : s1.pct || s3.pct;
              const col = pctColor(overall);

              return (
                <motion.div key={c.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/[0.03] border border-white/8 hover:border-mafia-gold/25 rounded-2xl p-5 transition-all">
                  {/* Score circle */}
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                    style={{ background: `conic-gradient(${col} ${overall}%, rgba(255,255,255,0.05) 0)`, boxShadow: `0 0 16px ${col}30` }}>
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-mono" style={{ color: col }}>
                      {overall}%
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-heading font-black text-white text-lg">{c.name}</span>
                      <StatusBadge status={c.status}/>
                    </div>
                    <div className="text-white/30 text-xs mb-2">{c.email} · {new Date(c.createdAt).toLocaleDateString("cs-CZ")}</div>
                    <div className="flex gap-3 flex-wrap">
                      {s1.max > 0 && <span className="text-xs font-mono" style={{ color: pctColor(s1.pct) }}>F1: {s1.pct}%</span>}
                      {s3.max > 0 && <span className="text-xs font-mono" style={{ color: pctColor(s3.pct) }}>F3: {s3.pct}%</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status !== "ACCEPTED" && c.status !== "REJECTED" && (
                      <>
                        <button onClick={async () => { await fetch("/api/admin/recruitment/decision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:c.id,decision:"ACCEPTED"})}); fetchCandidates(); }}
                          className="p-2 rounded-lg bg-green-500/15 hover:bg-green-500/30 text-green-400 transition-colors" title="Přijmout">
                          <CheckCircle2 size={18}/>
                        </button>
                        <button onClick={async () => { await fetch("/api/admin/recruitment/decision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:c.id,decision:"REJECTED"})}); fetchCandidates(); }}
                          className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors" title="Odmítnout">
                          <XCircle size={18}/>
                        </button>
                      </>
                    )}
                    <button onClick={() => { setSelected(c); setAdminNote(""); }}
                      className="flex items-center gap-2 px-4 py-2 bg-mafia-gold/10 hover:bg-mafia-gold hover:text-black text-mafia-gold transition-all text-xs uppercase tracking-widest font-bold rounded-lg">
                      <Eye size={14}/> Detail
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
