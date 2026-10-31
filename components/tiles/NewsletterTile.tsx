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
        <h3 className="text-[18px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] font-medium text-[#f2f2f2] leading-[1.22] tracking-tight">
          Get dev tips & guides straight to your inbox for free!
        </h3>

        <form onSubmit={handleSubmit} className="mt-auto pt-4 w-full">
          {subscribed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/[0.06] border border-white/10 text-white text-sm font-medium">
              <Check className="w-4 h-4 text-neutral-300" />
              <span>Subscribed successfully.</span>
            </div>
          ) : (
            <div className="flex items-center w-full bg-[#101010] border border-white/[0.08] rounded-full p-1.5 focus-within:border-white/20 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent px-4 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white/[0.09] hover:bg-white text-neutral-200 hover:text-black text-xs sm:text-sm font-medium transition-all duration-200 shrink-0"
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
