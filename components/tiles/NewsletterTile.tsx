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
        <h3 className="text-[18px] sm:text-[22px] xl:text-[24px] 2xl:text-[30px] font-medium text-[var(--text-primary)] leading-[1.22] tracking-tight">
          Get dev tips & guides straight to your inbox for free!
        </h3>

        <form onSubmit={handleSubmit} className="mt-auto pt-4 w-full">
          {subscribed ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 dark:bg-white/[0.06] dark:border-white/10 dark:text-white text-sm font-medium">
              <Check className="w-4 h-4 text-emerald-600 dark:text-neutral-300" />
              <span>Subscribed successfully.</span>
            </div>
          ) : (
            <div className="flex items-center w-full bg-neutral-100 dark:bg-[#101010] border border-black/[0.08] dark:border-white/[0.08] rounded-full p-1.5 focus-within:border-black/25 dark:focus-within:border-white/20 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-transparent px-4 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-black text-white dark:bg-white/[0.09] dark:hover:bg-white dark:text-neutral-200 dark:hover:text-black text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer"
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
