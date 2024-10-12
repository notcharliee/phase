"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { SelectMention } from "~/components/dashboard/select/mention"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { RichTextarea } from "~/components/dashboard/richtext/textarea"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const BumpReminders = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.BumpReminders}.time`}
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
        name={`${ModuleId.BumpReminders}.initialMessage`}
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
        name={`${ModuleId.BumpReminders}.reminderMessage`}
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
              What to send in the reminder message
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.BumpReminders}.mention`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reminder Mention</FormLabel>
            <FormControl>
              <SelectMention {...field} />
            </FormControl>
            <FormDescription>
              Who to ping in the reminder message (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormItem>
  )
}
