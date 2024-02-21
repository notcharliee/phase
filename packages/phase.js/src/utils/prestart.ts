import { existsSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

export const getPrestart = async () => {
  const prestartURL = pathToFileURL(resolve(process.cwd(), "build/prestart.cjs"))

  if (!existsSync(prestartURL)) return () => undefined

  const prestartFunction = (await (await import(prestartURL.toString())).default).default as unknown

  if (!prestartFunction) return () => undefined
  if (typeof prestartFunction !== "function") throw new Error("Prestart must export a function.")
  
  return prestartFunction
}
