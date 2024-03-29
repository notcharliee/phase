import { join } from "node:path"
import { readdirSync, statSync } from "node:fs"

export const getAllFiles = (dirPath: string): string[] => {
  return readdirSync(dirPath).filter((f) => !f.startsWith("_"))
    .flatMap((entry) =>
      statSync(join(dirPath, entry)).isDirectory()
        ? getAllFiles(join(dirPath, entry))
        : join(dirPath, entry),
    )
    .filter((f) => !f.endsWith(".map"))
}
