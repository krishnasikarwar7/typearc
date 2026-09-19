import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "@/components/navbar/Navbar";
import { Home } from "@/pages/Home";
import { Play } from "@/pages/Play";
import { Coder } from "@/pages/Coder";
import { Leaderboard } from "@/pages/Leaderboard";
import { Settings } from "@/pages/Settings";

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <AnimatePresence initial={false} mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/play"
              element={
                <PageTransition>
                  <Play />
                </PageTransition>
              }
            />
            <Route
              path="/coder"
              element={
                <PageTransition>
                  <Coder />
                </PageTransition>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PageTransition>
                  <Leaderboard />
                </PageTransition>
              }
            />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
