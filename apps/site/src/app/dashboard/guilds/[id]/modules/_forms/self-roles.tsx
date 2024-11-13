import { ModuleId } from "@repo/utils/modules"
import { capitalCase } from "change-case"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { FormFieldArray } from "~/components/ui/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/ui/form/field/array-append-button"
import { FormFieldArrayAppendSelect } from "~/components/ui/form/field/array-append-select"
import { FormFieldArrayCard } from "~/components/ui/form/field/array-card"
import { FormFieldEmojiPicker } from "~/components/ui/form/field/emoji-picker"
import { FormFieldInput } from "~/components/ui/form/field/input"
import { FormFieldRichTextarea } from "~/components/ui/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/ui/form/field/select-channel"
import { FormFieldSelectRole } from "~/components/ui/form/field/select-role"
import { FormFieldWrapper } from "~/components/ui/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.SelfRoles}.messages`

export function SelfRoles() {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.SelfRoles]!

  const appendValue = (type: (typeof formFields.messages)[number]["type"]) => {
    return () =>
      ({
        id: randomUUID(),
        type,
        name: `Message ${formFields.messages.length + 1}`,
        channel: "",
        content: "",
        multiselect: false,
        methods: [],
      }) satisfies (typeof formFields.messages)[number]
  }

  return (
    <FormFieldArray
      label="Messages"
      description="The messages to send when a member performs a self-role"
      srOnlyLabelAndDescription={true}
      maxLength={10}
      control={form.control}
      name={baseName}
      render={({ fields }) => (
        <FormFieldWrapper type={"array"}>
          {fields.map(({ id: messageId }, messageIndex) => {
            const messageField = formFields.messages[messageIndex]!

            const nameField = messageField.name
            const typeField = messageField.type

            const messageCardTitle = nameField?.length
              ? nameField
              : `Message ${messageIndex + 1}`

            return (
              <FormFieldArrayCard
                key={messageId}
                index={messageIndex}
                label={messageCardTitle}
                control={form.control}
                name={`${baseName}.${messageIndex}`}
              >
                <FormFieldInput
                  label="Name"
                  description="The name of the message"
                  placeholder="Example: Colour Roles"
                  control={form.control}
                  name={`${baseName}.${messageIndex}.name`}
                />
                <FormFieldSelectChannel
                  label="Channel"
                  description="Where to send the message"
                  control={form.control}
                  name={`${baseName}.${messageIndex}.channel`}
                />
                <FormFieldRichTextarea
                  label="Content"
                  description="The content of the message"
                  placeholder="Example: Pick a colour role!"
                  control={form.control}
                  name={`${baseName}.${messageIndex}.content`}
                />
                <FormFieldArray
                  label={capitalCase(typeField ?? "Method") + "s"}
                  description="The methods to assign to the message"
                  maxLength={20}
                  control={form.control}
                  name={`${baseName}.${messageIndex}.methods`}
                  render={({ fields }) => (
                    <FormFieldWrapper type={"array"}>
                      {fields.map(({ id: methodId }, methodIndex) => {
                        const methodField = messageField.methods[methodIndex]!

                        const labelField =
                          "label" in methodField ? methodField.label : undefined

                        const methodCardTitle = labelField?.length
                          ? labelField
                          : `${capitalCase(typeField ?? "Method")} ${methodIndex + 1}`

                        return (
                          <FormFieldArrayCard
                            key={methodId}
                            index={methodIndex}
                            label={methodCardTitle}
                            control={form.control}
                            name={`${baseName}.${messageIndex}.methods.${methodIndex}`}
                          >
                            {messageField.type === "reaction" ? (
                              <FormFieldEmojiPicker
                                label="Emoji"
                                description={`The emoji to react with`}
                                size="fill"
                                control={form.control}
                                name={`${baseName}.${messageIndex}.methods.${methodIndex}.emoji`}
                              />
                            ) : (
                              <FormFieldInput
                                label="Label"
                                description={`The label for the ${typeField}`}
                                placeholder="Example: Click me!"
                                control={form.control}
                                name={`${baseName}.${messageIndex}.methods.${methodIndex}.label`}
                              />
                            )}
                            <FormFieldSelectRole
                              label="Roles to Add"
                              description={`The roles to add when the ${typeField} is used`}
                              multiselect={true}
                              control={form.control}
                              name={`${baseName}.${messageIndex}.methods.${methodIndex}.rolesToAdd`}
                            />
                            <FormFieldSelectRole
                              label="Roles to Remove"
                              description={`The roles to remove when the ${typeField} is used`}
                              multiselect={true}
                              control={form.control}
                              name={`${baseName}.${messageIndex}.methods.${methodIndex}.rolesToRemove`}
                            />
                          </FormFieldArrayCard>
                        )
                      })}
                      <FormFieldArrayAppendButton
                        label={`Add ${capitalCase(typeField ?? "Method")}`}
                        description={`Add a new ${typeField ?? "method"}`}
                        appendValue={() => ({
                          id: randomUUID(),
                          rolesToAdd: [],
                          rolesToRemove: [],
                          ...(typeField === "reaction"
                            ? { emoji: "" }
                            : { label: "" }),
                        })}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </FormFieldArrayCard>
            )
          })}
          <FormFieldArrayAppendSelect
            label="Add Message"
            description="Add a new message"
            items={[
              {
                label: "Reaction Based",
                description: "Add a reaction-based message",
                value: "reaction",
                appendValue: appendValue("reaction"),
              },
              {
                label: "Button Based",
                description: "Add a button-based message",
                value: "button",
                appendValue: appendValue("button"),
              },
              {
                label: "Dropdown Based",
                description: "Add a dropdown-based message",
                value: "dropdown",
                appendValue: appendValue("dropdown"),
              },
            ]}
          />
        </FormFieldWrapper>
      )}
    />
  )
}
