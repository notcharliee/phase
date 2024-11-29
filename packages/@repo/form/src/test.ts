import { Form } from "~/structures/Form"
import { FormField } from "~/structures/FormField"
import { FormFieldArray } from "~/structures/FormFieldArray"

new Form({
  name: "test",
  label: "test form",
  description: "test form description",
  fields: ({ form }) => [
    new FormField(form, {
      type: "string",
      name: "test.string",
      label: "string field",
      description: "string field description",
      variant: "short",
    }),
    new FormFieldArray(form, {
      type: "array",
      name: "test.array",
      label: "array of fields",
      description: "array of fields description",
      fields: ({ field }) => [
        new FormField(field, {
          type: "string",
          name: "test.array.$.string",
          label: "nested string field",
          description: "nested string field description",
          variant: "short",
        }),
        new FormFieldArray(field, {
          type: "array",
          name: "test.array.$.array",
          label: "nested array of fields",
          description: "nested array of fields description",
          fields: ({ field }) => [
            new FormField(field, {
              type: "string",
              name: "test.array.$.array.$.string",
              label: "double nested string field",
              description: "double nested string field description",
              variant: "short",
            }),
          ],
        }),
      ],
    }),
  ],
})
