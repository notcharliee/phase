"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { type APIRole } from "discord-api-types/v10"

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
import { toast } from "sonner"
import {
  RoleSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"

import { type Command } from "@/types/commands"
import { updateCommand } from "@/lib/actions"


const formSchema = z.object({
  role: z.string().optional().nullable(),
})

type FormValues = z.infer<typeof formSchema>


type CommandFormProps<T extends boolean> = T extends true
  ? {
    fallback: T,
    defaultValues?: FormValues,
    data?: {
      command: Command,
      roles: APIRole[],
    }
  } : {
    fallback?: T,
    defaultValues: FormValues,
    data: {
      command: Command,
      roles: APIRole[],
    }
  }

export const CommandForm = <T extends boolean> (props: CommandFormProps<T>) => {
  if (props.fallback) return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label>Required Role</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">
          Users will require this role to run this command.
        </p>
      </div>
      <Button>Update command</Button>
    </div>
  )


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })


  const onSubmit = (data: FormValues) => {
    toast.promise(
      updateCommand(props.data.command.name, {
        name: props.data.command.name,
        permissions: data.role ?? "",
      }), {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: "An error occured.",
      }
    )
  }


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
                <RoleSelect roles={props.data.roles} field={field} />
              </FormControl>
              <FormDescription>
                Users will require this role to run this command.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update command</Button>
      </form>
    </Form>
  )
}
