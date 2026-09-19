"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";

// Jednoduchý skeleton loader pro plynulejší renderování na slabších zařízeních
const LoadingSkeleton = () => (
  <div className="w-full min-h-[30vh] bg-mafia-black/40 animate-pulse flex items-center justify-center border-y border-mafia-gold/5">
    <div className="w-8 h-8 rounded-full border-t-2 border-l-2 border-mafia-gold animate-spin opacity-30" />
  </div>
);

// Dynamic imports for below-the-fold content with Loading Skeletons
const Services = dynamic(() => import("@/components/Services").then(mod => mod.Services), { ssr: false, loading: () => <LoadingSkeleton /> });
const Profiles = dynamic(() => import("@/components/Profiles").then(mod => mod.Profiles), { ssr: false, loading: () => <LoadingSkeleton /> });
const HolidayCountdown = dynamic(() => import("@/components/HolidayCountdown").then(mod => mod.HolidayCountdown), { ssr: false, loading: () => <LoadingSkeleton /> });
const Atmosphere = dynamic(() => import("@/components/Atmosphere").then(mod => mod.Atmosphere), { ssr: false, loading: () => <LoadingSkeleton /> });
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact), { ssr: false, loading: () => <LoadingSkeleton /> });
const Partners = dynamic(() => import("@/components/Partners").then(mod => mod.Partners), { ssr: false, loading: () => <LoadingSkeleton /> });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false, loading: () => <LoadingSkeleton /> });
const StyleDefinition = dynamic(() => import("@/components/StyleDefinition").then(mod => mod.StyleDefinition), { ssr: false, loading: () => <LoadingSkeleton /> });
const SEOFAQ = dynamic(() => import("@/components/SEOFAQ").then(mod => mod.SEOFAQ), { ssr: false, loading: () => <LoadingSkeleton /> });
const BottomTerminalReveal = dynamic(() => import("@/components/BottomTerminalReveal").then(mod => mod.BottomTerminalReveal), { ssr: false, loading: () => <LoadingSkeleton /> });
const FooterSecrets = dynamic(() => import("@/components/FooterSecrets").then(mod => mod.FooterSecrets), { ssr: false, loading: () => <LoadingSkeleton /> });
const RegionalSEOCloud = dynamic(() => import("@/components/RegionalSEOCloud").then(mod => mod.RegionalSEOCloud), { ssr: false, loading: () => <LoadingSkeleton /> });
const GoogleReviewsWall = dynamic(() => import("@/components/GoogleReviewsWall").then(mod => mod.GoogleReviewsWall), { ssr: false, loading: () => <LoadingSkeleton /> });
const OperationalJournal = dynamic(() => import("@/components/OperationalJournal").then(mod => mod.OperationalJournal), { ssr: false, loading: () => <LoadingSkeleton /> });
const PersonalVision = dynamic(() => import("@/components/PersonalVision").then(mod => mod.PersonalVision), { ssr: false, loading: () => <LoadingSkeleton /> });
const GlobalIntelligenceArchive = dynamic(() => import("@/components/GlobalIntelligenceArchive").then(mod => mod.GlobalIntelligenceArchive), { ssr: false, loading: () => <LoadingSkeleton /> });
const GroomingGuideArchive = dynamic(() => import("@/components/GroomingGuideArchive").then(mod => mod.GroomingGuideArchive), { ssr: false, loading: () => <LoadingSkeleton /> });
const DailyIntelligence = dynamic(() => import("@/components/DailyIntelligence").then(mod => mod.DailyIntelligence), { ssr: false, loading: () => <LoadingSkeleton /> });

