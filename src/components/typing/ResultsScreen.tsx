import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Stat } from "./Stats";
import type { TypingStats } from "@/types";

interface ResultsScreenProps {
  stats: TypingStats;
  onRetry: () => void;
}

export function ResultsScreen({ stats, onRetry }: ResultsScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <GlassCard elevated className="p-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">Test complete</p>
        <div className="mb-8 flex flex-wrap items-end gap-x-12 gap-y-4">
          <div>
            <div className="font-mono text-6xl font-bold tabular-nums arc-gradient-text">{stats.wpm}</div>
            <div className="mt-1 text-sm text-text-secondary">WPM</div>
          </div>
          <div>
            <div className="font-mono text-4xl font-semibold tabular-nums text-text-primary">
              {stats.accuracy}%
            </div>
            <div className="mt-1 text-sm text-text-secondary">Accuracy</div>
          </div>
          <div>
            <div className="font-mono text-4xl font-semibold tabular-nums text-text-primary">
              {stats.consistency}%
            </div>
            <div className="mt-1 text-sm text-text-secondary">Consistency</div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
          <Stat label="Raw WPM" value={stats.rawWpm} />
          <Stat label="Characters" value={stats.characters} />
          <Stat label="Errors" value={stats.mistakes} />
          <Stat label="Time" value={`${stats.elapsedSeconds}s`} />
        </div>

        <Button onClick={onRetry} variant="primary">
          <RotateCcw size={16} />
          Restart
        </Button>
      </GlassCard>
    </motion.div>
  );
}
