"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, LogIn, Save, User, CheckCircle2, ShieldCheck, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { playSound } from "../../utils/audio";
import { useAuth } from "../../components/AuthProvider";
import { db } from "../../lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  limit 
} from "firebase/firestore";
import DOMPurify from "dompurify";

const TRAITS = [
  { id: 'precision', cs: 'Preciznost', en: 'Precision' },
  { id: 'speed', cs: 'Rychlost', en: 'Speed' },
  { id: 'demeanor', cs: 'Vystupování', en: 'Demeanor' },
  { id: 'willingness', cs: 'Ochota', en: 'Willingness' },
  { id: 'overall', cs: 'Celkový dojem', en: 'Overall' }
];

const RATINGS = [
  { val: 1, cs: 'Strašné', en: 'Terrible' },
  { val: 2, cs: 'Špatné', en: 'Poor' },
  { val: 3, cs: 'Průměrné', en: 'Average' },
  { val: 4, cs: 'Dobré', en: 'Good' },
  { val: 5, cs: 'Epické', en: 'Epic' }
];

const BARBERS = [
  { id: 'tomas', name: 'Tomáš', role: 'The Enforcer' },
  { id: 'nella', name: 'Nella', role: 'Mladé ucho' }
];

export default function RatingPage() {
  const { lang } = useTranslation();
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Realtime listener for reviews (only if logged in)
    const q = query(
      collection(db, "reviews"), 
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentReviews(reviews);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRating = (traitId: string, val: number) => {
    setRatings(prev => ({
      ...prev,
      [traitId]: val
    }));
    playSound("/sounds/click.mp3", 0.2);
  };

  const saveRatings = async () => {
    if (!user || !selectedBarber) return;
    
    setIsSaving(true);
    try {
      // Calculate average for this specific review
      const vals = Object.values(ratings);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

      // Sanitize input
      const sanitizedText = DOMPurify.sanitize(reviewText);

      // Save to Firestore
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Agent Anonymous",
        userPhoto: user.photoURL || "",
        rating: avg,
        text: sanitizedText,
        service: Object.keys(ratings).join(", "),
        barberId: selectedBarber,
        createdAt: serverTimestamp()
      });

      // Update local storage for immediate UI feedback in Profiles.tsx
      const existingRatings = JSON.parse(localStorage.getItem("mmbarber_ratings") || "{}");
      localStorage.setItem("mmbarber_ratings", JSON.stringify({
        ...existingRatings,
        [selectedBarber]: ratings
      }));
      
      window.dispatchEvent(new Event('mmbarber-ratings-update'));

      setIsSaving(false);
      setShowSuccess(true);
      setReviewText("");
      setRatings({});
      setTimeout(() => setShowSuccess(false), 3000);
      playSound("/sounds/save.mp3", 0.4);
    } catch (error) {
      console.error("Failed to save review:", error);
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-mafia-gold/20 border-t-mafia-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/[0.02] border border-white/10 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-mafia-gold/20" />
          <Star className="w-16 h-16 text-mafia-gold mx-auto mb-8 animate-pulse" />
          <h1 className="text-4xl font-heading font-black italic tracking-tighter mb-4 uppercase">
            {lang === 'cs' ? 'HODNOCENÍ OPERATIVCŮ' : 'OPERATIVE EVALUATION'}
          </h1>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10 leading-relaxed">
            {lang === 'cs' ? 'Pro přístup k personálnímu hodnocení se musíte identifikovat skrze Google Protocol.' : 'To access personnel evaluation, you must identify through the Google Protocol.'}
          </p>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full py-5 bg-white text-black font-heading font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-mafia-gold transition-all active:scale-95"
          >
            <LogIn size={20} />
            {lang === 'cs' ? 'PŘIHLÁSIT SE PŘES GOOGLE' : 'LOGIN WITH GOOGLE'}
          </button>
          
          <Link href="/" className="mt-8 inline-block text-[10px] font-mono text-white/20 hover:text-white uppercase tracking-widest transition-colors">
            {lang === 'cs' ? 'NÁVRAT NA ZÁKLADNU' : 'RETURN TO BASE'}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-mafia-gold selection:text-black font-sans pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-20 bg-black/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{lang === 'cs' ? 'Zpět' : 'Back'}</span>
        </Link>
        
        <div className="flex flex-col items-center">
           <h1 className="text-2xl font-heading font-black italic tracking-tighter text-white uppercase">{lang === 'cs' ? 'HODNOCENÍ' : 'EVALUATION'}</h1>
           <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">User: {user.displayName}</span>
           </div>
        </div>

        <div className="w-20" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BARBERS.map(barber => (
            <button 
              key={barber.id}
              onClick={() => setSelectedBarber(barber.id)}
              className={`p-8 border transition-all text-left group relative overflow-hidden ${
                selectedBarber === barber.id 
                  ? 'border-mafia-gold bg-mafia-gold/5 shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.1)]' 
                  : 'border-white/10 bg-white/[0.02] hover:border-white/30'
              }`}
            >
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className={`text-2xl font-heading font-black italic uppercase transition-colors ${selectedBarber === barber.id ? 'text-white' : 'text-white/40'}`}>{barber.name}</h3>
                    <p className="text-mafia-gold/40 font-mono text-[10px] uppercase tracking-widest mt-1">{barber.role}</p>
                 </div>
                 {selectedBarber === barber.id && <CheckCircle2 size={24} className="text-mafia-gold" />}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedBarber ? (
            <motion.div 
              key={selectedBarber}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {TRAITS.map(trait => (
                <div key={trait.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-heading font-black uppercase tracking-widest text-white/70">{lang === 'cs' ? trait.cs : trait.en}</h4>
                    <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest">
                       {ratings[trait.id] 
                         ? (lang === 'cs' ? RATINGS.find(r => r.val === ratings[trait.id])?.cs : RATINGS.find(r => r.val === ratings[trait.id])?.en)
                         : (lang === 'cs' ? 'Nehodnoceno' : 'Not rated')}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {RATINGS.map(r => (
                      <button 
                        key={r.val}
                        onClick={() => handleRating(trait.id, r.val)}
                        className={`py-6 border transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${
                          ratings[trait.id] === r.val
                            ? 'bg-mafia-gold border-mafia-gold text-black shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.2)]'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                         <Star size={18} fill={ratings[trait.id] === r.val ? "currentColor" : "none"} />
                         <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-center px-1">
                           {lang === 'cs' ? r.cs : r.en}
                         </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-4 pt-4">
                 <h4 className="text-sm font-heading font-black uppercase tracking-widest text-white/70">{lang === 'cs' ? 'TEXTOVÁ RECENZE' : 'TEXT REVIEW'}</h4>
                 <textarea 
                   value={reviewText}
                   onChange={(e) => setReviewText(e.target.value)}
                   placeholder={lang === 'cs' ? 'Napište své zkušenosti...' : 'Write your experience...'}
                   className="w-full h-32 bg-white/[0.02] border border-white/10 p-4 font-mono text-xs text-white outline-none focus:border-mafia-gold/50 transition-colors resize-none"
                 />
              </div>

              <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-white/30 italic text-xs">
                   <ShieldCheck size={16} />
                   <p>{lang === 'cs' ? 'Hodnocení je trvale uloženo v archivu.' : 'Evaluation is permanently stored in the archive.'}</p>
                </div>
                
                <button 
                  onClick={saveRatings}
                  disabled={isSaving || Object.keys(ratings).length < TRAITS.length}
                  className="px-12 py-5 bg-white text-black font-heading font-black text-sm uppercase tracking-widest hover:bg-mafia-gold transition-all active:scale-95 flex items-center gap-3 disabled:opacity-20"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {lang === 'cs' ? 'ODESLAT RECENZI' : 'SUBMIT REVIEW'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-white/5">
              <User className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest">{lang === 'cs' ? 'VYBERTE OPERATIVCE K HODNOCENÍ' : 'SELECT AN OPERATIVE TO EVALUATE'}</p>
            </div>
          )}
        </AnimatePresence>

        {/* Recent Reviews Section (Client Only Read) */}
        <div className="mt-32 space-y-8">
           <div className="flex items-center gap-4 opacity-30">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white" />
              <h2 className="text-[10px] font-mono tracking-[0.4em] uppercase">{lang === 'cs' ? 'POSLEDNÍ ARCHIVNÍ ZÁZNAMY' : 'RECENT ARCHIVE RECORDS'}</h2>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {recentReviews.map(review => (
                <div key={review.id} className="p-6 bg-white/[0.01] border border-white/5 flex gap-6 items-start group hover:border-mafia-gold/20 transition-all">
                   <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                      {review.userPhoto ? <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center"><User size={20} className="text-white/20" /></div>}
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                         <div>
                            <span className="text-[10px] font-heading font-black uppercase text-white/70">{review.userName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[8px] font-mono text-mafia-gold uppercase">{review.barberId}</span>
                               <span className="text-[8px] font-mono text-white/20">•</span>
                               <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={8} className={i <= Math.round(review.rating) ? "text-mafia-gold" : "text-white/5"} fill={i <= Math.round(review.rating) ? "currentColor" : "none"} />
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-1.5 text-white/10 font-mono text-[8px]">
                            <Clock size={10} />
                            <span>{review.createdAt?.toDate().toLocaleDateString()}</span>
                         </div>
                      </div>
                      <p className="text-xs text-white/40 font-mono italic leading-relaxed">"{review.text}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, bottom: -100 }}
            animate={{ opacity: 1, bottom: 40 }}
            exit={{ opacity: 0, bottom: -100 }}
            className="fixed left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-4 flex items-center gap-4 shadow-2xl z-[100] border border-white/20"
          >
             <CheckCircle2 size={24} />
             <div className="flex flex-col">
                <span className="font-heading font-black uppercase text-sm tracking-widest">{lang === 'cs' ? 'RECENZE ULOŽENA' : 'REVIEW SAVED'}</span>
                <span className="font-mono text-[9px] uppercase opacity-80">{lang === 'cs' ? 'Data byla zapsána do globálního archivu.' : 'Data was written to the global archive.'}</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
