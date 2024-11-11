"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldInput } from "~/components/ui/form/field/input"
import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"
import { Link } from "~/components/ui/link"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.Counters}.counters`

export const Counters = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.Counters]!

  return (
    <div className="space-y-6">
      <CountersNotice />
      <FormFieldArray
        label="Counters"
        description="Counters config"
        srOnlyLabelAndDescription={true}
        control={form.control}
        name={baseName}
        render={({ fields, append }) => (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const nameField = formFields.counters[index]?.name
              const cardTitle = nameField?.length
                ? nameField
                : `Counter ${index + 1}`

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
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  channel: "",
                  content: "",
                })
              }
            >
              Add Counter
            </Button>
          </div>
        )}
      />
    </div>
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
