"use server"

import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { kv } from "@vercel/kv"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { default as axios } from "axios"

import { StatusCodes } from "http-status-codes"

import {
  GuildSchema,
  type GuildCommand,
  type GuildModuleAuditLogs,
  type GuildModuleAutoPartners,
  type GuildModuleAutoRoles,
  type GuildModuleJoinToCreates,
  type GuildModuleLevels,
  type GuildModuleReactionRoles,
  type GuildModuleTickets,
} from "@repo/schemas"

import { dashboardConfig } from "@/config/dashboard"

import { dbConnect } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const deleteAccount = async () => {
  const userSession = headers().get("x-auth-id")
  const userToken = headers().get("x-user-token")

  if (!userSession || !userToken) return StatusCodes.BAD_REQUEST

  try {
    cookies().delete("session")
    
    await kv.del("auth:" + userSession)
    
    await axios.post("https://discord.com/api/v10/oauth2/token/revoke",
      new URLSearchParams({
        token: userToken,
        token_type_hint: "access_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: env.DISCORD_ID,
          password: env.DISCORD_SECRET,
        },
      },
    )

    redirect("/")
  } catch (error) {
    console.log(error)
    return StatusCodes.INTERNAL_SERVER_ERROR
  }
}


type ModuleNames = "AuditLogs" | "AutoPartners" | "AutoRoles" | "JoinToCreates" | "Levels" | "ReactionRoles" | "Tickets"

type ModuleType = {
  "AuditLogs": GuildModuleAuditLogs,
  "AutoPartners": GuildModuleAutoPartners,
  "AutoRoles": GuildModuleAutoRoles,
  "JoinToCreates": GuildModuleJoinToCreates,
  "Levels": GuildModuleLevels,
  "ReactionRoles": GuildModuleReactionRoles,
  "Tickets": GuildModuleTickets,
}

export const updateModule = async <TName extends ModuleNames> (module: TName, data: Partial<ModuleType[TName]>) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  if (!guildId || !userId || !userToken) return StatusCodes.BAD_REQUEST

  // Checks if user id and token are valid
  const validUser = await getUser(userId, userToken)
  if (!validUser) return StatusCodes.UNAUTHORIZED

  // Checks if user is a dashboard admin for the guild
  const guildSchema = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guildSchema) return StatusCodes.UNAUTHORIZED

  // Update module data
  for (const key of Object.keys(data)) guildSchema.modules[module][key as keyof ModuleType[TName]] = data[key as keyof ModuleType[TName]]!
  guildSchema.markModified("modules")

  try {
    await guildSchema.save()
    return StatusCodes.OK
  } catch (error) {
    console.log(error)
    return StatusCodes.INTERNAL_SERVER_ERROR
  }
}


export const updateCommand = async (command: string, data: GuildCommand) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  const commands = dashboardConfig.sidebarNav[1]!.items.map(item => item.title.replace("/",""))

  if (!guildId || !userId || !userToken || !commands.includes(command)) throw StatusCodes.BAD_REQUEST

  // Checks if user id and token are valid
  const validUser = await getUser(userId, userToken)
  if (!validUser) throw StatusCodes.UNAUTHORIZED

  // Checks if user is a dashboard admin for the guild
  const guildSchema = await GuildSchema.findOne({ id: guildId, admins: { $in: userId } })
  if (!guildSchema) throw StatusCodes.UNAUTHORIZED

  // Update command data
  if (!guildSchema.commands) guildSchema.commands = {}
  if (data.permissions == " ") data.permissions = null
  
  guildSchema.commands[command] = data
  guildSchema.markModified("commands")

  console.log(guildSchema.commands)

  try {
    await guildSchema.save()
    return StatusCodes.OK
  } catch (error) {
    console.log(error)
    throw StatusCodes.INTERNAL_SERVER_ERROR
  }
}


export const updateBotNickname = async (nickname: string) => {
  await dbConnect()

  const guildId = cookies().get("guild")?.value
  const userId = headers().get("x-user-id")
  const userToken = headers().get("x-user-token")

  if (!guildId || !userId || !userToken) return StatusCodes.BAD_REQUEST

  // Checks if user id and token are valid
  const validUser = await getUser(userId, userToken)
  if (!validUser) return StatusCodes.UNAUTHORIZED

  // Checks if user is a dashboard admin for the guild
  const userIsAdmin = !!(await GuildSchema.findOne({ id: guildId, admins: { $in: userId } }))
  if (!userIsAdmin) return StatusCodes.UNAUTHORIZED

  await discordAPI.users.editCurrentGuildMember(guildId, {
    nick: nickname
  })

  return StatusCodes.OK
}


export const setGuildCookie = async (guild: string) => {
  "use server"
  cookies().set("guild", guild)
}