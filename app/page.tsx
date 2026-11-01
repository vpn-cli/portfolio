import { BentoGrid } from "@/components/motion/BentoGrid";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center transition-colors duration-250">
      <BentoGrid />
    </main>
  );
}
