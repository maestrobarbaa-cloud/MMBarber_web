import React from 'react';
import CircuitGame from '@/components/game/CircuitGame';

export const metadata = {
  title: 'Circuit Breaker | Syndicate Network',
  description: 'Spoj body. Překonej skóre. Ovládni síť.',
};

export default function CircuitBreakerPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 pt-24 font-mono">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-mafia-gold uppercase tracking-widest">
          Circuit Breaker
        </h1>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <h2 className="text-mafia-gold font-bold mb-2">Jak hrát:</h2>
          <ul className="list-disc pl-5 text-gray-400 space-y-1 text-sm">
            <li>Klikni na svítící uzel (ikonku) a <strong>táhni myší nebo prstem</strong> ke stejnému uzlu.</li>
            <li>Propoj všechny páry stejných symbolů.</li>
            <li>Čáry (obvody) se <strong>nesmí křížit</strong>. Pokud křížíš jinou čáru, přetrhneš ji.</li>
            <li>Musíš propojit úplně všechny páry na desce pro dokončení úrovně.</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CircuitGame />
          </div>
          
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-mafia-gold">Žebříček</h2>
            {/* V budoucnu sem přidáme Leaderboard komponentu s daty z API */}
            <div className="text-center text-gray-500 py-8">
              Načítám skóre...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
