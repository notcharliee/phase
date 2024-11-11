"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { Button } from "~/components/ui/button"
import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldInput } from "~/components/ui/form/field/input"
import { FormFieldRichTextarea } from "~/components/ui/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"
import { FormFieldSelectRadio } from "~/components/ui/form/field/select-radio"
import { FormFieldSelectRole } from "~/components/ui/form/field/select-role"
import { FormFieldSwitch } from "~/components/ui/form/field/switch"

import type { ModulesFormValuesInput } from "~/types/dashboard"

export const Levels = () => {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.Levels]!

  return (
    <div className="space-y-6">
      <FormFieldRichTextarea
        label="Message"
        description="The message to send on member level-ups"
        placeholder="Example: {member} you are now level {member.level} 🎉"
        control={form.control}
        name={`${ModuleId.Levels}.message`}
      />
      <FormFieldSelectRadio
        label="Reply Type"
        description="How to send level-up messages"
        control={form.control}
        name={`${ModuleId.Levels}.replyType`}
        items={[
          { label: "Send a direct message", value: "dm" },
          { label: "Send a reply in the same channel", value: "reply" },
          { label: "Send a message to another channel", value: "channel" },
        ]}
      />
      <FormFieldSelectChannel
        label="Channel"
        description={`Where to send level-up messages ${formFields.replyType !== "channel" ? "(disabled due to reply type)" : ""}`}
        disabled={formFields.replyType !== "channel"}
        control={form.control}
        name={`${ModuleId.Levels}.channel`}
      />
      <FormFieldSwitch
        label="Mention"
        description="Whether or not members should be pinged on level-ups"
        control={form.control}
        name={`${ModuleId.Levels}.mention`}
      />
      <FormFieldArray
        label="Role Rewards"
        description="Assign roles to members when they reach a new milestones"
        control={form.control}
        name={`${ModuleId.Levels}.roles`}
        render={({ fields, append }) => (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const levelField = formFields.roles[index]?.level
              const cardLabel = `Level ${levelField ?? ""} Reward`

              return (
                <FormFieldArrayCard
                  key={field.id}
                  index={index}
                  label={cardLabel}
                  control={form.control}
                  name={`${ModuleId.Levels}.roles.${index}`}
                >
                  <FormFieldInput
                    label="Level Target"
                    description="The target milestone for this role"
                    placeholder="Example: 5"
                    type="number"
                    control={form.control}
                    name={`${ModuleId.Levels}.roles.${index}.level`}
                  />
                  <FormFieldSelectRole
                    label="Role Reward"
                    description="The role to assign when the target is reached"
                    control={form.control}
                    name={`${ModuleId.Levels}.roles.${index}.role`}
                  />
                </FormFieldArrayCard>
              )
            })}
            <Button
              type="button"
              variant="outline"
              disabled={fields.length >= 100}
              onClick={() =>
                append({
                  role: "",
                  level: (formFields.roles[fields.length - 1]?.level ?? 0) + 5,
                })
              }
            >
              Add Role Reward
            </Button>
          </div>
        )}
      />
      <FormFieldInput
        label="Card Image URL"
        description="The background image for the level-up card"
        placeholder="https://example.com/image.png"
        control={form.control}
        name={`${ModuleId.Levels}.background`}
      />
    </div>
  )
}
