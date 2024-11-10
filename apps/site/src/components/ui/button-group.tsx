export interface ButtonGroupProps extends React.ComponentPropsWithRef<"div"> {}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div
      className="flex *:rounded-none *:border-y *:border-r [&>*:first-child]:rounded-l [&>*:last-child]:rounded-r [&>*:not(:first-child)]:border-l-0"
      {...props}
    />
  )
}
