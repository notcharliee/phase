import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/dashboard/context"

import { getGuildData } from "~/app/dashboard/cache"
import { auth } from "~/auth"

import type { LayoutProps } from "~/types/props"

export default async function Template({ children }: LayoutProps) {
  const session = (await auth())!

  const userId = session.user.id
  const guildId = session.guild.id

  const guildData = (await getGuildData({ guildId, userId }))!

  return (
    <ClientOnly>
      <DashboardProvider value={{ guild: guildData }}>
        {children}
      </DashboardProvider>
    </ClientOnly>
  )
}
