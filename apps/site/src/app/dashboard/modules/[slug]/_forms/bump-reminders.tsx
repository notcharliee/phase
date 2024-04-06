"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { updateModule } from "../actions"
import { ModuleFormButtons } from "../form-buttons"
import { type ModuleFormProps } from "../form-props"

import ms from "ms"

const formSchema = z.object({
  enabled: z.boolean(),
  time: z.string().min(2).max(100),
  initialMessage: z.string().min(1).max(2048),
  reminderMessage: z.string().max(2048),
})

type FormValues = z.infer<typeof formSchema>

export const BumpReminders = (props: ModuleFormProps<"BumpReminders">) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues
      ? {
          ...props.defaultValues,
          time: ms(props.defaultValues.time, { long: true }),
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
          updateModule("BumpReminders", {
            ...data,
            time: newTime,
          }),
          {
            loading: "Saving changes...",
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
                <Input placeholder="2 hours" {...field} />
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
                <Textarea
                  placeholder="Thanks for bumping! I'll remind you to bump again in 2 hours."
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
                <Textarea placeholder="It's time to bump again!" {...field} />
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
