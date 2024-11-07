import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

export const codeblockVariants = cva(
  "text-foreground bg-muted/50 border font-mono text-sm",
  {
    variants: {
      inline: {
        true: "mx-[0.25ch] inline-block rounded-[4px] px-1",
        false: "my-1 rounded px-3 py-2",
      },
    },
    defaultVariants: {
      inline: false,
    },
  },
)

export interface CodeblockProps
  extends React.ComponentPropsWithRef<"pre">,
    VariantProps<typeof codeblockVariants> {}

export function Codeblock({
  className,
  children,
  inline,
  ...props
}: CodeblockProps) {
  const Component = inline ? "span" : "pre"

  return (
    <Component
      className={cn(
        "text-foreground bg-muted/50 border font-mono text-sm",
        inline
          ? "mx-[0.25ch] inline-block rounded-[4px] px-1"
          : "my-1 rounded px-3 py-2",
        className,
      )}
      {...props}
    >
      <code>{children}</code>
    </Component>
  )
}
