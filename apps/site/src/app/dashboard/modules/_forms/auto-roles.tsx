"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectRole } from "~/components/dashboard/select-role"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { z } from "zod"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { autoRolesSchema } from "~/validators/modules"

type FormValues = z.infer<typeof autoRolesSchema>

export const AutoRoles = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(autoRolesSchema),
    defaultValues: dashboard.guild.modules?.AutoRoles
      ? {
          ...dashboard.guild.modules.AutoRoles,
          roles: dashboard.guild.modules.AutoRoles.roles.map((roleId) => ({
            id: roleId,
          })),
        }
      : {
          enabled: false,
          roles: [],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldArray = useFieldArray({
    control: form.control,
    name: "roles",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    toast.promise(
      updateModule("AutoRoles", {
        enabled: data.enabled,
        roles: data.roles.map((role) => role.id),
      }),
      {
        loading: "Saving changes...",
        error: "An error occured.",
        success: (updatedModuleData) => {
          form.reset(data)
          dashboard.setData((dashboardData) => {
            if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
            dashboardData.guild.modules.AutoRoles = updatedModuleData
            return dashboardData
          })
          return "Changes saved!"
        },
        finally() {
          setIsSubmitting(false)
        },
      },
    )

    form.reset(data)
  }

  const { roles } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-3">
            {fieldArray.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`roles.${index}.id`}
                render={({ field }) => (
                  <FormItem>
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
                    <FormMessage className="mb-2" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          {fieldArray.fields.length < 10 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fieldArray.append({ id: "" })}
            >
              Add Role
            </Button>
          )}
        </div>
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
