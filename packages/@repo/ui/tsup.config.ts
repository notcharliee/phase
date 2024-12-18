import fs from "node:fs/promises"
import path from "node:path"

import prettier from "prettier"
import tsup from "tsup"

type ExportsField = Record<
  string,
  { types: string; import: string; require: string } | string
>

export default tsup.defineConfig({
  entry: ["./src/index.ts", "./src/components/**/index.tsx"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: true,
  sourcemap: true,
  treeshake: true,
  onSuccess,
})

async function onSuccess() {
  const componentsDirPath = path.resolve("./dist/components")
  const packageJsonPath = path.resolve("./package.json")

  const packageJsonExportsField: ExportsField = {
    ".": {
      types: `./dist/index.d.ts`,
      import: `./dist/index.js`,
      require: `./dist/index.js`,
    },
  }

  // read the directory contents
  const subdirs = await fs.readdir(componentsDirPath, { withFileTypes: true })

  // iterate through each subdirectory
  for (const subdir of subdirs) {
    if (!subdir.isDirectory()) continue
    const subdirName = subdir.name

    // define the exports field for the subdirectory
    packageJsonExportsField[`./${subdirName}`] = {
      types: `./dist/components/${subdirName}/index.d.ts`,
      import: `./dist/components/${subdirName}/index.js`,
      require: `./dist/components/${subdirName}/index.js`,
    }
  }

  // read and parse package.json data
  const packageJson = JSON.parse(
    await fs.readFile(packageJsonPath, "utf8"),
  ) as Record<"exports", ExportsField>

  // update the exports field
  packageJson.exports = packageJsonExportsField

  // format the data
  const packageJsonData = await prettier.format(
    JSON.stringify(packageJson, null, 2),
    { parser: "json" },
  )

  // write the data to package.json
  await fs.writeFile(packageJsonPath, packageJsonData)
}
