import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Settings, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/play", label: "Play" },
  { to: "/coder", label: "Coder" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className="fixed left-1/2 top-4 z-40 w-[min(94vw,860px)] -translate-x-1/2"
      initial={false}
      animate={{
        width: scrolled ? "min(94vw, 640px)" : "min(94vw, 860px)",
        top: scrolled ? 12 : 20,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <motion.div
        className="flex items-center justify-between rounded-lg border px-4"
        animate={{
          backgroundColor: scrolled ? "rgba(9,35,40,0.84)" : "rgba(18,84,79,0.24)",
          borderColor: scrolled ? "rgba(139,187,146,0.24)" : "rgba(139,187,146,0.13)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(3,24,26,0.46)"
            : "0 4px 16px rgba(3,24,26,0.18)",
          paddingTop: scrolled ? 8 : 10,
          paddingBottom: scrolled ? 8 : 10,
        }}
        style={{ backdropFilter: `blur(${scrolled ? 18 : 8}px)` }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Link to="/" className="flex items-center gap-2 font-display font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent">
            <Zap size={15} className="text-[#e7f0e8]" strokeWidth={2.5} />
          </span>
          <span className="text-[15px]">TypeArc</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2",
                location.pathname === link.to
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2" aria-label="Settings">
            <Settings size={16} />
          </Link>
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mt-2 rounded-lg border border-border-strong bg-[#0c0e15]/95 p-2 shadow-elevated backdrop-blur-panel md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-sm px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-border" />
            <Link to="/settings" className="block w-full rounded-sm px-3 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary">
              Settings
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
