import type { GuildData } from "."
import type { ChannelElement, MentionElement, TextElement } from "./nodes"
import type { Descendant } from "slate"

/**
 * Serialises a Slate value into a Discord message string.
 */
export function serialise(descendants: Descendant[]): string {
  const value = descendants[0]! as TextElement

  const serialisedValue = value.children
    .map((child) => {
      if ("text" in child) return child.text
      if (child.type === "channel") return `<#${child.data.id}>`
      if (child.type === "mention") {
        if (child.data.type === "everyone") return "@everyone"
        if (child.data.type === "here") return "@here"
        if (child.data.type === "role") return `<@&${child.data.id}>`
        if (child.data.type === "user") return `<@!${child.data.id}>`
      }
    })
    .join("")

  return serialisedValue
}

/**
 * Deserialises a Discord message string into a Slate value.
 */
export function deserialise(value: string, guildData: GuildData): Descendant[] {
  const children = []
  const textParts = value.split(/(<[@][!&]?\d+>|@everyone|@here|<#\d+>)/)

  const createMentionElement = ({
    id,
    name,
    type,
    colour,
  }: MentionElement["data"]): MentionElement => ({
    type: "mention",
    children: [{ text: "" }],
    data: { id, name, type, colour },
  })

  const createChannelElement = ({
    id,
    name,
    type,
  }: ChannelElement["data"]): ChannelElement => ({
    type: "channel",
    children: [{ text: "" }],
    data: { id, name, type },
  })

  for (let i = 0; i < textParts.length; i++) {
    const part = textParts[i]!
    const previousPart = i > 0 ? textParts[i - 1]! : ""

    if (previousPart.endsWith("\\")) {
      // If the previous part ends with a backslash, treat this part as plain text
      children.push({ text: previousPart.slice(0, -1) + part })
      textParts[i - 1] = "" // Clear the previous part to avoid duplication
    } else if (part.startsWith("<@&")) {
      const roleId = part.slice(3, -1)
      const role = guildData.roles.find((role) => role.id === roleId)
      children.push(
        createMentionElement({
          id: roleId,
          name: role?.name ?? "unknown",
          colour: role?.color ? `#${role.color.toString(16)}` : "#f8f8f8",
          type: "role",
        }),
      )
    } else if (part.startsWith("<@")) {
      const userId = part.slice(part.startsWith("<@!") ? 3 : 2, -1)
      children.push(
        createMentionElement({
          id: userId,
          name: "user",
          type: "user",
          colour: "#f8f8f8",
        }),
      )
    } else if (part.startsWith("<#")) {
      const channelId = part.slice(2, -1)
      const channel = guildData.channels.find((ch) => ch.id === channelId)
      children.push(
        createChannelElement({
          id: channelId,
          name: channel?.name ?? "unknown",
          type: channel?.type ?? 0,
        }),
      )
    } else if (part === "@everyone" || part === "@here") {
      const withoutPrefix = part === "@everyone" ? "everyone" : "here"
      children.push(
        createMentionElement({
          id: withoutPrefix,
          name: withoutPrefix,
          type: withoutPrefix,
          colour: "#f8f8f8",
        }),
      )
    } else {
      children.push({ text: part })
    }
  }

  return [{ type: "text", children }]
}
