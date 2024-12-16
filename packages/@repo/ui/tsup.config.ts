import fs from "node:fs/promises"
import path from "node:path"

import { defineConfig } from "tsup"

type ExportsField = Record<
  string,
  { types: string; import: string; require: string } | string
>

export default defineConfig({
  entry: ["./src/index.ts", "./src/components/**/index.tsx"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
  treeshake: true,
  async onSuccess() {
    const componentsDirPath = path.resolve("./dist/components")
    const packageJsonPath = path.resolve("./package.json")
    const subdirs = await fs.readdir(componentsDirPath, { withFileTypes: true })

    const exportsField: ExportsField = {
      ".": {
        types: `./dist/index.d.ts`,
        import: `./dist/index.js`,
        require: `./dist/index.js`,
      },
    }

    for (const subdir of subdirs) {
      if (!subdir.isDirectory()) continue
      const subdirName = subdir.name
      exportsField[`./${subdirName}`] = {
        types: `./dist/components/${subdirName}/index.d.ts`,
        import: `./dist/components/${subdirName}/index.js`,
        require: `./dist/components/${subdirName}/index.js`,
      }
    }

    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, "utf8"),
    ) as Record<"exports", ExportsField>

    packageJson.exports = exportsField

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  },
})
