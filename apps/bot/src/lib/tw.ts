import tailwindConfig from "@repo/config/tailwind/base.js"
import { tailwindToCSS } from "tw-to-css"

const { twj } = tailwindToCSS({
  config: tailwindConfig,
  options: {
    ignoreMediaQueries: true,
  },
})

export const tw = twj as (
  ...content: TemplateStringsArray[]
) => React.CSSProperties
