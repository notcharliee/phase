import { cookies, headers } from "next/headers"

import { ChatBubbleIcon } from "@radix-ui/react-icons"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getGuilds } from "../../cache/guilds"


export const OnlineNow = async (props: { fallback?: boolean }) => {
  const fallback = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Online Now</CardTitle>
        <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">Loading...</span>
        <p className="text-xs text-muted-foreground">
          Loading
        </p>
      </CardContent>
    </Card>
  )

  if (props.fallback) return fallback

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const cachedGuilds = await getGuilds(userId, userToken)

  const guildId = cookies().get("guild")!.value
  const guild = cachedGuilds.discord.find(guild => guild.id === guildId)

  if (!guild) return fallback

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Online Now</CardTitle>
        <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">{guild.approximate_presence_count?.toString() ?? "Unknown"}</span>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </CardContent>
    </Card>
  )
}