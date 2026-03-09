'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import type { BookingWithDetails, BookingStatus } from '@/lib/types';
import { format } from 'date-fns';
import {
  Search, CheckCircle, XCircle, Clock, Filter, ChevronDown,
  Calendar, DollarSign, User, Mic, Radio, Music, Megaphone, Palette, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const catIcons: Record<string, any> = {
  recording: Mic, podcast: Radio, production: Music,
  marketing: Megaphone, branding: Palette,
};

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [filterDate, setFilterDate] = useState('');
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('bookings')
      .select('*, service:services(*), customer:profiles(*)')
      .order('date', { ascending: false })
      .order('start_time', { ascending: true });

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (filterDate) query = query.eq('date', filterDate);

    const { data } = await query;
    setBookings((data || []) as BookingWithDetails[]);
    setLoading(false);
  }, [filterStatus, filterDate]);

  useEffect(() => { fetch(); }, [fetch]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase.channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetch]);

  async function updateStatus(id: string, status: BookingStatus) {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) { toast.error('Update failed'); return; }
    toast.success(`Booking ${status}`);
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk));
  }

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.customer?.full_name?.toLowerCase().includes(q) ||
      b.customer?.email?.toLowerCase().includes(q) ||
      b.service?.name?.toLowerCase().includes(q)
    );
  });

  const statusConfig: Record<string, { color: string; dot: string }> = {
    pending: { color: 'text-rjv-gold', dot: 'bg-rjv-gold' },
    confirmed: { color: 'text-green-400', dot: 'bg-green-400' },
    cancelled: { color: 'text-red-400', dot: 'bg-red-400' },
    completed: { color: 'text-blue-400', dot: 'bg-blue-400' },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-rjv-text font-light">Bookings.</h1>
          <p className="text-rjv-text-muted text-sm mt-1">{filtered.length} total</p>
        </div>
        <button onClick={fetch} className="p-2 text-rjv-text-dim hover:text-rjv-gold transition-colors" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rjv-text-dim" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients, services..."
            className="w-full pl-9 pr-4 py-2.5 bg-rjv-panel border border-rjv-border rounded-[10px] text-sm text-rjv-text placeholder:text-rjv-text-dim focus:border-rjv-gold focus:outline-none transition-colors"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="bg-rjv-panel border border-rjv-border rounded-[10px] px-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none pr-8"
        >
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="bg-rjv-panel border border-rjv-border rounded-[10px] px-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none"
        />

        {filterDate && (
          <button onClick={() => setFilterDate('')} className="text-xs text-rjv-text-muted hover:text-rjv-gold transition-colors px-2">
            Clear date
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', ...STATUSES] as const).map(s => {
          const count = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`pill whitespace-nowrap ${filterStatus === s ? 'active' : ''}`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className={`text-xs ml-1 ${filterStatus === s ? 'text-rjv-gold' : 'text-rjv-text-dim'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-rjv-panel border border-rjv-border rounded-bento overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 skeleton rounded-[8px]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-rjv-text-muted text-sm">
            <Calendar size={28} className="mx-auto mb-3 text-rjv-text-dim" />
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-rjv-border">
                  {['Client', 'Service', 'Date & Time', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-mono text-rjv-text-dim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rjv-border">
                {filtered.map(b => {
                  const Icon = catIcons[b.service?.category || 'recording'];
                  const sc = statusConfig[b.status];
                  return (
                    <motion.tr
                      key={b.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-rjv-void/50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-rjv-muted flex items-center justify-center text-xs font-mono text-rjv-gold">
                            {b.customer?.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="text-sm text-rjv-text">{b.customer?.full_name || 'Unknown'}</div>
                            <div className="text-xs text-rjv-text-dim">{b.customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Icon size={13} className="text-rjv-gold shrink-0" />
                          <span className="text-sm text-rjv-text-muted max-w-[160px] truncate">{b.service?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm text-rjv-text font-mono">{format(new Date(b.date), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-rjv-text-dim">{b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-sm text-rjv-text">${Number(b.total_price).toFixed(0)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`badge ${b.status === 'pending' ? 'badge-pending' : b.status === 'confirmed' ? 'badge-confirmed' : b.status === 'cancelled' ? 'badge-cancelled' : 'badge-completed'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${sc.dot}`} />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, 'confirmed')}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-[6px] bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              >
                                <CheckCircle size={11} /> Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, 'cancelled')}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-[6px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <XCircle size={11} /> Cancel
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => updateStatus(b.id, 'completed')}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-[6px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              <Clock size={11} /> Complete
                            </button>
                          )}
                          {(b.status === 'completed' || b.status === 'cancelled') && (
                            <span className="text-xs text-rjv-text-dim">—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes modal would go here for a future iteration */}
    </div>
  );
}
