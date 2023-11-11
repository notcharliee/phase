import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import mongoose from "mongoose"
import * as Schemas from "utils/schemas"

import discord_api_types_v10 from "discord-api-types/v10"

export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  // Check if user is authorised to use endpoint...

  const authorisationCode =
    request.headers.get("Authorization")?.startsWith("Bot ") ||
    request.headers.get("Authorization")?.startsWith("Bearer ")
      ? request.headers.get("Authorization")?.split(" ")[1]
      : cookies().get("authorised_user")?.value

  const startIndex = Number(request.nextUrl.searchParams.get("start"))
  const endIndex = Number(request.nextUrl.searchParams.get("end"))
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!authorisationCode)
    return NextResponse.json(
      {
        error: "Unauthorised",
        documentation: `${process.env.BASE_URL}/docs/api/authorisation`,
      },
      { status: 401 },
    )

  await mongoose.connect(process.env.MONGODB_URI!)

  const authorisedUserSchema = await Schemas.AuthorisedUsers.findOne({
    session: authorisationCode,
  })

  const isPhaseBot = authorisationCode == process.env.DISCORD_SECRET
  const isAuthorised = isPhaseBot
    ? true
    : !!authorisedUserSchema &&
      !!authorisedUserSchema.guilds.find((guild) => guild.id == guildId)

  if (!isAuthorised)
    return NextResponse.json(
      {
        error: "Unauthorised",
        documentation: `${process.env.BASE_URL}/docs/api/authorisation`,
      },
      { status: 401 },
    )

  // Get data...

  if (
    (!startIndex && startIndex != 0) ||
    !endIndex ||
    endIndex <= 0 ||
    endIndex > 15 ||
    !guildId
  )
    return NextResponse.json(
      {
        error: "Bad Request",
        documentation: `${process.env.BASE_URL}/docs/api/levels`,
      },
      { status: 400 },
    )

  try {
    const guildLevelData = await Schemas.Levels.findOne({ guild: guildId })

    if (!guildLevelData)
      return NextResponse.json(
        {
          error: "Not Found",
          message: `No matching data found.`,
        },
        { status: 404 },
      )

    const levelsArray = guildLevelData.levels
    const levelsArraySorted = levelsArray.sort((a, b) =>
      a == b ? b.xp - a.xp : b.level - a.level,
    )

    const levelsData: any[] = []

    for (const levelData of levelsArraySorted.slice(startIndex, endIndex + 1))
      levelsData.push(await discordAPI.users.get(levelData.id))

    return NextResponse.json(levelsData)
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  } finally {
    await mongoose.connection.close()
  }
}

type UserLevelObject = discord_api_types_v10.APIUser & {
  level: number
  xp: number
  target: number
  rank: number
}
