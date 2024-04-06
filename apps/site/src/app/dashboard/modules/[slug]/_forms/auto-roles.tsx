"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { TrashIcon } from "@radix-ui/react-icons"

import { SelectRole } from "@/app/dashboard/components/select/role"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

import { updateModule } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  roles: z
    .array(
      z.object({
        id: z.string().min(1, {
          message: "Role is required",
        }),
      }),
    )
    .max(10),
})

type FormValues = z.infer<typeof formSchema>

export const AutoRoles = (props: ModuleFormProps<"AutoRoles">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues
      ? {
          ...props.defaultValues,
          roles: props.defaultValues.roles.map((roleId) => ({
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
        success: () => {
          setIsSubmitting(false)
          form.reset(data)
          return "Changes saved!"
        },
        error: () => {
          setIsSubmitting(false)
          return "An error occured."
        },
      },
    )

    form.reset(data)
  }

  const roles = props.data.guild.roles

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-10 duration-1000"
      >
        <div className="space-y-4">
          <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
            {fieldArray.fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`roles.${index}.id`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role {index + 1}</FormLabel>
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
