'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];
const statusColor: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  confirmed: 'text-green-400 border-green-400/20 bg-green-400/10',
  cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
  completed: 'text-white/40 border-white/10 bg-white/5',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/bookings').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setBookings(data);
      setLoading(false);
    });
  }, []);

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch = !search ||
      b.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  return (
    <div>
      <div className="gold-line mb-4" />
      <h1 className="font-display text-5xl text-white mb-10">BOOKINGS</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name, email, service..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none placeholder-white/20"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', ...statusOptions].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${statusFilter === s ? 'bg-gold text-void border-gold' : 'border-white/10 text-white/40 hover:border-gold hover:text-gold'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-void-2 border border-white/5 p-12 text-center text-white/20 font-mono text-sm">No bookings found</div>
      ) : (
        <div className="space-y-px">
          {filtered.map(b => (
            <div key={b.id} className="bg-void-2 p-5 hover:bg-void-3 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="font-display text-xl text-white mb-1">{b.service?.name}</div>
                  <div className="font-mono text-white/30 text-xs mb-1">{b.customer?.full_name || 'Unknown'} · {b.customer?.email}</div>
                  <div className="font-mono text-white/20 text-xs">{b.date} · {b.start_time} – {b.end_time}</div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`font-mono text-xs px-3 py-1 border rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                  <span className="font-display text-2xl text-gold">${b.total_price}</span>
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                    className="bg-void-3 border border-white/10 text-white/60 px-3 py-1 font-mono text-xs focus:border-gold focus:outline-none">
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {b.notes && <div className="mt-3 pt-3 border-t border-white/5 font-mono text-white/30 text-xs">{b.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
