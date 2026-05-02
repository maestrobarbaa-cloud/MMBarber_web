"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, Share2, ShieldCheck, Database } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export function DatingSEOArchive() {
  const { lang } = useTranslation();

  const data = {
    cs: {
      title: "PROTOKOL KOMUNITNÍ SÍTĚ",
      subtitle: "SOCIAL NETWORKING & HUMAN NODES",
      faq: [
        {
          q: "Co je to MM BARBER Seznamka?",
          a: "Není to klasická seznamka pro hledání partnerů. Je to unikátní síť našich klientů – zajímavých lidí, podnikatelů a osobností z Uherského Hradiště a okolí. Je to platforma pro propojování příběhů a vzájemnou inspiraci."
        },
        {
          q: "Jak se mohu do sítě zapojit?",
          a: "Stačí být naším klientem a mít chuť sdílet svůj příběh. Seznamka funguje na bázi vzájemného respektu. Pokud chcete být vidět nebo hledáte někoho se stejnými hodnotami, tento sektor je pro vás."
        },
        {
          q: "Jaké jsou výhody tohoto propojení?",
          a: "Od byznysových kontaktů po nová přátelství. Věříme, že u nás v křesle sedí ti nejzajímavější lidé z regionu. Seznamka tyto 'uzly' propojuje do funkčního celku mimo zdi salonu."
        }
      ],
      keywords: "Networking Uherské Hradiště, MM BARBER komunita, seznamka UH, propojování lidí Slovácko, byznys kontakty Hradiště, zajímavé osobnosti region, MM_OS_NETWORK."
    },
    en: {
      title: "COMMUNITY NETWORK PROTOCOL",
      subtitle: "SOCIAL NETWORKING & HUMAN NODES",
      faq: [
        {
          q: "What is MM BARBER Dating/Network?",
          a: "It's not a classic dating app for finding partners. It's a unique network of our clients – interesting people, entrepreneurs, and personalities from Uherské Hradiště and its surroundings. It's a platform for connecting stories and mutual inspiration."
        },
        {
          q: "How can I join the network?",
          a: "Just be our client and have the desire to share your story. The network works on the basis of mutual respect. If you want to be seen or are looking for someone with the same values, this sector is for you."
        },
        {
          q: "What are the benefits of this connection?",
          a: "From business contacts to new friendships. We believe that the most interesting people in the region sit in our chairs. The network connects these 'nodes' into a functional whole outside the salon walls."
        }
      ],
      keywords: "Networking Uherské Hradiště, MM BARBER community, dating UH, connecting people Slovácko, business contacts Hradiště, interesting personalities region, MM_OS_NETWORK."
    }
  };

  const content = lang === 'en' ? data.en : data.cs;

  return (
    <div className="w-full bg-[#030303] border-t border-mafia-gold/20 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.02)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-mafia-gold font-heading font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4 italic">
            {content.title}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-mafia-gold/30"></div>
            <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.6em]">{content.subtitle}</p>
            <div className="h-px w-12 bg-mafia-gold/30"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {content.faq.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.01] border border-white/5 hover:border-mafia-gold/20 transition-all group"
            >
              <h3 className="text-white font-heading font-bold text-lg uppercase tracking-widest mb-4 italic group-hover:text-mafia-gold transition-colors">
                {item.q}
              </h3>
              <p className="text-smoke-white/50 text-xs leading-relaxed font-sans">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-10 border-2 border-dashed border-mafia-gold/10 bg-black/60 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <Users size={16} className="text-mafia-gold/40" />
            <span className="text-[10px] font-mono text-mafia-gold/40 uppercase tracking-widest font-bold">NETWORK_NODES_DATANODE</span>
          </div>
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-loose max-w-5xl select-none">
            {content.keywords} • {content.keywords}
          </p>
        </div>
      </div>
    </div>
  );
}
