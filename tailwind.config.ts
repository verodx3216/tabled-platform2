import type { Config } from "tailwindcss";

/**
 * Tabled brand palette — matches the investor deck.
 * Ros\u00e9 & Slate identity: berry = dusty ros\u00e9 (actions), berryDark = slate (heroes),
 * berryDark: dark backgrounds / hero
 * rose:    secondary accents
 * cream:   light surfaces
 * ink:     body text
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        berry: "#C4707E",
        berryDark: "#2E3138",
        rose: "#D9A0A8",
        cream: "#F4E7E4",
        creamLight: "#FAF2F0",
        ink: "#2C2A2E",
        gold: "#C9A227",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
