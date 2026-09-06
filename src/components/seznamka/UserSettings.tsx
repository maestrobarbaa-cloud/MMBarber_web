import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ShieldCheck, EyeOff, Clock, Trash2, RotateCcw, Users, MessageCircle, Bell, UserCog, Lock, ChevronRight, Link2, Info, Wallet, Gift, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect } from './CustomSelect';
import { ProfileData } from './ProfileCard';
import { useFragmentsContext } from "@/contexts/FragmentsContext";

interface UserSettingsProps {
  userProfile?: ProfileData | null;
  onUpdateProfile?: (profile: ProfileData) => void;
  onResetPreferences: () => void;
  onDeleteAccount: () => void;
}

type TabType = 'chat' | 'privacy' | 'notifications' | 'account' | 'wallet';

export function UserSettings({ userProfile, onUpdateProfile, onResetPreferences, onDeleteAccount }: UserSettingsProps) {
  const { lang } = useTranslation();
  
  const fragmentsContext = useFragmentsContext();
  const currentFragments = fragmentsContext?.fragments || 0;
  const fragmentsPerCoin = fragmentsContext?.fragmentsPerCoin || 10;
  const progress = Math.min(100, Math.max(0, (currentFragments / fragmentsPerCoin) * 100));
  
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const [autoBlurImages, setAutoBlurImages] = useState(true);
  const [filterToxicWords, setFilterToxicWords] = useState(true);
  const [defaultGhostMode, setDefaultGhostMode] = useState<number | null>(null);
  
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);

  // Linked account states
  const [linkedAccounts, setLinkedAccounts] = useState<{id: string, email: string}[]>([]);
  const [newLinkEmail, setNewLinkEmail] = useState('');
  const [newLinkPassword, setNewLinkPassword] = useState('');

  // Wallet states
  const [mmcoins, setMmcoins] = useState(0);
  const [freeBoosts, setFreeBoosts] = useState(0);
  const [rewardShards, setRewardShards] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralInput, setReferralInput] = useState('');
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  // Load wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch('/api/user/wallet'); // We will create this API
        if (res.ok) {
          const data = await res.json();
          setMmcoins(data.mmcoins);
          setFreeBoosts(data.freeBoosts);
          setReferralCode(data.referralCode);
          setRewardShards(data.rewardShards || 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWallet();
  }, [activeTab]);

  const claimDaily = async () => {
    try {
      const res = await fetch('/api/rewards/monthly', { method: 'POST' });
      const data = await res.json();
      setClaimStatus(data.message);
      if (data.success && data.mmcoins !== undefined) {
        setMmcoins(data.mmcoins);
      }
    } catch (e) {
      setClaimStatus('Chyba při komunikaci se serverem.');
    }
  };

  const applyReferral = async () => {
    if (!referralInput) return;
    try {
      const res = await fetch('/api/rewards/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: referralInput })
      });
      const data = await res.json();
      alert(data.message || data.error);
      if (data.success) {
        setMmcoins(prev => prev + 5);
        setFreeBoosts(prev => prev + 5);
        setReferralInput('');
      }
    } catch (e) {
      alert('Chyba při komunikaci se serverem.');
    }
  };

  useEffect(() => {
    const savedSafeChat = localStorage.getItem('seznamka_safe_chat');
    if (savedSafeChat !== null) setAutoBlurImages(savedSafeChat === 'true');
    
    const savedToxicFilter = localStorage.getItem('seznamka_toxic_filter');
    if (savedToxicFilter !== null) setFilterToxicWords(savedToxicFilter === 'true');
    
    const savedGhostMode = localStorage.getItem('seznamka_default_ghost_mode');
    if (savedGhostMode !== null) setDefaultGhostMode(savedGhostMode === 'null' ? null : parseInt(savedGhostMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('seznamka_safe_chat', autoBlurImages.toString());
  }, [autoBlurImages]);

  useEffect(() => {
    localStorage.setItem('seznamka_toxic_filter', filterToxicWords.toString());
  }, [filterToxicWords]);

  useEffect(() => {
    localStorage.setItem('seznamka_default_ghost_mode', defaultGhostMode === null ? 'null' : defaultGhostMode.toString());
  }, [defaultGhostMode]);

  const tabs: { id: TabType; icon: React.ElementType; label: Record<'cs'|'en', string> }[] = [
    { id: 'chat', icon: MessageCircle, label: { cs: 'Chat a Filtry', en: 'Chat & Filters' } },
    { id: 'privacy', icon: ShieldCheck, label: { cs: 'Soukromí', en: 'Privacy' } },
    { id: 'notifications', icon: Bell, label: { cs: 'Oznámení', en: 'Notifications' } },
    { id: 'account', icon: UserCog, label: { cs: 'Účet', en: 'Account' } },
    { id: 'wallet', icon: Wallet, label: { cs: 'Peněženka', en: 'Wallet' } },
  ];

  return (
    <div className="w-full pb-8">
      <div className="mb-8 border-l-4 border-mafia-gold pl-4 text-left">
        <h3 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-1">
          {lang === 'cs' ? 'Nastavení Profilu' : 'Profile Settings'}
        </h3>
        <p className="text-white/50 font-mono text-[10px] uppercase tracking-widest">
          {lang === 'cs' ? 'Přizpůsob si seznamku podle sebe' : 'Customize your dating experience'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full items-start">
        {/* Navigation Tabs (Sidebar on Desktop) */}
        <div className="flex flex-row overflow-x-auto pb-4 gap-2 hide-scrollbar w-full lg:w-64 lg:flex-col lg:pb-0 lg:sticky lg:top-24 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center justify-center lg:justify-start gap-2 px-4 py-2.5 lg:py-4 rounded-full lg:rounded-xl transition-all duration-300 border lg:border-l-4 lg:border-y-0 lg:border-r-0 ${
                  isActive 
                    ? 'bg-mafia-gold/20 border-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.2)] lg:shadow-none' 
                    : 'bg-black/40 border-white/10 lg:border-transparent hover:bg-white/10 lg:hover:border-white/20'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-mafia-gold' : 'text-white/40'} />
                <span className={`font-mono text-[10px] lg:text-xs uppercase tracking-widest font-bold whitespace-nowrap ${isActive ? 'text-mafia-gold' : 'text-white/60'}`}>
                  {tab.label[lang as 'cs' | 'en']}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 w-full min-w-0 relative">
          <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 md:p-8 text-left min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div>
                  <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
                    {lang === 'cs' ? 'Ochrana a Předvolby Chatu' : 'Chat Protection & Preferences'}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Safe Chat Toggle */}
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${autoBlurImages ? 'bg-blue-900/20 border-blue-500/50' : 'bg-black/60 border-white/10'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck size={18} className={autoBlurImages ? 'text-blue-400' : 'text-white/20'} />
                          <h5 className={`font-bold text-xs uppercase tracking-widest ${autoBlurImages ? 'text-blue-400' : 'text-white/70'}`}>
                            {lang === 'cs' ? 'Bezpečný chat (Fotky)' : 'Safe Chat (Photos)'}
                          </h5>
                        </div>
                        <p className="text-white/50 text-[10px] font-mono leading-relaxed max-w-sm">
                          {lang === 'cs' 
                            ? 'Automaticky rozmaže přijaté fotografie. Odhalíte je až kliknutím.' 
                            : 'Automatically blurs received photos. Reveal by clicking.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setAutoBlurImages(!autoBlurImages)}
                        className={`w-full sm:w-auto px-6 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${autoBlurImages ? 'bg-blue-500 text-black hover:bg-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {autoBlurImages ? (lang === 'cs' ? 'Zapnuto' : 'Enabled') : (lang === 'cs' ? 'Vypnuto' : 'Disabled')}
                      </button>
                    </div>

                    {/* Toxic Filter */}
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${filterToxicWords ? 'bg-green-900/20 border-green-500/50' : 'bg-black/60 border-white/10'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <EyeOff size={18} className={filterToxicWords ? 'text-green-400' : 'text-white/20'} />
                          <h5 className={`font-bold text-xs uppercase tracking-widest ${filterToxicWords ? 'text-green-400' : 'text-white/70'}`}>
                            {lang === 'cs' ? 'Cenzura Nadávek' : 'Profanity Filter'}
                          </h5>
                        </div>
                        <p className="text-white/50 text-[10px] font-mono leading-relaxed max-w-sm">
                          {lang === 'cs' 
                            ? 'Nahradí vulgární výrazy ve zprávách hvězdičkami (***).' 
                            : 'Replaces vulgar expressions in messages with asterisks (***).'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setFilterToxicWords(!filterToxicWords)}
                        className={`w-full sm:w-auto px-6 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${filterToxicWords ? 'bg-green-500 text-black hover:bg-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {filterToxicWords ? (lang === 'cs' ? 'Zapnuto' : 'Enabled') : (lang === 'cs' ? 'Vypnuto' : 'Disabled')}
                      </button>
                    </div>

                    {/* Default Ghost Mode */}
                    <div className="p-4 rounded-xl border bg-black/60 border-white/10">
                      <div className="flex justify-between mb-3">
                        <div>
                          <h5 className="font-bold text-xs mb-1 text-white uppercase tracking-widest">
                            {lang === 'cs' ? 'Výchozí Ghost Mode' : 'Default Ghost Mode'}
                          </h5>
                          <p className="text-white/50 text-[10px] font-mono">
                            {lang === 'cs' ? 'Doba, po které se zprávy v NOVÝCH konverzacích smažou.' : 'Time after which messages in NEW conversations delete.'}
                          </p>
                        </div>
                        <Clock size={20} className={defaultGhostMode !== null ? 'text-mafia-gold' : 'text-white/20'} />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { value: null, label: lang === 'cs' ? 'Nikdy' : 'Never' },
                          { value: 1, label: lang === 'cs' ? '1 den' : '1 day' },
                          { value: 7, label: lang === 'cs' ? '7 dní' : '7 days' },
                          { value: 30, label: lang === 'cs' ? '1 měsíc' : '1 month' },
                        ].map((option) => (
                          <button
                            key={option.value === null ? 'never' : option.value}
                            onClick={() => setDefaultGhostMode(option.value)}
                            className={`py-2 px-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-lg border ${
                              defaultGhostMode === option.value
                                ? 'bg-mafia-gold border-mafia-gold text-black shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <motion.div key="privacy" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
                  {lang === 'cs' ? 'Viditelnost Profilu' : 'Profile Visibility'}
                </h4>

                <div className="space-y-4">
                  {/* Incognito Location */}
                  <div className="p-5 bg-gradient-to-br from-blue-900/10 to-blue-950/20 border border-blue-500/20 rounded-xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                          <EyeOff size={14} /> {lang === 'cs' ? 'Soukromí Lokace (Incognito)' : 'Location Privacy (Incognito)'}
                        </label>
                        <p className="text-[10px] font-mono text-white/50 leading-relaxed mb-3 lg:mb-0">
                          {lang === 'cs' 
                            ? 'Incognito režim zajistí, že tě algoritmus nepropojí s nikým, kdo zadal stejné město. Ideální pro utajení před kolegy či sousedy.' 
                            : 'Ensures you wont match with anyone from your city. Avoid neighbors or colleagues.'}
                        </p>
                      </div>
                      <div className="w-full lg:w-56 shrink-0">
                        <CustomSelect 
                          value={userProfile?.locationPrivacy || "any"} 
                          onChange={(val) => {
                            if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, locationPrivacy: val as any });
                          }} 
                          options={[
                            { value: 'any', label: lang === 'cs' ? 'Normální hledání' : 'Normal search' },
                            { value: 'local', label: lang === 'cs' ? 'Jen lidé z okolí' : 'Only locals' },
                            { value: 'incognito', label: lang === 'cs' ? 'Incognito 🕵️' : 'Incognito 🕵️' }
                          ]} 
                          placeholder={lang === 'cs' ? 'Vyber...' : 'Select...'} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mutual Friends */}
                  <div className="p-5 bg-black/60 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-white/40" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Zobrazovat společné přátele' : 'Show Mutual Friends'}</h5>
                        <p className="text-[10px] font-mono text-white/50">{lang === 'cs' ? 'Zobrazí, zda máte v síti stejné známé.' : 'Shows if you share acquaintances.'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userProfile?.showMutualFriends !== false}
                        onChange={(e) => {
                          if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, showMutualFriends: e.target.checked });
                        }}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                    </label>
                  </div>

                  {/* Private Profile (Ghost Mode) */}
                  <div className="p-5 bg-black/60 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <EyeOff size={16} className="text-white/40" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Neveřejný profil (Ghost Mode)' : 'Private Profile (Ghost Mode)'}</h5>
                        <p className="text-[10px] font-mono text-white/50 max-w-sm">{lang === 'cs' ? 'Skryje profil před běžným vyhledáváním. Zobrazí se pouze při specifické shodě algoritmu.' : 'Hides your profile from regular search. Shows only on specific algorithm matches.'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userProfile?.isPrivate === true}
                        onChange={(e) => {
                          if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, isPrivate: e.target.checked });
                        }}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                    </label>
                  </div>

                  {/* Ninja Mode */}
                  <div className="p-5 bg-black/60 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-white/40" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Ninja Mód' : 'Ninja Mode'}</h5>
                        <p className="text-[10px] font-mono text-white/50 max-w-sm">{lang === 'cs' ? 'Uvidí vás jen lidé, kterým jste už dali Like. Ostatním se profil neukáže.' : 'Only people you liked can see you. You are hidden from the rest.'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userProfile?.isNinjaMode === true}
                        onChange={(e) => {
                          if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, isNinjaMode: e.target.checked });
                        }}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                    </label>
                  </div>

                  {/* Blurred Mode */}
                  <div className="p-5 bg-black/60 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <EyeOff size={16} className="text-white/40" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Zamaskovaný Mód (Slepé Rande)' : 'Blurred Mode (Blind Date)'}</h5>
                        <p className="text-[10px] font-mono text-white/50 max-w-sm">{lang === 'cs' ? 'Rozmaže vaše fotky pro ostatní. Hodnotí vás primárně podle osobnosti.' : 'Blurs your photos. You are judged primarily by personality.'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userProfile?.isBlurredMode === true}
                        onChange={(e) => {
                          if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, isBlurredMode: e.target.checked });
                        }}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                    </label>
                  </div>

                  {/* Zen Mode */}
                  <div className="p-5 bg-black/60 border border-white/10 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-white/40" />
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'cs' ? 'Zen Mód (Pomalé seznamování)' : 'Zen Mode (Slow Dating)'}</h5>
                        <p className="text-[10px] font-mono text-white/50 max-w-sm">{lang === 'cs' ? 'Zamezuje nekonečnému swipování. Zobrazí max 3 pečlivě vybrané profily denně.' : 'Prevents endless swiping. Shows max 3 curated profiles per day.'}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={userProfile?.isZenMode === true}
                        onChange={(e) => {
                          if (userProfile && onUpdateProfile) onUpdateProfile({ ...userProfile, isZenMode: e.target.checked });
                        }}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                    </label>
                  </div>

                  {/* Account Linking / Trust */}
                  <div className="p-5 bg-black/60 border border-mafia-gold/20 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-mafia-gold/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-start gap-3 mb-4">
                      <Link2 size={18} className="text-mafia-gold mt-1" />
                      <div>
                        <h5 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          {lang === 'cs' ? 'Důvěra: Propojení účtů' : 'Trust: Account Linking'}
                          <div className="group relative">
                            <Info size={14} className="text-white/40 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-white/10 text-[10px] font-mono text-white/70 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                              {lang === 'cs' 
                                ? 'Zadejte email a heslo partnera. Pokud s tím souhlasil a údaje jsou správné, získáte sdílený přístup k chatu. Ideální pro otevřené vztahy nebo absolutní důvěru.' 
                                : 'Enter partners email and password. If correct, you gain shared chat access. Ideal for open relationships.'}
                            </div>
                          </div>
                        </h5>
                        <p className="text-[10px] font-mono text-white/50 leading-relaxed max-w-lg mt-1">
                          {lang === 'cs' 
                            ? 'Propojte svůj profil s účtem partnera (vyžaduje jeho heslo). Umožní vám to vidět vzájemné zprávy v rámci absolutní důvěry.' 
                            : 'Link your profile with your partners account. Allows shared visibility of messages.'}
                        </p>
                      </div>
                    </div>

                    {/* List of existing linked accounts */}
                    {linkedAccounts.length > 0 && (
                      <div className="mt-4 space-y-2 relative z-10">
                        {linkedAccounts.map(account => (
                          <div key={account.id} className="p-3 border border-green-500/30 bg-green-900/10 rounded flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <ShieldCheck size={16} className="text-green-500" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-green-400 uppercase tracking-widest">{lang === 'cs' ? 'Účet propojen' : 'Account Linked'}</div>
                                <div className="text-[10px] font-mono text-white/50">{account.email}</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => setLinkedAccounts(prev => prev.filter(a => a.id !== account.id))}
                              className="px-3 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded text-[10px] font-mono uppercase transition-colors"
                            >
                              {lang === 'cs' ? 'Zrušit' : 'Unlink'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new link form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative z-10 p-4 border border-white/5 bg-black/40 rounded-lg">
                      <div className="md:col-span-2">
                        <h6 className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest mb-2">
                          {lang === 'cs' ? '+ Přidat další propojení' : '+ Add another link'}
                        </h6>
                      </div>
                      <div>
                        <input 
                          type="email" 
                          placeholder={lang === 'cs' ? 'E-mail partnera' : 'Partners email'}
                          value={newLinkEmail}
                          onChange={(e) => setNewLinkEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-mafia-gold rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="password" 
                          placeholder={lang === 'cs' ? 'Heslo partnera' : 'Partners password'}
                          value={newLinkPassword}
                          onChange={(e) => setNewLinkPassword(e.target.value)}
                          className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-mafia-gold rounded"
                        />
                        <button 
                          onClick={() => {
                            if (newLinkEmail && newLinkPassword) {
                              setLinkedAccounts(prev => [...prev, { id: Date.now().toString(), email: newLinkEmail }]);
                              setNewLinkEmail('');
                              setNewLinkPassword('');
                            }
                          }}
                          className="px-6 bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/50 hover:bg-mafia-gold hover:text-black transition-colors rounded text-xs font-mono uppercase font-bold whitespace-nowrap"
                        >
                          {lang === 'cs' ? 'Propojit' : 'Link'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h4 className="font-heading font-black text-white uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
                  {lang === 'cs' ? 'Nastavení Upozornění' : 'Notification Settings'}
                </h4>
                <div className="space-y-2">
                  {[
                    { title: { cs: 'Nové Shody (Matches)', en: 'New Matches' }, desc: { cs: 'Upozornění při shodě', en: 'Alert on match' }, state: notifyMatches, set: setNotifyMatches },
                    { title: { cs: 'Nové Zprávy', en: 'New Messages' }, desc: { cs: 'Nepřečtené zprávy v chatu', en: 'Unread chat messages' }, state: notifyMessages, set: setNotifyMessages },
                    { title: { cs: 'Akce a Tipy', en: 'Promos & Tips' }, desc: { cs: 'Tipy pro seznamku', en: 'Dating tips' }, state: notifyPromotions, set: setNotifyPromotions }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-black/60 border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{item.title[lang as 'cs'|'en']}</h5>
                        <p className="text-[10px] font-mono text-white/50">{item.desc[lang as 'cs'|'en']}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={item.state} onChange={(e) => item.set(e.target.checked)} />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mafia-gold"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <h4 className="font-heading font-black text-red-500 uppercase tracking-widest text-sm mb-4 border-b border-red-500/20 pb-2 flex items-center gap-2">
                  <Lock size={16} /> {lang === 'cs' ? 'Nebezpečná zóna' : 'Danger Zone'}
                </h4>

                <div className="space-y-4">
                  {/* Reset */}
                  <div className="p-5 bg-red-950/10 border border-red-900/30 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                      <h5 className="font-bold text-white text-xs mb-1 uppercase tracking-widest">{lang === 'cs' ? 'Restartovat dotazník' : 'Reset Questionnaire'}</h5>
                      <p className="text-white/50 text-[10px] font-mono leading-relaxed max-w-sm">
                        {lang === 'cs' ? 'Vymaže dotazník, ale ponechá fotky a účet. Vhodné pro změnu preferencí.' : 'Clears questionnaire but keeps photos. Good for changing preferences.'}
                      </p>
                    </div>
                    <button onClick={onResetPreferences} className="w-full md:w-auto px-6 py-2.5 border border-white/20 text-white/70 hover:bg-white hover:text-black transition-all font-mono text-[10px] uppercase font-bold flex items-center justify-center gap-2 rounded">
                      <RotateCcw size={14} /> {lang === 'cs' ? 'Restartovat' : 'Reset'}
                    </button>
                  </div>

                  {/* Delete */}
                  <div className="p-5 bg-red-950/30 border border-red-900/50 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                      <h5 className="font-bold text-red-400 text-xs mb-1 uppercase tracking-widest">{lang === 'cs' ? 'Smazat účet ze seznamky' : 'Delete Dating Account'}</h5>
                      <p className="text-red-400/60 text-[10px] font-mono leading-relaxed max-w-sm">
                        {lang === 'cs' ? 'Trvale smaže profil, zprávy a shody. Akci nelze vzít zpět.' : 'Permanently deletes profile, messages and matches. Cannot be undone.'}
                      </p>
                    </div>
                    <button onClick={() => { if (window.confirm(lang === 'cs' ? 'Opravdu smazat účet?' : 'Really delete account?')) onDeleteAccount(); }} className="w-full md:w-auto px-6 py-2.5 bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-mono text-[10px] uppercase font-bold flex items-center justify-center gap-2 rounded">
                      <Trash2 size={14} /> {lang === 'cs' ? 'Smazat účet' : 'Delete'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* WALLET TAB */}
            {activeTab === 'wallet' && (
              <motion.div key="wallet" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div>
                  <h4 className="font-heading font-black text-mafia-gold uppercase tracking-widest text-sm mb-4 border-b border-mafia-gold/20 pb-2 flex items-center gap-2">
                    <Wallet size={18} />
                    {lang === 'cs' ? 'Peněženka a Odměny' : 'Wallet & Rewards'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-mafia-gold/10 border border-mafia-gold/30 rounded-xl p-6 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-3xl font-black text-mafia-gold leading-none">{fragmentsContext?.coins || mmcoins}</span>
                          <span className="text-[10px] font-mono text-mafia-gold/70 uppercase tracking-widest mt-1">Plné MMCOINS</span>
                        </div>
                        <div className="bg-black/50 p-2 rounded text-xs font-mono text-white/50 border border-white/5">
                          {currentFragments} / {fragmentsPerCoin} 🧩
                        </div>
                      </div>
                      
                      {/* Progress Bar pro zlomky */}
                      <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-mafia-gold/50 to-mafia-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                      </div>
                      <div className="text-[9px] text-right text-white/40 mt-1 uppercase tracking-widest font-mono">
                        Do další mince: {fragmentsPerCoin - currentFragments}
                      </div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-black text-blue-400 mb-2">{freeBoosts}</div>
                      <div className="text-xs font-mono text-white/70 uppercase tracking-widest">{lang === 'cs' ? 'Zdarma Zvýraznění' : 'Free Boosts'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Monthly Claim */}
                    <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
                            <Gift size={16} className="text-pink-500" />
                            {lang === 'cs' ? 'Odměna za věrnost' : 'Loyalty Reward'}
                          </h5>
                          <p className="text-xs text-white/50 mt-1">
                            {lang === 'cs' ? 'Získejte MMCOIN každý měsíc zdarma.' : 'Get MMCOIN every month for free.'}
                          </p>
                          {claimStatus && <p className="text-xs text-mafia-gold mt-2 font-mono">{claimStatus}</p>}
                        </div>
                        <button 
                          onClick={claimDaily}
                          className="px-6 py-2 bg-mafia-gold text-black rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                        >
                          {lang === 'cs' ? 'Vyzvednout' : 'Claim'}
                        </button>
                      </div>
                    </div>

                    {/* Referrals */}
                    <div className="p-4 bg-black/60 border border-white/10 rounded-xl">
                      <h5 className="font-bold text-white text-sm uppercase tracking-widest mb-2">
                        {lang === 'cs' ? 'Doporuč a získej odměnu' : 'Refer and Earn'}
                      </h5>
                      <p className="text-xs text-white/50 mb-4">
                        {lang === 'cs' ? 'Přiveďte kamaráda, rodinu nebo páry. Za každého získáte MMCOINy a oni získají MMCOINy a Zvýraznění profilu navíc!' : 'Bring a friend. You both get MMCOINs and they get free profile boosts!'}
                      </p>
                      
                      <div className="mb-4">
                        <label className="text-[10px] font-mono text-white/40 uppercase mb-1 block">
                          {lang === 'cs' ? 'Váš unikátní kód:' : 'Your unique code:'}
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={referralCode || 'Generuje se...'} 
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm w-full outline-none"
                          />
                          <button 
                            onClick={() => { navigator.clipboard.writeText(referralCode); alert('Kód zkopírován!'); }}
                            className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white transition-colors flex items-center justify-center"
                            title="Kopírovat"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <label className="text-[10px] font-mono text-white/40 uppercase mb-1 block">
                          {lang === 'cs' ? 'Zadat kód doporučitele:' : 'Enter referral code:'}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="text" 
                            value={referralInput}
                            onChange={(e) => setReferralInput(e.target.value)}
                            placeholder={lang === 'cs' ? 'Např. KOD123' : 'e.g. CODE123'}
                            className="bg-white/5 border border-white/10 focus:border-mafia-gold rounded-lg px-3 py-2 text-white text-sm w-full outline-none"
                          />
                          <button 
                            onClick={applyReferral}
                            disabled={!referralInput}
                            className="bg-blue-600 disabled:bg-white/10 disabled:text-white/30 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors shrink-0"
                          >
                            {lang === 'cs' ? 'Potvrdit kód' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        </div>
      </div>
    </div>
  );
}
