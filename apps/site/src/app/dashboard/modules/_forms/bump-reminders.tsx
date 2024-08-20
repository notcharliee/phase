"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleId } from "@repo/config/phase/modules.ts"
import ms from "ms"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
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

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { bumpRemindersSchema } from "~/validators/modules"

import type { z } from "zod"
import { RichTextarea } from "~/components/ui/slate"

type FormValues = z.infer<typeof bumpRemindersSchema>

export const BumpReminders = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(bumpRemindersSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.BumpReminders]
      ? {
          ...dashboard.guild.modules[ModuleId.BumpReminders],
          time: ms(dashboard.guild.modules[ModuleId.BumpReminders].time, {
            long: true,
          }),
        }
      : {
          enabled: false,
          time: "",
          initialMessage: "",
          reminderMessage: "",
        },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    let newTime: number | undefined

    try {
      newTime = ms(data.time)
    } finally {
      if (newTime) {
        toast.promise(
          updateModule(ModuleId.BumpReminders, {
            ...data,
            time: newTime,
          }),
          {
            loading: "Saving changes...",
            error: "An error occured.",
            success: (updatedModuleData) => {
              form.reset(data)
              dashboard.setData((dashboardData) => {
                if (!dashboardData.guild.modules)
                  dashboardData.guild.modules = {}
                dashboardData.guild.modules[ModuleId.BumpReminders] =
                  updatedModuleData
                return dashboardData
              })
              return "Changes saved!"
            },
            finally() {
              setIsSubmitting(false)
            },
          },
        )
      } else {
        form.setError(
          "time",
          {
            type: "manual",
            message: "Invalid time format",
          },
          { shouldFocus: true },
        )

        setIsSubmitting(false)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Time</FormLabel>
              <FormControl>
                <Input placeholder="Example: 2 hours" {...field} />
              </FormControl>
              <FormDescription>
                How long to wait before reminding members
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Message</FormLabel>
              <FormControl>
                <RichTextarea
                  placeholder="Example: Thanks for bumping!"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What to send when a member first bumps
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reminderMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Message</FormLabel>
              <FormControl>
                <RichTextarea
                  placeholder="Example: It's time to bump again!"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What to send when a member is reminded to bump
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
