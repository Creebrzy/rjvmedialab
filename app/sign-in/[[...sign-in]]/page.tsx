export const runtime = 'edge';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-theme flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-3xl text-theme mb-1">RJV MEDIA LAB<span className="text-gold">.</span></div>
          <div className="font-mono text-theme-dim text-xs tracking-widest uppercase">Sound Fader Inc.</div>
        </div>
        <SignIn afterSignInUrl="/booking" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
