"use client"

import { usePathname } from "next/navigation"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { modulesConfig } from "@/config/modules"
import { cn } from "@/lib/utils"

export const ModuelHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const pathname = usePathname()

  const moduleData = modulesConfig.find(
    (module) => module.path && pathname.endsWith(module.path),
  )

  return pathname !== "/dashboard/modules" ? (
    <CardHeader className={cn(className)} {...props}>
      <CardTitle>{moduleData?.name ?? "Unknown Module"}</CardTitle>
      <CardDescription>
        {moduleData?.description ?? "Unknown Module"}
      </CardDescription>
    </CardHeader>
  ) : null
}
