import animate from "tailwindcss-animate"

import baseConfig from "./base"

import type { Config } from "tailwindcss"

export default {
  presets: [baseConfig],
  content: [...baseConfig.content, "../../node_modules/@repo/ui/dist/**/*.js"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
      },
      height: {
        screen: "100dvh",
        "screen-no-header": "calc(100dvh - 4rem)",
      },
      maxHeight: {
        screen: "100dvh",
        "screen-no-header": "calc(100dvh - 4rem)",
      },
      minHeight: {
        screen: "100dvh",
        "screen-no-header": "calc(100dvh - 4rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "moon-twinkle": {
          "0%": { width: "0px", height: "0px" },
          "65%": {
            width: "100px",
            height: "100px",
            transform: "rotate(120deg)",
          },
          "100%": { width: "0px", height: "0px", transform: "rotate(180deg)" },
        },
        jiggle: {
          "0%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "moon-shrink": {
          "100%": {
            width: "0px",
            height: "0px",
            filter: "contrast(2.5)",
            transform: "rotate(120deg)",
          },
        },
        "text-fade-in": {
          from: { opacity: "0%" },
          to: { opacity: "100%" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        jiggle: "jiggle 0.2s infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config
