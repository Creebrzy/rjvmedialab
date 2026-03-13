'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, Settings, Image, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/bookings').then(r => r.json()),
      fetch('/api/admin/customers').then(r => r.json()),
      fetch('/api/admin/media').then(r => r.json()),
    ]).then(([b, c, m]) => {
      if (Array.isArray(b)) setBookings(b);
      if (Array.isArray(c)) setCustomers(c);
      if (Array.isArray(m)) setMedia(m);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_price), 0),
    thisMonth: bookings.filter(b => {
      const d = new Date(b.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    completed: 'text-white/40 bg-white/5',
  };

  const quickLinks = [
    { href: '/admin/bookings', label: 'Manage Bookings', icon: Calendar, count: stats.pending, countLabel: 'pending' },
    { href: '/admin/customers', label: 'View Customers', icon: Users, count: customers.length, countLabel: 'total' },
    { href: '/admin/services', label: 'Edit Services', icon: Settings, count: null, countLabel: '' },
    { href: '/admin/media', label: 'Upload Photos', icon: Image, count: media.length, countLabel: 'photos' },
  ];

  return (
    <div>
      <div className="gold-line mb-4" />
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-display text-5xl text-white">DASHBOARD</h1>
          <p className="font-mono text-white/20 text-xs tracking-widest mt-2">RJV Media Lab · Sound Fader Inc.</p>
        </div>
        <Link href="/" className="font-mono text-gold text-xs tracking-widest uppercase border-b border-gold pb-1 hover:text-gold-light transition-colors">
          View Site →
        </Link>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-8">
        {[
          { label: 'Total Bookings', value: stats.total, icon: Calendar, sub: `${stats.thisMonth} this month` },
          { label: 'Pending Review', value: stats.pending, icon: AlertCircle, sub: `${stats.confirmed} confirmed` },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, sub: `${stats.cancelled} cancelled` },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, sub: 'excl. cancellations' },
        ].map(s => (
          <div key={s.label} className="bg-void-2 p-6 group hover:bg-void-3 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="font-mono text-white/30 text-xs tracking-widest uppercase">{s.label}</div>
              <s.icon size={14} className="text-gold/40" />
            </div>
            <div className="font-display text-5xl text-gold mb-2">{loading ? '—' : s.value}</div>
            <div className="font-mono text-white/20 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick links */}
        <div className="lg:col-span-1">
          <div className="font-mono text-gold text-xs tracking-widest uppercase mb-4">Quick Actions</div>
          <div className="space-y-px">
            {quickLinks.map(({ href, label, icon: Icon, count, countLabel }) => (
              <Link key={href} href={href} className="flex items-center justify-between bg-void-2 hover:bg-void-3 border border-white/5 hover:border-gold/30 p-4 transition-colors group">
                <div className="flex items-center gap-3">
                  <Icon size={14} className="text-gold" />
                  <span className="font-mono text-sm text-white/60 group-hover:text-white transition-colors tracking-wider">{label}</span>
                </div>
                {count !== null && (
                  <span className="font-display text-lg text-gold">{loading ? '—' : `${count}`}<span className="font-mono text-xs text-white/20 ml-1">{countLabel}</span></span>
                )}
              </Link>
            ))}
          </div>

          {/* Status breakdown */}
          <div className="mt-6">
            <div className="font-mono text-gold text-xs tracking-widest uppercase mb-4">Booking Status</div>
            <div className="space-y-2">
              {[
                { label: 'Pending', count: stats.pending, color: 'bg-yellow-400' },
                { label: 'Confirmed', count: stats.confirmed, color: 'bg-green-400' },
                { label: 'Completed', count: stats.completed, color: 'bg-white/40' },
                { label: 'Cancelled', count: stats.cancelled, color: 'bg-red-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex-1 bg-void-3 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: stats.total ? `${(count / stats.total) * 100}%` : '0%' }} />
                  </div>
                  <div className="flex items-center gap-2 w-24 justify-end">
                    <span className="font-mono text-white/30 text-xs">{label}</span>
                    <span className="font-display text-sm text-white">{loading ? '—' : count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-gold text-xs tracking-widest uppercase">Recent Bookings</div>
            <Link href="/admin/bookings" className="font-mono text-white/30 text-xs tracking-widest uppercase hover:text-gold transition-colors">View All →</Link>
          </div>
          {loading ? (
            <div className="bg-void-2 border border-white/5 p-8 text-center font-mono text-white/20 text-sm">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-void-2 border border-white/5 p-12 text-center">
              <Clock size={24} className="text-white/10 mx-auto mb-3" />
              <div className="font-mono text-white/20 text-sm">No bookings yet</div>
            </div>
          ) : (
            <div className="space-y-px">
              {bookings.slice(0, 8).map(b => (
                <div key={b.id} className="bg-void-2 hover:bg-void-3 transition-colors p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/5">
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base text-white truncate">{b.service?.name}</div>
                    <div className="font-mono text-white/30 text-xs mt-0.5">
                      {b.customer?.full_name || b.customer?.email} · {b.date} {b.start_time?.slice(0, 5)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`font-mono text-xs px-2 py-1 rounded tracking-widest uppercase ${statusColor[b.status]}`}>{b.status}</span>
                    <span className="font-display text-xl text-gold">${b.total_price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
