import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TypingTest } from "@/components/typing/TypingTest";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Home() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-20 text-center sm:min-h-[100svh] sm:flex-none sm:justify-start sm:px-6 sm:pb-8 sm:pt-24">
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }} className="mt-8 w-full text-left sm:mt-7">
          <TypingTest hero />
        </motion.div>
      </section>
      <footer className="border-t border-border bg-surface/45 backdrop-blur-panel">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 px-5 py-4 text-center sm:justify-between sm:gap-5 sm:px-6 sm:py-7 sm:text-left">
          <div className="shrink-0">
            <p className="font-display text-sm font-semibold text-text-primary">TypeArc</p>
            <p className="mt-1 hidden text-xs text-text-muted sm:block">Type. Play. Code.</p>
          </div>
          <nav className="hidden items-center justify-center gap-5 whitespace-nowrap text-sm text-text-secondary sm:flex" aria-label="Footer navigation">
            <Link to="/play" className="transition-colors hover:text-accent-2">Play</Link>
            <Link to="/coder" className="transition-colors hover:text-accent-2">Coder</Link>
            <Link to="/leaderboard" className="transition-colors hover:text-accent-2">Leaderboard</Link>
          </nav>
          <p className="shrink-0 text-[10px] text-text-muted sm:text-xs"><span className="sm:hidden">© 2026 · <a href="https://krishnasikarwar.vercel.app/" target="_blank" rel="noreferrer" className="font-medium text-accent-2 transition-colors hover:text-text-primary">Krishna Sikarwar</a></span><span className="hidden sm:inline">© 2026 TypeArc · Built by <a href="https://krishnasikarwar.vercel.app/" target="_blank" rel="noreferrer" className="font-medium text-accent-2 transition-colors hover:text-text-primary">Krishna Sikarwar</a></span></p>
        </div>
      </footer>
    </div>
  );
}