import { CinematicIntro } from "@/components/Intro";
import { CinematicSequence737 } from "@/components/CinematicSequence737";
import { MafiaClickEffects } from "@/components/MafiaClickEffects";
import { HiddenSeoArchive } from '@/components/HiddenSEOArchive';
import { useTranslation } from "@/hooks/useTranslation";
import { RecruitmentNotification } from "@/components/RecruitmentNotification";

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
  const router = useRouter();
  const { t, lang } = useTranslation();
  const [showContent, setShowContent] = useState(true);
  const [isIntroDismissed, setIsIntroDismissed] = useState(true); // SSR safe default
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = useState(false);
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch global visibility settings
    const fetchVisibility = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const parsed: Record<string, boolean> = {};
          if (data.values) {
            Object.entries(data.values).forEach(([key, val]) => {
              const v = String(val).toLowerCase();
              parsed[key] = !(v === 'false' || v === 'skryté' || v === 'hidden');
            });
          }
          setVisibility(parsed);
        }
      } catch (e) {
        console.error("Failed to load visibility settings", e);
      }
    };
    fetchVisibility();
    // Only run intro if user hasn't visited yet
    const visited = localStorage.getItem("mmbarber_visited") === "true";
    setIsIntroDismissed(visited);

    const triggerIntro = () => {
      setIsIntroDismissed(false);
      setShowContent(true);
    };
    window.addEventListener("mmbarber-trigger-intro", triggerIntro);

    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const initialEffectsState = localStorage.getItem("mmbarber_mobile_effects_enabled") === "true";
    setIsMobileEffectsEnabled(initialEffectsState);
    const handleMobileEffectsUpdate = (e: Event) => setIsMobileEffectsEnabled((e as CustomEvent).detail);
    window.addEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    return () => {
      window.removeEventListener("mmbarber-trigger-intro", triggerIntro);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mmbarber-mobile-effects-update', handleMobileEffectsUpdate as EventListener);
    };
  }, []);

  const isVisible = (key: string) => visibility[key] ?? true;

  return (
    <div className="flex flex-col min-h-screen relative">
      <MafiaClickEffects />
      <RecruitmentNotification />
      
      {!isIntroDismissed && (
        <CinematicIntro onDismiss={(action) => {
           setShowContent(true);
           setIsIntroDismissed(true);

           if (action) {
             window.dispatchEvent(new CustomEvent('mmbarber-menu-action', { detail: action }));
             console.log(`
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MAFIA II MENU: USER SELECTED [${action.toUpperCase()}]
  Action: ${action}
  Source: first-time welcome screen
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, "color: #c5a059; font-weight: bold;");

             setTimeout(() => {
               if (action === "start") {
                 window.scrollTo({ top: 0, behavior: "smooth" });
               } else if (action === "rezervace") {
                 const el = document.getElementById("operativi");
                 if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
               } else if (action === "galerie") {
                 router.push("/galerie");
               } else if (action === "vice") {
                 const el = document.getElementById("vice");
                 if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
               } else if (action === "kontakt") {
                 const el = document.getElementById("kontakt");
                 if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
               }
             }, 350);
           }
        }} />
      )}
      
      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="flex flex-col w-full">
            <CinematicSequence737 />
            <div className="hidden xl:block">
              <Hero />
            </div>
            
            <div className="relative bg-transparent w-full border-y border-mafia-gold/10 overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-mafia-black to-transparent z-0 pointer-events-none"></div>
              {/* Core sections */}
              <div id="operativi" className="section-optimize" style={{ scrollMarginTop: '100px' }}>
                <Profiles />
              </div>
              
              {isVisible('visibility_services') && (
                <div id="services" className="section-optimize" style={{ scrollMarginTop: '100px' }}><Services /></div>
              )}

              {/* Sequential reveals */}
              {!isMobile && (
                <SectionReveal delay={0.1} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                  <div id="holidays" className="section-optimize"><HolidayCountdown /></div>
                </SectionReveal>
              )}

              {!isMobile && (
                <SectionReveal delay={0.2} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                  <div id="style-definition" className="section-optimize" style={{ scrollMarginTop: '100px' }}><StyleDefinition /></div>
                </SectionReveal>
              )}

              {isVisible('visibility_contact') && (
                <SectionReveal delay={0.4} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                  <div id="kontakt" className="section-optimize" style={{ scrollMarginTop: '100px' }}><Contact /></div>
                </SectionReveal>
              )}

              {isVisible('visibility_partners') && (
                <SectionReveal delay={0.5} isMobile={isMobile} isMobileEffectsEnabled={isMobileEffectsEnabled}>
                  <div className="section-optimize"><Partners /></div>
                </SectionReveal>
              )}
              
              <div className="pt-0">
                <Footer />
              </div>
            </div>
            
            {!isMobile && (
              <BottomTerminalReveal thresholdMultiplier={100}>
                {(level) => isVisible('visibility_intelligence') ? (
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
                          {isVisible('visibility_reviews') && <GoogleReviewsWall />}
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
                ) : <div className="pb-32"></div>}
              </BottomTerminalReveal>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <HiddenSeoArchive lang={lang} mode="seo-hidden" />
    </div>
  );
}
