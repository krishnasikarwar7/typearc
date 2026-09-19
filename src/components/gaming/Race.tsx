import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flag, RotateCcw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TypingArea } from "@/components/typing/TypingArea";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { generateWords } from "@/lib/utils";

interface Ghost {
  name: string;
  color: string;
  speed: number; // chars per tick
  progress: number;
}

const INITIAL_GHOSTS: Ghost[] = [
  { name: "driftcode", color: "#9B6BFF", speed: 0.46, progress: 0 },
  { name: "nyxwave", color: "#35D99A", speed: 0.4, progress: 0 },
  { name: "emberlynx", color: "#FF5C72", speed: 0.34, progress: 0 },
];

export function Race() {
  const [text] = useState(() => generateWords(45));
  const [runKey, setRunKey] = useState(0);
  const [ghosts, setGhosts] = useState<Ghost[]>(INITIAL_GHOSTS);
  const [placement, setPlacement] = useState<number | null>(null);
  const engine = useTypingEngine({ text });
  const finishedRef = useRef(false);

  const playerProgress = (engine.typed.length / text.length) * 100;

  useEffect(() => {
    if (!engine.isRunning || engine.isComplete) return;
    const tick = setInterval(() => {
      setGhosts((gs) =>
        gs.map((g) => ({
          ...g,
          progress: Math.min(100, g.progress + g.speed * (0.6 + Math.random() * 0.8)),
        }))
      );
    }, 220);
    return () => clearInterval(tick);
  }, [engine.isRunning, engine.isComplete]);

  useEffect(() => {
    if (engine.isComplete && !finishedRef.current) {
      finishedRef.current = true;
      const ahead = ghosts.filter((g) => g.progress >= 100).length;
      setPlacement(ahead + 1);
    }
  }, [engine.isComplete, ghosts]);

  function restart() {
    engine.reset();
    setGhosts(INITIAL_GHOSTS.map((g) => ({ ...g, progress: 0 })));
    setPlacement(null);
    finishedRef.current = false;
    setRunKey((k) => k + 1);
  }

  const racers = [
    { name: "you", color: "var(--accent)", progress: playerProgress, isPlayer: true },
    ...ghosts.map((g) => ({ name: g.name, color: g.color, progress: g.progress, isPlayer: false })),
  ];

  return (
    <div key={runKey}>
      <div className="mb-6 space-y-3">
        {racers.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <span className={`w-20 flex-shrink-0 truncate font-mono text-xs ${r.isPlayer ? "text-text-primary" : "text-text-muted"}`}>
              {r.name}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: r.color }}
                animate={{ width: `${r.progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            {r.progress >= 100 && <Flag size={13} className="text-text-muted" />}
          </div>
        ))}
      </div>

      {!engine.isComplete && (
        <TypingArea
          text={text}
          typed={engine.typed}
          charState={engine.charState}
          onType={engine.type}
          onBackspace={engine.backspace}
        />
      )}

      {engine.isComplete && (
        <GlassCard elevated className="p-8 text-center">
          <p className="mb-1 font-display text-2xl font-semibold arc-gradient-text">
            {placement === 1 ? "1st place" : placement === 2 ? "2nd place" : placement === 3 ? "3rd place" : "4th place"}
          </p>
          <p className="mb-6 text-sm text-text-secondary">
            Finished at {engine.stats.wpm} WPM, {engine.stats.accuracy}% accuracy.
          </p>
          <Button variant="primary" onClick={restart}>
            <RotateCcw size={16} />
            Race Again
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
