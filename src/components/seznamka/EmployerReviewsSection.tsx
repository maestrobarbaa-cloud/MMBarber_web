import React, { useEffect, useState } from 'react';
import { Briefcase, TrendingUp, Users, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { AccordionSection } from './AccordionSection';

interface EmployerReview {
  id: string;
  workEthicRating: number; // 1-10
  teamDynamics: string;
  drivePercentage: number; // 0-100
  textReview: string | null;
  createdAt: string;
  reviewer: {
    name: string | null;
    companyProfile: { salonName: string } | null;
  };
}

export const EmployerReviewsSection = ({ targetUserId, lang }: { targetUserId: string, lang: 'cs' | 'en' }) => {
  const [reviews, setReviews] = useState<EmployerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/employer?userId=${targetUserId}`);
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [targetUserId]);

  if (loading) {
    return <div className="text-white/40 text-xs font-mono text-center p-4">Načítání referencí...</div>;
  }

  if (reviews.length === 0) {
    return null; // Render nothing if no reviews to keep profile clean
  }

  // Calculate averages
  const avgWorkEthic = reviews.reduce((acc, rev) => acc + rev.workEthicRating, 0) / reviews.length;
  const avgDrive = reviews.reduce((acc, rev) => acc + rev.drivePercentage, 0) / reviews.length;

  return (
    <AccordionSection 
      title={lang === 'cs' ? 'Pracovní Reference' : 'Employer Reviews'} 
      icon={<Briefcase size={16} />} 
      defaultOpen={true}
    >
      <div className="space-y-6">
        {/* Agregované statistiky */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-mafia-gold" />
            <h5 className="font-heading font-black uppercase text-xs tracking-widest text-mafia-gold">Celkové skóre od zaměstnavatelů</h5>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/60 mb-2 uppercase tracking-widest">
                <span>Tah na branku (Drive)</span>
                <span className="text-mafia-gold font-bold">{Math.round(avgDrive)} %</span>
              </div>
              <div className="w-full bg-black rounded-full h-1.5 border border-white/10 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-mafia-gold h-1.5 rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)] transition-all duration-1000" 
                  style={{ width: `${avgDrive}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/60 mb-2 uppercase tracking-widest">
                <span>Pracovní Morálka</span>
                <span className="text-blue-400 font-bold">{avgWorkEthic.toFixed(1)} / 10</span>
              </div>
              <div className="w-full bg-black rounded-full h-1.5 border border-white/10 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 h-1.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000" 
                  style={{ width: `${(avgWorkEthic / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jednotlivé recenze */}
        <div className="space-y-4">
          <h5 className="font-heading font-black uppercase text-[10px] tracking-widest text-white/40">Záznamy ({reviews.length})</h5>
          
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white/5 border border-white/10 p-4 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <Users size={32} className={rev.teamDynamics === 'consolidator' ? 'text-green-500' : rev.teamDynamics === 'disruptor' ? 'text-red-500' : 'text-gray-400'} />
              </div>
              
              <div className="mb-2">
                <p className="text-xs font-bold text-white mb-1">
                  {rev.reviewer?.companyProfile?.salonName || rev.reviewer?.name || 'Ověřená Firma'}
                </p>
                <div className="flex gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-widest ${
                    rev.teamDynamics === 'consolidator' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    rev.teamDynamics === 'disruptor' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    'bg-white/10 text-white/60 border border-white/20'
                  }`}>
                    {rev.teamDynamics === 'consolidator' ? 'Ucelovač kolektivu' : rev.teamDynamics === 'disruptor' ? 'Rozbíječ kolektivu' : 'Neutrální vliv'}
                  </span>
                </div>
              </div>

              {rev.textReview && (
                <p className="text-xs text-white/70 italic my-3 bg-black/30 p-3 rounded border-l-2 border-mafia-gold/50">
                  "{rev.textReview}"
                </p>
              )}

              <div className="flex items-center gap-4 text-[10px] font-mono text-white/50 mt-4">
                <span className="flex items-center gap-1"><TrendingUp size={12} className="text-mafia-gold"/> Drive: {rev.drivePercentage}%</span>
                <span className="flex items-center gap-1"><Briefcase size={12} className="text-blue-400"/> Morálka: {rev.workEthicRating}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccordionSection>
  );
};
