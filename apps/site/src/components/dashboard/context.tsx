"use client"

import { DashboardContext } from "~/hooks/use-dashboard-context"

import type { DashboardData } from "~/types/dashboard"

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardData
  children: React.ReactNode
}) {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
