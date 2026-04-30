"use client";

import { ScrollText } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { motion } from "framer-motion";
import Image from "next/image";

const DETAIL_PICS = [
  "/obr/prostredi/0793ccfb-06cc-4f51-9a97-91be0c3fc9ae.jfif.jpg",
  "/obr/prostredi/1c475788-6939-438d-8f05-909eced05770.jfif.jpg",
  "/obr/prostredi/DZZ_2471.jpg"
];

export function TheCode() {
  const { t } = useTranslation();

  return (
    <section id="the-code" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-mafia-gold/20 bg-mafia-gold/5 rounded-full mb-6">
            <ScrollText className="w-4 h-4 text-mafia-gold" />
            <span className="text-mafia-gold text-xs font-mono tracking-[0.3em] uppercase">
              {t?.theCode?.subtitle}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-smoke-white tracking-tighter uppercase mb-6">
            {t?.theCode?.title || "THE CODE"}
          </h2>
          <div className="w-24 h-1 bg-mafia-gold mx-auto" />
        </motion.div>

        {/* Stacked Letters Interface */}
        <div className="max-w-4xl mx-auto relative h-[600px] md:h-[700px] flex items-center justify-center">
          {(Array.isArray(t?.theCode?.rules) ? t.theCode.rules : []).map((rule: any, index: number) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                rotate: index % 2 === 0 ? -10 : 10,
                x: index % 2 === 0 ? -50 : 50,
                y: 50 
              }}
              whileInView={{ 
                opacity: 1, 
                rotate: (index - 1) * 3, // Slight fanned out effect
                x: 0,
                y: 0 
              }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0, 
                zIndex: 50,
                transition: { duration: 0.2 } 
              }}
              style={{
                zIndex: index,
                marginTop: `${index * 15}px`, // Slight stagger
              }}
              className="absolute w-[300px] md:w-[450px] bg-[#f4f1ea] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#d4d1c8] origin-center"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] pointer-events-none" />
              
              {/* Content */}
              <div className="relative">
                <span className="text-mafia-gold/30 font-heading text-6xl md:text-8xl absolute -top-6 -left-6 opacity-50">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                <h3 className="text-mafia-black font-heading text-2xl md:text-3xl font-bold mb-6 italic tracking-tight border-b border-mafia-black/10 pb-4">
                  {rule.title}
                </h3>
                
                <p className="text-gray-700 font-serif text-base md:text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                  {rule.description}
                </p>

                {/* Decorative Elements */}
                <div className="mt-8 flex justify-end">
                  <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-mafia-gold/10" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Background Photos peek through */}
          {DETAIL_PICS.map((pic, i) => (
            <motion.div
              key={`pic-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="absolute w-64 h-80 rounded-sm overflow-hidden grayscale pointer-events-none -z-10"
              style={{
                top: i === 0 ? '-10%' : i === 1 ? '40%' : '70%',
                left: i === 0 ? '-20%' : i === 1 ? '105%' : '-15%',
                transform: `rotate(${i * 15 - 7}deg)`
              }}
            >
              <Image src={pic} alt="Atmosphere" width={256} height={320} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
