import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CharState } from "@/types";

interface CodeEditorProps {
  code: string;
  charState: (index: number) => CharState;
  typedLength: number;
  onType: (char: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "await", "async", "class", "def", "self",
  "public", "private", "fn", "match", "for", "while", "if", "else", "import", "export",
  "from", "new", "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "GROUP", "BY", "ORDER", "DESC",
  "int", "void", "vector", "chan", "range", "with", "as", "struct", "impl", "package",
]);

function tokenClass(word: string): string {
  if (KEYWORDS.has(word)) return "text-accent-2";
  if (/^[0-9]+$/.test(word)) return "text-success";
  return "";
}

export function CodeEditor({ code, charState, typedLength, onType, onBackspace, disabled }: CodeEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentRef = useRef<HTMLSpanElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const current = currentRef.current;
    const container = scrollRef.current;
    if (!current || !container) return;
    const top = current.offsetTop;
    const bottom = top + current.offsetHeight;
    if (top < container.scrollTop || bottom > container.scrollTop + container.clientHeight) {
      container.scrollTo({ top: Math.max(0, top - container.clientHeight / 2), behavior: "smooth" });
    }
  });

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      onBackspace();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (typedLength < code.length) onType("\n");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (typedLength < code.length) onType(code[typedLength] === "\t" ? "\t" : " ");
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (typedLength < code.length) onType(e.key);
    }
  }

  function handleInput(e: FormEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const nativeEvent = e.nativeEvent as InputEvent;
    if (nativeEvent.inputType?.startsWith("delete")) {
      onBackspace();
      input.value = "";
      return;
    }
    const inserted = input.value;
    if (inserted) {
      for (const char of inserted) {
        if (typedLength < code.length) onType(char);
      }
      input.value = "";
    }
  }

  const lines = useMemo(() => code.split("\n"), [code]);
  let globalIndex = 0;

  return (
    <div
      className="relative cursor-text rounded-lg border border-border bg-[#0b2b2d] p-0 shadow-panel backdrop-blur-panel"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-danger/70" /><span className="h-2.5 w-2.5 rounded-full bg-[#f5c560]/70" /><span className="h-2.5 w-2.5 rounded-full bg-success/70" /></div>
        <span className="font-mono text-xs text-text-muted">Code typing</span>
      </div>
      <input
        ref={inputRef}
        className="absolute h-px w-px overflow-hidden opacity-0"
        aria-label="Code typing input"
        value=""
        onChange={() => {}}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={disabled}
      />
      <div ref={scrollRef} className="max-h-[420px] overflow-auto p-5">
        <pre className="font-mono text-[15px] leading-7" aria-hidden="true">
          {lines.map((line, lineIdx) => {
            const words = line.split(/(\s+)/);
            const rendered = (
              <div key={lineIdx} className="flex">
                <span className="mr-4 inline-block w-5 flex-shrink-0 select-none text-right text-text-muted/50">
                  {lineIdx + 1}
                </span>
                <span className="whitespace-pre">
                  {words.map((word, wIdx) => {
                    const cls = tokenClass(word.trim());
                    return (
                      <span key={wIdx} className={cls || undefined}>
                        {word.split("").map((ch) => {
                          const idx = globalIndex;
                          globalIndex += 1;
                          const state = charState(idx);
                          return (
                            <span
                              key={idx}
                              ref={state === "current" ? currentRef : undefined}
                              className={cn(
                                "relative",
                                state === "pending" && "text-text-muted/70",
                                state === "correct" && (cls ? undefined : "text-text-primary"),
                                state === "incorrect" && "bg-danger/20 text-danger underline decoration-danger",
                                state === "current" && "text-text-primary"
                              )}
                            >
                              {state === "current" && (
                                <span className="absolute -left-[1px] top-0 h-full w-[2px] animate-caret-blink bg-accent" />
                              )}
                              {ch}
                            </span>
                          );
                        })}
                      </span>
                    );
                  })}
                </span>
              </div>
            );
            globalIndex += 1; // account for the \n joiner between lines
            return rendered;
          })}
        </pre>
      </div>
    </div>
  );
}
