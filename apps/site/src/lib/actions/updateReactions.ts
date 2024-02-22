"use server"

import { StatusCodes } from "http-status-codes"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { env } from "@/lib/env"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

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
