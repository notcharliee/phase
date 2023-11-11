import { NextRequest, NextResponse } from "next/server"
import { ImageResponse } from "next/og"
import { cookies } from "next/headers"

import { REST } from "@discordjs/rest"

import discord_api_types_v10 from "discord-api-types/v10"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user")
  const guildId = request.nextUrl.searchParams.get("guild")

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)

  const authorisationHeader = request.headers.get("Authorization")
  const authorisationCookie = cookies().get("authorised_user")?.value
  const authorisationCode =
    authorisationHeader ?? `Bearer ${authorisationCookie}`

  const userLevelDataRequest = await fetch(
    `${
      process.env.BASE_URL
    }/api/levels/user?user=${userId}&guild=${guildId}&time=${Date.now()}`,
    { headers: { Authorization: authorisationCode } },
  )
  if (!userLevelDataRequest.ok)
    return NextResponse.json(await userLevelDataRequest.json(), {
      status: userLevelDataRequest.status,
    })

  const userLevelData = (await userLevelDataRequest.json()) as UserLevelObject

  const imageResponseTSX = (
    <div
      tw="w-full h-full flex justify-between p-8 bg-[#101010] text-white"
      style={{ fontFamily: "Poppins" }}
    >
      <img
        src={
          userLevelData.avatar
            ? discordREST.cdn.avatar(userLevelData.id, userLevelData.avatar, {
                extension: "jpg",
                size: 256,
              })
            : "/discord.png"
        }
        alt="User Avatar"
        tw="w-[162px] h-[162px] rounded-full border-8 bg-[#282828] shadow-md"
      />
      <div tw="w-[616px] flex flex-col justify-between">
        <div tw="w-full flex justify-between">
          <div tw="flex flex-col font-bold text-3xl items-start">
            <span>
              <span tw="text-[#505050] mr-2">#</span>
              {getOrdinal(userLevelData.rank)}
            </span>
            <span>
              <span tw="text-[#505050] mr-2">@</span>
              {userLevelData.username}
            </span>
          </div>
          <div tw="flex flex-col font-bold text-3xl items-end">
            <span>
              <span tw="text-[#505050] mr-2">Level</span>
              {userLevelData.level}
            </span>
            <span>
              <span tw="text-[#505050] mr-2">XP</span>
              {userLevelData.xp}/{userLevelData.target}
            </span>
          </div>
        </div>
        <div tw="w-full flex h-16 rounded-full relative shadow-md">
          <div tw="w-full h-16 flex rounded-full border-8 border-[#282828] bg-[#000] absolute overflow-hidden">
            <div
              tw="h-16"
              style={{
                width: `${(userLevelData.xp / userLevelData.target) * 100}%`,
                backgroundImage: "linear-gradient(45deg, #7000FF, #DB00FF)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )

  const poppinsFontResponse = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf",
  )
  const poppinsFontArrayBuffer = await poppinsFontResponse.arrayBuffer()

  return new ImageResponse(imageResponseTSX, {
    width: 866,
    height: 226,
    fonts: [
      {
        name: "Poppins",
        weight: 700,
        style: "normal",
        data: poppinsFontArrayBuffer,
      },
    ],
  })
}

function getOrdinal(number: number): string {
  if (number >= 11 && number <= 13) return number + "th"
  return (
    number +
    (["th", "st", "nd", "rd"][number % 10] || ["th", "st", "nd", "rd"][0])
  )
}

type UserLevelObject = discord_api_types_v10.APIUser & {
  level: number
  xp: number
  target: number
  rank: number
}
