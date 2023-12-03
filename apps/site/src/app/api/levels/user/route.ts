import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import mongoose from "mongoose"
import * as Schemas from "@repo/utils/schemas"

export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  // Check if user is authorised to use endpoint...

  const authorisationCode = request.headers.get("Authorization")
    ? request.headers.get("Authorization")?.split(" ")[1]
    : cookies().get("authorised_user")?.value

  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  if (!authorisationCode)
    return NextResponse.json(
      {
        error: "Unauthorised",
        documentation: `${process.env.NEXT_PUBLIC_BASE_URL}/docs/api/authorisation`,
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
        documentation: `${process.env.NEXT_PUBLIC_BASE_URL}/docs/api/authorisation`,
      },
      { status: 401 },
    )

  // Get data...

  if (!userId || !guildId)
    return NextResponse.json(
      {
        error: "Bad Request",
        documentation: `${process.env.NEXT_PUBLIC_BASE_URL}/docs/api/levels`,
      },
      { status: 400 },
    )

  try {
    const guildLevelData = await Schemas.Levels.findOne({
      guild: guildId,
      levels: { $elemMatch: { id: userId } },
    })

    if (!guildLevelData)
      return NextResponse.json(
        {
          error: "Not Found",
          message: `No matching data found.`,
        },
        { status: 404 },
      )

    const userLevelsArray = guildLevelData.levels
    const userLevelsArraySorted = userLevelsArray.sort((a, b) =>
      a == b ? b.xp - a.xp : b.level - a.level,
    )

    const userLevelDataIndex = userLevelsArraySorted.findIndex(
      (user) => user.id == userId,
    )

    if (userLevelDataIndex == -1)
      return NextResponse.json(
        {
          error: "Not Found",
          message: `No matching data found.`,
        },
        { status: 404 },
      )

    const userLevelData = userLevelsArraySorted[userLevelDataIndex]!

    const userData = await discordAPI.users.get(userLevelData.id)

    return NextResponse.json({
      ...userData,
      ...(({ id, ...rest }) => rest)(userLevelData),
      rank: userLevelDataIndex + 1,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(error, { status: 500 })
  } finally {
    await mongoose.connection.close()
  }
}
