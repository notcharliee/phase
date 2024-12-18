"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldRichTextarea } from "~/components/form/field/rich-textarea"
import { FormFieldSelectMention } from "~/components/form/field/select-mention"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.BumpReminders}`

export const BumpReminders = () => {
  const form = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldWrapper>
      <FormFieldInput
        label="Reminder Time"
        description="How long to wait before reminding members"
        control={form.control}
        name={`${baseName}.time`}
      />
      <FormFieldRichTextarea
        label="Initial Message"
        description="What to send when a member first bumps"
        control={form.control}
        name={`${baseName}.initialMessage`}
      />
      <FormFieldRichTextarea
        label="Reminder Message"
        description="What to send in the reminder message"
        control={form.control}
        name={`${baseName}.reminderMessage`}
      />
      <FormFieldSelectMention
        label="Reminder Mention"
        description="Who to ping in the reminder message"
        control={form.control}
        name={`${baseName}.mention`}
      />
    </FormFieldWrapper>
  )
}
