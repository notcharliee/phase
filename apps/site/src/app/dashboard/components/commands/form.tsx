"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { type APIRole } from "discord-api-types/v10"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

import { SelectRole } from "../select/role"

import { updateCommand } from "@/lib/actions"

const formSchema = z.object({
  role: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>

type CommandFormProps<T extends boolean> = T extends true
  ? {
      fallback: T
      defaultValues?: FormValues
      data?: {
        command: string
        roles: APIRole[]
      }
    }
  : {
      fallback?: T
      defaultValues: FormValues
      data: {
        command: string
        roles: APIRole[]
      }
    }

export const CommandForm = <T extends boolean>(props: CommandFormProps<T>) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    toast.promise(
      updateCommand(props.data!.command, {
        name: props.data!.command,
        permissions: data.role ?? "",
      }),
      {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: "An error occured.",
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem onChange={() => form.handleSubmit(onSubmit)}>
              <FormLabel className="sr-only">Required Role</FormLabel>
              <FormControl>
                {props.fallback ? (
                  <SelectRole fallback />
                ) : (
                  <SelectRole
                    {...field}
                    roles={props.data.roles}
                    value={field.value}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
