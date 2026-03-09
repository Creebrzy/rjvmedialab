'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mic, Radio, Music, Megaphone, ArrowRight, Star } from 'lucide-react';

const services = [
  { icon: Mic, label: 'Recording', sub: 'Sound Fader Inc.' },
  { icon: Radio, label: 'Podcast', sub: 'Podio A & B' },
  { icon: Music, label: 'Production', sub: 'Custom Beats' },
  { icon: Megaphone, label: 'Marketing', sub: 'Strategy & Growth' },
];

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-rjv-black relative overflow-hidden">
      {/* Background grain */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Gold orb accent */}
      <div
        className="pointer-events-none fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-rjv-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
            <span className="text-rjv-black font-display font-semibold text-sm">R</span>
          </div>
          <span className="font-display text-lg text-rjv-text tracking-wide">RJV Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-rjv-text-muted hover:text-rjv-text transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/booking"
            className="text-sm bg-gold-gradient text-rjv-black font-medium px-5 py-2 rounded-pill hover:shadow-gold transition-all"
          >
            Book Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20"
        initial="hidden"
        animate="visible"
        variants={stagger.container}
      >
        <motion.div variants={stagger.item} className="flex items-center gap-2 mb-8">
          <Star size={12} className="text-rjv-gold fill-rjv-gold" />
          <span className="text-xs font-mono text-rjv-text-muted uppercase tracking-widest">
            Birmingham, Alabama
          </span>
          <span className="text-rjv-text-dim">·</span>
          <span className="text-xs font-mono text-rjv-text-muted uppercase tracking-widest">
            244 Goodwin Crest Dr
          </span>
        </motion.div>

        <motion.h1
          variants={stagger.item}
          className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-light text-rjv-text mb-6"
        >
          Empower
          <br />
          <em className="text-shimmer not-italic">Your Vision.</em>
        </motion.h1>

        <motion.p
          variants={stagger.item}
          className="text-rjv-text-muted text-lg max-w-xl leading-relaxed mb-12"
        >
          A powerhouse in multimedia production. Recording, podcasting, music production,
          marketing, and branding — all under one roof.
        </motion.p>

        <motion.div variants={stagger.item} className="flex flex-wrap gap-3 mb-16">
          {services.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 rounded-bento bg-rjv-panel border border-rjv-border"
            >
              <div className="w-8 h-8 rounded-lg bg-rjv-muted flex items-center justify-center">
                <Icon size={15} className="text-rjv-gold" />
              </div>
              <div>
                <div className="text-sm text-rjv-text font-medium">{label}</div>
                <div className="text-xs text-rjv-text-muted">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={stagger.item} className="flex flex-wrap gap-4">
          <Link
            href="/booking"
            className="group flex items-center gap-3 bg-gold-gradient text-rjv-black font-medium px-8 py-4 rounded-pill hover:shadow-gold-intense transition-all text-base"
          >
            Book a Session
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-3 border border-rjv-border text-rjv-text px-8 py-4 rounded-pill hover:border-rjv-gold hover:text-rjv-gold transition-all text-base"
          >
            View My Bookings
          </Link>
        </motion.div>
      </motion.section>

      {/* Pricing Preview */}
      <motion.section
        className="relative z-10 max-w-5xl mx-auto px-6 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="border-t border-rjv-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl text-rjv-text font-light">Studio Rates</h2>
            <Link href="/booking" className="text-sm text-rjv-gold hover:text-rjv-gold-light transition-colors flex items-center gap-1">
              See all services <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Hourly Rate', price: '$65', sub: 'per hour' },
              { label: '4 Hour Block', price: '$250', sub: 'save $10' },
              { label: '8 Hour Block', price: '$480', sub: 'save $40' },
              { label: '12 Hour Block', price: '$690', sub: 'save $90' },
            ].map(({ label, price, sub }) => (
              <div
                key={label}
                className="p-5 rounded-bento bg-rjv-panel border border-rjv-border hover:border-rjv-gold hover:shadow-gold transition-all cursor-pointer"
              >
                <div className="text-xs text-rjv-text-muted mb-2 font-mono uppercase tracking-wider">{label}</div>
                <div className="font-display text-3xl text-rjv-gold font-light">{price}</div>
                <div className="text-xs text-rjv-text-dim mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-rjv-border px-6 py-6 flex items-center justify-between">
        <span className="text-xs text-rjv-text-dim font-mono">© 2024 RJV Media Lab</span>
        <a href="mailto:tmalive@rjvmedialab.com" className="text-xs text-rjv-text-muted hover:text-rjv-gold transition-colors">
          tmalive@rjvmedialab.com
        </a>
      </footer>
    </main>
  );
}
