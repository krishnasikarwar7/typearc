import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Skull } from "lucide-react";
import { GameHud } from "./GameHud";
import { TypingArea } from "@/components/typing/TypingArea";
import { ResultsScreen } from "@/components/typing/ResultsScreen";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { generateWords } from "@/lib/utils";

export function Hardcore() {
  const [text, setText] = useState(() => generateWords(80));
  const [runKey, setRunKey] = useState(0);
  const [failed, setFailed] = useState(false);

  const engine = useTypingEngine({ text });

  const progress = useMemo(
    () => Math.min(100, (engine.typed.length / text.length) * 100),
    [engine.typed.length, text.length]
  );

  const handleType = useCallback(
    (char: string) => {
      const target = text[engine.typed.length];
      if (char !== target) {
        setFailed(true);
        engine.finish();
        return;
      }
      engine.type(char);
    },
    [engine, text]
  );

  function restart() {
    engine.reset();
    setText(generateWords(80));
    setFailed(false);
    setRunKey((k) => k + 1);
  }

  return (
    <div key={runKey}>
      {!engine.isComplete && (
        <>
          <GameHud
            title="Hardcore"
            wpm={engine.stats.wpm}
            accuracy={engine.stats.accuracy}
            progress={progress}
            livesLeft={1}
          />
          <TypingArea
            text={text}
            typed={engine.typed}
            charState={engine.charState}
            onType={handleType}
            onBackspace={engine.backspace}
          />
        </>
      )}

      {engine.isComplete && failed && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard elevated className="p-8 text-center">
            <Skull className="mx-auto mb-3 text-danger" size={28} />
            <p className="mb-1 font-display text-xl font-semibold">Run ended</p>
            <p className="mb-6 text-sm text-text-secondary">
              One mistake, one run. You reached {engine.stats.characters} characters at {engine.stats.wpm} WPM.
            </p>
            <Button variant="primary" onClick={restart}>
              <RotateCcw size={16} />
              Try Again
            </Button>
          </GlassCard>
        </motion.div>
      )}

      {engine.isComplete && !failed && <ResultsScreen stats={engine.stats} onRetry={restart} />}
    </div>
  );
}
