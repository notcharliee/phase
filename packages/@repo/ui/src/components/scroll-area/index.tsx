import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "~/lib/utils"

export interface ScrollAreaProps
  extends React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.Root> {}

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

export interface ScrollBarProps
  extends React.ComponentPropsWithRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {}

export function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}
