/** @type {import("prettier").Config} */
export default {
  importOrder: [
    "<BUILTIN_MODULES>",
    "",
    "^(next\/(.*)$)|^(next$)|^(react\/(.*)$)|^(react$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@|~)\/components\/(.*)$",
    "",
    "^(@|~)\/hooks\/(.*)$",
    "",
    "^(@|~)\/config\/(.*)$",
    "",
    "^(@|~)\/lib\/(.*)$",
    "",
    "^(@|~)\/types\/(.*)$",
    "",
    "^(@|~)\/styles\/(.*)$",
    "",
    "^[.]",
  ],
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  semi: false,
}
