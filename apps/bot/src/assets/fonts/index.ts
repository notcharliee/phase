import { join } from "node:path"

export const geistBoldFile = Bun.file(join(__dirname, "./geist-bold.otf"))
export const geistSemiboldFile = Bun.file(
  join(__dirname, "./geist-semibold.otf"),
)
export const geistMediumFile = Bun.file(join(__dirname, "./geist-medium.otf"))
export const geistRegularFile = Bun.file(join(__dirname, "./geist-regular.otf"))
