import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TypingTest } from "@/components/typing/TypingTest";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Home() {
  return (
    <div>
      <section className="mx-auto flex max-w-5xl flex-col items-center px-5 pb-10 pt-20 text-center sm:min-h-[100svh] sm:px-6 sm:pb-8 sm:pt-24">
        <motion.div
          className="w-full"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-2.5 font-mono text-xs font-medium tracking-[0.18em] text-accent">TYPEARC</p>
          <h1 className="font-display text-[clamp(1.8rem,8vw,4.5rem)] font-bold leading-none tracking-[-0.045em] whitespace-nowrap">
            Type. Play. <span className="arc-gradient-text">Code.</span>
          </h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }} className="mt-6 w-full text-left sm:mt-7">
          <TypingTest hero />
        </motion.div>
      </section>
      <footer className="border-t border-border bg-surface/45 backdrop-blur-panel">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-7 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
          <div>
            <p className="font-display text-sm font-semibold text-text-primary">TypeArc</p>
            <p className="mt-1 text-xs text-text-muted">Type. Play. Code.</p>
          </div>
          <nav className="flex items-center justify-center gap-5 text-sm text-text-secondary" aria-label="Footer navigation">
            <Link to="/play" className="transition-colors hover:text-accent-2">Play</Link>
            <Link to="/coder" className="transition-colors hover:text-accent-2">Coder</Link>
            <Link to="/leaderboard" className="transition-colors hover:text-accent-2">Leaderboard</Link>
          </nav>
          <p className="text-xs text-text-muted">© 2026 TypeArc · Built by Krishna Sikarwar</p>
        </div>
      </footer>
    </div>
  );
}
