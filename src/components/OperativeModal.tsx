"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Medal } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";

export type BarberMedal = {
  id: string;
  title: string;
  description: string;
  year?: string;
};

export type BarberProfile = {
  name: string;
  role: string;
  image: string;
  stats: { label: string; value: number; icon: React.ReactNode }[];
  desc: string; // Short description for card
  story: string; // Long story for modal
  schedule: string;
  bookingLink: string;
  medals?: BarberMedal[];
};

interface OperativeModalProps {
  barber: BarberProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OperativeModal({ barber, isOpen, onClose }: OperativeModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!barber) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] bg-mafia-dark border border-mafia-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm flex flex-col md:flex-row pointer-events-auto h-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2 bg-mafia-black/70 text-mafia-gold hover:text-white hover:bg-mafia-gold transition-all rounded-full border border-mafia-gold/30 shadow-lg"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              {/* Left Column: Photo & Name */}
              <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-mafia-black overflow-hidden flex-shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-t from-mafia-dark via-transparent to-transparent z-10 hidden md:block md:bg-gradient-to-r md:from-transparent md:to-mafia-dark" />
                <Image
                  src={barber.image}
                  alt={barber.name}
                  width={600}
                  height={800}
                  priority
                  className="w-full h-full object-contain md:object-cover object-center filter grayscale-[0.3] md:grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                
                {/* ID Card Overlay Element */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-mafia-black/80 border border-mafia-gold/30 backdrop-blur-sm hidden md:block">
                  <span className="font-mono text-[10px] text-mafia-gold uppercase tracking-[0.3em]">
                    Složka / {barber.name.substring(0, 3).toUpperCase()}-{Math.floor(Math.random() * 900) + 100}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                  <h2 className="text-2xl md:text-5xl font-heading font-black text-smoke-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                    {barber.name}
                  </h2>
                  <p className="text-mafia-gold font-sans tracking-[0.3em] text-[10px] md:text-sm uppercase mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                    {barber.role}
                  </p>
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="w-full md:w-3/5 flex flex-col bg-mafia-dark relative overflow-hidden flex-1 min-h-0">
                {/* Background Pattern & Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat z-0 opacity-40"></div>
                <div className="absolute inset-0 bg-mafia-dark/90 z-0"></div>
                
                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-10 custom-scrollbar relative z-10 min-h-0">
                  {/* Top Secret Stamp - Hidden on small mobile to save space */}
                  <div className="absolute top-0 right-4 md:top-0 md:right-0 opacity-10 md:opacity-20 rotate-12 pointer-events-none hidden sm:block">
                    <span className="text-2xl md:text-6xl font-black text-mafia-gold uppercase border-4 border-mafia-gold px-2 md:px-4 py-1 md:py-2 rounded-lg font-serif tracking-widest inline-block transform -rotate-12">
                      Tajné
                    </span>
                  </div>

                  {/* Story Section */}
                  <div className="mb-6 md:mb-10 overflow-hidden">
                    <h3 className="text-base md:text-xl font-heading font-bold text-mafia-gold mb-3 md:mb-4 uppercase tracking-widest border-b border-mafia-gold/20 pb-2 flex items-center gap-2">
                       Osobní Záznam
                    </h3>
                    <div className="text-smoke-white/80 font-sans text-xs md:text-base leading-relaxed space-y-3 md:space-y-4 whitespace-pre-line overflow-hidden break-words">
                      {barber.story}
                    </div>
                  </div>

                  {/* Medals & Achievements Section */}
                  {barber.medals && barber.medals.length > 0 && (
                    <div className="mb-6 md:mb-10 overflow-hidden">
                      <h3 className="text-base md:text-xl font-heading font-bold text-mafia-gold mb-3 md:mb-6 uppercase tracking-widest border-b border-mafia-gold/20 pb-2 flex items-center gap-2">
                         <Award className="text-mafia-gold" size={18} />
                         Vyznamenání
                      </h3>
                      <div className="space-y-3 md:space-y-6">
                        {barber.medals.map((medal, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-mafia-black/40 border border-mafia-gold/10 hover:border-mafia-gold/30 transition-colors duration-300 relative group/medal overflow-hidden">
                            
                            {/* Medal Icon/Visual */}
                            <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-mafia-gold to-mafia-sepia flex items-center justify-center border-2 border-mafia-black">
                               {idx === 0 ? <Medal size={16} className="text-mafia-black" /> : <Award size={16} className="text-mafia-black" />}
                            </div>

                            {/* Medal Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5 md:mb-1 gap-1 flex-wrap">
                                <h4 className="font-bold text-smoke-white uppercase tracking-wider text-xs md:text-base leading-tight">
                                  {medal.title}
                                </h4>
                                {medal.year && (
                                  <span className="font-mono text-mafia-gold text-xs px-2 py-0.5 border border-mafia-gold/30 bg-mafia-gold/10 rounded-sm">
                                    EST. {medal.year}
                                  </span>
                                )}
                              </div>
                              <p className="text-smoke-white/60 text-xs md:text-sm font-sans italic leading-relaxed">
                                {medal.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixed Footer with CTA */}
                <div className="px-4 md:px-10 pb-5 md:pb-10 pt-4 md:pt-0 bg-mafia-dark relative z-20 border-t border-mafia-gold/10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                  <a 
                    href={barber.bookingLink} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="block w-full text-center border border-mafia-gold/50 bg-mafia-gold/10 px-4 md:px-6 py-3 md:py-4 text-mafia-gold font-sans uppercase tracking-[0.2em] font-bold hover:bg-mafia-gold hover:text-mafia-black hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all duration-300 text-sm md:text-base outline-none"
                  >
                    Povolat do Akce
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
