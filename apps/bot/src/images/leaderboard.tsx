import { ImageBuilder } from "@phasejs/image"

import { tw } from "~/lib/tw"
import { numberToOrdinal } from "~/lib/utils/formatting"

import { geistBoldFile, geistMediumFile } from "~/assets/fonts"

import type { ImageFont } from "@phasejs/image"

export interface LeaderboardUser {
  username: string
  displayName: string
  avatarUrl: string
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

  const cardUserHeight = 64
  const cardUserGap = 24
  const cardPadding = 32

  const width = 500
  const height =
    users.length * cardUserHeight +
    (users.length - 1) * cardUserGap +
    cardPadding * 2

  const element = <LevelLeaderboard users={users} />

  return await new ImageBuilder()
    .setFonts(fonts)
    .setWidth(width)
    .setHeight(height)
    .setElement(element)
    .build()
}

// components //

interface LevelLeaderboardProps {
  users: LeaderboardUser[]
}

function LevelLeaderboard(props: LevelLeaderboardProps) {
  return (
    <div
      style={tw`bg-background text-foreground flex w-full flex-col gap-6 rounded-lg p-8`}
    >
      {props.users.map((user, index) => (
        <div style={tw`relative flex h-16 items-center gap-6`} key={index}>
          <img src={user.avatarUrl} style={tw`h-16 w-16 shrink-0 rounded-lg`} />
          <div style={tw`flex flex-col text-xl leading-tight`}>
            <span style={tw`font-semibold`}>
              {`${numberToOrdinal(user.rank)} Place`}
            </span>
            <span style={tw`text-muted-foreground font-medium`}>
              {user.username}
            </span>
          </div>
          <div style={tw`absolute right-0 flex items-center justify-center`}>
            <LevelProgress progress={(user.xp / user.target) * 100} size={64} />
            <span style={tw`absolute text-xl font-semibold`}>
              {`${user.level}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface LevelProgressProps {
  progress: number
  size: number
}

function LevelProgress(props: LevelProgressProps) {
  const size = props.size
  const strokeWidth = size / 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (props.progress / 100) * circumference

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style={tw`stroke-accent fill-none`}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        style={tw`stroke-foreground fill-none`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}
