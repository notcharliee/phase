import { headers } from "next/headers"
import { cache } from "react"

import {
  API,
  type APIGuild,
  type APIGuildChannel,
  type GuildChannelType,
} from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import {
  GuildSchema,
  type GuildCommand,
  type GuildModules,
} from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

export type UserData = {
  id: string
  username: string
  global_name: string
  avatar: string | null
  avatar_url: string | null
}

export type GuildData = APIGuild & {
  channels: APIGuildChannel<GuildChannelType>[]
  document_id: string
  admins: string[]
  commands: Record<string, GuildCommand> | undefined
  modules: Partial<GuildModules> | undefined
  news_channel: string | null | undefined
}

const getUserFn: (
  userId: string,
  guildId: string,
) => Promise<{ user: UserData; guild: GuildData }> = async (
  userId,
  guildId,
) => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const user = await discordAPI.users.get(userId).catch(() => null)
  if (!user) throw new Error("Invalid user")

  const userData: UserData = {
    id: user.id,
    username: user.username,
    global_name: user.global_name ?? user.username,
    avatar: user.avatar,
    avatar_url: user.avatar && discordREST.cdn.avatar(user.id, user.avatar),
  }

  await dbConnect()

  const guildSchema = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  }).catch(() => null)

  const guild = await (
    discordREST.get(`/guilds/${guildId}?with_counts=true`) as Promise<APIGuild>
  ).catch(() => null)

  const channels = await (
    discordAPI.guilds.getChannels(guildId) as Promise<
      APIGuildChannel<GuildChannelType>[]
    >
  ).catch(() => [])

  if (!guildSchema || !guild) throw new Error("Invalid guild ID")

  const guildData: GuildData = {
    ...guild,
    document_id: guildSchema._id.toString(),
    channels,
    admins: guildSchema.admins,
    commands: guildSchema.commands,
    modules: guildSchema.modules,
    news_channel: guildSchema.news_channel,
  }

  return { user: userData, guild: guildData }
}

export const getUser = cache(getUserFn)

export const getAuthCredentials = (): [string, string] => {
  const reqHeaders = headers()

  const guildId = reqHeaders.get("x-guild-id")
  const userId = reqHeaders.get("x-user-id")

  if (!guildId || !userId) throw new Error("Invalid credentials")

  return [userId, guildId]
}
