'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Scale, FileText, CreditCard, Lock, Users, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LegalHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'terms' | 'privacy' | 'payments' | 'security';

export function LegalHubModal({ isOpen, onClose }: LegalHubModalProps) {
  const { lang } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('terms');

  if (!isOpen) return null;

  const tabs = [
    { id: 'terms', icon: <Scale size={18} />, label: lang === 'cs' ? 'Obchodní podmínky' : 'Terms of Service' },
    { id: 'privacy', icon: <ShieldCheck size={18} />, label: lang === 'cs' ? 'Ochrana osobních údajů' : 'Privacy Policy' },
    { id: 'payments', icon: <CreditCard size={18} />, label: lang === 'cs' ? 'Platby a Předplatné' : 'Payments & Subscriptions' },
    { id: 'security', icon: <Lock size={18} />, label: lang === 'cs' ? 'Bezpečnost komunity' : 'Community Security' },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-mafia-dark border border-white/10 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
        >
          {/* Header (Mobile Only) */}
          <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10 bg-black/50 shrink-0">
            <h2 className="font-heading font-black uppercase tracking-widest text-mafia-gold flex items-center gap-2">
              <Scale size={20} /> Legal Hub
            </h2>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-white rounded-full bg-white/5">
              <X size={20} />
            </button>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 custom-scrollbar">
            <div className="hidden md:flex p-6 border-b border-white/10 items-center justify-between">
              <h2 className="font-heading font-black uppercase tracking-widest text-mafia-gold flex items-center gap-2">
                <FileText size={20} /> Legal
              </h2>
            </div>
            
            <div className="flex md:flex-col p-2 md:p-4 gap-2 min-w-max md:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-wider ${
                    activeTab === tab.id
                      ? 'bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative bg-gradient-to-br from-mafia-dark to-black">
            <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10">
              <X size={20} />
            </button>

            <div className="max-w-3xl space-y-8 pb-12">
              {/* === TAB: TERMS === */}
              {activeTab === 'terms' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-widest mb-2">Obchodní podmínky</h1>
                    <p className="text-white/50 font-mono text-sm">Poslední aktualizace: 24. srpna 2026</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-mafia-gold uppercase tracking-widest border-b border-white/10 pb-2">1. Věková hranice a Způsobilost</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Služba je určena výhradně pro osoby <strong>starší 18 let</strong>. Vytvořením účtu potvrzujete a zaručujete, že jste plnoletí a máte plnou způsobilost k právním úkonům. Účty vytvořené osobami mladšími 18 let budou bez varování smazány.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-mafia-gold uppercase tracking-widest border-b border-white/10 pb-2">2. Autorská práva k obsahu</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Nenahrávejte fotografie, texty nebo jiný obsah, ke kterému nemáte autorská práva. Nahráním obsahu na naši platformu nám udělujete nevýhradní, bezúplatnou licenci k jeho zobrazení v rámci služby. <strong>Zakazuje se šíření obsahu třetích stran bez jejich souhlasu.</strong>
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-mafia-gold uppercase tracking-widest border-b border-white/10 pb-2">3. Odpovědnost za obsah uživatelů</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Neneseme odpovědnost za obsah nahrávaný uživateli ani za jejich chování na platformě nebo mimo ni (osobní schůzky). Uživatel nese plnou právní odpovědnost za materiály, které do služby umístí. Vyhrazujeme si právo odstranit obsah, který porušuje naše podmínky.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-mafia-gold uppercase tracking-widest border-b border-white/10 pb-2">4. Pravidla pro mazání účtů</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Uživatel může svůj účet kdykoliv smazat v nastavení. Vyhrazujeme si právo zablokovat nebo trvale smazat účet uživatele, který poruší tyto obchodní podmínky, a to bez nároku na vrácení zaplacených poplatků.
                    </p>
                  </section>
                </motion.div>
              )}

              {/* === TAB: PRIVACY / GDPR === */}
              {activeTab === 'privacy' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-widest mb-2 flex items-center gap-3">
                      <ShieldCheck className="text-green-500" /> Ochrana údajů (GDPR)
                    </h1>
                    <p className="text-white/50 font-mono text-sm">Informace o zpracování osobních údajů</p>
                  </div>

                  <div className="bg-green-900/10 border-l-2 border-green-500 p-4 rounded-r-xl mb-6">
                    <p className="text-white/80 text-sm">Vzhledem k povaze naší služby (seznamka) zpracováváme i tzv. citlivé osobní údaje (např. sexuální orientace, zdravotní stav). Děláme tak výhradně na základě vašeho explicitního souhlasu.</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-green-400 uppercase tracking-widest border-b border-white/10 pb-2">Co sbíráme a proč?</h3>
                    <ul className="list-disc list-inside text-white/70 font-sans leading-relaxed text-sm space-y-2">
                      <li><strong>Základní údaje:</strong> E-mail, věk, jméno (pro vytvoření účtu).</li>
                      <li><strong>Rozšířený profil:</strong> Zájmy, preference, fotografie, psychologický profil (pro fungování doporučovacích algoritmů).</li>
                      <li><strong>Geolokační data:</strong> Vaše přibližná poloha (pro funkci hledání v okolí - "Nejbližší").</li>
                      <li><strong>Komunikační data:</strong> Obsah zpráv odeslaných na platformě (pro zajištění bezpečnosti komunity a DSA moderaci).</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-green-400 uppercase tracking-widest border-b border-white/10 pb-2">Jak dlouho data uchováváme?</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Vaše data uchováváme pouze po dobu trvání vašeho účtu. Po smazání účtu jsou data nevratně vymazána z našich aktivních databází do 30 dnů. Některá transakční data mohou být uchována déle kvůli zákonným účetním požadavkům. Zprávy označené v nahlášení (DSA) se uchovávají po dobu vyšetřování.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-green-400 uppercase tracking-widest border-b border-white/10 pb-2">Vaše práva (Výmaz a Stažení dat)</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Máte právo kdykoliv požádat o kompletní výpis vašich dat (strojově čitelný formát) nebo o tzv. Právo na zapomnění (kompletní výmaz). Žádosti lze vyřizovat v sekci Nastavení &gt; Soukromí nebo na e-mailu dpo@mmbarber.cz.
                    </p>
                  </section>
                </motion.div>
              )}

              {/* === TAB: PAYMENTS === */}
              {activeTab === 'payments' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-widest mb-2 text-blue-400">Platby a Předplatné</h1>
                    <p className="text-white/50 font-mono text-sm">Fakturace, storna a MMCoins</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">Placené členství a MMCoins</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Základní používání aplikace je zdarma. Pro odemčení prémiových funkcí (pokročilé algoritmy, detailní reporty shody) je vyžadována virtuální měna "MMCoins" nebo prémiové předplatné.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">Automatické obnovování předplatného</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Pokud si zakoupíte opakované měsíční předplatné, bude se vám z platební karty automaticky strhávat částka na další období, dokud předplatné nezrušíte v Nastavení &gt; Platby. Zrušení musíte provést nejméně 24 hodin před koncem aktuálního období.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">Storna a vrácení peněz (Refund Policy)</h3>
                    <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                      <p className="text-white/80 font-sans text-sm">
                        Veškeré nákupy jednorázových balíčků (MMCoins) jsou konečné a nevratné. U předplatného máte ze zákona nárok na odstoupení od smlouvy do 14 dnů, pokud jste nezačali čerpat digitální obsah. Otevřením prémiového reportu nebo využitím mince výslovně souhlasíte se započetím plnění před uplynutím lhůty.
                      </p>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* === TAB: SECURITY === */}
              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-widest mb-2 text-red-500 flex items-center gap-3">
                      <AlertTriangle /> Bezpečnost Komunity
                    </h1>
                    <p className="text-white/50 font-mono text-sm">Ochrana proti podvodům a moderace</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest border-b border-white/10 pb-2">Ochrana fotek a informací</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Snažíme se maximálně chránit vaše soukromí. Naše aplikace blokuje pořizování snímků obrazovky (na podporovaných zařízeních) v soukromých konverzacích. Přesto varujeme před sdílením vysoce citlivých osobních údajů nebo kompromitujících fotografií.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest border-b border-white/10 pb-2">Fake profily a Catfishing</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Proti falešným profilům bojujeme ověřováním identity (tzv. "Trust Endorsements"). Pokud máte podezření, že s vámi komunikuje falešný profil, okamžitě využijte tlačítko "Nahlásit profil" na jeho kartě. Profil bude prošetřen naším moderačním týmem.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest border-b border-white/10 pb-2">Postup při úniku dat (Data Breach)</h3>
                    <p className="text-white/70 font-sans leading-relaxed text-sm">
                      Máme zavedeny moderní bezpečnostní standardy pro ochranu databáze. V nepravděpodobném případě bezpečnostního incidentu nebo úniku dat, který by mohl ohrozit vaše práva a svobody, vás budeme neprodleně informovat a nahlásíme situaci ÚOOÚ v souladu s čl. 33 GDPR.
                    </p>
                  </section>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
