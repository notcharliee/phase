"use client"

import { useMemo, useState } from "react"

import emojiData from "@emoji-mart/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectRole } from "~/components/dashboard/select-role"
import { EmojiPicker } from "~/components/emoji-picker"
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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { z } from "zod"

import { updateReactionRoles } from "~/app/dashboard/_actions/updateModule"
import { reactionRolesSchema } from "~/validators/modules"

type FormValues = z.infer<typeof reactionRolesSchema>

export const ReactionRoles = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(reactionRolesSchema),
    defaultValues: dashboard.guild.modules?.ReactionRoles
      ? {
          ...dashboard.guild.modules.ReactionRoles,
          messageUrl: `https://discord.com/channels/${dashboard.guild.id}/${dashboard.guild.modules.ReactionRoles.channel}/${dashboard.guild.modules.ReactionRoles.message}`,
        }
      : {
          enabled: false,
          messageUrl: "",
          reactions: [],
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const fieldArray = useFieldArray({
    control: form.control,
    name: "reactions",
  })

  const onSubmit = async (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateReactionRoles(data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules.ReactionRoles = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  const emojis = useMemo(() => emojiData, [])
  const { roles } = dashboard.guild

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
          {fieldArray.fields.map((field, index) => (
            <div className="space-y-2" key={field.id}>
              <Label>Reaction {index + 1}</Label>
              <div className="flex gap-3">
                <FormField
                  key={index}
                  control={form.control}
                  name={`reactions.${index}.emoji`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <EmojiPicker emojis={emojis} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`reactions.${index}.role`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <SelectRole roles={roles} {...field} />
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
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
