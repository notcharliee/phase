"use client"

import { Next13ProgressBar } from "next13-progressbar"

export const LoadingBar = () => {
  return (
    <Next13ProgressBar
      color="#f8f8f8"
      options={{ showSpinner: false }}
      showOnShallow
    />
  )
}
