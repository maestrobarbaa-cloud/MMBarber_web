"use client"
import React from 'react';
import { RecruitmentPhase3 } from '@/components/jobs/RecruitmentPhase3';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

export default function Faze3TestPage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <NavBar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-black text-mafia-gold uppercase mb-8 text-center">Simulace: Fáze 3</h1>
          <RecruitmentPhase3 email="test@mmbarber.cz" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
