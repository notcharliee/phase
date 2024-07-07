/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        jiggle: "jiggle 0.2s infinite",
      },
      boxShadow: {
        "glow-sm": `
          0 0 4px 0 var(--tw-shadow-color),
          0 0 11px 0 var(--tw-shadow-color),
          0 0 19px 0 var(--tw-shadow-color),
          0 0 40px 0 var(--tw-shadow-color)
        `,
        glow: `
          0 0 4px 0 var(--tw-shadow-color),
          0 0 11px 0 var(--tw-shadow-color),
          0 0 19px 0 var(--tw-shadow-color),
          0 0 40px 0 var(--tw-shadow-color),
          0 0 80px 0 var(--tw-shadow-color)
        `,
        "glow-lg": `
          0 0 4px 0 var(--tw-shadow-color),
          0 0 11px 0 var(--tw-shadow-color),
          0 0 19px 0 var(--tw-shadow-color),
          0 0 40px 0 var(--tw-shadow-color),
          0 0 80px 0 var(--tw-shadow-color),
          0 0 120px 0 var(--tw-shadow-color)
        `,
      },
      colors: {
        "muted-background": "rgb(0 0 0)",
        background: "rgb(16 16 16)",
        foreground: "rgb(248 248 248)",
        card: "rgb(16 16 16)",
        "card-foreground": "rgb(248 248 248)",
        popover: "rgb(16 16 16)",
        "popover-foreground": "rgb(248 248 248)",
        primary: "rgb(248 248 248)",
        "primary-foreground": "rgb(24 24 24)",
        secondary: "rgb(40 40 40)",
        "secondary-foreground": "rgb(248 248 248)",
        muted: "rgb(40 40 40)",
        "muted-foreground": "rgb(192 192 192)",
        accent: "rgb(40 40 40)",
        "accent-foreground": "rgb(248 248 248)",
        destructive: "rgb(171 58 58)",
        "destructive-foreground": "rgb(248 248 248)",
        border: "rgb(40 40 40)",
        input: "rgb(40 40 40)",
        ring: "rgb(216 216 216)",
      },
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
    },
  },
  plugins: [require("tailwindcss-animate")],
}
