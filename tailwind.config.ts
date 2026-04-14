import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))"
        },
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.08)",
        panel: "0 20px 60px rgba(30, 41, 59, 0.10)",
        focus: "0 0 0 4px rgba(14, 116, 144, 0.16)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 36%), radial-gradient(circle at 85% 12%, rgba(14,165,233,0.18), transparent 28%), radial-gradient(circle at 50% 80%, rgba(99,102,241,0.14), transparent 30%)"
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(14px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        pulseRing: {
          "0%": {
            opacity: "0.7",
            transform: "scale(0.95)"
          },
          "100%": {
            opacity: "0",
            transform: "scale(1.25)"
          }
        }
      },
      animation: {
        "fade-up": "fade-up 360ms cubic-bezier(0.23, 1, 0.32, 1)",
        "pulse-ring": "pulseRing 1.6s cubic-bezier(0.23, 1, 0.32, 1) infinite"
      }
    }
  },
  plugins: [forms]
};

export default config;
