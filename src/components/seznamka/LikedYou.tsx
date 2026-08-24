import React from "react";
import { Eye, Heart, X, ShieldAlert, Zap, History, Crown, Star } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { ProfileData } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";

interface LikedYouProps {
  currentUser?: ProfileData;
  admirers?: ProfileData[];
  onAccept?: (profile: ProfileData) => void;
  onDecline?: (profile: ProfileData) => void;
}

export function LikedYou({ currentUser, admirers = [], onAccept, onDecline }: LikedYouProps) {
  const { lang } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'admirers' | 'vip' | 'past'>('admirers');
  const [selectedProfile, setSelectedProfile] = React.useState<any | null>(null);
  
  // Rating state
  const [ratingProfile, setRatingProfile] = React.useState<any | null>(null);
  const [ratingType, setRatingType] = React.useState<'positive' | 'negative' | 'traits' | 'critical' | null>(null);
  const [selectedRatings, setSelectedRatings] = React.useState<string[]>([]);

  // State for Past Connections
  const [pastConnections, setPastConnections] = React.useState<any[]>([
    { name: 'Lucie', age: 24, city: 'Praha', time: lang === 'cs' ? 'Dnes' : 'Today', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', bio: 'Knihomolka, milovnice kávy a koček. Hledám někoho na víkendové brunche a hluboké rozhovory.', interests: ['Knihy', 'Káva', 'Umění'], trustScore: 92 },
    { name: 'Adam', age: 29, city: 'Brno', time: lang === 'cs' ? 'Včera' : 'Yesterday', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600', bio: 'Sportovec a podnikatel. Miluju hory a dobré jídlo.', interests: ['Fitness', 'Startup', 'Cestování'], trustScore: 85 },
    { name: 'Klára', age: 26, city: 'Ostrava', time: lang === 'cs' ? 'Před 3 dny' : '3 days ago', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', bio: 'Markeťačka co občas neví, kdy přestat pracovat. Potřebuju někoho, kdo mě vytáhne na pivo.', interests: ['Marketing', 'Víno', 'Koncerty'], trustScore: 68 },
    { name: 'Martin', age: 31, city: 'Plzeň', time: lang === 'cs' ? 'Minulý týden' : 'Last week', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600', bio: 'Hledám někoho na deskovky a chill. Jsem docela klidný typ.', interests: ['Deskovky', 'Netflix', 'Pivo'], trustScore: 98 },
    { name: 'Veronika', age: 22, city: 'Zlín', time: lang === 'cs' ? 'Před 2 týdny' : '2 weeks ago', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', bio: 'Spontánní akce, noční město a dobrá hudba. Pojďme někam vyrazit!', interests: ['Párty', 'Hudba', 'Tanec'], trustScore: 42 }
  ]);

  React.useEffect(() => {
    const handleAdd = (e: any) => {
      const p = e.detail;
      const newConn = {
        name: p.name,
        age: p.age || 25,
        city: p.city || 'Neznámé',
        time: 'Právě teď',
        photo: p.photos?.[0] || '/placeholder-user.jpg',
        bio: p.bio || '',
        interests: p.interests || [],
        trustScore: p.trustScore || 85
      };
      setPastConnections(prev => [newConn, ...prev]);
    };
    window.addEventListener('addPastConnection', handleAdd);
    return () => window.removeEventListener('addPastConnection', handleAdd);
  }, []);

  const ratingOptions = {
    positive: [
      'Sedí s realitou (odpovídá profilu)',
      'Skvělá komunikace',
      'Rychle odepisuje',
      'Přátelský/á a milý/á',
      'Respektující chování',
      'Výborný smysl pro humor',
      'Má skvělé charisma',
      'Přišel/přišla na rande včas',
      'Vypadá lépe než na fotkách',
      'Inteligentní konverzace',
      'Upřímný zájem',
      'Sdílí stejné hodnoty',
      'Velmi zdvořilý/á a pozorný/á',
      'Cítil/a jsem se naprosto bezpečně',
      'Skvělé rande na první pokus'
    ],
    negative: [
      'Vydává se za někoho jiného (Fake)',
      'Neodpovídá fotkám z profilu (Catfishing)',
      'Nemluví pravdu v profilu',
      'Má ženu / partnerku / manžela',
      'Agresivní nebo hrubé chování',
      'Nevhodné sexuální zprávy bez souhlasu',
      'Sexuální narážky hned od první zprávy',
      'Přestal/a komunikovat (Ghosting)',
      'Nepřišel/nepřišla na rande bez omluvy',
      'Zrušil/a rande na poslední chvíli',
      'Neustále si na něco stěžuje',
      'Příliš dotěrný/á / Nerespektuje hranice',
      'Urážky a ponižování',
      'Manipulativní chování',
      'Propagace Instagramu / OnlyFans',
      'Na schůzce pil/a příliš mnoho alkoholu',
      'Pokus o podvod / Žádá o peníze'
    ],
    traits: [
      'Ukecaný/á',
      'Hodný/á',
      'Milý/á',
      'Hlučný/á',
      'Sprostý/á',
      'Arogantní',
      'Zábavný/á',
      'Stydlivý/á'
    ],
    critical: [
      'Sexuální nátlak',
      'Pedofilní chování',
      'Hrubé urážky a agresivita',
      'Nebezpečné chování na schůzce',
      'Fyzické obtěžování',
      'Vydírání / Vyhrožování',
      'Posílání nevyžádaných intimních fotografií',
      'Stalking (nebezpečné pronásledování)'
    ]
  };

  const toggleRating = (option: string) => {
    setSelectedRatings(prev => 
      prev.includes(option) ? prev.filter(r => r !== option) : [...prev, option]
    );
  };

  if (admirers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Eye size={48} className="text-mafia-gold/30 mb-6" />
        <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
          {lang === 'cs' ? 'Zatím tě nikdo nesleduje' : 'No one is watching you yet'}
        </h3>
        <p className="text-smoke-white/50 max-w-md text-sm font-mono uppercase tracking-widest leading-relaxed">
          {lang === 'cs' 
            ? 'Až tě někdo lajkne ze sítě, objeví se ti zde jako tajný ctitel.' 
            : 'When someone likes you from the pond, they will appear here as a secret admirer.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start py-8 w-full">
      {/* Tabs / Categories Switcher */}
      <div className="flex items-center gap-4 overflow-x-auto pt-4 pb-4 mb-8 w-full max-w-3xl px-4 custom-scrollbar justify-start md:justify-center">
        <button
          onClick={() => setActiveTab('admirers')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'admirers'
              ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'admirers' ? 'bg-red-500/20' : 'bg-white/5'}`}>
            <Heart size={24} className={activeTab === 'admirers' ? 'animate-pulse' : ''} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'Nové lajky' : 'New Likes'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vip')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'vip'
              ? 'border-mafia-gold bg-mafia-gold/10 text-mafia-gold shadow-[0_0_15px_rgba(197,160,89,0.3)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'vip' ? 'bg-mafia-gold/20' : 'bg-white/5'}`}>
            <Crown size={24} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'VIP Profily' : 'VIP Profiles'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex-shrink-0 p-4 w-32 h-32 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'past'
              ? 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-105'
              : 'border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <div className={`p-3 rounded-full ${activeTab === 'past' ? 'bg-purple-500/20' : 'bg-white/5'}`}>
            <History size={24} />
          </div>
          <span className="text-xs font-heading font-black uppercase tracking-widest text-center">
            {lang === 'cs' ? 'Dávná spojení' : 'Past Connects'}
          </span>
        </button>
      </div>

      {activeTab === 'admirers' && (
        <>
          <div className="text-center mb-8 flex flex-col items-center">
            <ShieldAlert size={32} className="text-red-500 mb-4 animate-pulse" />
            <h3 className="text-3xl font-heading font-black text-red-500 uppercase tracking-[0.2em] mb-2">
              {lang === 'cs' ? 'Máš ctitele' : 'You have admirers'}
            </h3>
            <p className="text-smoke-white/60 max-w-md text-xs font-mono uppercase tracking-widest leading-relaxed">
              {lang === 'cs' 
                ? 'Tito lidé o tebe projevili zájem. Rozhodni se rychle, než zmizí ze tvého radaru.' 
                : 'These people showed interest in you. Decide quickly before they disappear from your radar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        <AnimatePresence>
          {admirers.map((profile, i) => (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-mafia-gold/30 bg-black/60 group"
            >
              {/* Image Container with slight red tint overlay for secrecy */}
              <div className="w-full h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply z-10 pointer-events-none transition-all group-hover:bg-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
                
                {/* Hacking isSuperLike from a custom property for now since we don't have it in frontend type yet */}
                {(() => {
                  const isSuperLike = (profile as any).isSuperLike === true;
                  const canSee = true; // VIP requirement removed as requested
                  
                  return (
                    <>
                      <img 
                        src={profile.photos?.[0]} 
                        alt={canSee ? profile.name : "Tajný ctitel"} 
                        className={`w-full h-full object-cover transition-all duration-700 ${canSee ? 'group-hover:scale-110' : 'blur-xl scale-110 grayscale brightness-50'}`} 
                      />
                      
                      {isSuperLike && (
                        <div className="absolute top-3 right-3 z-20 bg-blue-500 text-white p-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                          <Heart size={16} fill="currentColor" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-end gap-2">
                          <h4 className="text-2xl font-heading font-black text-white uppercase tracking-widest leading-none drop-shadow-md">
                            {canSee ? profile.name : "????"}
                          </h4>
                          {canSee && (
                            <span className="text-lg font-heading text-mafia-gold font-light leading-none">
                              {profile.age}
                            </span>
                          )}
                        </div>
                        {canSee && profile.city && (
                          <p className="text-white/70 font-mono text-[10px] uppercase tracking-widest mt-1">
                            {profile.city}
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-mafia-gold/20">
                <button
                  onClick={() => onDecline && onDecline(profile)}
                  className="flex-1 py-4 flex items-center justify-center gap-2 border-r border-mafia-gold/20 text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                  <span className="font-heading font-bold text-xs uppercase tracking-widest">
                    {lang === 'cs' ? 'Ignorovat' : 'Ignore'}
                  </span>
                </button>
                {(() => {
                  const hasSub = currentUser?.subscription && currentUser.subscription !== 'none';
                  const coins = currentUser?.mmCoins || 0;
                  const canAfford = hasSub || coins >= 1;
                  
                  let btnStyle = "";
                  let btnText = "";
                  
                  if (hasSub) {
                    btnStyle = "bg-gradient-to-r from-mafia-gold to-yellow-600 text-black shadow-[0_0_20px_rgba(197,160,89,0.5)] hover:scale-[1.02] border-none";
                    btnText = lang === 'cs' ? 'Oplatit Like (VIP ZDARMA)' : 'Like Back (VIP FREE)';
                  } else if (canAfford) {
                    btnStyle = "bg-black/60 border border-mafia-gold text-mafia-gold hover:bg-mafia-gold hover:text-black shadow-[0_0_10px_rgba(197,160,89,0.2)] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)]";
                    btnText = lang === 'cs' ? 'Oplatit Like (-1 MMCOIN)' : 'Like Back (-1 MMCOIN)';
                  } else {
                    btnStyle = "bg-red-900/20 border border-red-500/50 text-red-400 hover:bg-red-900/40";
                    btnText = lang === 'cs' ? 'Koupit MMCOIN (0 zbývá)' : 'Buy MMCOIN (0 left)';
                  }

                  return (
                    <button
                      onClick={() => {
                        if (hasSub) {
                          if (onAccept) onAccept(profile);
                        } else if (canAfford) {
                          const confirmBuy = window.confirm(lang === 'cs' ? 'Oplatit like (Match) stojí 1 MMCOIN. Chcete pokračovat?' : 'Liking back costs 1 MMCOIN. Continue?');
                          if (confirmBuy) {
                            window.dispatchEvent(new CustomEvent('deductCoin', { detail: 1 }));
                            if (onAccept) onAccept(profile);
                          }
                        } else {
                           alert(lang === 'cs' ? 'Nemáš dostatek MMCOINů! Kup si balíček.' : 'Not enough MMCOINs! Buy a package.');
                        }
                      }}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all rounded-lg ${btnStyle}`}
                    >
                      <Heart size={20} className={hasSub ? "fill-black" : ""} />
                      <span className="font-heading font-black text-[10px] uppercase tracking-widest sm:text-xs">
                        {btnText}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </>
      )}

      {activeTab === 'vip' && (
        <div className="flex flex-col items-center justify-center py-10 w-full max-w-3xl px-4">
          <div className="text-center mb-8 flex flex-col items-center">
            <Crown size={32} className="text-mafia-gold mb-4" />
            <h3 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2">
              {lang === 'cs' ? 'Promované Profily' : 'Promoted Profiles'}
            </h3>
            <p className="text-smoke-white/60 max-w-md text-xs font-mono uppercase tracking-widest leading-relaxed">
              {lang === 'cs' 
                ? 'Lidé, kteří chtějí být vidět a jsou připraveni vyrazit. Nepropásni ty nejzajímavější úlovky.' 
                : 'People who want to be seen and are ready to go out. Do not miss the best catches.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* VIP Placeholder Card 1 */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-mafia-gold bg-black/80 group">
              <div className="absolute top-0 right-0 p-1 bg-mafia-gold text-black z-20 rounded-bl-xl shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest px-2">{lang === 'cs' ? 'Všimni si nás!' : 'Notice us!'}</span>
              </div>
              <div className="w-full h-64 relative">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="VIP" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest">Ema, 25</h4>
                  <p className="text-white/80 font-mono text-[10px] flex items-center gap-1 mt-1 leading-tight"><Star size={12} className="text-mafia-gold shrink-0" /> {lang === 'cs' ? 'Doporučeno algoritmem (shoda v hodnotách a plánech)' : 'Recommended by algorithm (match in values and plans)'}</p>
                </div>
              </div>
            </div>

            {/* VIP Placeholder Card 2 */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-mafia-gold/50 bg-black/80 group">
              <div className="absolute top-0 right-0 p-1 bg-mafia-gold/80 text-black z-20 rounded-bl-xl shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest px-2">{lang === 'cs' ? 'Všimni si nás!' : 'Notice us!'}</span>
              </div>
              <div className="w-full h-64 relative">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="VIP" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h4 className="text-2xl font-heading font-black text-white uppercase tracking-widest">Tomáš, 31</h4>
                  <p className="text-white/80 font-mono text-[10px] flex items-center gap-1 mt-1 leading-tight"><Star size={12} className="text-mafia-gold/50 shrink-0" /> {lang === 'cs' ? 'Doporučeno algoritmem (velmi podobný vkus)' : 'Recommended by algorithm (very similar taste)'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'past' && (
        <div className="flex flex-col items-center justify-center py-10 w-full max-w-3xl px-4">
          <div className="text-center mb-8 flex flex-col items-center">
            <History size={32} className="text-purple-500 mb-4" />
            <h3 className="text-3xl font-heading font-black text-purple-500 uppercase tracking-[0.2em] mb-2">
              {lang === 'cs' ? 'Dávná spojení' : 'Past Connections'}
            </h3>
            <p className="text-smoke-white/60 max-w-md text-xs font-mono uppercase tracking-widest leading-relaxed">
              {lang === 'cs' 
                ? 'Tady najdeš lidi, se kterými jsi měl/a v minulosti match nebo nějaké propojení.' 
                : 'Here you will find people you matched or connected with in the past.'}
            </p>
          </div>

          <div className="flex flex-col w-full gap-4">
            {pastConnections.map((profile, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedProfile({ ...profile, source: 'past' })}
                className="flex items-center gap-4 bg-black/60 p-4 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition-colors">
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-black text-white text-lg uppercase tracking-wider group-hover:text-purple-400 transition-colors">{profile.name}</h4>
                  <p className="text-xs text-white/50 font-mono">{profile.city} • Spojení: {profile.time}</p>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setRatingProfile(profile);
                    setRatingType(null);
                    setSelectedRatings([]);
                  }}
                  className="p-3 bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500 hover:text-black hover:scale-110 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)] flex items-center justify-center gap-2 group/btn"
                >
                  <Star size={18} className="group-hover/btn:fill-black" />
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                    {lang === 'cs' ? 'Ohodnotit' : 'Rate'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Profile Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProfile(null)}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-black border border-purple-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(168,85,247,0.2)]"
            >
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white transition-all backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              
              <div className="w-full h-72 relative">
                <img src={selectedProfile.photo} alt={selectedProfile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-3xl font-heading font-black text-white uppercase tracking-widest leading-none">
                    {selectedProfile.name}, <span className="text-purple-400">{selectedProfile.age}</span>
                  </h3>
                  <p className="text-white/70 font-mono text-xs uppercase mt-1">{selectedProfile.city}</p>
                </div>
              </div>
              
              <div className="p-6">
                {/* Trust Score Badge */}
                <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className={`p-2 rounded-full ${
                    selectedProfile.trustScore >= 80 ? 'bg-green-500/20 text-green-500' :
                    selectedProfile.trustScore >= 50 ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{lang === 'cs' ? 'Míra Důvěry (Skóre)' : 'Trust Score'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            selectedProfile.trustScore >= 80 ? 'bg-green-500' :
                            selectedProfile.trustScore >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedProfile.trustScore}%` }}
                        />
                      </div>
                      <span className={`font-heading font-black text-xs ${
                        selectedProfile.trustScore >= 80 ? 'text-green-500' :
                        selectedProfile.trustScore >= 50 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>{selectedProfile.trustScore}%</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-heading font-black text-purple-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">
                  {lang === 'cs' ? 'Spis (O mně)' : 'Dossier (About)'}
                </h4>
                <p className="text-white/70 font-mono text-sm leading-relaxed mb-6">
                  {selectedProfile.bio}
                </p>
                
                <h4 className="text-xs font-heading font-black text-purple-400 uppercase tracking-widest mb-3">
                  {lang === 'cs' ? 'Zájmy' : 'Interests'}
                </h4>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProfile.interests && selectedProfile.interests.map((interest: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/60">
                      {interest}
                    </span>
                  ))}
                </div>
                
                {selectedProfile.source !== 'past' ? (
                  <button 
                    onClick={() => {
                      alert(lang === 'cs' ? 'Připravuje se sekce zpráv.' : 'Messages section coming soon.');
                      setSelectedProfile(null);
                    }}
                    className="w-full py-4 bg-purple-500 text-black font-heading font-black uppercase tracking-[0.1em] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all rounded-xl"
                  >
                    {lang === 'cs' ? 'Napsat Zprávu' : 'Send Message'}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-white/5 border border-white/10 text-white/30 font-heading font-black uppercase tracking-[0.1em] text-center rounded-xl cursor-not-allowed">
                    {lang === 'cs' ? 'Chat Není Povolen' : 'Chat Disabled'}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Rating Modal */}
      <AnimatePresence>
        {ratingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-black border border-purple-500/30 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(168,85,247,0.2)] max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/80 sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Star size={24} className="text-mafia-gold" />
                    {lang === 'cs' ? `Hodnocení: ${ratingProfile.name}` : `Rating: ${ratingProfile.name}`}
                  </h3>
                  <p className="text-white/50 text-xs font-mono mt-1">
                    {lang === 'cs' ? 'Tvoje hodnocení je anonymní a pomáhá ostatním.' : 'Your rating is anonymous and helps others.'}
                  </p>
                </div>
                <button 
                  onClick={() => setRatingProfile(null)}
                  className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Rating Type Selection */}
                <div className="flex gap-2 mb-8">
                  <button 
                    onClick={() => { setRatingType('positive'); setSelectedRatings([]); }}
                    className={`flex-1 py-2 px-1 rounded-xl border font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all ${
                      ratingType === 'positive' 
                        ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'cs' ? 'Kladné' : 'Positive'}
                  </button>

                  <button 
                    onClick={() => { setRatingType('traits'); setSelectedRatings([]); }}
                    className={`flex-1 py-2 px-1 rounded-xl border font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all ${
                      ratingType === 'traits' 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'cs' ? 'Vlastnosti' : 'Traits'}
                  </button>

                  <button 
                    onClick={() => { setRatingType('negative'); setSelectedRatings([]); }}
                    className={`flex-1 py-2 px-1 rounded-xl border font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all ${
                      ratingType === 'negative' 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'cs' ? 'Záporné' : 'Negative'}
                  </button>

                  <button 
                    onClick={() => { setRatingType('critical'); setSelectedRatings([]); }}
                    className={`flex-1 py-2 px-1 rounded-xl border font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all ${
                      ratingType === 'critical' 
                        ? 'bg-red-600/20 border-red-600 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                        : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {lang === 'cs' ? 'Kritické' : 'Critical'}
                  </button>
                </div>

                {/* Rating Options */}
                {ratingType && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-heading font-black text-white/80 uppercase tracking-widest mb-4">
                      {lang === 'cs' ? 'Vyberte odpovídající tvrzení:' : 'Select applicable statements:'}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {ratingOptions[ratingType].map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleRating(option)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                            selectedRatings.includes(option)
                              ? ratingType === 'positive' ? 'bg-green-500/20 border-green-500 text-green-400'
                              : ratingType === 'traits' ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                              : ratingType === 'critical' ? 'bg-red-600/20 border-red-600 text-red-500'
                              : 'bg-orange-500/20 border-orange-500 text-orange-400'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-mono text-sm">{option}</span>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedRatings.includes(option)
                              ? ratingType === 'positive' ? 'border-green-500 bg-green-500'
                              : ratingType === 'traits' ? 'border-blue-500 bg-blue-500'
                              : ratingType === 'critical' ? 'border-red-600 bg-red-600'
                              : 'border-orange-500 bg-orange-500'
                              : 'border-white/30'
                          }`}>
                            {selectedRatings.includes(option) && <X size={14} className="text-black rotate-45" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/80 sticky bottom-0">
                <button 
                  disabled={!ratingType || selectedRatings.length === 0}
                  onClick={() => {
                    alert(lang === 'cs' ? 'Hodnocení odesláno! Děkujeme za feedback.' : 'Rating submitted! Thank you for the feedback.');
                    setRatingProfile(null);
                  }}
                  className={`w-full py-4 font-heading font-black uppercase tracking-[0.1em] transition-all rounded-xl ${
                    ratingType && selectedRatings.length > 0
                      ? ratingType === 'positive' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-white'
                      : ratingType === 'traits' ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-white'
                      : ratingType === 'critical' ? 'bg-red-600 text-black shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:bg-white'
                      : 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-white'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {lang === 'cs' ? 'Odeslat hodnocení' : 'Submit Rating'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
