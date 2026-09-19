import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

const SAMPLE = "the quick brown fox jumps over the lazy dog";

export function HeroPreview() {
  const [typed, setTyped] = useState(0);
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    let i = 0;
    let direction: 1 | -1 = 1;
    const interval = setInterval(() => {
      i += direction;
      if (i >= SAMPLE.length) direction = -1;
      if (i <= 0) direction = 1;
      setTyped(i);
      setWpm(78 + Math.round(Math.sin(i / 4) * 12) + 9);
    }, 65);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard elevated className="w-full max-w-lg p-6" aria-hidden="true">
      <div className="mb-5 flex items-center gap-8">
        <div>
          <div className="font-mono text-3xl font-bold tabular-nums text-text-primary">{wpm}</div>
          <div className="text-xs uppercase tracking-wide text-text-muted">WPM</div>
        </div>
        <div>
          <div className="font-mono text-3xl font-bold tabular-nums text-text-primary">98.4%</div>
          <div className="text-xs uppercase tracking-wide text-text-muted">Accuracy</div>
        </div>
      </div>
      <p className="select-none font-mono text-lg leading-relaxed">
        {SAMPLE.split("").map((ch, i) => (
          <span
            key={i}
            className={
              i < typed
                ? "text-text-primary"
                : i === typed
                ? "relative text-text-primary"
                : "text-text-muted"
            }
          >
            {i === typed && (
              <span className="absolute -left-[1px] top-0 h-full w-[2px] animate-caret-blink bg-accent" />
            )}
            {ch}
          </span>
        ))}
      </p>
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-75"
          style={{ width: `${(typed / SAMPLE.length) * 100}%` }}
        />
      </div>
    </GlassCard>
  );
}
