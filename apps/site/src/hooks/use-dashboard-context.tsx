import { useContext } from "react"

import { DashboardContext } from "~/components/dashboard/context"

import type { DashboardData } from "~/types/dashboard"

interface DashboardContextData extends DashboardData {
  setData: React.Dispatch<React.SetStateAction<DashboardData>>
}

type UseDashboardContextReturn<T extends boolean | undefined = undefined> =
  T extends true ? DashboardContextData | undefined : DashboardContextData

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

  const data = dashboardContext[0]
  const setData = dashboardContext[1]

  return {
    ...data,
    setData,
  }
}
