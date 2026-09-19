import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 ease-out focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3.5 text-base",
          variant === "primary" &&
            "bg-accent text-[#e7f0e8] shadow-[0_0_0_1px_rgba(139,187,146,0.18)_inset] hover:-translate-y-px hover:bg-accent-2 hover:text-[#092328]",
          variant === "secondary" &&
            "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-elevated",
          variant === "ghost" && "text-text-secondary hover:text-text-primary hover:bg-surface",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
