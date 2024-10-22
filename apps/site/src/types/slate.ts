import type { GuildChannelType } from "@discordjs/core/http-only"
import type { Text } from "slate"

export interface TextElement {
  type: "text"
  children: (Text | ChannelElement | MentionElement)[]
}

export interface ChannelElement {
  type: "channel"
  children: Pick<Text, "text">[]
  data: {
    id: string
    name: string
    type: GuildChannelType
  }
}

export interface MentionElement {
  type: "mention"
  children: Pick<Text, "text">[]
  data: {
    id: string
    name: string
    colour: string
    type: "role" | "user" | "everyone" | "here"
  }
}

export interface GuildElementData {
  channels: ChannelElement["data"][]
  mentions: MentionElement["data"][]
}

declare module "slate" {
  interface CustomTypes {
    Text: {
      text: string
      h1?: boolean
      h2?: boolean
      h3?: boolean
      subtext?: boolean
      bold?: boolean
      italic?: boolean
      strike?: boolean
      underline?: boolean
      spoiler?: boolean
      code?: boolean
      codeblock?: boolean
      punctuation?: boolean
    }
    Element: TextElement | ChannelElement | MentionElement
  }
}
