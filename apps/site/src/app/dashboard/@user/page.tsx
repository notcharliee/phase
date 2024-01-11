import { headers } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { getInitials } from "@/lib/utils"
import { env } from "@/env"

import {
  ExitIcon,
} from "@radix-ui/react-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export default async () => {
  const userId = headers().get("x-user-id")!
  const user = await discordAPI.users.get(userId)

  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <Avatar>
          <AvatarImage src={user.avatar ? discordREST.cdn.avatar(user.id, user.avatar) : undefined} />
          <AvatarFallback>{getInitials(user.global_name ?? user.username)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col -space-y-2">
          <strong className="text-foreground">{user.global_name ?? user.username}</strong>
          <span className="text-muted-foreground">{user.username}</span>
        </div>
        <Tooltip delayDuration={150}>
          <TooltipTrigger className="ml-auto">
            <ExitIcon className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent className="m-1.5">
            <span>Sign Out</span>
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  )
}