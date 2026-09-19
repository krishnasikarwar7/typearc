import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, elevated, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border",
          elevated ? "bg-surface-elevated shadow-elevated" : "bg-surface shadow-panel",
          "backdrop-blur-panel",
          interactive &&
            "transition-colors duration-200 hover:border-border-strong hover:bg-surface-elevated",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
