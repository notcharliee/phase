import tailwindConfig from "@repo/config/tailwind/base.ts"
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
