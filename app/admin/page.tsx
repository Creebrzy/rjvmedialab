'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/bookings').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setBookings(data);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_price), 0),
  };

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-400',
    confirmed: 'text-green-400',
    cancelled: 'text-red-400',
    completed: 'text-white/40',
  };

  return (
    <div>
      <div className="gold-line mb-4" />
      <h1 className="font-display text-5xl text-white mb-10">DASHBOARD</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-10">
        {[
          { label: 'Total Bookings', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'Confirmed', value: stats.confirmed },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="bg-void-2 p-6">
            <div className="font-mono text-white/30 text-xs tracking-widest uppercase mb-3">{s.label}</div>
            <div className="font-display text-5xl text-gold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="font-mono text-gold text-xs tracking-widest uppercase mb-6">Recent Bookings</div>
      {loading ? (
        <div className="text-white/30 font-mono text-sm">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-void-2 border border-white/5 p-12 text-center text-white/20 font-mono text-sm">No bookings yet</div>
      ) : (
        <div className="space-y-px">
          {bookings.slice(0, 8).map(b => (
            <div key={b.id} className="bg-void-2 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-void-3 transition-colors">
              <div>
                <div className="font-display text-lg text-white">{b.service?.name}</div>
                <div className="font-mono text-white/30 text-xs">{b.customer?.full_name || b.customer?.email} · {b.date} {b.start_time}</div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`font-mono text-xs tracking-widest uppercase ${statusColor[b.status]}`}>{b.status}</span>
                <span className="font-display text-xl text-gold">${b.total_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
