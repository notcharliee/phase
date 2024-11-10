import { cn } from "~/lib/utils"

export interface ButtonGroupProps extends React.ComponentPropsWithRef<"div"> {}

export function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex *:rounded-none *:border-y *:border-r [&>*:first-child]:rounded-l [&>*:last-child]:rounded-r [&>*:not(:first-child)]:border-l-0",
        className,
      )}
      {...props}
    />
  )
}
