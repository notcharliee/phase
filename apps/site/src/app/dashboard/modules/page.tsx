"use client"

import { ModuleId, modules } from "@repo/config/phase/modules.ts"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "~/components/ui/credenza"
import { Switch } from "~/components/ui/switch"

import { useDashboardContext } from "~/hooks/use-dashboard-context"
import { useMediaQuery } from "~/hooks/use-media-query"

import { updateModule } from "../_actions/updateModule"
import { moduleForms } from "./forms"

import type { GuildModules } from "~/lib/db"

export default function ModulesPage() {
  const dashboard = useDashboardContext()

  const isOneColumn = useMediaQuery("(max-width: 1024px)")
  const isTwoColumn = useMediaQuery("(max-width: 1280px)")
  const columnCount = isOneColumn ? 1 : isTwoColumn ? 2 : 3

  return (
    <div className="grid gap-2 [--column_count:1] lg:grid-cols-2 lg:gap-4 lg:[--column_count:2] xl:grid-cols-3 xl:[--column_count:3]">
      {Object.entries(modules).map(([key, { name, description }], index) => {
        const moduleKey = Object.keys(ModuleId)[
          Object.values(ModuleId).indexOf(key as ModuleId)
        ] as keyof GuildModules

        const moduleData = dashboard.guild.modules?.[moduleKey]

        const ModuleForm = moduleForms[moduleKey]
        if (!ModuleForm) return null

        return (
          <Card
            key={name}
            className="animate-in slide-in-from-top-2 fade-in fill-mode-backwards flex flex-col duration-700"
            style={{
              animationDelay: `calc(150ms * ${Math.floor(index / columnCount)})`,
            }}
          >
            <CardHeader className="flex-row justify-between space-y-0">
              <CardTitle>{name}</CardTitle>
              <ModuleSwitch moduleKey={moduleKey} moduleData={moduleData} />
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
            <CardFooter className="h-full">
              <Credenza>
                <CredenzaContent className="max-h-[90%] overflow-auto lg:max-h-[70%]">
                  <CredenzaHeader>
                    <CredenzaTitle>{name}</CredenzaTitle>
                    <CredenzaDescription>{description}</CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody>
                    <ModuleForm />
                  </CredenzaBody>
                </CredenzaContent>
                <CredenzaTrigger asChild>
                  <Button variant="secondary" className="mt-auto w-full">
                    {moduleData ? "Edit module" : "Setup module"}
                  </Button>
                </CredenzaTrigger>
              </Credenza>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

const ModuleSwitch = <T extends keyof GuildModules>({
  moduleKey,
  moduleData,
}: {
  moduleKey: T
  moduleData: GuildModules[T] | undefined
}) => {
  const dashboard = useDashboardContext()

  const onCheckedChange = async (checked: boolean) => {
    try {
      const updatedModuleData = await updateModule(moduleKey, {
        enabled: checked,
      } as GuildModules[T])

      dashboard.setData((dashboardData) => {
        if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
        dashboardData.guild.modules[moduleKey] = updatedModuleData
        return dashboardData
      })
    } catch {
      const enabledStatus = checked ? "enabled" : "disabled"
      toast.error(`Failed to ${enabledStatus} module`)
    }
  }

  return (
    <Switch
      defaultChecked={moduleData?.enabled ?? false}
      onCheckedChange={moduleData ? onCheckedChange : undefined}
      disabled={!moduleData}
      title={!moduleData ? "Module not configured" : undefined}
    />
  )
}
