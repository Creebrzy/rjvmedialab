export const runtime = 'edge';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const gallery = [
  { label: 'Studio A', tag: 'RECORDING', span: 'col-span-2 row-span-2', color: 'from-gold/15' },
  { label: 'The Morning Aux', tag: 'SHOW', span: '', color: 'from-purple-900/30' },
  { label: 'Talk Vibe Hustle', tag: 'SHOW', span: '', color: 'from-blue-900/30' },
  { label: 'Production Floor', tag: 'STUDIO', span: 'col-span-2', color: 'from-void-3' },
  { label: 'Jvngle Green Room', tag: 'SHOW', span: '', color: 'from-green-900/30' },
  { label: 'Sound Fader Inc.', tag: 'STUDIO', span: '', color: 'from-gold/10' },
  { label: 'Good Omen Studios', tag: 'STUDIO', span: '', color: 'from-void-3' },
  { label: 'Sessions', tag: 'ARTISTS', span: 'col-span-2', color: 'from-gold/8' },
  { label: 'The Team', tag: 'RJV', span: '', color: 'from-void-3' },
  { label: "Boogie's Basement", tag: 'SHOW', span: '', color: 'from-red-900/20' },
];

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white mb-4">
            THE<br /><span className="text-gold">GALLERY</span>
          </h1>
          <p className="text-white/30 font-mono text-xs tracking-widest uppercase mb-16">Photos coming soon — check back shortly</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[200px]">
            {gallery.map((item) => (
              <div key={item.label} className={`group relative overflow-hidden bg-void-3 border border-white/5 hover:border-gold/30 transition-colors ${item.span}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-void-3`} />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="font-display text-7xl text-gold">{item.label[0]}</div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-void/60 flex items-end p-4">
                  <div>
                    <div className="font-mono text-gold text-xs tracking-widest uppercase mb-1">{item.tag}</div>
                    <span className="font-display text-xl text-white">{item.label}</span>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 opacity-100 group-hover:opacity-0 transition-opacity">
                  <span className="font-display text-sm text-white/40">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
