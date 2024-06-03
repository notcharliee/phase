import { useContext } from "react"

import { DashboardContext } from "~/components/dashboard/context"

export const useDashboardContext = () => {
  const dashboardContext = useContext(DashboardContext)

  if (!dashboardContext) {
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
