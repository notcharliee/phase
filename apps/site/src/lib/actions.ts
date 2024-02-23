"use server"

import { cookies, headers } from "next/headers"

import { StatusCodes } from "http-status-codes"

import {
  GuildSchema,
  type GuildModules,
  type GuildModule,
  type GuildCommand,
} from "@repo/schemas"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { dashboardNavConfig } from "@/config/nav/dashboard"

import { dbConnect } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { env } from "@/lib/env"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

/**
 * @param moduleName The name of the module.
 * @param moduleData The data to update.
 * @returns The updated module data.
 *
 * @throws 400 - If headers or cookies are missing.
 * @throws 401 - If unauthorized.
 */
export const updateModule = async <TName extends keyof GuildModules>(
  moduleName: TName,
  moduleData: Partial<GuildModule<TName>>,
) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  if (!guildId || !userId || !userToken) throw StatusCodes.BAD_REQUEST

  const validUser = await getUser(userId, userToken)
  if (!validUser) throw StatusCodes.UNAUTHORIZED

  const guildSchema = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!guildSchema) throw StatusCodes.UNAUTHORIZED

  const module: GuildModule<TName> = guildSchema.modules[moduleName]
  const moduleDataKeys = Object.keys(moduleData) as (keyof typeof module)[]

  for (const key of moduleDataKeys) {
    module[key] = (moduleData as GuildModule<TName>)[key]
  }

  guildSchema.markModified("modules")

  try {
    await guildSchema.save()
    return module
  } catch (error) {
    throw error
  }
}

export const updateReactions = async (
  channelId: string,
  messageId: string,
  emojis: string[],
) => {
  try {
    await discordAPI.channels.deleteAllMessageReactions(channelId, messageId)
    for (const emoji of emojis)
      await discordAPI.channels.addMessageReaction(channelId, messageId, emoji)
    return StatusCodes.OK
  } catch (error) {
    throw error
  }
}

export const updateCommand = async (command: string, data: GuildCommand) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  const commands = dashboardNavConfig.sidebarNav[1]!.items.map((item) =>
    item.title.replace("/", ""),
  )

  if (!guildId || !userId || !userToken || !commands.includes(command))
    throw StatusCodes.BAD_REQUEST

  const validUser = await getUser(userId, userToken)
  if (!validUser) throw StatusCodes.UNAUTHORIZED

  const guildSchema = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!guildSchema) throw StatusCodes.UNAUTHORIZED

  if (!guildSchema.commands) guildSchema.commands = {}
  if (data.permissions == " ") data.permissions = null

  guildSchema.commands[command] = data
  guildSchema.markModified("commands")

  try {
    await guildSchema.save()
    return StatusCodes.OK
  } catch (error) {
    console.log(error)
    throw StatusCodes.INTERNAL_SERVER_ERROR
  }
}

export const setGuildCookie = async (guild: string) => {
  "use server"

  if (guild === "") cookies().delete("guild")
  else cookies().set("guild", guild)
}
