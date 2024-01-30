import { cookies, headers } from "next/headers"

import { Suspense } from "react"

import { REST } from "@discordjs/rest"

import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { SearchDashboard } from "./components/search-dashboard"
import { SelectServer } from "./components/select-server"

import { getGuilds } from "./cache/guilds"
import { getUser } from "./cache/user"

import { absoluteURL } from "@/lib/utils"
import { dashboardConfig } from "@/config/dashboard"


const discordREST = new REST()


export default ({ children }: { children: React.ReactNode }) => {
  const guildId = cookies().get("guild")
  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  getGuilds(userId, userToken)
  getUser(userId, userToken)

  return (
    <main className="w-full h-screen flex flex-col">
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
      <div className="flex-1 space-y-4 p-8 pt-6">
        {guildId ? children : (
          <div>Select a server first!</div>
        )}
      </div>
    </main>
  )
}


const ServerSelectCombobox = async (props: { fallback?: boolean }) => {
  if (props.fallback) return <SelectServer fallback/>

  const userId = headers().get("x-user-id")!
  const userToken = headers().get("x-user-token")!

  const cachedGuilds = await getGuilds(userId, userToken)

  const guilds = [...cachedGuilds.discord].sort((a, b) => {
    const aIsInDocuments = cachedGuilds.database.some(doc => doc.id == a.id)
    const bIsInDocuments = cachedGuilds.database.some(doc => doc.id == b.id)

    if (aIsInDocuments && !bIsInDocuments) return -1
    else if (!aIsInDocuments && bIsInDocuments) return 1
    else return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  }).map((guild, index) => ({
    id: guild.id,
    name: guild.name,
    icon: guild.icon ? discordREST.cdn.icon(guild.id, guild.icon) : absoluteURL("/discord.png"),
    disabled: !!(index >= cachedGuilds.database.length)
  }))

  const defaultValue = cachedGuilds.database.find(guild => guild.id === cookies().get("guild")?.value)

  return <SelectServer guilds={guilds} defaultValue={defaultValue?.id ?? ""} />
}
