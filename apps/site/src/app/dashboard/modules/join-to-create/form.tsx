"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"

import { ChannelType } from "discord-api-types/v10"

import type {
  GuildChannelType,
  APIGuildChannel,
} from "discord-api-types/v10"

import { updateModule } from "@/lib/actions"

import { Button } from "@/components/ui/button"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  formBuilder,
} from "@/components/ui/form"

import { Label } from "@/components/ui/label"

import {
  ChannelSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"


const formSchema = z.object({
  enabled: z.boolean(),
  channel: z.string(),
  category: z.string(),
})


export const ModuleForm = (props: {
  defaultValues: z.TypeOf<typeof formSchema>,
  data: {
    channels: APIGuildChannel<GuildChannelType>[],
  },
}) => {
  const channels = props.data.channels
  const router = useRouter()

  return formBuilder({
    defaultValues: props.defaultValues,
    onSubmit: (data) => updateModule("JoinToCreates", data),
    schema: formSchema,
  },
  ({ form }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Channel</FormLabel>
              <FormControl>
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildVoice} showCategories />
              </FormControl>
              <FormDescription>This will be used to trigger the module</FormDescription>
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
                <ChannelSelect channels={channels} field={field} type={ChannelType.GuildCategory} />
              </FormControl>
              <FormDescription>This is where the temporary channels will be created</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" className="mr-3">Save Changes</Button>
      <Button type="reset" variant={"destructive"} onClick={() => router.back()}>Discard Changes</Button>
    </div>
  ))
}


export const ModuleFormFallback = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Trigger Channel</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">This will be used to trigger the module</p>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <SelectFallback />
        <p className="text-sm text-muted-foreground">This is where the temporary channels will be created</p>
      </div>
    </div>
    <Button type="submit" className="mr-3">Save Changes</Button>
    <Button type="reset" variant={"destructive"}>Discard Changes</Button>
  </div>
)