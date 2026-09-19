import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        "toast-in": "toastIn 0.3s ease-out forwards",
        shimmer: "shimmer 3.5s infinite",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down": "fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float-slow": "floatSlow 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translate(-100%, -100%) rotate(30deg)" },
          "100%": { transform: "translate(100%, 100%) rotate(30deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
