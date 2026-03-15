'use client';
export const runtime = 'edge';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Menu, X, Sun, Moon } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const stored = localStorage.getItem('rjv-theme');
    if (stored === 'light') { setLight(true); document.documentElement.classList.add('light'); }
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    if (next) {
      document.documentElement.classList.add('light');
      localStorage.setItem('rjv-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('rjv-theme', 'dark');
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-theme/95 backdrop-blur-sm border-b border-theme' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl text-theme tracking-wider hover:text-gold transition-colors">
          RJV MEDIA LAB<span className="text-gold">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-xs font-mono tracking-widest uppercase transition-colors ${pathname === l.href ? 'text-gold' : 'text-theme-dim hover:text-theme'}`}>
              {l.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center text-theme-dim hover:text-gold transition-colors"
            aria-label="Toggle theme">
            {light ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <Link href="/booking"
            className="border border-gold text-gold font-mono text-xs px-5 py-2 tracking-widest uppercase hover:bg-gold hover:text-void transition-colors">
            BOOK NOW
          </Link>

          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/booking/profile" className="font-mono text-xs text-theme-dim hover:text-theme tracking-widest uppercase transition-colors">My Sessions</Link>
              <SignOutButton>
                <button className="font-mono text-xs text-theme-dim hover:text-red-400 tracking-widest uppercase transition-colors">Sign Out</button>
              </SignOutButton>
            </div>
          ) : (
            <Link href="/sign-in" className="font-mono text-xs text-theme-dim hover:text-theme tracking-widest uppercase transition-colors">Sign In</Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme} className="text-theme-dim hover:text-gold transition-colors" aria-label="Toggle theme">
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="text-theme" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-theme-2 border-t border-theme px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`font-display text-3xl tracking-wider ${pathname === l.href ? 'text-gold' : 'text-theme'}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setOpen(false)} className="font-display text-3xl text-gold">Book Now</Link>
          {isSignedIn ? (
            <>
              <Link href="/booking/profile" onClick={() => setOpen(false)} className="font-display text-3xl text-theme-dim">My Sessions</Link>
              <SignOutButton><button className="font-display text-3xl text-theme-dim text-left">Sign Out</button></SignOutButton>
            </>
          ) : (
            <Link href="/sign-in" onClick={() => setOpen(false)} className="font-display text-3xl text-theme-dim">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
