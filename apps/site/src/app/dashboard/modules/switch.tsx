"use client"

import { type GuildModules } from "@repo/schemas"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"

import { updateModule } from "./[slug]/actions"

export const ModuleSwitch = <T extends keyof GuildModules>({
  moduleKey,
  moduleData,
}: {
  moduleKey: T
  moduleData: GuildModules[T] | undefined
}) => {
  const onCheckedChange = (checked: boolean) => {
    toast.promise(
      updateModule(moduleKey, { enabled: checked } as Partial<GuildModules[T]>),
      {
        error: "Failed to toggle module",
      },
    )
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
