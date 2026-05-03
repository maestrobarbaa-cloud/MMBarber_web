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
const SEOFAQ = dynamic(() => import("@/components/SEOFAQ").then(mod => mod.SEOFAQ), { ssr: false });
const BottomTerminalReveal = dynamic(() => import("@/components/BottomTerminalReveal").then(mod => mod.BottomTerminalReveal), { ssr: false });
const FooterSecrets = dynamic(() => import("@/components/FooterSecrets").then(mod => mod.FooterSecrets), { ssr: false });
const RegionalSEOCloud = dynamic(() => import("@/components/RegionalSEOCloud").then(mod => mod.RegionalSEOCloud), { ssr: false });
const GoogleReviewsWall = dynamic(() => import("@/components/GoogleReviewsWall").then(mod => mod.GoogleReviewsWall), { ssr: false });
const OperationalJournal = dynamic(() => import("@/components/OperationalJournal").then(mod => mod.OperationalJournal), { ssr: false });
const PersonalVision = dynamic(() => import("@/components/PersonalVision").then(mod => mod.PersonalVision), { ssr: false });

import { CinematicIntro } from "@/components/Intro";
import { Atmosphere } from "@/components/Atmosphere";
import { CinematicSequence737 } from "@/components/CinematicSequence737";
import { MafiaClickEffects } from "@/components/MafiaClickEffects";
import { useTranslation } from "@/hooks/useTranslation";
import { LocalSEOHomepage } from "@/components/LocalSEOHomepage";

export default function Home() {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(true);
  const [isIntroDismissed, setIsIntroDismissed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  useEffect(() => {
    // Automatically mark as visited to ensure intro is skipped
    localStorage.setItem("mmbarber_visited", "true");
    
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
            <CinematicSequence737 />
            <Hero />
            
            <div className="relative bg-transparent w-full section-optimize">
              <div className="hidden xl:block">
              </div>
              
              <SectionReveal>
                <div className="section-optimize">
                  <Profiles />
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="section-optimize">
                  <Services />
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

            <BottomTerminalReveal thresholdMultiplier={2}>
              {(level) => (
                <>
                  <SectionReveal>
                    <div className="section-optimize">
                      <FooterSecrets />
                    </div>
                  </SectionReveal>

                  <SectionReveal>
                    <div className="section-optimize">
                      <SEOFAQ />
                    </div>
                  </SectionReveal>

                  {level >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 1.5 }}
                    >
                      <SectionReveal>
                        <div className="section-optimize">
                          <RegionalSEOCloud />
                        </div>
                      </SectionReveal>
                    </motion.div>
                  )}

                  {level >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 1.5 }}
                    >
                      <SectionReveal>
                        <div className="section-optimize">
                          <GoogleReviewsWall />
                        </div>
                      </SectionReveal>
                    </motion.div>
                  )}

                  {level >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 1.5 }}
                    >
                      <SectionReveal>
                        <div className="section-optimize">
                          <OperationalJournal />
                        </div>
                      </SectionReveal>
                    </motion.div>
                  )}

                  {level >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 1.5 }}
                    >
                      <SectionReveal>
                        <div className="section-optimize">
                          <PersonalVision />
                        </div>
                      </SectionReveal>
                    </motion.div>
                  )}
                </>
              )}
            </BottomTerminalReveal>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none select-none opacity-[0.01] text-mafia-gold transition-colors duration-1000 overflow-hidden" style={{ fontSize: '1px', lineHeight: '1.2' }}>
        <div className="max-w-[95%] mx-auto columns-4 md:columns-8 lg:columns-12 gap-4">
          <h1>MMBARBER – barbershop v Uherském Hradišti, kde se píše respekt</h1>
          <p>{t.seo.description}</p>
          <div className="space-y-1">
            <p>
              Barbershop Uherské Hradiště, pánské holičství Mařatice, nejlepší střih UH, skin fade Slovácko. 
              Micka style, žádný korporát, autentický přístup, gangster vibe, poctivé řemeslo.
              Sadová 1383 Mařatice, parkování zdarma, online rezervace 24/7.
            </p>
            <p>{t.seo.extraContent}</p>
            <p>Keywords: {t.seo.keywords}</p>
          </div>
        </div>
      </div>
      <LocalSEOHomepage />
    </div>
  );
}
