"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldWrapper } from "~/components/form/field/wrapper"
import { Link } from "~/components/link"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.Counters}.counters`

export const Counters = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  // const formFields = form.watch()[ModuleId.Counters]!

  return (
    <FormFieldWrapper>
      <CountersNotice />
      <FormFieldArray
        label="Counters"
        description="Counters config"
        srOnlyLabelAndDescription={true}
        maxLength={10}
        control={form.control}
        name={baseName}
        render={({ fields }) => (
          <FormFieldWrapper type={"array"}>
            {fields.map((field, index) => {
              // const nameField = formFields.counters[index]?.name
              const cardTitle = `Counter ${index + 1}`

              return (
                <FormFieldArrayCard
                  key={field.id}
                  index={index}
                  label={cardTitle}
                  control={form.control}
                  name={`${baseName}.${index}`}
                >
                  <FormFieldSelectChannel
                    label="Channel"
                    description="Where to send the counter"
                    channelType="GuildVoice"
                    control={form.control}
                    name={`${baseName}.${index}.channel`}
                  />
                  <FormFieldInput
                    label="Content"
                    description="What to display in the counter"
                    placeholder="Example: {memberCount} Members"
                    control={form.control}
                    name={`${baseName}.${index}.content`}
                  />
                </FormFieldArrayCard>
              )
            })}
            <FormFieldArrayAppendButton
              label="Add Counter"
              description="Add a new counter"
              appendValue={{
                // name: "",
                channel: "",
                content: "",
              }}
            />
          </FormFieldWrapper>
        )}
      />
    </FormFieldWrapper>
  )
}

function CountersNotice() {
  return (
    <div className="text-muted-foreground space-y-4 text-sm">
      <p>
        Counter channels are updated once every 10 minutes, so it might take a
        few moments for the changes to show up in your server.
      </p>
      <p>
        Before you start, make sure to read the{" "}
        <Link href={"/docs/modules/counters"}>documentation page</Link> for this
        module so you know what variables you can use.
      </p>
    </div>
  )
}
