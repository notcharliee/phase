"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldInput } from "~/components/ui/form/field/input"
import { FormFieldRichTextarea } from "~/components/ui/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"
import { FormFieldSelectMention } from "~/components/ui/form/field/select-mention"

import type { ModulesFormValues } from "~/types/dashboard"

const baseName = `${ModuleId.AutoMessages}.messages`

export function AutoMessages() {
  const form = useFormContext<ModulesFormValues>()
  const formFields = form.watch()[ModuleId.AutoMessages]!

  return (
    <FormFieldArray
      label="Auto Messages"
      description="Auto Messages config"
      srOnlyLabelAndDescription={true}
      control={form.control}
      name={baseName}
      render={({ fields, append }) => (
        <div className="space-y-4">
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
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: "",
                channel: "",
                content: "",
                interval: "",
              })
            }
          >
            Add Message
          </Button>
        </div>
      )}
    />
  )
}
