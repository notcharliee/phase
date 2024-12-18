"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldRichTextarea } from "~/components/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSwitch } from "~/components/form/field/switch"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = ModuleId.WelcomeMessages

export const WelcomeMessages = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch(baseName)!

  return (
    <FormFieldWrapper>
      <FormFieldSelectChannel
        label="Channel"
        description="Where to send welcome messages"
        control={form.control}
        name={`${baseName}.channel`}
      />
      <FormFieldRichTextarea
        label="Content"
        description="What to put in welcome messages"
        placeholder="Example: Welcome to the server!"
        control={form.control}
        name={`${baseName}.message`}
      />
      <FormFieldSwitch
        label="Mention"
        description="Whether or not to ping members in welcome messages"
        control={form.control}
        name={`${baseName}.mention`}
      />
      <FormFieldSwitch
        label="Card"
        description="Whether or not to attach a welcome card to welcome messages"
        control={form.control}
        name={`${baseName}.card.enabled`}
      />
      <FormFieldInput
        label="Card Image URL"
        description="What background image to use for the welcome card"
        placeholder="Example: https://example.com/image.png"
        disabled={!formFields?.card?.enabled}
        control={form.control}
        name={`${baseName}.card.background`}
      />
    </FormFieldWrapper>
  )
}
