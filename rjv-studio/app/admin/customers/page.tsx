'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import type { Profile, Booking } from '@/lib/types';
import { format } from 'date-fns';
import { Search, ChevronDown, ChevronUp, Calendar, DollarSign, User } from 'lucide-react';

interface CustomerWithStats extends Profile {
  total_bookings: number;
  total_spent: number;
  last_booking?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Record<string, Booking[]>>({});
  const supabase = createClient();

  useEffect(() => { fetchCustomers(); }, []);

  async function fetchCustomers() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (!profiles) { setLoading(false); return; }

    // Get booking stats per customer
    const { data: bookings } = await supabase
      .from('bookings')
      .select('customer_id, total_price, date, status')
      .neq('status', 'cancelled');

    const statsMap: Record<string, { count: number; spent: number; last: string }> = {};
    (bookings || []).forEach(b => {
      if (!statsMap[b.customer_id]) statsMap[b.customer_id] = { count: 0, spent: 0, last: '' };
      statsMap[b.customer_id].count++;
      statsMap[b.customer_id].spent += Number(b.total_price);
      if (!statsMap[b.customer_id].last || b.date > statsMap[b.customer_id].last) {
        statsMap[b.customer_id].last = b.date;
      }
    });

    setCustomers(profiles.map(p => ({
      ...p,
      total_bookings: statsMap[p.id]?.count || 0,
      total_spent: statsMap[p.id]?.spent || 0,
      last_booking: statsMap[p.id]?.last,
    })));
    setLoading(false);
  }

  async function loadBookings(customerId: string) {
    if (customerBookings[customerId]) return;
    const { data } = await supabase
      .from('bookings')
      .select('*, service:services(name, category)')
      .eq('customer_id', customerId)
      .order('date', { ascending: false })
      .limit(10);
    setCustomerBookings(cb => ({ ...cb, [customerId]: data || [] }));
  }

  function toggleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      loadBookings(id);
    }
  }

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q);
  });

  const statusColor: Record<string, string> = {
    pending: 'text-rjv-gold', confirmed: 'text-green-400',
    cancelled: 'text-red-400', completed: 'text-blue-400',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-rjv-text font-light">Customers.</h1>
        <p className="text-rjv-text-muted text-sm mt-1">{customers.length} registered clients</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rjv-text-dim" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-9 pr-4 py-2.5 bg-rjv-panel border border-rjv-border rounded-[10px] text-sm text-rjv-text placeholder:text-rjv-text-dim focus:border-rjv-gold focus:outline-none transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(8)].map((_, i) => <div key={i} className="h-16 skeleton rounded-bento" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-rjv-text-muted text-sm">
          <User size={28} className="mx-auto mb-3 text-rjv-text-dim" />
          No customers found
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div key={c.id} className="bg-rjv-panel border border-rjv-border rounded-bento overflow-hidden">
              <button
                onClick={() => toggleExpand(c.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-rjv-void/40 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-rjv-muted border border-rjv-border flex items-center justify-center shrink-0">
                  <span className="text-sm text-rjv-gold font-mono">{c.full_name?.[0]?.toUpperCase() || '?'}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-rjv-text font-medium">{c.full_name || 'No name'}</div>
                  <div className="text-xs text-rjv-text-muted">{c.email}</div>
                </div>

                <div className="hidden md:flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-rjv-text-dim font-mono mb-0.5">Bookings</div>
                    <div className="text-sm font-mono text-rjv-text">{c.total_bookings}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-rjv-text-dim font-mono mb-0.5">Total Spent</div>
                    <div className="text-sm font-mono text-rjv-gold">${c.total_spent.toFixed(0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-rjv-text-dim font-mono mb-0.5">Last Session</div>
                    <div className="text-sm font-mono text-rjv-text">
                      {c.last_booking ? format(new Date(c.last_booking), 'MMM d') : '—'}
                    </div>
                  </div>
                </div>

                <div className="ml-2 text-rjv-text-dim">
                  {expanded === c.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {expanded === c.id && (
                <div className="border-t border-rjv-border px-4 pb-4 pt-3">
                  {/* Mobile stats */}
                  <div className="md:hidden flex gap-4 mb-4 text-xs font-mono">
                    <span className="text-rjv-text-dim">{c.total_bookings} bookings</span>
                    <span className="text-rjv-gold">${c.total_spent.toFixed(0)} spent</span>
                    {c.phone && <span className="text-rjv-text-muted">{c.phone}</span>}
                  </div>

                  <div className="text-xs font-mono text-rjv-text-dim uppercase tracking-wider mb-3">Booking History</div>
                  {!customerBookings[c.id] ? (
                    <div className="space-y-1">{[...Array(3)].map((_, i) => <div key={i} className="h-8 skeleton rounded-[6px]" />)}</div>
                  ) : customerBookings[c.id].length === 0 ? (
                    <div className="text-xs text-rjv-text-dim">No bookings yet</div>
                  ) : (
                    <div className="space-y-1.5">
                      {customerBookings[c.id].map((b: any) => (
                        <div key={b.id} className="flex items-center gap-3 text-xs py-1.5 border-b border-rjv-border last:border-0">
                          <span className="font-mono text-rjv-text-muted w-20 shrink-0">{format(new Date(b.date), 'MMM d, yy')}</span>
                          <span className="text-rjv-text flex-1 truncate">{b.service?.name}</span>
                          <span className={`font-mono ${statusColor[b.status]}`}>{b.status}</span>
                          <span className="font-mono text-rjv-text-muted">${Number(b.total_price).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
