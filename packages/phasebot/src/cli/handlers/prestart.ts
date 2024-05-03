import { PhaseClient } from "../client"

export const getPrestart = async () => {
  const prestartPaths = Array.from(
    new Bun.Glob("src/prestart.{ts,tsx,js,jsx}").scanSync({
      absolute: true,
    }),
  )

  if (!prestartPaths.length) return undefined

  if (prestartPaths.length > 1) {
    throw new Error("Multiple prestart files found")
  }

  const defaultExport = (await import(prestartPaths[0]!).then(
    (m) => m.default,
  )) as unknown

  if (!defaultExport) {
    throw new Error(`Prestart file is missing a default export`)
  }

  if (typeof defaultExport !== "function") {
    throw new Error(`Prestart file must export a function`)
  }

  return defaultExport as (client: PhaseClient) => PromiseUnion<void>
}
