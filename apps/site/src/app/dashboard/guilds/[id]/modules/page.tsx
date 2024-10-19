"use client"

import { useCallback, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleDefinitions } from "@repo/utils/modules"
import { useForm } from "react-hook-form"

import { ActionBar } from "~/components/dashboard/modules/action-bar"
import { AddModule } from "~/components/dashboard/modules/add-module"
import {
  ConfigCard,
  ConfigCardStatus,
} from "~/components/dashboard/modules/config-card"
import { SelectFilter } from "~/components/dashboard/modules/select-filter"
import { Form } from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { keys } from "~/lib/utils"

import {
  defaultEmptyFormValues,
  getDefaultValues,
  getDirtyFields,
} from "~/app/dashboard/guilds/[id]/modules/_utils/client"
import { updateModules } from "~/app/dashboard/guilds/[id]/modules/actions"
import { moduleFormFields } from "~/app/dashboard/guilds/[id]/modules/forms"
import { modulesSchema } from "~/validators/modules"

import type { ModuleId, ModuleTag } from "@repo/utils/modules"
import type { ConfigCardOption } from "~/components/dashboard/modules/config-card"
import type { FilterOption } from "~/components/dashboard/modules/select-filter"
import type { ModulesFormValues } from "~/types/dashboard"

export type ModuleData<T extends ModuleId = ModuleId> = {
  -readonly [K in keyof (typeof ModuleDefinitions)[T]]: (typeof ModuleDefinitions)[T][K]
} & { config: ModulesFormValues[T] }

export default function ModulesPage() {
  const [filter, setFilter] = useState<FilterOption["value"]>("none")

  const dashboardData = useDashboardContext()

  const defaultFormValues = getDefaultValues(
    dashboardData.guild.id,
    dashboardData.guild.modules ?? {},
  )

  const form = useForm<ModulesFormValues>({
    resolver: zodResolver(modulesSchema),
    defaultValues: defaultFormValues,
  })

  const formFields = form.watch()
  const formState = form.formState

  const dirtyFields = getDirtyFields(formFields, formState.dirtyFields)
  const dirtyFieldNames = keys(dirtyFields) as ModuleId[]
  const invalidFieldNames = keys(formState.errors) as ModuleId[]

  const moduleDataArray: ModuleData[] = useMemo(() => {
    const modulesArray = Object.values(ModuleDefinitions).map((value) => ({
      config: formFields[value.id],
      ...value,
    }))

    return modulesArray.filter((module) => {
      if (filter === "none") return true
      return module.tags.some((tag) => tag.toLowerCase() === filter)
    })
  }, [formFields, filter])

  const onModuleAdd = useCallback(
    (moduleId: ModuleId) => {
      const moduleConfig = ModuleDefinitions[moduleId]
      if (!moduleConfig) return

      form.setValue(
        moduleId,
        {
          ...defaultEmptyFormValues[moduleId],
          enabled: true,
        },
        {
          shouldDirty: true,
        },
      )
    },
    [form],
  )

  const onSubmit = useCallback(
    async (data: ModulesFormValues) => {
      const id = dashboardData.guild.id

      const updatedModules = await updateModules(id, data, dirtyFieldNames)
      const updatedDefaultValues = getDefaultValues(id, updatedModules)

      form.reset(updatedDefaultValues)
    },
    [form, dirtyFieldNames, dashboardData.guild.id],
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
            <SelectFilter value={filter} onValueChange={setFilter} />
            <AddModule
              moduleDataArray={moduleDataArray}
              onSelect={onModuleAdd}
            />
          </div>
        </div>
        <ActionBar
          dirtyKeys={dirtyFieldNames}
          invalidKeys={invalidFieldNames}
        />
        <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          {moduleDataArray.map((moduleData) => {
            if (!moduleData.config) return null

            const ModuleFormFields = moduleFormFields[moduleData.id]
            if (!ModuleFormFields) return null

            const moduleStatus = formState.isSubmitting
              ? ConfigCardStatus.Disabled
              : invalidFieldNames.includes(moduleData.id)
                ? ConfigCardStatus.Invalid
                : dirtyFieldNames.includes(moduleData.id)
                  ? ConfigCardStatus.Dirty
                  : ConfigCardStatus.Clean

            const onTagSelect = (tag: ModuleTag) => {
              const value = tag.toLowerCase() as FilterOption["value"]
              if (value === filter) setFilter("none")
              else setFilter(value)
            }

            const onDropdownSelect = (option: ConfigCardOption) => {
              switch (option) {
                case "undo": {
                  return form.resetField(moduleData.id, {
                    defaultValue: defaultFormValues[moduleData.id],
                  })
                }
                case "reset": {
                  return form.setValue(
                    moduleData.id,
                    defaultEmptyFormValues[moduleData.id],
                    { shouldDirty: true },
                  )
                }
                case "remove": {
                  return form.setValue(moduleData.id, undefined, {
                    shouldDirty: true,
                  })
                }
              }
            }

            return (
              <ConfigCard
                key={moduleData.id}
                moduleData={moduleData}
                moduleStatus={moduleStatus}
                onTagSelect={onTagSelect}
                onDropdownSelect={onDropdownSelect}
              >
                <ModuleFormFields />
              </ConfigCard>
            )
          })}
        </div>
      </form>
    </Form>
  )
}
