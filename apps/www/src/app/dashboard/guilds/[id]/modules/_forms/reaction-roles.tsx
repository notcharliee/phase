"use client"

import { ModuleId } from "@repo/utils/modules"
import { useFormContext } from "react-hook-form"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldEmojiPicker } from "~/components/form/field/emoji-picker"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldSelectRole } from "~/components/form/field/select-role"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import { getOrdinal } from "~/lib/utils"

import type { ModulesFormValuesInput } from "~/types/dashboard"

export const ReactionRoles = () => {
  const form = useFormContext<ModulesFormValuesInput>()

  return (
    <FormFieldWrapper>
      <FormFieldInput
        label="Message URL"
        description="The URL of your reaction role message"
        placeholder="https://discord.com/channels/{guild}/{channel}/{message}"
        control={form.control}
        name={`${ModuleId.ReactionRoles}.messageUrl`}
      />
      <FormFieldArray
        label="Reactions"
        description="The reactions you want members to use"
        maxLength={20}
        control={form.control}
        name={`${ModuleId.ReactionRoles}.reactions`}
        render={({ fields }) => (
          <FormFieldWrapper type={"array"}>
            {fields.map((field, index) => (
              <FormFieldArrayCard
                key={field.id}
                index={index}
                label={`Reaction ${index + 1}`}
                description={`The ${getOrdinal(index + 1)} reaction in the message`}
                control={form.control}
                name={`${ModuleId.ReactionRoles}.reactions.${index}`}
              >
                <FormFieldEmojiPicker
                  label="Emoji"
                  description="The emoji to react with"
                  size="fill"
                  control={form.control}
                  name={`${ModuleId.ReactionRoles}.reactions.${index}.emoji`}
                />
                <FormFieldSelectRole
                  label="Role"
                  description="The role to assign when the emoji is used"
                  control={form.control}
                  name={`${ModuleId.ReactionRoles}.reactions.${index}.role`}
                />
              </FormFieldArrayCard>
            ))}
            <FormFieldArrayAppendButton
              label="Add Reaction"
              description="Adds a reaction to the message"
              appendValue={{ emoji: "🌒", role: "" }}
            />
          </FormFieldWrapper>
        )}
      />
    </FormFieldWrapper>
  )
}
