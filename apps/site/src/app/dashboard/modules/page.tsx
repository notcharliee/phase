"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { modules, moduleTags } from "@repo/config/phase/modules.ts"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useForm } from "react-hook-form"

import { ActionBar } from "~/components/dashboard/modules/action-bar"
import { ModuleCard } from "~/components/dashboard/modules/card"
import { SelectFilter } from "~/components/dashboard/modules/filter"
import { Form } from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModules } from "~/app/dashboard/modules/actions"
import { moduleFormItems } from "~/app/dashboard/modules/forms"
import { modulesSchema } from "~/validators/modules"
import { getDefaultValues, getDirtyFields } from "./_utils/client"

import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { DashboardData } from "~/types/dashboard"
import type { z } from "zod"

type FilterOption = {
  label: (typeof moduleTags)[number] | "None"
  value: Lowercase<(typeof moduleTags)[number]> | "none"
}

const filterOptions: FilterOption[] = [
  {
    label: "None",
    value: "none",
  },
  ...moduleTags.map((tag) => ({
    label: tag,
    value: tag.toLowerCase() as Lowercase<typeof tag>,
  })),
]

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
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [dashboardData, filter])
}

export default function Page() {
  const [filter, setFilter] = useLocalStorage<FilterOption["value"]>(
    "modulesFilter",
    "none",
  )

  const dashboardData = useDashboardContext()
  const guildModulesData = useGuildModules(dashboardData, filter)

  const defaultValues = getDefaultValues(
    dashboardData.guild.id,
    dashboardData.guild.modules ?? {},
  )

  const form = useForm<z.infer<typeof modulesSchema>>({
    resolver: zodResolver(modulesSchema),
    defaultValues,
    mode: "all",
  })

  const formFields = form.watch()

  const { dirtyFields, errors, isSubmitting } = form.formState

  const dirtyFieldKeys = Object.keys(
    getDirtyFields(formFields as Required<typeof formFields>, dirtyFields),
  )

  const invalidFieldKeys = Object.keys(errors)

  const onSubmit = async (data: z.infer<typeof modulesSchema>) => {
    const dirtyFieldKeys = Object.keys(
      getDirtyFields(data as Required<typeof data>, dirtyFields),
    ) as ModuleId[]

    const updatedModules = await updateModules(data, dirtyFieldKeys)

    const updatedDefaultValues = getDefaultValues(
      dashboardData.guild.id,
      updatedModules,
    )

    form.reset(updatedDefaultValues)
  }

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
          <div>
            <SelectFilter
              options={filterOptions}
              value={filter}
              onChange={setFilter}
            />
          </div>
        </div>
        <ActionBar
          form={form}
          dirtyFieldKeys={dirtyFieldKeys}
          invalidFieldKeys={invalidFieldKeys}
        />
        <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          {guildModulesData.map((moduleData) => {
            const ModuleFormItem = moduleFormItems[moduleData.id]
            if (!ModuleFormItem) return null

            const isDirty = dirtyFieldKeys.includes(moduleData.id)
            const isInvalid = invalidFieldKeys.includes(moduleData.id)

            return (
              <ModuleCard
                key={moduleData.name}
                id={moduleData.id}
                name={moduleData.name}
                description={moduleData.description}
                tags={moduleData.tags}
                enabled={moduleData.enabled}
                control={form.control}
                isDirty={isDirty}
                isInvalid={isInvalid}
                isSubmitting={isSubmitting}
              >
                <ModuleFormItem />
              </ModuleCard>
            )
          })}
        </div>
      </form>
    </Form>
  )
}
