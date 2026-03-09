'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check role and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        toast.success('Welcome back!');
        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/booking');
        }
      } else {
        if (!fullName) { toast.error('Please enter your name'); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
            <span className="text-rjv-black font-display font-semibold">R</span>
          </div>
          <span className="font-display text-xl text-rjv-text">RJV Studio</span>
        </Link>
      </div>

      {/* Card */}
      <div className="glass-gold rounded-[20px] p-8">
        <h1 className="font-display text-3xl text-rjv-text font-light mb-1">
          {mode === 'login' ? 'Welcome back.' : 'Create account.'}
        </h1>
        <p className="text-rjv-text-muted text-sm mb-8">
          {mode === 'login'
            ? 'Sign in to manage your bookings.'
            : 'Join RJV Studio to book sessions.'}
        </p>

        <div className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-rjv-text-muted font-mono uppercase tracking-wider block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-rjv-panel border border-rjv-border rounded-[12px] px-4 py-3 text-rjv-text placeholder:text-rjv-text-dim text-sm focus:border-rjv-gold focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-rjv-text-muted font-mono uppercase tracking-wider block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rjv-text-dim" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="you@example.com"
                className="w-full bg-rjv-panel border border-rjv-border rounded-[12px] pl-10 pr-4 py-3 text-rjv-text placeholder:text-rjv-text-dim text-sm focus:border-rjv-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-rjv-text-muted font-mono uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rjv-text-dim" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-rjv-panel border border-rjv-border rounded-[12px] pl-10 pr-10 py-3 text-rjv-text placeholder:text-rjv-text-dim text-sm focus:border-rjv-gold focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rjv-text-dim hover:text-rjv-text-muted transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-rjv-black font-medium py-3.5 rounded-pill hover:shadow-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-rjv-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-rjv-border text-center">
          <span className="text-sm text-rjv-text-muted">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-rjv-gold hover:text-rjv-gold-light transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
