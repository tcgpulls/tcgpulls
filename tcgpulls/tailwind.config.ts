import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "480px", // ≥480px
        sm: "640px", // ≥640px
        md: "768px", // ≥768px
        lg: "1024px", // ≥1024px
        xl: "1280px", // ≥1280px
        "2xl": "1536px", // ≥1536px
        "3xl": "1792px", // ≥1792px
        "4xl": "1920px", // ≥1920px
      },
    },
  },
  plugins: [],
} satisfies Config;
