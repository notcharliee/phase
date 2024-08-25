"use client"

import Link from "next/link"
import { useState } from "react"

import { ChannelType } from "@discordjs/core/http-only"
import { zodResolver } from "@hookform/resolvers/zod"
import { TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { ModuleFormButtons } from "~/components/dashboard/modules"
import { SelectChannel } from "~/components/dashboard/select-channel"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
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

import { updateModule } from "~/app/dashboard/_actions/updateModule"
import { countersSchema } from "~/validators/modules"

import type { z } from "zod"

type FormValues = z.infer<typeof countersSchema>

export const Counters = () => {
  const dashboard = useDashboardContext()

  const form = useForm<FormValues>({
    resolver: zodResolver(countersSchema),
    defaultValues: dashboard.guild.modules?.[ModuleId.Counters] ?? {
      enabled: false,
      counters: [
        {
          name: "Counter 1",
          channel: "",
          content: "",
        },
      ],
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formFields = form.watch()

  const fieldArray = useFieldArray({
    control: form.control,
    name: "counters",
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    setIsSubmitting(true)

    toast.promise(updateModule(ModuleId.Counters, data), {
      loading: "Saving changes...",
      error: "An error occured.",
      success: (updatedModuleData) => {
        form.reset(data)
        dashboard.setData((dashboardData) => {
          if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
          dashboardData.guild.modules[ModuleId.Counters] = updatedModuleData
          return dashboardData
        })
        return "Changes saved!"
      },
      finally() {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-muted-foreground space-y-4 text-sm">
          <p>
            Counter channels are updated once every 10 minutes, so it might take
            a few moments for the changes to show up in your server.
          </p>
          <p>
            Before you start, make sure to read the{" "}
            <Link
              href={"/docs/modules/counters"}
              className="text-foreground font-medium underline underline-offset-2"
            >
              documentation page
            </Link>{" "}
            for this module so you know what variables you can use.
          </p>
        </div>
        <FormField
          control={form.control}
          name={"counters"}
          render={() => (
            <FormItem className="space-y-4">
              {fieldArray.fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                    <CardTitle>{formFields.counters[index]?.name}</CardTitle>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => fieldArray.remove(index)}
                    >
                      <Label className="sr-only">Delete Counter</Label>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 border-t pt-6">
                    <FormField
                      control={form.control}
                      name={`counters.${index}.channel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <FormControl>
                            <SelectChannel
                              channelType={ChannelType.GuildVoice}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The channel to count members in.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`counters.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Example: {memberCount} Members"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The content of the counter.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  fieldArray.append({
                    name: `Counter ${formFields.counters.length + 1}`,
                    channel: "",
                    content: "",
                  })
                }
              >
                Add Counter
              </Button>
            </FormItem>
          )}
        />
        <ModuleFormButtons form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  )
}
