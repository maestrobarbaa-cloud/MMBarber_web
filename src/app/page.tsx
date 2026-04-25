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

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);

  useEffect(() => {
    // Check if intro was already dismissed in a previous session or if on mobile/tablet
    const hasVisited = localStorage.getItem("mmbarber_visited") === "true";
    if (hasVisited || window.innerWidth < 1280) {
      setShowContent(true);
      setIsIntroDismissed(true);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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
    if (isMobile && !isMobileEffectsEnabled) {
      return <div className="w-full">{children}</div>;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 80, filter: "blur(25px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
        transition={{ 
          duration: 2.5, 
          delay,
          ease: [0.16, 1, 0.3, 1] 
        }}
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
              duration: isMobile ? 0 : 1.2, 
              ease: [0.16, 1, 0.3, 1], 
            }}
            className="flex flex-col w-full"
          >
            <Atmosphere />
            <MinigameToggle />
            <CinematicSequence737 />
            <Hero />
            
            <div className="relative bg-transparent w-full">
              <div className="hidden xl:block">
                <FloatingScissors position="absolute" />
              </div>
              
              <SectionReveal>
                <Services />
              </SectionReveal>

              <SectionReveal>
                <Profiles />
              </SectionReveal>

              <SectionReveal>
                <HolidayCountdown />
              </SectionReveal>

              <SectionReveal>
                <StyleDefinition />
              </SectionReveal>

              <SectionReveal>
                <EnvironmentSlider />
              </SectionReveal>
            </div>

            <SectionReveal>
              <Contact />
            </SectionReveal>

            <SectionReveal>
              <Partners />
            </SectionReveal>

            <SectionReveal>
              <Footer />
            </SectionReveal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
