import { NextResponse, NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { LevelSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"

import type { ExtractAPIType } from "@/types/api"

import { StatusCodes } from "http-status-codes"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


const badRequest = (message: string) =>
  NextResponse.json({ error: "Bad Request", message }, { status: StatusCodes.BAD_REQUEST })


export const GET = async (request: NextRequest) => {
  const rankStart = parseInt(request.nextUrl.searchParams.get("rankStart") || "1", 10)
  const rankEnd = parseInt(request.nextUrl.searchParams.get("rankEnd") || "1", 10)
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!guildId) return badRequest("Missing 'guild' search param.")
  if (rankStart <= 0) return badRequest("'rankStart' cannot be less than or equal to 0.")
  if (rankStart > rankEnd) return badRequest("'rankStart' cannot be greater than 'rankEnd'")
  if (rankEnd > 15) return badRequest("'rankEnd' cannot be greater than 15.")

  await dbConnect()

  const usersData = await LevelSchema.find({ guild: guildId })
    .sort({ level: -1, xp: -1 })
    .skip(rankStart - 1)
    .limit(rankEnd - rankStart + 1)

  if (!usersData || !usersData.length) {
    return NextResponse.json({
      error: "Not Found",
      message: "No users found within the specified rank range.",
    }, { status: StatusCodes.NOT_FOUND })
  }

  const response = []

  for (let index = 0; index < usersData.length; index++) {
    const data = usersData[index]!

    try {
      const user = await discordAPI.users.get(data.user)

      response.push({
        id: user.id,
        username: user.username,
        global_name: user.global_name ?? user.username,
        avatar: user.avatar ? discordREST.cdn.avatar(user.id, user.avatar, { size: 128, forceStatic: true, extension: "png" }) : `${env.NEXT_PUBLIC_BASE_URL}/discord.png`,
        level: data.level,
        xp: data.xp,
        rank: rankStart + index,
        target: 500 * (data.level + 1),
      })
    } catch (error) {
      continue
    }
  }

  return NextResponse.json(response)
}


export type GetLevelsGuildResponse = ExtractAPIType<typeof GET>
