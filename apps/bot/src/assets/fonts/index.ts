import geistBold from "./geist-bold.otf" with { type: "file" }
import geistSemibold from "./geist-semibold.otf" with { type: "file" }
import geistMedium from "./geist-medium.otf" with { type: "file" }
import geistRegular from "./geist-regular.otf" with { type: "file" }

export const geistBoldFile = Bun.file(geistBold)
export const geistSemiboldFile = Bun.file(geistSemibold)
export const geistMediumFile = Bun.file(geistMedium)
export const geistRegularFile = Bun.file(geistRegular)
