"use client"

import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useQueryState } from "nuqs"

import { Input } from "~/components/ui/input"

export function GuildCardSearch() {
  const [guildName, setGuildName] = useQueryState("name")

  return (
    <div className="relative h-9 w-full">
      <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        className="pl-9"
        placeholder="Search guilds..."
        value={guildName ?? ""}
        onChange={setGuildName}
      />
    </div>
  )
}
