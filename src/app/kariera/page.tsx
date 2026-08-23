"use client";
import React, { useState } from 'react';
import { PersonalityTest, type PersonalityType } from '@/components/jobs/PersonalityTest';
import { DynamicJobOffers } from '@/components/jobs/DynamicJobOffers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function KarieraPage() {
  const [personality, setPersonality] = useState<PersonalityType | null>(null);

  return (
    <div className="min-h-screen bg-mafia-black text-smoke-white selection:bg-mafia-gold selection:text-mafia-black flex flex-col relative overflow-hidden">
      <Header />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] border border-mafia-gold/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] border border-mafia-red/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>

      <main className="flex-grow pt-32 pb-24 flex flex-col justify-center relative z-10">
        {!personality ? (
          <PersonalityTest onComplete={setPersonality} />
        ) : (
          <DynamicJobOffers personality={personality} onReset={() => setPersonality(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
