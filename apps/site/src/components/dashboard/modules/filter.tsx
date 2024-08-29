import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

interface SelectFilterProps<T extends { label: string; value: string }> {
  options: T[]
  value: T["value"]
  onChange: (value: T["value"]) => void
}

export function SelectFilter<T extends { label: string; value: string }>(
  props: SelectFilterProps<T>,
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
        {props.options.map(({ label, value }) => (
          <SelectItem value={value} key={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
