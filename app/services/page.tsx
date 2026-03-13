'use client';
import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const services = [
  { name: 'Recording Session - Hourly', category: 'recording', price: 65, price_type: 'hourly', desc: 'Full access to Sound Fader Inc. Studio A. Includes engineer, booth, 32-channel mixer, and 64-key MIDI keyboard.' },
  { name: 'Recording Session - 4hr Block', category: 'recording', price: 250, price_type: 'block', desc: 'Four-hour block booking at Sound Fader Inc. Best for artists needing focused studio time.' },
  { name: 'Recording Session - 8hr Block', category: 'recording', price: 480, price_type: 'block', desc: 'Full workday block. Includes setup time, breaks, and full studio access.' },
  { name: 'Recording Session - 12hr Block', category: 'recording', price: 690, price_type: 'block', desc: 'Premium marathon session. Ideal for album tracking or intensive projects.' },
  { name: 'Mixing and Mastering', category: 'recording', price: 250, price_type: 'flat', desc: 'Professional mix and master per session file. Delivered in WAV and MP3 formats.' },
  { name: 'Custom Music Production', category: 'production', price: 500, price_type: 'flat', desc: 'Original production crafted to your vision. Starts at $500, scoped per project.' },
  { name: 'Podcast Suite - Podio A', category: 'podcast', price: 65, price_type: 'hourly', desc: 'Sound Fader Inc. Podio A. Fully treated podcast suite with multi-mic setup and live monitoring.' },
  { name: 'Podcast Suite - Podio B', category: 'podcast', price: 65, price_type: 'hourly', desc: 'Sound Fader Inc. Podio B. Second podcast room with video recording capability.' },
  { name: 'Marketing Strategy Session', category: 'marketing', price: 150, price_type: 'hourly', desc: 'Content strategy, calendar development, and topic ideation for your brand or artist project.' },
  { name: 'Brand Identity Package', category: 'branding', price: 800, price_type: 'flat', desc: 'Logo, color system, typography, and brand guidelines. Scoped per project.' },
];

const categories = ['all', 'recording', 'podcast', 'production', 'marketing', 'branding'];

export default function ServicesPage() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? services : services.filter(s => s.category === active);

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white mb-16">
            SERVICES<br /><span className="text-gold">& PRICING</span>
          </h1>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-mono text-xs tracking-widest uppercase px-5 py-2 border transition-colors ${
                  active === cat
                    ? 'bg-gold text-void border-gold'
                    : 'border-white/20 text-white/50 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {filtered.map((service) => (
              <div key={service.name} className="bg-void-2 p-8 hover:bg-void-3 transition-colors group flex flex-col">
                <div className="font-mono text-gold text-xs tracking-widest uppercase mb-4">{service.category}</div>
                <h3 className="font-display text-2xl text-white mb-4 group-hover:text-gold transition-colors">{service.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1 mb-6">{service.desc}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-display text-4xl text-gold">${service.price}</span>
                    <span className="font-mono text-white/30 text-xs ml-2">
                      {service.price_type === 'hourly' ? '/hr' : service.price_type === 'block' ? ' flat' : '+'}
                    </span>
                  </div>
                  <Link href="/booking" className="font-mono text-xs tracking-widest uppercase text-gold border-b border-gold pb-0.5 hover:text-gold-light transition-colors">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/booking" className="inline-block bg-gold text-void font-display text-2xl px-14 py-5 tracking-widest hover:bg-gold-light transition-colors">
              BOOK A SESSION
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
