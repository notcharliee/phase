import * as React from "react"
import { useEffect, useImperativeHandle, useRef, useState } from "react"

import { cn } from "~/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, defaultValue, autoResize, onChange, ...props }, ref) => {
    const [textAreaValue, setTextAreaValue] = useState(
      value ?? defaultValue ?? "",
    )
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => textAreaRef.current!)

    useEffect(() => {
      if (!autoResize) return

      const textArea = textAreaRef.current

      if (textArea) {
        textArea.style.height = "0px"
        const scrollHeight = textArea.scrollHeight + 1
        textArea.style.height = scrollHeight + "px"
      }
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
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
