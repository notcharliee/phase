import type {
  ChannelElement,
  MentionElement,
  TextElement,
  TextLeaf,
} from "~/types/slate"

import type {} from "slate"

declare module "slate" {
  interface CustomTypes {
    Text: TextLeaf
    Element: TextElement | ChannelElement | MentionElement
  }
}
