import { type BotCommandExecuteFunction } from "~/builders"

export const getMiddleware = async () => {
  const path = Array.from(
    new Bun.Glob("src/commands/middleware.{js,ts,jsx,tsx}").scanSync({
      absolute: true,
    }),
  )[0]

  if (!path) return undefined

  const defaultExport = await import(path).then((m) => m.default)

  if (!defaultExport) {
    throw new Error(`Command middleware file is missing a default export`)
  }

  if (defaultExport instanceof Function) {
    return defaultExport as BotCommandExecuteFunction
  } else {
    throw new Error(`Command middleware file must export a function`)
  }
}
