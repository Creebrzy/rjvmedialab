'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const statusColor: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  confirmed: 'text-green-400 border-green-400/20 bg-green-400/10',
  cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
  completed: 'text-white/40 border-white/10 bg-white/5',
};

export default function ProfilePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) { router.push('/sign-in'); return; }
    if (isSignedIn) {
      fetch('/api/bookings').then(r => r.json()).then(data => { setBookings(data); setLoading(false); });
    }
  }, [isSignedIn, isLoaded]);

  async function cancelBooking(id: string) {
    await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'cancelled' }) });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  }

  const upcoming = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed' && new Date(b.date) >= new Date());
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || new Date(b.date) < new Date());

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <div className="flex items-end justify-between mb-16">
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white">MY<br /><span className="text-gold">SESSIONS</span></h1>
            <a href="/booking" className="bg-gold text-void font-display text-lg px-8 py-3 tracking-widest hover:bg-gold-light transition-colors">BOOK NEW</a>
          </div>
          {loading ? <div className="text-white/30 font-mono text-sm">Loading...</div> : (
            <>
              <section className="mb-16">
                <div className="font-mono text-gold text-xs tracking-widest uppercase mb-6">Upcoming Sessions ({upcoming.length})</div>
                {upcoming.length === 0 ? (
                  <div className="bg-void-2 border border-white/5 p-12 text-center">
                    <p className="text-white/30 font-mono text-sm mb-6">No upcoming sessions</p>
                    <a href="/booking" className="font-mono text-gold text-xs tracking-widest uppercase border-b border-gold pb-1">Book your first session</a>
                  </div>
                ) : upcoming.map(b => (
                  <div key={b.id} className="bg-void-2 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-void-3 transition-colors mb-px">
                    <div>
                      <div className="font-display text-xl text-white mb-1">{b.service?.name}</div>
                      <div className="font-mono text-white/40 text-xs">{b.date} · {b.start_time} - {b.end_time}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`font-mono text-xs px-3 py-1 border rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                      <span className="font-display text-2xl text-gold">${b.total_price}</span>
                      {b.status === 'pending' && (
                        <button onClick={() => cancelBooking(b.id)} className="font-mono text-xs text-white/30 hover:text-red-400 transition-colors tracking-widest uppercase">Cancel</button>
                      )}
                    </div>
                  </div>
                ))}
              </section>
              {past.length > 0 && (
                <section>
                  <div className="font-mono text-white/30 text-xs tracking-widest uppercase mb-6">Past Sessions ({past.length})</div>
                  {past.map(b => (
                    <div key={b.id} className="bg-void-2/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-px">
                      <div>
                        <div className="font-display text-xl text-white/50 mb-1">{b.service?.name}</div>
                        <div className="font-mono text-white/20 text-xs">{b.date} · {b.start_time} - {b.end_time}</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`font-mono text-xs px-3 py-1 border rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                        <span className="font-display text-2xl text-white/30">${b.total_price}</span>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
