import { ImageBuilder } from "@phasejs/image"

import { tw } from "~/lib/tw"
import { numberToOrdinal } from "~/lib/utils/formatting"

import { geistBoldFile, geistMediumFile } from "~/assets/fonts"

import type { ImageFont } from "@phasejs/image"

interface LeaderboardUser {
  id: string
  username: string
  global_name: string
  avatar: string
  level: number
  xp: number
  rank: number
  target: number
}

export async function generateLeaderboardCard(users: LeaderboardUser[]) {
  const geistBold = await geistBoldFile.arrayBuffer()
  const geistMedium = await geistMediumFile.arrayBuffer()

  const fonts: ImageFont[] = [
    { name: "Geist", weight: 700, data: geistBold },
    { name: "Geist", weight: 500, data: geistMedium },
  ]

  const width = 450
  const height = users.length * 64 + (users.length - 1) * 24 + 48

  const element = (
    <div
      style={tw`bg-background text-foreground flex w-full flex-col gap-6 p-6`}
    >
      {users.map((user) => (
        <div style={tw`flex h-16 items-center gap-6`} key={user.id}>
          <img src={user.avatar} style={tw`h-16 w-16 shrink-0 rounded-md`} />
          <div style={tw`flex flex-col`}>
            <span style={tw`text-xl font-semibold`}>
              {`${numberToOrdinal(user.rank)} Place`}
            </span>
            <span style={tw`text-muted-foreground text-xl font-medium`}>
              {user.username}
            </span>
          </div>
          <svg
            style={tw`ml-auto mr-0 h-16 w-16`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -1 34 34"
          >
            <g transform="rotate(-90 16 16)">
              <circle
                cx="16"
                cy="16"
                r="16"
                fill="none"
                strokeWidth="2"
                style={tw`stroke-foreground`}
              />
              <circle
                cx="16"
                cy="16"
                r="16"
                fill="none"
                strokeWidth="2.5"
                strokeDasharray="100 100"
                strokeDashoffset={-((user.xp / user.target) * 100)}
                style={tw`stroke-accent`}
              />
            </g>
            <span style={tw`m-auto text-xl font-semibold leading-none`}>
              {user.level}
            </span>
          </svg>
        </div>
      ))}
    </div>
  )

  return await new ImageBuilder()
    .setFonts(fonts)
    .setWidth(width)
    .setHeight(height)
    .setElement(element)
    .build()
}
