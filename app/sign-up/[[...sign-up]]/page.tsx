export const runtime = 'edge';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-theme flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-3xl text-theme mb-1">RJV MEDIA LAB<span className="text-gold">.</span></div>
          <div className="font-mono text-theme-dim text-xs tracking-widest uppercase">Create your account</div>
        </div>
        <SignUp afterSignUpUrl="/booking" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
