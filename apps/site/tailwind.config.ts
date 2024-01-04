import { type Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "main": "url(/bg.png)",
        "grid": "url(/docs/bg-grid.png)",
        "noise": "url(/noise.png)",
      },
      boxShadow: {
        "glow": `
          0 0 4px 0 var(--tw-shadow-color),
          0 0 11px 0 var(--tw-shadow-color),
          0 0 19px 0 var(--tw-shadow-color),
          0 0 40px 0 var(--tw-shadow-color),
          0 0 80px 0 var(--tw-shadow-color),
          0 0 90px 0 var(--tw-shadow-color)
        `
      },
      colors: {
        // main colours
        "dark-900": "rgb(0 0 0)",
        "dark-800": "rgb(8 8 8)",
        "dark-700": "rgb(16 16 16)",
        "dark-600": "rgb(24 24 24)",
        "dark-500": "rgb(32 32 32)",
        "dark-400": "rgb(40 40 40)",
        "dark-300": "rgb(48 48 48)",
        "dark-200": "rgb(56 56 56)",
        "dark-100": "rgb(64 64 64)",
        "light-900": "rgb(256 256 256)",
        "light-800": "rgb(248 248 248)",
        "light-700": "rgb(240 240 240)",
        "light-600": "rgb(232 232 232)",
        "light-500": "rgb(224 224 224)",
        "light-400": "rgb(216 216 216)",
        "light-300": "rgb(208 208 208)",
        "light-200": "rgb(200 200 200)",
        "light-100": "rgb(192 192 192)",
        // shadcn colours
        "background": "rgb(8 8 8)",
        "foreground": "rgb(248 248 248)",
        "card": "rgb(8 8 8)",
        "card-foreground": "rgb(248 248 248)",
        "popover": "rgb(8 8 8)",
        "popover-foreground": "rgb(248 248 248)",
        "primary": "rgb(248 248 248)",
        "primary-foreground": "rgb(24 24 24)",
        "secondary": "rgb(40 40 40)",
        "secondary-foreground": "rgb(248 248 248)",
        "muted": "rgb(40 40 40)",
        "muted-foreground": "rgb(192 192 192)",
        "accent": "rgb(40 40 40)",
        "accent-foreground": "rgb(248 248 248)",
        "border": "rgb(40 40 40)",
        "input": "rgb(40 40 40)",
        "ring": "rgb(216 216 216)",
      },
      fontFamily: {
        "geist-sans": "var(--font-geist-sans)",
      },
      height: {
        "dvh": "100dvh",
      },
      maxHeight: {
        "dvh": "100dvh",
      },
      minHeight: {
        "dvh": "100dvh",
      },
      textShadow: {
        "sm": "0 1px 2px var(--tw-shadow-color)",
        "DEFAULT": "0 2px 4px var(--tw-shadow-color)",
        "lg": "0 8px 16px var(--tw-shadow-color)",
        "glow": `
          0 0 4px var(--tw-shadow-color),
          0 0 11px var(--tw-shadow-color),
          0 0 19px var(--tw-shadow-color),
          0 0 40px var(--tw-shadow-color),
          0 0 80px var(--tw-shadow-color),
          0 0 90px var(--tw-shadow-color)
        `
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => { // children:text-white
      addVariant("children", "&>*")
    }),
    plugin(({ matchUtilities, theme }) => { // text-shadow
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      )
    }),
    plugin(({ matchUtilities, theme }) => { // animation-delay-200
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            }
          },
        },
        {
          values: theme("transitionDelay"),
        },
      )
    }),
  ],
}

export default config
