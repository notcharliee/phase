"use client"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { Switch } from "~/components/ui/switch"

import { useDashboardContext } from "~/hooks/use-dashboard-context"
import { useMediaQuery } from "~/hooks/use-media-query"

import { modulesConfig } from "~/config/modules"

import { updateModule } from "../_actions/updateModule"
import * as moduleForms from "./_forms"

import type { GuildModules } from "~/lib/db"

export default function ModulesPage() {
  const dashboard = useDashboardContext()

  const isOneColumn = useMediaQuery("(max-width: 1024px)")
  const isTwoColumn = useMediaQuery("(max-width: 1280px)")
  const columnCount = isOneColumn ? 1 : isTwoColumn ? 2 : 3

  return (
    <div className="grid gap-2 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
      {modulesConfig.map((moduleConfig, index) => {
        const guildModuleKey = moduleConfig.name
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replaceAll(" ", "") as keyof GuildModules

        const ModuleForm: () => JSX.Element = moduleForms[guildModuleKey]

        const guildModule = dashboard.guild.modules?.[guildModuleKey]
        const { name, description } = moduleConfig

        return (
          <Card
            key={name}
            className="animate-in slide-in-from-top-2 fade-in flex flex-col duration-700"
            style={{
              animationDelay: `${150 * Math.floor(index / columnCount)}ms`,
              animationFillMode: "backwards",
            }}
          >
            <CardHeader className="flex-row justify-between space-y-0">
              <CardTitle>{name}</CardTitle>
              <ModuleSwitch
                moduleKey={guildModuleKey}
                moduleData={guildModule}
              />
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
            <CardFooter className="h-full">
              {isOneColumn ? (
                // mobile drawer
                <Drawer>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{name}</DrawerTitle>
                      <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <ModuleForm />
                  </DrawerContent>
                  <DrawerTrigger asChild>
                    <Button variant="secondary" className="mt-auto w-full">
                      {guildModule ? "Edit module" : "Setup module"}
                    </Button>
                  </DrawerTrigger>
                </Drawer>
              ) : (
                // desktop dialog
                <Dialog>
                  <DialogContent className="max-h-[90%] overflow-auto lg:max-h-[70%]">
                    <DialogHeader>
                      <DialogTitle>{name}</DialogTitle>
                      <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <ModuleForm />
                  </DialogContent>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="mt-auto w-full">
                      {guildModule ? "Edit module" : "Setup module"}
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
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
