"use client"

import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFormContext } from "react-hook-form"

import { SelectChannel } from "~/components/dashboard/select/channel"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const JoinToCreates = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.JoinToCreates}.channel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trigger Channel</FormLabel>
            <FormControl>
              <SelectChannel channelType="GuildVoice" {...field} />
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
        name={`${ModuleId.JoinToCreates}.category`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <SelectChannel channelType="GuildCategory" {...field} />
            </FormControl>
            <FormDescription>
              The category where temporary channels will be created
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormItem>
  )
}
