import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: 'media',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeInLoop: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        fadeInUpLoop: {
          '0%, 100%': { opacity: '0', transform: 'translateY(10px)' },
          '50%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDownLoop: {
          '0%, 100%': { opacity: '0', transform: 'translateY(-10px)' },
          '50%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeftLoop: {
          '0%, 100%': { opacity: '0', transform: 'translateX(-10px)' },
          '50%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRightLoop: {
          '0%, 100%': { opacity: '0', transform: 'translateX(10px)' },
          '50%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInScaleLoop: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeInLoop: 'fadeInLoop 4s ease-in-out infinite',
        fadeInUpLoop: 'fadeInUpLoop 4s ease-in-out infinite',
        fadeInDownLoop: 'fadeInDownLoop 4s ease-in-out infinite',
        fadeInLeftLoop: 'fadeInLeftLoop 4s ease-in-out infinite',
        fadeInRightLoop: 'fadeInRightLoop 4s ease-in-out infinite',
        fadeInScaleLoop: 'fadeInScaleLoop 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    typography({
      // Optionally customize typography plugin here if needed
    }),
  ],
};

export default config;