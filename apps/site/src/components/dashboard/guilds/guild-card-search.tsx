"use client"

import { useQueryState } from "nuqs"
import { LucideIcon } from "~/components/icons/lucide"

import { Input } from "~/components/ui/input"

export function GuildCardSearch() {
  const [guildName, setGuildName] = useQueryState("name")

  return (
    <div className="relative h-9 w-full">
      <LucideIcon name="search" className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
      <Input
        className="pl-9"
        placeholder="Search guilds..."
        value={guildName ?? ""}
        onChange={setGuildName}
      />
    </div>
  )
}
