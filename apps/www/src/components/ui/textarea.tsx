import * as React from "react"

import { cn } from "~/lib/utils"

export interface TextareaProps extends React.ComponentPropsWithRef<"textarea"> {
  autoResize?: boolean
}

export function Textarea({
  ref,
  className,
  value,
  defaultValue,
  autoResize,
  onChange,
  ...props
}: TextareaProps) {
  const [textAreaValue, setTextAreaValue] = React.useState(
    value ?? defaultValue ?? "",
  )

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  React.useImperativeHandle(ref, () => textAreaRef.current!)

  React.useEffect(() => {
    const textArea = textAreaRef.current
    if (!autoResize || !textArea) return

    textArea.style.height = "0px"
    textArea.style.height = textArea.scrollHeight + 1 + "px"
  }, [textAreaRef, textAreaValue, autoResize])

  const onChangeFn = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(event.target.value)

    if (onChange) {
      onChange(event)
    }
  }

  return (
    <textarea
      value={value}
      defaultValue={defaultValue}
      ref={textAreaRef}
      onChange={onChangeFn}
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
