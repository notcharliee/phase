"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { type RESTGetAPIGuildRolesResult } from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

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
import { SelectRole } from "@/app/dashboard/components/select/role"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"

const formSchema = z.object({
  enabled: z.boolean(),
  warnings: z
    .array(
      z.object({
        role: z.string().min(1, {
          message: "Role is required"
        }),
      }),
    )
    .max(10),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    roles: RESTGetAPIGuildRolesResult
  }
}

export const ModuleForm = <Fallback extends boolean>(
  props: Fallback extends true
    ? Partial<ModuleFormProps> & { fallback: Fallback }
    : ModuleFormProps & { fallback?: Fallback },
) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "warnings",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    toast.promise(
      updateModule("Warnings", {
        enabled: data.enabled,
        warnings: data.warnings.map((role) => role.role),
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
                        {props.fallback ? (
                          <SelectRole fallback />
                        ) : (
                          <SelectRole roles={props.data.roles} {...field} />
                        )}
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
        <div className="flex space-x-3">
          <Button type="submit" disabled={fieldArray.fields.length > 10}>
            Save changes
          </Button>
          <Button
            type="reset"
            variant={"destructive"}
            disabled={!form.formState.isDirty}
            onClick={() => form.reset(props.defaultValues)}
          >
            Undo changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
