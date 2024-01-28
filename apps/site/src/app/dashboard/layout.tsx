import { cookies, headers } from "next/headers"

import { Suspense } from "react"

import { REST } from "@discordjs/rest"
import { API } from "@discordjs/core/http-only"

import { GuildSchema } from "@repo/schemas"

import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { SearchDashboard } from "./components/search-dashboard"
import { SelectServer } from "./components/select-server"

import { dbConnect } from "@/lib/db"
import { absoluteURL } from "@/lib/utils"
import { dashboardConfig } from "@/config/dashboard"


export default ({ children }: { children: React.ReactNode }) => {
  const guildId = cookies().get("guild")

  return (
    <main className="w-full min-h-screen flex flex-col">
      <header className="border-b z-50 sticky top-0 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4">
          <Suspense fallback={<ServerSelectCombobox fallback />}>
            <ServerSelectCombobox />
          </Suspense>
          <MainNav items={dashboardConfig.mainNav} className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <SearchDashboard />
            <Suspense fallback={<UserNav fallback />}>
              <UserNav />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="grid flex-1 space-y-4 p-8 pt-6">
        {guildId ? children : (
          <div>Select a server first!</div>
        )}
      </div>
    </main>
  )
}


const ServerSelectCombobox = async (props: { fallback?: boolean }) => {
  if (props.fallback) return <SelectServer fallback/>

  await dbConnect()

  const user = {
    id: headers().get("x-user-id")!,
    token: headers().get("x-user-token")!,
  }

  const userREST = new REST({ authPrefix: "Bearer" }).setToken(user.token)
  const userAPI = new API(userREST)

  const databaseGuilds = await GuildSchema.find({ admins: user.id })
  const discordGuilds = await userAPI.users.getGuilds()

  const guilds = [...discordGuilds].sort((a, b) => {
    const aIsInDocuments = databaseGuilds.some(doc => doc.id == a.id)
    const bIsInDocuments = databaseGuilds.some(doc => doc.id == b.id)

    if (aIsInDocuments && !bIsInDocuments) return -1
    else if (!aIsInDocuments && bIsInDocuments) return 1
    else return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  }).map((guild, index) => ({
    id: guild.id,
    name: guild.name,
    icon: guild.icon ? userREST.cdn.icon(guild.id, guild.icon) : absoluteURL("/discord.png"),
    disabled: !!(index >= databaseGuilds.length)
  }))

  const defaultValue = databaseGuilds.find(guild => guild.id === cookies().get("guild")?.value)

  return <SelectServer guilds={guilds} defaultValue={defaultValue?.id ?? ""} />
}
