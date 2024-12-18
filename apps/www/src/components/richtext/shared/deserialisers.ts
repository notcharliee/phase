import type {
  RichTextDeserialiser,
  RichTextFlags,
} from "~/components/richtext/shared/types"
import type {
  ChannelElement,
  GuildElementData,
  MentionElement,
} from "~/types/slate"

export function createDeserialiser(
  flags: RichTextFlags,
  guildData: GuildElementData,
) {
  const createMentionElement = (
    data: MentionElement["data"],
  ): MentionElement => ({
    type: "mention",
    children: [{ text: "" }],
    data,
  })

  const createChannelElement = (
    data: ChannelElement["data"],
  ): ChannelElement => ({
    type: "channel",
    children: [{ text: "" }],
    data,
  })

  const deserialise: RichTextDeserialiser = (value) => {
    const children = []
    const textParts = value.split(/(<[@][!&]?\d+>|@everyone|@here|<#\d+>)/)

    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i]!
      const previousPart = i > 0 ? textParts[i - 1]! : ""

      if (previousPart.endsWith("\\")) {
        // if the previous part ends with a backslash, treat this part as plain text
        children.push({ text: previousPart.slice(0, -1) + part })
        textParts[i - 1] = "" // clear the previous part to avoid duplication
      } else if (part.startsWith("<@&") && flags.mentions) {
        const roleId = part.slice(3, -1)
        const role = guildData.mentions.find((role) => role.id === roleId)
        children.push(
          createMentionElement({
            id: roleId,
            name: role?.name ?? "unknown",
            colour: role?.colour ?? "#f8f8f8",
            type: "role",
          }),
        )
      } else if (part.startsWith("<@") && flags.mentions) {
        const userId = part.slice(part.startsWith("<@!") ? 3 : 2, -1)
        children.push(
          createMentionElement({
            id: userId,
            name: "user",
            type: "user",
            colour: "#f8f8f8",
          }),
        )
      } else if (part.startsWith("<#") && flags.channels) {
        const channelId = part.slice(2, -1)
        const channel = guildData.channels.find((ch) => ch.id === channelId)
        children.push(
          createChannelElement({
            id: channelId,
            name: channel?.name ?? "unknown",
            type: channel?.type ?? 0,
          }),
        )
      } else if ((part === "@everyone" || part === "@here") && flags.mentions) {
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

  return deserialise
}
