import { tailwindToCSS } from "tw-to-css"

import tailwindConfig from "~/../tailwind.config"

const { twj } = tailwindToCSS({
  config: tailwindConfig,
  options: {
    ignoreMediaQueries: true,
  },
})

export const tw = twj as (
  ...content: TemplateStringsArray[]
) => React.CSSProperties
