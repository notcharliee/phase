import type { FormFields } from "~/types/fields"
import type { FormJSON } from "~/types/json/form"

export class Form<TName extends string | undefined = undefined> {
  public readonly name: TName
  public readonly label: string
  public readonly description: string
  public readonly fields: FormFields<TName>

  constructor(params: {
    name?: TName
    label: string
    description: string
    fields: FormFields<TName>
  }) {
    this.name = params.name as TName
    this.label = params.label
    this.description = params.description
    this.fields = params.fields
  }

  public toJSON(): FormJSON {
    return {
      name: this.name,
      label: this.label,
      description: this.description,
      fields: this.fields({ form: this }).map((field) => field.toJSON()),
    }
  }
}
