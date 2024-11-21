import type { AllowedChannelType } from "~/components/channel-icons"

// base interfaces //

export interface BaseLeaf {
  text: string
}

export interface BaseElement {
  type: string
  children: (BaseLeaf | BaseElement)[]
}

// leaf interfaces //

export interface TextLeaf extends BaseLeaf {
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

// element interfaces //

export interface ChannelElement extends BaseElement {
  type: "channel"
  children: BaseLeaf[]
  data: {
    id: string
    name: string
    type: AllowedChannelType
  }
}

export interface MentionElement extends BaseElement {
  type: "mention"
  children: BaseLeaf[]
  data: {
    id: string
    name: string
    colour: string
    type: "role" | "user" | "everyone" | "here"
  }
}

export interface TextElement extends BaseElement {
  type: "text"
  children: (TextLeaf | ChannelElement | MentionElement)[]
}

export interface GuildElementData {
  channels: ChannelElement["data"][]
  mentions: MentionElement["data"][]
}
