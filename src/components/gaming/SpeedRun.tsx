import { useCallback, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { GameHud } from "./GameHud";
import { TypingArea } from "@/components/typing/TypingArea";
import { ResultsScreen } from "@/components/typing/ResultsScreen";
import { Button } from "@/components/ui/Button";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { generateWords } from "@/lib/utils";

export function SpeedRun() {
  const [text, setText] = useState(() => generateWords(60));
  const [runKey, setRunKey] = useState(0);
  const [combo, setCombo] = useState(0);

  const engine = useTypingEngine({ text, durationSeconds: 30 });

  const progress = useMemo(
    () => Math.min(100, (engine.typed.length / text.length) * 100),
    [engine.typed.length, text.length]
  );

  const score = Math.round(engine.stats.wpm * (engine.stats.accuracy / 100) * 62 + combo * 40);

  const handleType = useCallback(
    (char: string) => {
      const target = text[engine.typed.length];
      setCombo((c) => (char === target ? c + 1 : 0));
      engine.type(char);
    },
    [engine, text]
  );

  function restart() {
    engine.reset(30);
    setText(generateWords(60));
    setCombo(0);
    setRunKey((k) => k + 1);
  }

  return (
    <div key={runKey}>
      {!engine.isComplete && (
        <>
          <GameHud
            title="Speed Run"
            wpm={engine.stats.wpm}
            accuracy={engine.stats.accuracy}
            progress={progress}
            combo={combo}
            score={score}
          />
          <TypingArea
            text={text}
            typed={engine.typed}
            charState={engine.charState}
            onType={handleType}
            onBackspace={engine.backspace}
          />
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" size="sm" onClick={restart}>
              <RotateCcw size={14} />
              Restart
            </Button>
          </div>
        </>
      )}
      {engine.isComplete && <ResultsScreen stats={engine.stats} onRetry={restart} />}
    </div>
  );
}
