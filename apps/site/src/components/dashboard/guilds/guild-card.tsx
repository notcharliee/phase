"use client"

import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "~/components/ui/card"

import { getInitials } from "~/lib/utils"

import type { Guild } from "~/app/dashboard/guilds/actions"

export function GuildCard({ guild }: { guild: Guild }) {
  return (
    <Card className="hover:border-muted-foreground relative transition-colors">
      <Link
        href={`/dashboard/guilds/${guild.id}/modules`}
        className="focus-visible:ring-ring absolute left-0 top-0 h-full w-full focus-visible:outline-none focus-visible:ring-1"
      />
      <div className="flex flex-row items-center gap-4 p-6">
        <Avatar className="h-12 w-12 rounded-md border">
          <AvatarImage src={guild.icon_url ?? undefined} />
          <AvatarFallback className="rounded-none">
            {getInitials(guild.name)}
          </AvatarFallback>
        </Avatar>
        <CardHeader className="p-0">
          <CardTitle className="line-clamp-1">{guild.name}</CardTitle>
          <div className="text-muted-foreground flex gap-3 text-sm">
            <div className="inline-flex items-center space-x-1">
              <div className="bg-foreground inline-block size-3 rounded-full" />
              <span>{guild.presence_count} Online</span>
            </div>
            <div className="inline-flex items-center space-x-1">
              <div className="bg-muted-foreground my-auto inline-block size-3 rounded-full" />
              <span>{guild.member_count} Members</span>
            </div>
          </div>
        </CardHeader>
      </div>
    </Card>
  )
}
