/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        elevated: "var(--shadow-elevated)",
      },
      backdropBlur: {
        panel: "var(--blur-panel)",
      },
      keyframes: {
        "caret-blink": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "arc-pulse": {
          "0%, 100%": { opacity: 0.55 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1s step-end infinite",
        "arc-pulse": "arc-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
