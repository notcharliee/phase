import type { ChannelElement, MentionElement, TextElement } from "~/types/slate"

import type {} from "slate"

declare module "slate" {
  interface CustomTypes {
    Text: TextLeaf
    Element: TextElement | ChannelElement | MentionElement
  }
}
