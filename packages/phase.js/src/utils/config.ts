import type { ClientOptions } from "discord.js"

import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

export type ConfigOptions = ClientOptions

export const setConfig = (params: ConfigOptions) => params

export const getConfig = async (): Promise<
  ConfigOptions & { configPath: string }
> => {
  const extensions = [".js", ".cjs", ".mjs"] as const

  let configPath: `${string}${(typeof extensions)[number]}` | undefined =
    undefined
  let configOptions: ConfigOptions | undefined = undefined

  for (const extension of extensions) {
    const configURL = pathToFileURL(
      resolve(process.cwd(), "./phase.config" + extension),
    )
    if (existsSync(configURL)) {
      if (configOptions) throw new Error("Multiple config files found.")

      configPath = configURL.toString() as `${string}${typeof extension}`
      configOptions = (await import(configPath)).default as
        | ConfigOptions
        | undefined
    }
  }

  if (!configOptions || !configPath) throw new Error("No config file found.")

  return {
    ...configOptions,
    configPath,
  }
}
