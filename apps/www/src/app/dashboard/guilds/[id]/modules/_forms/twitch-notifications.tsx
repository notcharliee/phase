"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSelectMention } from "~/components/form/field/select-mention"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = ModuleId.TwitchNotifications

export const TwitchNotifications = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch(baseName)!

  return (
    <FormFieldArray
      label="Streamers"
      description="The streamers you want notifications for"
      srOnlyLabelAndDescription={true}
      maxLength={5}
      control={form.control}
      name={`${baseName}.streamers`}
      render={({ fields }) => (
        <FormFieldWrapper type={"array"}>
          {fields.map((field, index) => {
            const streamerBaseName = `${baseName}.streamers.${index}` as const

            const idField = formFields.streamers[index]?.id
            const cardTitle = idField?.length
              ? idField
              : `Streamer ${index + 1}`

            return (
              <FormFieldArrayCard
                key={field.id}
                index={index}
                label={cardTitle}
                control={form.control}
                name={streamerBaseName}
              >
                <FormFieldInput
                  label="Streamer ID"
                  description="The ID of the streamer"
                  placeholder="Example: sirphase45"
                  control={form.control}
                  name={`${streamerBaseName}.id`}
                />
                <FormFieldSelectChannel
                  label="Channel"
                  description="The channel to send notifications to"
                  control={form.control}
                  name={`${streamerBaseName}.channel`}
                />
                <FormFieldSelectMention
                  label="Mention"
                  description="Who to ping when the streamer goes live"
                  control={form.control}
                  name={`${streamerBaseName}.mention`}
                />
              </FormFieldArrayCard>
            )
          })}
          <FormFieldArrayAppendButton
            label="Add Streamer"
            description="Add a new streamer"
            appendValue={{
              id: "",
              channel: "",
              mention: undefined,
            }}
          />
        </FormFieldWrapper>
      )}
    />
  )
}
