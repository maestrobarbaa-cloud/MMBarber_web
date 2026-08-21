"use client"
import React, { useEffect, useState } from "react"
import { Building2, Plus, Briefcase, CheckCircle, Clock, XCircle, MapPin, Users, Loader2, Eye, Heart, X, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CompanyDashboard() {
  const [company, setCompany] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewJobForm, setShowNewJobForm] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    type: "FULL_TIME",
    location: "",
    salaryRange: "",
    description: "",
    requirements: ""
  })

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/company")
      if (res.ok) {
        const data = await res.json()
        setCompany(data)
        // In a real app we'd have a specific endpoint for company's own jobs. 
        // For now, let's fetch all jobs and filter (or better, make an API for it).
        // To be safe, we'll fetch them here.
        const jobsRes = await fetch(`/api/company/jobs`) // We need to create this API
        if (jobsRes.ok) {
           const jobsData = await jobsRes.json()
           setJobs(jobsData)
        }
      }
    } catch (error) {
      console.error("Failed to fetch company data", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
      })
      if (res.ok) {
        setShowNewJobForm(false)
        fetchCompanyData()
      }
    } catch (error) {
      console.error("Failed to create job", error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-mafia-gold"><Loader2 className="animate-spin" size={48} /></div>
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Building2 size={64} className="text-white/20 mb-4" />
        <h2 className="text-2xl font-heading font-black uppercase tracking-widest mb-2">Nemáte firemní profil</h2>
        <a href="/company/register" className="px-6 py-2 bg-mafia-gold text-black rounded-md font-bold uppercase tracking-widest mt-4">Vytvořit profil</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-texture.png')] bg-repeat text-white pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-black/80 border ${company.tier === 'VIP' ? 'border-mafia-gold shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'border-mafia-gold/20'} rounded-2xl p-6 backdrop-blur-md flex flex-wrap items-center justify-between gap-4`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${company.tier === 'VIP' ? 'bg-gradient-to-br from-mafia-gold to-yellow-600 shadow-lg shadow-mafia-gold/30' : 'bg-mafia-gold/10'} rounded-xl flex items-center justify-center border ${company.tier === 'VIP' ? 'border-white/20' : 'border-mafia-gold/30'}`}>
              <Building2 className={company.tier === 'VIP' ? 'text-black' : 'text-mafia-gold'} size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-heading font-black uppercase tracking-widest text-white">{company.name}</h1>
                {company.tier === 'VIP' && (
                  <span className="bg-mafia-gold text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} className="fill-black" /> VIP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {company.status === "APPROVED" ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/30 uppercase tracking-widest"><CheckCircle size={10} /> Ověřeno</span>
                ) : company.status === "PENDING" ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-500/30 uppercase tracking-widest"><Clock size={10} /> Čeká</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-900/20 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest"><XCircle size={10} /> Zamítnuto</span>
                )}
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest border-l border-white/10 pl-2">IČO: {company.ico || "Nezadáno"}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowNewJobForm(true)}
            className="px-5 py-2.5 bg-mafia-gold text-black font-black uppercase tracking-widest rounded-md hover:bg-yellow-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> Nový Inzerát
          </button>
        </motion.div>

        {/* New Job Form Modal */}
        <AnimatePresence>
        {showNewJobForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-mafia-gold/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(197,160,89,0.15)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-black uppercase text-mafia-gold tracking-widest">Vytvořit Inzerát</h2>
                <button onClick={() => setShowNewJobForm(false)} className="text-white/50 hover:text-white"><XCircle size={24} /></button>
              </div>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Název pozice</label>
                  <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Typ úvazku</label>
                    <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white">
                      <option value="FULL_TIME">Hlavní pracovní poměr</option>
                      <option value="PART_TIME">Zkrácený úvazek</option>
                      <option value="BRIGADA">Brigáda</option>
                      <option value="CONTRACT">IČO / Kontrakt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Lokace</label>
                    <input type="text" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Platové ohodnocení (textově, např. 30 000 - 45 000 Kč)</label>
                  <input type="text" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Popis práce</label>
                  <textarea rows={4} required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white resize-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Požadavky</label>
                  <textarea rows={3} value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white resize-none" />
                </div>
                <button type="submit" className="w-full bg-mafia-gold text-black font-black uppercase tracking-widest py-3 rounded mt-4">Zveřejnit inzerát</button>
              </form>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Jobs List */}
        <div>
          <h2 className="text-xl font-heading font-black uppercase tracking-widest text-white/80 mb-4 flex items-center gap-2"><Briefcase size={20} /> Vaše Inzeráty</h2>
          {jobs.length === 0 ? (
            <div className="bg-black/30 border border-white/5 rounded-xl p-8 text-center text-white/40 font-mono text-sm">
              Zatím nemáte žádné aktivní inzeráty.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={job.id} 
                  className="bg-black/60 border border-white/10 rounded-2xl p-5 hover:border-mafia-gold/50 transition-all group relative overflow-hidden flex flex-col h-full"
                >
                  {job.isPremium && (
                    <div className="absolute top-0 right-0 bg-mafia-gold text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-bl-lg">
                      Premium
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider pr-12 leading-tight">{job.title}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-mono text-mafia-gold/80 bg-mafia-gold/10 border border-mafia-gold/20 px-2 py-1 rounded flex items-center gap-1"><MapPin size={10} /> {job.location || "Neurčeno"}</span>
                    <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 px-2 py-1 rounded">{job.type}</span>
                  </div>

                  <div className="flex-1" />

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-2 bg-black/40 rounded-xl p-3 mb-4 border border-white/5">
                    <div className="flex flex-col items-center justify-center">
                      <Eye size={14} className="text-white/40 mb-1" />
                      <span className="font-mono text-xs text-white">{job.views || 0}</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">Zobrazení</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-l border-white/5">
                      <Heart size={14} className="text-green-500/70 mb-1" />
                      <span className="font-mono text-xs text-green-400">{job.swipesRight || 0}</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">Zájem</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-l border-white/5">
                      <X size={14} className="text-red-500/70 mb-1" />
                      <span className="font-mono text-xs text-red-400">{job.swipesLeft || 0}</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">Přeskočilo</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                       {job.status === "APPROVED" ? (
                          <span className="flex items-center gap-1 text-[9px] bg-green-900/40 text-green-400 px-2 py-1 rounded-sm uppercase tracking-widest font-mono"><CheckCircle size={10}/> Aktivní</span>
                       ) : (
                          <span className="flex items-center gap-1 text-[9px] bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded-sm uppercase tracking-widest font-mono"><Clock size={10}/> Čeká</span>
                       )}
                    </div>
                    <button className="text-[10px] font-mono text-white/40 hover:text-mafia-gold uppercase tracking-widest transition-colors flex items-center gap-1">
                      Upravit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
