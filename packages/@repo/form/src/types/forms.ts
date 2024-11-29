import type { FormField } from "~/types/fields"

export type Form<TName extends string | undefined> = TName extends string
  ? {
      name: TName
      label: string
      description: string
      fields: FormField<TName>[]
    }
  : {
      label: string
      description: string
      fields: FormField[]
    }
