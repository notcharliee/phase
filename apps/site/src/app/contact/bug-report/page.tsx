"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"

import { createBugReport } from "./actions"
import { formSchema } from "./schema"

import type { FormValues } from "./schema"

export default function BugReportPage({
  searchParams,
}: Readonly<{
  searchParams: Partial<FormValues>
}>) {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | undefined
  >()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...searchParams,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setStatus("loading")

    toast.promise(createBugReport(data), {
      loading: "Submitting bug report...",
      error: () => {
        setStatus("error")
        return "An error occured. Please wait a bit and try again."
      },
      success: () => {
        setStatus("success")
        return "Bug report submitted!"
      },
    })
  }

  const disabled = status === "loading" || status === "success"

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-8 py-16">
      <div className="space-y-4 text-pretty">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Bug Report Form
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Thank you so much for taking the time to fill out this form! These
          reports help us catch bugs faster and improve the bot for everyone.
        </p>
        <p className="text-muted-foreground/75 text-xs italic sm:text-sm">
          Psst~ If you take a screenshot of yourself filling out this form and
          send it to us on Discord, we'll give you a special role! 🤍
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8 *:w-full md:flex-row">
            <FormField
              control={form.control}
              name="subject"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Example: Something broke" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give a brief description of the bug
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urgency"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Urgency <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={field.disabled}
                      name={field.name}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟦 Low</SelectItem>
                        <SelectItem value="medium">🟨 Medium</SelectItem>
                        <SelectItem value="high">🟥 High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the urgency of the bug
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="body"
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Body <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Example: Something breaks when I do X, Y, and Z"
                    autoResize
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain what went wrong and how to reproduce it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-8 *:w-full md:flex-row">
            <FormField
              control={form.control}
              name="guildId"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: 123456789012345678"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the server the bug occured in (leave blank if this
                    doesn't apply)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channelId"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: 123456789012345678"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the channel the bug occured in (leave blank if
                    this doesn't apply)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={disabled} type="submit">
            {status === "loading"
              ? "Submitting..."
              : status === "success"
                ? "Submitted!"
                : "Submit report"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
