"use client"

import { z } from "zod"
import { updateBotNickname } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, formBuilder } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
  nickname: z.string().min(1, {
    message: "Nickname must be at least 1 character.",
  }).max(32, {
    message: "Nickname cannot be longer than 32 characters.",
  }),
})


export const NicknameForm = (props: {
  defaultValues: z.TypeOf<typeof formSchema>,
}) => formBuilder({
  defaultValues: props.defaultValues,
  onSubmit: (data) => updateBotNickname(data.nickname),
  schema: formSchema,
},
({ form, data }) => (
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
))
