import { type Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import {
  ChatBubbleIcon,
  LightningBoltIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import { Spinner } from "@/components/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { modulesConfig } from "@/config/modules"

import { getAuthCredentials, getUser } from "../_cache/user"
import { AnalyticsCard } from "../components/analytics-card"
import { DashboardHeader } from "../components/header"
import { LevelsLeaderboard } from "../components/levels-leaderboard"

export const metadata = {
  title: "Dashboard",
} satisfies Metadata

export default async function Page() {
  const { user, guild } = await getUser(...getAuthCredentials())

  return (
    <div className="flex flex-col gap-2 px-8 py-10 sm:px-12 sm:py-8 lg:h-screen lg:gap-4">
      <DashboardHeader
        name={user.global_name}
        avatar={user.avatar_url}
        title={metadata.title}
      />
      <div className="grid gap-2 lg:grid-cols-3 lg:gap-4">
        <AnalyticsCard
          title="Total Members"
          icon={<PersonIcon />}
          primaryText={guild.approximate_member_count?.toString()}
          secondaryText={`Last updated: ${new Date().toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}`}
        />
        <AnalyticsCard
          title="Online Members"
          icon={<ChatBubbleIcon />}
          primaryText={guild.approximate_presence_count?.toString()}
          secondaryText={`Last updated: ${new Date().toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}`}
        />
        <AnalyticsCard
          title="Boosting Members"
          icon={<LightningBoltIcon />}
          primaryText={guild.premium_subscription_count?.toString()}
          secondaryText={`Last updated: ${new Date().toLocaleTimeString(
            "en-GB",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}`}
        />
      </div>
      <div className="flex h-full flex-col gap-2 overflow-hidden lg:flex-row lg:gap-4">
        <div className="h-full w-full overflow-hidden rounded-xl">
          <Card className="flex h-full flex-col overflow-y-scroll">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Member Ranks
              </CardTitle>
              <CardDescription className="text-xs">
                These are the most active members in your server.
              </CardDescription>
            </CardHeader>
            <Suspense
              fallback={
                <CardContent className="grid h-full place-items-center">
                  <Spinner className="h-12 w-12" />
                </CardContent>
              }
            >
              <CardContent>
                <LevelsLeaderboard guildId={guild.id} />
              </CardContent>
            </Suspense>
            <div className="from-card sticky bottom-0 z-10 min-h-8 w-full bg-gradient-to-t to-transparent" />
          </Card>
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-col-reverse lg:gap-4">
          <AnalyticsCard
            title="Enabled Modules"
            icon={<RocketIcon />}
            primaryText={`${Object.values(guild.modules ?? {}).filter((module) => module.enabled).length} / ${modulesConfig.length}`}
            secondaryText={
              <Link
                href="/dashboard/modules"
                className="underline-offset-4 hover:underline"
              >
                Click to view all modules
              </Link>
            }
          />
          <div className="grow overflow-hidden rounded-xl">
            <Card className="flex h-full flex-col overflow-y-scroll">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Recent Updates
                </CardTitle>
                <CardDescription className="text-xs">
                  Stay up to date with the latest changes.
                </CardDescription>
              </CardHeader>
              <CardContent>made a fancy new dashboard 😎</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
