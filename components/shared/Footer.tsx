import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-void border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="font-display text-5xl text-white mb-4">RJV<span className="text-gold">.</span></div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Birmingham premier multimedia studio. Empowering creatives to bring their visions to life.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/rjvmedialab" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors text-xs font-mono uppercase tracking-widest">FB</a>
              <a href="https://www.instagram.com/rjvmedialab" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors text-xs font-mono uppercase tracking-widest">IG</a>
              <a href="https://youtube.com/@rjvmedialab" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors text-xs font-mono uppercase tracking-widest">YT</a>
              <a href="https://www.patreon.com/cw/RJVML" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold transition-colors text-xs font-mono uppercase tracking-widest">PT</a>
            </div>
          </div>

          <div>
            <div className="text-gold font-mono text-xs tracking-widest uppercase mb-4">Navigate</div>
            <div className="flex flex-col gap-3">
              {[['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/booking', 'Book Now']].map(([href, label]) => (
                <Link key={href} href={href} className="text-white/50 hover:text-white text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-gold font-mono text-xs tracking-widest uppercase mb-4">Contact</div>
            <div className="flex flex-col gap-2 text-sm text-white/50">
              <a href="mailto:booking@rjvmedialab.com" className="hover:text-gold transition-colors">booking@rjvmedialab.com</a>
              <p>244 Goodwin Crest Drive</p>
              <p>Suite G 100-300</p>
              <p>Homewood, AL 35209</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs font-mono">© 2026 RJV Media Lab Inc. | Powered by RJV Brands</p>
          <Link href="/sign-in" className="text-white/25 hover:text-gold text-xs font-mono transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
