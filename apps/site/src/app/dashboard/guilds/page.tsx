import NextLink from "next/link"
import { Suspense } from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import {
  GuildCardGrid,
  GuildCardGridFallback,
} from "~/components/dashboard/guilds/guild-card-grid"
import { GuildCardSearch } from "~/components/dashboard/guilds/guild-card-search"
import { LucideIcon } from "~/components/icons/lucide"
import { Button } from "~/components/ui/button"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"

import { auth } from "~/auth"

export interface DashboardGuild {
  id: string
  name: string
  icon_url: string | null
  member_count: number
  presence_count: number
}

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export default async function GuildsPage() {
  const session = (await auth())!

  const db = await connectDB()
  const dbGuilds = await db.guilds.find({ admins: { $in: session.user.id } })

  return (
    <div className="[--column-count:1] lg:[--column-count:2] xl:[--column-count:3]">
      <div className="mb-8 grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
        <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
          Select a guild
        </h1>
        <div className="flex space-x-2">
          <GuildCardSearch />
          <Button className="gap-2" asChild>
            <NextLink href={"/redirect/invite"}>
              <span className="hidden sm:inline">Add Guild</span>
              <span className="inline sm:hidden">Add</span>
              <LucideIcon name="plus" />
            </NextLink>
          </Button>
        </div>
      </div>
      <Suspense fallback={<GuildCardGridFallback guilds={dbGuilds.length} />}>
        {(async function GuildCards() {
          const guilds: DashboardGuild[] = []

          for (const dbGuild of dbGuilds) {
            const guildId = dbGuild.id as string

            const guild = await discordAPI.guilds
              .get(guildId, { with_counts: true })
              .catch(() => null)

            if (guild) {
              const iconURL = guild.icon
                ? discordREST.cdn.icon(guild.id, guild.icon)
                : null

              guilds.push({
                id: guild.id,
                name: guild.name,
                icon_url: iconURL,
                member_count: guild.approximate_member_count ?? 0,
                presence_count: guild.approximate_presence_count ?? 0,
              })
            }
          }

          return <GuildCardGrid guilds={guilds} />
        })()}
      </Suspense>
    </div>
  )
}
