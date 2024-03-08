"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"

import ms from "ms"

const formSchema = z.object({
  enabled: z.boolean(),
  time: z.string().min(2).max(100),
  initialMessage: z.string().min(1).max(2048),
  reminderMessage: z.string().max(2048),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
}

export const ModuleForm = <Fallback extends boolean>(
  props: Fallback extends true
    ? Partial<ModuleFormProps> & { fallback: Fallback }
    : ModuleFormProps & { fallback?: Fallback },
) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    data.enabled = true

    let newTime: number | undefined

    try {
      newTime = ms(data.time)
    } catch {
      // do nothing
    } finally {
      if (newTime) {
        toast.promise(
          updateModule("BumpReminders", {
            ...data,
            time: newTime,
          }),
          {
            loading: "Saving changes...",
            success: "Changes saved!",
            error: "An error occured.",
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
        <div className="flex space-x-3">
          <Button type="submit">Save changes</Button>
          <Button
            type="reset"
            variant={"destructive"}
            disabled={!form.formState.isDirty}
            onClick={() => form.reset(props.defaultValues)}
          >
            Undo changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
