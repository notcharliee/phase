"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"

import {
  updateBotNickname,
} from "./actions"


export const BotNicknameForm = (props: { default?: string }) => {
  const FormSchema = z.object({
    nickname: z.string().min(2, {
      message: "Nickname must be at least 1 character.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nickname: props.default ?? "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    toast.success("Bot nickname updated.")

    await updateBotNickname(data.nickname)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Nickname</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <Input placeholder="Phase" {...field} />
                  <Button type="submit">Update</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
