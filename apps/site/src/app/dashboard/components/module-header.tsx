"use client"

import { usePathname } from "next/navigation"
import { modulesConfig } from "@/config/modules"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const ModuelHeader = () => {
  const pathname = usePathname()

  const moduleData = modulesConfig.find((module) => module.path && pathname.endsWith(module.path))

  return (
    <CardHeader>
      <CardTitle>{moduleData?.name ?? "Unknown Module"}</CardTitle>
      <CardDescription>{moduleData?.description ?? "Unknown Module"}</CardDescription>
    </CardHeader>
  )
}