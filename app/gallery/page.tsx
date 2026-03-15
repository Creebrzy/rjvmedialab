'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import { Play, Film } from 'lucide-react';

const SECTIONS = ['all', 'gallery', 'studios', 'shows', 'hero', 'team', 'about'];

const placeholders = [
  { label: 'Studio A', tag: 'RECORDING' },
  { label: 'The Morning Aux', tag: 'SHOW' },
  { label: 'Production Floor', tag: 'STUDIO' },
  { label: 'Jvngle Green Room', tag: 'SHOW' },
  { label: 'Sound Fader Inc.', tag: 'STUDIO' },
  { label: 'Good Omen Studios', tag: 'STUDIO' },
];

export default function GalleryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [preview, setPreview] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/media')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMedia(data); setLoading(false); });
  }, []);

  const filtered = media
    .filter(m => filter === 'all' || m.section === filter)
    .filter(m => typeFilter === 'all' || m.media_type === typeFilter);

  const hasMedia = media.length > 0;

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white mb-4">
            THE<br /><span className="text-gold">GALLERY</span>
          </h1>

          {hasMedia && (
            <div className="flex flex-wrap gap-2 mb-10">
              {/* Type toggle */}
              <div className="flex gap-2 mr-2">
                {[['all', 'All'], ['image', 'Photos'], ['video', 'Videos']].map(([val, label]) => (
                  <button key={val} onClick={() => setTypeFilter(val)}
                    className={`font-mono text-xs px-4 py-2 tracking-widest uppercase transition-colors flex items-center gap-1.5 ${typeFilter === val ? 'bg-gold text-void' : 'border border-white/10 text-white/40 hover:border-gold hover:text-gold'}`}>
                    {val === 'video' && <Film size={10} />}
                    {label}
                  </button>
                ))}
              </div>
              {/* Section filter */}
              {SECTIONS.map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`font-mono text-xs px-4 py-2 tracking-widest uppercase transition-colors ${filter === s ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-white/20 font-mono text-sm py-24 text-center">Loading...</div>
          ) : !hasMedia ? (
            <div>
              <p className="font-mono text-white/20 text-xs tracking-widest uppercase mb-8">Photos & videos coming soon</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {placeholders.map(p => (
                  <div key={p.label} className="aspect-video bg-void-3 border border-white/5 flex flex-col items-center justify-center gap-2">
                    <div className="font-display text-5xl text-gold/10">{p.label[0]}</div>
                    <div className="font-mono text-white/10 text-xs tracking-widest uppercase">{p.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center font-mono text-white/20 text-sm">Nothing in this category yet</div>
          ) : (
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {filtered.map(item => (
                <div key={item.id}
                  className="break-inside-avoid group relative overflow-hidden bg-void-3 border border-white/5 hover:border-gold/30 transition-colors cursor-pointer"
                  onClick={() => setPreview(item)}>
                  {item.media_type === 'video' ? (
                    <div className="aspect-video relative">
                      {item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-void-3 flex items-center justify-center">
                          <Film size={32} className="text-gold/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gold/80 group-hover:bg-gold flex items-center justify-center transition-colors">
                          <Play size={16} className="text-void ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={item.direct_url} alt={item.alt_text || item.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <div className="font-mono text-gold text-xs tracking-widest uppercase mb-1">{item.section}</div>
                      <div className="font-display text-lg text-white">{item.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {preview && (
        <div className="fixed inset-0 bg-void/97 z-50 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            {preview.media_type === 'video' ? (
              <div className="aspect-video w-full bg-black">
                {preview.direct_url.includes('youtube.com/embed') || preview.direct_url.includes('drive.google.com') ? (
                  <iframe src={preview.direct_url} className="w-full h-full" allowFullScreen allow="autoplay" />
                ) : (
                  <video src={preview.direct_url} controls autoPlay className="w-full h-full" />
                )}
              </div>
            ) : (
              <img src={preview.direct_url} alt={preview.alt_text || preview.title}
                className="w-full max-h-[80vh] object-contain" />
            )}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-display text-xl text-white">{preview.title}</div>
                <div className="font-mono text-gold text-xs tracking-widest uppercase mt-1">
                  {preview.section} · {preview.media_type}
                </div>
              </div>
              <button onClick={() => setPreview(null)}
                className="font-mono text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors">
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
