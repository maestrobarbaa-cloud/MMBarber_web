"use client"
import React from "react"
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"
import { MapPin, Briefcase, Banknote, ShieldCheck, ChevronRight, X, Heart } from "lucide-react"

interface JobOffer {
  id: string
  title: string
  type: string
  description: string
  requirements: string | null
  salaryRange: string | null
  location: string | null
  company: {
    name: string
    logoUrl: string | null
    industry: string | null
    isVerified?: boolean
  }
}

interface JobSwipeCardProps {
  job: JobOffer
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function JobSwipeCard({ job, onSwipeLeft, onSwipeRight }: JobSwipeCardProps) {
  const x = useMotionValue(0)
  const controls = useAnimation()
  
  // Transform values for rotation and opacity based on drag position
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacityLeft = useTransform(x, [-100, -200], [0, 1])
  const opacityRight = useTransform(x, [100, 200], [0, 1])

  const handleDragEnd = async (e: any, info: any) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset > 150 || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } })
      onSwipeRight()
    } else if (offset < -150 || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } })
      onSwipeLeft()
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } })
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      animate={controls}
      className="absolute w-full max-w-sm h-[600px] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.15)] border border-mafia-gold/20 flex flex-col cursor-grab active:cursor-grabbing"
    >
      {/* Background or Company Logo area */}
      <div className="relative h-2/5 bg-gradient-to-b from-mafia-dark to-black flex items-center justify-center border-b border-white/10">
        {job.company.logoUrl ? (
          <img src={job.company.logoUrl} alt={job.company.name} className="w-32 h-32 object-contain opacity-80" />
        ) : (
          <Briefcase size={64} className="text-mafia-gold/50" />
        )}
        
        {/* Swipe Indicators */}
        <motion.div style={{ opacity: opacityLeft }} className="absolute top-8 right-8 rotate-12 z-20">
          <div className="border-4 border-red-500 text-red-500 font-black text-3xl px-4 py-1 rounded-md uppercase tracking-widest bg-black/50 backdrop-blur-sm">
            PASS
          </div>
        </motion.div>
        
        <motion.div style={{ opacity: opacityRight }} className="absolute top-8 left-8 -rotate-12 z-20">
          <div className="border-4 border-green-500 text-green-500 font-black text-3xl px-4 py-1 rounded-md uppercase tracking-widest bg-black/50 backdrop-blur-sm">
            APPLY
          </div>
        </motion.div>
      </div>

      <div className="flex-1 p-6 flex flex-col pointer-events-none">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-heading font-black text-white uppercase tracking-widest leading-tight">
              {job.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-mafia-gold font-mono text-sm font-bold uppercase tracking-widest">
            {job.company.name}
            {job.company.isVerified && <span title="Ověřená firma"><ShieldCheck size={16} className="text-blue-400" /></span>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/80">
            <MapPin size={12} className="text-mafia-gold" />
            {job.location || "Neurčeno"}
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/80">
            <Briefcase size={12} className="text-mafia-gold" />
            {job.type}
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1.5 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded-full text-xs font-mono text-green-400 font-bold">
              <Banknote size={12} />
              {job.salaryRange}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent z-10" />
          <h3 className="text-xs font-mono text-mafia-gold uppercase mb-2">Popis práce:</h3>
          <p className="text-sm text-white/70 font-sans line-clamp-4 leading-relaxed">
            {job.description}
          </p>
          
          {job.requirements && (
            <div className="mt-4">
              <h3 className="text-xs font-mono text-mafia-gold uppercase mb-2">Požadavky:</h3>
              <p className="text-sm text-white/70 font-sans line-clamp-2 leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer controls instruction */}
      <div className="p-4 bg-mafia-dark/50 border-t border-white/10 text-center flex justify-between px-10 text-white/40 pointer-events-none">
         <X size={24} className="text-red-500/50" />
         <span className="font-mono text-xs uppercase tracking-[0.2em]">Swipe</span>
         <Heart size={24} className="text-green-500/50" />
      </div>
    </motion.div>
  )
}
