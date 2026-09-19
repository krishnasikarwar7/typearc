import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Skull } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { COMMON_WORDS } from "@/data/mockData";
import { formatNumber } from "@/lib/utils";

interface Enemy {
  id: number;
  word: string;
  progress: number; // 0 - 1, 1 = reached player
  lane: number;
}

const SPAWN_MS = 1400;
const SPEED_PER_TICK = 0.012;
const LANES = 4;

export function TypeAttack() {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      setEnemies((es) => {
        if (es.length >= 6) return es;
        const word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        idRef.current += 1;
        return [...es, { id: idRef.current, word, progress: 0, lane: idRef.current % LANES }];
      });
    }, SPAWN_MS);
    return () => clearInterval(spawn);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const tick = setInterval(() => {
      setEnemies((es) => {
        const next: Enemy[] = [];
        let hit = false;
        for (const e of es) {
          const p = e.progress + SPEED_PER_TICK;
          if (p >= 1) {
            hit = true;
          } else {
            next.push({ ...e, progress: p });
          }
        }
        if (hit) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setGameOver(true);
            return Math.max(0, nl);
          });
          setCombo(0);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(tick);
  }, [gameOver]);

  function handleChange(value: string) {
    setInput(value);
    const match = enemies.find((e) => e.word === value.trim());
    if (match) {
      setEnemies((es) => es.filter((e) => e.id !== match.id));
      setCombo((c) => c + 1);
      setScore((s) => s + 120 + combo * 15);
      setInput("");
    }
  }

  function restart() {
    setEnemies([]);
    setInput("");
    setScore(0);
    setCombo(0);
    setLives(3);
    setGameOver(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5" aria-label={`${lives} lives remaining`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i < lives ? "bg-danger" : "bg-white/10"}`} />
          ))}
        </div>
        <div className="flex items-center gap-6 font-mono text-sm">
          <span className="text-accent">×{combo}</span>
          <span className="font-semibold text-text-primary">{formatNumber(score)}</span>
        </div>
      </div>

      <GlassCard elevated className="relative h-80 overflow-hidden p-0">
        {gameOver ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center gap-3 text-center"
          >
            <Skull className="text-danger" size={28} />
            <p className="font-display text-xl font-semibold">Overrun</p>
            <p className="text-sm text-text-secondary">Final score: {formatNumber(score)}</p>
            <Button variant="primary" size="sm" onClick={restart}>
              <RotateCcw size={14} />
              Try Again
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="relative h-full">
              <AnimatePresence>
                {enemies.map((e) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      top: `${8 + e.lane * 22}%`,
                      left: `${8 + e.progress * 78}%`,
                    }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ top: { duration: 0.3 }, left: { duration: 0.05, ease: "linear" } }}
                    className="absolute rounded-sm border border-border-strong bg-surface-elevated px-3 py-1.5 font-mono text-sm text-text-primary shadow-panel"
                  >
                    {e.word}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-danger/60 to-transparent" />
            </div>
          </>
        )}
      </GlassCard>

      {!gameOver && (
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type the approaching word…"
          aria-label="Type approaching word"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="mt-4 w-full rounded-md border border-border bg-surface px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-2"
        />
      )}
    </div>
  );
}
