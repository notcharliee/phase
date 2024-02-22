"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { type RESTGetAPIGuildRolesResult } from "discord-api-types/v10"

import { TrashIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { EmojiPicker } from "@/components/emoji-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectRole } from "@/app/dashboard/components/select/role"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"

const formSchema = z.object({
  enabled: z.boolean(),
  messageUrl: z.string().url().refine((url) => {
    const discordChannelRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/
    return discordChannelRegex.test(url)
  }, {
    message: 'URL does not match the Discord message URL pattern'
  }),
  reactions: z
    .array(
      z.object({
        emoji: z.string().emoji(),
        role: z.string(),
      }),
    )
    .max(20),
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
    name: "reactions",
  })

  const onSubmit = (data: FormValues) => {
    const url = new URL(data.messageUrl).pathname.split("/")

    toast.promise(
      updateModule("ReactionRoles", {
        ...data,
        channel: url[2],
        message: url[3],
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
          name="messageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://discord.com/channels/{guild}/{channel}/{message}"
                />
              </FormControl>
              <FormDescription>
                The URL of your reaction role message
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
            {fieldArray.fields.map((_, index) => (
              <div className="space-y-2" key={index}>
                <Label>Reaction {index + 1}</Label>
                <div className="flex gap-3">
                  <FormField
                    key={index}
                    control={form.control}
                    name={`reactions.${index}.emoji`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {props.fallback
                            ? <EmojiPicker fallback {...field} />
                            : <EmojiPicker {...field} />
                          }
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={index}
                    control={form.control}
                    name={`reactions.${index}.role`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          {props.fallback
                              ? <SelectRole fallback />
                              : <SelectRole roles={props.data.roles} {...field} />
                            }
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fieldArray.remove(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {fieldArray.fields.length < 20 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fieldArray.append({ emoji: "🌙", role: "" })}
            >
              Add Reaction
            </Button>
          )}
        </div>
        <div className="flex space-x-3">
          <Button type="submit" disabled={fieldArray.fields.length > 20}>
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
