import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#E85A4F",
          dark: "#D04A3F",
          light: "#FF6B5E",
        },
        teal: {
          DEFAULT: "#1B998B",
          dark: "#158578",
          light: "#22B8A7",
        },
        night: {
          DEFAULT: "#1A1A2E",
          light: "#252542",
          lighter: "#2F2F4A",
        },
        cream: {
          DEFAULT: "#EAEAEA",
          dark: "#D0D0D0",
        },
        gold: {
          DEFAULT: "#F4C95D",
          dark: "#E5B84D",
          light: "#FFD86B",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card": "0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 8px -2px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 8px 30px -4px rgba(0, 0, 0, 0.4), 0 4px 12px -2px rgba(0, 0, 0, 0.25)",
        "glow-coral": "0 0 30px rgba(232, 90, 79, 0.3)",
        "glow-teal": "0 0 30px rgba(27, 153, 139, 0.3)",
        "glow-gold": "0 0 30px rgba(244, 201, 93, 0.3)",
        "inner-light": "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      },
      borderRadius: {
        "card": "16px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-soft": "bounce-soft 0.5s ease-out",
        "shake": "shake 0.5s ease-in-out",
        "confetti": "confetti 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-soft": {
          "0%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0) rotate(0)" },
          "25%": { transform: "translateX(-5px) rotate(-1deg)" },
          "75%": { transform: "translateX(5px) rotate(1deg)" },
        },
        confetti: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
