import type {
  FormFieldBase,
  FormFieldName,
  FormFieldParentName,
} from "~/types/fields"

export interface FormFieldStringJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"string", TParentName, TFieldName> {
  variant: "short" | "long"
  rich?: boolean
  minLength?: number
  maxLength?: number
  placeholder?: string
}

export interface FormFieldNumberJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"number", TParentName, TFieldName> {
  minValue?: number
  maxValue?: number
  placeholder?: string
}

export interface FormFieldBooleanJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"boolean", TParentName, TFieldName> {}

export interface FormFieldEmojiJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"emoji", TParentName, TFieldName> {}

export interface FormFieldRadioJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"radio", TParentName, TFieldName> {
  items: {
    label: string
    value: string
  }[]
}

export interface FormFieldSelectJSON<
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

export interface FormFieldArrayJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> extends FormFieldBase<"array", TParentName, TFieldName> {
  fields: FormFieldJSON<`${TFieldName}.$`>[]
}

export type FormFieldJSON<
  TParentName extends FormFieldParentName = undefined,
  TFieldName extends FormFieldName<TParentName> = FormFieldName<TParentName>,
> =
  | FormFieldStringJSON<TParentName, TFieldName>
  | FormFieldNumberJSON<TParentName, TFieldName>
  | FormFieldBooleanJSON<TParentName, TFieldName>
  | FormFieldEmojiJSON<TParentName, TFieldName>
  | FormFieldRadioJSON<TParentName, TFieldName>
  | FormFieldSelectJSON<TParentName, TFieldName>
  | FormFieldArrayJSON<TParentName, TFieldName>
