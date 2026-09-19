import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";
import { TypingText } from "./TypingText";
import type { CharState } from "@/types";
import { cn } from "@/lib/utils";

interface TypingAreaProps {
  text: string;
  typed: string;
  charState: (index: number) => CharState;
  onType: (char: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  showCaret?: boolean;
  textClassName?: string;
}

/**
 * Captures keystrokes via a visually-hidden input so mobile keyboards work
 * too. Keystroke handling stays in the engine hook; this component only
 * forwards events, avoiding redundant state and unnecessary re-renders.
 */
export function TypingArea({
  text,
  typed,
  charState,
  onType,
  onBackspace,
  disabled,
  className,
  autoFocus = true,
  showCaret = true,
  textClassName,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Do not summon the software keyboard merely by navigating to a page.
    // Physical-keyboard devices retain the convenient autofocus behavior.
    if (autoFocus && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      onBackspace();
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (typed.length < text.length) onType(e.key);
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
    // Mobile software keyboards commonly bypass keydown and only emit input.
    // Process the submitted characters then clear the capture field.
    const inserted = input.value;
    if (inserted) {
      for (const char of inserted) {
        if (char.length === 1 && typed.length < text.length) onType(char);
      }
      input.value = "";
    }
  }

  return (
    <div
      className={cn(
        "typing-scroll-area relative h-[210px] overflow-y-auto cursor-text rounded-lg border border-border bg-[#0c3032]/72 p-5 shadow-panel backdrop-blur-panel transition-[border-color,box-shadow,background-color] duration-200 sm:h-[300px] sm:p-7",
        "focus-within:border-border-strong focus-within:bg-[#10403e]/82 focus-within:shadow-[0_1px_0_rgba(139,187,146,0.1)_inset,0_12px_34px_rgba(3,24,26,0.35)]",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="absolute h-px w-px overflow-hidden opacity-0"
        aria-label="Typing input"
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
      <TypingText text={text} charState={charState} showCaret={showCaret} className={textClassName ?? "text-[clamp(1.125rem,2.5vw,1.625rem)]"} />
    </div>
  );
}
