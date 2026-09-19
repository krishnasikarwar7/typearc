import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: string | number;
  className?: string;
  valueClassName?: string;
  large?: boolean;
}

export function Stat({ label, value, className, valueClassName, large }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className={cn("font-mono font-semibold tabular-nums text-text-primary", large ? "text-4xl" : "text-xl", valueClassName)}>
        {value}
      </span>
      <span className="text-xs uppercase tracking-wide text-text-muted">{label}</span>
    </div>
  );
}

interface LiveStatsProps {
  timeLabel: string | number;
  lowTime?: boolean;
  showTime?: boolean;
  compact?: boolean;
}

export function LiveStats({ timeLabel, lowTime = false, showTime = true, compact = false }: LiveStatsProps) {
  return (
    <div className={cn("flex flex-wrap items-center", compact ? "gap-x-5 gap-y-2" : "gap-x-8 gap-y-3")}>
      <Stat label="WPM" value="—" large={!compact} />
      <Stat label="Accuracy" value="—" large={!compact} />
      {showTime && <Stat label="Time" value={timeLabel} valueClassName={lowTime ? "text-danger" : "text-accent-2"} large={!compact} />}
    </div>
  );
}
