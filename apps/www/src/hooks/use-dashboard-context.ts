"use client"

import * as React from "react"

import type { DashboardData } from "~/types/dashboard"

export const DashboardContext = React.createContext<DashboardData | null>(null)

type UseDashboardContextReturn<T extends boolean | undefined = undefined> =
  T extends true ? DashboardData | undefined : DashboardData

export const useDashboardContext = <T extends boolean | undefined = undefined>(
  noThrow?: T,
): UseDashboardContextReturn<T> => {
  const dashboardContext = React.useContext(DashboardContext)

  if (!dashboardContext) {
    if (noThrow) return undefined as UseDashboardContextReturn<T>

    throw new Error(
      "useDashboardContext has to be used within <DashboardContext.Provider>",
    )
  }

  return dashboardContext
}
