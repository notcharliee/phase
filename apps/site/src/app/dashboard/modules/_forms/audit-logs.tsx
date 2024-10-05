"use client"

import { ModuleId } from "@repo/utils/modules"
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

export const AuditLogs = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.AuditLogs}.channels`}
        render={() => {
          const baseName = `${ModuleId.AuditLogs}.channels` as const

          return (
            <FormItem className="space-y-4">
              <FormField
                control={form.control}
                name={`${baseName}.server`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for channels, roles, boosts, and emojis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${baseName}.messages`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for message deletes and edits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${baseName}.members`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for member joins, leaves and edits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${baseName}.voice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for voice channel joins, leaves, mutes, and deafens
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${baseName}.invites`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for invite creates and usage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`${baseName}.punishments`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Punishment Logs</FormLabel>
                    <FormControl>
                      <SelectChannel {...field} />
                    </FormControl>
                    <FormDescription>
                      Logs for warns, mutes, kicks, and bans
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormItem>
          )
        }}
      />
    </FormItem>
  )
}
