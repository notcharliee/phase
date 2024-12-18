import { ModuleId } from "@repo/utils/modules"
import { capitalCase } from "change-case"
import { useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { FormFieldArray } from "~/components/form/field/array"
import { FormFieldArrayAppendButton } from "~/components/form/field/array-append-button"
import { FormFieldArrayAppendSelect } from "~/components/form/field/array-append-select"
import { FormFieldArrayCard } from "~/components/form/field/array-card"
import { FormFieldEmojiPicker } from "~/components/form/field/emoji-picker"
import { FormFieldInput } from "~/components/form/field/input"
import { FormFieldRichTextarea } from "~/components/form/field/rich-textarea"
import { FormFieldSelectChannel } from "~/components/form/field/select-channel"
import { FormFieldSelectRole } from "~/components/form/field/select-role"
import { FormFieldWrapper } from "~/components/form/field/wrapper"

import type { ModulesFormValuesInput } from "~/types/dashboard"

const baseName = `${ModuleId.SelfRoles}.messages`

export function SelfRoles() {
  const form = useFormContext<ModulesFormValuesInput>()
  const formFields = form.watch()[ModuleId.SelfRoles]!

  type Message = (typeof formFields.messages)[number]
  type MessageType = Message["type"]

  const appendValue = (type: MessageType) => () =>
    ({
      id: randomUUID(),
      type,
      name: `Message ${formFields.messages.length + 1}`,
      channel: "",
      content: "",
      multiselect: false,
      methods: [],
    }) satisfies Message

  return (
    <FormFieldArray
      label="Messages"
      description="The messages to send when a member performs a self-role"
      srOnlyLabelAndDescription={true}
      maxLength={10}
      control={form.control}
      name={baseName}
      render={({ fields: messageFields }) => (
        <FormFieldWrapper type={"array"}>
          {messageFields.map((messageField, messageIndex) => {
            const message = formFields.messages[messageIndex]!

            const messageCardTitle = message.name?.length
              ? message.name
              : `Message ${messageIndex + 1}`

            const messageMethodName = {
              reaction: "reaction",
              button: "button",
              dropdown: "option",
            }[message.type]

            return (
              <FormFieldArrayCard
                key={messageField.id}
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
                  label={capitalCase(messageMethodName)}
                  description="The methods to assign to the message"
                  maxLength={20}
                  control={form.control}
                  name={`${baseName}.${messageIndex}.methods`}
                  render={({ fields: methodFields }) => (
                    <FormFieldWrapper type={"array"}>
                      {methodFields.map((methodField, methodIndex) => {
                        const method = message.methods[methodIndex]!

                        const labelField =
                          "label" in method ? method.label : undefined

                        const methodCardTitle = labelField?.length
                          ? labelField
                          : `${capitalCase(messageMethodName)} ${methodIndex + 1}`

                        const methodBaseName =
                          `${baseName}.${messageIndex}.methods.${methodIndex}` as const

                        return (
                          <FormFieldArrayCard
                            key={methodField.id}
                            index={methodIndex}
                            label={methodCardTitle}
                            control={form.control}
                            name={methodBaseName}
                          >
                            {message.type === "reaction" ? (
                              <FormFieldEmojiPicker
                                label="Emoji"
                                description={`The emoji to react with`}
                                size="fill"
                                control={form.control}
                                name={`${methodBaseName}.emoji`}
                              />
                            ) : (
                              <FormFieldInput
                                label="Label"
                                description={`The label for the ${messageMethodName}`}
                                placeholder="Example: Click me!"
                                control={form.control}
                                name={`${methodBaseName}.label`}
                              />
                            )}
                            <FormFieldSelectRole
                              label="Roles to Add"
                              description={`The roles to add when the ${messageMethodName} is used`}
                              multiselect={true}
                              control={form.control}
                              name={`${methodBaseName}.rolesToAdd`}
                            />
                            <FormFieldSelectRole
                              label="Roles to Remove"
                              description={`The roles to remove when the ${messageMethodName} is used`}
                              multiselect={true}
                              control={form.control}
                              name={`${methodBaseName}.rolesToRemove`}
                            />
                          </FormFieldArrayCard>
                        )
                      })}
                      <FormFieldArrayAppendButton
                        label={`Add ${capitalCase(messageMethodName)}`}
                        description={`Add a new ${messageMethodName}`}
                        appendValue={() => ({
                          id: randomUUID(),
                          rolesToAdd: [],
                          rolesToRemove: [],
                          ...(message.type === "reaction"
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
