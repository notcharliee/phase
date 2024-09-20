import { AttachmentBuilder, EmbedBuilder } from "discord.js"

import dedent from "dedent"

import type { APIEmbed, ColorResolvable, Colors } from "discord.js"

enum CustomColour {
  Primary = "#f8f8f8",
  Secondary = "#282828",
  Destructive = "#ab3a3a",
}

export type CustomColourResolvable =
  | keyof typeof CustomColour
  | Omit<ColorResolvable, keyof typeof Colors | "Random">

export class CustomEmbedBuilder extends EmbedBuilder {
  constructor(data?: Partial<APIEmbed>) {
    super(data)
  }

  setColor(color: CustomColourResolvable | null) {
    if (color && typeof color === "string" && color in CustomColour) {
      return super.setColor(CustomColour[color as keyof typeof CustomColour])
    }
    return super.setColor(color as ColorResolvable)
  }

  setDescription(description: string | null) {
    return super.setDescription(dedent(description ?? ""))
  }

  setImage(url: string | AttachmentBuilder | null) {
    if (url instanceof AttachmentBuilder) {
      return super.setImage(`attachment://${url.name}`)
    } else {
      return super.setImage(url)
    }
  }
}
