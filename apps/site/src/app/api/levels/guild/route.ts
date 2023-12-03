import { NextResponse, NextRequest } from "next/server"
import { Levels } from "@repo/utils/schemas"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'


export const GET = async (request: NextRequest) => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const startIndex = Number(request.nextUrl.searchParams.get("start"))
  const endIndex = Number(request.nextUrl.searchParams.get("end"))
  const guildId = request.nextUrl.searchParams.get("guild")

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
        documentation: `${env.NEXT_PUBLIC_BASE_URL}/docs/api/levels`,
      },
      { status: 400 },
    )

  try {
    const guildLevelData = await Levels.findOne({ guild: guildId })

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
  }
}
