"use server"

import { cookies, headers } from "next/headers"
import { StatusCodes } from "http-status-codes"
import { GuildSchema } from "@repo/schemas"

export const updateNewsChannel = async (channelId: string | undefined) => {
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
    typeof channelId !== "string" ||
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
