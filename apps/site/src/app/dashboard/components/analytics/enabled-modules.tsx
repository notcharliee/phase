import { cookies, headers } from "next/headers"
import Link from "next/link"

import {
  LightningBoltIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getGuilds } from "../../cache/guilds"


export const EnabledModules = async (props: { fallback?: boolean }) => {
  const fallback = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
        <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">Loading...</span>
        <Link className="flex items-center hover:underline underline-offset-2 hover:animate-pulse" href={"/dashboard/modules"}>
          <p className="text-xs text-muted-foreground">Module settings</p>
          <OpenInNewWindowIcon className="h-3 w-3 ml-1 text-muted-foreground" />
        </Link>
      </CardContent>
    </Card>
  )

  if (props.fallback) return fallback

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const cachedGuilds = await getGuilds(userId, userToken)

  const guildId = cookies().get("guild")!.value
  const guild = cachedGuilds.database.find(guild => guild.id === guildId)

  if (!guild) return fallback

  const enabledModules = `${Object.values(guild.modules).filter((module) => module.enabled).length} / ${Object.values(guild.modules).length}`

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
        <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">{enabledModules ?? "Unknown"}</span>
        <Link className="flex items-center hover:underline underline-offset-2 hover:animate-pulse" href={"/dashboard/modules"}>
          <p className="text-xs text-muted-foreground">Module settings</p>
          <OpenInNewWindowIcon className="h-3 w-3 ml-1 text-muted-foreground" />
        </Link>
      </CardContent>
    </Card>
  )
}