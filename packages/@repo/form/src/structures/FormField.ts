import type { Form } from "~/structures/Form"
import type { FormFieldArray } from "~/structures/FormFieldArray"
import type { FormFieldName, FormFieldParentName } from "~/types/fields"
import type { FormFieldJSON } from "~/types/json/fields"

export type FormFieldParent<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> = TParentName extends `${string}.$`
  ? FormFieldArray<TParentName, TFieldName>
  : Form<TParentName>

export class FormField<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> {
  public readonly parent: FormFieldParent<TParentName, TFieldName>
  public readonly data: FormFieldJSON<TParentName, TFieldName>

  constructor(
    parent: FormFieldParent<TParentName, TFieldName>,
    data: FormFieldJSON<TParentName, TFieldName>,
  ) {
    this.parent = parent
    this.data = data
  }

  public toJSON() {
    return this.data
  }
}
