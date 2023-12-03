import { NextResponse, NextRequest } from "next/server"
import { Levels } from "@repo/utils/schemas"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'


export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  // Get data...

  if (!userId || !guildId)
    return NextResponse.json(
      {
        error: "Bad Request",
        documentation: `${env.NEXT_PUBLIC_BASE_URL}/docs/api/levels`,
      },
      { status: 400 },
    )

  try {
    const guildLevelData = await Levels.findOne({
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
  }
}
