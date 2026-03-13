'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/booking', label: 'Book Now' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-white tracking-wider hover:text-gold transition-colors">
          RJV<span className="text-gold">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-mono tracking-widest uppercase transition-colors ${
                pathname === l.href ? 'text-gold' : 'text-white/60 hover:text-white'
              } ${l.label === 'Book Now' ? 'border border-gold text-gold px-4 py-1.5 hover:bg-gold hover:text-void' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/booking/profile" className="font-mono text-xs text-white/40 hover:text-white tracking-widest uppercase transition-colors">My Sessions</Link>
              <SignOutButton>
                <button className="font-mono text-xs text-white/40 hover:text-red-400 tracking-widest uppercase transition-colors">Sign Out</button>
              </SignOutButton>
            </div>
          ) : (
            <Link href="/sign-in" className="font-mono text-xs text-white/40 hover:text-white tracking-widest uppercase transition-colors">Sign In</Link>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-void-2 border-t border-white/5 px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`font-display text-3xl tracking-wider ${pathname === l.href ? 'text-gold' : 'text-white'}`}>
              {l.label}
            </Link>
          ))}
          {isSignedIn ? (
            <>
              <Link href="/booking/profile" onClick={() => setOpen(false)} className="font-display text-3xl text-white/50">My Sessions</Link>
              <SignOutButton><button className="font-display text-3xl text-white/30 text-left">Sign Out</button></SignOutButton>
            </>
          ) : (
            <Link href="/sign-in" onClick={() => setOpen(false)} className="font-display text-3xl text-white/50">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
