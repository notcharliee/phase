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
  FormDescription,
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
  warnings: z
    .array(
      z.object({
        role: z.string().min(1, {
          message: "Role is required",
        }),
      }),
    )
    .max(10),
})

type FormValues = z.infer<typeof formSchema>

export const Warnings = (props: ModuleFormProps<"Warnings">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues
      ? {
          ...props.defaultValues,
          warnings: props.defaultValues.warnings.map((role) => ({ role })),
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
      updateModule("Warnings", {
        enabled: data.enabled,
        warnings: data.warnings.map((role) => role.role),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem className="space-y-4">
          <div className="space-y-1">
            <FormLabel>Warning Roles</FormLabel>
            <FormDescription>
              To use the /warn commands, you need to tell the bot which roles it
              should look for. The number and order of the roles will decide how
              many warnings a member can get.
            </FormDescription>
          </div>
          <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
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
          </div>
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
