import { isText } from "~/components/richtext/shared/utils"

import type {
  RichTextFlags,
  RichTextSerialiser,
} from "~/components/richtext/shared/types"

export function createSerialiser(flags: RichTextFlags) {
  const serialise: RichTextSerialiser = (value) => {
    const rootElement = value[0]

    const serialisedValue = rootElement.children
      .map((child) => {
        if (isText(child)) return child.text

        if (child.type === "channel" && flags.channels) {
          return `<#${child.data.id}>`
        }

        if (child.type === "mention" && flags.mentions) {
          if (child.data.type === "everyone") return "@everyone"
          if (child.data.type === "here") return "@here"
          if (child.data.type === "role") return `<@&${child.data.id}>`
          if (child.data.type === "user") return `<@!${child.data.id}>`
        }
      })
      .join("")

    return serialisedValue
  }

  return serialise
}
