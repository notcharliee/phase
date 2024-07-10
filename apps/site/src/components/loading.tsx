import { cn } from "~/lib/utils"

import { Moon } from "./moon"
import { OrbitingDots } from "./orbiting-dots"

interface LoadingProps extends React.ComponentPropsWithoutRef<"div"> {}

export const Loading = ({ className, ...props }: LoadingProps) => {
  return (
    <div
      className={cn(
        "relative grid h-48 w-48 place-items-center sm:h-64 sm:w-64",
        className,
      )}
      {...props}
    >
      <OrbitingDots
        className="absolute max-h-full min-h-0 min-w-0 max-w-full brightness-200"
        svgClassName="w-full h-full max-h-none lg:w-full [animation-duration:5s]"
      />
      <Moon className="shadow-glow-sm shadow-foreground absolute h-1/3 w-1/3 animate-spin rounded-full [animation-duration:1.5s]" />
    </div>
  )
}
