"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";

// Dynamic imports for below-the-fold content
const Services = dynamic(() => import("@/components/Services").then(mod => mod.Services), { ssr: false });
const Profiles = dynamic(() => import("@/components/Profiles").then(mod => mod.Profiles), { ssr: false });
const HolidayCountdown = dynamic(() => import("@/components/HolidayCountdown").then(mod => mod.HolidayCountdown), { ssr: false });
const EnvironmentSlider = dynamic(() => import("@/components/EnvironmentSlider").then(mod => mod.EnvironmentSlider), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false });
const Partners = dynamic(() => import("@/components/Partners").then(mod => mod.Partners), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });
const StyleDefinition = dynamic(() => import("@/components/StyleDefinition").then(mod => mod.StyleDefinition), { ssr: false });

import { CinematicIntro } from "@/components/Intro";
import { Atmosphere } from "@/components/Atmosphere";
import { MinigameToggle } from "@/components/MinigameToggle";
import { MobileCompass } from "@/components/MobileCompass";
import { FloatingScissors } from "@/components/FloatingScissors";
import { CinematicSequence737 } from "@/components/CinematicSequence737";
import { MafiaClickEffects } from "@/components/MafiaClickEffects";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  useEffect(() => {
    // Check if intro was already dismissed in a previous session or if on mobile/tablet
    const hasVisited = localStorage.getItem("mmbarber_visited") === "true";
    const isMobileView = window.innerWidth < 1280;

    if (hasVisited || isMobileView) {
      setShowContent(true);
      setIsIntroDismissed(true);
      
      // If it's a mobile view, mark as visited so they don't see it even if they switch to desktop mode/larger screen
      if (isMobileView && !hasVisited) {
        localStorage.setItem("mmbarber_visited", "true");
        // Also set a specific mobile flag for consistency
        localStorage.setItem("mmbarber_mobile_skip", "true");
      }
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);

    const handleMobileEffectsUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsMobileEffectsEnabled(detail);
    };
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    };
  }, []);

  const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    // Disable heavy effects on low-tier or if user disabled them
    if (isMobile && !isMobileEffectsEnabled) {
      return <div className="w-full">{children}</div>;
    }

    return (
      <motion.div
        initial={{ 
          opacity: 0, 
          y: isMobile ? 40 : 80, 
          filter: isMobile ? "blur(10px)" : "blur(25px)",
          scale: isMobile ? 1 : 0.98
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          scale: 1
        }}
        viewport={{ 
          once: true, 
          margin: isMobile ? "-10% 0px -10% 0px" : "-20% 0px -20% 0px" 
        }}
        transition={{ 
          duration: isMobile ? 1.5 : 2.5, 
          delay: isMobile ? delay * 0.5 : delay,
          ease: [0.16, 1, 0.3, 1] 
        }}
        style={{ willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
        className="w-full"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <MafiaClickEffects />
      {!isIntroDismissed && (
        <CinematicIntro onDismiss={() => {
           setShowContent(true);
           setIsIntroDismissed(true);
        }} />
      )}
      
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={isMobile ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: isMobile ? 0.01 : 1.2, 
              ease: [0.16, 1, 0.3, 1], 
            }}
            className="flex flex-col w-full"
          >
            <Atmosphere />
            <MinigameToggle />
            <CinematicSequence737 />
            <Hero />
            
            <div className="relative bg-transparent w-full section-optimize">
              <div className="hidden xl:block">
                <FloatingScissors position="absolute" />
              </div>
              
              <SectionReveal>
                <div className="section-optimize">
                  <Services />
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="section-optimize">
                  <Profiles />
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="section-optimize">
                  <HolidayCountdown />
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="section-optimize">
                  <StyleDefinition />
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="section-optimize">
                  <EnvironmentSlider />
                </div>
              </SectionReveal>
            </div>

            <SectionReveal>
              <div className="section-optimize">
                <Contact />
              </div>
            </SectionReveal>

            <SectionReveal>
              <div className="section-optimize">
                <Partners />
              </div>
            </SectionReveal>

            <SectionReveal>
              <div className="section-optimize">
                <Footer />
              </div>
            </SectionReveal>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none select-none opacity-[0.02] text-mafia-gold transition-colors duration-1000 overflow-hidden" style={{ fontSize: '2px', lineHeight: '1' }}>
        <div className="max-w-7xl mx-auto">
          <h1>{t.seo.title}</h1>
          <p>{t.seo.description}</p>
          <p>
            Hledáte nejlepší pánské kadeřnictví nebo barbershop v Uherském Hradišti a okolí? 
            MM BARBER nabízí špičkový pánský střih, profesionální úpravu vousů břitvou a moderní skin fade přímo v srdci Slovácka. 
            Naši klienti k nám jezdí z lokalit jako Mařatice, Kunovice, Staré Město u Uherského Hradiště, Jarošov, Sady, Vésky, ale i z Napajedel či Uherského Ostrohu.
            Pokud se ptáte, kam na pánský střih v UH nebo kde najít nejlepšího holiče, MM BARBER je jasná volba pro každého muže, který dbá o svůj styl.
            Nabízíme kompletní grooming rituály, napařování vousů (hot towel), precizní taper fade a klasické pánské účesy, které drží tvar.
            Pánský kadeřník Tomáš Mička a jeho tým v Uherském Hradišti zaručují kvalitu bez kompromisů a unikátní atmosféru pánského klubu.
            Keywords: {t.seo.keywords}
          </p>
          <p>
            Uherské Hradiště a region Slovácko žijí kulturou, sportem a tradicemi. 
            Ať už míříte na Letní filmovou školu (LFŠ), proslulé Slovácké slavnosti vína a otevřených památek, nebo na prvoligový fotbal na stadion 1.FC Slovácko, MM BARBER je součástí tohoto tepajícího srdce města.
            Naši klienti často navštěvují Slovácké divadlo, relaxují v Aquaparku Uherské Hradiště nebo vyrážejí na výlety na hrad Buchlov, zámek Buchlovice a poutní místo Velehrad.
            Pokud hledáte nejlepší burger v UH, dobrou pizzu, poctivý oběd nebo kam vyrazit večer za zábavou (Klub Mír, místní vinárny, OC Stará Tržnice), u nás v barberu vždy dostanete ty nejlepší tipy.
            Kromě stylu řešíme i praktické věci – pokud hledáte **parkování zdarma v Uherském Hradišti**, u našeho barbershopu zaparkujete bez problémů a bez poplatků. 
            Nacházíme se v blízkosti klíčových bodů jako je Nemocnice Uherské Hradiště, pošta UH, vlakové i autobusové nádraží nebo Magistrát města. 
            Víme, kde je nejlepší lékárna nonstop, kam do fitka, nebo kde nakoupit v Stop Shop Staré Město.
            Jsme hrdými patrioty a podporujeme lokální život v lokalitách Jarošov, Mařatice, Kunovice a Staré Město. 
            Uherské Hradiště – město vína, folkloru, bezproblémového parkování a špičkového pánského stylu v MM BARBER.
          </p>
          <p>
            Ultimate Local Guide Uherske Hradiste: best barbershop near Nemocnice UH, men&apos;s grooming near Slovacke divadlo, 
            where to park for free in the city center, top lifestyle hub in Moravia. 
            From Summer Film School events to daily services like post office or hospital info, 
            we connect the community in Uherske Hradiste, Kunovice, and Stare Mesto.
          </p>
        </div>
      </div>
    </div>
  );
}
