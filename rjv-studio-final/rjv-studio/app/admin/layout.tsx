'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Calendar, Settings, Users, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Settings },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!data || data.role !== 'admin') { router.push('/booking'); return; }
    setProfile(data);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-rjv-black flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-56 bg-rjv-void border-r border-rjv-border flex flex-col
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-rjv-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-rjv-black font-display font-semibold text-sm">R</span>
            </div>
            <div>
              <div className="font-display text-sm text-rjv-text">RJV Studio</div>
              <div className="text-xs text-rjv-text-dim font-mono">Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all ${
                  active
                    ? 'bg-rjv-gold/10 border border-rjv-gold/20 text-rjv-gold'
                    : 'text-rjv-text-muted hover:text-rjv-text hover:bg-rjv-panel'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="p-3 border-t border-rjv-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-rjv-gold/20 border border-rjv-gold/30 flex items-center justify-center">
              <span className="text-xs text-rjv-gold font-mono">{profile?.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-rjv-text truncate">{profile?.full_name}</div>
              <div className="text-[10px] text-rjv-text-dim truncate">{profile?.email}</div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rjv-text-dim hover:text-rjv-red transition-colors rounded-[8px] hover:bg-rjv-panel"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-rjv-border bg-rjv-void">
          <button onClick={() => setOpen(!open)} className="text-rjv-text-muted">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-display text-base text-rjv-text">RJV Admin</span>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
