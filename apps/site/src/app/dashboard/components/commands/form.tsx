"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { type APIRole } from "discord-api-types/v10"

import { CheckIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Form,
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
    <div className="space-y-2">
      <Label className="sr-only">Required Role</Label>
      <div className="flex gap-2">
        <SelectFallback />
        <Button size={"icon"} variant={"secondary"} type="submit" className="min-w-9">
          <CheckIcon className="h-5 w-5" />
        </Button>
      </div>
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
              <FormLabel className="sr-only">Required Role</FormLabel>
              <FormControl className="flex gap-2">
                <div>
                  <RoleSelect roles={props.data.roles} field={field} />
                  <Button size={"icon"} variant={"secondary"} type="submit" className="min-w-9">
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
