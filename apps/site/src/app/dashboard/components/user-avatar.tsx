import { headers } from "next/headers"
import Link from "next/link"

import { REST } from "@discordjs/rest"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import { getUser } from "../cache/user"

import { getInitials } from "@/lib/utils"

export const UserAvatar = async (props: { fallback?: boolean }) => {
  if (props.fallback) return <Skeleton className="h-8 w-8 rounded-full" />

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!
  const user = await getUser(userId, userToken)

  if (!user) return <Skeleton className="h-8 w-8 rounded-full" />

  return (
    <Link href={"/dashboard/settings"}>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={
            user.avatar
              ? new REST().cdn.avatar(user.id, user.avatar)
              : undefined
          }
          alt={user.username}
        />
        <AvatarFallback>
          {getInitials(user.global_name ?? user.username)}
        </AvatarFallback>
      </Avatar>
    </Link>
  )
}
