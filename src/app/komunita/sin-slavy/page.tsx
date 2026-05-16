"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Crown, 
  UserPlus,
  ChevronDown,
  Users
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDocs,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { getUserIp } from "@/utils/network";

interface Supporter {
  id: string;
  name: string;
  time: any;
  ip?: string;
}

export default function HallOfFamePage() {
  const { lang } = useTranslation();
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userSupporterId, setUserSupporterId] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "community_supporters"),
      orderBy("time", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Supporter[];
      setSupporters(list);
    });

    const checkExisting = async () => {
      try {
        const ip = await getUserIp();
        const q = query(collection(db, "community_supporters"), where("ip", "==", ip));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setUserSupporterId(doc.id);
          setNewName(doc.data().name);
        }
      } catch (err) {
        console.error("Check existing failed:", err);
      }
    };
    checkExisting();

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName || isSubmitting) return;
    setNameError(null);

    setIsSubmitting(true);
    try {
      const ip = await getUserIp();
      
      // Check for name uniqueness (case-insensitive)
      const nameQuery = query(
        collection(db, "community_supporters"), 
        where("name", ">=", cleanName.toUpperCase()), 
        where("name", "<=", cleanName.toUpperCase() + "\uf8ff")
      );
      // Note: Since Firestore case-insensitive is tricky, we'll fetch and filter or just do exact match if we store as uppercase.
      // Let's do a simple check for exact match first (case-insensitive in JS for safety)
      const allSnapshot = await getDocs(collection(db, "community_supporters"));
      const nameExists = allSnapshot.docs.some(doc => 
        doc.data().name.toLowerCase() === cleanName.toLowerCase() && doc.id !== userSupporterId
      );

      if (nameExists) {
        setNameError(lang === 'cs' ? "OBSAZENO" : "TAKEN");
        setIsSubmitting(false);
        return;
      }

      if (userSupporterId) {
        // Update existing
        await updateDoc(doc(db, "community_supporters", userSupporterId), {
          name: cleanName,
          time: serverTimestamp()
        });
      } else {
        // Check IP again to be absolutely sure
        const ipQuery = query(collection(db, "community_supporters"), where("ip", "==", ip));
        const ipSnapshot = await getDocs(ipQuery);
        
        if (!ipSnapshot.empty) {
          // Already has an entry under this IP, update that one instead of adding new
          const existingDoc = ipSnapshot.docs[0];
          await updateDoc(doc(db, "community_supporters", existingDoc.id), {
            name: cleanName,
            time: serverTimestamp()
          });
          setUserSupporterId(existingDoc.id);
        } else {
          // Add new
          const docRef = await addDoc(collection(db, "community_supporters"), {
            name: cleanName,
            time: serverTimestamp(),
            ip: ip
          });
          setUserSupporterId(docRef.id);
        }
      }
      
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add/update supporter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-smoke-white overflow-x-hidden relative selection:bg-mafia-gold selection:text-mafia-black">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(var(--color-mafia-gold-rgb),0.1)_0%,transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Animated Particles/Dust */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
      </div>

      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link 
          href="/komunita" 
          className="group flex items-center gap-4 text-mafia-gold/40 hover:text-mafia-gold transition-colors font-mono text-xs tracking-[0.4em] uppercase"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          {lang === 'cs' ? "ZPĚT" : "BACK"}
        </Link>
        <div className="flex items-center gap-4">
           <Trophy className="text-mafia-gold animate-pulse" size={24} />
           <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">ELITE_RECORDS</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-40 text-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2 border border-mafia-gold/20 bg-mafia-gold/5 mb-8">
             <Star className="text-mafia-gold" size={14} fill="currentColor" />
             <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em]">Legendary Supporters</span>
             <Star className="text-mafia-gold" size={14} fill="currentColor" />
          </div>
          <h1 className="text-6xl md:text-9xl font-heading font-black uppercase italic tracking-tighter mb-6">
             SÍŇ <span className="text-mafia-gold">SLÁVY</span>
          </h1>
          <p className="text-smoke-white/40 font-mono text-[10px] uppercase tracking-[0.6em] max-w-2xl mx-auto leading-relaxed">
             Každý velký příběh má své hrdiny. Zde jsou ti, kteří tvoří MMBarber rodinu.
          </p>
        </motion.div>

        {/* The Movie Credits Area */}
        <div className="relative h-[60vh] mb-20 overflow-hidden group">
           {/* Gradient Overlays for Fade Effect */}
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
           
           <div className="flex flex-col items-center">
              {supporters.length > 0 ? (
                <motion.div 
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{ 
                    duration: Math.max(10, supporters.length * 2), 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                  className="space-y-12 py-20"
                >
                   {/* We double the list for seamless looping if needed, or just use enough spacing */}
                   {/* Loop the list only if enough items to make it smooth, but avoid blind duplication */}
                   {supporters.map((supporter, idx) => (
                     <div key={`${supporter.id}-${idx}`} className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter hover:text-mafia-gold transition-colors cursor-default">
                           {supporter.name}
                        </span>
                        <div className="h-[1px] w-8 bg-mafia-gold/20 mt-4"></div>
                     </div>
                   ))}
                   {/* Duplicate for seamless scroll ONLY if list is long enough or we need the infinite effect */}
                   {supporters.length > 5 && supporters.map((supporter, idx) => (
                     <div key={`${supporter.id}-dup-${idx}`} className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter hover:text-mafia-gold transition-colors cursor-default">
                           {supporter.name}
                        </span>
                        <div className="h-[1px] w-8 bg-mafia-gold/20 mt-4"></div>
                     </div>
                   ))}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-40">
                   <Users size={64} className="mb-6" />
                   <p className="font-mono text-xs uppercase tracking-widest">Zatím žádní zapsaní hrdinové</p>
                </div>
              )}
           </div>
        </div>

        {/* Counter and Form Toggle */}
        <div className="flex flex-col items-center gap-12">
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-mafia-gold uppercase tracking-[0.4em] mb-4">Aktuální počet členů</span>
              <div className="text-5xl font-heading font-black text-white">{supporters.length}</div>
           </div>

           <AnimatePresence mode="wait">
             {!showForm ? (
               <motion.button
                 key="add-btn"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 onClick={() => setShowForm(true)}
                 className="px-12 py-5 bg-white text-black font-heading font-black uppercase tracking-[0.4em] hover:bg-mafia-gold transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
               >
                  <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                  {userSupporterId ? 'Upravit svůj zápis' : 'Zapsat se do historie'}
               </motion.button>
             ) : (
               <motion.form
                 key="add-form"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 20 }}
                 onSubmit={handleSubmit}
                 className="w-full max-w-md bg-white/[0.02] border border-white/10 p-8 md:p-12 backdrop-blur-3xl"
               >
                  <h3 className="text-xl font-heading font-black uppercase text-white mb-8 tracking-tighter italic flex items-center gap-3 justify-center">
                     <Crown className="text-mafia-gold" size={20} /> {userSupporterId ? 'ZMĚNA JMÉNA' : 'TVOJE PŘEZDÍVKA'}
                  </h3>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setNameError(null);
                    }}
                    placeholder={nameError || "JAK TI ŘÍKAJÍ..."}
                    maxLength={30}
                    required
                    className={`w-full bg-black/40 border px-6 py-4 text-center font-mono tracking-widest uppercase focus:outline-none transition-all mb-8 ${nameError ? 'border-mafia-red text-mafia-red placeholder:text-mafia-red' : 'border-white/10 text-white focus:border-mafia-gold'}`}
                    autoFocus
                  />
                  <div className="flex flex-col gap-4">
                     <button 
                       type="submit"
                       disabled={isSubmitting}
                       className="w-full py-4 bg-mafia-gold text-mafia-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50"
                     >
                        {userSupporterId ? 'AKTUALIZOVAT JMÉNO' : 'POTVRDIT ZÁPIS'}
                     </button>
                     <button 
                       type="button"
                       onClick={() => setShowForm(false)}
                       className="w-full py-4 text-white/30 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-all"
                     >
                        ZRUŠIT
                     </button>
                  </div>
               </motion.form>
             )}
           </AnimatePresence>
        </div>

      </main>

      <Footer />
    </div>
  );
}
