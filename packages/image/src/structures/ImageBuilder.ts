import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

import { Image } from "~/structures/Image"

import type { Font } from "satori"

export class ImageBuilder {
  private element: React.ReactNode = null
  private fonts: Font[] = []
  private width = 0
  private height = 0
  private debug = false

  setElement(element: React.ReactNode) {
    this.element = element
    return this
  }

  setFonts(fonts: Font[]) {
    this.fonts = fonts
    return this
  }

  addFont(font: Font) {
    this.fonts.push(font)
    return this
  }

  setWidth(width: number) {
    this.width = width
    return this
  }

  setHeight(height: number) {
    this.height = height
    return this
  }

  setDebug(debug: boolean) {
    this.debug = debug
    return this
  }

  async build() {
    const svg = await satori(this.element, {
      fonts: this.fonts,
      width: this.width,
      height: this.height,
      debug: this.debug,
    })

    const resvg = new Resvg(svg, {
      font: { loadSystemFonts: false },
      fitTo: { mode: "original" },
    })

    const imageData = resvg.render()
    const imageBuffer = imageData.asPng()

    return new Image(imageBuffer, resvg.width, resvg.height)
  }
}
