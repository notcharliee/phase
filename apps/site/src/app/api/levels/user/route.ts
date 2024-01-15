import { NextResponse, NextRequest } from "next/server"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { LevelSchema } from "@repo/schemas"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export const GET = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!userId || !guildId) return NextResponse.json({
    error: "Bad Request",
    documentation: `${env.NEXT_PUBLIC_BASE_URL}/docs/api/levels`,
  }, { status: 400 })

  try {
    await dbConnect()

    const user = await discordAPI.users.get(userId)
    const data = await LevelSchema.findOne({ user: userId, guild: guildId })
    
    if (!data) return NextResponse.json({
      error: "Not Found",
      message: "Level data not found.",
    }, { status: 404 })

    const rank = await LevelSchema.countDocuments({ $or: [
      { guild: guildId, level: { $gt: data.level } },
      { guild: guildId, level: data.level, xp: { $gt: data.xp } }
    ] }) + 1

    return NextResponse.json({
      id: user.id,
      username: user.username,
      global_name: user.global_name,
      avatar: user.avatar ? discordREST.cdn.avatar(user.id, user.avatar, { size: 128, forceStatic: true, extension: "png" }) : `${env.NEXT_PUBLIC_BASE_URL}/discord.png`,
      level: data.level,
      xp: data.xp,
      rank: rank,
      target: 500 * (data.level + 1),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }
}
