'use client';
import { useEffect, useState } from 'react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCustomers(data);
      setLoading(false);
    });
  }, []);

  const filtered = customers.filter(c =>
    !search ||
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="gold-line mb-4" />
      <h1 className="font-display text-5xl text-white mb-10">CUSTOMERS</h1>

      <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none placeholder-white/20 mb-8" />

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-void-2 border border-white/5 p-12 text-center text-white/20 font-mono text-sm">No customers found</div>
      ) : (
        <div className="space-y-px">
          {filtered.map(c => {
            const totalSpent = (c.bookings || []).filter((b: any) => b.status !== 'cancelled').reduce((s: number, b: any) => s + Number(b.total_price), 0);
            const isOpen = expanded === c.id;
            return (
              <div key={c.id} className="bg-void-2 hover:bg-void-3 transition-colors">
                <button onClick={() => setExpanded(isOpen ? null : c.id)}
                  className="w-full p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                  <div>
                    <div className="font-display text-xl text-white">{c.full_name || 'Unnamed'}</div>
                    <div className="font-mono text-white/30 text-xs">{c.email}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-mono text-white/30 text-xs tracking-widest uppercase">Sessions</div>
                      <div className="font-display text-2xl text-white">{(c.bookings || []).length}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white/30 text-xs tracking-widest uppercase">Total Spent</div>
                      <div className="font-display text-2xl text-gold">${totalSpent}</div>
                    </div>
                    <div className={`font-mono text-white/20 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</div>
                  </div>
                </button>
                {isOpen && (c.bookings || []).length > 0 && (
                  <div className="border-t border-white/5 px-5 pb-5">
                    <div className="font-mono text-gold text-xs tracking-widest uppercase my-4">Booking History</div>
                    <div className="space-y-2">
                      {c.bookings.map((b: any) => (
                        <div key={b.id} className="flex justify-between items-center text-sm">
                          <span className="text-white/50">{b.service?.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-white/20 text-xs">{b.date}</span>
                            <span className="font-mono text-xs text-white/30">{b.status}</span>
                            <span className="font-display text-gold">${b.total_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
