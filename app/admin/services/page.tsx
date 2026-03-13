'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react';
import type { Service } from '@/lib/types';

const blank: Partial<Service> = { name: '', description: '', category: 'recording', price_type: 'hourly', price: 0, duration_hours: 1, is_active: true };

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/services').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setServices(data);
      setLoading(false);
    });
  }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? 'PATCH' : 'POST';
    const res = await fetch('/api/admin/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    const data = await res.json();
    if (editing.id) {
      setServices(prev => prev.map(s => s.id === data.id ? data : s));
    } else {
      setServices(prev => [...prev, data]);
    }
    setSaving(false);
    setEditing(null);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch('/api/admin/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !current }),
    });
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s));
  }

  return (
    <div>
      <div className="gold-line mb-4" />
      <div className="flex items-end justify-between mb-10">
        <h1 className="font-display text-5xl text-white">SERVICES</h1>
        <button onClick={() => setEditing(blank)}
          className="flex items-center gap-2 bg-gold text-void font-mono text-xs px-5 py-3 tracking-widest uppercase hover:bg-gold-light transition-colors">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 font-mono text-sm">Loading...</div>
      ) : (
        <div className="space-y-px">
          {services.map(s => (
            <div key={s.id} className={`bg-void-2 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-void-3 transition-colors ${!s.is_active ? 'opacity-40' : ''}`}>
              <div className="flex-1">
                <div className="font-mono text-gold/50 text-xs tracking-widest uppercase mb-1">{s.category} · {s.price_type}</div>
                <div className="font-display text-xl text-white">{s.name}</div>
                <div className="font-mono text-white/30 text-xs mt-1 line-clamp-1">{s.description}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-gold">${s.price}</span>
                <button onClick={() => toggleActive(s.id, s.is_active)} className="text-white/30 hover:text-gold transition-colors">
                  {s.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setEditing(s)} className="text-white/30 hover:text-gold transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-void/90 z-50 flex items-center justify-center p-6">
          <div className="bg-void-2 border border-white/10 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-3xl text-white mb-6">{editing.id ? 'EDIT' : 'ADD'} SERVICE</h2>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Name</label>
                <input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Description</label>
                <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={3} className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Category</label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as any })}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none">
                    {['recording','podcast','production','marketing','branding'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Price Type</label>
                  <select value={editing.price_type} onChange={e => setEditing({ ...editing, price_type: e.target.value as any })}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none">
                    {['hourly','block','flat'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Price ($)</label>
                  <input type="number" value={editing.price || ''} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="font-mono text-gold text-xs tracking-widest uppercase block mb-2">Duration (hrs)</label>
                  <input type="number" value={editing.duration_hours || ''} onChange={e => setEditing({ ...editing, duration_hours: Number(e.target.value) })}
                    className="w-full bg-void-3 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-gold focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditing(null)} className="flex-1 border border-white/10 text-white/40 font-mono text-sm py-3 hover:border-gold hover:text-gold transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-gold text-void font-display text-xl py-3 tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50">
                {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
