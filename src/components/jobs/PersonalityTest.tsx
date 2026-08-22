"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Glasses, Smile, Building2, Target } from 'lucide-react';

export type PersonalityType = 'humorous' | 'serious' | 'corporate' | 'realistic' | 'creative' | 'hustler';

interface PersonalityTestProps {
  onComplete: (type: PersonalityType) => void;
}

export function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const options = [
    {
      id: 'humorous',
      title: 'Hlavně s humorem',
      description: 'Poznám krávu a vím, že dělá buuu. Práce se musí dělat s úsměvem a neberu se moc vážně.',
      icon: <Smile className="w-8 h-8 mb-4 text-mafia-gold" />
    },
    {
      id: 'serious',
      title: 'S respektem a vážně',
      description: 'Jsem tu od toho, abych odvedl stoprocentní výkon. Respekt a profesionalita na prvním místě.',
      icon: <Glasses className="w-8 h-8 mb-4 text-mafia-gold" />
    },
    {
      id: 'corporate',
      title: 'Jedu synergie',
      description: 'Core business, B2B synergie a optimalizace procesů. Jsem korporátní dravec.',
      icon: <Building2 className="w-8 h-8 mb-4 text-mafia-gold" />
    },
    {
      id: 'realistic',
      title: 'Nohama na zemi',
      description: 'Nemám rád omáčku kolem. Prostě mi řekněte, co je potřeba, a jdeme to udělat.',
      icon: <Target className="w-8 h-8 mb-4 text-mafia-gold" />
    },
    {
      id: 'creative',
      title: 'Kreativní duše',
      description: 'Vidím věci jinak než ostatní. Rád tvořím, vymýšlím nové cesty a nebojím se experimentovat.',
      icon: <Sparkles className="w-8 h-8 mb-4 text-mafia-gold" />
    },
    {
      id: 'hustler',
      title: 'Dříč / Hustler',
      description: 'Zajímá mě jen výkon a výsledek. Makám od rána do večera a jdu si tvrdě za svým.',
      icon: <Target className="w-8 h-8 mb-4 text-mafia-gold" />
    }
  ];

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-widest flex items-center justify-center gap-3 mb-4">
          <Sparkles className="text-mafia-gold" size={32} />
          Jaký jsi typ?
        </h2>
        <p className="text-white/60 font-mono text-sm md:text-base max-w-xl mx-auto uppercase tracking-widest">
          Než tě pustíme dál k nabídkám, potřebujeme vědět, z jakého jsi těsta. 
          Podle toho uvidíme, jestli si sedneme. Vyber si, co tě nejvíc vystihuje.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onComplete(option.id as PersonalityType)}
            className="group relative flex flex-col items-center text-center p-8 bg-black/40 border border-white/10 hover:border-mafia-gold rounded-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-mafia-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {option.icon}
            <h3 className="text-xl font-heading font-black uppercase text-white mb-2 group-hover:text-mafia-gold transition-colors">{option.title}</h3>
            <p className="font-mono text-xs text-white/50">{option.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
