import { forwardRef } from "react"

import { cn } from "~/lib/utils"

interface CodeblockProps extends React.HTMLAttributes<HTMLPreElement> {
  inline?: boolean
}

export const Codeblock = forwardRef<HTMLPreElement, CodeblockProps>(
  ({ className, children, inline, ...props }, ref) => {
    const Component = inline ? "span" : "pre"

    return (
      <Component
        className={cn(
          "text-foreground bg-muted/50 border font-mono text-sm",
          inline
            ? "mx-[0.25ch] inline-block rounded-[4px] px-1 "
            : "my-1 rounded px-3 py-2 ",
          className,
        )}
        ref={ref}
        {...props}
      >
        <code>{children}</code>
      </Component>
    )
  },
)
Codeblock.displayName = "Codeblock"
