"use client"

import { createContext, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

import type { DashboardData } from "~/types/dashboard"

export const DashboardContext = createContext<
  [DashboardData, Dispatch<SetStateAction<DashboardData>>] | null
>(null)

export const DashboardProvider = (props: {
  value: DashboardData
  children: React.ReactNode
}) => {
  const [value, setValue] = useState<DashboardData>(props.value)

  return (
    <DashboardContext.Provider value={[value, setValue]}>
      {props.children}
    </DashboardContext.Provider>
  )
}
