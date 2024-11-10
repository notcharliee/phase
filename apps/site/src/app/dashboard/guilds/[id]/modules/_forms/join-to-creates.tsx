"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"

import type { ModulesFormValues } from "~/types/dashboard"

const baseName = `${ModuleId.JoinToCreates}`

export const JoinToCreates = () => {
  const form = useFormContext<ModulesFormValues>()

  return (
    <div className="space-y-6">
      <FormFieldSelectChannel
        label="Trigger Channel"
        description="The voice channel that triggers the module"
        channelType="GuildVoice"
        control={form.control}
        name={`${baseName}.channel`}
      />
      <FormFieldSelectChannel
        label="Category"
        description="The category to create voice channels in"
        channelType="GuildCategory"
        control={form.control}
        name={`${baseName}.category`}
      />
    </div>
  )
}
