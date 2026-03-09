'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import type { BookingWithDetails } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, Mic, Radio, Music, Megaphone, Palette, LogOut, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';

const catIcons: Record<string, any> = {
  recording: Mic, podcast: Radio, production: Music,
  marketing: Megaphone, branding: Palette,
};

export default function ProfilePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const supabase = createClient();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    setUser(user);

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(prof);

    const { data } = await supabase
      .from('bookings')
      .select('*, service:services(*), customer:profiles(*)')
      .eq('customer_id', user.id)
      .order('date', { ascending: false });

    setBookings((data || []) as any);
    setLoading(false);
  }

  async function cancelBooking(id: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('status', 'pending');

    if (error) { toast.error('Could not cancel'); return; }
    toast.success('Booking cancelled');
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status: 'cancelled' } : bk));
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.date) >= now && b.status !== 'cancelled');
  const past = bookings.filter(b => new Date(b.date) < now || b.status === 'cancelled');
  const shown = tab === 'upcoming' ? upcoming : past;

  const statusColor: Record<string, string> = {
    pending: 'badge-pending', confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled', completed: 'badge-completed',
  };

  return (
    <div className="min-h-screen bg-rjv-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '200px' }} />

      <nav className="sticky top-0 z-50 bg-rjv-black/90 backdrop-blur-xl border-b border-rjv-border px-6 py-4 flex items-center justify-between">
        <Link href="/booking" className="flex items-center gap-2 text-rjv-text-muted hover:text-rjv-gold transition-colors text-sm">
          <ArrowLeft size={15} /> Book Session
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-rjv-gold/20 border border-rjv-gold/30 flex items-center justify-center">
            <span className="text-xs text-rjv-gold font-mono">{profile?.full_name?.[0]?.toUpperCase() || '?'}</span>
          </div>
          <span className="text-sm text-rjv-text hidden md:block">{profile?.full_name}</span>
          <button onClick={signOut} className="p-2 text-rjv-text-dim hover:text-rjv-red transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl text-rjv-text font-light mb-2">My Bookings.</h1>
        <p className="text-rjv-text-muted text-sm mb-8">{profile?.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Upcoming', value: upcoming.length },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length },
            { label: 'Total Spent', value: `$${bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_price), 0).toFixed(0)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-rjv-panel border border-rjv-border rounded-bento p-4 text-center">
              <div className="font-display text-2xl text-rjv-gold font-light">{value}</div>
              <div className="text-xs text-rjv-text-muted font-mono mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pill ${tab === t ? 'active' : ''}`}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton rounded-bento" />)}
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-16 text-rjv-text-muted">
            <Calendar size={32} className="mx-auto mb-3 text-rjv-text-dim" />
            <p className="text-sm">No {tab} bookings</p>
            {tab === 'upcoming' && (
              <Link href="/booking" className="inline-block mt-4 text-rjv-gold text-sm hover:underline">
                Book a session →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map(b => {
              const Icon = catIcons[b.service?.category || 'recording'];
              return (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rjv-panel border border-rjv-border rounded-bento p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rjv-muted flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-rjv-gold" />
                    </div>
                    <div>
                      <div className="text-sm text-rjv-text font-medium">{b.service?.name}</div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-rjv-text-muted">
                          <Calendar size={11} /> {format(new Date(b.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-rjv-text-muted">
                          <Clock size={11} /> {b.start_time?.slice(0,5)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-rjv-text-muted">
                          <DollarSign size={11} /> ${Number(b.total_price).toFixed(0)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${statusColor[b.status]}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {b.status === 'pending' && new Date(b.date) >= now && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="p-2 text-rjv-text-dim hover:text-rjv-red transition-colors shrink-0"
                      title="Cancel booking"
                    >
                      <X size={14} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
