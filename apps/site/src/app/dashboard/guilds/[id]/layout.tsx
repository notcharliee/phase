import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/dashboard/context"

import { getGuildData } from "~/app/dashboard/guilds/[id]/cache"
import { auth } from "~/auth"

import type { LayoutProps } from "~/types/props"

export default async function GuildLayout({
  children,
  params,
}: LayoutProps<"id">) {
  const session = (await auth())!

  const userId = session.user.id
  const guildId = params.id

  const guildData = await getGuildData({ guildId, userId })

  return (
    <ClientOnly>
      <DashboardProvider value={{ guild: guildData }}>
        {children}
      </DashboardProvider>
    </ClientOnly>
  )
}
