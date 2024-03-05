import { cookies, headers } from "next/headers"

import { REST } from "@discordjs/rest"

import { SelectServer } from "./select"

import { getGuilds } from "../../../cache/guilds"

import { absoluteURL } from "@/lib/utils"

const discordREST = new REST()

export const SelectServerCombobox = async (props: { fallback?: boolean }) => {
  if (props.fallback) return <SelectServer fallback />

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const cachedGuilds = await getGuilds(userId, userToken)

  const guilds = [...cachedGuilds.discord]
    .sort((a, b) => {
      const aIsInDocuments = cachedGuilds.database.some((doc) => doc.id == a.id)
      const bIsInDocuments = cachedGuilds.database.some((doc) => doc.id == b.id)

      if (aIsInDocuments && !bIsInDocuments) return -1
      else if (!aIsInDocuments && bIsInDocuments) return 1
      else return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    })
    .map((guild, index) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon
        ? discordREST.cdn.icon(guild.id, guild.icon)
        : absoluteURL("/discord.png"),
      disabled: !!(index >= cachedGuilds.database.length),
    }))

  const defaultValue = guildId
    ? cachedGuilds.database.find((guild) => guild.id === guildId)
    : null

  return (
    <SelectServer
      guilds={guilds}
      defaultValue={defaultValue?.id ? `${defaultValue.id}` : ""}
    />
  )
}
