import { AttachmentBuilder } from "discord.js"

import { ImageResponse } from "@vercel/og"

type ImageResponseElement = ConstructorParameters<typeof ImageResponse>[0]

type ImageResponseFonts = {
  data: ArrayBuffer
  name: string
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style?: "normal" | "italic"
}[]

/**
 * A builder that creates images from JSX using the `@vercel/og` library.\
 * Please see the documentation for more information about supported elements and CSS styles.
 *
 * @see https://github.com/vercel/satori#documentation
 */
export class ImageBuilder {
  /**
   * The width of the image.
   */
  private element: ImageResponseElement

  /**
   * The width of the image.
   */
  public readonly width: number = 512

  /**
   * The height of the image.
   */
  public readonly height: number = 512

  /**
   * A list of fonts to use.
   */
  public readonly fonts?: ImageResponseFonts

  constructor(element: ImageResponseElement) {
    this.element = element
    return this
  }

  /**
   * Set the width of the image.
   */
  setWidth(width: number) {
    Reflect.set(this, "width", width)
    return this
  }

  /**
   * Set the height of the image.
   */
  setHeight(height: number) {
    Reflect.set(this, "height", height)
    return this
  }

  /**
   * Set the fonts to use in the image.
   */
  setFonts(fonts: ImageResponseFonts) {
    Reflect.set(this, "fonts", fonts)
    return this
  }

  /**
   * Converts the builder to a response object.
   */
  toResponse() {
    return new ImageResponse(this.element, {
      width: this.width,
      height: this.height,
      fonts: this.fonts,
    })
  }

  /**
   * Converts the builder to a blob.
   */
  toBlob() {
    return this.toResponse().blob()
  }

  /**
   * Converts the builder to an array buffer.
   */
  toArrayBuffer() {
    return this.toResponse().arrayBuffer()
  }

  /**
   * Converts the builder to a buffer.
   */
  async toBuffer() {
    return await this.toArrayBuffer().then((ab) => Buffer.from(ab))
  }

  /**
   * Converts the builder to a discord.js AttachmentBuilder.
   */
  async toAttachment() {
    return await this.toBuffer().then((buffer) => new AttachmentBuilder(buffer))
  }
}
