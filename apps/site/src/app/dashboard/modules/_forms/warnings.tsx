"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectRole } from "~/components/dashboard/select-role"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { warningsSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof warningsSchema>

export const Warnings = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(warningsSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.Warnings]
      ? {
          ...dashboard.guild.modules[ModuleId.Warnings],
          warnings: dashboard.guild.modules[ModuleId.Warnings].warnings.map(
            (role) => ({
              role,
            }),
          ),
        }
      : {
          enabled: false,
          warnings: [],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldArray = useFieldArray({
    control: form.control,
    name: "warnings",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(
      updateModule(ModuleId.Warnings, {
        enabled: data.enabled,
        warnings: data.warnings.map((role) => role.role),
      }),
      {
        loading: "Saving changes...",
        error: "An error occured.",
        success: (updatedModuleData) => {
          form.reset(data)
          dashboard.setData((dashboardData) => {
            if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
            dashboardData.guild.modules[ModuleId.Warnings] = updatedModuleData
            return dashboardData
          })
          return "Changes saved!"
        },
        finally() {
          setIsSubmitting(false)
        },
      },
    )
  }

  const { roles } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormDescription>
          To use the /warn commands, you need to tell the bot which roles it
          should look for. The number and order of the roles will decide how
          many warnings a member can get.
        </FormDescription>
        <FormItem className="space-y-4">
          {fieldArray.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`warnings.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warning {index + 1}</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      <SelectRole roles={roles} {...field} />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fieldArray.remove(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {fieldArray.fields.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fieldArray.append({ role: "" })}
            >
              Add Warning
            </Button>
          )}
        </FormItem>
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
