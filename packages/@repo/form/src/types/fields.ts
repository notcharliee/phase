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

export interface FormFieldString<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"string", TParentName, TFieldName> {
  variant: "short" | "long"
  rich?: boolean
  minLength?: number
  maxLength?: number
  placeholder?: string
}

export interface FormFieldNumber<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"number", TParentName, TFieldName> {
  minValue?: number
  maxValue?: number
  placeholder?: string
}

export interface FormFieldBoolean<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"boolean", TParentName, TFieldName> {}

export interface FormFieldEmoji<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"emoji", TParentName, TFieldName> {}

export interface FormFieldRadio<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"radio", TParentName, TFieldName> {
  items: {
    label: string
    value: string
  }[]
}

export interface FormFieldSelect<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"select", TParentName, TFieldName> {
  combobox?: boolean
  items: {
    label: string
    value: string
    disabled?: boolean
    colour?: string
    iconName?: string
  }[]
}

export interface FormFieldArray<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"array", TParentName, TFieldName> {
  fields: FormField<`${TFieldName}.$`>[]
}

export type FormField<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> =
  | FormFieldString<TParentName, TFieldName>
  | FormFieldNumber<TParentName, TFieldName>
  | FormFieldBoolean<TParentName, TFieldName>
  | FormFieldEmoji<TParentName, TFieldName>
  | FormFieldRadio<TParentName, TFieldName>
  | FormFieldSelect<TParentName, TFieldName>
  | FormFieldArray<TParentName, TFieldName>
