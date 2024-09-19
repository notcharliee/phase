import { headers as getHeaders } from "next/headers"

import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/dashboard/context"

import { getGuildData } from "~/app/dashboard/_cache/guild"

import type { DashboardData } from "~/types/dashboard"

export default async function Template({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headers = getHeaders()

  const guildId = headers.get("x-guild-id")
  const userId = headers.get("x-user-id")

  if (!guildId || !userId) throw new Error("Invalid credentials")

  const guildData = await getGuildData({
    guildId,
    userId,
  })

  const dashboardData: DashboardData = {
    guild: guildData,
  }

  return (
    <ClientOnly>
      <DashboardProvider value={dashboardData}>{children}</DashboardProvider>
    </ClientOnly>
  )
}
