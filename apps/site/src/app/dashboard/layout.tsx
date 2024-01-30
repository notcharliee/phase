import { cookies } from "next/headers"

import { Suspense } from "react"

import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"
import { SearchDashboard } from "./components/search-dashboard"

import {
  SelectServerCombobox,
  SelectServerDialog,
} from "./components/select-server"

import { dashboardConfig } from "@/config/dashboard"


export default ({ children }: { children: React.ReactNode }) => (
  <main className="w-full min-h-screen flex flex-col">
    <header className="border-b z-50 sticky top-0 backdrop-blur-sm">
      <div className="flex h-16 items-center px-8">
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
    <div className="flex-1">
      {cookies().has("guild")
        ? children
        : (
          <SelectServerDialog>
            <Suspense fallback={<SelectServerCombobox fallback />}>
              <SelectServerCombobox />
            </Suspense>
          </SelectServerDialog>
        )
      }
    </div>
  </main>
)
