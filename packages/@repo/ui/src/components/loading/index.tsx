import { Moon } from "~/components/moon"
import { OrbitingDots } from "~/components/orbiting-dots"

import { cn } from "~/lib/utils"

export interface LoadingProps extends React.ComponentPropsWithRef<"div"> {}

export function Loading({ className, ...props }: LoadingProps) {
  return (
    <div
      className={cn(
        "relative grid size-48 shrink-0 place-items-center sm:size-64",
        className,
      )}
      {...props}
    >
      <OrbitingDots className="absolute inset-0 size-full [animation-duration:5s]" />
      <Moon animate={true} variant={"glow"} className="absolute size-1/4" />
    </div>
  )
}
