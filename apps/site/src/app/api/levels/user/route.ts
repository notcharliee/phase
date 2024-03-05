import { NextResponse, type NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { LevelSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { absoluteURL } from "@/lib/utils"
import { env } from "@/lib/env"
import { type ExtractAPIType } from "@/types/api"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const GET = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!userId || !guildId)
    return NextResponse.json(
      {
        error: "Bad Request",
        documentation: absoluteURL("/docs/api/levels"),
      },
      { status: 400 },
    )

  await dbConnect()

  const user = await discordAPI.users.get(userId)
  const data = await LevelSchema.findOne({ user: userId, guild: guildId })

  if (!data)
    return NextResponse.json(
      {
        error: "Not Found",
        message: "Level data not found.",
      },
      { status: 404 },
    )

  const rank =
    (await LevelSchema.countDocuments({
      $or: [
        { guild: guildId, level: { $gt: data.level } },
        { guild: guildId, level: data.level, xp: { $gt: data.xp } },
      ],
    })) + 1

  const response = {
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    avatar: user.avatar
      ? discordREST.cdn.avatar(user.id, user.avatar, {
          size: 128,
          forceStatic: true,
          extension: "png",
        })
      : absoluteURL("/discord.png"),
    level: data.level,
    xp: data.xp,
    rank: rank,
    target: 500 * (data.level + 1),
  }

  return NextResponse.json(response)
}

export type GetLevelsUserResponse = ExtractAPIType<typeof GET>
