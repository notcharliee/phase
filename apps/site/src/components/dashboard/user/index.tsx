import { headers } from "next/headers"
import Link from "next/link"

import { REST } from "@discordjs/rest"

import { getUser } from "@/lib/auth"
import { getInitials } from "@/lib/utils"

import { ExitIcon } from "@radix-ui/react-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export const User = async () => {
  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!
  const user = (await getUser(userId, userToken))!

  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <Avatar>
          <AvatarImage src={user.avatar ? new REST().cdn.avatar(user.id, user.avatar) : undefined} />
          <AvatarFallback>{getInitials(user.global_name ?? user.username)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center gap-1">
          <strong className="text-foreground leading-none">{user.global_name ?? user.username}</strong>
          <span className="text-muted-foreground leading-none">{user.username}</span>
        </div>
        <Tooltip delayDuration={150}>
          <TooltipTrigger className="ml-auto">
            <Link href={"/api/auth"}>
              <ExitIcon className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="m-1.5">
            <span>Switch Account</span>
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  )
}


export const UserFallback = () => (
  <Card>
    <CardContent className="flex items-center gap-4 pt-6">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col justify-center gap-1">
        <Skeleton className="w-24 h-4 rounded-sm" />
        <Skeleton className="w-32 h-4 rounded-sm" />
      </div>
      <Tooltip delayDuration={150}>
        <TooltipTrigger className="ml-auto">
          <Link href={"/api/auth"}>
            <ExitIcon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="m-1.5">
          <span>Switch Account</span>
        </TooltipContent>
      </Tooltip>
    </CardContent>
  </Card>
)