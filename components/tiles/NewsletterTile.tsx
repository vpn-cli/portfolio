"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export function NewsletterTile({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <div>
          <h3 className="type-h4 font-display font-medium text-[var(--text-primary)] mb-2">
            Get dev tips & guides straight to your inbox for free!
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Articles on system design, WebGL performance, and Next.js tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {subscribed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>You're on the list! Check your inbox soon.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/[0.04] dark:bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1.5 focus-within:border-accent transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent px-3 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-accent text-white text-xs font-medium tracking-wide transition-all duration-200 shrink-0"
              >
                Subscribe
              </button>
            </div>
          )}
        </form>
      </div>
    </BentoTile>
  );
}
