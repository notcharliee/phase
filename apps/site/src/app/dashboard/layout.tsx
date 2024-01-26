import { cookies } from "next/headers"

import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { SearchDashboard } from "./components/search-dashboard"
import { SelectGuild } from "./components/select-guild"


const mainNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Modules",
    href: "/dashboard/modules",
  },
  {
    title: "Commands",
    href: "/dashboard/commands",
  },
]


export default ({ children }: { children: React.ReactNode }) => {
  const guildId = cookies().get("guild")

  return (
    <main className="w-full min-h-screen flex flex-col">
      <header className="border-b z-50 sticky top-0 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4">
          <SelectGuild />
          <MainNav items={mainNavItems} className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <SearchDashboard />
            <UserNav />
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