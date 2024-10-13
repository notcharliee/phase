// @ts-expect-error no types
import nextPlugin from "@next/eslint-plugin-next"
// @ts-expect-error no types
import reactPlugin from "eslint-plugin-react"
// @ts-expect-error no types
import hooksPlugin from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

import base from "./base.js"

export default tseslint.config(...base, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": hooksPlugin,
    "@next/next": nextPlugin,
  },
  rules: {
    ...hooksPlugin.configs.recommended.rules,
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    ...reactPlugin.configs["jsx-runtime"].rules,
    "@next/next/no-img-element": "off",
    "@next/next/no-duplicate-head": "off",
    "react/no-unescaped-entities": "off",
  },
})
