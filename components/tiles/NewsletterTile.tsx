"use client";

import { useState } from "react";
import { BentoTile } from "./BentoTile";
import { Check } from "lucide-react";

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
    }, 3500);
  };

  return (
    <BentoTile className={className}>
      <div className="w-full h-full flex flex-col justify-between py-1">
        <h3 className="text-[18px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] font-medium text-[var(--text-primary)] leading-[1.35] tracking-tight">
          Get dev tips & guides straight to your inbox for free!
        </h3>

        <form onSubmit={handleSubmit} className="mt-auto pt-4 w-full">
          {subscribed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium">
              <Check className="w-4 h-4 text-emerald-600 dark:text-neutral-300" aria-hidden="true" />
              <span>Subscribed successfully.</span>
            </div>
          ) : (
            <div className="flex items-center w-full bg-[var(--surface-tile-hover)] border border-[var(--border-subtle)] rounded-full p-1.5 focus-within:border-[var(--border-hover)] transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent px-4 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
              />
              <button
                type="submit"
                data-cta="primary"
                className="btn-primary !rounded-full text-sm min-h-[44px] px-5 py-2 shrink-0 disabled:opacity-50"
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
