"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  ChannelType,
  type GuildChannelType,
  type APIGuildChannel,
} from "discord-api-types/v10"

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
import { SelectChannel } from "../../components/select/channel"
import { toast } from "sonner"

import { updateModule } from "@/lib/actions"

const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string(),
  category: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface ModuleFormProps {
  defaultValues: FormValues
  data: {
    channels: APIGuildChannel<GuildChannelType>[]
  }
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
    
    toast.promise(updateModule("JoinToCreates", data), {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "An error occured.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Channel</FormLabel>
              <FormControl>
                {props.fallback ? (
                  <SelectChannel fallback />
                ) : (
                  <SelectChannel
                    categories
                    channelType={ChannelType.GuildVoice}
                    channels={props.data.channels}
                    {...field}
                  />
                )}
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {props.fallback ? (
                  <SelectChannel fallback />
                ) : (
                  <SelectChannel
                    channelType={ChannelType.GuildCategory}
                    channels={props.data.channels}
                    {...field}
                  />
                )}
              </FormControl>
              <FormDescription>
                The category where temporary channels will be created
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
