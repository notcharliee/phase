import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import {
  GuildSchema,
  type GuildCommand,
  type GuildModules,
} from "@repo/schemas"

import { dbConnect } from "./db"

import { cookies, headers } from "next/headers"

/**
 * Checks if the user id and user token are valid and returns a user object.
 *
 * @param userId The user ID
 * @param userToken The user access token
 */
export const getUser = async (userId: string, userToken: string) => {
  const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)

  const user = await userAPI.users.getCurrent()

  if (user.id !== userId) return null

  return user
}

export const getAuthCredentials = () => {
  const reqCookies = cookies()
  const reqHeaders = headers()

  const guildId = reqCookies.get("guild")?.value
  const userId = reqHeaders.get("x-user-id")
  const userToken = reqHeaders.get("x-user-token")

  if (!guildId || !userId || !userToken) throw new Error("Invalid request")

  return { guildId, userId, userToken }
}

type UserData = {
  id: string
  username: string
  global_name: string
  avatar: string | null
  avatar_url: string | null
}

type GuildData = {
  id: string
  admins: string[]
  commands: Record<string, GuildCommand> | undefined
  modules: Partial<GuildModules> | undefined
  news_channel: string | null | undefined
}

type CheckUserResult<T extends string | undefined> = T extends string
  ? {
      user: UserData
      guild: GuildData
    }
  : {
      user: UserData
    }

export const checkUser = async <TGuildId extends string | undefined>({
  userId,
  userToken,
  guildId,
}: {
  userId: string
  userToken: string
  guildId?: TGuildId
}): Promise<CheckUserResult<TGuildId>> => {
  const discordREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const discordAPI = new API(discordREST)

  const user = await discordAPI.users.getCurrent().catch(() => null)

  if (!user) throw new Error("Invalid user token")
  if (user.id !== userId) throw new Error("Invalid user ID")

  const userData = {
    id: user.id,
    username: user.username,
    global_name: user.global_name ?? user.username,
    avatar: user.avatar,
    avatar_url: user.avatar && discordREST.cdn.avatar(user.id, user.avatar),
  }

  if (guildId) {
    await dbConnect()

    const guildSchema = await GuildSchema.findOne({
      id: guildId,
      admins: { $in: userId },
    }).catch(() => null)

    if (!guildSchema) throw new Error("Invalid guild ID")

    const guildData = {
      id: guildSchema.id as string,
      admins: guildSchema.admins,
      commands: guildSchema.commands,
      modules: guildSchema.modules,
      news_channel: guildSchema.news_channel,
    }

    return { user: userData, guild: guildData } as CheckUserResult<TGuildId>
  }

  return { user: userData } as CheckUserResult<TGuildId>
}
