import * as React from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { connectDB } from "~/lib/db"
import { env } from "~/lib/env"

import { SelectGuild } from "~/app/auth/guilds/components"
import { auth } from "~/auth"

import type { Guild } from "~/app/auth/guilds/components"

export default async function GuildsPage() {
  const session = (await auth())!

  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const db = await connectDB()
  const dbGuilds = await db.guilds.find({ admins: session.user.id })

  const guilds: Guild[] = []

  for (const dbGuild of dbGuilds) {
    const guildId = dbGuild.id as string

    const guild = await discordAPI.guilds
      .get(guildId, { with_counts: false })
      .catch(() => null)

    if (guild) {
      guilds.push({
        id: guild.id,
        name: guild.name,
        icon_url: guild.icon
          ? discordREST.cdn.icon(guild.id, guild.icon)
          : null,
      })
    }
  }

  const defaultValue = guilds.find(({ id }) => id === session.guild?.id)

  return (
    <>
      <div className="text-balance text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          Select the server you want to manage, then click the button below to
          enter the dashboard.
        </p>
      </div>
      <SelectGuild guilds={guilds} defaultValue={defaultValue} />
    </>
  )
}
