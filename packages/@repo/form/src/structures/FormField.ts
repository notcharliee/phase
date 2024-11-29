import type { Form } from "~/structures/Form"
import type { FormFieldArray } from "~/structures/FormFieldArray"
import type {
  FormFieldName,
  FormFieldParentName,
  FormField as FormFieldType,
} from "~/types/fields"

export type FormFieldParent<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> = TParentName extends `${string}.$`
  ? FormFieldArray<TParentName, TFieldName>
  : Form<TParentName>

export type FormFieldData<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> =
  | Exclude<FormFieldType<TParentName, TFieldName>, { type: "array" }>
  | FormFieldArray<TParentName, TFieldName>

export class FormField<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> {
  public readonly parent: FormFieldParent<TParentName, TFieldName>
  public readonly data: FormFieldData<TParentName, TFieldName>

  constructor(
    parent: FormFieldParent<TParentName, TFieldName>,
    data: FormFieldData<TParentName, TFieldName>,
  ) {
    this.parent = parent
    this.data = data
  }
}
