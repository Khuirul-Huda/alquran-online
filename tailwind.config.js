/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quran: {
          deep: "#1b4332",       /* --primary-deep: Deep emerald green */
          medium: "#2d6a4f",     /* --primary-medium: Medium forest green */
          light: "#40916c",      /* --primary-light: Sage green */
          accent: "#52b788",     /* --primary-accent: Mint green accent */
          gold: "#d4af37",       /* --accent-gold: Elegant gold text/borders */
          "gold-light": "#f4ebd0", /* --accent-gold-light: Soft gold bg */
          cream: "#fffdf0",      /* Warm yellow/cream verse bg */
          bg: "#f4f7f5"          /* Off-white background */
        }
      },
      fontFamily: {
        ui: ["Outfit", "Inter", "sans-serif"],
        arabic: ["Amiri", "serif"],
      }
    },
  },
  plugins: [],
};
