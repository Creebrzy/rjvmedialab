import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

const team = [
  { role: 'Founder / Executive Producer', name: 'RJV Media Lab' },
  { role: 'Host / Morning Aux', name: 'DJ IamOneal' },
  { role: 'Co-Host / Morning Aux', name: 'Nicole Sade' },
];

const gear = [
  '32-Channel Mixing Console', 'Isolation Recording Booth', '64-Key MIDI Keyboard',
  'Pro Tools / Logic Pro', 'Multi-Mic Podcast Setup', 'Video Recording Capability',
  'Live Monitoring System', 'Mastering Suite',
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/sitesv/APaQ0SS8KwybC-JLbDAXDlTlnj4JqpR7koW6Qq_2Z2fK7s7_YKN3t3cMQdtLdkLQOotlbX3guSpupoPtap51IfXnelphKQ6CAj5SGfgabUcHQFJ8KIRJfVTpLb0j2gtUrGoDvaKGCPuHtiQNFBgW3BbGMF905HQJY0MGVbNAEN9oC5ju8kjByNHkL65abnPBGBGHuyy9KiD73Y0Nq-aQqZINyCslcNdCARoEz0tF-AU=w1280"
              alt="RJV Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-void/80" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none text-white">
              ABOUT<br /><span className="text-gold">THE LAB</span>
            </h1>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="gold-line mb-6" />
              <h2 className="font-display text-5xl text-white mb-8">EMPOWERING CREATIVES</h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>RJV Media Lab produces original programming and creative media while providing studio resources for artists, creators, and entrepreneurs in Birmingham and beyond.</p>
                <p>Founded on the belief that creative access changes communities, RJV Media Lab is more than a studio — it is a cultural platform that connects artists, amplifies voices, and builds bridges between music, media, and business.</p>
                <p>Through Sound Fader Inc., Good Omen Studios, and RJV Brands, we offer a full ecosystem of creative services under one roof at 244 Goodwin Crest Drive, Homewood, AL.</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/sitesv/APaQ0SRCav1b65H2XzBQQGaLDcYrzHsJjRG2smRr_L206i_4rOZnI-l0KjZoEc69YPtXCI6mk4zLxW7bN6kJAdvTnRFUqdhCfJu_yE5P2Hbum9EGjrurOx3JGx59TWt4dYQ3Eoq8wVQvJAVY4grDCxhR1wC02A1eraUbKlFjXD5xaqTaTKsGGGTZUAvmruhchhL5E3Ppg1muOc5TWlYSV1UvDO5WbWlBxG79SBgzx80=w800"
                alt="The Team"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gold" />
            </div>
          </div>
        </section>

        {/* Equipment */}
        <section className="py-24 bg-void-2">
          <div className="max-w-7xl mx-auto px-6">
            <div className="gold-line mb-6" />
            <h2 className="font-display text-5xl text-white mb-16">STUDIO EQUIPMENT</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {gear.map((item) => (
                <div key={item} className="bg-void-2 p-6 hover:bg-void-3 transition-colors">
                  <div className="w-2 h-2 bg-gold rounded-full mb-4" />
                  <p className="text-white/70 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="gold-line mb-6" />
              <h2 className="font-display text-5xl text-white mb-8">FIND US</h2>
              <div className="space-y-2 text-white/60 mb-8">
                <p className="text-gold font-mono text-sm tracking-widest uppercase">Sound Fader Inc.</p>
                <p>244 Goodwin Crest Drive</p>
                <p>Suite G 100-300</p>
                <p>Homewood, AL 35209</p>
              </div>
              <a href="mailto:booking@rjvmedialab.com" className="font-mono text-gold text-sm tracking-widest uppercase border-b border-gold pb-1 hover:text-gold-light transition-colors">
                booking@rjvmedialab.com
              </a>
            </div>
            <div className="bg-void-3 h-64 md:h-auto flex items-center justify-center border border-white/5">
              <div className="text-center">
                <div className="font-display text-6xl text-gold mb-2">BHM</div>
                <div className="font-mono text-white/30 text-xs tracking-widest">BIRMINGHAM, AL</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
