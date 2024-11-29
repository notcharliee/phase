import type { Form } from "~/structures/Form"
import type { FormField } from "~/structures/FormField"
import type {
  FormFieldArray as FormFieldArrayType,
  FormFieldName,
  FormFieldParentName,
} from "~/types/fields"

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
> = Omit<FormFieldArrayType<TParentName, TFieldName>, "fields"> & {
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
}
