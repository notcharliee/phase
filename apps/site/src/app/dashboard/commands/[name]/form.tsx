"use client"

import { type APIRole } from "discord-api-types/v10"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  RoleSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"

import { toast } from "sonner"

import { type Command } from "@/types/commands"
import { updateCommand } from "@/lib/actions"


const formSchema = z.object({
  role: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>


export const CommandForm = (props: {
  defaultValues: FormValues,
  data: {
    command: Command,
    roles: APIRole[],
  },
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    toast.promise(updateCommand(props.data.command.name, { name: props.data.command.name, permissions: data.role ?? "" }), {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "An error occured.",
    })
  }

  const roles = props.data.roles

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Role</FormLabel>
              <FormControl>
                <RoleSelect roles={roles} field={field} />
              </FormControl>
              <FormDescription>Users will require this role to run this command.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update command</Button>
      </form>
    </Form>
  )
}


export const CommandFormFallback = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <Label>Required Role</Label>
      <SelectFallback />
    </div>
    <Button>Update command</Button>
  </div>
)