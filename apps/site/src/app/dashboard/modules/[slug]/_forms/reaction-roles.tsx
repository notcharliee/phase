"use client"

import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { TrashIcon } from "@radix-ui/react-icons"

import emojiData from "@emoji-mart/data"

import { SelectRole } from "@/app/dashboard/components/select/role"
import { EmojiPicker } from "@/components/emoji-picker"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { updateModule, updateReactions } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

const formSchema = z.object({
  enabled: z.boolean(),
  messageUrl: z
    .string()
    .url()
    .refine(
      (url) => {
        const discordChannelRegex =
          /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/
        return discordChannelRegex.test(url)
      },
      {
        message: "URL does not match the Discord message URL pattern",
      },
    ),
  reactions: z
    .array(
      z.object({
        emoji: z.string().emoji().min(1, {
          message: "Emoji is required",
        }),
        role: z.string().min(1, {
          message: "Role is required",
        }),
      }),
    )
    .max(20),
})

type FormValues = z.infer<typeof formSchema>

export const ReactionRoles = (props: ModuleFormProps<"ReactionRoles">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues
      ? {
          ...props.defaultValues,
          messageUrl: `https://discord.com/channels/${props.data.guild.id}/${props.defaultValues.channel}/${props.defaultValues.message}`,
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
    const url = new URL(data.messageUrl).pathname.split("/")

    data.enabled = true

    setIsSubmitting(true)

    const { enabled, reactions } = data
    const channel = url[3]!
    const message = url[4]!

    toast.promise(
      updateModule("ReactionRoles", {
        enabled,
        channel,
        message,
        reactions,
      }),
      {
        loading: "Saving changes...",
        success: () => {
          setTimeout(() => {
            toast.promise(
              updateReactions(
                channel,
                message,
                reactions.map((r) => r.emoji),
              ),
              {
                loading: "Updating reactions...",
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
          }, 500)

          return "Changes saved!"
        },
        error: () => {
          setIsSubmitting(false)
          return "An error occured."
        },
      },
    )
  }

  const emojis = useMemo(() => emojiData, [])
  const roles = props.data.guild.roles

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
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
