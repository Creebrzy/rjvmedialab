import Link from 'next/link';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const shows = [
  { name: 'The Morning Aux', desc: 'Music culture and conversation with industry voices.', img: 'https://lh3.googleusercontent.com/sitesv/APaQ0STo0M4Lsol20UWmoAXFOtICgWFFCfU9SyZX2E0qSkfo-KoaSKQwBS623-56aWRMHeGX7DtL1o7iuZsTJj6Zw4uTZi2izTGW8-QA0f90vMaIEv0Gfy8N-mgsmvwk-j97cA_deg6Vy8FOdStflkKn0Hqmv09hEc7ieg4FMabFRovJRIKBDzdnmxShuh46H3UY1YbDNYZXagfYt0jM-AO0sqOrwwfTy-0lQqSl108=w600' },
  { name: 'Talk Vibe Hustle', desc: 'Creative and entrepreneurial conversations.', img: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQjwViGvE-66q5kgb8MtFZNQ_q_vG698BmtX7z_s1zyui6qOl97mmd9CQj5GGRN_XnXnmiSICz3d4Wamkivvw1zn2ly4DfpE4gm-o6ztJKl8MZYFgvGPTehvLNOf52sTspVcGdozhrL0fg4a7CE4aZQQPz6CjwJBjNHBDyMJn89jZ9yE6F3qV-axygkF_Gi8_ftsFkQGHkxLe0oFay3Fd55Dk1GvWqtS8D-=w600' },
  { name: 'Jvngle Green Room', desc: 'DJ mixes and curated music discovery.', img: 'https://lh3.googleusercontent.com/sitesv/APaQ0SRySuKsGayMA3d7XpTGz5y9xrroZ3-Qb75Ozl83n1RMdwldjYA6GSlZxlc6bGhT7-0eqRKYdj_k8DDD0qwxg6BQtPV9v-mk2dUwsMle87lUCAjSPpzHsl2xD6hUCSOlsNloFNOJam7gdJ_DpEpmo-09G6aq8ZVMpNzHw8YTEVbOjOHKJC3A43Y0O-stYsK30dDMYUJA_XylyRQ8f_56O_HuzyF32A9s2w5tXhs=w600' },
  { name: "Boogie's Basement", desc: 'Live artist performance sessions recorded in the Lab.', img: 'https://lh3.googleusercontent.com/sitesv/APaQ0STNn3akgBoGdy5ciieYh7Gz3gLgbxq4F0NveOqVxmr5Q1XASGJB4tH0cUel72kgMyQX08gXr591JcRzglW3FZ8GyHQZLFJxgf654f7_99RDZsNYXSXYZaOid3X0Ad3puQCeNbo9ndSvY_6hZ7zMndQ_dtWHK-evfZfAtr=w600' },
];

const rates = [
  { label: 'Hourly Rate', price: '$65', note: 'per hour' },
  { label: '4 Hour Block', price: '$250', note: 'save $10' },
  { label: '8 Hour Block', price: '$480', note: 'save $40' },
  { label: '12 Hour Block', price: '$690', note: 'save $90' },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden">
          {/* BG image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/sitesv/APaQ0SQIirnac15JXsXtcKw4yeJvVH_wvP3zgtYZqZ6zw_yPV9EHJncNQvRjD2bpMUfBLX-aiOZyGBo0SrgR1DTYRHIWT9w9OUBRNbAlcurwK9N2zsAS52dQpobhh7QLWk6dG0g867r4Ml8Wa9yo0jEAz8FtSTDSuvL6TkANJaI_Xp8eJY1PM4y3ZTx2=w1280"
              alt="RJV Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-void/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="mb-4">
              <span className="font-mono text-gold text-xs tracking-[0.3em] uppercase">Birmingham, Alabama</span>
            </div>
            <h1 className="font-display text-[clamp(4rem,14vw,12rem)] leading-none text-white mb-6">
              EMPOWER<br />
              <span className="text-gold">YOUR</span><br />
              VISION<span className="text-gold">.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-lg mb-10 leading-relaxed">
              A powerhouse in multimedia production. Recording, podcasting, music production, marketing, and branding — all under one roof.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/booking" className="bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors">
                BOOK A SESSION
              </Link>
              <Link href="/about" className="border border-white/30 text-white font-mono text-sm px-8 py-4 tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">
                Learn More
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2">
            <span className="font-mono text-white/30 text-xs tracking-widest rotate-90 origin-center">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
          </div>
        </section>

        {/* TICKER */}
        <div className="bg-gold py-3 overflow-hidden">
          <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="font-display text-void text-lg tracking-widest flex gap-12">
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
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="gold-line mb-4" />
              <h2 className="font-display text-6xl text-white">STUDIO<br />RATES</h2>
            </div>
            <Link href="/services" className="font-mono text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors border-b border-gold pb-1">
              View All Services
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {rates.map((r) => (
              <div key={r.label} className="bg-void-2 p-8 hover:bg-void-3 transition-colors group">
                <div className="font-mono text-white/30 text-xs tracking-widest uppercase mb-6">{r.label}</div>
                <div className="font-display text-6xl text-white group-hover:text-gold transition-colors mb-2">{r.price}</div>
                <div className="font-mono text-white/40 text-xs">{r.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/booking" className="inline-block bg-gold text-void font-display text-xl px-12 py-4 tracking-widest hover:bg-gold-light transition-colors">
              BOOK NOW
            </Link>
          </div>
        </section>

        {/* FEATURED SHOWS */}
        <section className="py-24 bg-void-2">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <div className="gold-line mb-4" />
              <h2 className="font-display text-6xl text-white">ORIGINAL<br />PROGRAMMING</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {shows.map((show) => (
                <div key={show.name} className="group relative overflow-hidden aspect-[3/4]">
                  <img src={show.img} alt={show.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="font-display text-2xl text-white mb-2">{show.name}</div>
                    <p className="text-white/50 text-xs leading-relaxed">{show.desc}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
            {[
              {
                name: 'Sound Fader Inc.',
                desc: 'A powerhouse in multimedia and audio production, specializing in studio recording, sound design, and high-quality post-production for music, podcasts, and digital content.',
                img: 'https://lh3.googleusercontent.com/sitesv/APaQ0SSIici7O4pXiSGruSURg_5gtlVY_MFbxGyQmqO9-ErdD21sOINxAFAFzhU0H1uVF8FouE68WglF_uK-qn8IzvQR3YnRaANCOKM33XiAIuCEKNPy6XiR5VoDWw1FHnImxNxLgf9ncI4Dwmn-ilChx3JoxWWH_1sPGYQVGH9OpDFBpsbx-ApFVpwYohKuDyfLIokXl2q0pLO7x_hZY9V22jUITuj5oZtZ6qlFjMg=w600',
              },
              {
                name: 'Good Omen Studios',
                desc: 'Combining custom audio production with strategic music business consultation. Helping artists and brands refine their sound and navigate the industry with confidence.',
                img: 'https://lh3.googleusercontent.com/sitesv/APaQ0SS1serhLz2aIUMtAZZFZwnY0q_6kONK5slpxiM6J0Ch3hiScuZI4oD0Y2LN4u1CaM2LxA4Orej8FBl_efrAFZbCabeqyM7P9DCwP4kYlHdeKDQvKVmBoci_pX12DR8f-Frfi8PXsiuYVs38S7HDuU_6oJRU2H4C3DenOgZBRXocUmFRxs642gnGdWK9yIhZozlUNlsnrxLLCtsIqQyZir18ZpmZSw4Pfjny8B4=w600',
              },
              {
                name: 'RJV Brands',
                desc: 'Merges cutting-edge digital marketing with strategic merchandise branding, turning ideas into powerful, marketable identities for artists and entrepreneurs.',
                img: 'https://lh3.googleusercontent.com/sitesv/APaQ0SQjTyVbqWUC_v_EOs4B_JcSK7ldrIUbwnZYiDm7bxiF30yYGGCicBbN6qhaUWwHcyGyQsul6hLcz33vlcetPHCMnYRqd1QXC3fAdbdH60nB9l5p8e2ncZAEvtwGtzISPJiae3eTNWAhu_6hc6QXOUoQ7jAX3IO3CLxzrtcjtDhiTqj98qyvllq8ChWV0AgOidcLgRcTPz4rtiyDR42Lx_aRe4Au=w600',
              },
            ].map((studio) => (
              <div key={studio.name} className="group">
                <div className="overflow-hidden mb-6 aspect-video">
                  <img src={studio.img} alt={studio.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="gold-line mb-4" />
                <h3 className="font-display text-3xl text-white mb-3">{studio.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{studio.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/sitesv/APaQ0SQCiPeTjefaRGGGW58O90FwqbB1C5Ep0iBH14gAwJbc7IJFk9OvEymgV999TcZhSgJz29z5NFxWkeKz3-GDz3zE3GgS_PPuvMzz3IhvHo-DOX__D_mLwafbWVtx01aVS8qh2Cpr8w4NJoke-OGENqtfyKzeTc3yJkZFU6V3CxkNkNeNL50wNw1FMc8CYAKkZG8ObNJGia_RI0Qyjw_PtyFoHi4FsvnZ6Hgo=w1280"
              alt="Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-void/85" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="font-mono text-gold text-xs tracking-[0.4em] uppercase mb-6">Sound Fader Inc.</div>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mb-8">
              YOUR NEXT<br />SESSION<br /><span className="text-gold">STARTS HERE</span>
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto">
              244 Goodwin Crest Drive, Suite G 100-300, Homewood, AL 35209
            </p>
            <Link href="/booking" className="inline-block bg-gold text-void font-display text-2xl px-14 py-5 tracking-widest hover:bg-gold-light transition-colors">
              BOOK YOUR SESSION
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
