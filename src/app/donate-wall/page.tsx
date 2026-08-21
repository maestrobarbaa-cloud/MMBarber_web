'use client';

import React, { useState, useEffect } from 'react';
import DonateWallCard, { DonationItem } from '@/components/donate/DonateWallCard';
import { useSession } from 'next-auth/react';

const REGIONS = [
  'Praha', 'Středočeský kraj', 'Jihočeský kraj', 'Plzeňský kraj', 
  'Karlovarský kraj', 'Ústecký kraj', 'Liberecký kraj', 'Královéhradecký kraj', 
  'Pardubický kraj', 'Kraj Vysočina', 'Jihomoravský kraj', 'Olomoucký kraj', 
  'Zlínský kraj', 'Moravskoslezský kraj'
];

const MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

export default function DonateWallPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Výchozí filtr na aktuální měsíc a rok
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [selectedRegion, setSelectedRegion] = useState('all');

  const { data: session } = useSession();

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      if (selectedRegion && selectedRegion !== 'all') params.append('region', selectedRegion);

      const res = await fetch(`/api/donations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedMonth, selectedYear, selectedRegion]);

  // Chytrá logika pro zobrazení filtrů:
  // Pokud je málo darů (např. < 5) při filtraci bez ohledu na region, 
  // možná chceme spíš nechat všechny. Tady můžeme schovat regionální filtr
  // pokud to nedává smysl. Pro jednoduchost tu filtry zatím necháme viditelné.

  // Rozdělení do skupin (VIP, Střední, Srdcaři)
  const vips = donations.filter(d => d.amount >= 2000);
  const middle = donations.filter(d => d.amount >= 500 && d.amount < 2000);
  const supporters = donations.filter(d => d.amount < 500);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500">
            Zeď donátorů
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Děkujeme všem, kteří podpořili náš projekt. Vaše příspěvky nám pomáhají růst a zlepšovat se.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Měsíc:</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border-slate-300 py-2 pl-3 pr-8 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Rok:</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border-slate-300 py-2 pl-3 pr-8 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              >
                {[currentDate.getFullYear(), currentDate.getFullYear() - 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Region Filter - Zobrazíme jen pokud to má smysl, nebo ho necháme vždy pro uživatele */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Kraj:</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="rounded-lg border-slate-300 py-2 pl-3 pr-8 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="all">Všechny kraje</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
            Chci také podpořit!
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <h3 className="text-xl font-medium text-slate-700 mb-2">Zatím zde nikdo není</h3>
            <p className="text-slate-500">Staňte se prvním dárcem v tomto období a kraji!</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* VIP Třída */}
            {vips.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-yellow-300 flex-grow"></div>
                  <h2 className="text-2xl font-bold text-yellow-700">Vyšší třída (VIP)</h2>
                  <div className="h-px bg-yellow-300 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vips.map((donation, index) => (
                    <DonateWallCard key={donation.id} donation={donation} rank={index + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Střední Třída */}
            {middle.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-indigo-200 flex-grow"></div>
                  <h2 className="text-xl font-bold text-indigo-700">Střední třída</h2>
                  <div className="h-px bg-indigo-200 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {middle.map((donation, index) => (
                    <DonateWallCard key={donation.id} donation={donation} rank={vips.length + index + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Srdcaři */}
            {supporters.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-slate-300 flex-grow"></div>
                  <h2 className="text-lg font-bold text-slate-700">Srdcaři</h2>
                  <div className="h-px bg-slate-300 flex-grow"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {supporters.map((donation, index) => (
                    <DonateWallCard key={donation.id} donation={donation} rank={vips.length + middle.length + index + 1} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
