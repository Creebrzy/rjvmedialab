import Link from 'next/link';
import Nav from '@/components/shared/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-[20rem] leading-none text-void-3 select-none">404</div>
          <div className="font-display text-6xl text-white -mt-20 mb-6">NOT FOUND<span className="text-gold">.</span></div>
          <Link href="/" className="inline-block bg-gold text-void font-display text-xl px-10 py-4 tracking-widest hover:bg-gold-light transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </main>
    </>
  );
}
