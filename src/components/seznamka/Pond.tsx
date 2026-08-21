"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from "framer-motion";

import { ProfileCard, ProfileData } from "./ProfileCard";
import { FishingGame } from "./FishingGame";
import { DiscoveryHub, SearchFilters, CATEGORIES } from "./DiscoveryHub";
import { BarberAdCard } from "./BarberAdCard";
import { useTranslation } from "@/hooks/useTranslation";
import { calculateCompatibility, generateMatchReport } from "./MatchAlgorithm";
import { Heart, X, Skull, User, Users, Flag, MessageCircleHeart, Bookmark, ShieldCheck, Crosshair, Crown, Fish, Layers, DollarSign, Dumbbell, Wine, Filter, Search, Sparkles, Calendar, TrendingUp, MapPin } from "lucide-react";
import { OnboardingGuide } from "./OnboardingGuide";
import { MatchVoucherCard, VoucherData } from "./MatchVoucherCard";

interface PondProps {
  currentUser: ProfileData;
  onEditProfile?: () => void;
  onMatch?: (profile: ProfileData) => void;
  onGoToMessages?: () => void;

}

export function Pond({ currentUser, onEditProfile, onMatch, onGoToMessages, }: PondProps) {
  const { lang } = useTranslation();
  const [allProfiles, setAllProfiles] = useState<ProfileData[]>([]);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);
  const [currentVoucher, setCurrentVoucher] = useState<VoucherData | null>(null);

  useEffect(() => {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Vložíme reklamu na 3. pozici (index 2)
          const adProfile: ProfileData = {
            id: 'ad-1',
            name: 'BARBER_AD_NATIVE',
            age: '', gender: 'other', seeking: [], city: '', height: '', smoking: 'no', drinking: 'no', interests: '', bio: '', photos: [], salonVerified: false
          };
          // 1. Not the current user or linked accounts
          // 2. Current user is seeking their gender
          // 3. They are seeking current user's gender
          let counterpartProfiles = data.filter(p => {
            if (p.id === currentUser?.id || p.name === currentUser?.name) return false;

            // Exclude linked accounts (check by both ID and Name to support mock profiles)
            if (currentUser?.linkedUserIds?.includes(p.id!) || currentUser?.linkedUserIds?.includes(p.name)) return false;
            if (p.linkedUserIds?.includes(currentUser?.id!) || p.linkedUserIds?.includes(currentUser?.name)) return false;

            // If user hasn't set preferences, just show opposite gender as a fallback
            const myGender = currentUser?.gender || 'male';
            const mySeeking = currentUser?.seeking && currentUser.seeking.length > 0 ? currentUser.seeking : (myGender === 'male' ? ['female'] : ['male']);

            const theirGender = p.gender || 'female';
            const theirSeeking = p.seeking && p.seeking.length > 0 ? p.seeking : (theirGender === 'male' ? ['female'] : ['male']);

            const iAmSeekingThem = mySeeking.includes(theirGender) || mySeeking.includes('all');
            const theyAreSeekingMe = theirSeeking.includes(myGender) || theirSeeking.includes('all');

            return iAmSeekingThem && theyAreSeekingMe;
          });


          // INJECT MOCK PROFILES FOR TESTING UI
          const uiMocks = [
            {
              id: 'mock-b1', name: 'Adam', age: '34', city: 'Praha', gender: 'male', seeking: ['business'],
              workLifeBalance: 'Hustle kultura (Kariéra na 1. místě)', moneyDetailed: { myAttitude: 'Utrácím za luxus' },
              intelligence: 'Analytická', mindset: 'Realista', bio: 'Hledám spolehlivého partnera pro nový startup.',
              photos: [
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600'
              ]
            },
            {
              id: 'mock-b2', name: 'Klára', age: '29', city: 'Brno', gender: 'female', seeking: ['business'],
              workLifeBalance: 'Vyvážený', moneyDetailed: { myAttitude: 'Investuji do zážitků' },
              intelligence: 'Praktická', mindset: 'Vizionář', bio: 'Marketingová specialistka, hledám co-foundera.',
              photos: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-r1', name: 'Tomáš', age: '22', city: 'Olomouc', gender: 'male', seeking: ['bydleni'],
              smoking: 'no', pets: [{ id: '1', type: 'Pes', breed: 'Mops', name: 'Alík', purpose: 'walk' }],
              temperament: 'Sova', bio: 'Hledám klidného spolubydlu. Jsem noční sova, přes den spím.',
              photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-r2', name: 'Petra', age: '25', city: 'Praha', gender: 'female', seeking: ['bydleni'],
              smoking: 'yes', pets: [], temperament: 'Ranní ptáče', bio: 'Čistotná, hledám nekuřácký byt s výhledem.',
              photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-f1', name: 'Martin', age: '27', city: 'Plzeň', gender: 'male', seeking: ['kamarad'],
              myTags: ['Fotbal', 'Hospoda', 'Deskovky'], socialBattery: 'Extrovert', spontaneityLevel: 'Plánovač',
              bio: 'Zahrajeme FIFU nebo zajdem na pivo?', photos: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-f2', name: 'Lucie', age: '24', city: 'Brno', gender: 'female', seeking: ['kamarad'],
              myTags: ['Knihy', 'Kavárny', 'Kočky'], socialBattery: 'Introvert', spontaneityLevel: 'Něco mezi',
              bio: 'Nechci vztah, jen někoho na kafe a pokec o knížkách.', photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-s1', name: 'Lukáš', age: '26', city: 'Ostrava', gender: 'male', seeking: ['kratkodoby'],
              spontaneityLevel: 'Spontánní', nsfwCategories: ['fwb', 'open_relationship'], bio: 'Život je krátký, pojďme si ho užít.',
              photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-s2', name: 'Nikola', age: '23', city: 'Praha', gender: 'female', seeking: ['kratkodoby'], accountType: 'individual',
              spontaneityLevel: 'Spontánní', nsfwCategories: ['fwb'], bio: 'Hledám parťáka na víkendové párty.',
              photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-couple1', name: 'Petr a Jana', age: '30', city: 'Brno', accountType: 'couple', seeking: ['kamarad'],
              bio: 'Jsme pár a hledáme další páry na deskovky a výlety.',
              photos: ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-family1', name: 'Novákovi', city: 'Ostrava', accountType: 'family', seeking: ['kamarad'],
              bio: 'Rodinka s dvěma dětmi (3 a 5 let). Hledáme podobné rodiny na společné víkendy.',
              photos: ['https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-group1', name: 'Brněnští Volejbalisti', city: 'Brno', accountType: 'group', seeking: ['kamarad'],
              bio: 'Amatérský tým, nabíráme nové hráče na čtvrteční večery.',
              photos: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-pet1', name: 'Max', age: '3', city: 'Praha', accountType: 'pet',
              bio: 'Zlatý retrívr. Miluje aportování a hledá psí kámoše na procházky v Riegrových sadech.',
              photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-property1', name: 'Zahrádkářská kolonie Mír', city: 'Olomouc', accountType: 'property',
              bio: 'Komunita vášnivých zahrádkářů. Pořádáme občasné grilovačky a výměnu sazenic.',
              photos: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-object1', name: 'Volkswagen Transporter T5', city: 'Plzeň', accountType: 'object',
              bio: 'Nabízím půjčení dodávky na stěhování. Cena dohodou.',
              photos: ['https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-activity1', name: 'Výšlap na Sněžku', city: 'Pec pod Sněžkou', accountType: 'activity',
              bio: 'Plánujeme jít na východ slunce 15. srpna. Kdo se přidá?',
              photos: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600']
            },
            {
              id: 'mock-job1', name: 'Hledám Instalatéra', city: 'Praha', accountType: 'job',
              bio: 'Potřebuji opravit kapající kohoutek v koupelně, spěchá.',
              photos: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600']
            }
          ] as unknown as ProfileData[];

          counterpartProfiles = [...uiMocks, ...counterpartProfiles];
          // END MOCKS

          // Fallback: If strict filtering returns no one, show everyone except the current user
          if (counterpartProfiles.length === 0) {
            counterpartProfiles = data.filter(p => p.id !== currentUser?.id && p.name !== currentUser?.name);
          }

          setAllProfiles(counterpartProfiles);
          setProfiles(counterpartProfiles);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load profiles:', err);
        setLoading(false);
      });

    // Fetch active vouchers
    fetch('/api/seznamka/vouchers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setVouchers(data);
        }
      })
      .catch(err => console.error('Failed to load vouchers:', err));
  }, []);
  const [matches, setMatches] = useState<ProfileData[]>([]);
  const [hoveredButton, setHoveredButton] = useState<"left" | "right" | "super" | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "superlike" | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [localMmCoins, setLocalMmCoins] = useState<number>(currentUser?.mmCoins || 0);
  const [hasSubscription, setHasSubscription] = useState<boolean>(currentUser?.subscription && currentUser.subscription !== 'none' ? true : false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);
  const [distanceModalVisible, setDistanceModalVisible] = useState<boolean>(false);
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Default 50 km

  // Custom match modal state
  const [matchedProfile, setMatchedProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (matchedProfile && vouchers.length > 0) {
      // Pick a random voucher
      const randomIndex = Math.floor(Math.random() * vouchers.length);
      setCurrentVoucher(vouchers[randomIndex]);
    } else if (!matchedProfile) {
      setCurrentVoucher(null);
    }
  }, [matchedProfile, vouchers]);

  // Reporting state

  const [reportingProfile, setReportingProfile] = useState<ProfileData | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const [viewMode, setViewMode] = useState<"swipe" | "fishing">("swipe");
  const [matchStrategy, setMatchStrategy] = useState<string>(currentUser?.matchStrategy || "magnet");
  const [showStrategyMenu, setShowStrategyMenu] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ category: null, subCategories: [] });
  const [localOnly, setLocalOnly] = useState(false);

  useEffect(() => {
    let filtered = [...allProfiles];

    // Filter by Discovery Hub subCategories
    if (searchFilters.subCategories.length > 0) {
      filtered = filtered.filter(p => {
        if (p.id === 'ad-1') return true;
        const profileCategories = p.categories || [];
        return searchFilters.subCategories.some(filterCat => profileCategories.includes(filterCat));
      });
    }

    // Filter by Account Type
    if (accountFilter !== 'all') {
      filtered = filtered.filter(p => p.id === 'ad-1' || p.accountType === accountFilter);
    }

    setProfiles(filtered);
    setResetKey(prev => prev + 1);
  }, [searchFilters, accountFilter, allProfiles]);

  const [resetKey, setResetKey] = useState(0);
  const isSwiping = React.useRef(false);

  // Dragging logic for the top card
  const x = useMotionValue(0);
  const y = useMotionValue(0); // Added for vertical swipe (save for later)
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Color overlays for swipe feedback
  const nopeOpacity = useTransform(x, [-200, -50], [1, 0]);
  const likeOpacity = useTransform(x, [50, 200], [0, 1]);

  // Effect to tilt the card when hovering manual buttons
  useEffect(() => {
    if (isSwiping.current) return;
    if (hoveredButton === "left") {
      animate(x, -40, { type: "spring", stiffness: 300, damping: 20 });
    } else if (hoveredButton === "right") {
      animate(x, 40, { type: "spring", stiffness: 300, damping: 20 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  }, [hoveredButton, x]);

  // Effect to filter profiles based on strategy
  useEffect(() => {
    let filtered = [...allProfiles];

    if (searchFilters.subCategories && searchFilters.subCategories.length > 0) {
      // Find the tags corresponding to the selected subCategories
      const tagsToSearch: string[] = [];
      for (const cat of CATEGORIES) {
        for (const sub of cat.subOptions) {
          if (searchFilters.subCategories.includes(sub.id)) {
            tagsToSearch.push(sub.tag);
          }
        }
      }

      if (tagsToSearch.length > 0) {
        filtered = filtered.filter(p => {
          // If a profile matches ANY of the selected tags in categories or interests, keep it.
          const profileCategories = p.categories || [];
          const profileInterestsStr = p.interests || "";

          return tagsToSearch.some(tag =>
            profileCategories.includes(tag) ||
            profileInterestsStr.includes(tag)
          );
        });
      }
    }

    // Remove already matched/reported
    filtered = filtered.filter(p => !matches.some(m => m.name === p.name));
    setProfiles(filtered);
    setResetKey(prev => prev + 1);
    x.set(0);
    y.set(0);
    isSwiping.current = false;
  }, [searchFilters, matches]);

  const handleSortBySimilarity = () => {
    if (!currentUser) return;

    const sorted = [...profiles].sort((a, b) => {
      const aMatch = calculateCompatibility(currentUser, a, getStrategyForProfile(a));
      const bMatch = calculateCompatibility(currentUser, b, getStrategyForProfile(b));
      // handle both number and object return types just in case
      const scoreA = typeof aMatch === 'number' ? aMatch : (aMatch as any)?.overall || 0;
      const scoreB = typeof bMatch === 'number' ? bMatch : (bMatch as any)?.overall || 0;
      return scoreB - scoreA; // highest first
    });

    setProfiles(sorted);
    setResetKey(prev => prev + 1);
  };

  const handleStartAlgorithm = () => {
    if (!currentUser) return;

    // Deduct coin for paid algorithms
    if (matchStrategy !== 'random' && !hasSubscription) {
      if (localMmCoins < 1) {
        setShowCoinModal(true);
        return;
      }
      setLocalMmCoins(prev => prev - 1);
    }

    setLoading(true);

    setTimeout(() => {
      const sorted = [...profiles].sort((a, b) => {
        const aMatch = calculateCompatibility(currentUser, a, matchStrategy);
        const bMatch = calculateCompatibility(currentUser, b, matchStrategy);
        const scoreA = typeof aMatch === 'number' ? aMatch : (aMatch as any)?.overall || 0;
        const scoreB = typeof bMatch === 'number' ? bMatch : (bMatch as any)?.overall || 0;
        return scoreB - scoreA; // highest first
      });

      setProfiles(sorted);
      setResetKey(prev => prev + 1);
      x.set(0);
      y.set(0);
      setLoading(false);
    }, 600);
  };

  const handleStrategyChange = (strategy: string) => {
    setMatchStrategy(strategy);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handleSwipe("right");
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe("left");
    }
  };

  const handleSwipe = async (direction: "left" | "right" | "up" | "superlike") => {
    if (isSwiping.current) return;
    const swipedProfile = profiles[0];
    if (!swipedProfile) return;

    isSwiping.current = true;
    setHoveredButton(null);

    // Animate the card flying off the screen smoothly
    if (direction === "up") {
      await animate(y, -window.innerHeight, { duration: 0.3, ease: "easeOut" });
      console.log("Saved for later:", swipedProfile.name);
      if (swipedProfile.id) {
        fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'pass', targetUserId: swipedProfile.id })
        }).catch(console.error);
      }
    } else if (direction === "superlike") {
      await Promise.all([
        animate(y, -window.innerHeight, { duration: 0.4, ease: "easeIn" }),
        animate(x, 0, { duration: 0.1 }), // keep centered
      ]);
      console.log("Super liked:", swipedProfile.name);
    } else {
      const targetX = direction === "right" ? window.innerWidth / 2 + 200 : -(window.innerWidth / 2 + 200);
      await animate(x, targetX, { duration: 0.3, ease: "easeOut" });
    }

    if (direction === "right") {
      console.log("Liked:", swipedProfile.name);
      if (swipedProfile.id) {
        fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'like', targetUserId: swipedProfile.id })
        }).then(res => res.json()).then(data => {
          if (data.isMatch) {
            setMatchedProfile(swipedProfile);
            if (onMatch) onMatch(swipedProfile);
          }
        }).catch(console.error);
      } else if (swipedProfile.name === "Klára" || swipedProfile.name === "Elena") {
        setMatchedProfile(swipedProfile);
        if (onMatch) onMatch(swipedProfile);
      }
      setTimeout(() => setMatchedProfile(swipedProfile), 400);
    } else {
      console.log("Passed:", swipedProfile.name);
    }

    // Remove the card from the stack
    setProfiles(prev => prev.filter(p => p.name !== swipedProfile.name));
    x.set(0); // Reset position for the next card instantly
    y.set(0);
    isSwiping.current = false;
  };

  const handleFishingAction = (direction: "left" | "right" | "up" | "superlike", profile: ProfileData) => {
    if (direction === "right") {
      if (profile.name === "Elena" || Math.random() > 0.7) {
        if (onMatch) onMatch(profile);
        setTimeout(() => setMatchedProfile(profile), 400);
      }
    }
    setProfiles(prev => prev.filter(p => p.name !== profile.name));
  };


  const getStrategyForProfile = (p: ProfileData) => {
    const seekingArray = Array.isArray(p.seeking) ? p.seeking : (p.seeking ? [p.seeking] : []);
    if (seekingArray.includes('business')) return 'business';
    if (seekingArray.includes('bydleni')) return 'bydleni';
    if (seekingArray.includes('kamarad') || seekingArray.includes('spoluzak')) return 'kamarad';
    if (seekingArray.includes('kratkodoby')) return 'kratkodoby';
    if (seekingArray.includes('vazny_vztah')) return 'vazny_vztah';
    return matchStrategy || 'closest';
  };

  const matchScoresMap = React.useMemo(() => {
    const map = new Map();
    if (!currentUser) return map;
    profiles.forEach(p => {
      map.set(p.name, calculateCompatibility(currentUser, p, getStrategyForProfile(p)));
    });
    return map;
  }, [currentUser, profiles, matchStrategy]);

  const matchReportsMap = React.useMemo(() => {
    const map = new Map();
    if (!currentUser) return map;
    profiles.forEach(p => {
      map.set(p.name, generateMatchReport(currentUser, p, lang, matchStrategy));
    });
    return map;
  }, [currentUser, profiles, lang, matchStrategy]);

  const getRecommendedVouchers = (userProfile: ProfileData, targetProfile: ProfileData, allVouchers: VoucherData[]) => {
    if (!allVouchers || allVouchers.length === 0) return [];

    const keywords = [
      ...(userProfile.interests || '').split(','),
      ...(targetProfile.interests || '').split(','),
      userProfile.firstDate,
      targetProfile.firstDate,
      ...(targetProfile.categories || []),
      ...(userProfile.categories || [])
    ].map(k => k?.trim().toLowerCase()).filter(Boolean);

    const scoredVouchers = allVouchers.map(v => {
      let score = 0;
      const textToSearch = (v.title + ' ' + v.description + ' ' + v.company.name).toLowerCase();

      keywords.forEach(kw => {
        if (kw && textToSearch.includes(kw)) score += 2;
      });

      // Pseudo-random stable score based on profile name and voucher ID for variety
      const stableSeed = (targetProfile.name.charCodeAt(0) || 0) + (v.id.charCodeAt(0) || 0);
      score += (stableSeed % 100) / 100;

      return { voucher: v, score };
    });

    scoredVouchers.sort((a, b) => {
      if (Math.abs(b.score - a.score) > 0.01) return b.score - a.score;
      return a.voucher.id.localeCompare(b.voucher.id);
    });
    return scoredVouchers.slice(0, 3).map(sv => sv.voucher);
  };

  return (
    <div className="w-full flex flex-col items-center py-4 px-4 h-full">
      <div className="w-full max-w-sm md:max-w-7xl flex flex-col xl:flex-row justify-center items-center mb-6 gap-4 xl:gap-0">

        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main View Modes Toggle */}
          <div className="flex bg-black/60 rounded-full border border-white/10 p-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setViewMode("swipe")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-heading font-black tracking-widest text-xs uppercase ${viewMode === 'swipe' ? 'bg-mafia-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-105' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={lang === 'cs' ? 'Klasický výběr' : 'Classic swipe'}
            >
              <Layers size={18} />
              <span className="hidden md:inline">{lang === 'cs' ? 'Karty' : 'Cards'}</span>
            </button>
            <button
              onClick={() => setViewMode("fishing")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-heading font-black tracking-widest text-xs uppercase ${viewMode === 'fishing' ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title={lang === 'cs' ? 'Rybářská minihra' : 'Fishing minigame'}
            >
              <Fish size={18} />
              <span className="hidden md:inline">{lang === 'cs' ? 'Lov' : 'Fish'}</span>
            </button>
          </div>

          {/* Account Type Filter Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-2 px-5 py-2.5 bg-black/60 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 font-heading font-black tracking-widest text-xs uppercase text-white hover:border-white/30 hover:bg-white/10"
              title={lang === 'cs' ? 'Filtr typů účtu' : 'Account type filter'}
            >
              <Users size={18} className="text-white/70" />
              <span className="hidden md:inline">{
                accountFilter === 'all' ? (lang === 'cs' ? 'Vše' : 'All') :
                  accountFilter === 'individual' ? (lang === 'cs' ? 'Jednotlivci' : 'Individuals') :
                    accountFilter === 'couple' ? (lang === 'cs' ? 'Páry' : 'Couples') :
                      accountFilter === 'group' ? (lang === 'cs' ? 'Skupiny' : 'Groups') :
                        accountFilter === 'family' ? (lang === 'cs' ? 'Rodiny' : 'Families') :
                          accountFilter === 'pet' ? (lang === 'cs' ? 'Zvířata' : 'Pets') :
                            accountFilter === 'property' ? (lang === 'cs' ? 'Místa' : 'Properties') : (lang === 'cs' ? 'Vše' : 'All')
              }</span>
            </button>

            <AnimatePresence>
              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-black/95 border border-white/20 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 backdrop-blur-md"
                >
                  {[
                    { id: 'all', icon: '🌎', label: lang === 'cs' ? 'Vše' : 'All' },
                    { id: 'individual', icon: '👤', label: lang === 'cs' ? 'Jednotlivci' : 'Individuals' },
                    { id: 'couple', icon: '💑', label: lang === 'cs' ? 'Páry' : 'Couples' },
                    { id: 'group', icon: '👥', label: lang === 'cs' ? 'Skupiny' : 'Groups' },
                    { id: 'family', icon: '👨‍👩‍👧‍👦', label: lang === 'cs' ? 'Rodiny' : 'Families' },
                    { id: 'pet', icon: '🐾', label: lang === 'cs' ? 'Zvířata' : 'Pets' },
                    { id: 'property', icon: '🏠', label: lang === 'cs' ? 'Místa' : 'Properties' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setAccountFilter(type.id);
                        setShowAccountMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-xs font-mono uppercase tracking-widest ${accountFilter === type.id
                          ? 'bg-white/20 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Match Strategies Pill */}
          <div className="flex items-center bg-black/60 rounded-full border border-white/10 p-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            {[
              { id: 'random', icon: '🎲', label: 'Random', free: true },
              { id: 'magnet', icon: '🧲', label: lang === 'cs' ? 'Rozdílné' : 'Opposites', free: false },
              { id: 'mirror', icon: '🪞', label: lang === 'cs' ? 'Stejné' : 'Mirrors', free: false },
              ...((currentUser?.seeking?.includes('partner') || currentUser?.seeking?.includes('all')) ? [{ id: 'zodiac', icon: '♈', label: lang === 'cs' ? 'Znamení' : 'Zodiac', free: false }] : []),
              { id: 'closest', icon: '✨', label: lang === 'cs' ? 'Nejbližší' : 'Closest', free: false }
            ].map(strat => {
              const isLocked = !strat.free && localMmCoins <= 0 && !hasSubscription;
              return (
                <button
                  key={strat.id}
                  onClick={() => {
                    if (isLocked) {
                      setShowCoinModal(true);
                    } else {
                      setMatchStrategy(strat.id);
                    }
                  }}
                  className={`p-2 px-3 lg:px-4 rounded-full transition-all duration-300 font-heading tracking-widest text-[10px] uppercase flex items-center gap-1.5 ${matchStrategy === strat.id
                      ? 'bg-mafia-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-105'
                      : isLocked ? 'text-white/30 hover:bg-white/5 cursor-pointer' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  title={isLocked ? 'Zamčeno - Vyžaduje MMCOIN' : strat.label}
                >
                  <span className="text-base flex items-center gap-1">{strat.icon} {isLocked && <span className="text-[8px] opacity-70">🔒</span>}</span>
                  <span className="hidden xl:inline">{strat.label}</span>
                </button>
              );
            })}

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={() => setDistanceModalVisible(true)}
              className="p-2 px-3 rounded-full transition-all duration-300 hover:bg-white/5 text-white/50 hover:text-white flex items-center gap-1.5"
              title={lang === 'cs' ? 'Nastavit vzdálenost' : 'Set distance'}
            >
              <MapPin size={16} />
              <span className="text-[10px] font-mono">{maxDistance} km</span>
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={handleStartAlgorithm}
              className="p-2 px-4 rounded-full transition-all duration-300 font-heading font-black tracking-widest text-[10px] uppercase flex items-center gap-1.5 text-mafia-gold hover:bg-mafia-gold hover:text-black hover:shadow-[0_0_15px_rgba(197,160,89,0.5)]"
              title={lang === 'cs' ? 'Spustit vyhledávání' : 'Start search'}
            >
              <span className="text-base">🚀</span>
              <span className="hidden lg:inline">START</span>
            </button>
          </div>

          {/* MMCOIN Balance Pill */}
          <button
            onClick={() => setShowCoinModal(true)}
            className="flex items-center gap-3 bg-black/80 rounded-full border border-mafia-gold p-3 px-6 backdrop-blur-md shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:bg-mafia-gold/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.6)] transition-all scale-105"
            title={lang === 'cs' ? 'Koupit MMCOIN' : 'Buy MMCOIN'}
          >
            <span className="text-mafia-gold font-black font-heading tracking-widest text-sm md:text-base uppercase">
              {localMmCoins}
            </span>
            <span className="text-white/90 font-mono tracking-widest text-[10px] md:text-xs uppercase font-bold">MMCOIN</span>
          </button>

          {/* Tools & Filters Pill */}
          <div className="flex items-center bg-black/60 rounded-full border border-white/10 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setShowFilters(true)}
              className={`p-3 rounded-full transition-all duration-300 ${searchFilters.subCategories && searchFilters.subCategories.length > 0
                  ? 'bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/50'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              title={lang === 'cs' ? 'Discovery Hub (Kategorie)' : 'Discovery Hub (Categories)'}
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => {
                setShowPromoteModal(true);
              }}
              className={`p-3 rounded-full transition-all duration-300 ${isPromoted
                  ? 'bg-mafia-gold/20 text-mafia-gold border border-mafia-gold/50'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              title={lang === 'cs' ? 'Promovat profil (1 MMCOIN)' : 'Promote profile (1 MMCOIN)'}
            >
              <TrendingUp size={20} />
            </button>
            <div className="w-px h-8 bg-white/10 mx-1" />

            <Link
              href="/seznamka/akce"
              className="p-3 rounded-full transition-all duration-300 text-white/50 hover:text-mafia-gold hover:bg-mafia-gold/10"
              title={lang === 'cs' ? 'Kam vyrazit (Akce)' : 'Where to go (Events)'}
            >
              <Calendar size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Discovery Hub Modal */}
      <AnimatePresence>
        {showFilters && (
          <DiscoveryHub
            currentFilters={searchFilters}
            onApplyFilters={(filters) => {
              setSearchFilters(filters);
              setShowFilters(false);
              setViewMode("swipe");
            }}
            onClose={() => setShowFilters(false)}
            availableProfiles={allProfiles}
          />
        )}
      </AnimatePresence>

      {!showFilters && (
        <>
          {viewMode === "fishing" ? (
            <div className="w-full max-w-sm md:max-w-7xl mx-auto h-[600px] md:h-[700px] border border-mafia-gold/20 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(197,160,89,0.15)]">
              <FishingGame
                profiles={profiles}
                lang={lang}
                onAction={handleFishingAction}
                activeBait={searchFilters.subCategories && searchFilters.subCategories.length > 0 ? searchFilters.subCategories[0] : null}
              />
            </div>
          ) : (
            <>

              <div className="flex flex-col items-center w-full max-w-sm md:max-w-7xl mx-auto">
                <div className="relative w-full h-[600px] md:h-[700px] flex-shrink-0">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-mafia-gold font-mono uppercase tracking-widest animate-pulse z-0">
                      Načítání profilů...
                    </div>
                  ) : profiles.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 font-mono text-sm uppercase tracking-widest text-center px-4 z-0">
                      <Fish size={48} className="text-mafia-gold/20 mb-4" />
                      <p className="mb-2">Rybníček je prázdný.</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {profiles.map((profile, index) => {
                        const isTop = index === 0;
                        const matchScore = matchScoresMap.get(profile.name);
                        const matchReport = matchReportsMap.get(profile.name);
                        return (
                          <motion.div
                            key={`${profile.name}-${resetKey}`}
                            className="absolute inset-0"
                            style={{
                              zIndex: profiles.length - index,
                              x: isTop ? x : 0,
                              y: isTop ? y : 0,
                              rotate: isTop ? rotate : 0,
                              opacity: isTop ? opacity : (index === 1 ? 1 : 0),
                              scale: 1,
                            }}
                            drag={isTop ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={isTop ? handleDragEnd : undefined}
                            whileDrag={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            {profile.name === 'BARBER_AD_NATIVE' ? (
                              <div className="w-full h-full">
                                <BarberAdCard />
                              </div>
                            ) : (
                              <ProfileCard
                                profile={profile}
                                onReport={isTop ? setReportingProfile : undefined}
                                onBookmark={isTop ? () => handleSwipe("up") : undefined}
                                onLike={isTop ? () => handleSwipe("right") : undefined}
                                onNope={isTop ? () => handleSwipe("left") : undefined}
                                matchScores={matchScore}
                                matchReport={matchReport}
                                currentStrategy={matchStrategy}
                                onStrategyChange={handleStrategyChange}
                                currentUserProfile={currentUser}
                                suggestedVouchers={getRecommendedVouchers(currentUser, profile, vouchers.length > 0 ? vouchers : [
                                  {
                                    id: "demo-coffee",
                                    title: "20% sleva na výběrovou kávu",
                                    description: "Ideální pro nenáročné první rande. Skvělá káva a klidné prostředí.",
                                    discount: "20%",
                                    code: "KAFE20",
                                    company: { name: "Kavárna u Zrna", logoUrl: null }
                                  },
                                  {
                                    id: "demo-action",
                                    title: "1+1 Vstupenka na motokáry",
                                    description: "Hledáte akci a adrenalin? Ukažte, kdo je rychlejší na trati!",
                                    discount: "1+1 ZDARMA",
                                    code: "RACE11",
                                    company: { name: "Prague Karting", logoUrl: null }
                                  },
                                  {
                                    id: "demo-wine",
                                    title: "Degustační prkénko k vínu",
                                    description: "Romantika u skleničky vína se sýrovým prkénkem zdarma.",
                                    discount: "ZDARMA",
                                    code: "VINO24",
                                    company: { name: "Vinárna pod Věží", logoUrl: null }
                                  }
                                ])}
                              />
                            )}

                            {isTop && (
                              <>
                                <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 z-50 pointer-events-none">
                                  <div className="border-4 border-red-500 text-red-500 font-heading font-black text-4xl uppercase p-2 rotate-12 bg-black/50">
                                    {lang === 'cs' ? 'Utopit' : 'Nope'}
                                  </div>
                                </motion.div>
                                <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 z-50 pointer-events-none">
                                  <div className="border-4 border-mafia-gold text-mafia-gold font-heading font-black text-4xl uppercase p-2 -rotate-12 bg-black/50">
                                    {lang === 'cs' ? 'Ulovit' : 'Match'}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* REPORT SUCCESS MODAL */}
                <AnimatePresence>
                  {showReportSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="max-w-md w-full bg-mafia-dark border border-red-900/30 p-12 rounded-sm shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col items-center relative overflow-hidden"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                          className="absolute inset-0 bg-red-600 pointer-events-none mix-blend-screen"
                        />

                        <motion.div
                          initial={{ scale: 3, opacity: 0, rotate: 45 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="w-24 h-24 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] relative"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ delay: 0.4, duration: 0.2 }}
                          >
                            <Crosshair size={48} strokeWidth={1.5} />
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.5, 2], opacity: [0, 1, 0] }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="absolute inset-0 border-2 border-red-500 rounded-full"
                          />
                        </motion.div>

                        <h3 className="text-2xl font-heading font-black text-red-500 uppercase tracking-widest mb-4">
                          {lang === 'cs' ? 'Zpráva odeslána rodině' : 'Message sent to the family'}
                        </h3>
                        <p className="text-smoke-white/60 font-mono text-sm leading-relaxed mb-10">
                          {lang === 'cs'
                            ? 'Profil jsme vzali na radar a důkladně ho prošetříme. Už ho neuvidíš.'
                            : 'We\'ve put this profile on our radar. You won\'t see it again.'}
                        </p>
                        <button
                          onClick={() => {
                            setShowReportSuccess(false);
                            setProfiles(prev => prev.filter(p => p.name !== reportingProfile?.name));
                            x.set(0);
                            y.set(0);
                          }}
                          className="px-8 py-3 bg-black border border-red-500/50 text-red-500 font-heading font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] mt-4"
                        >
                          {lang === 'cs' ? 'Zpět do sítě' : 'Back to network'}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Onboarding Guide */}
                {showGuide && <OnboardingGuide onClose={() => setShowGuide(false)} />}

                {/* Manual Buttons */}
                {/* Manual Buttons */}
                {!showFilters && profiles.length > 0 && (
                  <div className="flex gap-4 md:gap-6 mt-8 z-10 justify-center items-center w-full pb-8">
                    <button
                      onMouseEnter={() => setHoveredButton("left")}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => handleSwipe("left")}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black hover:scale-110 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] group cursor-pointer z-50 pointer-events-auto"
                    >
                      <X size={28} className="relative z-10" />
                    </button>

                    <button
                      onMouseEnter={() => setHoveredButton("super")}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => handleSwipe("superlike")}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border border-cyan-400/50 text-cyan-400 flex items-center justify-center hover:bg-cyan-400 hover:text-black hover:scale-110 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] group mb-4 cursor-pointer z-50 pointer-events-auto"
                      title={lang === 'cs' ? 'VIP Respekt (Super Like)' : 'VIP Respect (Super Like)'}
                    >
                      <Crown size={22} className="relative z-10" />
                    </button>

                    <button
                      onMouseEnter={() => setHoveredButton("right")}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => handleSwipe("right")}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-black border flex items-center justify-center transition-all group cursor-pointer z-50 pointer-events-auto hover:scale-110 ${profiles[0]?.accountType === 'property'
                          ? 'border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-black shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                          : 'border-mafia-gold/50 text-mafia-gold hover:bg-mafia-gold hover:text-black shadow-[0_0_20px_rgba(197,160,89,0.2)]'
                        }`}
                      title={profiles[0]?.accountType === 'property' ? (lang === 'cs' ? 'Požádat o vstup' : 'Request to Join') : ''}
                    >
                      {profiles[0]?.accountType === 'property' ? <Users size={28} className="relative z-10" /> : <Heart size={28} className="relative z-10" />}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CUSTOM MATCH MODAL */}
          <AnimatePresence>
            {matchedProfile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4"
              >
                <motion.div
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="flex flex-col items-center text-center max-w-sm"
                >
                  <h2 className="text-4xl md:text-5xl font-heading font-black text-mafia-gold uppercase tracking-[0.2em] mb-2 shadow-mafia-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]">
                    {matchedProfile.accountType === 'property' ? (lang === 'cs' ? 'Žádost odeslána!' : 'Request Sent!') : (lang === 'cs' ? 'Máš Match!' : "It's a Match!")}
                  </h2>
                  <p className="text-white/60 font-mono text-sm uppercase tracking-widest mb-8">
                    {matchedProfile.accountType === 'property' ? (lang === 'cs' ? `Požádal jsi o vstup do komunity ${matchedProfile.name}.` : `You requested to join ${matchedProfile.name}.`) : (lang === 'cs' ? `Ty a ${matchedProfile.name} jste si padli do oka.` : `You and ${matchedProfile.name} have liked each other.`)}
                  </p>

                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-mafia-gold overflow-hidden mb-10 shadow-[0_0_30px_rgba(197,160,89,0.4)]">
                    <Image
                      src={matchedProfile.photos[0] || '/placeholder.jpg'}
                      alt={matchedProfile.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 160px, 192px"
                    />
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    <button
                      onClick={() => {
                        setMatchedProfile(null);
                        if (onGoToMessages) onGoToMessages();
                      }}
                      className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-[0.2em] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <MessageCircleHeart size={20} />
                      {lang === 'cs' ? 'Napsat zprávu' : 'Send message'}
                    </button>
                    <button
                      onClick={() => setMatchedProfile(null)}
                      className="w-full py-4 border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-all duration-300"
                    >
                      {lang === 'cs' ? 'Pokračovat v lovu' : 'Keep hunting'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REPORT MODAL */}
          <AnimatePresence>
            {reportingProfile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-black border border-red-500/30 w-full max-w-md p-6 rounded-sm shadow-[0_0_40px_rgba(239,68,68,0.15)]"
                >
                  <h3 className="text-xl font-heading font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Flag size={20} />
                    {lang === 'cs' ? 'Nahlásit profil' : 'Report profile'}
                  </h3>
                  <p className="text-white/50 text-xs font-mono mb-6">
                    {lang === 'cs'
                      ? `Anonymně nahlašuješ profil: ${reportingProfile.name}. Co je špatně?`
                      : `Anonymously reporting: ${reportingProfile.name}. What's wrong?`}
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'fake', label: lang === 'cs' ? 'Falešný profil / Fotky' : 'Fake profile / photos' },
                      { id: 'inappropriate', label: lang === 'cs' ? 'Nevhodný obsah' : 'Inappropriate content' },
                      { id: 'spam', label: lang === 'cs' ? 'Spam / Podvod' : 'Spam / Scam' },
                      { id: 'other', label: lang === 'cs' ? 'Jiné (Napsat vlastní)' : 'Other (Custom)' }
                    ].map(reason => (
                      <button
                        key={reason.id}
                        onClick={() => setReportReason(reason.id)}
                        className={`w-full p-3 text-left border transition-all text-sm font-mono uppercase tracking-widest ${reportReason === reason.id
                            ? 'border-red-500 bg-red-900/20 text-red-400'
                            : 'border-white/10 hover:border-white/30 text-white/60 hover:text-white bg-black/40'
                          }`}
                      >
                        {reason.label}
                      </button>
                    ))}
                  </div>

                  {reportReason === 'other' && (
                    <div className="mb-6">
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder={lang === 'cs' ? 'Napiš nám víc detailů...' : 'Give us more details...'}
                        className="w-full bg-black/40 border border-white/10 py-3 px-4 text-white focus:outline-none focus:border-red-500 transition-colors font-sans text-sm resize-none h-24"
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setReportingProfile(null);
                        setReportReason("");
                        setCustomReason("");
                      }}
                      className="flex-1 py-3 border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-all"
                    >
                      {lang === 'cs' ? 'Zrušit' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => {
                        if (!reportReason) {
                          alert(lang === 'cs' ? "Vyber prosím důvod." : "Please select a reason.");
                          return;
                        }
                        console.log("Report submitted:", { profile: reportingProfile.name, reason: reportReason, custom: customReason });
                        setShowReportSuccess(true);
                        setReportingProfile(null);
                        setReportReason("");
                        setCustomReason("");
                      }}
                      className="flex-1 py-3 bg-red-500 text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                    >
                      {lang === 'cs' ? 'Odeslat hlášení' : 'Submit report'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            <CoinPurchaseModal
              isOpen={showCoinModal}
              onClose={() => setShowCoinModal(false)}
              lang={lang}
              onBuyCoins={(amt) => setLocalMmCoins(prev => prev + amt)}
              onSubscribe={(plan) => setHasSubscription(true)}
            />
          </AnimatePresence>
          <AnimatePresence>
            {showPromoteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="max-w-md w-full bg-mafia-dark border border-mafia-gold/50 p-8 rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.15)] flex flex-col items-center relative overflow-hidden"
                >
                  <div className="w-20 h-20 rounded-full border border-mafia-gold/50 flex items-center justify-center text-mafia-gold mb-6 bg-mafia-gold/10">
                    <TrendingUp size={36} />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest mb-4">
                    {isPromoted
                      ? (lang === 'cs' ? 'Profil je promovaný' : 'Profile Promoted')
                      : (lang === 'cs' ? 'Promovat profil' : 'Promote Profile')}
                  </h3>
                  <p className="text-smoke-white/80 font-mono text-sm leading-relaxed mb-8">
                    {isPromoted
                      ? (lang === 'cs' ? 'Tvůj profil je úspěšně promovaný v sekci Ctitelé VIP na 7 dní!' : 'Your profile is successfully promoted in the VIP Admirers section for 7 days!')
                      : (lang === 'cs' ? 'Chceš promovat svůj profil na 7 dní v sekci Ctitelé VIP profil?' : 'Do you want to promote your profile for 7 days in the VIP Admirers section?')}
                  </p>

                  {!isPromoted && (
                    <div className="flex items-center gap-2 mb-8 bg-black/50 px-6 py-3 rounded-full border border-mafia-gold/30">
                      <span className="text-mafia-gold font-bold">Cena:</span>
                      <span className="text-white font-mono font-bold tracking-widest text-lg">1 MMCOIN</span>
                    </div>
                  )}

                  <div className="flex gap-4 w-full">
                    {isPromoted ? (
                      <button
                        onClick={() => setShowPromoteModal(false)}
                        className="flex-1 py-3 bg-mafia-gold text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-white transition-all rounded-lg"
                      >
                        {lang === 'cs' ? 'Zavřít' : 'Close'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowPromoteModal(false)}
                          className="flex-1 py-3 border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-all rounded-lg"
                        >
                          {lang === 'cs' ? 'Zrušit' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => {
                            if (localMmCoins >= 1) {
                              setLocalMmCoins(prev => prev - 1);
                              setIsPromoted(true);
                            } else {
                              setShowPromoteModal(false);
                              setShowCoinModal(true);
                            }
                          }}
                          className="flex-1 py-3 bg-mafia-gold text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all rounded-lg"
                        >
                          {lang === 'cs' ? 'Promovat' : 'Promote'}
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Distance Modal */}
          <AnimatePresence>
            {distanceModalVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setDistanceModalVisible(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={e => e.stopPropagation()}
                  className="w-full max-w-sm bg-black border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-mafia-gold/20 flex items-center justify-center text-mafia-gold mb-4">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-xl font-heading font-black text-white uppercase tracking-widest mb-2">
                    {lang === 'cs' ? 'Vzdálenost' : 'Distance'}
                  </h3>
                  <p className="text-xs text-white/50 font-mono mb-8">
                    {lang === 'cs' ? 'Zvolte maximální vzdálenost, ve které chcete hledat protějšky.' : 'Choose the maximum distance for searching.'}
                  </p>
                  <div className="w-full space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-mono text-mafia-gold">
                      <span>1 km</span>
                      <span className="font-bold text-lg">{maxDistance} km</span>
                      <span>100+ km</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                      className="w-full accent-mafia-gold"
                    />
                  </div>
                  <button
                    onClick={() => setDistanceModalVisible(false)}
                    className="w-full py-4 bg-mafia-gold text-black font-heading font-black uppercase tracking-widest hover:bg-white transition-colors rounded-xl"
                  >
                    {lang === 'cs' ? 'Uložit nastavení' : 'Save Settings'}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </>
      )}

    </div>
  );
}

      const CoinPurchaseModal = ({
        isOpen,
        onClose,
        lang,
        onBuyCoins,
        onSubscribe
      }: {
        isOpen: boolean; 
  onClose: () => void;
      lang: string;
  onBuyCoins: (amount: number) => void;
  onSubscribe: (plan: string) => void;
}) => {
  const [amount, setAmount] = React.useState(1);
      if (!isOpen) return null;
      return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-black/95 border border-mafia-gold/30 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-16 h-16 bg-mafia-gold/20 rounded-full flex items-center justify-center border border-mafia-gold/50 mb-4 shadow-[0_0_30px_rgba(197,160,89,0.3)]">
              <span className="text-3xl font-black text-mafia-gold font-heading tracking-tighter">M</span>
            </div>
            <h2 className="text-xl font-heading font-black text-mafia-gold uppercase tracking-widest text-center mb-2">
              {lang === 'cs' ? 'Koupit MMCOIN' : 'Buy MMCOIN'}
            </h2>
            <p className="text-white/60 text-xs font-mono text-center leading-relaxed">
              {lang === 'cs' ? 'Odemkni pokročilé vyhledávací algoritmy a najdi ten pravý match rychleji.' : 'Unlock advanced matching algorithms and find your true match faster.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Custom Coin Amount */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Počet MMCOINů' : 'Amount of MMCOINs'}</span>
                <span className="text-mafia-gold font-bold text-lg">{amount * 20} Kč</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setAmount(Math.max(1, amount - 1))}
                    className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >-</button>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-transparent text-center text-white font-bold focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setAmount(amount + 1)}
                    className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >+</button>
                </div>
                <button
                  onClick={() => { onBuyCoins(amount); onClose(); }}
                  className="px-6 py-3 bg-mafia-gold text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
                >
                  {lang === 'cs' ? 'Koupit' : 'Buy'}
                </button>
              </div>
            </div>

            {/* Monthly */}
            <button
              onClick={() => { onSubscribe('monthly'); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">📅</div>
                <div className="flex flex-col items-start">
                  <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Měsíčně' : 'Monthly'}</span>
                  <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
                </div>
              </div>
              <span className="text-mafia-gold font-bold text-lg">200 Kč</span>
            </button>

            {/* Quarterly */}
            <button
              onClick={() => { onSubscribe('quarterly'); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">⭐</div>
                <div className="flex flex-col items-start">
                  <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Čtvrtletně' : 'Quarterly'}</span>
                  <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
                </div>
              </div>
              <span className="text-mafia-gold font-bold text-lg">600 Kč</span>
            </button>

            {/* Half-yearly */}
            <button
              onClick={() => { onSubscribe('halfyearly'); onClose(); }}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-mafia-gold/50 hover:bg-mafia-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mafia-gold group-hover:scale-110 transition-transform">⏳</div>
                <div className="flex flex-col items-start">
                  <span className="text-white text-sm font-bold tracking-widest font-heading uppercase">{lang === 'cs' ? 'Pololetně' : 'Half-yearly'}</span>
                  <span className="text-white/40 text-[10px] font-mono uppercase">{lang === 'cs' ? 'Neomezené vyhledávání' : 'Unlimited algorithms'}</span>
                </div>
              </div>
              <span className="text-mafia-gold font-bold text-lg">1200 Kč</span>
            </button>
          </div>
        </motion.div>
      </div>
      );
};

