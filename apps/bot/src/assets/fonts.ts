import geistBold from "~/assets/fonts/geist-bold.otf" with { type: "file" }
import geistMedium from "~/assets/fonts/geist-medium.otf" with { type: "file" }
import geistRegular from "~/assets/fonts/geist-regular.otf" with { type: "file" }
import geistSemibold from "~/assets/fonts/geist-semibold.otf" with { type: "file" }

export const geistBoldFile = Bun.file(geistBold)
export const geistSemiboldFile = Bun.file(geistSemibold)
export const geistMediumFile = Bun.file(geistMedium)
export const geistRegularFile = Bun.file(geistRegular)
