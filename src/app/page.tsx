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
const DailyIntelligence = dynamic(() => import("@/components/DailyIntelligence").then(mod => mod.DailyIntelligence), { ssr: false });

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

      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none select-none opacity-[0.01] text-mafia-gold transition-colors duration-1000 overflow-hidden" style={{ fontSize: '1px', lineHeight: '1.2' }}>
        <div className="max-w-[95%] mx-auto columns-4 md:columns-8 lg:columns-12 gap-4">
          <h1>{t.seo.title}</h1>
          <p>{t.seo.description}</p>
          <div className="space-y-1">
            <p>{t.seo.extraContent}</p>
            <p>Keywords: {t.seo.keywords}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
