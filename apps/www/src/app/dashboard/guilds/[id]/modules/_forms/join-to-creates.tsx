"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.JoinToCreates}`

export const JoinToCreates = () => {
  const form = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldWrapper>
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
    </FormFieldWrapper>
  )
}
