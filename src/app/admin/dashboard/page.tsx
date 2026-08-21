"use client"
import React, { useEffect, useState } from "react"
import { ShieldAlert, CheckCircle, XCircle, Users, Building2, Briefcase, Star, Search, ShieldCheck, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // In a real app we'd fetch all of this from admin-only APIs
      // For now, let's assume we have endpoints for this or we create them next.
      const [compRes, jobRes, userRes] = await Promise.all([
        fetch("/api/admin/companies"),
        fetch("/api/admin/jobs"),
        fetch("/api/admin/users")
      ])
      
      if (compRes.ok) setCompanies(await compRes.json())
      if (jobRes.ok) setJobs(await jobRes.json())
      if (userRes.ok) setUsers(await userRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyStatus = async (id: string, status: string, tier: string = "FREE") => {
    await fetch(`/api/admin/companies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, tier })
    })
    fetchAdminData()
  }

  const updateUserVerification = async (id: string, isVerifiedApplicant: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerifiedApplicant })
    })
    fetchAdminData()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-heading font-black uppercase text-mafia-gold flex items-center justify-center gap-4 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            <ShieldAlert size={40} className="text-mafia-gold" /> Admin Centrum
          </h1>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/50 mt-4">Nejvyšší oprávnění. Všechny změny jsou ihned aktivní.</p>
        </motion.div>

        <section>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-heading font-black uppercase mb-6 flex items-center gap-3 text-white"><Building2 className="text-mafia-gold" /> Správa Firem</h2>
            <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-mafia-gold/20 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-mafia-gold/5 border-b border-mafia-gold/20 font-mono uppercase tracking-widest text-[10px] text-white/60">
                  <tr>
                    <th className="p-4 pl-6">Firma</th>
                    <th className="p-4">IČO</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Úroveň (Tier)</th>
                    <th className="p-4 pr-6 text-right">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={c.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 pl-6 font-bold uppercase tracking-wider">{c.name}</td>
                      <td className="p-4 font-mono text-white/60">{c.ico || '-'}</td>
                      <td className="p-4">
                        {c.status === "PENDING" ? <span className="text-[10px] font-mono bg-yellow-900/40 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 w-max"><Clock size={12}/> Čeká</span> : 
                         c.status === "APPROVED" ? <span className="text-[10px] font-mono bg-green-900/40 border border-green-500/30 text-green-400 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 w-max"><CheckCircle size={12}/> Schváleno</span> : 
                         <span className="text-[10px] font-mono bg-red-900/40 border border-red-500/30 text-red-400 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 w-max"><XCircle size={12}/> Zamítnuto</span>}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${c.tier === 'VIP' ? 'bg-mafia-gold text-black' : 'bg-white/10 text-white/50'}`}>
                          {c.tier}
                        </span>
                      </td>
                      <td className="p-4 pr-6 flex justify-end gap-2">
                        <button onClick={() => updateCompanyStatus(c.id, "APPROVED", c.tier)} className="text-green-400 hover:bg-green-900/40 p-2 rounded-lg transition-colors border border-transparent hover:border-green-500/30" title="Schválit"><CheckCircle size={18} /></button>
                        <button onClick={() => updateCompanyStatus(c.id, "REJECTED", c.tier)} className="text-red-400 hover:bg-red-900/40 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30" title="Zamítnout"><XCircle size={18} /></button>
                        <button onClick={() => updateCompanyStatus(c.id, c.status, c.tier === "FREE" ? "VIP" : "FREE")} className="text-mafia-gold hover:bg-yellow-900/40 p-2 rounded-lg transition-colors border border-transparent hover:border-mafia-gold/30" title="Přepnout VIP úroveň">
                          <Star size={18} className={c.tier === "VIP" ? "fill-mafia-gold" : ""} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-heading font-black uppercase mb-6 flex items-center gap-3 text-white"><Users className="text-mafia-gold" /> Správa Uchazečů</h2>
            <div className="bg-black/60 backdrop-blur-md rounded-2xl border border-mafia-gold/20 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-mafia-gold/5 border-b border-mafia-gold/20 font-mono uppercase tracking-widest text-[10px] text-white/60">
                  <tr>
                    <th className="p-4 pl-6">Uživatel</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Trust Score</th>
                    <th className="p-4 pr-6 text-right">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={u.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 pl-6 font-bold uppercase tracking-wider">{u.name}</td>
                      <td className="p-4 font-mono text-white/60">{u.email}</td>
                      <td className="p-4 flex justify-center">
                        {u.isVerifiedApplicant ? (
                          <span className="text-[10px] font-mono border border-green-500/30 bg-green-900/40 text-green-400 px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest"><ShieldCheck size={12}/> Ověřen</span>
                        ) : (
                          <span className="text-[10px] font-mono border border-white/10 bg-white/5 text-white/40 px-2 py-1 rounded uppercase tracking-widest">Běžný</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-mono font-bold ${u.applicantTrustScore >= 90 ? 'text-green-400' : u.applicantTrustScore <= 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {u.applicantTrustScore}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => updateUserVerification(u.id, !u.isVerifiedApplicant)}
                          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${u.isVerifiedApplicant ? 'bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-900/60' : 'bg-mafia-gold text-black hover:bg-yellow-600'}`}
                        >
                          {u.isVerifiedApplicant ? "Odebrat Ověření" : "Ověřit Profil"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  )
}
