import type { Form } from "~/structures/Form"
import type { FormField } from "~/structures/FormField"
import type { FormFieldArray } from "~/structures/FormFieldArray"

export type FormFieldType =
  | "string"
  | "number"
  | "boolean"
  | "emoji"
  | "radio"
  | "select"
  | "array"

export type FormFieldParentName = string | undefined

export type FormFieldName<TParentName extends FormFieldParentName = undefined> =
  TParentName extends string ? `${TParentName}.${string}` : string

export type FormFieldDefaultValue<TType extends FormFieldType> = {
  string: string
  number: number
  boolean: boolean
  emoji: string
  radio: string
  select: string
  array: unknown[]
}[TType]

export interface FormFieldBase<
  TType extends FormFieldType,
  TParentName extends FormFieldParentName,
  TFieldName extends FormFieldName<TParentName>,
> {
  type: TType
  name: TFieldName
  label: string
  description: string
  required?: boolean
  disabled?: boolean
  defaultValue?: FormFieldDefaultValue<TType>
}

export type FormFields<TFormName extends string | undefined = undefined> =
  (params: {
    form: Form<TFormName>
  }) => (FormField<TFormName> | FormFieldArray<TFormName>)[]
