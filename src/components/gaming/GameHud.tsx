import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/utils";

interface GameHudProps {
  title: string;
  wpm: number;
  accuracy: number;
  progress: number;
  combo?: number;
  score?: number;
  livesLeft?: number;
}

export function GameHud({ title, wpm, accuracy, progress, combo, score, livesLeft }: GameHudProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </h2>
        {typeof livesLeft === "number" && (
          <div className="flex gap-1.5" aria-label={`${livesLeft} lives remaining`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${i < livesLeft ? "bg-danger" : "bg-white/10"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-x-10 gap-y-3">
        <div>
          <div className="font-mono text-4xl font-bold tabular-nums arc-gradient-text">{wpm}</div>
          <div className="text-xs uppercase tracking-wide text-text-muted">WPM</div>
        </div>
        <div>
          <div className="font-mono text-2xl font-semibold tabular-nums text-text-primary">{accuracy}%</div>
          <div className="text-xs uppercase tracking-wide text-text-muted">Accuracy</div>
        </div>
        {typeof combo === "number" && (
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-accent">×{combo}</div>
            <div className="text-xs uppercase tracking-wide text-text-muted">Combo</div>
          </div>
        )}
        {typeof score === "number" && (
          <div>
            <div className="font-mono text-2xl font-semibold tabular-nums text-text-primary">
              {formatNumber(score)}
            </div>
            <div className="text-xs uppercase tracking-wide text-text-muted">Score</div>
          </div>
        )}
      </div>

      <ProgressBar value={progress} />
    </div>
  );
}
