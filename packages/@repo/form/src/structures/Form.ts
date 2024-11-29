import type { FormField } from "~/structures/FormField"
import type { FormFieldArray } from "~/structures/FormFieldArray"

export type FormFields<TFormName extends string | undefined = undefined> =
  (params: {
    form: Form<TFormName>
  }) => (FormField<TFormName> | FormFieldArray<TFormName>)[]

export class Form<TName extends string | undefined = undefined> {
  public readonly name: TName = undefined as TName
  public readonly label: string
  public readonly description: string
  public readonly fields: FormFields<TName>

  constructor(
    data: {
      label: string
      description: string
      fields: FormFields<TName>
    } & ({ name: TName } | {}),
  ) {
    if ("name" in data) this.name = data.name
    this.label = data.label
    this.description = data.description
    this.fields = data.fields
  }
}
