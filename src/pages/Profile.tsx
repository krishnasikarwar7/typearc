import { motion } from "framer-motion";
import { Award, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stat } from "@/components/typing/Stats";
import { WpmChart } from "@/components/dashboard/WpmChart";
import { ACHIEVEMENTS, RECENT_TESTS, STRENGTHS, WPM_HISTORY } from "@/data/mockData";
import { cn } from "@/lib/utils";

const LEVEL_XP = 12450;
const LEVEL_XP_TARGET = 15000;

export function Profile() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-36">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-xl font-bold text-[#06070a]">
            U
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">User</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
              <span>Level 24</span>
              <span className="text-text-muted">·</span>
              <span className="flex items-center gap-1">
                <Flame size={13} className="text-accent-2" />
                17 day streak
              </span>
            </div>
          </div>
        </div>
        <div className="w-full max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
            <span>Level 24</span>
            <span className="font-mono">
              {LEVEL_XP.toLocaleString()} / {LEVEL_XP_TARGET.toLocaleString()} XP
            </span>
          </div>
          <ProgressBar value={(LEVEL_XP / LEVEL_XP_TARGET) * 100} height={8} />
        </div>
      </div>

      {/* Top stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Avg WPM", value: 87 },
          { label: "Best WPM", value: 112 },
          { label: "Accuracy", value: "96.4%" },
          { label: "Consistency", value: "89%" },
          { label: "Tests", value: 184 },
          { label: "Streak", value: "17d" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4">
            <Stat label={s.label} value={s.value} />
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance chart */}
        <GlassCard elevated className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Performance
          </h2>
          <WpmChart data={WPM_HISTORY} />
          <div className="mt-2 flex justify-between text-xs text-text-muted">
            <span>14 tests ago</span>
            <span>Most recent</span>
          </div>
        </GlassCard>

        {/* Strengths */}
        <GlassCard elevated className="p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Typing strengths
          </h2>
          <div className="space-y-4">
            {STRENGTHS.map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{s.label}</span>
                  <span className="font-mono text-text-primary">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} gradient={false} height={5} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent tests */}
        <GlassCard elevated className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Recent tests
          </h2>
          <div className="divide-y divide-border">
            {RECENT_TESTS.map((t) => (
              <div key={t.id} className="grid grid-cols-[1fr_3.5rem_4rem_5rem] items-center gap-3 py-3 text-sm">
                <div>
                  <div className="text-text-primary">{t.mode}</div>
                  <div className="text-xs text-text-muted">{t.date}</div>
                </div>
                <span className="text-right font-mono tabular-nums text-text-primary">{t.wpm}</span>
                <span className="text-right font-mono tabular-nums text-text-secondary">{t.accuracy}%</span>
                <span className="text-right font-mono tabular-nums text-text-secondary">{t.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard elevated className="p-6">
          <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Achievements
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-md border p-3",
                  a.unlocked ? "border-border-strong bg-surface-elevated" : "border-border bg-transparent opacity-50"
                )}
                title={a.description}
              >
                <Award size={16} className={a.unlocked ? "text-accent" : "text-text-muted"} />
                <span className="text-xs font-medium leading-tight text-text-primary">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
