import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#111111",
        "surface-elevated": "#1a1a1a",
        border: "#222222",
        "border-hover": "#333333",
        primary: "#4CAF50",
        "primary-hover": "#45a049",
        red: "#ff5555",
        amber: "#ffaa33",
        green: "#55ff88",
        blue: "#5599ff",
        purple: "#cc66ff",
        muted: "#888888",
        "text-primary": "#ffffff",
        "text-secondary": "#cccccc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
