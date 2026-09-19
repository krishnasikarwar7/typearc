import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { TypingArea } from "./TypingArea";
import { LiveStats } from "./Stats";
import { ResultsScreen } from "./ResultsScreen";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { generateWords } from "@/lib/utils";
import { loadSettings, type FontSize } from "@/lib/settings";
import type { TestDuration } from "@/types";

const DURATIONS: TestDuration[] = [30, 45, 60, 120];
const HERO_TEXTS = [
  "The fastest way to improve your typing is to practice consistently while keeping your hands relaxed and your attention focused on accuracy. Speed will naturally follow as your fingers become familiar with the movement of each key. Take your time, avoid unnecessary mistakes, and let your rhythm develop with every test you complete. Small improvements may seem quiet at first, but they become a skill you can trust every day.",
  "A clear goal makes it easier to begin, but steady effort is what carries a project forward. Start with the next useful step, give it your full attention, and learn from what happens. When a problem feels large, break it into smaller pieces and solve one piece at a time. Progress is rarely dramatic, yet a calm routine can turn difficult work into something familiar and rewarding.",
  "Learning a new skill is often a matter of returning to it with patience. Some days the work will feel smooth, and other days every detail may need more thought. Both kinds of days are useful. Stay curious, ask good questions, and make room for small experiments. Over time, the ideas that once felt unfamiliar begin to connect, and confidence grows from repeated practice.",
  "Good programming is not only about writing code quickly. It is about noticing the shape of a problem, choosing simple tools, and making each decision clear enough for someone else to follow. A useful solution should be easy to test, easy to change, and kind to the person who will read it later. Careful work today saves time when tomorrow brings a new challenge.",
  "Creative work benefits from structure as much as inspiration. Set aside a little time, remove the distractions you can control, and give your ideas space to appear. The first version does not need to be perfect. It only needs to exist. Once there is something on the page, you can revise, simplify, and improve it. Consistent practice makes the blank page much less intimidating.",
  "A great game gives players a reason to pay attention to every moment. The controls should feel responsive, the goals should be clear, and each small success should invite another attempt. Practice works in much the same way. When feedback is immediate and progress is visible, it becomes easier to stay engaged. Keep playing, keep learning, and enjoy the feeling of getting a little better each round.",
  "Focus is easier to protect when you decide what matters before the day becomes busy. Choose one task, close the tabs that do not help, and give yourself enough time to finish a meaningful part of it. You do not need a perfect system to make progress. You only need a clear next action and the willingness to return when your attention starts to drift.",
  "Technology can make everyday work faster, but the best tools still depend on thoughtful people. A useful interface should feel calm, clear, and easy to understand. It should help someone finish a task without asking for more attention than necessary. When design respects a person's time, even a small interaction can feel smooth. Simple details, carefully considered, often make the biggest difference.",
  "Problem solving improves when you allow yourself to slow down at the beginning. Read the question carefully, identify what you know, and notice what is still uncertain. Then try the smallest reasonable step. A wrong attempt can still teach you something useful, especially when you take a moment to understand why it failed. With patience, a confusing problem usually becomes a series of manageable choices.",
  "Consistency is more powerful than a burst of effort that disappears after a few days. A short session of focused practice can build momentum when it happens often enough. Keep your setup simple, make the next step easy to begin, and celebrate the evidence that you are improving. You do not have to move quickly all the time. You only have to keep moving in a direction that matters.",
  "Working with a team becomes easier when people share context early and communicate with care. Explain the goal, describe the tradeoffs, and leave room for questions before assumptions become expensive. Good collaboration is not about having the loudest answer. It is about combining different perspectives until the next decision feels clear. A reliable process helps everyone spend more energy on the work that matters.",
  "Every useful habit begins as a small choice repeated on ordinary days. Open the document, write the first line, solve the first problem, or type the first sentence. The beginning may not feel impressive, but it creates a path for the next action. Give yourself permission to improve gradually. With enough steady practice, the things that once required effort begin to feel natural and even enjoyable.",
];

const HERO_EXTENSIONS = [
  " Keep the pace comfortable, and notice how steady attention turns familiar movements into reliable skill.",
  " A thoughtful routine gives you room to improve without rushing the process or losing sight of what matters.",
  " Each careful session builds useful confidence, especially when you return with a clear intention to learn.",
  " Clear habits make space for better decisions, stronger work, and a calmer approach to difficult tasks.",
];

function heroTextForDuration(duration: TestDuration, index: number) {
  const first = HERO_TEXTS[index % HERO_TEXTS.length];
  if (duration === 30) return first;
  if (duration === 45) return `${first} ${HERO_EXTENSIONS[index % HERO_EXTENSIONS.length]}`;
  if (duration === 60) return `${first}\n\n${HERO_TEXTS[(index + 1) % HERO_TEXTS.length]}`;
  return `${first}\n\n${HERO_TEXTS[(index + 1) % HERO_TEXTS.length]}\n\n${HERO_TEXTS[(index + 2) % HERO_TEXTS.length]}`;
}

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  small: "text-[clamp(1rem,2.1vw,1.375rem)]",
  medium: "text-[clamp(1.125rem,2.5vw,1.625rem)]",
  large: "text-[clamp(1.25rem,2.8vw,1.75rem)]",
};

