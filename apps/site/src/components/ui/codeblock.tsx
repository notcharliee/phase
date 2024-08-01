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
          "text-foreground bg-muted font-mono",
          inline
            ? "mx-[0.5ch] inline-block rounded-sm px-[0.3rem] py-[0.2rem] text-xs"
            : "rounded-xl p-6 text-sm",
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
