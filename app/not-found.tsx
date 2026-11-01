import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-canvas)] flex items-center justify-center p-4">
      {/* 404 Bento Card (Exact Match to references/Screenshot 2026-10-31 210323.png) */}
      <div className="w-full max-w-lg rounded-[32px] bento-surface p-10 sm:p-14 text-center shadow-2xl flex flex-col items-center justify-center">
        <h1 className="text-8xl sm:text-9xl font-bold font-display text-[var(--text-primary)] tracking-tight mb-6">
          404
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light mb-1">
          It seems like this page doesn't exist, or it's gone.
        </p>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light mb-8">
          But don't worry! I'll get you back on track :)
        </p>

        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-black dark:bg-white/[0.08] dark:hover:bg-white dark:text-white dark:hover:text-black border border-neutral-300 dark:border-white/10 text-xs uppercase tracking-wider font-semibold transition-all duration-300"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

