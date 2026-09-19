import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  gradient?: boolean;
  height?: number;
}

export function ProgressBar({ value, className, gradient = true, height = 6 }: ProgressBarProps) {
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-white/[0.06]", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full", gradient ? "bg-gradient-to-r from-accent to-accent-2" : "bg-accent")}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
