"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, ShieldCheck, HelpCircle, Sparkles, Flame, Eye } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function DatingSEOArchive() {
  const { lang } = useTranslation();

  return (
    <div className="w-full bg-[#030303] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      {/* Dynamic Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-mafia-gold-rgb),0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-mafia-gold/5 border border-mafia-gold/20 text-mafia-gold font-mono text-[9px] uppercase tracking-[0.40em]">
            <Heart size={10} className="text-mafia-gold fill-mafia-gold/30 animate-pulse" />
            <span>{lang === 'cs' ? 'EXKLUZIVNÍ VZTAHOVÝ PROTOKOL' : 'EXCLUSIVE RELATIONSHIP PROTOCOL'}</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-heading font-black text-smoke-white uppercase tracking-tighter italic">
            {lang === 'cs' ? 'Moderní seznamování a intimita na Slovácku' : 'Modern Dating and Intimacy in Slovácko'}
          </h2>
          <p className="text-mafia-gold/60 font-mono text-[10px] md:text-xs uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
            {lang === 'cs' 
              ? 'Hluboké vztahy, intimní chemie a přirozené seznamování v Uherském Hradišti. Zapomeňte na chladné swipování a zažijte reálné lidské propojení.'
              : 'Deep connections, intimate chemistry, and natural dating in Uherské Hradiště. Forget cold swiping and experience genuine human bonds.'}
          </p>
        </div>

        {/* Triple Column Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all duration-500 space-y-4">
            <div className="w-12 h-12 border border-mafia-gold/25 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider italic">
              {lang === 'cs' ? 'Unikátní Koncept' : 'Unique Concept'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'MMBARBER Seznamka není obyčejná seznamovací aplikace. Propojujeme zajímavé osobnosti a nezávislé lidi z našeho regionu přímo s exkluzivním životním stylem naší komunity.'
                : 'MMBarber Dating is not a generic dating app. We connect interesting personalities and independent individuals of our region directly with the exclusive lifestyle of our community.'}
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all duration-500 space-y-4">
            <div className="w-12 h-12 border border-mafia-gold/25 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <Flame size={20} className="text-mafia-gold" />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider italic">
              {lang === 'cs' ? 'Skutečná Intimita' : 'True Intimacy'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'Vztah nestojí na filtrech z Instagramu, ale na hlubokém porozumění, intimitě a oboustranné přitažlivosti. Pomáháme bourat tabu a otevírat témata sexuálního souladu a komunikace.'
                : 'A relationship is not built on Instagram filters, but on deep mutual understanding, physical intimacy, and attraction. We help break taboos and open topics of sexual alignment.'}
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-white/[0.01] hover:border-mafia-gold/20 transition-all duration-500 space-y-4">
            <div className="w-12 h-12 border border-mafia-gold/25 bg-mafia-gold/5 flex items-center justify-center text-mafia-gold rounded">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider italic">
              {lang === 'cs' ? 'Diskrétní Prostor' : 'Discrete Space'}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              {lang === 'cs'
                ? 'Bezpečnost a stoprocentní důvěrnost osobních údajů. Žádné falešné boty, podvodné profily ani zneužití citlivých témat. Vaše touhy a vztahová tajemství jsou u nás v naprostém bezpečí.'
                : 'Safety and 100% confidentiality of personal information. No fake bots, deceptive profiles, or exploitation of sensitive topics. Your desires and relationship secrets are perfectly safe.'}
            </p>
          </div>
        </div>

        {/* Semantic SEO Article Section */}
        <article className="border border-white/5 p-8 md:p-12 bg-black/60 rounded-sm font-sans space-y-6 text-sm text-white/70 leading-relaxed">
          <h3 className="text-2xl font-heading font-black text-white uppercase tracking-widest">
            {lang === 'cs' ? 'Jak najít lásku, vášeň a zdravou intimitu v Uherském Hradišti a okolí?' : 'How to find love, passion, and healthy intimacy in Uherské Hradiště?'}
          </h3>
          <p>
            {lang === 'cs' ? (
              <>
                Moderní svět online seznamování je plný prázdných zpráv, falešných identit a povrchních setkání, která nikam nevedou. 
                V regionu <strong>Slovácko (Uherské Hradiště, Kunovice, Staré Město, Uherský Brod)</strong> proto přicházíme s revolucí. 
                <strong>MMBARBER Seznamka</strong> staví na pevných základech komunity a reálné lidské psychologie. Naším cílem je 
                propojovat lidi, kteří hledají něco víc než jen další bezvýznamné setkání. Zaměřujeme se na 
                <strong>hluboké vztahy, fyzickou i emocionální přitažlivost, vzájemný respekt</strong> a zdravé sebepojetí. Věříme, že 
                otevřený hovor o našich touhách, intimitě a sexuálních očekáváních je klíčem k vybudování stabilního a dlouhodobě fungujícího svazku.
              </>
            ) : (
              <>
                The modern world of online dating is full of ghosting, fake profiles, and superficial matches that lead nowhere. 
                In the <strong>Slovácko region (Uherské Hradiště, Kunovice, Staré Město, Uherský Brod)</strong>, we are starting a revolution. 
                <strong>MMBarber Dating</strong> is built on the strong foundation of community and real human psychology. Our goal is 
                to connect people searching for more than just another meaningless encounter. We focus on 
                <strong>deep relationships, physical and emotional chemistry, mutual respect</strong>, and healthy self-awareness. We believe 
                that open talk about our desires, intimacy, and sexual expectations is key to building a stable partnership.
              </>
            )}
          </p>

          <p>
            {lang === 'cs' ? (
              <>
                Naše platforma je určena pro singles i nezávislé osobnosti ze <strong>Zlína, Hodonína, Kyjova, Veselí nad Moravou</strong> 
                a celého Jihomoravského a Zlínského kraje. MMBARBER seznamka podporuje rozvoj osobní přitažlivosti, sebevědomí 
                a charismatu (které naši klienti budují přímo v křeslech našich špičkových barberů). Propojujeme lidi, kteří vědí, 
                co chtějí, a nebojí se mluvit o svých intimních hranicích, životních snech a hodnotách. Ať už hledáte osudového partnera, 
                nová přátelství s podobným vibem, nebo prostě prostor pro nezávazné, ale vysoce inteligentní randění, náš bezpečný protokol 
                vám nabízí ideální útočiště.
              </>
            ) : (
              <>
                Our platform is tailor-made for singles and independent personalities from <strong>Zlín, Hodonín, Kyjov, Veselí nad Moravou</strong>, 
                and the entire South Moravian and Zlín regions. MMBarber Dating supports the growth of personal attraction, confidence, 
                and charisma (which our clients build directly in the chairs of our premium barbers). We connect people who know 
                what they want and are not afraid to discuss their intimate boundaries, life dreams, and core values. Whether you are 
                looking for a soulmate, new friendships with a matching vibe, or simply a space for casual yet highly intelligent dating, 
                our secure protocol offers the ideal shelter.
              </>
            )}
          </p>
        </article>

        {/* Structured FAQ with Schema Org Markup */}
        <div itemScope itemType="https://schema.org/FAQPage" className="border border-white/5 p-8 md:p-12 bg-[#020202] rounded-sm space-y-8">
          <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-wider text-center flex items-center justify-center gap-3">
            <HelpCircle className="text-mafia-gold animate-bounce" size={20} />
            <span>{lang === 'cs' ? 'Časté dotazy o seznamce, vztazích a intimitě' : 'FAQ About Dating, Relationships and Intimacy'}</span>
          </h3>

          <div className="space-y-6 divide-y divide-white/5">
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-4">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Čím je MM BARBER Seznamka na Slovácku tak jedinečná?' : 'What makes MM Barber Dating in Slovácko so unique?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Na rozdíl od standardních seznamovacích aplikací, které jsou plné anonymních a často podvodných účtů, je MM Seznamka komunitní projekt propojený s klientelou našeho prémiového pánského salonu v Uherském Hradišti. Lidé se zde propojují na základě sdíleného vkusu, životních hodnot a vysokého standardu osobní péče. Je to bezpečný a diskrétní kruh prověřených lidí.'
                    : 'Unlike standard dating apps crowded with anonymous and often fake accounts, MM Dating is a community project linked with the client base of our premium men\'s salon in Uherské Hradiště. People connect here based on shared taste, life values, and high standards of self-care. It is a secure, discrete circle of verified individuals.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Proč v rámci seznamky otevíráte témata intimity a sexuality?' : 'Why do you open topics of intimacy and sexuality in the dating network?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Fyzický i citový soulad (intimita) jsou klíčovými pilíři každého úspěšného vztahu. Mluvit otevřeně o svých představách, intimitě a vztahových očekáváních pomáhá předejít nedorozuměním a buduje silnou počáteční chemii. Chceme, aby se naši členové cítili svobodně a sebevědomě při vyjadřování svých intimních potřeb bez jakéhokoliv pocitu tabu.'
                    : 'Physical and emotional alignment (intimacy) are the key pillars of any successful relationship. Discussing your desires, intimate boundaries, and relationship expectations openly prevents future misunderstandings and builds massive chemistry. We want our members to feel free and confident expressing their intimate needs without any sense of taboo.'}
                </p>
              </div>
            </div>

            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="pt-6">
              <h4 itemProp="name" className="text-sm md:text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-mafia-gold">Q:</span>
                {lang === 'cs' ? 'Je seznámení na Slovácku přes MMBARBER plně diskrétní?' : 'Is connecting in Slovácko through MMBarber completely discrete?'}
              </h4>
              <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="mt-2 text-xs text-white/60 font-sans pl-6 leading-relaxed">
                <p itemProp="text">
                  {lang === 'cs'
                    ? 'Ano, diskrétnost a bezpečí jsou pro nás absolutním zákonem. Vaše osobní a kontaktní údaje nejsou nikdy veřejně sdíleny ani prodávány třetím stranám. Komunikační protokoly probíhají za šifrovanými branami a veškerá propojení se dějí pouze s vaším přímým, explicitním souhlasem.'
                    : 'Yes, discretion and security are our absolute laws. Your personal and contact details are never publicly shared or sold to third parties. Communication protocols run behind encrypted gateways, and all connections happen strictly with your direct, explicit consent.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* World-Class Keywords Data Node */}
        <div className="p-10 border border-mafia-gold/20 bg-black/80 flex flex-col items-center text-center rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.3em] font-black">NETWORK_INTELLIGENCE_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {lang === 'cs'
              ? 'Seznamka Uherské Hradiště, randění Slovácko, intimita a vztahy, nejlepší seznamka UH, nezávazné seznámení, vztahová psychologie, přitažlivost a chemie, single v Uherském Hradišti, bezpečné seznamování Zlín, diskrétní randění Hodonín, MM komunitní síť, MM_DATING_SECURE_PROTOCOL.'
              : 'Dating Uherské Hradiště, dating Slovácko, intimacy and relationships, best dating UH, casual dating, relationship psychology, attraction and chemistry, singles in Uherské Hradiště, safe dating Zlín, discrete dating Hodonín, MM community network, MM_DATING_SECURE_PROTOCOL.'}
          </p>
        </div>

        {/* Footer Brand Accent */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="h-px w-24 bg-mafia-gold/20" />
          <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em] text-center leading-relaxed">
            MMBARBER © 2026 // RELATIONSHIP PROTOCOL v3.5 // UH UHERSKÉ HRADIŠTĚ
          </p>
        </div>
      </div>
    </div>
  );
}
