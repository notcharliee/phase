import { moduleTags } from "@repo/config/phase/modules.ts"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export interface FilterOption {
  label: (typeof moduleTags)[number] | "None"
  value: Lowercase<(typeof moduleTags)[number]> | "none"
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
  onChange: (value: T["value"]) => void
}

export function FilterSelect<T extends FilterOption>(
  props: FilterSelectProps<T>,
) {
  return (
    <Select defaultValue={props.value} onValueChange={props.onChange}>
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
