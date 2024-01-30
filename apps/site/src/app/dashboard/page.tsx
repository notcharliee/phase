import { cookies } from "next/headers"

import { Suspense } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { TotalMembers } from "./components/analytics/total-members"
import { OnlineNow } from "./components/analytics/online-now"
import { EnabledModules } from "./components/analytics/enabled-modules"
import { BotStatus } from "./components/analytics/bot-status"
import { Commands } from "./components/commands"
import { LevelsLeaderboard } from "./components/levels-leaderboard"


export default () => {
  const guildId = cookies().get("guild")!.value

  return (
    <div className="flex flex-col overflow-auto md:h-[calc(100vh-65px)] md:overflow-hidden space-y-4 p-8 py-6 sticky top-[5.5rem]">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TotalMembers />
        <OnlineNow />
        <EnabledModules />
        <BotStatus />
      </div>
      <div className="h-full flex flex-col md:flex-row gap-4 overflow-hidden">
        <div className="h-full md:min-w-[50%] lg:min-w-[35%] rounded-xl overflow-hidden">
          <Card className="h-full overflow-y-scroll">
            <CardHeader>
              <CardTitle>Top Members</CardTitle>
              <CardDescription>These are the most active members in your server.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full flex flex-col gap-3">
                <LevelsLeaderboard guild={guildId} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="h-full md:w-full rounded-xl overflow-hidden">
          <Card className="h-full overflow-auto">
            <CardHeader>
              <CardTitle>Command Config</CardTitle>
              <CardDescription>Set required roles for each slash command.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <Commands />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
