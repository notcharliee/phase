import ora from "ora"

import type { Options as OraOptions } from "ora"

export const baseOraOptions: OraOptions = {
  color: "white",
  interval: 20,
  stream: process.stdout,
}

export const spinner = (params: string | OraOptions) => {
  return ora({
    ...baseOraOptions,
    ...(typeof params === "string" ? { text: params } : params),
  })
}
