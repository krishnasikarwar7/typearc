import { memo, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CharState } from "@/types";

interface TypingTextProps {
  text: string;
  charState: (index: number) => CharState;
  className?: string;
  monospace?: boolean;
  preserveWhitespace?: boolean;
  showCaret?: boolean;
}

/**
 * Renders text character-by-character with visual state. Memoized and kept
 * dumb (pure function of typed length) so it only re-renders on actual
 * character changes, not on every internal engine tick.
 */
export const TypingText = memo(function TypingText({
  text,
  charState,
  className,
  monospace = true,
  preserveWhitespace = false,
  showCaret = true,
}: TypingTextProps) {
  const currentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const current = currentRef.current;
    if (!current) return;
    const container = current.closest(".typing-scroll-area");
    if (!(container instanceof HTMLElement)) return;
    const top = current.offsetTop;
    const bottom = top + current.offsetHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;
    if (top < visibleTop || bottom > visibleBottom) {
      container.scrollTo({
        top: Math.max(0, top - container.clientHeight / 2),
        behavior: "smooth",
      });
    }
  });

  const chars = useMemo(() => text.split(""), [text]);

  return (
    <div
      className={cn(
        "select-none leading-[1.85] tracking-[0.008em]",
        monospace ? "font-mono" : "font-sans",
        preserveWhitespace && "whitespace-pre",
        className
      )}
      aria-hidden="true"
    >
      {chars.map((ch, i) => {
        const state = charState(i);
        return (
          <span
            key={i}
            ref={state === "current" ? currentRef : undefined}
            className={cn(
              "relative transition-colors duration-100",
              state === "pending" && "text-text-muted",
              state === "correct" && "text-accent-2",
              state === "incorrect" &&
                (ch === " " ? "bg-danger/25" : "text-danger") + " underline decoration-danger decoration-2",
              state === "current" && "text-accent"
            )}
          >
            {state === "current" && showCaret && (
              <span
                className="absolute -left-px top-[8%] h-[84%] w-[2px] animate-caret-blink rounded-full bg-accent shadow-[0_0_10px_rgba(42,131,95,0.45)]"
                aria-hidden="true"
              />
            )}
            {ch}
          </span>
        );
      })}
    </div>
  );
});
