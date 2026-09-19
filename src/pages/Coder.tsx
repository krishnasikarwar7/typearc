import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/typing/Stats";
import { CodeEditor } from "@/components/coder/CodeEditor";
import { ResultsScreen } from "@/components/typing/ResultsScreen";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { CODE_LANGUAGES, CODE_SNIPPETS } from "@/data/mockData";
import type { Difficulty } from "@/types";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

function pickSnippet(langId: string, previous?: string) {
  const snippets = CODE_SNIPPETS[langId] ?? CODE_SNIPPETS.javascript;
  const choices = snippets.length > 1 ? snippets.filter((snippet) => snippet !== previous) : snippets;
  return choices[Math.floor(Math.random() * choices.length)];
}

export function Coder() {
  const [language, setLanguage] = useState("javascript");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [code, setCode] = useState(() => pickSnippet("javascript"));
  const [runKey, setRunKey] = useState(0);

  const engine = useTypingEngine({ text: code });

  const restart = useCallback((lang = language) => {
    setCode((current) => pickSnippet(lang, current));
    setRunKey((k) => k + 1);
  }, [language]);

  function handleRestart() {
    engine.reset();
    restart();
  }

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    engine.reset();
    setCode((current) => pickSnippet(lang, current));
    setRunKey((k) => k + 1);
  }

  const hasStarted = engine.isRunning || engine.isComplete;
  const symbolAccuracy = getCharacterAccuracy(engine.typed, code, (character) => !/[A-Za-z0-9\s]/.test(character));
  const bracketAccuracy = getCharacterAccuracy(engine.typed, code, (character) => "()[]{}".includes(character));

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28">
      <div className="mb-8">
        <p className="mb-2 font-mono text-sm text-accent-2">Coder</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Train your typing on real code.
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <LanguageSelector language={language} onChange={handleLanguageChange} />
        <div className="flex items-center gap-3">
          <Tabs
            options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
            value={difficulty}
            onChange={(v) => setDifficulty(v as Difficulty)}
          />
          <Button variant="secondary" size="sm" onClick={handleRestart}>
            <RotateCcw size={14} />
            Restart
          </Button>
        </div>
      </div>

      <div key={runKey}>
        {!engine.isComplete && (
          <>
            <div className="mb-5 flex flex-wrap gap-x-10 gap-y-3">
              <Stat label="Code WPM" value={hasStarted ? "LIVE" : "—"} large />
              <Stat label="Accuracy" value={hasStarted ? "LIVE" : "—"} large />
              <Stat label="Symbol Acc." value={hasStarted && symbolAccuracy !== null ? `${symbolAccuracy}%` : "—"} />
              <Stat label="Bracket Acc." value={hasStarted && bracketAccuracy !== null ? `${bracketAccuracy}%` : "—"} />
            </div>
            <CodeEditor
              code={code}
              charState={engine.charState}
              typedLength={engine.typed.length}
              onType={engine.type}
              onBackspace={engine.backspace}
            />
            <p className="mt-3 text-xs text-text-muted">
              Tab inserts a space · Enter advances to the next line · start typing to begin.
            </p>
          </>
        )}

        {engine.isComplete && (
          <ResultsScreen
            stats={engine.stats}
            onRetry={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

function getCharacterAccuracy(typed: string, target: string, matches: (character: string) => boolean) {
  let total = 0;
  let correct = 0;
  for (let index = 0; index < typed.length; index += 1) {
    if (!matches(target[index] ?? "")) continue;
    total += 1;
    if (typed[index] === target[index]) correct += 1;
  }
  return total ? Math.round((correct / total) * 1000) / 10 : null;
}

function LanguageSelector({ language, onChange }: { language: string; onChange: (language: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = CODE_LANGUAGES.find((item) => item.id === language);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-w-[148px] items-center justify-between gap-5 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary transition-colors hover:border-border-strong hover:bg-surface-elevated focus-visible:outline-2"
      >
        {selected?.label}<ChevronDown size={14} className={`text-accent-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label="Code language" className="absolute left-0 z-30 mt-2 w-full min-w-[180px] overflow-hidden rounded-md border border-border-strong bg-[#092328]/95 p-1 shadow-elevated backdrop-blur-panel">
          {CODE_LANGUAGES.map((item) => {
            const active = item.id === language;
            return <button key={item.id} type="button" role="option" aria-selected={active} onClick={() => { onChange(item.id); setOpen(false); }} className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left font-mono text-sm transition-colors ${active ? "bg-accent/15 text-accent-2" : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"}`}>{item.label}{active && <Check size={14} className="text-accent-2" />}</button>;
          })}
        </div>
      )}
    </div>
  );
}
