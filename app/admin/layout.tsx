'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { LayoutDashboard, Calendar, Settings, Users, LogOut, Menu } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Settings },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push('/sign-in'); return; }
    fetch('/api/admin/bookings').then(r => {
      if (r.status === 403) { router.push('/'); return; }
      setChecking(false);
    });
  }, [isLoaded, isSignedIn]);

  async function signOut() {
    router.push('/sign-out');
  }

  if (checking) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="font-display text-4xl text-gold">RJV<span className="text-white">.</span></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-void flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-void-2 border-r border-white/5 flex flex-col transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="font-display text-3xl text-white">RJV<span className="text-gold">.</span></Link>
          <div className="font-mono text-white/20 text-xs tracking-widest uppercase mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${pathname === href ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <Icon size={16} />
              <span className="font-mono text-sm tracking-wider">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/sign-out" className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-red-400 transition-colors">
            <LogOut size={16} />
            <span className="font-mono text-sm tracking-wider">Sign Out</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-gold transition-colors text-xs font-mono tracking-wider mt-1">View Site</Link>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-void/80 z-40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex-1 md:ml-64">
        <header className="bg-void-2 border-b border-white/5 h-14 flex items-center px-6 md:hidden">
          <button onClick={() => setOpen(true)} className="text-white/60"><Menu size={20} /></button>
          <span className="font-display text-xl text-white ml-4">RJV<span className="text-gold">.</span></span>
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
