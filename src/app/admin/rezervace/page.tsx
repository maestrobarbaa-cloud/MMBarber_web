"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useBarbers } from "@/contexts/BarberContext";

export default function ReservationsAdminPage() {
  const { barbers } = useBarbers();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mmbarber_admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchAppointments();
    } else {
      window.location.href = "/admin";
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu smazat tuto rezervaci?")) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchAppointments();
    } catch (e) {}
  };

  if (!isAuthenticated || loading) return <div className="min-h-screen bg-black text-white p-6">Načítám...</div>;

  const getBarberName = (id: string) => {
    const b = barbers.find(x => x.id === id);
    return b ? b.name : id;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        <header className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <Link href="/admin" className="text-mafia-gold font-mono text-[10px] uppercase tracking-widest hover:text-white flex items-center gap-2 mb-4">
              <ArrowLeft size={14} /> Zpět na centrálu
            </Link>
            <h1 className="text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-4">
              <Calendar className="text-mafia-gold" size={32} />
              SPRÁVA REZERVACÍ
            </h1>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase mt-2">
              Přehled rezervací pro vlastní rezervační systém.
            </p>
          </div>
        </header>

        <div className="bg-white/5 border border-white/10 p-6">
          {appointments.length === 0 ? (
            <p className="text-white/50 italic">Žádné rezervace k zobrazení.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    <th className="p-4">Datum a Čas</th>
                    <th className="p-4">Barber</th>
                    <th className="p-4">Klient</th>
                    <th className="p-4">Služba</th>
                    <th className="p-4">Cena / Čas</th>
                    <th className="p-4 text-right">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map((app) => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-bold text-mafia-gold">{app.date}</div>
                        <div className="text-sm">{app.time}</div>
                      </td>
                      <td className="p-4 text-white/80">{getBarberName(app.barberId)}</td>
                      <td className="p-4">
                        <div className="font-bold">{app.customerName}</div>
                        <div className="text-xs text-white/50">{app.customerPhone}</div>
                        <div className="text-xs text-white/50">{app.customerEmail}</div>
                      </td>
                      <td className="p-4 text-white/80">{app.serviceName}</td>
                      <td className="p-4 text-white/80">
                        {app.price} Kč<br />
                        <span className="text-xs text-white/50">{app.durationMin} min</span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDelete(app.id)} className="text-white/30 hover:text-mafia-red transition p-2 border border-white/10 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
