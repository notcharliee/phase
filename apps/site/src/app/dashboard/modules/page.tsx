"use client"

import { useCallback, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { modules } from "@repo/config/phase/modules.ts"
import { useForm } from "react-hook-form"

import { ActionBar } from "~/components/dashboard/modules/action-bar"
import {
  ModuleCard,
  ModuleCardState,
} from "~/components/dashboard/modules/card"
import { FilterSelect } from "~/components/dashboard/modules/filter"
import { Mode, ModeToggle } from "~/components/dashboard/modules/mode-toggle"
import { Form } from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModules } from "~/app/dashboard/modules/actions"
import { moduleFormItems } from "~/app/dashboard/modules/forms"
import { modulesSchema } from "~/validators/modules"
import { getDefaultValues, getDirtyFields } from "./_utils/client"

import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { FilterOption } from "~/components/dashboard/modules/filter"
import type { DashboardData, ModulesFormValues } from "~/types/dashboard"
import type { z } from "zod"

function useGuildModules(
  dashboardData: DashboardData,
  filter: FilterOption["value"],
) {
  return useMemo(() => {
    return Object.entries(modules)
      .map(([moduleId, moduleInfo]) => ({
        ...moduleInfo,
        id: moduleId as ModuleId,
        enabled:
          dashboardData.guild.modules?.[moduleId as ModuleId]?.enabled ?? false,
      }))
      .filter((moduleInfo) => {
        if (filter === "none") return true
        return moduleInfo.tags.some((tag) => tag.toLowerCase() === filter)
      })
  }, [dashboardData, filter])
}

export default function Page() {
  const [mode, setMode] = useState<Mode>(Mode.Edit)
  const [filter, setFilter] = useState<FilterOption["value"]>("none")

  const dashboardData = useDashboardContext()
  const guildModulesData = useGuildModules(dashboardData, filter)

  const defaultValues = getDefaultValues(
    dashboardData.guild.id,
    dashboardData.guild.modules ?? {},
  )

  const form = useForm<z.infer<typeof modulesSchema>>({
    resolver: zodResolver(modulesSchema),
    defaultValues,
  })

  const { dirtyFields: boolDirtyFields, errors, isSubmitting } = form.formState

  const formFields = form.watch()
  const dirtyFields = getDirtyFields(formFields, boolDirtyFields)
  const dirtyKeys = Object.keys(dirtyFields) as ModuleId[]
  const invalidKeys = Object.keys(errors) as ModuleId[]

  const cards = useMemo(() => {
    const isAllKeysUndefined = (obj: object | undefined | null) => {
      if (obj === undefined || obj === null) return true
      return Object.values(obj).every(
        (value) => value === undefined || value === null,
      )
    }

    return guildModulesData
      .sort((a, b) => {
        if (formFields[a.id] === undefined && formFields[b.id] !== undefined)
          return 1
        if (formFields[a.id] !== undefined && formFields[b.id] === undefined)
          return -1
        return a.name.localeCompare(b.name)
      })
      .map(({ id }) => {
        const ModuleFormItem = moduleFormItems[id]
        if (!ModuleFormItem) return null

        const isUndefined = isAllKeysUndefined(formFields[id])

        const isDirty = dirtyKeys.includes(id)
        const isInvalid = invalidKeys.includes(id)

        const state = isUndefined
          ? ModuleCardState.Undefined
          : isSubmitting
            ? ModuleCardState.Submitting
            : isInvalid
              ? ModuleCardState.Invalid
              : isDirty
                ? ModuleCardState.Dirty
                : ModuleCardState.Clean

        return (
          <ModuleCard key={id} id={id} mode={mode} state={state} form={form}>
            <ModuleFormItem />
          </ModuleCard>
        )
      })
  }, [
    guildModulesData,
    formFields,
    dirtyKeys,
    invalidKeys,
    isSubmitting,
    mode,
    form,
  ])

  const onSubmit = useCallback(
    async (data: ModulesFormValues) => {
      const id = dashboardData.guild.id

      const updatedModules = await updateModules(data, dirtyKeys)
      const updatedDefaultValues = getDefaultValues(id, updatedModules)

      form.reset(updatedDefaultValues)
    },
    [form, dirtyKeys, dashboardData.guild.id],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="[--column-count:1] lg:[--column-count:2] xl:[--column-count:3]"
      >
        <div className="mb-8 grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
            Modules
          </h1>
          <div className="flex space-x-2">
            <FilterSelect value={filter} onChange={setFilter} />
            <ModeToggle value={mode} onChange={setMode} />
          </div>
        </div>
        <ActionBar dirtyKeys={dirtyKeys} invalidKeys={invalidKeys} />
        <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          {cards}
        </div>
      </form>
    </Form>
  )
}
