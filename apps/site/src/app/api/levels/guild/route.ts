import { NextResponse, NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { LevelSchema } from "@repo/schemas"
import { dbConnect } from "@/lib/db"

import { env } from "@/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const GET = async (request: NextRequest) => {
  const rankStart = parseInt(request.nextUrl.searchParams.get("rankStart") || "1", 10)
  const rankEnd = parseInt(request.nextUrl.searchParams.get("rankEnd") || "1", 10)
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!guildId || rankStart < 0 || rankStart > rankEnd || rankEnd > 15) {
    return NextResponse.json({
      error: "Bad Request",
      documentation: `${env.NEXT_PUBLIC_BASE_URL}/docs/api/levels`,
    }, { status: 400 })
  }

  try {
    await dbConnect()

    const usersData = await LevelSchema.find({ guild: guildId })
      .sort({ level: -1, xp: -1 })
      .skip(rankStart - 1)
      .limit(rankEnd - rankStart + 1)

    if (!usersData || !usersData.length) {
      return NextResponse.json({
        error: "Not Found",
        message: "No users found within the specified rank range.",
      }, { status: 404 })
    }

    return NextResponse.json(await Promise.all(usersData.map(async (data, index) => {
      const user = await discordAPI.users.get(data.user)

      return {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        avatar: user.avatar ? discordREST.cdn.avatar(user.id, user.avatar, { size: 128, forceStatic: true, extension: "png" }) : `${env.NEXT_PUBLIC_BASE_URL}/discord.png`,
        level: data.level,
        xp: data.xp,
        rank: rankStart + index,
        target: 500 * (data.level + 1),
      }
    })))
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }
}
