import Link from "next/link"
import { memo } from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { LevelSchema } from "@repo/schemas"

import { CircleProgressBar } from "@/components/circle-progress-bar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { dbConnect } from "@/lib/db"
import { env } from "@/lib/env"
import { getInitials, getOrdinal } from "@/lib/utils"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

const LevelsLeaderboardComponent = async ({ guildId }: { guildId: string }) => {
  await dbConnect()

  const levelData = await LevelSchema.find({ guild: guildId })
    .sort({ level: -1, xp: -1 })
    .skip(0)
    .limit(10)

  if (!levelData?.length)
    return (
      <Alert className="animate-in fade-in-0 slide-in-from-bottom-7 duration-700">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>No data found!</AlertTitle>
        <AlertDescription>
          To track member message activity, you need to enable the{" "}
          <Link
            href={"/dashboard/modules/levels"}
            className="underline underline-offset-2"
          >
            Levels module
          </Link>{" "}
          and send a message in the server first.
        </AlertDescription>
      </Alert>
    )

  const levels = []

  for (let i = 0; i < levelData.length; i++) {
    const data = levelData[i]!

    try {
      const user = await discordAPI.users.get(data.user)

      levels.push({
        id: user.id,
        username: user.username,
        global_name: user.global_name ?? user.username,
        avatar: user.avatar
          ? discordREST.cdn.avatar(user.id, user.avatar, {
              size: 128,
              forceStatic: true,
              extension: "png",
            })
          : `${env.NEXT_PUBLIC_BASE_URL}/discord.png`,
        level: data.level,
        xp: data.xp,
        rank: 1 + i,
        target: 500 * (data.level + 1),
      })
    } catch (error) {
      continue
    }
  }

  return (
    <ul className="h-full space-y-3">
      {levels.map((user, index) => (
        <li
          key={user.id}
          className="animate-in slide-in-from-top-2 fade-in flex items-center gap-4 duration-700"
          style={{
            animationDelay: `${150 * index}ms`,
            animationFillMode: "backwards",
          }}
        >
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div className="my-auto">
            <div className="text-sm font-medium">
              {getOrdinal(user.rank)} Place
            </div>
            <div className="text-muted-foreground text-sm">
              @{user.username}
            </div>
          </div>
          <div className="ml-auto mr-0 flex items-center gap-4 text-right">
            <div className="max-sm:hidden">
              <div className="text-sm font-medium">
                Level {user.level.toString()}
              </div>
              <div className="text-muted-foreground text-sm">
                {user.xp.toString()} XP
              </div>
            </div>
            <CircleProgressBar
              width={40}
              height={40}
              value={(user.xp / user.target) * 100}
              text={user.level.toString()}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export const LevelsLeaderboard = memo(LevelsLeaderboardComponent)
