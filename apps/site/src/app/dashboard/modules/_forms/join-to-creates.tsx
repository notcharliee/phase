"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
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

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { z } from "zod"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { joinToCreatesSchema } from "~/validators/modules"

type FormValues = z.infer<typeof joinToCreatesSchema>

export const JoinToCreates = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(joinToCreatesSchema),
    defaultValues: dashboard.guild.modules?.JoinToCreates ?? {
      enabled: false,
      channel: "",
      category: "",
      active: [],
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule("JoinToCreates", data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules.JoinToCreates = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })

    form.reset(data)
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
              <FormLabel>Trigger Channel</FormLabel>
              <FormControl>
                <SelectChannel
                  categories
                  channelType={ChannelType.GuildVoice}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The channel that members join to trigger the module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <SelectChannel
                  channelType={ChannelType.GuildCategory}
                  channels={channels}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The category where temporary channels will be created
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
