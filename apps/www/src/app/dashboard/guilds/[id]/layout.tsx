import { redirect } from "next/navigation"

import { client } from "@repo/trpc/client"

import { ClientOnly } from "~/components/dashboard/client-only"
import { DashboardProvider } from "~/components/dashboard/context"

import { auth } from "~/auth"

import type { LayoutProps } from "~/types/props"

export default async function GuildLayout({
  params,
  children,
}: LayoutProps<"id">) {
  const session = (await auth())!

  const userId = session.user.id
  const guildId = (await params).id

  const guildData = await client.guilds.getById.query({
    guildId,
    adminId: userId,
  })

  if (!guildData) {
    redirect("/dashboard/guilds")
  }

  return (
    <ClientOnly>
      <DashboardProvider value={{ guild: guildData }}>
        {children}
      </DashboardProvider>
    </ClientOnly>
  )
}
