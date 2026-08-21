"use client";

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from '../hooks/useTranslation';
import { playSound } from '../utils/audio';

interface EditorialPhotoProps {
  imageSrc: string;
  title: React.ReactNode;
  subtitle: string;
  modalTitle: string;
  modalContent: string;
  showInitially?: boolean;
}

const EditorialPhoto = ({ imageSrc, title, subtitle, modalTitle, modalContent, showInitially = false }: EditorialPhotoProps) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const playCameraSound = () => {
    playSound("/sounds/kamera.mp3", 0.5);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (inView || showInitially) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, showInitially ? 0 : 300);
      return () => clearTimeout(timer);
    }
  }, [inView, showInitially]);

  return (
    <div ref={ref} className="editorial-photo relative flex-1 min-w-[240px] w-full max-w-xl px-2 md:px-0">
      <AnimatePresence>
        {shouldShow && (
          <motion.div 
            key="editorial-main-view"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onHoverStart={() => {
              setIsHovered(true);
              playCameraSound();
            }}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={!isMobile ? { rotateX: -2, rotateY: 2, scale: 1.01 } : { scale: 1 }}
            className="relative group perspective-2000 cursor-default w-full"
          >
            {/* The Gold Frame */}
            <div className={`absolute inset-0 border-2 z-20 pointer-events-none transition-colors duration-700 ${
              (isHovered && !isMobile) ? 'border-mafia-gold' : 'border-mafia-gold/30'
            }`}>
              <div className="absolute inset-0 border-[1px] border-mafia-gold/10 scale-[0.98]"></div>
              
              {/* Corner Accents */}
              <div className={`absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-mafia-gold transition-all duration-700 ${
                (isHovered && !isMobile) ? 'opacity-100' : 'opacity-30'
              }`} style={{ filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
              <div className={`absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-mafia-gold transition-all duration-700 ${
                (isHovered && !isMobile) ? 'opacity-100' : 'opacity-30'
              }`} style={{ filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
              <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-mafia-gold transition-all duration-700 ${
                (isHovered && !isMobile) ? 'opacity-100' : 'opacity-30'
              }`} style={{ filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-mafia-gold transition-all duration-700 ${
                (isHovered && !isMobile) ? 'opacity-100' : 'opacity-30'
              }`} style={{ filter: 'drop-shadow(0 0 var(--user-glow-radius) var(--user-glow-color))' }}></div>
            </div>

            {/* Content Container */}
            <div className="relative w-full aspect-[4/5] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5">
              <motion.img 
                animate={{ 
                  scale: (isHovered && !isMobile) ? 1.08 : 1,
                  filter: (isHovered && !isMobile) ? 'grayscale(0%) brightness(100%)' : 'grayscale(50%) brightness(75%)'
                }}
                transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
                src={imageSrc} 
                alt="Editorial session" 
                decoding="async"
                loading="lazy"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                className="w-full h-full object-cover block transform-gpu will-change-transform"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 z-10"></div>
              
              {/* Intentional Noir Shadow Bars Effect - Completely disabled on mobile for performance */}
              {!isMobile && (
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
                  <motion.div 
                    animate={{ x: ['100%', '-150%'] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-[40px] bg-black/60 blur-[30px]"
                  />
                  <motion.div 
                    animate={{ x: ['150%', '-100%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 4 }}
                    className="absolute top-0 bottom-0 w-[20px] bg-black/40 blur-[20px]"
                  />
                </div>
              )}
              
              {/* Bottom-left Editorial Text */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: (isMobile || isHovered) ? 0 : 15
                }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-12 left-6 md:left-12 z-30 pointer-events-none w-[calc(100%-3rem)]"
              >
                <div className="flex flex-col gap-0 tracking-tighter items-start text-left">
                  <span className="text-mafia-gold/60 font-mono text-[10px] uppercase tracking-[0.6em] mb-3 drop-shadow-md">{subtitle}</span>
                  <div className="text-mafia-gold font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase leading-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,1)] whitespace-normal md:whitespace-nowrap overflow-visible">
                    {title}
                  </div>
                </div>
                <div className="w-20 h-[2px] bg-mafia-gold mt-6"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function StyleDefinition() {
  const { t } = useTranslation();

  return (
    <section id="style-definition" className="relative w-full py-10 md:py-16 bg-transparent overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center gap-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-14 w-full">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col items-center gap-8 flex-1 max-w-xl w-full">
            <EditorialPhoto 
              imageSrc="/obr/define_style.jpg"
              subtitle={t.styleDefinition.defineStyle.subtitle}
              title={<>{t.styleDefinition.defineStyle.title[0]} <br/> {t.styleDefinition.defineStyle.title[1]}</>}
              modalTitle={t.styleDefinition.defineStyle.modalTitle}
              modalContent={t.styleDefinition.defineStyle.modalContent}
              showInitially={true}
            />
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col items-center gap-8 flex-1 max-w-xl w-full">
            <EditorialPhoto 
              imageSrc="/obr/pair-therapy.png"
              subtitle={t.styleDefinition.pairTherapy.subtitle}
              title={<>{t.styleDefinition.pairTherapy.title[0]} <br/> {t.styleDefinition.pairTherapy.title[1]}</>}
              modalTitle={t.styleDefinition.pairTherapy.modalTitle}
              modalContent={t.styleDefinition.pairTherapy.modalContent}
              showInitially={true}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
