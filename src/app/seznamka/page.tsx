"use client";

import { ChevronLeft, ShieldCheck, ChevronDown, Share2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Footer } from "@/components/Footer";
import { LinkedAccountsSettings } from "@/components/seznamka/LinkedAccountsSettings";
import { useTranslation } from "@/hooks/useTranslation";
import dynamic from "next/dynamic";
import { ProfileData } from "@/components/seznamka/ProfileCard";

const Auth = dynamic(() => import("@/components/seznamka/Auth").then(mod => mod.Auth), { ssr: false });
const ProfileSetup = dynamic(() => import("@/components/seznamka/ProfileSetup").then(mod => mod.ProfileSetup), { ssr: false });
const Pond = dynamic(() => import("@/components/seznamka/Pond").then(mod => mod.Pond), { ssr: false });
const Matches = dynamic(() => import("@/components/seznamka/Matches").then(mod => mod.Matches), { ssr: false });
const LikedYou = dynamic(() => import("@/components/seznamka/LikedYou").then(mod => mod.LikedYou), { ssr: false });
const OnboardingGuide = dynamic(() => import("@/components/seznamka/OnboardingGuide").then(mod => mod.OnboardingGuide), { ssr: false });
const AdminDashboard = dynamic(() => import("@/components/seznamka/AdminDashboard").then(mod => mod.AdminDashboard), { ssr: false });
const SearchPeople = dynamic(() => import("@/components/seznamka/SearchPeople").then(mod => mod.SearchPeople), { ssr: false });
const UserSettings = dynamic(() => import("@/components/seznamka/UserSettings").then(mod => mod.UserSettings), { ssr: false });


