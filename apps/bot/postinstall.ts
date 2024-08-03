// a bodge to get @discordjs/opus to work on bun

import { $ } from "bun"
import { existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const dirPath = resolve(
  process.cwd(),
  "../../node_modules/@discordjs/opus/prebuild",
)

if (existsSync(dirPath)) {
  const dirContents = readdirSync(dirPath)

  const oldPath = `${dirPath}/${dirContents[0]}`
  const newPath = `${dirPath}/${dirContents[0].replace(/(node-v)(?!115)(\d+)/, "$1115")}`

  if (existsSync(oldPath)) {
    if (existsSync(newPath)) {
      console.error("An opus prebuild already exists for node-v115")
    } else {
      await $`mv ${oldPath} ${newPath}`
      console.log("Renamed opus prebuild successfully")
    }
  } else {
    console.error(`Could not find opus prebuild at path "${oldPath}"`)
  }
} else {
  console.error("Could not find opus prebuild directory")
}
