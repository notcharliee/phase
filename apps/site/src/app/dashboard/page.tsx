import { cookies, headers } from "next/headers"

import { TotalMembers } from "./components/analytics/total-members"
import { OnlineNow } from "./components/analytics/online-now"
import { EnabledModules } from "./components/analytics/enabled-modules"
import { BotStatus } from "./components/analytics/bot-status"
import { Commands } from "./components/commands"
import { LevelsLeaderboard } from "./components/levels-leaderboard"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { getGuilds } from "./cache/guilds"

export default async function DashboardPage() {
  const guildId = cookies().get("guild")!.value
  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const cachedGuilds = await getGuilds(userId, userToken)

  const discordGuild = cachedGuilds.discord.find(
    (guild) => guild.id === guildId,
  )

  const databaseGuild = cachedGuilds.database.find(
    (guild) => guild.id === guildId,
  )

  return (
    <div className="sticky top-[5.5rem] flex flex-col space-y-4 overflow-auto p-8 py-6 md:h-[calc(100vh-65px)] md:overflow-hidden">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TotalMembers guild={discordGuild} />
        <OnlineNow guild={discordGuild} />
        <EnabledModules guild={databaseGuild} />
        <BotStatus />
      </div>
      <div className="flex h-full flex-col gap-4 overflow-hidden md:flex-row">
        <div className="h-full overflow-hidden rounded-xl md:w-min md:min-w-[50%] lg:min-w-[35%]">
          <Card className="h-full overflow-y-scroll">
            <CardHeader>
              <CardTitle>Top Members</CardTitle>
              <CardDescription>
                These are the most active members in your server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-full flex-col gap-3">
                <LevelsLeaderboard guild={guildId} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="h-full overflow-hidden rounded-xl md:w-full">
          <Card className="h-full overflow-auto">
            <CardHeader>
              <CardTitle>Command Permissions</CardTitle>
              <CardDescription>
                Set required roles for each slash command.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid h-full gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <Commands />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
