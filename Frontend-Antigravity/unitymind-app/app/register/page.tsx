'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Zap, Check } from 'lucide-react';
import { toast } from 'sonner';

const PASSWORD_CHECKS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Contains number', test: (p: string) => /[0-9]/.test(p) },
];

import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      router.push('/dashboard');
    } catch (err) {
      // Errors are handled in the register method inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-0 px-4 py-12 relative overflow-hidden transition-colors">
      {/* Background mesh glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-500/8 dark:bg-indigo-500/4 blur-[130px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-purple-500/8 dark:bg-purple-500/4 blur-[130px] animate-float [animation-delay:1.5s]" />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              <Zap size={18} color="white" fill="white" />
            </div>
            <span className="text-[17px] font-700 text-neutral-900" style={{ fontWeight: 700 }}>UnityMind</span>
          </Link>
          <h1 className="text-[22px] font-700 text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
            Create your account
          </h1>
          <p className="text-[13.5px] text-neutral-500 mt-1">Free to get started — no credit card</p>
        </div>

        {/* Card */}
        <div
          className="bg-neutral-0 dark:bg-neutral-50 rounded-2xl p-8 border border-neutral-100 dark:border-neutral-100 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
                placeholder="Jamie Chen"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base pr-10"
                  placeholder="Min 8 characters"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {PASSWORD_CHECKS.map(({ label, test }) => {
                    const ok = test(password);
                    return (
                      <div key={label} className="flex items-center gap-1.5">
                        <Check
                          size={11}
                          className={ok ? 'text-emerald-500' : 'text-neutral-300'}
                        />
                        <span className={`text-[11.5px] ${ok ? 'text-emerald-600' : 'text-neutral-400'}`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password}
              className="btn btn-primary w-full py-2.5 text-[14px] mt-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-[11.5px] text-neutral-400 text-center leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="underline">Terms of Service</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </form>
        </div>

        <p className="text-center text-[13px] text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
