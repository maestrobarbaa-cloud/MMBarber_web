import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { BarberProfile } from '@/contexts/BarberContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  barber: BarberProfile | null;
  serviceName: string;
  durationMin: number;
  price: number;
}

const CZECH_DAYS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
const CZECH_MONTHS = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, barber, serviceName, durationMin, price }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [availabilityRange, setAvailabilityRange] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen && barber) {
      setStep(1);
      setSuccess(false);
      setLoading(true);
      setDate('');
      setTime('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setAvailableTimes([]);
      setAvailabilityRange({});
      
      const start = new Date();
      const end = new Date(start);
      end.setDate(start.getDate() + 20);
      
      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      fetch(`/api/barbers/availability?barberId=${barber.id}&startDate=${startDateStr}&endDate=${endDateStr}`)
        .then(res => res.json())
        .then(data => {
          if (data.range) {
            setAvailabilityRange(data.range);
            
            // Find first available day
            let firstAvailable = '';
            for (let i = 0; i < 21; i++) {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              const dStr = d.toISOString().split('T')[0];
              if (data.range[dStr] && data.range[dStr].length > 0) {
                firstAvailable = dStr;
                break;
              }
            }
            if (firstAvailable) {
              setDate(firstAvailable);
            } else {
              setDate(startDateStr);
            }
          }
        })
        .catch(err => console.error("Error fetching range", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, barber]);

  useEffect(() => {
    if (date && availabilityRange[date]) {
      setAvailableTimes(availabilityRange[date]);
      setTime('');
    } else {
      setAvailableTimes([]);
    }
  }, [date, availabilityRange]);

  const generateDates = () => {
    const dates = [];
    const start = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const calculateEndTime = (startStr: string, duration: number) => {
    const [h, m] = startStr.split(':').map(Number);
    const totalMins = h * 60 + m + duration;
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: barber?.id,
          serviceName,
          durationMin,
          price,
          date,
          time,
          customerName,
          customerEmail,
          customerPhone,
          reminders: [{ id: '1', type: 'EMAIL', hoursBefore: 24 }]
        })
      });

      if (res.ok) {
        setSuccess(true);
        setStep(3);
        localStorage.setItem('mmbarber_preferred_service', serviceName);
      } else {
        alert('Chyba při vytváření rezervace.');
      }
    } catch (err) {
      console.error(err);
      alert('Došlo k systémové chybě.');
    } finally {
      setLoading(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    if (!date || !time) return '#';
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);
    
    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', `Střih u MMBarber (${barber?.name})`);
    url.searchParams.append('dates', `${formatDate(startDateTime)}/${formatDate(endDateTime)}`);
    url.searchParams.append('details', `Služba: ${serviceName}\nDélka: ${durationMin} min\nBarber: ${barber?.name}\n\nTěšíme se na vás!`);
    url.searchParams.append('location', 'Uherské Hradiště');
    return url.toString();
  };

  if (!isOpen || !barber) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-mafia-dark md:border border-mafia-gold/30 w-full h-full md:h-auto md:max-w-4xl md:max-h-[90vh] flex flex-col shadow-[0_0_100px_rgba(var(--color-mafia-gold-rgb),0.2)] relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex-none p-6 border-b border-mafia-gold/20 flex justify-between items-center bg-black/50">
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-black text-mafia-gold uppercase tracking-widest flex items-center gap-3">
                <Calendar className="text-mafia-gold" size={24} />
                Rezervace Termínu
              </h2>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-white/50 uppercase mt-2">
                <span>{barber.name}</span>
                <span>•</span>
                <span className="text-mafia-gold">{serviceName}</span>
                <span>•</span>
                <span>{durationMin} min</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/50 hover:text-mafia-red hover:bg-mafia-red/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {/* Date Slider */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-4">1. Vyberte Datum</h3>
                  <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory hide-scrollbar">
                    {generateDates().map(d => {
                      const dateStr = d.toISOString().split('T')[0];
                      const isSelected = date === dateStr;
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                      const isFull = availabilityRange[dateStr] && availabilityRange[dateStr].length === 0;
                      
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setDate(dateStr)}
                          className={`snap-start flex-none w-20 h-24 flex flex-col items-center justify-center border transition-all duration-300 relative ${
                            isSelected 
                              ? 'bg-mafia-gold border-mafia-gold text-black shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)] scale-105 z-10' 
                              : (isFull ? 'bg-black/80 border-mafia-red/20 opacity-50' : 'bg-black/50 border-white/10 text-white hover:border-mafia-gold/50 hover:bg-white/5')
                          }`}
                        >
                          {isFull && !isSelected && (
                             <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-mafia-red text-[10px] font-black uppercase tracking-widest -rotate-45 pointer-events-none">Plno</span>
                          )}
                          <span className={`text-[10px] uppercase font-mono ${isSelected ? 'text-black/60' : (isWeekend ? 'text-mafia-red/70' : 'text-white/40')}`}>
                            {CZECH_DAYS[d.getDay()]}
                          </span>
                          <span className={`text-2xl font-heading font-black mt-1 ${isFull && !isSelected ? 'opacity-20' : ''}`}>{d.getDate()}</span>
                          <span className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-black/80' : 'text-white/40'} ${isFull && !isSelected ? 'opacity-20' : ''}`}>
                            {CZECH_MONTHS[d.getMonth()].substring(0, 3)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Grid */}
                <div className={`transition-opacity duration-500 ${!date ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-4 flex items-center justify-between">
                    <span>2. Vyberte Čas</span>
                    {loading && <span className="text-[10px] text-mafia-gold animate-pulse">Načítám časy...</span>}
                  </h3>
                  
                  {date && !loading && availableTimes.length === 0 ? (
                    <div className="p-8 border border-white/10 bg-black/50 text-center text-white/50 font-mono uppercase text-xs">
                      Pro tento den nejsou k dispozici žádné volné termíny. Zkuste prosím jiné datum.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimes.map(t => {
                        const endTime = calculateEndTime(t, durationMin);
                        const isSelected = time === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`flex flex-col items-center justify-center p-3 border transition-all duration-300 ${
                              isSelected
                                ? 'bg-mafia-gold border-mafia-gold text-black shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.3)]'
                                : 'bg-black/50 border-white/10 text-white hover:border-mafia-gold/50'
                            }`}
                          >
                            <span className="text-xl font-heading font-black">{t}</span>
                            <span className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-black/60' : 'text-white/40'}`}>
                              do {endTime}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-mafia-gold/10 border border-mafia-gold/30 p-4 flex justify-between items-center mb-8">
                  <div>
                    <p className="text-[10px] font-mono text-mafia-gold uppercase tracking-widest">Zvolený termín</p>
                    <p className="text-xl font-heading font-black text-white">{date.split('-').reverse().join('.')} v {time}</p>
                    <p className="text-sm text-white/50 font-mono mt-1">Konec cca {calculateEndTime(time, durationMin)}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs uppercase font-mono text-white/50 hover:text-mafia-gold underline">Změnit</button>
                </div>

                <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Jméno a Příjmení</label>
                    <input required type="text" placeholder="Jan Novák" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-black/50 border border-white/20 p-4 text-white focus:border-mafia-gold outline-none font-sans text-lg transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Telefonní číslo</label>
                      <input required type="tel" placeholder="+420 123 456 789" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-black/50 border border-white/20 p-4 text-white focus:border-mafia-gold outline-none font-sans text-lg transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest flex items-center gap-2"><Mail size={12}/> E-mailová adresa</label>
                      <input required type="email" placeholder="jan@novak.cz" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-black/50 border border-white/20 p-4 text-white focus:border-mafia-gold outline-none font-sans text-lg transition-colors" />
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                     <p className="text-[10px] text-white/40 italic">Odesláním souhlasíte se zpracováním osobních údajů pro účely vyřízení rezervace.</p>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 flex flex-col items-center max-w-xl mx-auto">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-mafia-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="text-mafia-gold" size={48} />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-heading font-black text-mafia-gold uppercase mb-4 tracking-widest">Místo Zajištěno</h2>
                <p className="text-white/60 mb-8 text-lg font-light">
                  Vaše křeslo u barbera <strong className="text-white">{barber.name}</strong> je rezervováno na <strong className="text-white">{date.split('-').reverse().join('.')}</strong> v <strong className="text-white">{time}</strong>. Očekávaný konec služby je v {calculateEndTime(time, durationMin)}.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <a 
                    href={generateGoogleCalendarUrl()} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                  >
                    <Calendar size={20} /> Do Kalendáře
                  </a>
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Zavřít
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Footer Nav */}
          {step !== 3 && (
            <div className="flex-none p-6 border-t border-mafia-gold/20 bg-black/50 flex justify-between items-center">
              <div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-white/50 hover:text-white flex items-center gap-2 text-xs uppercase font-mono tracking-widest">
                    <ChevronLeft size={16} /> Zpět na výběr času
                  </button>
                )}
              </div>
              <div>
                {step === 1 ? (
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!date || !time}
                    className="bg-mafia-gold text-black px-8 py-3 font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  >
                    Pokračovat <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    form="booking-form"
                    disabled={loading || !customerName || !customerPhone || !customerEmail}
                    className="bg-mafia-gold text-black px-8 py-3 font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors shadow-[0_0_20px_rgba(var(--color-mafia-gold-rgb),0.4)]"
                  >
                    {loading ? 'Zpracovávám...' : 'Potvrdit Rezervaci'}
                  </button>
                )}
              </div>
            </div>
          )}
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
