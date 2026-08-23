import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Ruler, Cigarette, Wine, Sparkles, Info, X, Skull, Flag, MessageCircleHeart, Coffee, Target, GraduationCap, Zap, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Camera, Heart, Instagram, Link, PawPrint, Facebook, Linkedin, Twitter, Music, PlaySquare, MessageSquare, EyeOff, Users, Home, Leaf, Calendar, Briefcase, Gamepad2, ShieldCheck, BadgeCheck, Lock, LockOpen
} from "lucide-react";
import { ANIMAL_TYPES } from "@/lib/PetAtlas";
import { useTranslation } from "@/hooks/useTranslation";

import { ProfileData } from "./ProfileTypes";
export * from "./ProfileTypes";
import { MatchVoucherCard, VoucherData } from "./MatchVoucherCard";
import { AccordionSection } from "./AccordionSection";

const formatRelativeTime = (timeStr: string, lang: 'cs' | 'en') => {
  if (!timeStr || !timeStr.includes('T')) return timeStr;

  const date = new Date(timeStr);
  if (isNaN(date.getTime())) return timeStr;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return lang === 'cs' ? 'před chvílí' : 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return lang === 'cs' ? `před ${diffInMinutes} min` : `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (lang === 'cs') return diffInHours === 1 ? 'před hodinou' : `před ${diffInHours} hodinami`;
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (lang === 'cs') return diffInDays === 1 ? 'včera' : `před ${diffInDays} dny`;
  return diffInDays === 1 ? 'yesterday' : `${diffInDays}d ago`;
};

interface ProfileCardProps {
  profile: ProfileData;
  onReport?: (profile: ProfileData) => void;
  onBookmark?: () => void;
  matchScores?: { overall: number; character: number; lifestyle: number; future: number; practical: number; communication?: number; intimacy?: number; intellect?: number; };
  matchReport?: string[];
  onLike?: () => void;
  onNope?: () => void;
  currentStrategy?: string;
  onStrategyChange?: (strategy: string) => void;
  suggestedVouchers?: VoucherData[];
  currentUserProfile?: ProfileData;
  freemiumPreviewIndex?: number; // 0-4 for free previews
}

export const ProfileCard = React.memo(function ProfileCard({ profile, onReport, onBookmark, matchScores, matchReport, onLike, onNope, currentStrategy, onStrategyChange, suggestedVouchers, currentUserProfile, freemiumPreviewIndex }: ProfileCardProps) {
  const { lang } = useTranslation();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [showDetails, setShowDetails] = useState(false);

  const seekingArray = Array.isArray(profile.seeking) ? profile.seeking : (profile.seeking ? [profile.seeking] : []);
  let displayMode = 'vazny_vztah';
  if (seekingArray.includes('business')) displayMode = 'business';
  else if (seekingArray.includes('bydleni')) displayMode = 'bydleni';
  else if (seekingArray.includes('kamarad') || seekingArray.includes('spoluzak')) displayMode = 'kamarad';
  else if (seekingArray.includes('kratkodoby')) displayMode = 'kratkodoby';

  const [bookmarked, setBookmarked] = useState(profile.isBookmarked || false);
  const [endorsements, setEndorsements] = useState(profile.trustEndorsements ? profile.trustEndorsements.reduce((acc, curr) => acc + curr.count, 0) : 0);
  const [hasEndorsed, setHasEndorsed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [graphicsTier, setGraphicsTier] = useState('high');

  const isDating = currentUserProfile?.activeCategories?.includes('relationships') || currentUserProfile?.activeCategories?.includes('dating') || false;

  const isStatMatch = (key: keyof ProfileData, val: any) => {
    if (!currentUserProfile || !val || !currentUserProfile[key]) return false;
    return String(currentUserProfile[key]).toLowerCase() === String(val).toLowerCase();
  };

  const isPremiumUnlocked = currentStrategy && currentStrategy !== 'random';

  const getMatchClass = (isMatch: boolean) => isMatch
    ? 'bg-green-900/20 border-green-500/50 text-green-400 font-bold'
    : 'bg-black/40 border-white/5 text-white/70';

  const getMatchIconClass = (isMatch: boolean) => isMatch ? 'text-green-400' : 'text-mafia-gold';


  useEffect(() => {
    const updateTier = () => setGraphicsTier(document.documentElement.getAttribute('data-graphics-tier') || 'high');
    updateTier();
    window.addEventListener('mmbarber-graphics-update', updateTier);
    return () => window.removeEventListener('mmbarber-graphics-update', updateTier);
  }, []);

  // If no photo is provided, use a placeholder
  const displayPhotos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : ["/placeholder-user.jpg"]; // Assume some placeholder or just black

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex < displayPhotos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };


  const renderDetails = () => (
    <>
      <div className="bg-mafia-dark/90 p-4 flex justify-between items-center border-b border-white/10 z-40 shrink-0">
        <h3 className="font-heading font-black uppercase text-mafia-gold tracking-widest">
          Profil: {profile.name}
        </h3>
        <button onClick={() => setShowDetails(false)} className="text-white/50 hover:text-white p-2 md:hidden">
          <X size={24} />
        </button>
      </div>


      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-24 relative">
        <AccordionSection title={lang === 'cs' ? 'Proč se k sobě hodíte' : 'Match Analysis'} icon={<Target size={16} />} defaultOpen={true}>
          {!isPremiumUnlocked ? (
            <div className="flex flex-col items-center justify-center p-8 bg-black/60 rounded-xl border border-mafia-gold/30 text-center relative overflow-hidden mb-4">
              <Lock size={48} className="text-mafia-gold mb-4 relative z-10" />
              <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest mb-2 relative z-10">
                {lang === 'cs' ? 'Prémiová analýza' : 'Premium Analysis'}
              </h4>
              <p className="text-white/60 text-xs font-mono uppercase tracking-widest relative z-10">
                {lang === 'cs' 
                  ? 'Spusť prémiový algoritmus (za 1 MMCOIN), abys zjistil, proč se k sobě hodíte a viděl detailní statistiky.' 
                  : 'Run a premium algorithm (for 1 MMCOIN) to see why you match and detailed stats.'}
              </p>
            </div>
          ) : (
            <>
              {/* FREEMIUM PREVIEW BANNER */}
              {freemiumPreviewIndex !== undefined && freemiumPreviewIndex < 5 && (
                <div className="bg-gradient-to-r from-blue-900/40 to-fuchsia-900/40 border border-blue-500/50 rounded-lg p-3 mb-6 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-black text-white uppercase tracking-widest mb-1">✨ Prémiová ukázka zdarma</span>
                    <span className="block text-[10px] font-mono text-white/70">Zobrazuješ {freemiumPreviewIndex + 1}. z 5 bezplatných ukázek.</span>
                  </div>
                  <LockOpen size={24} className="text-blue-400 opacity-80" />
                </div>
              )}

              {/* MATCH SCORE */}
              {matchScores && (
                <div className="bg-mafia-gold/10 border border-mafia-gold/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest flex items-center gap-2"><Target size={18} /> Celková shoda</h4>
                    <span className="text-2xl font-black text-mafia-gold">{matchScores.overall}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Povaha</span><span>{matchScores.character}%</span></div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.character}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Životní styl</span><span>{matchScores.lifestyle}%</span></div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.lifestyle}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Budoucnost</span><span>{matchScores.future}%</span></div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.future}%` }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Praktické</span><span>{matchScores.practical}%</span></div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.practical}%` }}></div></div>
                    </div>
                    {matchScores.communication !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Komunikace</span><span>{matchScores.communication}%</span></div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.communication}%` }}></div></div>
                      </div>
                    )}
                    {matchScores.intimacy !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Intimita</span><span>{matchScores.intimacy}%</span></div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.intimacy}%` }}></div></div>
                      </div>
                    )}
                    {matchScores.intellect !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-white/60 uppercase tracking-widest mb-1"><span>Intelekt</span><span>{matchScores.intellect}%</span></div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-mafia-gold" style={{ width: `${matchScores.intellect}%` }}></div></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Match Report Section */}
              {matchReport && matchReport.length > 0 && (
                <div className="mb-4 p-4 bg-mafia-gold/5 border border-mafia-gold/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-mafia-gold/20 pb-2 mb-3">
                    <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm flex items-center gap-2">
                      <Target size={16} /> 
                      {lang === 'cs' ? 'Hlavní postřehy' : 'Key Insights'}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {matchReport.map((insight, idx) => (
                      <li key={idx} className="text-white/80 font-mono text-xs flex items-start gap-2">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </AccordionSection>


        <AccordionSection title={lang === 'cs' ? 'O mně & Vibe' : 'About & Vibe'} icon={<MessageCircleHeart size={16} />} defaultOpen={true}>
          {/* Voice Prompt */}
          {profile.voicePrompt && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
              <h4 className="font-heading font-black text-purple-400 uppercase tracking-widest text-xs mb-2">🎤 Voice Prompt</h4>
              <p className="text-white/80 font-mono text-sm mb-4">"{profile.voicePrompt.question}"</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlayingAudio(!isPlayingAudio)} className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0">
                  {isPlayingAudio ? <div className="w-3 h-3 bg-white" /> : <PlaySquare size={16} className="text-white ml-1" />}
                </button>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden flex items-center gap-0.5">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`w-full bg-purple-500 rounded-full transition-all duration-300 ${isPlayingAudio ? 'animate-pulse' : ''}`} style={{ height: isPlayingAudio ? `${Math.max(20, Math.random() * 100)}%` : '20%' }} />
                  ))}
                </div>
                <span className="text-purple-300 font-mono text-[10px] shrink-0">0:10</span>
              </div>
            </div>
          )}

          {/* Bio & Negatives */}
          {profile.bio && (
            <div>
              <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-2">O mně</h4>
              <p className="text-white/80 font-sans text-sm leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile.negatives && (
            <div className="bg-red-950/20 border-l-2 border-red-500 p-4 relative overflow-hidden rounded-sm shadow-inner mt-4">
              <Flag size={80} className="absolute -right-4 -bottom-4 text-red-500/10 rotate-12" />
              <h4 className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Flag size={12} /> Red Flags / Moje Mouchy
              </h4>
              <p className="text-white/80 font-sans text-sm leading-relaxed relative z-10">
                {profile.negatives}
              </p>
            </div>
          )}

          {profile.icebreaker && (
            <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={64} className="text-blue-400" />
              </div>
              <h4 className="font-heading font-black text-blue-400 uppercase tracking-widest text-sm mb-2 flex items-center gap-2 relative z-10">
                <MessageSquare size={16} /> Lamač ledů (Napiš mi)
              </h4>
              <p className="text-white font-sans text-sm italic relative z-10 font-bold">
                "{profile.icebreaker}"
              </p>
            </div>
          )}

          {/* Match Report Section */}
          {matchReport && matchReport.length > 0 && (
            <div className="mb-8 p-4 bg-mafia-gold/5 border border-mafia-gold/20 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-mafia-gold/20 pb-2 mb-3">
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm flex items-center gap-2">
                  <Target size={16} />
                  {lang === 'cs' ? 'Proč se k sobě hodíte' : 'Why you match'}
                </h4>
                {matchScores && (
                  <span className="font-mono font-bold text-mafia-gold text-sm">{matchScores.overall}%</span>
                )}
              </div>
              <ul className="space-y-2">
                {matchReport.map((insight, idx) => (
                  <li key={idx} className="text-white/80 font-mono text-xs flex items-start gap-2">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}


        </AccordionSection>

        <AccordionSection title={lang === 'cs' ? 'Základní údaje' : 'Basic Info'} icon={<Info size={16} />} defaultOpen={false}>
          {/* Stats Grid */}
          {profile.accountType !== 'property' && (
            <div className="grid grid-cols-2 gap-4">
              {profile.height && (
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <Ruler size={14} className="text-mafia-gold" />
                  <span className="text-xs font-mono text-white/70 uppercase">{profile.height} cm</span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <GraduationCap size={14} className="text-mafia-gold" />
                  <span className="text-[10px] font-mono text-white/70 uppercase">
                    {profile.education === 'basic' ? 'Základní' :
                      profile.education === 'high' ? 'Středoškolské' : 'Vysokoškolské'}
                  </span>
                </div>
              )}
              {profile.smoking && (
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <Cigarette size={14} className="text-mafia-gold" />
                  <span className="text-xs font-mono text-white/70 uppercase">
                    {profile.smoking === 'no' ? 'Nekuřák' : profile.smoking === 'yes' ? 'Kuřák' : 'Příležitostně'}
                  </span>
                </div>
              )}
              {profile.drinking && (
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <Wine size={14} className="text-mafia-gold" />
                  <span className="text-xs font-mono text-white/70 uppercase">
                    {profile.drinking === 'no' ? 'Abstinent' : profile.drinking === 'yes' ? 'Často' : 'Příležitostně'}
                  </span>
                </div>
              )}
              {profile.firstDate && (
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <Coffee size={14} className="text-mafia-gold" />
                  <span className="text-[10px] font-mono text-white/70 uppercase line-clamp-1">
                    {profile.firstDate === 'coffee' ? 'Káva/Drink' : profile.firstDate === 'action' ? 'Akční' : profile.firstDate === 'walk' ? 'Procházka' : 'Kultura'}
                  </span>
                </div>
              )}
              {profile.livingStatus && (
                <div className="col-span-2 flex items-center justify-between gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-mafia-gold" />
                    <span className="text-xs font-mono text-white/70 uppercase">
                      Bydlení: {profile.livingStatus}
                    </span>
                  </div>
                  {profile.ownsHousing && (
                    <span className="px-2 py-0.5 bg-mafia-gold/20 text-mafia-gold text-[10px] rounded-full uppercase border border-mafia-gold/30">Vlastní</span>
                  )}
                </div>
              )}
              {profile.partnerExpectedIncome && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <span className="text-lg">💰</span>
                  <span className="text-xs font-mono text-white/70 uppercase">
                    Příjem partnera: <strong className="text-white">{profile.partnerExpectedIncome}</strong>
                  </span>
                </div>
              )}
              {(displayMode === 'vazny_vztah' || displayMode === 'kratkodoby') && profile.familyStatus && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <Users size={14} className="text-mafia-gold" />
                  <span className="text-xs font-mono text-white/70 uppercase">
                    Stav: <strong className="text-white">
                      {profile.familyStatus === 'single' ? 'Svobodný/á' :
                        profile.familyStatus === 'divorced' ? 'Rozvedený/á' :
                          profile.familyStatus === 'widowed' ? 'Vdovec/Vdova' : 'Je to složité'}
                    </strong>
                  </span>
                </div>
              )}
              {profile.hasKids === 'yes' && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <span className="text-lg">👶</span>
                  <span className="text-xs font-mono text-white/70 uppercase">
                    Děti: <strong className="text-white">{profile.kidsCount ? profile.kidsCount : 'Ano'}</strong>
                  </span>
                </div>
              )}
              {profile.disability && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <span className="text-lg" title={lang === 'cs' ? 'Zdravotní znevýhodnění' : 'Disability / Handicap'}>♿</span>
                  <span className="text-xs font-mono text-white/70 uppercase">
                    Znevýhodnění: <strong className="text-white">{profile.disability}</strong>
                  </span>
                </div>
              )}
              {profile.lgbtq && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <span className="text-lg" title={lang === 'cs' ? 'LGBTQ+ Přátelský / Člen' : 'LGBTQ+ Friendly / Member'}>🌈</span>
                  <span className="text-xs font-mono text-white/70 uppercase">
                    LGBTQ+ <strong className="text-white">Přátelský/Člen</strong>
                  </span>
                </div>
              )}
              {profile.pronouns && (
                <div className="col-span-2 flex items-center gap-2 bg-black/40 p-3 rounded-sm border border-white/5">
                  <span className="text-lg" title={lang === 'cs' ? 'Zájmena' : 'Pronouns'}>🗣️</span>
                  <span className="text-xs font-mono text-white/70 uppercase">
                    Zájmena: <strong className="text-white">{profile.pronouns}</strong>
                  </span>
                </div>
              )}
            </div>
          )}


        </AccordionSection>


        <AccordionSection title={lang === 'cs' ? 'Zájmy & Životní styl' : 'Interests & Lifestyle'} icon={<Sparkles size={16} />} defaultOpen={false}>
          {displayMode === 'business' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Briefcase size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Pracovní Profil</h4>
              </div>
              {profile.workLifeBalance && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Work-Life Balance</div>
                  <div className="text-sm text-white">{profile.workLifeBalance}</div>
                </div>
              )}
              {profile.moneyDetailed?.myAttitude && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Přístup k penězům</div>
                  <div className="text-sm text-white">{profile.moneyDetailed.myAttitude}</div>
                </div>
              )}
            </div>
          )}

          {displayMode === 'bydleni' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Home size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Profil Spolubydlení</h4>
              </div>
              {profile.smoking && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Kouření</div>
                  <div className="text-sm text-white">{profile.smoking}</div>
                </div>
              )}
              {profile.pets && profile.pets.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Domácí mazlíčci</div>
                  <div className="text-sm text-white">{profile.pets.map((p: any) => p.type || p.name || "Zvíře").join(", ")}</div>
                </div>
              )}
              {profile.temperament && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Běžný režim (Chronotyp)</div>
                  <div className="text-sm text-white">{profile.temperament.includes('Ranní') ? 'Ranní ptáče' : profile.temperament.includes('Sova') ? 'Noční sova' : 'Normální'}</div>
                </div>
              )}
            </div>
          )}

          {displayMode === 'kamarad' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Users size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Přátelský Profil</h4>
              </div>
              {profile.myTags && profile.myTags.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Co mě baví</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.myTags.map(h => <span key={h} className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full">{h}</span>)}
                  </div>
                </div>
              )}
              {profile.socialBattery && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Sociální Baterie</div>
                  <div className="text-sm text-white">{profile.socialBattery}</div>
                </div>
              )}
              {profile.spontaneityLevel && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Spontánnost</div>
                  <div className="text-sm text-white">{profile.spontaneityLevel}</div>
                </div>
              )}
            </div>
          )}

          {displayMode === 'kratkodoby' && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Zap size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Nezávazný Profil</h4>
              </div>
              {profile.spontaneityLevel && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Spontánnost</div>
                  <div className="text-sm text-white">{profile.spontaneityLevel}</div>
                </div>
              )}
              {profile.nsfwCategories && profile.nsfwCategories.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Otevřenost (NSFW)</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.nsfwCategories.map(c => <span key={c} className="text-[10px] px-2 py-0.5 bg-red-900/50 text-red-200 rounded-full border border-red-500/30">{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interests & Energy */}
          <div className="space-y-6">
            {profile.categories && profile.categories.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Bookmark size={12} /> Štítky & Životní styl
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((cat, i) => (
                    <span key={i} className="px-3 py-1.5 bg-mafia-gold/5 backdrop-blur-md border border-mafia-gold/20 text-smoke-white text-xs font-sans rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.rituals && profile.rituals.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Calendar size={12} /> Pravidelné Rituály
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.rituals.map((ritual, i) => {
                    const labels: Record<string, string> = {
                      'pizza_friday': '🍕 Páteční pizza',
                      'morning_run': '🏃 Ranní běh',
                      'sunday_trip': '🚗 Nedělní výlet',
                      'sauna': '🧖‍♀️ Saunování',
                      'gym': '💪 Pravidelné fitko',
                      'reading': '📚 Čtení',
                      'meditation': '🧘 Meditace',
                      'pub': '🍻 Pravidelné pivo',
                      'coffee': '☕ Ranní káva'
                    };
                    return (
                      <span key={i} className="px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/20 text-white text-xs font-sans rounded-full">
                        {labels[ritual] || ritual}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {profile.gamingPrefs && (profile.gamingPrefs.games?.length || profile.gamingPrefs.nickname) && (
              <div>
                <h4 className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Gamepad2 size={12} /> Herní Doupě
                </h4>
                <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-sm">
                  {profile.gamingPrefs.nickname && (
                    <div className="mb-3">
                      <span className="text-[9px] font-mono text-white/50 uppercase block mb-1">IGN / Nickname:</span>
                      <span className="text-white font-bold">{profile.gamingPrefs.nickname}</span>
                    </div>
                  )}
                  {profile.gamingPrefs.games && profile.gamingPrefs.games.length > 0 && (
                    <div>
                      <span className="text-[9px] font-mono text-white/50 uppercase block mb-2">Hraje:</span>
                      <div className="flex flex-wrap gap-2">
                        {profile.gamingPrefs.games.map((game, i) => {
                          const gameLabels: Record<string, string> = {
                            'lol': 'League of Legends',
                            'csgo': 'CS:GO / Valorant',
                            'wow': 'WoW / MMO',
                            'minecraft': 'Minecraft',
                            'cod': 'Call of Duty',
                            'rpg': 'Singleplayer RPGs',
                            'sim': 'Simulátory',
                            'board': 'Deskovky / DnD',
                            'mobile': 'Mobilní hry'
                          };
                          return (
                            <span key={i} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-sans rounded-md">
                              {gameLabels[game] || game}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile.pets && profile.pets.length > 0 && (
              <div>
                <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <PawPrint size={12} /> Zvířecí parťáci
                </h4>
                <div className="flex flex-col gap-3">
                  {profile.pets.map(pet => {
                    const typeIcon = ANIMAL_TYPES.find(t => t.id === pet.type)?.icon || '🐾';
                    return (
                      <div key={pet.id} className="flex flex-col p-4 border border-mafia-gold/20 bg-mafia-gold/5 rounded-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{typeIcon}</span>
                          <div>
                            <div className="font-heading font-black text-white text-lg tracking-wider">{pet.breed}</div>
                            {pet.name && <div className="text-sm font-mono text-mafia-gold uppercase">{pet.name}</div>}
                          </div>
                        </div>
                        {pet.purpose === 'breed' && (
                          <div className="mt-2 py-1 px-3 bg-red-500/20 border border-red-500/50 rounded-sm inline-flex items-center self-start gap-2">
                            <Heart size={14} className="text-red-500 fill-red-500" />
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Hledá partnera na krytí</span>
                          </div>
                        )}
                        {pet.purpose === 'walk' && (
                          <div className="mt-2 py-1 px-3 bg-green-500/20 border border-green-500/50 rounded-sm inline-flex items-center self-start gap-2">
                            <Target size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Hledá parťáka na venčení</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {profile.energy && (
              <div>
                <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Zap size={12} /> Moje Vibe
                </h4>
                <div className="text-white text-sm">
                  {profile.energy === 'zen' ? '🌿 Pohodář (Klidná síla, žádné drama)' :
                    profile.energy === 'balance' ? '⚖️ Balanc (Společenský, ale umím i vypnout)' :
                      '🌪️ Tornádo (100% akce, nezastavím se)'}
                </div>
              </div>
            )}

            {profile.interests && (
              <div>
                <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Sparkles size={12} /> Zájmy
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.split(',').map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-mafia-gold/10 border border-mafia-gold/30 text-mafia-gold text-xs font-mono uppercase tracking-wider rounded-sm">
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>


        </AccordionSection>

        <AccordionSection title={lang === 'cs' ? 'Psychologie & Deep Talk' : 'Psychology & Deep Talk'} icon={<Skull size={16} />} defaultOpen={false}>
          {/* Psychology Section */}
          {(profile.mbti || profile.temperament || profile.mindset || profile.intelligence || profile.socialBattery) && (
            <div className="space-y-4 pt-4 border-t border-mafia-gold/20">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Heart size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Psychologie & Povaha</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {profile.mbti && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      MBTI Typ
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.mbti}
                    </div>
                  </div>
                )}

                {profile.temperament && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Temperament
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.temperament}
                    </div>
                  </div>
                )}

                {profile.mindset && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Základní nastavení
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.mindset}
                    </div>
                  </div>
                )}

                {profile.socialBattery && (
                  <div className="bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Sociální baterie
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.socialBattery}
                    </div>
                  </div>
                )}

                {profile.intelligence && (
                  <div className="col-span-2 bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Typ inteligence (Nejsilnější stránka)
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.intelligence}
                    </div>
                  </div>
                )}

                {profile.personalityDynamics && (
                  <div className="col-span-2 bg-black/40 border border-mafia-gold/20 p-3 rounded-sm">
                    <div className="text-[9px] font-mono text-mafia-gold uppercase tracking-widest mb-1 opacity-80">
                      Osobnostní dynamika ve vztahu
                    </div>
                    <div className="text-white text-xs font-bold font-sans">
                      {profile.personalityDynamics}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complicated Section (Deep Dive) */}
          {profile.isComplicated && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-mafia-gold/30 pb-2">
                <Sparkles size={16} className="text-mafia-gold" />
                <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm">Pojďme do hloubky</h4>
              </div>

              {profile.weekend && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Můj typický víkend
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.weekend}
                  </div>
                </div>
              )}

              {profile.lifeGoal && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Životní cíl
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.lifeGoal}
                  </div>
                </div>
              )}

              {profile.kids && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    Názor na děti
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.kids === 'yes' ? 'Určitě chci' :
                      profile.kids === 'maybe' ? 'Možná jednou' :
                        profile.kids === 'no' ? 'Nechci' : 'Už mám'}
                  </div>
                </div>
              )}

              {profile.redFlag && (
                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Flag size={12} /> Moje mouchy (Red Flag)
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.redFlag === 'slow' ? 'Odepisuju strašně pomalu' :
                      profile.redFlag === 'snore' ? 'Chrápu' :
                        profile.redFlag === 'phone' ? 'Jsem pořád na telefonu' : 'Neumím vařit'}
                  </div>
                </div>
              )}

              {profile.loveLanguage && (
                <div className="bg-mafia-gold/5 border border-mafia-gold/20 p-4 rounded-sm">
                  <div className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <MessageCircleHeart size={12} /> Jazyk lásky
                  </div>
                  <div className="text-white text-sm font-sans">
                    {profile.loveLanguage === 'touch' ? 'Fyzický kontakt' :
                      profile.loveLanguage === 'gifts' ? 'Pozornosti a dárky' :
                        profile.loveLanguage === 'time' ? 'Trávení času spolu' : 'Slova ujištění'}
                  </div>
                </div>
              )}
            </div>
          )}


        </AccordionSection>

        <AccordionSection title={lang === 'cs' ? 'Sociální sítě' : 'Social Networks'} icon={<Link size={16} />} defaultOpen={false}>
          {/* Social Networks Section */}
          {(profile.instagram || profile.facebook || profile.linkedin || profile.twitter) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              {profile.instagram && (
                <div className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors cursor-pointer group">
                  <Instagram size={18} className="text-white/50 group-hover:text-pink-500 transition-colors" />
                </div>
              )}
              {profile.facebook && (
                <div className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors cursor-pointer group">
                  <Facebook size={18} className="text-white/50 group-hover:text-blue-500 transition-colors" />
                </div>
              )}
              {profile.linkedin && (
                <div className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors cursor-pointer group">
                  <Linkedin size={18} className="text-white/50 group-hover:text-blue-400 transition-colors" />
                </div>
              )}
              {profile.twitter && (
                <div className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors cursor-pointer group">
                  <Twitter size={18} className="text-white/50 group-hover:text-blue-300 transition-colors" />
                </div>
              )}
            </div>
          )}
        </AccordionSection>

        {/* Suggested Date / Voucher */}
        {suggestedVouchers && suggestedVouchers.length > 0 && (
          <div className="pt-8 mt-4 border-t border-mafia-gold/30 pb-4">
            <h4 className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <MapPin size={12} /> {lang === 'cs' ? 'Doporučené tipy na rande podle shody' : 'Recommended Date Ideas'}
            </h4>
            <div className="flex flex-col gap-4">
              {suggestedVouchers.map(v => (
                <MatchVoucherCard key={v.id} voucher={v} lang={lang as 'cs' | 'en'} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );

  return (
    <div className="relative w-full max-w-sm md:max-w-7xl mx-auto h-[600px] md:h-[700px] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.15)] border border-mafia-gold/20 flex flex-col md:flex-row">

      {/* Photo Carousel (Left Side on Desktop) */}
      <div className="relative flex-1 md:flex-none md:w-[350px] lg:w-[400px] xl:w-[450px] h-full bg-black shrink-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentPhotoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={displayPhotos[currentPhotoIndex]}
              alt={`${profile.name} photo`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={currentPhotoIndex === 0}
            />
          </motion.div>
        </AnimatePresence>



        {/* Report Button (Proximity Hover) */}
        {onReport && !showDetails && (
          <div className="absolute top-0 right-0 z-50 p-6 group cursor-pointer" onClick={(e) => { e.stopPropagation(); onReport(profile); }} onPointerDown={(e) => e.stopPropagation()}>
            <button
              className="w-10 h-10 bg-black/40 group-hover:bg-red-900/40 hover:!bg-red-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white/50 group-hover:text-red-400 hover:!text-white transition-all duration-500 border border-white/10 group-hover:border-red-500/40 hover:!border-red-500/80 pointer-events-auto"
              title={lang === 'cs' ? 'Nahlásit profil' : 'Report profile'}
            >
              <Flag size={18} className="transition-colors duration-500 pointer-events-none" />
            </button>
          </div>
        )}

        {/* Badges Container (Match, Photos & Group) */}
        {!showDetails && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col gap-2 items-center w-full">
            
            {/* Photo Indicator */}
            {displayPhotos.length > 1 && (
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <Camera size={12} className="text-mafia-gold" />
                <span className="text-white text-[10px] font-mono font-bold tracking-widest">
                  {currentPhotoIndex + 1} / {displayPhotos.length}
                </span>
              </div>
            )}

            {matchScores && (
              <div className={`px-4 py-1.5 backdrop-blur-md rounded-full border-2 font-heading font-black tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${matchScores.overall >= 80 ? 'border-mafia-gold text-mafia-gold bg-black/60 shadow-[0_0_15px_rgba(197,160,89,0.3)]' : matchScores.overall >= 50 ? 'border-white/50 text-white bg-black/50' : 'border-red-900/50 text-red-500 bg-black/50'}`}>
                <Sparkles size={14} />
                {matchScores.overall}% MATCH
              </div>
            )}

            {profile.linkedAccounts && profile.linkedAccounts.filter(a => a.status === 'accepted').length > 0 && (
              <div className="px-3 py-1 backdrop-blur-md rounded-full border border-green-500/50 text-green-400 bg-black/80 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 font-heading font-black uppercase tracking-widest text-xs">
                <Users size={12} />
                {profile.linkedAccounts.filter(a => a.status === 'accepted').length === 1 ? 'DOUBLE DATE (2 lidé)' :
                  profile.linkedAccounts.filter(a => a.status === 'accepted').length === 2 ? 'TRIPLE DATE (3 lidé)' :
                    `GROUP DATE (${profile.linkedAccounts.filter(a => a.status === 'accepted').length + 1} lidí)`}
              </div>
            )}
          </div>
        )}

        {/* (Online Badge moved to the bottom next to name) */}

        {/* ADMIN TAGS (e.g. Golddigger, Netflix & Chill) - LIMITED TO 2 */}
        {profile.adminTags && profile.adminTags.length > 0 && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-3 items-center pointer-events-none w-full px-4">
            {profile.adminTags.slice(0, 2).map((tag, idx) => {
              let emojis: string[] = [];
              let styleClass = "";
              let tagText = tag;

              // Unique Wild West / Mafia Theme per tag
              if (tag === "GOLDDIGGER") {
                emojis = ["💰", "🪙"];
                styleClass = "bg-yellow-900/80 border-mafia-gold text-mafia-gold shadow-[0_0_20px_rgba(197,160,89,0.5)]";
                tagText = `★ ${tag} ★`;
              } else if (tag === "NETFLIX & CHILL") {
                emojis = ["🍿", "🍷"];
                styleClass = "bg-purple-900/80 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]";
                tagText = `✧ ${tag} ✧`;
              } else if (tag === "F*CKBOY") {
                emojis = ["🚩", "😈"];
                styleClass = "bg-red-900/80 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse";
                tagText = `⚠ ${tag} ⚠`;
              } else if (tag === "RYCHLOVKA (EASY)") {
                emojis = ["💦", "🔥"];
                styleClass = "bg-pink-900/80 border-pink-400 text-pink-200 shadow-[0_0_20px_rgba(244,114,182,0.5)]";
                tagText = `♡ ${tag} ♡`;
              } else {
                // Fallback "WANTED" wild west style
                styleClass = "bg-[#3e2723]/90 border-[#d7ccc8] text-[#d7ccc8] shadow-[0_0_15px_rgba(0,0,0,0.8)] font-serif";
                tagText = `WANTED: ${tag}`;
              }

              return (
                <div key={idx} className="relative">
                  <div className={`px-4 py-1.5 backdrop-blur-md border font-heading font-black uppercase tracking-[0.2em] text-xs md:text-sm ${styleClass}`}>
                    {tagText}
                  </div>

                  {/* Small floating emojis around the tag - DISABLE ON LOW TIER */}
                  {graphicsTier !== 'low' && emojis.length > 0 && [...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        x: (i % 2 === 0 ? -20 : 20) * (Math.random() + 1),
                        y: 0,
                        scale: 0.5
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: -30 - Math.random() * 20,
                        x: (i % 2 === 0 ? -30 : 30) * (Math.random() + 1),
                        scale: [0.5, 1.2, 0.5],
                        rotate: Math.random() * 90 - 45
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm z-30"
                    >
                      {emojis[i % emojis.length]}
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Navigation Overlays (invisible clickable areas) */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={prevPhoto} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={nextPhoto} />

        {/* Photo Navigation Arrows */}
        {!showDetails && displayPhotos.length > 1 && (
          <>

            <button
              onClick={prevPhoto}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={currentPhotoIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 border border-white/10 transition-all z-30 pointer-events-auto ${currentPhotoIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextPhoto}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={currentPhotoIndex === displayPhotos.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 border border-white/10 transition-all z-30 pointer-events-auto ${currentPhotoIndex === displayPhotos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Action Buttons (Top Left - Proximity Hover) */}
        <div className="absolute top-0 left-0 p-6 flex flex-col gap-2 z-50 pointer-events-auto group cursor-pointer" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
              if (onBookmark) onBookmark();
            }}
            title={lang === 'cs' ? 'Uložit na později' : 'Save for later'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border backdrop-blur-md pointer-events-auto ${bookmarked
                ? 'bg-mafia-gold/20 text-mafia-gold border-mafia-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                : 'bg-black/60 group-hover:bg-mafia-gold/10 hover:!bg-mafia-gold/30 text-white/60 group-hover:text-mafia-gold/70 hover:!text-mafia-gold border-white/10 group-hover:border-mafia-gold/30 hover:!border-mafia-gold/60 shadow-[0_0_0px_rgba(197,160,89,0)] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:!shadow-[0_0_20px_rgba(197,160,89,0.4)]'
              }`}
          >
            <Bookmark size={18} className={`${bookmarked ? "fill-mafia-gold" : ""} transition-colors duration-500 pointer-events-none`} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}
            title={lang === 'cs' ? 'Více informací' : 'More info'}
            className="md:hidden w-10 h-10 rounded-full transition-all duration-500 border backdrop-blur-md flex items-center justify-center pointer-events-auto bg-black/60 group-hover:bg-white/10 hover:!bg-white/20 text-white/60 group-hover:text-white/80 hover:!text-white border-white/10 group-hover:border-white/30 hover:!border-white/50"
          >
            <Info size={18} className="transition-colors duration-500 pointer-events-none" />
          </button>
        </div>

        {/* Info Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10" />

        {/* Spontaneous Status Banner */}
        {profile.currentStatus && profile.currentStatus.expiresAt > Date.now() && !showDetails && (
          <div className="absolute top-[25%] left-0 w-full bg-mafia-gold/90 backdrop-blur-md py-3 px-6 z-20 shadow-[0_0_30px_rgba(197,160,89,0.5)] flex flex-col items-center justify-center transform -skew-y-3 border-y border-mafia-gold pointer-events-none">
            <span className="text-[9px] font-mono font-bold text-black uppercase tracking-[0.3em] opacity-70 mb-0.5">V Síti hlásí:</span>
            <span className="text-sm font-heading font-black text-black uppercase tracking-widest text-center">{profile.currentStatus.text}</span>
          </div>
        )}

        {/* Basic Info at the bottom of the photo */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 text-left pointer-events-none">
          <div className="flex items-end justify-between mb-2 pointer-events-auto">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-widest leading-none drop-shadow-lg flex items-center gap-3">
                  {profile.name} {profile.lastName || ''}
                  {profile.nickname && <span className="text-mafia-gold/70 text-2xl lowercase italic">"{profile.nickname}"</span>}
                  {profile.idVerified && (
                    <span title="Ověřeno průkazem (AI)">
                      <BadgeCheck size={28} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    </span>
                  )}
                  {profile.salonVerified && (
                    <span title="Ověřeno online">
                      <ShieldCheck size={28} className="text-mafia-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
                    </span>
                  )}
                  {profile.physicallyVerifiedAt && profile.physicallyVerifiedAt.length > 0 && (
                    <span title="Fyzicky ověřeno (Safe Spot)">
                      <MapPin size={28} className="text-slate-300 drop-shadow-[0_0_20px_rgba(203,213,225,0.8)]" />
                    </span>
                  )}
                  {profile.originSalonId && (
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded border border-white/20 font-mono tracking-widest uppercase ml-2 text-white/70 truncate max-w-[100px]">
                      {profile.originSalonId}
                    </span>
                  )}
                  {profile.accountType === 'pet' && <PawPrint size={32} className="text-mafia-gold" />}
                  {profile.accountType === 'property' && <Home size={32} className="text-blue-500" />}
                  {profile.accountType === 'object' && <Leaf size={32} className="text-green-500" />}
                  {profile.accountType === 'activity' && <Calendar size={32} className="text-orange-500" />}
                  {profile.accountType === 'job' && <Briefcase size={32} className="text-yellow-500" />}
                </h2>
                <span className="text-3xl font-heading text-mafia-gold font-light leading-none">
                  {profile.age}
                </span>
              </div>

              {profile.lastOnline ? (
                <div className="text-white/50 text-[10px] font-mono mt-1 mb-2 flex items-center gap-1">
                  Naposledy online: {new Date(profile.lastOnline).toLocaleDateString('cs-CZ')}
                </div>
              ) : (
                <div className="text-green-400 text-[10px] font-mono mt-1 mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  {lang === 'cs' ? 'Nyní online' : 'Online now'}
                </div>
              )}

              {/* Tags below name */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {profile.accountType === 'pet' && profile.pets && profile.pets[0] && (
                  <>
                    <span className="px-2 py-0.5 bg-mafia-gold/20 border border-mafia-gold/50 rounded-md text-mafia-gold text-[10px] font-mono uppercase font-bold">
                      {profile.pets[0].breed || (lang === 'cs' ? 'Mazlíček' : 'Pet')}
                    </span>
                    {profile.pets[0].purpose === 'walk' && <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 rounded-md text-blue-400 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Hledá parťáka na venčení' : 'Walking buddy'}</span>}
                    {profile.pets[0].purpose === 'breed' && <span className="px-2 py-0.5 bg-pink-500/20 border border-pink-500/50 rounded-md text-pink-400 text-[10px] font-mono uppercase">{lang === 'cs' ? 'K páření' : 'Mating'}</span>}
                  </>
                )}
                {profile.seeking && profile.seeking.includes('business') && (
                  <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded-md text-purple-400 text-[10px] font-mono uppercase font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    {lang === 'cs' ? 'Byznys & Networking' : 'Business'}
                  </span>
                )}
                {profile.seeking && profile.seeking.includes('bydleni') && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/50 rounded-md text-indigo-400 text-[10px] font-mono uppercase font-bold shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                    {lang === 'cs' ? 'Spolubydlení' : 'Roommate'}
                  </span>
                )}
                {profile.seeking && profile.seeking.includes('kamarad') && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/50 rounded-md text-emerald-400 text-[10px] font-mono uppercase font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    {lang === 'cs' ? 'Hledá přátele' : 'Seeking friends'}
                  </span>
                )}
              </div>


              <div className="flex flex-wrap items-center gap-3 mt-2">
                {profile.locations && profile.locations.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {profile.locations.map((loc, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-white/80 font-mono text-xs uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        <MapPin size={12} className="text-mafia-gold" /> {loc.city} <span className="text-white/40 text-[9px]">({loc.radiusKm >= 100 ? 'ČR' : `+${loc.radiusKm}km`})</span>
                      </div>
                    ))}
                    {profile.locationPrivacy === 'incognito' && (
                      <div className="flex items-center gap-1 text-blue-400 font-mono text-[9px] uppercase tracking-widest bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded-md" title="Incognito">
                        <EyeOff size={10} />
                      </div>
                    )}
                  </div>
                ) : profile.city && (
                  <div className="flex items-center gap-1 text-white/80 font-mono text-xs uppercase tracking-widest">
                    <MapPin size={12} className="text-mafia-gold" /> {profile.city}
                  </div>
                )}

                {profile.instagram && (
                  <div className="flex items-center gap-1 text-white/80 font-mono text-xs tracking-widest">
                    <Instagram size={12} className="text-pink-500" /> @{profile.instagram}
                  </div>
                )}

                {profile.tiktok && (
                  <div className="flex items-center gap-1 text-white/80 font-mono text-xs tracking-widest">
                    <Link size={12} className="text-white" /> @{profile.tiktok}
                  </div>
                )}

                {profile.lastOnline && (
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    <span className="text-white/80 text-[9px] font-mono uppercase tracking-widest">
                      {formatRelativeTime(profile.lastOnline, lang as 'cs' | 'en')}
                    </span>
                  </div>
                )}
                {profile.replyRate === 'high' && (
                  <div className="flex items-center gap-1.5 bg-yellow-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-yellow-500/50" title="Rychlá odpověď">
                    <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                      {lang === 'cs' ? 'Rychlá odpověď' : 'Fast reply'}
                    </span>
                  </div>
                )}

                {/* Trust Score */}
                {(profile.trustScore !== undefined || profile.trustEndorsements !== undefined) && (
                  <div className="flex items-center gap-1.5 bg-blue-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-blue-500/50" title="Skóre důvěryhodnosti">
                    <ShieldCheck size={10} className="text-blue-400" />
                    <span className="text-blue-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                      TRUST {profile.trustScore || 0}% ({endorsements})
                    </span>
                  </div>
                )}

                {/* Mutual Friends */}
                {profile.showMutualFriends !== false && profile.mutualFriendsCount !== undefined && profile.mutualFriendsCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-pink-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-pink-500/50" title={lang === 'cs' ? 'Společní přátelé' : 'Mutual Friends'}>
                    <Users size={10} className="text-pink-400" />
                    <span className="text-pink-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                      {profile.mutualFriendsCount} {lang === 'cs' ? 'společných přátel' : 'mutual friends'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Likes Badge */}
        {profile.dateLikes !== undefined && (
          <div className="absolute top-4 right-4 z-40">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span className="text-white text-xs font-mono font-bold tracking-widest">{profile.dateLikes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Details Sheet (Slides up) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden absolute inset-0 bg-mafia-dark/95 backdrop-blur-md z-30 flex flex-col text-left overflow-hidden border-t border-mafia-gold/30"
          >
            {renderDetails()}
            {/* Close Button at bottom right (Floating) */}
            <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-mafia-gold/20 backdrop-blur-md flex items-center justify-center text-mafia-gold hover:text-white hover:bg-mafia-gold transition-colors border border-mafia-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:scale-110"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Details Panel */}
      <div className="hidden md:flex flex-1 flex-col bg-mafia-dark/95 md:border-t-0 md:border-l border-mafia-gold/30 relative h-full overflow-hidden">
        {renderDetails()}
      </div>
    </div>
  );
});
