"use client"

// import { type Metadata } from "next"
import { notFound, usePathname } from "next/navigation"

import { modulesConfig } from "@/config/modules"

import { Separator } from "@/components/ui/separator"

// export const metadata: Metadata = {
//   title: moduleData.name,
//   description: moduleData.description,
// }

export const ModuleHeading = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const moduleData = modulesConfig.find((module) => module.path && pathname.endsWith(module.path))
  if (!moduleData) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{moduleData.name}</h3>
        <p className="text-muted-foreground text-sm">
          {moduleData.description}
        </p>
      </div>
      <Separator />
      {children}
    </div>
  )
}