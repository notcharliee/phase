"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldRichTextarea } from "~/components/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSelectMention } from "~/components/form/field/select-mention"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.AutoMessages}.messages`

export function AutoMessages() {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.AutoMessages]!

  return (
    <FormFieldArray
      label="Auto Messages"
      description="Auto Messages config"
      srOnlyLabelAndDescription={true}
      maxLength={10}
      control={form.control}
      name={baseName}
      render={({ fields }) => (
        <FormFieldWrapper type={"array"}>
          {fields.map((field, index) => {
            const nameField = formFields.messages[index]?.name
            const cardTitle = nameField?.length
              ? nameField
              : `Auto Message ${index + 1}`

            return (
              <FormFieldArrayCard
                key={field.id}
                index={index}
                label={cardTitle}
                control={form.control}
                name={`${baseName}.${index}`}
              >
                <FormFieldInput
                  label="Name"
                  description="What to call the message"
                  placeholder="Example: Spanish or vanish"
                  control={form.control}
                  name={`${baseName}.${index}.name`}
                />
                <FormFieldRichTextarea
                  label="Content"
                  description="What to put in the message"
                  placeholder="Example: Do your daily duolingo lesson."
                  control={form.control}
                  name={`${baseName}.${index}.content`}
                />
                <FormFieldSelectChannel
                  label="Channel"
                  description="Where to send the message"
                  control={form.control}
                  name={`${baseName}.${index}.channel`}
                />
                <FormFieldInput
                  label="Interval"
                  description="How often the message should be sent"
                  placeholder="Example: 1 day"
                  control={form.control}
                  name={`${baseName}.${index}.interval`}
                />
                <FormFieldSelectMention
                  label="Mention"
                  description="Who to ping when the message is sent"
                  control={form.control}
                  name={`${baseName}.${index}.mention`}
                />
              </FormFieldArrayCard>
            )
          })}
          <FormFieldArrayAppendButton
            label="Add Message"
            description="Add a new auto message"
            appendValue={{
              name: "",
              channel: "",
              content: "",
              interval: "",
            }}
          />
        </FormFieldWrapper>
      )}
    />
  )
}
