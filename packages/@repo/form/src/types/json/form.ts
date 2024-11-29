import type { FormFieldJSON } from "~/types/json/fields"

export interface FormJSON {
  name?: string
  label: string
  description: string
  fields: FormFieldJSON[]
}
