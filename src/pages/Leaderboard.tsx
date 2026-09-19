import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export function Leaderboard() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-2xl items-center px-5 pb-16 pt-28 text-center sm:px-6 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className="w-full"
      >
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-accent-2 shadow-panel">
          <Trophy size={20} strokeWidth={1.8} />
        </div>
        <p className="mb-3 font-mono text-xs font-medium tracking-[0.18em] text-accent">LEADERBOARD</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Coming Soon</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary">
          The TypeArc leaderboard is being built. Soon you&apos;ll be able to compete, climb the rankings, and see how you stack up.
        </p>
        <Link to="/play" className="mt-8 inline-flex">
          <Button variant="primary">
            Go to Play <ArrowRight size={16} />
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-sm"
        >
          <GlassCard elevated className="overflow-hidden p-0 text-left">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[11px] font-medium tracking-[0.12em] text-text-secondary">
              <span>GLOBAL LEADERBOARD</span>
              <span className="text-accent">IN DEVELOPMENT</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-5">
              <div className="flex gap-1.5 text-accent-2"><span>•</span><span>•</span><span>•</span></div>
              <div><p className="text-sm font-medium text-text-primary">Rankings incoming</p><p className="mt-0.5 text-xs text-text-muted">Coming soon to TypeArc.</p></div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </main>
  );
}
