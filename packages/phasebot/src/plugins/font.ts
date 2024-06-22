import { plugin } from "bun"

import type { BunPlugin } from "bun"

const pluginOptions: BunPlugin = {
  name: "bun-plugin-font",
  async setup(build) {
    build.onLoad({ filter: /\.(otf|ttf|woff|woff2|eot)$/i }, async (args) => {
      const file = Bun.file(args.path)
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      const contents = `export default Buffer.from("${base64}", "base64").buffer;`

      return {
        contents,
        loader: "js",
      }
    })
  },
}

export const font = () => pluginOptions

plugin(pluginOptions)
