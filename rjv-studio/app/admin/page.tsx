'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import type { BookingWithDetails, DashboardStats } from '@/lib/types';
import { format, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { Calendar, DollarSign, Clock, TrendingUp, CheckCircle, AlertCircle, Mic, Radio, Music, Megaphone, Palette } from 'lucide-react';
import Link from 'next/link';

const catIcons: Record<string, any> = {
  recording: Mic, podcast: Radio, production: Music,
  marketing: Megaphone, branding: Palette,
};

const statusColor: Record<string, string> = {
  pending: 'badge-pending', confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled', completed: 'badge-completed',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const now = new Date();
    const weekStart = format(startOfWeek(now), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(now), 'yyyy-MM-dd');
    const monthStart = format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd');

    const [{ data: allBookings }, { data: weekBookings }, { data: monthRevenue }] = await Promise.all([
      supabase.from('bookings').select('*, service:services(*), customer:profiles(*)').order('created_at', { ascending: false }).limit(10),
      supabase.from('bookings').select('id').gte('date', weekStart).lte('date', weekEnd).neq('status', 'cancelled'),
      supabase.from('bookings').select('total_price').gte('date', monthStart).neq('status', 'cancelled'),
    ]);

    const bookings = (allBookings || []) as BookingWithDetails[];
    setRecentBookings(bookings);
    setStats({
      total_bookings: bookings.length,
      pending_bookings: bookings.filter(b => b.status === 'pending').length,
      confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
      revenue_this_month: (monthRevenue || []).reduce((s, b) => s + Number(b.total_price), 0),
      bookings_this_week: weekBookings?.length || 0,
    });
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setRecentBookings(b => b.map(bk => bk.id === id ? { ...bk, status: status as any } : bk));
    if (stats) {
      setStats({ ...stats, pending_bookings: stats.pending_bookings - 1 });
    }
  }

  const stagger = { transition: { staggerChildren: 0.06 } };
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="font-display text-4xl text-rjv-text font-light">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}.
          </h1>
          <p className="text-rjv-text-muted text-sm mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · RJV Studio Admin
          </p>
        </motion.div>

        {/* Stats Bento Row */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Revenue This Month', value: loading ? '—' : `$${stats?.revenue_this_month.toFixed(0)}`, icon: DollarSign, accent: true },
            { label: 'Bookings This Week', value: loading ? '—' : stats?.bookings_this_week, icon: Calendar, accent: false },
            { label: 'Pending Approval', value: loading ? '—' : stats?.pending_bookings, icon: AlertCircle, accent: false },
            { label: 'Confirmed', value: loading ? '—' : stats?.confirmed_bookings, icon: CheckCircle, accent: false },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className={`p-5 rounded-bento border transition-all ${accent ? 'border-rjv-gold/20 bg-rjv-gold/5' : 'border-rjv-border bg-rjv-panel'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider">{label}</span>
                <Icon size={14} className={accent ? 'text-rjv-gold' : 'text-rjv-text-dim'} />
              </div>
              <div className={`font-display text-3xl font-light ${accent ? 'text-rjv-gold' : 'text-rjv-text'}`}>
                {loading ? <div className="w-16 h-8 skeleton" /> : value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings — takes 2 cols */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="bg-rjv-panel border border-rjv-border rounded-bento overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-rjv-border">
                <h2 className="text-sm font-medium text-rjv-text">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-xs text-rjv-gold hover:text-rjv-gold-light transition-colors">
                  View all →
                </Link>
              </div>

              {loading ? (
                <div className="p-5 space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-14 skeleton rounded-[8px]" />)}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-12 text-center text-rjv-text-muted text-sm">No bookings yet</div>
              ) : (
                <div className="divide-y divide-rjv-border">
                  {recentBookings.slice(0, 8).map(b => {
                    const Icon = catIcons[b.service?.category || 'recording'];
                    return (
                      <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-rjv-void/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-rjv-muted flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-rjv-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-rjv-text truncate">{b.customer?.full_name || b.customer?.email}</div>
                          <div className="text-xs text-rjv-text-muted truncate">{b.service?.name} · {format(new Date(b.date), 'MMM d')} at {b.start_time?.slice(0,5)}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`badge ${statusColor[b.status]}`}>
                            {b.status}
                          </span>
                          {b.status === 'pending' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateStatus(b.id, 'confirmed')}
                                className="p-1.5 rounded-[6px] bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                title="Confirm"
                              >
                                <CheckCircle size={12} />
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, 'cancelled')}
                                className="p-1.5 rounded-[6px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-mono text-rjv-text-muted shrink-0">${Number(b.total_price).toFixed(0)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item} className="space-y-3">
            <div className="bg-rjv-panel border border-rjv-border rounded-bento p-5">
              <h2 className="text-sm font-medium text-rjv-text mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { href: '/admin/bookings', label: 'Manage Bookings', sub: 'Approve, reschedule, cancel' },
                  { href: '/admin/services', label: 'Edit Services', sub: 'Update pricing & availability' },
                  { href: '/admin/customers', label: 'Customer Directory', sub: 'View client history' },
                ].map(({ href, label, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block p-3.5 rounded-[10px] border border-rjv-border hover:border-rjv-gold/40 hover:bg-rjv-gold/3 transition-all group"
                  >
                    <div className="text-sm text-rjv-text group-hover:text-rjv-gold transition-colors">{label}</div>
                    <div className="text-xs text-rjv-text-dim mt-0.5">{sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Today's schedule */}
            <div className="bg-rjv-panel border border-rjv-border rounded-bento p-5">
              <h2 className="text-sm font-medium text-rjv-text mb-4">Today's Sessions</h2>
              {loading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 skeleton rounded-[8px]" />)}</div>
              ) : (() => {
                const today = recentBookings.filter(b =>
                  isToday(new Date(b.date)) && b.status !== 'cancelled'
                );
                return today.length === 0 ? (
                  <p className="text-xs text-rjv-text-dim">No sessions scheduled today</p>
                ) : (
                  <div className="space-y-2">
                    {today.map(b => (
                      <div key={b.id} className="flex items-center gap-3 text-xs">
                        <span className="font-mono text-rjv-gold">{b.start_time?.slice(0,5)}</span>
                        <span className="text-rjv-text-muted truncate">{b.customer?.full_name}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
