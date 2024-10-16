/** @type {import("prettier").Config} */
export default {
  semi: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^(bun/(.*)$)|^(bun$)",
    "<BUILTIN_MODULES>",
    "",
    "^(next/(.*)$)|^(next$)|^(react/(.*)$)|^(react$)",
    "^(discord.js/(.*)$)|^(discord.js$)",
    "^(phasebot/(.*)$)|^(phasebot$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@|~)/components/(.*)$",
    "",
    "^(@|~)/hooks/(.*)$",
    "",
    "^(@|~)/config/(.*)$",
    "",
    "^(@|~)/lib/(.*)$",
    "",
    "^(@|~)/styles/(.*)$",
    "",
    "^[~/]",
    "^[.]",
    "",
    "^(@|~)/types/(.*)$",
    "<TYPES>",
  ],
  tailwindAttributes: ["class", "className", "tw"],
  tailwindFunctions: ["clsx", "cn", "cva", "tw"],
}
