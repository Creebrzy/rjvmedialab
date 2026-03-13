export const runtime = 'edge';
import Link from 'next/link';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const shows = [
  { name: 'The Morning Aux', desc: 'Music culture and conversation with industry voices.', color: 'from-gold/20' },
  { name: 'Talk Vibe Hustle', desc: 'Creative and entrepreneurial conversations.', color: 'from-purple-900/40' },
  { name: 'Jvngle Green Room', desc: 'DJ mixes and curated music discovery.', color: 'from-green-900/40' },
  { name: "Boogie's Basement", desc: 'Live artist performance sessions recorded in the Lab.', color: 'from-blue-900/40' },
];

const rates = [
  { label: 'Hourly Rate', price: '$65', note: 'per hour' },
  { label: '4 Hour Block', price: '$250', note: 'save $10' },
  { label: '8 Hour Block', price: '$480', note: 'save $40' },
  { label: '12 Hour Block', price: '$690', note: 'save $90' },
];

const studios = [
  { name: 'Sound Fader Inc.', desc: 'A powerhouse in multimedia and audio production, specializing in studio recording, sound design, and high-quality post-production for music, podcasts, and digital content.', tag: 'RECORDING' },
  { name: 'Good Omen Studios', desc: 'Combining custom audio production with strategic music business consultation. Helping artists and brands refine their sound and navigate the industry with confidence.', tag: 'PRODUCTION' },
  { name: 'RJV Brands', desc: 'Merges cutting-edge digital marketing with strategic merchandise branding, turning ideas into powerful, marketable identities for artists and entrepreneurs.', tag: 'BRANDS' },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden bg-void">
          {/* Abstract background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-void to-void" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-2xl" />
            {/* Grid lines */}
            <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="mb-4">
              <span className="font-mono text-gold text-xs tracking-[0.3em] uppercase">Birmingham, Alabama · Sound Fader Inc.</span>
            </div>
            <h1 className="font-display text-[clamp(5rem,16vw,14rem)] leading-[0.9] text-white mb-8">
              EMPOWER<br />
              <span className="text-gold">YOUR</span><br />
              VISION<span className="text-gold">.</span>
            </h1>
            <p className="text-theme-dim text-lg max-w-lg mb-10 leading-relaxed font-body">
              A powerhouse in multimedia production. Recording, podcasting, music production, marketing, and branding — all under one roof.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking" className="bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors">
                BOOK A SESSION
              </Link>
              <Link href="/about" className="border border-white/20 text-white font-mono text-sm px-8 py-4 tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">
                Learn More
              </Link>
            </div>
          </div>

          {/* Side label */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-gold/50" />
            <span className="font-mono text-white/20 text-xs tracking-[0.4em] rotate-90 origin-center whitespace-nowrap">RJV MEDIA LAB</span>
          </div>
        </section>

        {/* TICKER */}
        <div className="bg-gold py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap" style={{animation: 'marquee 25s linear infinite'}}>
            {Array(6).fill(null).map((_, i) => (
              <span key={i} className="font-display text-void text-lg tracking-widest flex gap-10 shrink-0">
                <span>RECORDING</span><span>★</span>
                <span>PODCAST</span><span>★</span>
                <span>PRODUCTION</span><span>★</span>
                <span>MARKETING</span><span>★</span>
                <span>BRANDING</span><span>★</span>
              </span>
            ))}
          </div>
        </div>

        {/* STUDIO RATES */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="gold-line mb-4" />
              <h2 className="font-display text-6xl text-white">STUDIO<br />RATES</h2>
            </div>
            <Link href="/services" className="font-mono text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors border-b border-gold pb-1 self-start md:self-auto">
              View All Services →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {rates.map((r) => (
              <div key={r.label} className="bg-theme-2 p-8 hover:bg-theme-3 transition-colors group cursor-default">
                <div className="font-mono text-white/30 text-xs tracking-widest uppercase mb-6">{r.label}</div>
                <div className="font-display text-6xl text-white group-hover:text-gold transition-colors mb-2">{r.price}</div>
                <div className="font-mono text-white/30 text-xs">{r.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/booking" className="inline-block bg-gold text-void font-display text-xl px-12 py-4 tracking-widest hover:bg-gold-light transition-colors">
              BOOK NOW
            </Link>
          </div>
        </section>

        {/* FEATURED SHOWS */}
        <section className="py-24 bg-theme-2">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <div className="gold-line mb-4" />
              <h2 className="font-display text-6xl text-white">ORIGINAL<br />PROGRAMMING</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shows.map((show) => (
                <div key={show.name} className="group relative overflow-hidden aspect-[3/4] bg-void-3 border border-white/5 hover:border-gold/30 transition-colors">
                  <div className={`absolute inset-0 bg-gradient-to-t ${show.color} to-void-3`} />
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="font-display text-8xl text-gold">{show.name[0]}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-6 h-0.5 bg-gold mb-3" />
                    <div className="font-display text-xl text-white mb-2">{show.name}</div>
                    <p className="text-white/40 text-xs leading-relaxed">{show.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STUDIOS */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="gold-line mb-4" />
            <h2 className="font-display text-6xl text-white">INSIDE<br />THE LAB</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <div key={studio.name} className="group border border-theme hover:border-gold/30 transition-colors p-8">
                <div className="font-mono text-gold text-xs tracking-widest uppercase mb-6">{studio.tag}</div>
                {/* Placeholder visual */}
                <div className="w-full h-40 bg-theme-3 mb-6 flex items-center justify-center border border-white/5">
                  <span className="font-display text-4xl text-gold/20">{studio.name.split(' ').map(w => w[0]).join('')}</span>
                </div>
                <div className="gold-line mb-4" />
                <h3 className="font-display text-3xl text-white mb-3 group-hover:text-gold transition-colors">{studio.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{studio.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative py-32 overflow-hidden bg-theme-2">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-6">Sound Fader Inc. · Birmingham, AL</div>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mb-8">
              YOUR NEXT<br />SESSION<br /><span className="text-gold">STARTS HERE</span>
            </h2>
            <p className="text-white/40 mb-10 max-w-lg mx-auto font-mono text-sm">
              244 Goodwin Crest Drive, Suite G 100-300, Homewood, AL 35209
            </p>
            <Link href="/booking" className="inline-block bg-gold text-void font-display text-2xl px-14 py-5 tracking-widest hover:bg-gold-light transition-colors">
              BOOK YOUR SESSION
            </Link>
          </div>
        </section>
      </main>
      <Footer />


    </>
  );
}
