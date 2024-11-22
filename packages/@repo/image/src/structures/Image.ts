import { AttachmentBuilder } from "discord.js"

import type { AttachmentData } from "discord.js"

export class Image {
  public readonly buffer: Buffer
  public readonly width: number
  public readonly height: number

  constructor(buffer: Buffer, width: number, height: number) {
    if (!this.isBuffer(buffer)) throw new TypeError("Buffer is not a Buffer.")
    if (width <= 0) throw new TypeError("Width must be a positive integer.")
    if (height <= 0) throw new TypeError("Height must be a positive integer.")

    this.buffer = buffer
    this.width = width
    this.height = height
  }

  public toBlob() {
    return new Blob([this.buffer], { type: "image/png" })
  }

  public toAttachment(data?: AttachmentData) {
    return new AttachmentBuilder(this.buffer, data)
  }

  private isBuffer(thing: unknown): thing is Buffer {
    return thing instanceof Buffer
  }
}
