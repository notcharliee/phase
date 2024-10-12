"use client"

import { useQueryState } from "nuqs"

import { GuildCard } from "~/components/dashboard/guilds/guild-card"

import type { Guild } from "~/app/dashboard/guilds/actions"

interface GuildCardGridProps {
  guilds: Guild[]
}

export function GuildCardGrid(props: GuildCardGridProps) {
  const [guildName] = useQueryState("name")

  const filteredGuilds = guildName?.length
    ? props.guilds.filter((g) => g.name.toLowerCase().includes(guildName))
    : props.guilds

  return (
    <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
      {filteredGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  )
}
