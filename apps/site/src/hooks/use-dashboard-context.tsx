"use client"

import { createContext, useContext } from "react"

import type { DashboardData } from "~/types/dashboard"

export const DashboardContext = createContext<DashboardData | null>(null)

type UseDashboardContextReturn<T extends boolean | undefined = undefined> =
  T extends true ? DashboardData | undefined : DashboardData

export const useDashboardContext = <T extends boolean | undefined = undefined>(
  noThrow?: T,
): UseDashboardContextReturn<T> => {
  const dashboardContext = useContext(DashboardContext)

  if (!dashboardContext) {
    if (noThrow) return undefined as UseDashboardContextReturn<T>

    throw new Error(
      "useDashboardContext has to be used within <DashboardContext.Provider>",
    )
  }

  return dashboardContext
}
