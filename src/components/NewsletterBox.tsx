import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const NewsletterBox: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid business email address.');
      return;
    }

    setStatus('loading');

    // Simulate backend submission
    setTimeout(() => {
      // Store in localStorage for demonstration persistence
      try {
        const subs = JSON.parse(localStorage.getItem('founderbytes_subscribers') || '[]');
        if (!subs.includes(email.trim().toLowerCase())) {
          subs.push(email.trim().toLowerCase());
          localStorage.setItem('founderbytes_subscribers', JSON.stringify(subs));
        }
      } catch {
        // ignore
      }
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-[#111111] text-white border-y border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-[#F5B800] uppercase mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>DAILY NEWSROOM BRIEFING</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Business news worth knowing.
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Startup funding, founder stories, business moves and technology — delivered without the noise.
        </p>

        {status === 'success' ? (
          <div className="max-w-md mx-auto p-4 bg-neutral-900 border border-emerald-500/50 flex items-center justify-center gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-left">
              <span className="font-bold">Subscription confirmed.</span>
              <p className="text-xs text-neutral-300 mt-0.5">
                Check your inbox for tomorrow's 8:00 AM IST Founder Bytes Executive Dispatch.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading'}
                className="flex-1 px-4 py-3 bg-neutral-900 text-white placeholder-neutral-500 text-sm border border-neutral-700 focus:outline-none focus:border-[#F5B800] transition-colors"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-[#F5B800] hover:bg-[#E0A700] text-black font-extrabold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-70"
              >
                <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 mt-2.5">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-neutral-500 mt-3">
              Zero spam. Verified reporting only. Unsubscribe at any time with one click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
