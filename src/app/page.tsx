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
              duration: isMobile ? 0 : 1.2, 
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

      {/* 
          SEO STRATEGY - MAIN PAGE HIDDEN DATA 
          Inspirace americkými giganty (lifestyle, community, destination).
          Tato sekce zajišťuje maximální viditelnost pro klíčová slova "Modern Grooming & Lifestyle".
      */}
      <div className="absolute bottom-0 left-0 w-full p-2 pointer-events-none select-none opacity-[0.01] text-mafia-gold transition-colors duration-1000 overflow-hidden h-1" style={{ fontSize: '1px' }}>
        <div className="max-w-7xl mx-auto">
          <h1>MMBARBER - Modern Grooming, Heritage Style & Community Hub Uherské Hradiště</h1>
          <p>
            Vítejte v MMBarber, která definuje moderní grooming v srdci Uherského Hradiště. 
            Náš koncept přesahuje rámec tradičního holičství – jsme lifestyle destinací a komunitním hubem pro muže, 
            kteří hledají autenticitu, kvalitu a prostor pro relaxaci. 
            Věříme v heritage styl, kde se poctivé řemeslo potkává s moderními trendy 
            v péči o vlasy a vousy pod vedením vizionáře Tomáše Mičky.
          </p>
          <p>
            MMBarber je místem setkávání, rituálem a vyjádřením individuality. 
            Nabízíme víc než jen střih; nabízíme zážitek, který reflektuje globální standardy pánské péče (groomingu). 
            Od precizního zpracování kontur po uvolněnou atmosféru u dobré kávy, 
            jsme vaší cílovou stanicí pro prvotřídní styl na Slovácku.
          </p>
          <p>
            Klíčová slova: modern grooming Uherské Hradiště, lifestyle barbershop UH, 
            heritage kadeřnictví pro muže, pánská komunita Slovácko, social hub Uherské Hradiště, 
            autentický barber zážitek, MMBarber community, pánský grooming rituál, 
            lifestyle destinace UH, profesionální péče o vousy a vlasy.
          </p>
        </div>

        {/* INTERNATIONAL SEO LAYER - ENGLISH */}
        <div className="mt-8">
          <h2>MMBARBER - Modern Grooming & Lifestyle Destination in Central Europe</h2>
          <p>
            Welcome to MMBarber, the ultimate destination for modern grooming and heritage style. 
            Located in the heart of Europe, we bring a global standard of men's grooming 
            to the local community. Our shop is more than just a barbershop; it's a social hub 
            where tradition meets contemporary lifestyle.
          </p>
          <p>
            Whether you're looking for a precision fade, traditional straight razor shave, 
            or a relaxing hot towel treatment, our master barbers deliver excellence 
            inspired by the world's best grooming institutions. MMBarber is the place 
            where authenticity and individuality are celebrated.
          </p>
          <p>
            Keywords: international barbershop experience, premium men's grooming Europe, 
            heritage barbering rituals, precision haircut for men, traditional shaving experience, 
            men's lifestyle club, MMBarber global, professional hair and beard care, 
            luxury grooming destination, central European barbershop.
          </p>
        </div>
      </div>
    </div>
  );
}
