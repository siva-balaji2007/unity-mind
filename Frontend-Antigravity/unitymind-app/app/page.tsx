import type { Metadata } from 'next';
import Link from 'next/link';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import {
  Zap,
  Brain,
  MessageSquare,
  Map,
  GitBranch,
  ArrowRight,
  ChevronRight,
  Code2,
  Layers,
  Check,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'UnityMind — AI Companion for Unity Developers',
  description:
    'Upload your Unity project files and chat with an AI that understands your scripts, scenes, prefabs, and architecture.',
};

const FEATURES = [
  {
    icon: Brain,
    title: 'Project Understanding',
    description:
      'UnityMind builds a deep semantic map of your entire Unity project — scripts, prefabs, scenes, and their interconnections.',
    color: '#4f46e5',
    bg: '#f0f4ff',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description:
      'Ask natural-language questions about your codebase and get precise, context-aware answers with code examples.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: Map,
    title: 'Architecture Navigation',
    description:
      'Instantly navigate large Unity projects. Understand how systems connect and where logic lives across thousands of files.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    icon: GitBranch,
    title: 'Dependency Discovery',
    description:
      'Visualize and explore relationships between scripts, GameObjects, and assets to reduce coupling and bugs.',
    color: '#059669',
    bg: '#ecfdf5',
  },
];

const STEPS = [
  {
    num: '01',
    icon: Code2,
    title: 'Create Project',
    description: 'Initialize a new project on UnityMind and specify your Unity version.',
  },
  {
    num: '02',
    icon: Layers,
    title: 'Upload Files',
    description: 'Drag and drop your project files (.cs, .unity, .prefab) directly in your browser.',
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'Chat with AI',
    description: 'Ask anything about your project and get intelligent, code-aware answers instantly.',
  },
];

const PLANS = [
  { label: 'Starter', price: 'Free', features: ['1 project', '100 messages/mo', 'Basic search', 'Community support'] },
  { label: 'Pro', price: '$19/mo', features: ['10 projects', 'Unlimited messages', 'Advanced search', 'Priority support', 'Team sharing'], popular: true },
  { label: 'Team', price: '$49/mo', features: ['Unlimited projects', 'Unlimited messages', 'Advanced search', 'Dedicated support', 'SSO', 'Audit logs'] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-0 text-neutral-900 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* ─────── Nav ─────── */}
      <nav
        className="sticky top-0 z-50 border-b border-neutral-100 dark:border-neutral-100 bg-neutral-0/90 dark:bg-neutral-50/90 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              <Zap size={14} color="white" fill="white" />
            </div>
            <span className="text-[15px] font-700 text-neutral-900" style={{ fontWeight: 700 }}>
              UnityMind
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13.5px] text-neutral-500">
            <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
            <a href="/docs" className="hover:text-neutral-900 transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm text-neutral-600">Sign in</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ─────── Hero ─────── */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12.5px] font-medium mb-8 border border-brand-100 bg-brand-50 text-brand-700 dark:border-indigo-950/40 dark:bg-indigo-950/20 dark:text-indigo-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Now in public beta — free to try
            <ChevronRight size={12} />
          </div>

          <h1 className="text-[52px] sm:text-[64px] font-800 text-neutral-900 leading-[1.1] tracking-[-0.03em] mb-6"
            style={{ fontWeight: 800 }}>
            Your AI Companion for{' '}
            <span className="gradient-text">Unity Development</span>
          </h1>

          <p className="text-[18px] text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Upload your Unity project files and chat with an AI that understands your scripts, scenes,
            prefabs, and architecture. Ship faster with deep project intelligence.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="btn btn-primary btn-lg"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              View Demo
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-12 text-[12.5px] text-neutral-400">
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Free plan forever</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Setup in 5 minutes</span>
          </div>
        </div>

        {/* Product Preview */}
        <div className="max-w-5xl mx-auto px-6 pb-20 relative z-10 animate-fade-in-up">
          <div
            className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-100"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.1)' }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900 border-b border-neutral-800">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80" />
              <div className="flex-1 mx-4 h-5 rounded bg-neutral-800 flex items-center px-3">
                <span className="text-[11px] text-neutral-500">app.unitymind.dev/projects/stellar-runner/chat</span>
              </div>
            </div>

            {/* Interactive Preview Sandbox */}
            <InteractivePreview />
          </div>
        </div>
      </section>

      {/* ─────── Features ─────── */}
      <section id="features" className="py-24 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-indigo-600 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-[36px] font-800 text-neutral-900 leading-tight tracking-tight" style={{ fontWeight: 800 }}>
              Everything you need to understand<br />your Unity project
            </h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
              UnityMind analyzes your project holistically — not just individual files — to give you answers that actually make sense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-neutral-0 rounded-2xl p-7 border border-neutral-200 dark:border-neutral-100 card-hover"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: f.bg }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-neutral-900 mb-2">{f.title}</h3>
                  <p className="text-[14px] text-neutral-500 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── How It Works ─────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-indigo-600 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-[36px] font-800 text-neutral-900 leading-tight tracking-tight" style={{ fontWeight: 800 }}>
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="absolute top-10 left-1/6 right-1/6 h-px hidden md:block"
              style={{ background: 'linear-gradient(90deg, transparent, #e0eaff 20%, #e0eaff 80%, transparent)' }}
            />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
                  >
                    <Icon size={24} color="white" />
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-700 bg-white border-2 border-indigo-200 text-indigo-600"
                      style={{ fontWeight: 700 }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-[14px] text-neutral-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────── Pricing ─────── */}
      <section id="pricing" className="py-24 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-[36px] font-800 text-neutral-900 leading-tight tracking-tight" style={{ fontWeight: 800 }}>
              Simple, transparent pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.label}
                className={`rounded-2xl p-7 border flex flex-col ${plan.popular
                  ? 'border-indigo-400 bg-neutral-0 relative shadow-lg'
                  : 'border-neutral-200 dark:border-neutral-100 bg-neutral-0'
                  }`}
                style={plan.popular ? { boxShadow: '0 8px 32px rgba(79,70,229,0.15)' } : {}}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-600 text-white"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontWeight: 600 }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-[13px] font-semibold text-neutral-500 mb-1">{plan.label}</p>
                  <p className="text-[32px] font-800 text-neutral-900" style={{ fontWeight: 800 }}>{plan.price}</p>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-neutral-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} w-full`}
                  style={plan.popular ? { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' } : {}}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-14"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 24px 60px rgba(79,70,229,0.35)' }}
          >
            <h2 className="text-[36px] font-800 text-white leading-tight tracking-tight mb-4" style={{ fontWeight: 800 }}>
              Start understanding your<br />Unity project today
            </h2>
            <p className="text-indigo-200 text-[16px] mb-8">
              Join thousands of developers who ship faster with UnityMind.
            </p>
            <Link
              href="/register"
              className="btn btn-lg"
              style={{ background: 'white', color: '#4f46e5', border: 'none', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────── Footer ─────── */}
      <footer className="border-t border-neutral-200 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                <Zap size={12} color="white" fill="white" />
              </div>
              <span className="text-[14px] font-semibold text-neutral-700">UnityMind</span>
            </div>
            <div className="flex items-center gap-6 text-[13px] text-neutral-400">
              <a href="#" className="hover:text-neutral-700 transition-colors">About</a>
              <a href="#" className="hover:text-neutral-700 transition-colors">Documentation</a>
              <a href="#" className="hover:text-neutral-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-700 transition-colors">Contact</a>
            </div>
            <p className="text-[12px] text-neutral-400">
              © {new Date().getFullYear()} UnityMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
