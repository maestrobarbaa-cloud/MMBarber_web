"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";

// Dynamic imports for below-the-fold content
const Services = dynamic(() => import("@/components/Services").then(mod => mod.Services), { ssr: false });
const Profiles = dynamic(() => import("@/components/Profiles").then(mod => mod.Profiles), { ssr: false });
const HolidayCountdown = dynamic(() => import("@/components/HolidayCountdown").then(mod => mod.HolidayCountdown), { ssr: false });
const Atmosphere = dynamic(() => import("@/components/Atmosphere").then(mod => mod.Atmosphere), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false });
const Partners = dynamic(() => import("@/components/Partners").then(mod => mod.Partners), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });
const StyleDefinition = dynamic(() => import("@/components/StyleDefinition").then(mod => mod.StyleDefinition), { ssr: false });
const SEOFAQ = dynamic(() => import("@/components/SEOFAQ").then(mod => mod.SEOFAQ), { ssr: false });
const BottomTerminalReveal = dynamic(() => import("@/components/BottomTerminalReveal").then(mod => mod.BottomTerminalReveal), { ssr: false });
const FooterSecrets = dynamic(() => import("@/components/FooterSecrets").then(mod => mod.FooterSecrets), { ssr: false });
const RegionalSEOCloud = dynamic(() => import("@/components/RegionalSEOCloud").then(mod => mod.RegionalSEOCloud), { ssr: false });
const GoogleReviewsWall = dynamic(() => import("@/components/GoogleReviewsWall").then(mod => mod.GoogleReviewsWall), { ssr: false });
const OperationalJournal = dynamic(() => import("@/components/OperationalJournal").then(mod => mod.OperationalJournal), { ssr: false });
const PersonalVision = dynamic(() => import("@/components/PersonalVision").then(mod => mod.PersonalVision), { ssr: false });
const GlobalIntelligenceArchive = dynamic(() => import("@/components/GlobalIntelligenceArchive").then(mod => mod.GlobalIntelligenceArchive), { ssr: false });
const GroomingGuideArchive = dynamic(() => import("@/components/GroomingGuideArchive").then(mod => mod.GroomingGuideArchive), { ssr: false });
const DailyIntelligence = dynamic(() => import("@/components/DailyIntelligence").then(mod => mod.DailyIntelligence), { ssr: false });

import { CinematicIntro } from "@/components/Intro";
import { CinematicSequence737 } from "@/components/CinematicSequence737";
import { MafiaClickEffects } from "@/components/MafiaClickEffects";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalSEOHomepage } from "@/components/LocalSEOHomepage";

// SectionReveal defined outside to prevent re-initialization on parent render
const SectionReveal = ({ children, delay = 0, isMobile, isMobileEffectsEnabled }: { children: React.ReactNode, delay?: number, isMobile: boolean, isMobileEffectsEnabled: boolean }) => {
  if (isMobile && !isMobileEffectsEnabled) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.8, delay: isMobile ? delay * 0.2 : delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(true);
  const [isIntroDismissed, setIsIntroDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("mmbarber_visited", "true");
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);
    const handleMobileEffectsUpdate = (e: Event) => setIsMobileEffectsEnabled((e as CustomEvent).detail);
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <MafiaClickEffects />
      
      {/* Global Atmosphere is now outside any reveal animations to ensure it shows everywhere */}
      <Atmosphere />

      {!isIntroDismissed && (
        <CinematicIntro onDismiss={() => {
           setShowContent(true);
           setIsIntroDismissed(true);
        }} />
      )}
      
      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex flex-col w-full">
            <CinematicSequence737 />
            <Hero />
            
            <div className="relative bg-transparent w-full">
              {/* Core sections */}
              <div id="operativi" className="section-optimize"><Profiles /></div>
              <div id="services" className="section-optimize"><Services /></div>

              {/* Sequential reveals */}
              <SectionReveal delay={0.1} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                <div className="section-optimize"><HolidayCountdown /></div>
              </SectionReveal>

              <SectionReveal delay={0.2} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                <div className="section-optimize"><StyleDefinition /></div>
              </SectionReveal>

              <SectionReveal delay={0.4} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                <div id="kontakt" className="section-optimize"><Contact /></div>
              </SectionReveal>

              <SectionReveal delay={0.5} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                <div className="section-optimize"><Partners /></div>
              </SectionReveal>

              <div className="pt-0">
                <Footer />
              </div>
            </div>
            
            <BottomTerminalReveal thresholdMultiplier={100}>
              {(level) => (
                <div className="w-full flex flex-col gap-12 pb-32">
                  {level >= 1 && (
                    <SectionReveal isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                      <div className="max-w-4xl mx-auto px-6"><DailyIntelligence /></div>
                    </SectionReveal>
                  )}

                  {level >= 2 && (
                    <SectionReveal isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                      <div className="w-full flex flex-col gap-12">
                        <FooterSecrets />
                        <RegionalSEOCloud />
                      </div>
                    </SectionReveal>
                  )}

                  {level >= 3 && (
                    <SectionReveal isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                      <div className="w-full flex flex-col gap-12">
                        <SEOFAQ />
                        <GoogleReviewsWall />
                      </div>
                    </SectionReveal>
                  )}

                  {level >= 4 && (
                    <SectionReveal isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                      <div className="w-full flex flex-col gap-12">
                        <GlobalIntelligenceArchive />
                        <OperationalJournal />
                      </div>
                    </SectionReveal>
                  )}

                  {level >= 5 && (
                    <SectionReveal isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                      <div className="w-full flex flex-col gap-12">
                        <GroomingGuideArchive />
                        <PersonalVision />
                      </div>
                    </SectionReveal>
                  )}
                </div>
              )}
            </BottomTerminalReveal>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none select-none opacity-[0.01] text-mafia-gold transition-colors duration-1000 overflow-hidden" style={{ fontSize: '1px', lineHeight: '1.2' }}>
        <div className="max-w-[95%] mx-auto columns-4 md:columns-8 lg:columns-12 gap-4">
          <h1>MMBARBER | Barbershop Uherské Hradiště – střihy & vousy</h1>
          <p>{t.seo.description}</p>
          <div className="space-y-1">
            <p>Barbershop Uherské Hradiště, pánské holičství Mařatice, nejlepší střih UH, skin fade Slovácko. Sadová 1383 Mařatice.</p>
          </div>
        </div>
      </div>
      <LocalSEOHomepage />
    </div>
  );
}
