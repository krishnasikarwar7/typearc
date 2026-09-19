import { useCallback, useEffect, useRef, useState } from "react";
import type { CharState, TypingStats } from "@/types";

interface UseTypingEngineOptions {
  text: string;
  durationSeconds?: number; // for time mode; omit for untimed/word mode
  onComplete?: (stats: TypingStats) => void;
}

interface EngineState {
  typed: string;
  startedAt: number | null;
  finishedAt: number | null;
  mistakes: number;
  totalKeystrokes: number;
  wpmSamples: number[]; // one sample per second, for consistency
  lastSampleAt: number | null;
  lastSampleCorrectChars: number;
  isComplete: boolean;
}

const initialState = (): EngineState => ({
  typed: "",
  startedAt: null,
  finishedAt: null,
  mistakes: 0,
  totalKeystrokes: 0,
  wpmSamples: [],
  lastSampleAt: null,
  lastSampleCorrectChars: 0,
  isComplete: false,
});

/**
 * Fully local typing test engine. Keystroke handling is isolated from
 * per-render React state as much as possible so high-speed typing stays
 * responsive: char correctness is derived, not stored per-keystroke.
 */
export function useTypingEngine({ text, durationSeconds, onComplete }: UseTypingEngineOptions) {
  const [state, setState] = useState<EngineState>(initialState());
  const [remaining, setRemaining] = useState(durationSeconds ?? 0);
  const tickRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const stop = useCallback(() => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    setState((s) => {
      if (s.isComplete) return s;
      const finishedAt = Date.now();
      const next = { ...s, isComplete: true, finishedAt };
      return next;
    });
    stop();
  }, [stop]);

  // Timer for time-based mode
  useEffect(() => {
    if (!durationSeconds) return;
    if (state.startedAt && !state.isComplete && !tickRef.current) {
      const deadline = state.startedAt + durationSeconds * 1000;
      tickRef.current = window.setInterval(() => {
        const now = Date.now();
        const nextRemaining = Math.max(0, Math.ceil((deadline - now) / 1000));
        setRemaining(nextRemaining);
        setState((s) => {
          const sampleStartedAt = s.lastSampleAt ?? s.startedAt ?? now;
          const elapsedMinutes = Math.max((now - sampleStartedAt) / 60000, 0.001);
          const correctChars = countCorrectChars(s.typed, text);
          const sampleWpm = Math.max(0, ((correctChars - s.lastSampleCorrectChars) / 5) / elapsedMinutes);
          return {
            ...s,
            wpmSamples: [...s.wpmSamples, sampleWpm],
            lastSampleAt: now,
            lastSampleCorrectChars: correctChars,
          };
        });
        if (nextRemaining === 0) finish();
      }, 1000);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.startedAt, state.isComplete, durationSeconds]);

  const reset = useCallback(
    (newRemaining?: number) => {
      stop();
      setState(initialState());
      setRemaining(newRemaining ?? durationSeconds ?? 0);
    },
    [durationSeconds, stop]
  );

  const type = useCallback(
    (char: string) => {
      setState((s) => {
        if (s.isComplete) return s;
        const startedAt = s.startedAt ?? Date.now();
        const nextTyped = s.typed + char;
        const targetChar = text[s.typed.length];
        const isMistake = char !== targetChar;
        const totalKeystrokes = s.totalKeystrokes + 1;
        const mistakes = s.mistakes + (isMistake ? 1 : 0);
        const reachedEnd = nextTyped.length >= text.length;
        return {
          ...s,
          typed: nextTyped,
          startedAt,
          totalKeystrokes,
          mistakes,
          isComplete: reachedEnd ? true : s.isComplete,
          finishedAt: reachedEnd ? Date.now() : s.finishedAt,
        };
      });
    },
    [text]
  );

  const backspace = useCallback(() => {
    setState((s) => {
      if (s.isComplete || s.typed.length === 0) return s;
      return { ...s, typed: s.typed.slice(0, -1) };
    });
  }, []);

  // Fire onComplete once
  const completedFiredRef = useRef(false);
  useEffect(() => {
    if (state.isComplete && !completedFiredRef.current) {
      completedFiredRef.current = true;
      onComplete?.(computeStats(state, text));
    }
    if (!state.isComplete) completedFiredRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isComplete]);

  const charState = useCallback(
    (index: number): CharState => {
      if (index < state.typed.length) {
        return state.typed[index] === text[index] ? "correct" : "incorrect";
      }
      if (index === state.typed.length) return "current";
      return "pending";
    },
    [state.typed, text]
  );

  const stats = computeStats(state, text);

  return {
    typed: state.typed,
    isComplete: state.isComplete,
    isRunning: !!state.startedAt && !state.isComplete,
    remaining,
    charState,
    type,
    backspace,
    reset,
    finish,
    stats,
  };
}

function computeStats(s: EngineState, text: string): TypingStats {
  const elapsedMs = s.startedAt ? Math.max(0, (s.finishedAt ?? Date.now()) - s.startedAt) : 0;
  const elapsedSeconds = elapsedMs / 1000;
  const elapsedMin = elapsedSeconds / 60;

  const correctChars = countCorrectChars(s.typed, text);
  const incorrectChars = s.typed.length - correctChars;
  const wpm = elapsedMin > 0 ? Math.round((correctChars / 5) / elapsedMin) : 0;
  const rawWpm = elapsedMin > 0 ? Math.round((s.typed.length / 5) / elapsedMin) : 0;
  // Correcting a typo with backspace restores the final score.
  const accuracy = s.typed.length > 0 ? Math.round((correctChars / s.typed.length) * 1000) / 10 : 0;

  let consistency = 100;
  if (s.wpmSamples.length > 1) {
    const mean = s.wpmSamples.reduce((a, b) => a + b, 0) / s.wpmSamples.length;
    const variance =
      s.wpmSamples.reduce((a, b) => a + (b - mean) ** 2, 0) / s.wpmSamples.length;
    const stdDev = Math.sqrt(variance);
    consistency = mean > 0 ? Math.max(0, Math.round(100 - (stdDev / mean) * 100)) : 100;
  }

  return {
    wpm,
    rawWpm,
    accuracy,
    consistency,
    characters: s.typed.length,
    mistakes: incorrectChars,
    elapsedSeconds: Math.max(0, Math.round(elapsedSeconds)),
  };
}

function countCorrectChars(typed: string, text: string) {
  let correct = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === text[index]) correct += 1;
  }
  return correct;
}