export function TypingTest({ hero = false }: { hero?: boolean }) {
  const [preferences, setPreferences] = useState(() => loadSettings());
  const [mode, setMode] = useState<"time" | "words">("time");
  const [duration, setDuration] = useState<TestDuration>(() => preferences.defaultDuration);
  const [wordCount, setWordCount] = useState<25 | 50 | 100>(50);
  const [soundOn, setSoundOn] = useState(false);
  const [text, setText] = useState(() => hero ? heroTextForDuration(preferences.defaultDuration, 0) : generateWords(mode === "time" ? 200 : wordCount));
  const [lastHeroText, setLastHeroText] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const engine = useTypingEngine({
    text,
    durationSeconds: mode === "time" ? duration : undefined,
  });

  useEffect(() => {
    document.documentElement.dataset.smoothAnimations = String(preferences.smoothAnimations);
  }, [preferences.smoothAnimations]);

  useEffect(() => {
    const syncSettings = () => setPreferences(loadSettings());
    window.addEventListener("typearc-settings", syncSettings);
    return () => window.removeEventListener("typearc-settings", syncSettings);
  }, []);


  const restart = useCallback(
    (newDuration = duration, newMode = mode, newWordCount = wordCount) => {
      const nextHeroIndex = (lastHeroText + 1) % HERO_TEXTS.length;
      const nextText = hero
        ? heroTextForDuration(newDuration, nextHeroIndex)
        : generateWords(newMode === "time" ? 200 : newWordCount);
      if (hero) setLastHeroText(nextHeroIndex);
      setText(nextText);
      setRunKey((k) => k + 1);
    },
    [duration, hero, lastHeroText, mode, wordCount]
  );

  function handleRestart() {
    engine.reset(mode === "time" ? duration : undefined);
    restart();
  }

  const timeLabel =
    mode === "time"
      ? engine.isRunning || engine.isComplete
        ? `${engine.remaining}s`
        : `${duration}s`
      : `${engine.stats.elapsedSeconds}s`;

  return (
    <div key={runKey}>
      {!hero && <div className="mb-7 rounded-lg border border-border bg-surface/70 p-2.5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
          options={[
            { value: "time", label: "Time" },
            { value: "words", label: "Words" },
          ]}
          value={mode}
          onChange={(v) => {
            setMode(v);
            handleModeChange(v);
          }}
          />

          <div className="flex flex-wrap items-center gap-2">
          {mode === "time" ? (
            <Tabs
              options={DURATIONS.map((d) => ({ value: String(d), label: `${d}s` }))}
              value={String(duration)}
              onChange={(v) => {
                const d = Number(v) as TestDuration;
                setDuration(d);
                engine.reset(d);
                restart(d, "time");
              }}
            />
          ) : (
            <Tabs
              options={[25, 50, 100].map((w) => ({ value: String(w), label: `${w}` }))}
              value={String(wordCount)}
              onChange={(v) => {
                const w = Number(v) as 25 | 50 | 100;
                setWordCount(w);
                engine.reset();
                restart(duration, "words", w);
              }}
            />
          )}

          <button
            onClick={() => setSoundOn((s) => !s)}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
            aria-pressed={soundOn}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2"
          >
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <Button variant="secondary" size="sm" onClick={handleRestart}>
            <RotateCcw size={14} />
            Restart
          </Button>
          </div>
        </div>
      </div>}

      {!engine.isComplete && (
        <>
          {hero ? (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-lg border border-border bg-surface/80 px-3 py-2.5 shadow-panel backdrop-blur-panel sm:justify-between sm:px-4">
              <div className="order-1"><LiveStats timeLabel={timeLabel} lowTime={engine.isRunning && engine.remaining <= 5} showTime={preferences.showLiveTimer} compact /></div>
              <div className="hidden h-6 w-px bg-border sm:block" />
              <div className="order-3 sm:order-none"><Tabs
                options={DURATIONS.map((d) => ({ value: String(d), label: `${d}s` }))}
                value={String(duration)}
                onChange={(v) => {
                  const nextDuration = Number(v) as TestDuration;
                  setDuration(nextDuration);
                  engine.reset(nextDuration);
                  restart(nextDuration, "time");
                }}
              /></div>
              <div className="hidden h-6 w-px bg-border sm:block" />
              <div className="order-2 sm:order-none"><Button variant="secondary" size="sm" onClick={handleRestart}>
                <RotateCcw size={14} /> Restart
              </Button></div>
            </div>
          ) : (
            <div className="mb-6 px-1"><LiveStats timeLabel={timeLabel} lowTime={engine.isRunning && engine.remaining <= 5} showTime={preferences.showLiveTimer} /></div>
          )}
          <TypingArea
            text={text}
            typed={engine.typed}
            charState={engine.charState}
            onType={engine.type}
            onBackspace={engine.backspace}
            showCaret={preferences.typingCaret}
            textClassName={hero ? FONT_SIZE_CLASSES[preferences.fontSize] : undefined}
          />
          {!hero && <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" size="sm" onClick={handleRestart}>
              <RotateCcw size={14} /> Restart
            </Button>
          </div>}
          {!hero && <p className="mt-3 text-center text-xs text-text-muted">
            Just start typing — no click required. Press{" "}
            <kbd className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono">Esc</kbd> then{" "}
            <kbd className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono">Tab</kbd> to restart
            quickly.
          </p>}
        </>
      )}

      {engine.isComplete && <ResultsScreen stats={engine.stats} onRetry={handleRestart} />}
    </div>
  );

  function handleModeChange(v: "time" | "words") {
    engine.reset(v === "time" ? duration : undefined);
    restart(duration, v);
  }
}
