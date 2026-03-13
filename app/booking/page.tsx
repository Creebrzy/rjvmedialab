'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import type { Service } from '@/lib/types';

const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

function calcEnd(start: string, hrs: number): string {
  const [h, m] = start.split(':').map(Number);
  const end = new Date(2000, 0, 1, h + hrs, m);
  return `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
}

export default function BookingPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [hours, setHours] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  const totalPrice = selected
    ? selected.price_type === 'hourly' ? selected.price * hours : selected.price
    : 0;

  async function handleSubmit() {
    if (!isSignedIn) { router.push('/sign-in?redirect_url=/booking'); return; }
    if (!selected || !date || !startTime) { setError('Please fill all required fields.'); return; }
    setLoading(true); setError('');
    const endTime = calcEnd(startTime, selected.duration_hours || hours);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: selected.id,
        date, start_time: startTime, end_time: endTime,
        total_price: totalPrice, notes,
        email: user?.primaryEmailAddress?.emailAddress,
        full_name: user?.fullName || '',
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || 'Booking failed'); return; }
    setSuccess(true);
  }

  if (success) return (
    <>
      <Nav />
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <div className="w-16 h-16 bg-gold/10 border border-gold flex items-center justify-center mx-auto mb-8">
            <div className="w-3 h-3 bg-gold rounded-full" />
          </div>
          <h2 className="font-display text-6xl text-white mb-4">BOOKED<span className="text-gold">.</span></h2>
          <p className="text-white/50 mb-8">Your session request has been submitted. We will confirm within 24 hours at booking@rjvmedialab.com</p>
          <div className="bg-void-2 border border-white/10 p-6 text-left mb-8">
            <div className="font-mono text-gold text-xs tracking-widest mb-4">SESSION DETAILS</div>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between"><span>Service</span><span className="text-white">{selected?.name}</span></div>
              <div className="flex justify-between"><span>Date</span><span className="text-white">{date}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-white">{startTime}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span>Total</span><span className="text-gold font-display text-xl">${totalPrice}</span></div>
            </div>
          </div>
          <a href="/" className="inline-block bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors">BACK TO HOME</a>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-white mb-4">
            BOOK A<br /><span className="text-gold">SESSION</span>
          </h1>
          <div className="flex gap-2 mb-16">
            {[1,2,3].map(n => (
              <div key={n} className={`h-1 flex-1 transition-colors ${step >= n ? 'bg-gold' : 'bg-white/10'}`} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-8">SELECT A SERVICE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 mb-8">
                {services.map(service => (
                  <button key={service.id} onClick={() => { setSelected(service); setHours(service.duration_hours || 1); }}
                    className={`bg-void-2 p-6 text-left hover:bg-void-3 transition-colors group ${selected?.id === service.id ? 'border-l-2 border-gold' : ''}`}>
                    <div className="font-mono text-xs tracking-widest uppercase text-gold/60 mb-2">{service.category}</div>
                    <div className={`font-display text-xl mb-2 transition-colors ${selected?.id === service.id ? 'text-gold' : 'text-white group-hover:text-gold'}`}>{service.name}</div>
                    <div className="font-display text-3xl text-white">${service.price}<span className="font-mono text-white/30 text-sm ml-1">{service.price_type === 'hourly' ? '/hr' : ''}</span></div>
                  </button>
                ))}
              </div>
              <button onClick={() => { if (selected) setStep(2); }} disabled={!selected}
                className="bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                CONTINUE
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-8">PICK DATE & TIME</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-3">Date</label>
                  <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-3">Start Time</label>
                  <select value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none">
                    <option value="">Select time</option>
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {selected?.price_type === 'hourly' && (
                  <div>
                    <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-3">Hours</label>
                    <select value={hours} onChange={e => setHours(Number(e.target.value))}
                      className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none">
                      {[1,2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-3">Notes (optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Any special requests or project details..."
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none resize-none placeholder-white/20" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="border border-white/20 text-white/60 font-mono text-sm px-8 py-4 tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">Back</button>
                <button onClick={() => { if (date && startTime) setStep(3); }} disabled={!date || !startTime}
                  className="bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  CONTINUE
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-3xl text-white mb-8">CONFIRM BOOKING</h2>
              <div className="bg-void-2 border border-white/10 p-8 mb-8">
                <div className="font-mono text-gold text-xs tracking-widest mb-6">SESSION SUMMARY</div>
                <div className="space-y-4">
                  {[['Service', selected?.name || ''], ['Date', date], ['Start Time', startTime], ['End Time', calcEnd(startTime, selected?.duration_hours || hours)]].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-white/40 text-sm font-mono">{label}</span>
                      <span className="text-white text-sm">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span className="text-white/40 font-mono text-sm">Total</span>
                    <span className="font-display text-4xl text-gold">${totalPrice}</span>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-400 font-mono text-sm mb-4">{error}</p>}
              {!isSignedIn && (
                <p className="text-white/50 font-mono text-sm mb-6">
                  You need to <a href="/sign-in" className="text-gold underline">sign in</a> to complete your booking.
                </p>
              )}
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="border border-white/20 text-white/60 font-mono text-sm px-8 py-4 tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">Back</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50">
                  {loading ? 'BOOKING...' : 'CONFIRM BOOKING'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
