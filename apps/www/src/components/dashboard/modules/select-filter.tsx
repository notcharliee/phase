import * as React from "react"

import { moduleTags } from "@repo/utils/modules"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"

export interface FilterOption<
  T extends string = (typeof moduleTags)[number] | "None",
> {
  label: T
  value: Lowercase<T>
}

export const filterOptions: FilterOption[] = [
  {
    label: "None",
    value: "none",
  },
  ...moduleTags.map((tag) => ({
    label: tag,
    value: tag.toLowerCase() as Lowercase<typeof tag>,
  })),
]

interface FilterSelectProps<T extends FilterOption> {
  value: T["value"]
  onValueChange: (value: T["value"]) => void
}

export function SelectFilter<T extends FilterOption>({
  value,
  onValueChange,
}: FilterSelectProps<T>) {
  const name = `select-filter-${React.useId()}`

  return (
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <div className="inline-flex space-x-2 font-medium">
          <span className="text-muted-foreground">Filters:</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {filterOptions.map(({ label, value }) => (
          <SelectItem value={value} key={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
