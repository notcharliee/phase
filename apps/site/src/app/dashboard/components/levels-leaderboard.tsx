import { NextRequest } from "next/server"
import Link from "next/link"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { CircleProgressBar } from "@/components/circle-progress-bar"
import { Skeleton } from "@/components/ui/skeleton"

import {
  GET as getGuildLevels,
  type GetLevelsGuildResponse,
} from "@/app/api/levels/guild/route"

import {
  absoluteURL,
  getInitials,
  getOrdinal,
} from "@/lib/utils"


type LevelsLeaderboardProps<T extends boolean> = T extends true
  ? { fallback: T, guild?: string }
  : { fallback?: T, guild: string }

export const LevelsLeaderboard = async <T extends boolean> (props: LevelsLeaderboardProps<T>) => {
  if (props.fallback) return Array.from({ length: 10 }, (_, index) => (
    <div className="flex gap-4 h-full" key={index}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="h-12 flex flex-col justify-between">
        <Skeleton className="w-20 h-[22px]" />
        <Skeleton className="w-24 h-[22px]" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full ml-auto" />
    </div>
  ))

  const request = await getGuildLevels(new NextRequest(new URL(absoluteURL(`/api/levels/guild?guild=${props.guild}`))))
  const guildLevels = request.status === 200 ? await request.json().then(json => json as GetLevelsGuildResponse) : []

  if (!guildLevels.length) return (
    <Alert className="animate-in fade-in-0 duration-700 slide-in-from-bottom-7">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>No data found!</AlertTitle>
      <AlertDescription>
        To track member message activity, you need to enable the <Link href={"/dashboard/modules/levels"} className="underline underline-offset-2">Levels module</Link> and send a message in the server first.
      </AlertDescription>
    </Alert>
  )

  return guildLevels.map(user => (
    <div className="flex gap-4 h-full" key={user.id}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">{getOrdinal(user.rank)} Place</div>
        <div className="text-muted-background">{user.username}</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(user.xp / user.target) * 100} text={user.level.toString()} className="ml-auto mr-0" />
    </div>
  ))
}