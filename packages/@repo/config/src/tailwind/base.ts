import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "rgb(40 40 40)",
        input: "rgb(40 40 40)",
        ring: "rgb(216 216 216)",
        foreground: "rgb(248 248 248)",
        background: "rgb(16 16 16)",
        primary: {
          DEFAULT: "rgb(248 248 248)",
          foreground: "rgb(24 24 24)",
        },
        secondary: {
          DEFAULT: "rgb(40 40 40)",
          foreground: "rgb(248 248 248)",
        },
        muted: {
          DEFAULT: "rgb(40 40 40)",
          background: "rgb(8 8 8)",
          foreground: "rgb(192 192 192)",
        },
        accent: {
          DEFAULT: "rgb(40 40 40)",
          foreground: "rgb(248 248 248)",
        },
        destructive: {
          DEFAULT: "rgb(171 58 58)",
          foreground: "rgb(248 248 248)",
        },
        popover: {
          DEFAULT: "rgb(16 16 16)",
          foreground: "rgb(248 248 248)",
        },
        card: {
          DEFAULT: "rgb(16 16 16)",
          foreground: "rgb(248 248 248)",
        },
      },
      borderRadius: {
        sm: "0.5rem", // 8px
        DEFAULT: "0.625rem", // 10px
        md: "0.75rem", // 12px
        lg: "0.875rem", // 14px
        xl: "1.125rem", // 18px
        "2xl": "1.5rem", // 24px
        "3xl": "2rem", // 32px
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
    },
  },
} satisfies Config
