"use server"

import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { kv } from "@vercel/kv"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { StatusCodes } from "http-status-codes"

import { GuildSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const deleteAccount = async () => {
  const sessionId = headers().get("x-user-session")
  const key = "auth:" + sessionId

  await kv.del(key)
  
  cookies().delete("session")

  redirect("/")
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