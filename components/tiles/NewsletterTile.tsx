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
      <div className="w-full h-full flex flex-col justify-between py-0.5">
        <h3 className="type-h4 font-display font-medium text-[var(--text-primary)] leading-snug">
          Get dev tips & guides straight to your inbox for free!
        </h3>

        <form onSubmit={handleSubmit} className="mt-auto pt-3">
          {subscribed ? (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-white/[0.06] border border-white/10 text-white text-xs font-medium">
              <Check className="w-3.5 h-3.5 text-neutral-300" />
              <span>Subscribed successfully.</span>
            </div>
          ) : (
            <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-full p-1 focus-within:border-white/20 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent px-3.5 py-1 text-xs text-[var(--text-primary)] placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white text-neutral-300 hover:text-black text-xs font-medium transition-all duration-200 shrink-0"
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
