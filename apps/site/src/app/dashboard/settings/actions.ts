"use server"

import { cookies, headers } from "next/headers"
import { StatusCodes } from "http-status-codes"

import { GuildSchema } from "@repo/schemas"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { env } from "@/lib/env"
import { dbConnect } from "@/lib/db"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const updateNewsChannel = async (channelId: string | undefined) => {
  await dbConnect()

  const guildId = cookies().get("guild")!.value
  const userId = headers().get("x-user-id")!

  const dbGuild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!dbGuild) throw StatusCodes.FORBIDDEN

  if (typeof channelId !== "string") {
    await dbGuild.updateOne({
      news_channel: null,
    })

    return StatusCodes.OK
  }

  if (
    channelId.length < 17 ||
    channelId.length > 19 ||
    ![...channelId].every((char) => Number.isInteger(parseInt(char)))
  ) {
    throw StatusCodes.BAD_REQUEST
  }

  await dbGuild.updateOne({
    news_channel: channelId,
  })

  return StatusCodes.OK
}

export const updateBotNickname = async (nickname: string | undefined) => {
  await dbConnect()

  const guildId = cookies().get("guild")!.value
  const userId = headers().get("x-user-id")!

  const dbGuild = await GuildSchema.findOne({
    id: guildId,
    admins: { $in: userId },
  })

  if (!dbGuild) throw StatusCodes.FORBIDDEN

  if (typeof nickname !== "string") {
    await discordAPI.users.editCurrentGuildMember(guildId, {
      nick: null,
    })

    return StatusCodes.OK
  }

  if (nickname.length > 32) {
    throw StatusCodes.BAD_REQUEST
  }

  await discordAPI.users.editCurrentGuildMember(guildId, {
    nick: nickname,
  })

  return StatusCodes.OK
}
