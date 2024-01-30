import { headers } from "next/headers"
import Link from "next/link"

import { REST } from "@discordjs/rest"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

import { getUser } from "../cache/user"

import { getInitials } from "@/lib/utils"


export const UserNav = async (props: { fallback?: boolean }) => {
  if (props.fallback) return <Skeleton className="h-8 w-8 rounded-full" />

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!
  const user = await getUser(userId, userToken)

  if (!user) return <Skeleton className="h-8 w-8 rounded-full" />
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar ? new REST().cdn.avatar(user.id, user.avatar) : undefined} alt={user.username} />
            <AvatarFallback>{getInitials(user.global_name ?? user.username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.global_name ?? user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/api/auth?prompt=consent"}>
          <DropdownMenuItem>
            Switch Account
          </DropdownMenuItem>
        </Link>
        <Link href={"/dashboard/settings"}>
          <DropdownMenuItem className="text-destructive">
            Delete Account
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}