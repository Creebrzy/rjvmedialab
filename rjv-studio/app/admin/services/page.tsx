'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import type { Service } from '@/lib/types';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, X, Check, DollarSign } from 'lucide-react';

const CATEGORIES = ['recording', 'podcast', 'production', 'marketing', 'branding'] as const;
const PRICE_TYPES = ['hourly', 'block', 'flat'] as const;

const emptyForm: Omit<Service, 'id' | 'created_at'> = {
  name: '', description: '', category: 'recording',
  price_type: 'hourly', price: 0, duration_hours: 1, is_active: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('category').order('price');
    setServices(data || []);
    setLoading(false);
  }

  function openCreate() {
    setForm(emptyForm);
    setEditId(null);
    setModal('create');
  }

  function openEdit(s: Service) {
    setForm({ name: s.name, description: s.description, category: s.category, price_type: s.price_type, price: s.price, duration_hours: s.duration_hours, is_active: s.is_active });
    setEditId(s.id);
    setModal('edit');
  }

  async function handleSave() {
    if (!form.name || form.price <= 0) { toast.error('Name and price are required'); return; }
    setSaving(true);

    if (modal === 'create') {
      const { error } = await supabase.from('services').insert(form);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Service created');
    } else if (editId) {
      const { error } = await supabase.from('services').update(form).eq('id', editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Service updated');
    }

    setSaving(false);
    setModal(null);
    fetchServices();
  }

  async function toggleActive(s: Service) {
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    setServices(svcs => svcs.map(sv => sv.id === s.id ? { ...sv, is_active: !sv.is_active } : sv));
    toast.success(s.is_active ? 'Service hidden' : 'Service visible');
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) { toast.error('Could not delete — it may have active bookings'); return; }
    toast.success('Deleted');
    setServices(s => s.filter(sv => sv.id !== id));
  }

  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-rjv-text font-light">Services.</h1>
          <p className="text-rjv-text-muted text-sm mt-1">{services.length} services configured</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gold-gradient text-rjv-black text-sm font-medium px-5 py-2.5 rounded-pill hover:shadow-gold transition-all"
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-16 skeleton rounded-bento" />)}</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, svcs]) => (
            <div key={cat}>
              <div className="text-xs font-mono text-rjv-text-muted uppercase tracking-widest mb-3">{cat}</div>
              <div className="space-y-2">
                {svcs.map(s => (
                  <motion.div
                    key={s.id}
                    layout
                    className={`flex items-center gap-4 p-4 rounded-bento border transition-all ${
                      s.is_active ? 'bg-rjv-panel border-rjv-border' : 'bg-rjv-void/50 border-rjv-border opacity-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm text-rjv-text font-medium">{s.name}</span>
                        {!s.is_active && (
                          <span className="text-xs font-mono text-rjv-text-dim bg-rjv-border px-2 py-0.5 rounded-pill">Hidden</span>
                        )}
                      </div>
                      <div className="text-xs text-rjv-text-muted truncate max-w-xl">{s.description}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display text-xl text-rjv-gold font-light">
                        ${s.price}
                      </div>
                      <div className="text-xs text-rjv-text-dim font-mono">
                        {s.price_type === 'hourly' ? '/hr' : s.price_type === 'block' ? `/${s.duration_hours}hr` : 'flat'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleActive(s)}
                        className="p-2 text-rjv-text-dim hover:text-rjv-gold transition-colors"
                        title={s.is_active ? 'Hide service' : 'Show service'}
                      >
                        {s.is_active ? <ToggleRight size={18} className="text-rjv-gold" /> : <ToggleLeft size={18} />}
                      </button>
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 text-rjv-text-dim hover:text-rjv-gold transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="p-2 text-rjv-text-dim hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto bg-rjv-void border border-rjv-border rounded-[20px] p-6 shadow-panel"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-rjv-text font-light">
                  {modal === 'create' ? 'New Service' : 'Edit Service'}
                </h2>
                <button onClick={() => setModal(null)} className="text-rjv-text-dim hover:text-rjv-text transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Recording Session – Hourly"
                    className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] px-4 py-2.5 text-sm text-rjv-text placeholder:text-rjv-text-dim focus:border-rjv-gold focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2}
                    placeholder="Brief description for clients..."
                    className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] px-4 py-2.5 text-sm text-rjv-text placeholder:text-rjv-text-dim focus:border-rjv-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
                      className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] px-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Price Type</label>
                    <select
                      value={form.price_type}
                      onChange={e => setForm(f => ({ ...f, price_type: e.target.value as any }))}
                      className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] px-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none"
                    >
                      {PRICE_TYPES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Price ($)</label>
                    <div className="relative">
                      <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-rjv-text-dim" />
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] pl-8 pr-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none"
                      />
                    </div>
                  </div>
                  {form.price_type !== 'flat' && (
                    <div>
                      <label className="text-xs font-mono text-rjv-text-muted uppercase tracking-wider block mb-1.5">Duration (hrs)</label>
                      <input
                        type="number"
                        value={form.duration_hours || ''}
                        onChange={e => setForm(f => ({ ...f, duration_hours: parseInt(e.target.value) || 1 }))}
                        className="w-full bg-rjv-panel border border-rjv-border rounded-[10px] px-3 py-2.5 text-sm text-rjv-text focus:border-rjv-gold focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-rjv-border rounded-pill text-sm text-rjv-text-muted hover:text-rjv-text transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-rjv-black font-medium py-2.5 rounded-pill hover:shadow-gold transition-all disabled:opacity-60"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-rjv-black border-t-transparent rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
