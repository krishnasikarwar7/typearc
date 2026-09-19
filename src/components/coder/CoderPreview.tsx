import { ChevronDown, Command } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CODE_LANGUAGES, CODE_SNIPPETS } from "@/data/mockData";

export function CoderPreview() {
  const [language, setLanguage] = useState("javascript");
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const code = (CODE_SNIPPETS[language] ?? CODE_SNIPPETS.javascript)[0];
  const lines = code.split("\n").slice(0, 6);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.1 });
    observer.observe(node);
    const timer = window.setInterval(() => setProgress((p) => visible ? (p + 1) % (code.length + 1) : p), 110);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [code.length]);

  return (
    <div ref={ref} className="overflow-hidden rounded-md border border-border bg-[#0b2b2d] font-mono text-[11px] shadow-inner">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 text-text-muted">
        <div className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-danger/70" /><i className="h-2 w-2 rounded-full bg-[#f5c560]/70" /><i className="h-2 w-2 rounded-full bg-success/70" /></div>
        <label className="flex items-center gap-1 text-text-secondary">{CODE_LANGUAGES.find((item) => item.id === language)?.label}<ChevronDown size={12} /><select aria-label="Preview language" value={language} onChange={(event) => { setLanguage(event.target.value); setProgress(0); }} className="absolute cursor-pointer opacity-0"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option><option value="rust">Rust</option><option value="go">Go</option><option value="sql">SQL</option></select></label>
        <span>60s</span>
      </div>
      <div className="min-h-[142px] px-3 py-3 leading-6">
        {lines.map((line, lineIndex) => {
          const start = lines.slice(0, lineIndex).join("\n").length + (lineIndex ? 1 : 0);
          return <div key={lineIndex} className="flex whitespace-pre"><span className="mr-3 w-3 select-none text-right text-text-muted/50">{lineIndex + 1}</span><span className="text-text-muted">{line.split("").map((char, charIndex) => {
            const index = start + charIndex;
            const typed = index < progress;
            const current = index === progress;
            return <span key={charIndex} className={typed ? "text-text-primary" : ""}>{current && <i className="inline-block h-3 w-px animate-caret-blink bg-accent align-middle" />}{char}</span>;
          })}</span></div>;
        })}
      </div>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[10px] text-text-muted"><span><b className="text-text-secondary">74</b> Code WPM</span><span><b className="text-text-secondary">96.8%</b> Accuracy</span><span className="flex items-center gap-1"><Command size={10} /> typing mode</span></div>
    </div>
  );
}
