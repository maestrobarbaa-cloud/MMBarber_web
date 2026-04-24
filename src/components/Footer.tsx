"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Facebook,
  Zap,
  Trophy,
  X
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { trackEvent } from "../utils/analytics";
import { EvasiveButton } from "./EvasiveButton";

const BulletHole = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-3 h-3 rounded-full bg-black border border-mafia-gold/50 shadow-[0_0_5px_var(--color-mafia-gold-glow)] relative flex items-center justify-center overflow-hidden"
  >
    <div className="w-1 h-1 bg-mafia-gold rounded-full opacity-40 blur-[1px]"></div>
    <div className="absolute inset-0 border-t border-mafia-gold/20 rotate-45 scale-150"></div>
    <div className="absolute inset-0 border-t border-mafia-gold/20 -rotate-45 scale-150"></div>
  </motion.div>
);

const EasterEgg = () => {
  const [mounted, setMounted] = React.useState(false);
  const [showShow, setShowShow] = React.useState(false);
  const [isCaught, setIsCaught] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setMounted(true);

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

  return (
    <div className="relative">
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          whileHover={(!isMobile || isMobileEffectsEnabled) ? { opacity: 1, scale: 1.1 } : { opacity: 1 }}
          onClick={() => {
            setShowShow(true);
            trackEvent("click_easter_egg_v3");
          }}
          className="group relative flex flex-col items-center gap-3 cursor-pointer border-none bg-transparent"
        >
          <div className={`w-16 h-16 rounded-full border border-mafia-gold/40 flex items-center justify-center transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.3)] ${(!isMobile || isMobileEffectsEnabled) ? 'group-hover:border-mafia-gold group-hover:shadow-[0_0_var(--user-glow-radius)_var(--user-glow-color)]' : ''}`}>
            <Zap size={24} className={`text-mafia-gold ${(!isMobile || isMobileEffectsEnabled) ? 'group-hover:animate-pulse' : ''}`} />
          </div>
          <span className="text-mafia-gold font-mono text-xs md:text-sm uppercase tracking-[0.5em] font-black drop-shadow-lg">{t.footer.neklikat}</span>
        </motion.button>
      </AnimatePresence>

      <AnimatePresence>
        {showShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mafia-gold/10 via-transparent to-transparent opacity-40"></div>
              {mounted && [...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: 0.1,
                    opacity: 0
                  }}
                  animate={{
                    scale: [0.1, 0.5, 0.1],
                    opacity: [0, 0.4, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-1 h-1 bg-mafia-gold rounded-full"
                />
              ))}

              {/* Digital Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <AnimatePresence>
              {isCaught && (
                <motion.div
                  initial={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                  animate={{ opacity: 0.2, scale: 1, filter: "blur(0px)" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                >
                  <span className="text-[15vw] font-black text-mafia-gold uppercase leading-none select-none tracking-tighter italic" style={{ textShadow: "0 0 40px var(--color-mafia-gold-glow)" }}>
                    AKTIVOVÁNO
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center max-w-4xl px-8 text-center">

              {!isCaught ? (
                <>
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-[1px] bg-mafia-gold/30 shadow-[0_0_10px_var(--color-mafia-gold-glow)] z-30 opacity-50"
                  />
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-mafia-gold font-heading font-black text-4xl md:text-6xl uppercase tracking-[0.2em] mb-12 drop-shadow-2xl"
                  >
                    {t.footer.tryToCatch}
                  </motion.h2>

                  <EvasiveButton onCatch={() => {
                    setIsCaught(true);
                    trackEvent("easter_egg_caught");
                  }} />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className="flex flex-col items-center p-8 md:p-12 border-2 border-mafia-gold rounded-none bg-mafia-black/80 backdrop-blur-md shadow-[0_0_50px_rgba(197,160,89,0.3)]">
                    <div className="w-20 h-20 border border-mafia-gold flex items-center justify-center mb-6">
                      <Trophy size={40} className="text-mafia-gold animate-pulse" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-mafia-gold font-heading font-black text-3xl md:text-5xl uppercase tracking-wide italic drop-shadow-[0_4px_15px_rgba(0,0,0,1)] px-2">
                        {t.footer.cheatActivated}
                      </h3>
                      <div className="w-24 h-1 bg-mafia-gold mx-auto"></div>
                      <p className="text-smoke-white font-sans text-base md:text-xl leading-relaxed max-w-2xl text-center px-4">
                        {t.footer.thankYou}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-mafia-gold font-mono text-xs uppercase tracking-[0.3em] opacity-60 animate-pulse">
                    <Zap size={14} />
                    <span>STAV_SYSTÉMU: CHEATY_NAČTENY</span>
                    <Zap size={14} />
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => {
                  setShowShow(false);
                  setTimeout(() => setIsCaught(false), 500);
                }}
                className="mt-20 group relative overflow-hidden px-8 py-3 bg-transparent border border-white/20 hover:border-mafia-gold transition-all"
              >
                <div className="absolute inset-0 bg-mafia-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-center gap-3 text-white/40 group-hover:text-mafia-black transition-colors">
                  <X size={16} />
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">{t.footer.closeTrap}</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  isBordered?: boolean;
  isRed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const FooterLink = ({ href, children, isExternal, isBordered, isRed, onClick }: FooterLinkProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const content = (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center gap-3 group w-fit mx-auto md:mx-0"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            className="absolute -left-6"
          >
            <BulletHole />
          </motion.div>
        )}
      </AnimatePresence>
      <span className={`
        font-mono text-sm tracking-wider transition-colors duration-300
        ${isRed ? 'text-mafia-red hover:text-mafia-red/70 font-bold' : 'text-mafia-gold/70 group-hover:text-mafia-gold'}
        ${isBordered ? 'border-b border-mafia-gold/0 group-hover:border-mafia-gold/50 pb-0.5' : ''}
      `}>
        {children}
      </span>
    </motion.div>
  );

  if (isExternal) {
    return <a href={href} onClick={onClick} className="block">{content}</a>;
  }
  return <Link href={href} onClick={onClick} className="block">{content}</Link>;
};

export function Footer() {
  const { t } = useTranslation();
  const [showContactOverlay, setShowContactOverlay] = React.useState(false);
  const [showResponsibleModal, setShowResponsibleModal] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMobileEffectsEnabled, setIsMobileEffectsEnabled] = React.useState(false);

  React.useEffect(() => {
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

  return (
    <footer className="w-full bg-[#050505] border-t border-mafia-gold/10 pt-24 pb-12 px-6 text-center z-10 relative mt-16 overflow-hidden">

      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      {/* Responsible Person Modal */}
      <AnimatePresence>
        {showResponsibleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            onClick={() => setShowResponsibleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              className="relative p-8 md:p-12 border-2 border-mafia-gold bg-mafia-dark/95 shadow-[0_0_50px_rgba(197,160,89,0.3)] max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mafia-gold"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mafia-gold"></div>

              <h4 className="text-mafia-gold font-mono text-xs uppercase tracking-[0.4em] mb-6 opacity-60">
                {t.contact.responsiblePerson}
              </h4>

              <div className="space-y-4">
                <p className="text-3xl md:text-4xl font-heading font-black text-smoke-white uppercase tracking-wider">
                  Tomáš Mička
                </p>
                <p className="text-mafia-gold font-mono text-lg">
                  IČO: 10862994
                </p>
              </div>

              <button
                onClick={() => setShowResponsibleModal(false)}
                className="mt-10 group relative overflow-hidden px-8 py-2 border border-mafia-gold/30 hover:border-mafia-gold transition-all"
              >
                <span className="relative z-10 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-mafia-gold group-hover:text-mafia-black">
                  {t.footer.close}
                </span>
                <div className="absolute inset-0 bg-mafia-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Overlay (Cinematic) */}
      <AnimatePresence>
        {showContactOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mafia-gold/10 via-transparent to-transparent opacity-40"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 p-12 border-2 border-mafia-gold bg-mafia-black/80 backdrop-blur-md shadow-[0_0_100px_rgba(197,160,89,0.2)] flex flex-col items-center text-center"
            >
              <div className="font-heading font-black text-mafia-gold text-4xl md:text-7xl tracking-widest mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                MM BARBER
              </div>
              <div className="w-32 h-1 bg-mafia-gold mb-8"></div>

              <p className="text-mafia-gold/60 font-mono text-sm md:text-lg uppercase tracking-[0.4em] mb-4">
                {t.footer.callToAction}
              </p>

              <a
                href="tel:+420577544073"
                className="font-mono text-mafia-gold hover:text-white transition-all text-3xl md:text-5xl tracking-[0.3em] font-black hover:scale-105 active:scale-95"
              >
                +420 577 544 073
              </a>

              <button
                onClick={() => setShowContactOverlay(false)}
                className="mt-20 group relative overflow-hidden px-10 py-4 bg-mafia-gold text-mafia-black font-heading font-black text-sm uppercase tracking-[0.5em] transition-all"
              >
                {t.footer.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-mafia-gold to-transparent opacity-30"></div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start gap-8 lg:gap-16 mb-12">

        {/* Brand - Modern Premium Look */}
        <div className="flex flex-col items-center lg:items-start max-w-sm shrink-0">
          <div className="mb-8 flex items-center justify-center lg:justify-start group cursor-default">
            <div className="relative">
              <div className="w-20 h-20 relative z-10">
                <Image
                  src="/logo.png"
                  alt="MM"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(197,160,89,0.2)] group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              {/* Golden pulse behind logo */}
              <div className="absolute inset-0 bg-mafia-gold/20 blur-[30px] rounded-full scale-50 group-hover:scale-100 transition-all duration-1000 opacity-0 group-hover:opacity-100"></div>
            </div>

            <div className="flex flex-col ml-6 text-left">
              <span className="text-4xl font-heading font-black text-white tracking-[0.1em] uppercase leading-none">
                MM<span className="text-mafia-gold">BARBER</span>
              </span>
              <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-[0.5em] mt-2">
                Odkaz Výjimečnosti
              </span>
            </div>
          </div>

          <div className="relative p-6 bg-white/[0.02] border-l-2 border-mafia-gold/20 backdrop-blur-sm text-left">
            <p className="font-sans text-smoke-white/50 text-sm leading-relaxed italic">
              &quot;{t.footer.description}&quot;
            </p>
          </div>

          <div className="mt-10 w-full flex flex-col items-center gap-8">
            <EasterEgg />

            <Link
              href="/specialni-mise"
              onClick={() => {
                trackEvent("cta_footer_special_mission");
              }}
              className={`group relative px-6 py-4 border border-mafia-gold/20 transition-all duration-700 bg-mafia-gold/[0.02] overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.05)] ${(!isMobile || isMobileEffectsEnabled) ? 'hover:border-mafia-gold hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]' : ''}`}
            >
              {/* Cinematic scanning effect */}
              {(!isMobile || isMobileEffectsEnabled) && (
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-mafia-gold/20 to-transparent skew-x-12"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <p className={`text-mafia-gold font-heading font-black text-sm uppercase tracking-[0.2em] transition-colors ${(!isMobile || isMobileEffectsEnabled) ? 'group-hover:text-white' : ''}`}>
                  {t.footer.likeWeb}
                </p>
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] group-hover:text-mafia-gold/40 transition-colors">
                  Status: High Priority
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 text-center md:text-left w-full mt-6 lg:mt-0 justify-center lg:justify-end">

          {/* Column 1: Navigace + Rodina stacked */}
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <h3 className="font-sans font-bold text-smoke-white uppercase tracking-widest text-sm mb-1 opacity-50">{t.footer.nav}</h3>
              <FooterLink href="/#operativi">{t.operatives.title}</FooterLink>
              <FooterLink
                href="/#kontakt"
                onClick={(e: React.MouseEvent) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t.footer.contact}
              </FooterLink>
              <FooterLink href="/#holidays">{t.header.schedule}</FooterLink>
            </div>

            <div className="flex flex-col space-y-3">
              <FooterLink href="/kariera" isBordered>{t.header.career}</FooterLink>
              <FooterLink href="/provozni-rad" isBordered>{t.footer.rules}</FooterLink>
              <FooterLink href="/obchodni-podminky" isBordered>{t.footer.terms}</FooterLink>
              <FooterLink href="/ochrana-osobnich-udaju" isBordered>{t.footer.privacy}</FooterLink>
              <FooterLink href="/zasady-cookies" isBordered>{t.footer.cookies}</FooterLink>
            </div>
          </div>

          {/* Column 2: Spojení */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-sans font-bold text-smoke-white uppercase tracking-widest text-sm mb-1 opacity-50">{t.footer.contact}</h3>
            <FooterLink href="tel:+420577544073" isExternal>+420 577 544 073</FooterLink>
            <FooterLink href="mailto:mmbarber@mmbarber.cz" isExternal>mmbarber@mmbarber.cz</FooterLink>
            <div className="mt-2">
              <FooterLink
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setShowResponsibleModal(true);
                  trackEvent("click_footer_responsible_person");
                }}
              >
                {t.contact.responsiblePerson}
              </FooterLink>
            </div>
          </div>

          {/* Column 3: Sleduj nás - Modern Premium Grid */}
          <div className="flex flex-col space-y-6 flex-1 min-w-[200px]">
            <h3 className="font-sans font-black text-white uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-mafia-gold/20 pb-2">
              Sledujte nás
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Instagram, label: "Instagram", sub: t.footer.instagramLine, url: "https://www.instagram.com/mmbarber_uherske_hradiste/" },
                { icon: Facebook, label: "Facebook", sub: t.footer.facebookLine, url: "https://www.facebook.com/mmbarber.cz" },
                {
                  icon: () => (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 3.1 0 6.2-.42 9.27-.47 3.32-2.73 6.32-6.13 7.07-2.14.47-4.48.06-6.2-1.35-2.01-1.64-2.81-4.48-1.95-6.94.75-2.13 2.65-3.8 4.86-4.13.13-.02.27-.03.4-.04v4.14c-1.12.16-2.1 1.05-2.3 2.15-.22 1.16.29 2.45 1.3 3.03.95.53 2.22.42 3.02-.34.62-.57.88-1.46.88-2.29V0h.02z" />
                    </svg>
                  ), label: "TikTok", sub: t.footer.tiktokLine, url: "https://www.tiktok.com/@mmbarber4"
                }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 hover:border-mafia-gold/40 hover:bg-mafia-gold/[0.02] transition-all duration-500"
                >
                  <div className="relative">
                    <div className="w-10 h-10 border border-mafia-gold/20 flex items-center justify-center group-hover:bg-mafia-gold group-hover:text-mafia-black transition-all duration-500">
                      <social.icon size={18} />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-mafia-gold group-hover:text-white transition-colors">{social.label}</span>
                    <span className="text-[9px] text-smoke-white/30 font-sans italic">{social.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-mafia-gold/10 pt-10 pb-4 flex flex-col items-center relative">
        <div className="flex flex-col items-center gap-2">
          <div className="font-mono text-smoke-white/50 text-xs md:text-sm tracking-[0.2em] uppercase text-center flex flex-wrap items-center justify-center gap-2">
            <span>© {t.footer.copyright}</span>
            <span className="text-mafia-red text-[10px] font-black whitespace-nowrap ml-2">Verze 1.1.1</span>
          </div>
          <div className="sr-only">
            <h2>
              Pánské holičství & Barbershop Uherské Hradiště
            </h2>
            <p>
              Nejlepší péče o vlasy a vousy v regionu Slovácka. Profesionální střihy, tradiční holení břitvou a unikátní noir atmosféra v srdci Uherského Hradiště.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
