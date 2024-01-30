import { cookies, headers } from "next/headers"

import { Suspense } from "react"

import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { SearchDashboard } from "./components/search-dashboard"

import {
  SelectServerCombobox,
  SelectServerDialog,
} from "./components/select-server"

import { getGuilds } from "./cache/guilds"
import { getUser } from "./cache/user"

import { dashboardConfig } from "@/config/dashboard"


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
          <Suspense fallback={<SelectServerCombobox fallback />}>
            <SelectServerCombobox />
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
        {guildId ? children : <SelectServerDialog combobox={
          <Suspense fallback={<SelectServerCombobox fallback />}>
            <SelectServerCombobox />
          </Suspense>
        } />}
      </div>
    </main>
  )
}
