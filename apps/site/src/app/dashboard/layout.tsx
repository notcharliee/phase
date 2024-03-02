import { cookies } from "next/headers"

import { Suspense } from "react"

import { DashHeader } from "@/components/dash-header"
import {
  SelectServerCombobox,
  SelectServerDialog,
} from "./components/select/server"
import { UserAvatar } from "./components/user-avatar"

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

  const userAvatar = (
    <Suspense fallback={<UserAvatar fallback />}>
      <UserAvatar />
    </Suspense>
  )

  return (
    <main className="flex min-h-screen w-full flex-col">
      <DashHeader
        selectServerCombobox={selectServerCombobox}
        userAvatar={userAvatar}
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
