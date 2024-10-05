"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { RichTextarea } from "~/components/dashboard/richtext/textarea"
import { SelectChannel } from "~/components/dashboard/select/channel"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export const WelcomeMessages = () => {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.WelcomeMessages]!

  return (
    <FormItem className="space-y-8">
      <FormField
        control={form.control}
        name={`${ModuleId.WelcomeMessages}.channel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Welcome Channel</FormLabel>
            <FormControl>
              <SelectChannel {...field} />
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
        name={`${ModuleId.WelcomeMessages}.message`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Welcome Message</FormLabel>
            <FormControl>
              <RichTextarea
                placeholder={`Example: Hi **{username}**, welcome to the server! You are member #{membercount}.`}
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
        name={`${ModuleId.WelcomeMessages}.card`}
        render={() => {
          const baseName = `${ModuleId.WelcomeMessages}.card`

          return (
            <FormItem className="space-y-4">
              <FormField
                control={form.control}
                name={`${baseName}.enabled`}
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4 space-y-1">
                      <FormLabel>Welcome Cards</FormLabel>
                      <FormDescription>
                        Whether or not to attach a welcome card
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
                name={`${baseName}.background`}
                disabled={!formFields?.card?.enabled}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`https://placehold.co/1200x448.png`}
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
          )
        }}
      />
      <FormField
        control={form.control}
        name={`${ModuleId.WelcomeMessages}.mention`}
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
    </FormItem>
  )
}
