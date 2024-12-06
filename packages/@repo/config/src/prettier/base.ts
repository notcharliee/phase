import * as sortImportsPlugin from "@ianvs/prettier-plugin-sort-imports"
import * as tailwindcssPlugin from "prettier-plugin-tailwindcss"

import type { Config } from "prettier"

const sortImportsImportOrder = [
  "^(bun/(.*)$)|^(bun$)",
  "<BUILTIN_MODULES>",
  "",
  "^(next/(.*)$)|^(next$)",
  "^(react/(.*)$)|^(react$)",
  "^(@phasejs/(.*)$)|^(@phasejs$)",
  "^(discord.js/(.*)$)|^(discord.js$)",
  "",
  "<THIRD_PARTY_MODULES>",
  "",
  "^~/components/(.*)$",
  "",
  "^~/hooks/(.*)$",
  "",
  "^~/config/(.*)$",
  "",
  "^~/lib/(.*)$",
  "",
  "^~/styles/(.*)$",
  "",
  "^[~/]",
  "^[.]",
  "",
  "<TYPES>",
] satisfies string[]

export default {
  semi: false,
  endOfLine: "lf",
  importOrder: sortImportsImportOrder,
  tailwindAttributes: ["class", "className", "tw"],
  tailwindFunctions: ["clsx", "cn", "cva", "tw"],
  plugins: [sortImportsPlugin, tailwindcssPlugin],
} satisfies Config
