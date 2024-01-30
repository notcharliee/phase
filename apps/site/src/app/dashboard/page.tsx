import { cookies } from "next/headers"
import Link from "next/link"

import { Suspense } from "react"

import {
  ChatBubbleIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  OpenInNewWindowIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { CircleProgressBar } from "@/components/circle-progress-bar"

import { TotalMembers } from "./components/analytics/total-members"
import { OnlineNow } from "./components/analytics/online-now"
import { EnabledModules } from "./components/analytics/enabled-modules"
import { BotStatus } from "./components/analytics/bot-status"

import { Commands } from "./components/commands"
import { LevelsLeaderboard } from "./components/levels-leaderboard"

import { getInitials } from "@/lib/utils"


export default () => {
  const guildId = cookies().get("guild")!.value

  return (
    <div className="flex flex-col overflow-auto md:h-[calc(100vh-121px)] md:overflow-hidden space-y-4 md:sticky md:top-0">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<>
          <TotalMembers fallback />
          <OnlineNow fallback />
          <EnabledModules fallback />
          <BotStatus fallback />
        </>}>
          <TotalMembers />
          <OnlineNow />
          <EnabledModules />
          <BotStatus />
        </Suspense>
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
                <Suspense fallback={<LevelsLeaderboard fallback />}>
                  <LevelsLeaderboard guild={guildId} />
                </Suspense>
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
                <Suspense fallback={<Commands fallback />}>
                  <Commands />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const levels = (
  <>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">1st Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">2nd Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">3rd Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">4th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">5th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">6th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">7th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">8th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">9th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={""} alt={""} />
        <AvatarFallback>{getInitials("NA")}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">10th Place</div>
        <div className="text-muted-background">username</div>
      </div>
      <CircleProgressBar width={48} height={48} value={38} text="100" className="ml-auto mr-0" />
    </div>
  </>
)
