import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        vitalis: {
          void: "#030508",
          deep: "#050a12",
          panel: "#0a1524",
          cyan: "#22d3ee",
          blue: "#38bdf8",
          glow: "#67e8f9",
          red: "#fb7185",
          crimson: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgb(3 5 8)), linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.08) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34, 211, 238, 0.35), transparent)",
        "holo-sweep":
          "linear-gradient(120deg, transparent 0%, rgba(34, 211, 238, 0.15) 45%, rgba(56, 189, 248, 0.2) 50%, rgba(34, 211, 238, 0.15) 55%, transparent 100%)",
      },
      backgroundSize: {
        grid: "64px 64px, 64px 64px",
      },
      boxShadow: {
        cyan: "0 0 40px rgba(34, 211, 238, 0.35), 0 0 80px rgba(56, 189, 248, 0.15)",
        panel: "0 0 0 1px rgba(34, 211, 238, 0.12), 0 25px 80px rgba(0, 0, 0, 0.55)",
        emergency:
          "0 0 0 1px rgba(244, 63, 94, 0.5), 0 0 60px rgba(244, 63, 94, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        scan: "scan 8s linear infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
