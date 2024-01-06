import { type Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

function filterDefault(values: { [s: string]: unknown } | ArrayLike<unknown>) {
	return Object.fromEntries(
		Object.entries(values).filter(([key]) => key !== "DEFAULT"),
	)
}

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
    plugin(
      ({ addUtilities, matchUtilities, theme }) => {
        addUtilities({
          "@keyframes enter": theme("keyframes.enter"),
          "@keyframes exit": theme("keyframes.exit"),
          ".animate-in": {
            animationName: "enter",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-enter-opacity": "initial",
            "--tw-enter-scale": "initial",
            "--tw-enter-rotate": "initial",
            "--tw-enter-translate-x": "initial",
            "--tw-enter-translate-y": "initial",
          },
          ".animate-out": {
            animationName: "exit",
            animationDuration: theme("animationDuration.DEFAULT"),
            "--tw-exit-opacity": "initial",
            "--tw-exit-scale": "initial",
            "--tw-exit-rotate": "initial",
            "--tw-exit-translate-x": "initial",
            "--tw-exit-translate-y": "initial",
          },
        })
    
        matchUtilities(
          {
            "fade-in": (value) => ({ "--tw-enter-opacity": value }),
            "fade-out": (value) => ({ "--tw-exit-opacity": value }),
          },
          { values: theme("animationOpacity") },
        )
    
        matchUtilities(
          {
            "zoom-in": (value) => ({ "--tw-enter-scale": value }),
            "zoom-out": (value) => ({ "--tw-exit-scale": value }),
          },
          { values: theme("animationScale") },
        )
    
        matchUtilities(
          {
            "spin-in": (value) => ({ "--tw-enter-rotate": value }),
            "spin-out": (value) => ({ "--tw-exit-rotate": value }),
          },
          { values: theme("animationRotate") },
        )
    
        matchUtilities(
          {
            "slide-in-from-top": (value) => ({
              "--tw-enter-translate-y": `-${value}`,
            }),
            "slide-in-from-bottom": (value) => ({
              "--tw-enter-translate-y": value,
            }),
            "slide-in-from-left": (value) => ({
              "--tw-enter-translate-x": `-${value}`,
            }),
            "slide-in-from-right": (value) => ({
              "--tw-enter-translate-x": value,
            }),
            "slide-out-to-top": (value) => ({
              "--tw-exit-translate-y": `-${value}`,
            }),
            "slide-out-to-bottom": (value) => ({
              "--tw-exit-translate-y": value,
            }),
            "slide-out-to-left": (value) => ({
              "--tw-exit-translate-x": `-${value}`,
            }),
            "slide-out-to-right": (value) => ({
              "--tw-exit-translate-x": value,
            }),
          },
          { values: theme("animationTranslate") },
        )
    
        matchUtilities( // @ts-ignore
          { duration: (value) => ({ animationDuration: value }) },
          { values: filterDefault(theme("animationDuration")) },
        )
    
        matchUtilities(
          { delay: (value) => ({ animationDelay: value }) },
          { values: theme("animationDelay") },
        )
    
        matchUtilities( // @ts-ignore
          { ease: (value) => ({ animationTimingFunction: value }) },
          { values: filterDefault(theme("animationTimingFunction")) },
        )
    
        addUtilities({
          ".running": { animationPlayState: "running" },
          ".paused": { animationPlayState: "paused" },
        })
    
        matchUtilities(
          { "fill-mode": (value) => ({ animationFillMode: value }) },
          { values: theme("animationFillMode") },
        )
    
        matchUtilities(
          { direction: (value) => ({ animationDirection: value }) },
          { values: theme("animationDirection") },
        )
    
        matchUtilities(
          { repeat: (value) => ({ animationIterationCount: value }) },
          { values: theme("animationRepeat") },
        )
      },
      {
        theme: {
          extend: {
            animationDelay: ({ theme }) => ({
              ...theme("transitionDelay"),
            }),
            animationDuration: ({ theme }) => ({
              0: "0ms",
              ...theme("transitionDuration"),
            }),
            animationTimingFunction: ({ theme }) => ({
              ...theme("transitionTimingFunction"),
            }),
            animationFillMode: {
              none: "none",
              forwards: "forwards",
              backwards: "backwards",
              both: "both",
            },
            animationDirection: {
              normal: "normal",
              reverse: "reverse",
              alternate: "alternate",
              "alternate-reverse": "alternate-reverse",
            },
            animationOpacity: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("opacity"),
            }),
            animationTranslate: ({ theme }) => ({
              DEFAULT: "100%",
              ...theme("translate"),
            }),
            animationScale: ({ theme }) => ({
              DEFAULT: 0,
              ...theme("scale"),
            }),
            animationRotate: ({ theme }) => ({
              DEFAULT: "30deg",
              ...theme("rotate"),
            }),
            animationRepeat: {
              0: "0",
              1: "1",
              infinite: "infinite",
            },
            keyframes: {
              enter: {
                from: {
                  opacity: "var(--tw-enter-opacity, 1)",
                  transform:
                    "translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))",
                },
              },
              exit: {
                to: {
                  opacity: "var(--tw-exit-opacity, 1)",
                  transform:
                    "translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))",
                },
              },
            },
          },
        },
      },
    ),
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
