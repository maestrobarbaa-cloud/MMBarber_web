"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle, Smartphone, Mail, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Image from '@/components/OptimizedImage';

// Dummy services if none provided
const DEFAULT_SERVICES = [
  { id: 's1', name: 'Základní střih (Basic Cut)', duration: 30, price: 500 },
  { id: 's2', name: 'Střih + Úprava vousů (Cut & Beard)', duration: 60, price: 850 },
  { id: 's3', name: 'VIP Kompletní servis', duration: 90, price: 1200 },
];

const BARBERS = [
  { id: 'tomas', name: 'Tomáš', image: '/obr/tomasmicka.png', role: 'The Enforcer' },
  { id: 'nella', name: 'Nella', image: '/obr/nellapelikanova.png', role: 'Mladé ucho' },
];

interface BookingFlowProps {
  onClose?: () => void;
}

export function BookingFlow({ onClose }: BookingFlowProps) {
  const { lang } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    note: ''
  });

  const [bookingResult, setBookingResult] = useState<any>(null);

  // Generate dates for the next 7 days
  const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return {
      dateObj: d,
      isoDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      setLoading(true);
      fetch(`/api/barbers/availability?barberId=${selectedBarber.id}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data.slots || []);
          setSelectedTime(''); // reset time
        })
        .catch(err => console.error("Error fetching slots", err))
        .finally(() => setLoading(false));
    }
  }, [selectedBarber, selectedDate]);

  const handleNext = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedBarber) return;
    if (step === 3 && (!selectedDate || !selectedTime)) return;
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: selectedBarber.id,
          serviceName: selectedService.name,
          durationMin: selectedService.duration,
          price: selectedService.price,
          date: selectedDate,
          time: selectedTime,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          reminders: [{ type: 'EMAIL', hoursBefore: 24 }]
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
        setStep(5); // Success step
      } else {
        alert("Něco se pokazilo při vytváření rezervace.");
      }
    } catch (err) {
      console.error(err);
      alert("Chyba serveru.");
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + selectedService.duration * 60000);
    
    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', `Střih u MMBarber (${selectedBarber.name})`);
    url.searchParams.append('dates', `${formatDate(startDateTime)}/${formatDate(endDateTime)}`);
    url.searchParams.append('details', `Služba: ${selectedService.name}\nDélka: ${selectedService.duration} min\nBarber: ${selectedBarber.name}\n\nTěšíme se na vás!`);
    url.searchParams.append('location', 'Uherské Hradiště');
    return url.toString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-mafia-black/90 backdrop-blur-xl border-2 border-mafia-gold/30 rounded-sm shadow-[0_0_30px_rgba(var(--color-mafia-gold-rgb),0.15)] overflow-hidden flex flex-col min-h-[600px] relative">
      
      {/* Header */}
      <div className="bg-mafia-dark/80 border-b border-mafia-gold/20 p-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-mafia-gold/50 flex items-center justify-center bg-mafia-gold/5">
            <Scissors size={20} className="text-mafia-gold" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest leading-none">
              {lang === 'cs' ? 'Rezervace' : 'Booking'}
            </h2>
            <p className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-[0.2em] mt-1">
              {lang === 'cs' ? 'Online rezervační systém' : 'Online Booking System'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5 relative z-10">
        <motion.div 
          className="h-full bg-mafia-gold"
          initial={{ width: '20%' }}
          animate={{ width: `${(step / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 relative p-6 md:p-8 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SERVICE */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
                1. {lang === 'cs' ? 'Výběr služby' : 'Select Service'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep(2); }}
                    className={`flex flex-col text-left p-5 border-2 transition-all duration-300 ${
                      selectedService?.id === service.id 
                        ? 'border-mafia-gold bg-mafia-gold/10' 
                        : 'border-white/10 hover:border-mafia-gold/50 hover:bg-white/5 bg-mafia-dark'
                    }`}
                  >
                    <span className="font-bold text-white text-lg">{service.name}</span>
                    <div className="flex items-center gap-4 mt-3 text-white/60 font-mono text-xs uppercase">
                      <span className="flex items-center gap-1"><Clock size={14}/> {service.duration} min</span>
                      <span className="text-mafia-gold">{service.price} CZK</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: BARBER */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
                2. {lang === 'cs' ? 'Výběr barbera' : 'Select Barber'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BARBERS.map(barber => (
                  <button
                    key={barber.id}
                    onClick={() => { setSelectedBarber(barber); setStep(3); }}
                    className={`flex items-center gap-4 p-4 border-2 transition-all duration-300 ${
                      selectedBarber?.id === barber.id 
                        ? 'border-mafia-gold bg-mafia-gold/10' 
                        : 'border-white/10 hover:border-mafia-gold/50 hover:bg-white/5 bg-mafia-dark'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-mafia-gold/30 flex-shrink-0">
                      <Image src={barber.image} alt={barber.name} width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-white text-lg">{barber.name}</span>
                      <span className="text-mafia-gold/70 font-mono text-[10px] uppercase tracking-wider">{barber.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
                3. {lang === 'cs' ? 'Termín' : 'Date & Time'}
              </h3>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Date Picker (Horizontal scroll) */}
                <div className="w-full lg:w-1/2">
                  <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CalendarIcon size={16}/> {lang === 'cs' ? 'Zvolte den' : 'Select Day'}
                  </h4>
                  <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-thin scrollbar-thumb-mafia-gold/30">
                    {upcomingDates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(d.isoDate); }}
                        className={`flex flex-col items-center justify-center p-4 min-w-[80px] border-2 transition-all duration-300 ${
                          selectedDate === d.isoDate 
                            ? 'border-mafia-gold bg-mafia-gold/20 text-mafia-gold' 
                            : 'border-white/10 bg-mafia-dark/50 text-white/70 hover:border-mafia-gold/50'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-widest mb-1">{d.monthName}</span>
                        <span className="text-2xl font-bold font-heading">{d.dayNumber}</span>
                        <span className="text-xs mt-1">{d.dayName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                <div className="w-full lg:w-1/2">
                  <h4 className="text-sm font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock size={16}/> {lang === 'cs' ? 'Zvolte čas' : 'Select Time'}
                  </h4>
                  
                  {!selectedDate ? (
                    <div className="p-8 border border-white/10 border-dashed text-center text-white/40 text-sm">
                      {lang === 'cs' ? 'Nejprve vyberte den' : 'Select a day first'}
                    </div>
                  ) : loading ? (
                    <div className="p-8 border border-white/10 text-center text-mafia-gold text-sm animate-pulse">
                      {lang === 'cs' ? 'Načítám volné termíny...' : 'Loading available slots...'}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 border border-white/10 bg-mafia-red/10 text-center text-mafia-red text-sm">
                      {lang === 'cs' ? 'Tento den nejsou žádné volné termíny.' : 'No available slots for this day.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mafia-gold/30">
                      {availableSlots.map((time, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 text-center border-2 font-mono text-sm transition-all duration-300 ${
                            selectedTime === time 
                              ? 'border-mafia-gold bg-mafia-gold text-black font-bold' 
                              : 'border-white/10 text-white hover:border-mafia-gold/50 hover:bg-white/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CONTACT INFO */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
                4. {lang === 'cs' ? 'Vaše údaje' : 'Your Details'}
              </h3>
              
              <form id="booking-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2"><User size={14}/> Jméno a Příjmení *</label>
                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-mafia-dark/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none transition-colors" placeholder="Jan Novák"/>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail size={14}/> E-mail *</label>
                    <input required type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-mafia-dark/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none transition-colors" placeholder="jan@novak.cz"/>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2"><Smartphone size={14}/> Telefon *</label>
                    <input required type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-mafia-dark/50 border border-white/20 p-3 text-white focus:border-mafia-gold outline-none transition-colors" placeholder="+420 777 777 777"/>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2">
                  <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-4 h-full">
                    <h4 className="text-sm font-bold text-mafia-gold uppercase tracking-widest border-b border-white/10 pb-2">Shrnutí</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Služba:</span>
                      <span className="text-white font-bold">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Barber:</span>
                      <span className="text-white font-bold">{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Termín:</span>
                      <span className="text-mafia-gold font-bold">{new Date(selectedDate).toLocaleDateString()} v {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Cena:</span>
                      <span className="text-white font-bold">{selectedService?.price} CZK</span>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-white/10">
                       <p className="text-[10px] text-white/40 mb-4 text-center">
                         Kliknutím na tlačítko "Potvrdit rezervaci" souhlasíte s podmínkami a zpracováním osobních údajů. Platba proběhne na místě.
                       </p>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-mafia-gold/20 border-2 border-mafia-gold flex items-center justify-center mb-4">
                <CheckCircle size={40} className="text-mafia-gold" />
              </div>
              <h3 className="text-3xl font-heading font-black text-white uppercase tracking-widest">
                {lang === 'cs' ? 'Rezervace potvrzena!' : 'Booking Confirmed!'}
              </h3>
              <p className="text-white/60 max-w-md">
                Těšíme se na vás <strong>{new Date(selectedDate).toLocaleDateString()} v {selectedTime}</strong>. Potvrzení jsme vám odeslali na e-mail.
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a 
                  href={generateGoogleCalendarUrl()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  <CalendarIcon size={18} /> Google Kalendář
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Hotovo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {step < 5 && (
        <div className="bg-mafia-dark/80 border-t border-mafia-gold/20 p-6 flex items-center justify-between z-10 relative">
          <button 
            onClick={handleBack} 
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-widest transition-colors ${
              step === 1 ? 'opacity-30 cursor-not-allowed text-white/50' : 'text-white hover:text-mafia-gold'
            }`}
          >
            <ChevronLeft size={16} /> {lang === 'cs' ? 'Zpět' : 'Back'}
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={
                (step === 1 && !selectedService) || 
                (step === 2 && !selectedBarber) || 
                (step === 3 && (!selectedDate || !selectedTime))
              }
              className={`flex items-center gap-2 px-8 py-3 bg-mafia-gold text-black font-bold uppercase tracking-widest transition-all ${
                (step === 1 && !selectedService) || 
                (step === 2 && !selectedBarber) || 
                (step === 3 && (!selectedDate || !selectedTime))
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.4)]'
              }`}
            >
              {lang === 'cs' ? 'Pokračovat' : 'Next'} <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              form="booking-form"
              disabled={loading || !formData.name || !formData.email || !formData.phone}
              className={`flex items-center gap-2 px-8 py-3 bg-mafia-gold text-black font-bold uppercase tracking-widest transition-all ${
                loading || !formData.name || !formData.email || !formData.phone
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white hover:scale-105 shadow-[0_0_15px_rgba(var(--color-mafia-gold-rgb),0.4)]'
              }`}
            >
              {loading ? (lang === 'cs' ? 'Odesílám...' : 'Sending...') : (lang === 'cs' ? 'Potvrdit rezervaci' : 'Confirm Booking')} <CheckCircle size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
