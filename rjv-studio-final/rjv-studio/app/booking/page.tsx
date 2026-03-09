'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import type { Service, Booking } from '@/lib/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  Mic, Radio, Music, Megaphone, Palette, ChevronLeft, ChevronRight,
  Clock, DollarSign, CheckCircle, ArrowRight, User
} from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, isPast, addMonths, subMonths, getDay
} from 'date-fns';
import Link from 'next/link';

const categoryIcons: Record<string, any> = {
  recording: Mic, podcast: Radio, production: Music,
  marketing: Megaphone, branding: Palette,
};

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

type Step = 'service' | 'datetime' | 'confirm' | 'success';

function calcEndTime(startTime: string, hours: number = 1): string {
  const [h, m] = startTime.split(':').map(Number);
  const end = new Date();
  end.setHours(h + hours, m);
  return format(end, 'HH:mm');
}

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchServices();
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) fetchBookedSlots();
  }, [selectedDate, selectedService]);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').eq('is_active', true).order('category');
    if (data) setServices(data);
    setLoading(false);
  }

  async function fetchBookedSlots() {
    if (!selectedDate || !selectedService) return;
    const { data } = await supabase
      .from('bookings').select('*')
      .eq('service_id', selectedService.id)
      .eq('date', format(selectedDate, 'yyyy-MM-dd'))
      .neq('status', 'cancelled');
    if (data) setBookedSlots(data);
  }

  function isSlotBooked(time: string) {
    return bookedSlots.some(b => b.start_time === time + ':00');
  }

  async function handleConfirmBooking() {
    if (!user) { toast.error('Please sign in'); router.push('/auth/login'); return; }
    if (!selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    const endTime = calcEndTime(selectedTime, selectedService.duration_hours || 1);
    const { error } = await supabase.from('bookings').insert({
      customer_id: user.id,
      service_id: selectedService.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: selectedTime + ':00',
      end_time: endTime + ':00',
      total_price: selectedService.price,
      notes: notes || null,
      status: 'pending',
    });
    setSubmitting(false);
    if (error) { toast.error('That slot was just taken. Please choose another.'); fetchBookedSlots(); return; }
    setStep('success');
    toast.success('Booking request submitted!');
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);
  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="min-h-screen bg-rjv-black">
      <nav className="sticky top-0 z-50 bg-rjv-black/90 backdrop-blur-xl border-b border-rjv-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
            <span className="text-rjv-black font-display font-semibold text-sm">R</span>
          </div>
          <span className="font-display text-lg text-rjv-text">RJV Studio</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/booking/profile" className="text-sm text-rjv-text-muted hover:text-rjv-gold flex items-center gap-1.5 transition-colors">
              <User size={14} /> My Bookings
            </Link>
          ) : (
            <Link href="/auth/login" className="text-sm text-rjv-text-muted hover:text-rjv-gold transition-colors">Sign In</Link>
          )}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {step === 'service' && (
          <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="font-display text-4xl text-rjv-text font-light mb-2">Choose a service.</h1>
            <p className="text-rjv-text-muted mb-10">Select what you would like to book at RJV Studio.</p>
            {loading ? (
              <div className="grid gap-3">{[...Array(6)].map((_, i) => <div key={i} className="h-20 skeleton rounded-bento" />)}</div>
            ) : (
              <div className="space-y-8">
                {Object.entries(grouped).map(([category, svcs]) => {
                  const Icon = categoryIcons[category] || Mic;
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={14} className="text-rjv-gold" />
                        <span className="text-xs font-mono text-rjv-text-muted uppercase tracking-widest">{category}</span>
                      </div>
                      <div className="grid gap-2">
                        {svcs.map(service => (
                          <motion.div key={service.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.998 }}
                            onClick={() => { setSelectedService(service); setStep('datetime'); }}
                            className={`flex items-center justify-between p-5 rounded-bento border cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-rjv-gold bg-rjv-gold/5' : 'border-rjv-border bg-rjv-panel hover:border-rjv-gold/40'}`}
                          >
                            <div>
                              <div className="text-rjv-text font-medium text-sm">{service.name}</div>
                              <div className="text-rjv-text-muted text-xs mt-0.5 max-w-md">{service.description}</div>
                            </div>
                            <div className="text-right ml-6 shrink-0">
                              <div className="font-display text-2xl text-rjv-gold font-light">${service.price.toFixed(0)}</div>
                              <div className="text-xs text-rjv-text-dim">{service.price_type === 'hourly' ? '/hr' : service.price_type === 'block' ? `/${service.duration_hours}hr` : 'flat'}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {step === 'datetime' && selectedService && (
          <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto px-6 py-12">
            <button onClick={() => setStep('service')} className="flex items-center gap-2 text-rjv-text-muted hover:text-rjv-gold mb-8 transition-colors text-sm">
              <ChevronLeft size={16} /> Back to services
            </button>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-display text-3xl text-rjv-text font-light mb-6">Pick a date.</h2>
                <div className="bg-rjv-panel border border-rjv-border rounded-bento p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:text-rjv-gold transition-colors text-rjv-text-muted"><ChevronLeft size={16} /></button>
                    <span className="font-mono text-sm text-rjv-text">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:text-rjv-gold transition-colors text-rjv-text-muted"><ChevronRight size={16} /></button>
                  </div>
                  <div className="grid grid-cols-7 mb-2">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-xs font-mono text-rjv-text-dim py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(startPad)].map((_, i) => <div key={`pad-${i}`} />)}
                    {monthDays.map(day => {
                      const past = isPast(day) && !isToday(day);
                      const selected = selectedDate && isSameDay(day, selectedDate);
                      const today = isToday(day);
                      return (
                        <button key={day.toISOString()} disabled={past} onClick={() => setSelectedDate(day)}
                          className={`cal-slot text-xs ${past ? 'booked' : selected ? 'selected' : today ? 'available today ring-1 ring-rjv-gold/30' : 'available'}`}>
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-display text-3xl text-rjv-text font-light mb-6">{selectedDate ? 'Pick a time.' : 'Select a date first.'}</h2>
                {selectedDate ? (
                  <div>
                    <p className="text-xs text-rjv-text-muted font-mono mb-4">{format(selectedDate, 'EEEE, MMMM d')} - {selectedService.duration_hours || 1}hr session</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(time => {
                        const booked = isSlotBooked(time);
                        const selected = selectedTime === time;
                        return (
                          <button key={time} disabled={booked} onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-[10px] text-xs font-mono transition-all border ${booked ? 'border-rjv-border bg-rjv-void text-rjv-text-dim cursor-not-allowed' : selected ? 'border-rjv-gold bg-rjv-gold/10 text-rjv-gold' : 'border-rjv-border bg-rjv-panel text-rjv-text hover:border-rjv-gold/50 hover:text-rjv-gold'}`}>
                            {time}
                            {booked && <span className="block text-[9px] text-rjv-text-dim mt-0.5">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                    {selectedTime && (
                      <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setStep('confirm')}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-gold-gradient text-rjv-black font-medium py-3.5 rounded-pill hover:shadow-gold transition-all">
                        Continue to Review <ArrowRight size={15} />
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-rjv-text-dim text-sm">Choose a date to see available times</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && selectedService && selectedDate && selectedTime && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="max-w-lg mx-auto px-6 py-12">
            <button onClick={() => setStep('datetime')} className="flex items-center gap-2 text-rjv-text-muted hover:text-rjv-gold mb-8 transition-colors text-sm">
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="font-display text-3xl text-rjv-text font-light mb-8">Confirm booking.</h2>
            <div className="glass-gold rounded-[20px] p-8 mb-6">
              <div className="space-y-5">
                <div className="flex items-start gap-3 pb-5 border-b border-rjv-gold/10">
                  <div className="w-10 h-10 rounded-xl bg-rjv-gold/10 flex items-center justify-center shrink-0">
                    {(() => { const Icon = categoryIcons[selectedService.category]; return <Icon size={18} className="text-rjv-gold" />; })()}
                  </div>
                  <div>
                    <div className="text-rjv-text font-medium">{selectedService.name}</div>
                    <div className="text-xs text-rjv-text-muted mt-0.5">{selectedService.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={15} className="text-rjv-gold" />
                  <span className="text-rjv-text-muted">Date and Time</span>
                  <span className="ml-auto text-rjv-text font-mono text-xs text-right">
                    {format(selectedDate, 'EEE, MMM d')}<br />{selectedTime} to {calcEndTime(selectedTime, selectedService.duration_hours || 1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign size={15} className="text-rjv-gold" />
                  <span className="text-rjv-text-muted">Total</span>
                  <span className="ml-auto font-display text-2xl text-rjv-gold font-light">${selectedService.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-rjv-gold/10">
                <label className="text-xs text-rjv-text-muted font-mono uppercase tracking-wider block mb-2">Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any details about your project..." rows={3}
                  className="w-full bg-rjv-black/40 border border-rjv-border rounded-[12px] px-4 py-3 text-rjv-text placeholder:text-rjv-text-dim text-sm focus:border-rjv-gold focus:outline-none transition-colors resize-none" />
              </div>
            </div>
            {!user && (
              <div className="bg-rjv-panel border border-rjv-border rounded-[12px] p-4 mb-4 flex items-start gap-3">
                <div className="text-rjv-gold mt-0.5">!</div>
                <div>
                  <div className="text-sm text-rjv-text mb-1">Sign in required</div>
                  <div className="text-xs text-rjv-text-muted">
                    <Link href="/auth/login" className="text-rjv-gold hover:underline">Sign in or create an account</Link> to confirm your booking.
                  </div>
                </div>
              </div>
            )}
            <button onClick={handleConfirmBooking} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-rjv-black font-medium py-4 rounded-pill hover:shadow-gold transition-all disabled:opacity-60 text-base">
              {submitting ? <div className="w-4 h-4 border-2 border-rjv-black border-t-transparent rounded-full animate-spin" /> : <><CheckCircle size={17} /> Confirm Booking</>}
            </button>
            <p className="text-center text-xs text-rjv-text-dim mt-3">You will receive a confirmation once the studio approves.</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto px-6 py-24 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-rjv-gold/10 border border-rjv-gold/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-rjv-gold" />
            </motion.div>
            <h2 className="font-display text-4xl text-rjv-text font-light mb-3">You are booked.</h2>
            <p className="text-rjv-text-muted mb-8 text-sm leading-relaxed">Your session request is pending studio confirmation. You will receive an email once approved.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setStep('service'); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); }}
                className="bg-gold-gradient text-rjv-black font-medium py-3 rounded-pill hover:shadow-gold transition-all">
                Book Another Session
              </button>
              <Link href="/booking/profile" className="border border-rjv-border text-rjv-text py-3 rounded-pill hover:border-rjv-gold transition-all text-sm">
                View My Bookings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
