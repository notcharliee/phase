import type { Form } from "~/structures/Form"
import type { FormField } from "~/structures/FormField"
import type { FormFieldName, FormFieldParentName } from "~/types/fields"
import type { FormFieldArrayJSON } from "~/types/json/fields"

export type FormFieldArrayParent<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> = TParentName extends `${string}.$`
  ? FormFieldArray<TParentName, TFieldName>
  : Form<TParentName>

export type FormFieldArrayFields<
  TParentName extends string,
  TFieldName extends `${TParentName}.$` = `${TParentName}.$`,
> = (params: {
  field: FormFieldArray<TFieldName>
}) => (FormField<TFieldName> | FormFieldArray<TFieldName>)[]

export type FormFieldArrayData<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> = Omit<FormFieldArrayJSON<TParentName, TFieldName>, "fields"> & {
  fields: FormFieldArrayFields<TFieldName>
}

export class FormFieldArray<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> {
  public readonly parent: FormFieldArrayParent<TParentName, TFieldName>
  public readonly data: FormFieldArrayData<TParentName, TFieldName>

  constructor(
    parent: FormFieldArrayParent<TParentName, TFieldName>,
    data: FormFieldArrayData<TParentName, TFieldName>,
  ) {
    this.parent = parent
    this.data = data
  }

  public toJSON(): FormFieldArrayJSON<TParentName, TFieldName> {
    return {
      ...this.data,
      fields: this.data
        .fields({ field: this as unknown as FormFieldArray<`${TFieldName}.$`> })
        .map((field) => field.toJSON()),
    }
  }
}
