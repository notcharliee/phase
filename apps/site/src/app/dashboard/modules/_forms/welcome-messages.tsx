"use client"

import Link from "next/link"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { ChannelType } from "discord-api-types/v10"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
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
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { welcomeMessagesSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof welcomeMessagesSchema>

export const WelcomeMessages = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(welcomeMessagesSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.WelcomeMessages] ?? {
      enabled: false,
      channel: "",
      message: "",
      mention: false,
      card: {
        enabled: false,
        background: undefined,
      },
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = form.watch()

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule(ModuleId.WelcomeMessages, data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.WelcomeMessages] =
            updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  const { channels } = dashboard.guild

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Channel</FormLabel>
              <FormControl>
                <SelectChannel
                  categories
                  channelType={ChannelType.GuildText}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The channel to send welcome messages to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Example: Hi **{username}**, welcome to the server! You are member #{membercount}.`}
                  autoResize
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The message to send when a new member joins
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="card"
          render={() => (
            <FormItem className="space-y-4">
              <FormField
                control={form.control}
                name="card.enabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4 space-y-1">
                      <FormLabel>Welcome Cards</FormLabel>
                      <FormDescription>
                        Whether or not to attach a welcome card (see what they
                        look like{" "}
                        <Link
                          href={"https://phasebot.xyz/api/image/welcome.png"}
                        >
                          here
                        </Link>
                        )
                      </FormDescription>
                    </div>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {field.value
                          ? "Yes, attach a welcome card"
                          : "No, don't attach a welcome card"}
                      </FormLabel>
                    </FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="card.background"
                disabled={!formFields?.card?.enabled}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={`https://placehold.co/1200x448.png`}
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value.length > 0
                              ? event.target.value
                              : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Style your welcome card with a custom background
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mention"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4 space-y-1">
                <FormLabel>Mention on join</FormLabel>
                <FormDescription>
                  Whether or not members should be pinged in the welcome message
                </FormDescription>
              </div>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {field.value
                    ? "Yes, members should be pinged"
                    : "No, members shouldn't be pinged"}
                </FormLabel>
              </FormItem>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
