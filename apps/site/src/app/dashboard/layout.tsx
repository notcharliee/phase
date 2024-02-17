import { cookies } from "next/headers"

import { Suspense } from "react"

import { DashHeader } from "@/components/dash-header"
import {
  SelectServerCombobox,
  SelectServerDialog,
} from "@/app/dashboard/components/select-server"
import { UserNav } from "@/app/dashboard/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const selectServerCombobox = (
    <Suspense fallback={<SelectServerCombobox fallback />}>
      <SelectServerCombobox />
    </Suspense>
  )

  const userNav = (
    <Suspense fallback={<UserNav fallback />}>
      <UserNav />
    </Suspense>
  )

  return (
    <main className="flex min-h-screen w-full flex-col">
      <DashHeader
        selectServerCombobox={selectServerCombobox}
        userNav={userNav}
      />
      <div className="flex-1">
        {cookies().has("guild") ? (
          children
        ) : (
          <SelectServerDialog>
            <Suspense fallback={<SelectServerCombobox fallback />}>
              <SelectServerCombobox />
            </Suspense>
          </SelectServerDialog>
        )}
      </div>
    </main>
  )
}
