"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ShieldCheck, Briefcase } from "lucide-react"

export default function CompanyRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    ico: "",
    description: "",
    website: "",
    address: "",
    industry: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push("/dashboard/company")
      } else {
        const data = await res.json()
        setError(data.error || "Něco se pokazilo")
      }
    } catch (err) {
      setError("Nepodařilo se připojit k serveru")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[url('/bg-texture.png')] bg-repeat text-white pt-24 px-4 flex justify-center">
      <div className="w-full max-w-lg bg-black/60 border border-mafia-gold/30 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(197,160,89,0.1)] h-fit">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-mafia-gold/20 rounded-full flex items-center justify-center border border-mafia-gold/50">
            <Building2 className="text-mafia-gold" size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-heading font-black text-center uppercase tracking-widest mb-2">
          Firemní Profil
        </h1>
        <p className="text-white/50 text-center font-mono text-xs uppercase tracking-[0.2em] mb-8">
          Vytvořte si profil pro zadávání inzerátů
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-1">Název firmy *</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm"
              placeholder="Např. MM Barber s.r.o."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">IČO</label>
              <input 
                type="text" 
                name="ico" 
                value={formData.ico}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Obor</label>
              <input 
                type="text" 
                name="industry" 
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm"
                placeholder="IT, Služby, Gastro..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Webová stránka</label>
            <input 
              type="url" 
              name="website" 
              value={formData.website}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-1">Sídlo / Adresa</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-mafia-gold uppercase tracking-[0.2em] mb-1">Popis firmy</label>
            <textarea 
              name="description" 
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-mafia-gold transition-colors font-sans text-sm resize-none"
              placeholder="Napište něco o vaší firmě a firemní kultuře..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-mafia-gold hover:bg-yellow-600 text-black font-black uppercase tracking-widest py-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Ukládám..." : "Vytvořit firemní profil"}
            {!loading && <Briefcase size={18} />}
          </button>
        </form>
      </div>
    </div>
  )
}