export default function SeznamkaPage() {
  const { data: session, status } = useSession();
  const { lang } = useTranslation();
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [currentView, setCurrentView] = useState<"lov" | "ctitele" | "zpravy" | "profil" | "admin" | "hledat" | "nastaveni">("lov");
  const [matches, setMatches] = useState<ProfileData[]>([
    {
      userId: "mock-1",
      name: "Ema",
      age: "25",
      city: "Praha",
      matchId: "mock-ema",
      photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"],
      lastOnline: "právě teď",
    },
    {
      userId: "mock-2",
      name: "Tomáš",
      age: "31",
      city: "Brno",
      matchId: "mock-tomas",
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"],
    }
  ] as ProfileData[]);
  const [admirers, setAdmirers] = useState<ProfileData[]>([
    {
      name: "Sofie",
      age: "23",
      locations: [{ city: "Praha", radiusKm: 20 }, { city: "Liberec", radiusKm: 50 }],
      locationPrivacy: "any",
      height: "172",
      photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=600"],
      gender: "female",
      seeking: "male",
      smoking: "no",
      drinking: "sometimes",
      interests: "Káva, Knihy, Umění",
      bio: "Mám ráda lidi, co vědí, co chtějí.",
      isComplicated: false,
      redFlag: "slow",
      loveLanguage: "touch",
      lastOnline: "právě teď",
      replyRate: "high",
      icebreaker: "Jaké je tvoje nejoblíbenější místo v Praze?",
    },
    {
      name: "David",
      age: "35",
      locations: [{ city: "Brno", radiusKm: 100 }],
      locationPrivacy: "incognito",
      height: "188",
      photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"],
      gender: "male",
      seeking: "female",
      smoking: "yes",
      drinking: "yes",
      interests: "Motorky, Whisky, Kulečník",
      bio: "Rychlý život, žádné kompromisy.",
      isComplicated: true,
      linkedin: "https://linkedin.com/in/david-invest",
      twitter: "davidspeed_brno",
      intelligence: "Prostorová",
      mindset: "Realista",
      temperament: "Cholerik",
      redFlag: "crazy",
      loveLanguage: "gifts",
      lastOnline: "před hodinou",
      replyRate: "low",
      icebreaker: "Pizza s ananasem: Ano, nebo Zločin?",
      pets: [
        { id: '3', type: 'dog', breed: 'Stafordšírský bulteriér', name: 'Killer', purpose: 'walk' }
      ]
    }
  ]);
  const [isLegalExpanded, setIsLegalExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [salonId, setSalonId] = useState<string | null>(null);
  const [isEmbed, setIsEmbed] = useState<boolean>(false);

  // Check login status on mount
  useEffect(() => {
    setIsClient(true);
    
    if (!localStorage.getItem("seznamka_guide_seen")) {
      setShowGuide(true);
    }

    // Franchise Setup
    const searchParams = new URLSearchParams(window.location.search);
    const sId = searchParams.get('salon');
    const embed = searchParams.get('embed');
    
    if (sId) {
       setSalonId(sId);
       localStorage.setItem("seznamka_salon_id", sId);
    } else {
       const savedSalon = localStorage.getItem("seznamka_salon_id");
       if (savedSalon) setSalonId(savedSalon);
    }
    
    if (embed === 'true') {
       setIsEmbed(true);
    }
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    if (session) {
      fetch('/api/profiles/me')
        .then(res => {
          if (res.ok) return res.json();
          return null;
        })
        .then(data => {
          if (data && !data.error) {
            setUserProfile(data);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  // Fetch matches from API when switching to Inbox
  useEffect(() => {
    if (session && currentView === 'zpravy') {
      fetch('/api/matches')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setMatches(data);
          }
        })
        .catch(console.error);
    }
  }, [currentView, session]);

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-mafia-black text-smoke-white overflow-x-hidden flex flex-col">
      <AnimatePresence>
        {showGuide && (
          <OnboardingGuide onClose={() => {
            setShowGuide(false);
            localStorage.setItem("seznamka_guide_seen", "true");
          }} />
        )}
      </AnimatePresence>
      
      {/* Header */}
      {!isEmbed && (
        <header className="sticky top-0 z-[150] bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between">
            <button
              onClick={() => { window.location.href = "/"; }}
              className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[160]"
            >
              <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
                <ChevronLeft size={20} />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold hidden md:inline-block">
                {lang === "cs" ? "ZPĚT DO SALONU" : "BACK TO SALON"}
              </span>
            </button>

            {/* Share Button (Center) */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + "/seznamka");
                setShowShareToast(true);
                setTimeout(() => setShowShareToast(false), 3000);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-mafia-gold/30 rounded-full hover:bg-mafia-gold/10 hover:border-mafia-gold transition-colors text-mafia-gold group"
              title={lang === 'cs' ? 'Zkopírovat odkaz na Síť' : 'Copy Network Link'}
            >
              {showShareToast ? <Check size={16} className="text-green-500" /> : <Share2 size={16} className="group-hover:scale-110 transition-transform" />}
              <span className="text-[10px] font-mono uppercase tracking-widest hidden sm:inline-block">
                {showShareToast 
                  ? (lang === 'cs' ? 'Zkopírováno' : 'Copied') 
                  : (lang === 'cs' ? 'Pozvat známé' : 'Invite friends')}
              </span>
            </button>
            <button 
              onClick={() => setShowGuide(true)}
              className="group flex items-center gap-4 text-mafia-gold hover:text-white transition-all duration-500 relative z-[160]"
              title={lang === 'cs' ? 'Otevřít průvodce' : 'Open Guide'}
            >
              <span className="font-mono text-xs uppercase tracking-[0.4em] font-bold hidden md:inline-block">
                {lang === 'cs' ? 'PRŮVODCE' : 'GUIDE'}
              </span>
              <div className="w-12 h-12 rounded-full border border-mafia-gold/20 flex items-center justify-center group-hover:border-mafia-gold group-hover:bg-mafia-gold group-hover:text-black transition-all duration-500">
                <ShieldCheck size={20} />
              </div>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[1600px] mx-auto">
          {status === 'loading' ? (
            <div className="text-center text-mafia-gold font-mono uppercase tracking-[0.2em]">Načítání identity...</div>
          ) : !session ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-4">
                  {lang === 'cs' ? "SÍŤ" : "THE NETWORK"} {salonId && <span className="text-2xl text-white/50 lowercase tracking-widest ml-2">x {salonId}</span>}
                </h1>
                <p className="text-smoke-white/60 font-sans text-sm md:text-base max-w-xl mx-auto italic mb-8">
                  {lang === 'cs' 
                    ? "Najdi lidi, se kterými si rozumíš — ať už hledáš partnera, kamarády, partu, spolky nebo parťáka pro svého mazlíčka."
                    : "Find people you vibe with — whether you're looking for a partner, friends, a group, clubs, or a buddy for your pet."}
                </p>
                <button 
                  onClick={() => setShowGuide(true)}
                  className="px-6 py-2 bg-mafia-gold/10 border border-mafia-gold/50 text-mafia-gold text-xs font-mono uppercase tracking-widest hover:bg-mafia-gold hover:text-black transition-colors rounded-full"
                >
                  {lang === 'cs' ? 'Jak to funguje?' : 'How does it work?'}
                </button>
              </div>
              {!showGuide && (
                <Auth onLoginSuccess={() => { /* Page will re-render from session change */ }} />
              )}
            </motion.div>
          ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full max-w-[1600px] mx-auto py-12 px-4 md:px-8 bg-mafia-dark/60 border border-mafia-gold/30 shadow-[0_0_40px_rgba(197,160,89,0.15)] backdrop-blur-xl">
               <h2 className="text-3xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-8">
                 {lang === 'cs' ? 'Vítejte, ' : 'Welcome, '}{session.user?.name}!
               </h2>
               
               {/* Sub Navigation */}
               {userProfile && (
                 <div className="flex justify-center gap-2 md:gap-4 mb-8 border-b border-white/10 pb-4">
                   <button 
                     onClick={() => setCurrentView("lov")}
                     className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "lov" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Matchmaker' : 'Matchmaker'}
                   </button>
                   <button 
                     onClick={() => setCurrentView("ctitele")}
                     className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "ctitele" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Ctitelé' : 'Admirers'}
                     {admirers.length > 0 && (
                       <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-black text-[9px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
                         {admirers.length}
                       </span>
                     )}
                   </button>
                   <button 
                     onClick={() => setCurrentView("zpravy")}
                     className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "zpravy" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Zprávy' : 'Inbox'}
                   </button>
                   <button 
                     onClick={() => setCurrentView("profil")}
                     className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "profil" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Profil' : 'Profile'}
                   </button>
                   <button 
                     onClick={() => setCurrentView("hledat")}
                     className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "hledat" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Hledat lidi' : 'Search People'}
                   </button>
                   <button 
                     onClick={() => setCurrentView("nastaveni")}
                     className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "nastaveni" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                   >
                     {lang === 'cs' ? 'Nastavení' : 'Settings'}
                   </button>
                   {(session.user?.name === 'Admin' || session.user?.name?.startsWith('Partner_')) && (
                     <button 
                       onClick={() => setCurrentView("admin")}
                       className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${currentView === "admin" ? "text-mafia-gold border-b border-mafia-gold" : "text-white/50 hover:text-white"}`}
                     >
                       Admin
                     </button>
                   )}
                 </div>
               )}

               <div className="mb-12">
                  {currentView === "admin" ? (
                    <AdminDashboard 
                      currentUser={{ ...session?.user, partnerSalonId: session?.user?.name?.startsWith('Partner_') ? session.user.name.split('_')[1] : null }}
                      allProfiles={[...admirers, ...matches]} 
                      onDeleteProfile={(name) => {
                        setAdmirers(prev => prev.filter(p => p.name !== name));
                        setMatches(prev => prev.filter(p => p.name !== name));
                      }}
                      onUpdateProfile={(updatedProfile) => {
                        setAdmirers(prev => prev.map(p => p.name === updatedProfile.name ? updatedProfile : p));
                        setMatches(prev => prev.map(p => p.name === updatedProfile.name ? updatedProfile : p));
                      }}
                      onClose={() => setCurrentView("lov")}
                      lang={lang}
                    />
                  ) : !userProfile || currentView === "profil" ? (
                    <div className="space-y-8">
                      <ProfileSetup 
                        initialData={userProfile}
                        onFinish={(data) => {
                          if (salonId) data.originSalonId = salonId;
                          setUserProfile(data);
                          setCurrentView("lov");
                        }}
                        onDeleteAccount={() => {
                          setUserProfile(null);
                          setCurrentView("lov");
                        }}
                        onReset={() => {
                          setUserProfile(null);
                        }}
                      />
                    </div>
                  ) : currentView === "nastaveni" ? (
                    <div className="py-4 w-full space-y-12">
                      <UserSettings 
                        userProfile={userProfile}
                        onUpdateProfile={(data) => setUserProfile(data)}
                        onResetPreferences={() => {
                          setUserProfile(null);
                          setCurrentView("profil");
                        }}
                        onDeleteAccount={() => {
                          setUserProfile(null);
                          setCurrentView("lov");
                        }}
                      />
                      <div className="w-full h-px bg-white/10" />
                      <LinkedAccountsSettings />
                    </div>
                  ) : currentView === "lov" ? (
                   <div className="h-[900px]">
                     <Pond 
                       currentUser={userProfile} 
                       onEditProfile={() => setCurrentView("profil")}
                       onMatch={(profile) => {
                         if (!matches.some(m => m.name === profile.name)) {
                           setMatches(prev => [...prev, profile]);
                         }
                       }}
                       onGoToMessages={() => setCurrentView("zpravy")}
                     />
                   </div>
                 ) : currentView === "hledat" ? (
                   <div className="py-4 w-full">
                     <SearchPeople />
                   </div>
                 ) : currentView === "zpravy" ? (
                   <Matches matches={matches} />
                 ) : (
                   <LikedYou 
                      currentUser={userProfile}
                      admirers={admirers} 
                      onAccept={(profile) => {
                        setAdmirers(prev => prev.filter(p => p.name !== profile.name));
                        if (!matches.some(m => m.name === profile.name)) {
                          setMatches(prev => [...prev, profile]);
                        }
                      }}
                      onDecline={(profile) => {
                        setAdmirers(prev => prev.filter(p => p.name !== profile.name));
                      }}
                    />
                 )}
               </div>

               <button 
                 onClick={() => {
                   localStorage.removeItem("seznamka_token");
                   localStorage.removeItem("seznamka_user");
                   setUserProfile(null);
                   setCurrentView("lov");
                   signOut({ redirect: false });
                 }}
                 className="px-6 py-2 border border-mafia-gold/40 text-xs font-mono text-mafia-gold hover:bg-mafia-gold hover:text-black uppercase tracking-widest transition-colors"
               >
                 {lang === 'cs' ? 'Odhlásit se' : 'Log out'}
               </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Legal Section */}
      <section className="py-12 px-4 md:px-12 border-t border-white/5 bg-black/20 mt-auto relative z-10">
        <div className="max-w-[1600px] mx-auto">
          <motion.div className="border border-mafia-gold/20 bg-mafia-dark/40 overflow-hidden">
            <button onClick={() => setIsLegalExpanded(!isLegalExpanded)}
              className="w-full p-6 flex items-center justify-between group transition-colors hover:bg-mafia-gold/5">
              <div className="flex items-center gap-4">
                <div className={`p-2 border transition-all duration-500 ${isLegalExpanded ? "border-mafia-gold bg-mafia-gold/10" : "border-white/10 text-white/20"}`}>
                  <ShieldCheck size={20} className={isLegalExpanded ? "text-mafia-gold" : ""} />
                </div>
                <div className="text-left">
                  <h4 className={`text-sm font-heading font-black uppercase tracking-[0.3em] transition-colors ${isLegalExpanded ? "text-mafia-gold" : "text-smoke-white/40 group-hover:text-smoke-white/60"}`}>
                    {lang === "cs" ? "PRÁVNÍ PROTOKOL & OCHRANA SOUKROMÍ" : "LEGAL PROTOCOL & PRIVACY"}
                  </h4>
                  <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest mt-1">
                    {isLegalExpanded ? "Access Granted // Full Disclosure" : "Click to decrypt legal documentation"}
                  </p>
                </div>
              </div>
              <motion.div animate={{ rotate: isLegalExpanded ? 180 : 0 }} className="text-mafia-gold/30 group-hover:text-mafia-gold transition-colors">
                <ChevronDown size={24} />
              </motion.div>
            </button>
            <AnimatePresence>
              {isLegalExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}>
                  <div className="p-8 md:p-12 border-t border-white/5 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                      
                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">{lang === 'cs' ? 'PODMÍNKY A ZŘEKNUTÍ SE ODPOVĚDNOSTI' : 'TERMS & DISCLAIMER'}</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? '1. Dobrovolnost a Riziko' : '1. Voluntary & Risk'}</span>
                            {lang === 'cs' 
                              ? 'Registrací dáváte jasně najevo, že aplikaci využíváte zcela dobrovolně. Provozovatel nenese absolutně žádnou odpovědnost za újmy, škody, či jakákoliv rizika spojená se schůzkami s lidmi z této aplikace. Jste dospělí, buďte opatrní.' 
                              : 'By registering, you acknowledge voluntary participation. The operator bears absolutely no liability for any harm, damages, or risks associated with meeting people from this app.'}
                          </div>
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? '2. Citlivé Údaje a Útoky' : '2. Sensitive Data & Breaches'}</span>
                            {lang === 'cs' 
                              ? 'Do aplikace nevkládejte žádné citlivé údaje, které by vás mohly poškodit. V případě kybernetického útoku či úniku dat nenese provozovatel žádnou zodpovědnost. Buďte na to připraveni a chraňte své soukromí.' 
                              : 'Do not upload sensitive data that could harm you. In the event of a cyber attack or data breach, the operator bears no responsibility. Be prepared and protect your privacy.'}
                          </div>
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? '3. Dobré úmysly' : '3. Good Intentions'}</span>
                            {lang === 'cs' 
                              ? 'Tato platforma slouží výhradně k dobrým účelům – propojování lidí, zvířat a sdílení věcí v komunitě. Jakékoliv nezákonné jednání bude smazáno.' 
                              : 'This platform serves entirely good purposes – connecting people, animals, and sharing things. Any illegal activity will be deleted.'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-mafia-gold font-heading font-black text-[10px] uppercase tracking-[0.3em]">{lang === 'cs' ? 'GDPR & OCHRANA SOUKROMÍ' : 'GDPR & PRIVACY'}</h4>
                        <div className="space-y-4 text-[10px] font-mono uppercase tracking-wider leading-relaxed text-smoke-white/60">
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? 'Nesbírání a Neprodej dat' : 'No Data Mining or Selling'}</span>
                            {lang === 'cs' 
                              ? 'Provozovatel aplikaci nijak nesleduje, nesbírá o vás skrytá data, data NIKDY neprodává a ani to nemá v úmyslu. Data slouží pouze pro Matchmaking.' 
                              : 'The operator does not track you, collect hidden data, NEVER sells data, and has no intention to do so. Data is solely for Matchmaking.'}
                          </div>
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? 'Autorská Práva (Duševní Vlastnictví)' : 'Intellectual Property'}</span>
                            {lang === 'cs' 
                              ? 'Celý koncept Loviště, Matchmaking algoritmus a design jsou výhradním duševním vlastnictvím autora MMBarber. Kopírování je zakázáno.' 
                              : 'The entire concept, Matchmaking algorithm, and design are the exclusive intellectual property of MMBarber. Copying is prohibited.'}
                          </div>
                          <div><span className="text-mafia-gold/80 block mb-1">{lang === 'cs' ? 'Právo na výmaz' : 'Right to Erasure'}</span>
                            {lang === 'cs' 
                              ? 'Kdykoliv můžete svůj profil jedním kliknutím v Nastavení kompletně smazat z databáze.' 
                              : 'You can completely delete your profile from the database at any time with one click.'}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {!isEmbed && <Footer />}
    </main>
  );
}
