module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "glow-sm": `
          0 0 4px 0 var(--tw-shadow-color),
          0 0 11px 0 var(--tw-shadow-color),
          0 0 19px 0 var(--tw-shadow-color),
          0 0 40px 0 var(--tw-shadow-color)
        `,
        "glow": `
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
        "destructive": "rgb(171 58 58)",
        "destructive-foreground": "rgb(248 248 248)",
        "border": "rgb(40 40 40)",
        "input": "rgb(40 40 40)",
        "ring": "rgb(216 216 216)",
      },
      fontFamily: {
        "geist-sans": "var(--font-geist-sans)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
