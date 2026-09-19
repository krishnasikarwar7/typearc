import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ options, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2",
              active ? "text-[#092328]" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {active && (
              <motion.span
                className="absolute inset-0 rounded-sm bg-accent-2 shadow-[inset_0_0_0_1px_rgba(42,131,95,0.35)]"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
