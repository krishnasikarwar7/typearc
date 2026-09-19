import { motion } from "framer-motion";
import type { LeaderboardEntry } from "@/types";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  index: number;
}

export function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const topThree = entry.rank <= 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
      className="grid grid-cols-[2.5rem_1fr_5rem_5rem_6rem] items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-white/[0.03] sm:gap-4 sm:px-4"
    >
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          topThree ? "font-semibold text-accent" : "text-text-muted"
        )}
      >
        {String(entry.rank).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-3 overflow-hidden">
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#06070a]"
          style={{ backgroundColor: entry.color }}
        >
          {entry.initials}
        </span>
        <span className="truncate text-sm font-medium text-text-primary">{entry.username}</span>
      </div>
      <span className="text-right font-mono text-sm tabular-nums text-text-primary">{entry.wpm}</span>
      <span className="text-right font-mono text-sm tabular-nums text-text-secondary">{entry.accuracy}%</span>
      <span className="text-right font-mono text-sm font-semibold tabular-nums text-text-primary">
        {formatNumber(entry.score)}
      </span>
    </motion.div>
  );
}
