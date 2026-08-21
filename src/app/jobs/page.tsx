"use client"
import React, { useEffect, useState } from "react"
import { JobSwipeCard } from "@/components/jobs/JobSwipeCard"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Loader2, Sparkles } from "lucide-react"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs")
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (action: 'LIKE' | 'PASS', jobId: string) => {
    setCurrentIndex(prev => prev + 1)
    
    // Optionally call API to save swipe if user is logged in
    try {
      await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, coverLetter: "" }) // We can adapt API to accept action
      })
    } catch (error) {
      console.error("Failed to record swipe", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-texture.png')] bg-repeat text-white pt-24 px-4 flex flex-col items-center">
      
      <div className="max-w-md w-full text-center mb-8">
        <h1 className="text-4xl font-heading font-black text-white uppercase tracking-widest flex items-center justify-center gap-3 mb-2">
          <Briefcase className="text-mafia-gold" size={32} />
          Brigády & Práce
        </h1>
        <p className="text-white/60 font-mono text-sm uppercase tracking-widest">
          Najdi svůj vysněný flek. Swipe doprava = Mám zájem!
        </p>
      </div>

      <div className="relative w-full max-w-sm h-[600px] flex justify-center items-center">
        {loading ? (
          <div className="flex flex-col items-center text-mafia-gold">
            <Loader2 className="animate-spin mb-4" size={48} />
            <span className="font-mono uppercase tracking-widest text-sm">Načítám nabídky...</span>
          </div>
        ) : jobs.length > 0 && currentIndex < jobs.length ? (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {jobs.slice(currentIndex, currentIndex + 2).reverse().map((job, i) => {
                const isTop = i === 1 || (jobs.slice(currentIndex, currentIndex + 2).length === 1)
                return (
                  <div key={job.id} className="absolute inset-0 flex justify-center pointer-events-none">
                    <div className={isTop ? "pointer-events-auto" : "scale-95 opacity-50"}>
                      <JobSwipeCard
                        job={job}
                        onSwipeLeft={() => handleSwipe('PASS', job.id)}
                        onSwipeRight={() => handleSwipe('LIKE', job.id)}
                      />
                    </div>
                  </div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/50 bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
            <Sparkles className="text-mafia-gold mb-4" size={48} />
            <h3 className="font-heading font-black uppercase text-xl mb-2 text-white">To je vše!</h3>
            <p className="font-mono text-xs uppercase tracking-widest">
              Prošel jsi všechny aktuální nabídky. Zkus to zase zítra.
            </p>
          </div>
        )}
      </div>
      
    </div>
  )
}
